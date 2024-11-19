import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import moment from 'moment';

function encodeApiKey(key) {
  const encoded = Buffer.from(`${key}`).toString("base64");
  return encoded;
}
function getStartDate(amount, period) {
  return moment().set({ hours: 0, minutes: 0, seconds: 0 }).subtract(amount, period).unix();
}
function getEndDate() {
  return moment().set({ hours: 23, minutes: 59, seconds: 59 }).unix();
}
function getUniqueListByParent(arr) {
  const uniqueListOfLatest = arr.reduce(
    (acc, item) => {
      const isInList = acc.find(
        (ticket) => ticket.parent.key === item.parent.key
      );
      if (isInList) {
        const isLater = item.timestamp >= isInList.timestamp;
        if (isLater) {
          return acc.map((task) => {
            if (task.parent.key === item.parent.key) {
              return item;
            }
            return task;
          });
        }
        return acc;
      }
      return [...acc, item];
    },
    []
  );
  return uniqueListOfLatest;
}

const agileAnalyticsApiRef = createApiRef({
  id: "plugin.agile-analytics.service"
});
const DEFAULT_PROXY_PATH = "https://api.prod.agileanalytics.cloud";
function generateRequestParams(apiKey) {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": `${encodeApiKey(apiKey)}`,
      "Access-Control-Allow-Origin": "*"
    }
  };
}
async function generateErrorMessage(res) {
  var _a;
  if ((_a = res.statusText) == null ? void 0 : _a.length) {
    return res.statusText;
  }
  const errorText = await res.text();
  if (errorText == null ? void 0 : errorText.length) {
    return errorText;
  }
  if (res.status) {
    return res.status;
  }
  return "unknown error.";
}
class AgileAnalyticsAPIClient {
  constructor(options) {
    this.proxyPath = DEFAULT_PROXY_PATH;
  }
  async getOrganisationData(options) {
    const response = await fetch(
      `${this.proxyPath}/${options.orgHash}/settings/organisations/`,
      generateRequestParams(options.apiKey)
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching analytics data: ${await generateErrorMessage(
          response
        )}`
      );
    }
    const { org_hash, org_name, number_of_users, status, subscription_level } = await response.json();
    const orgState = {
      orgHash: org_hash,
      orgName: org_name,
      usersNumber: number_of_users,
      status,
      subscription: subscription_level
    };
    return orgState;
  }
  async getSiData(options) {
    var _a, _b;
    const limit = 50;
    let totalData = {
      featuresAmount: 0,
      notFeaturesAmount: 0,
      featuresTime: 0,
      notFeaturesTime: 0,
      tickets: []
    };
    let offset = 0;
    let response = null;
    do {
      response = await fetch(
        `${this.proxyPath}/${options.orgHash}/si/?date_start=${options.dateStart}&date_end=${options.dateEnd}&issue_key=^.*$&label=^.*$&transition_from=^.*$&transition_to=^Done$&limit=${limit}&offset=${offset}`,
        generateRequestParams(options.apiKey)
      );
      if (!response.ok) {
        throw new Error(
          `There was a problem fetching analytics data: ${await generateErrorMessage(
            response
          )}`
        );
      }
      if (response.status === 200) {
        const { features, not_features, time_spent, tickets } = await response.json();
        const siState = {
          featuresAmount: features,
          notFeaturesAmount: not_features,
          featuresTime: (_a = time_spent == null ? void 0 : time_spent.feature) != null ? _a : 0,
          notFeaturesTime: (_b = time_spent == null ? void 0 : time_spent["not feature"]) != null ? _b : 0,
          tickets
        };
        totalData = {
          featuresAmount: totalData.featuresAmount + siState.featuresAmount,
          notFeaturesAmount: totalData.notFeaturesAmount + siState.notFeaturesAmount,
          featuresTime: totalData.featuresTime + siState.featuresTime,
          notFeaturesTime: totalData.notFeaturesTime + siState.notFeaturesTime,
          tickets: [...totalData.tickets, ...siState.tickets]
        };
        offset += limit;
      }
    } while ((response == null ? void 0 : response.status) !== 204);
    return totalData;
  }
  async getReposData(options) {
    const response = await fetch(
      `${this.proxyPath}/${options.orgHash}/swarm/selected/`,
      generateRequestParams(options.apiKey)
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching analytics data: ${await generateErrorMessage(
          response
        )}`
      );
    }
    const reposState = await response.json();
    return reposState;
  }
  async getDeploymentFreqData(options) {
    const response = await fetch(
      `${this.proxyPath}/${options.orgHash}/dora/deployment_frequency/?date_start=${options.dateStart}&date_end=${options.dateEnd}`,
      generateRequestParams(options.apiKey)
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching analytics data: ${await generateErrorMessage(
          response
        )}`
      );
    }
    const state = await response.json();
    return state;
  }
  async getLeadTimeData(options) {
    const response = await fetch(
      `${this.proxyPath}/${options.orgHash}/dora/lead_time/?date_start=${options.dateStart}&date_end=${options.dateEnd}`,
      generateRequestParams(options.apiKey)
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching analytics data: ${await generateErrorMessage(
          response
        )}`
      );
    }
    const state = await response.json();
    return state;
  }
  async getStockData(options) {
    const response = await fetch(
      `${this.proxyPath}/${options.orgHash}/stock/branches/?date_start=${options.dateStart}&date_end=${options.dateEnd}`,
      generateRequestParams(options.apiKey)
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching analytics data: ${await generateErrorMessage(
          response
        )}`
      );
    }
    const state = await response.json();
    return state;
  }
  async getRiskChartData(options) {
    let riskDataResponce = { low: 0, medium: 0, high: 0 };
    const response = await fetch(
      `${this.proxyPath}/${options.orgHash}/stock/risk/?date_start=${options.dateStart}&date_end=${options.dateEnd}`,
      generateRequestParams(options.apiKey)
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching analytics data: ${await generateErrorMessage(
          response
        )}`
      );
    }
    const tableData = await response.json();
    if (tableData == null ? void 0 : tableData.length) {
      const reposData = await Promise.allSettled(
        tableData.map(async (repo) => {
          const res = await fetch(
            `${this.proxyPath}/${options.orgHash}/stock/risk/?date_start=${options.dateStart}&date_end=${options.dateEnd}
              &direction=start&sort=branch&repository=${repo.repo_name}&start=0&end=${repo.table_rows - 1}`,
            generateRequestParams(options.apiKey)
          );
          if (!res.ok) {
            throw new Error(
              `There was a problem fetching analytics data: ${await generateErrorMessage(
                response
              )}`
            );
          }
          const data = await res.json();
          return data;
        })
      );
      if (reposData.length) {
        if (!reposData.find(
          (value) => {
            var _a;
            return value.status === "fulfilled" && ((_a = value == null ? void 0 : value.value) == null ? void 0 : _a.length) > 0;
          }
        )) ;
        riskDataResponce = reposData.filter((repo) => repo.status === "fulfilled").reduce(
          (acc, repo) => {
            var _a, _b;
            if ((_a = repo == null ? void 0 : repo.value) == null ? void 0 : _a.length) {
              const repoRiskData = (_b = repo == null ? void 0 : repo.value) == null ? void 0 : _b.reduce(
                (riskCounter, row) => {
                  switch (row.risk) {
                    case "highest":
                    case "high":
                      return {
                        ...riskCounter,
                        high: riskCounter.high + 1
                      };
                    case "medium":
                      return {
                        ...riskCounter,
                        medium: riskCounter.medium + 1
                      };
                    case "low":
                    case "lowest":
                      return {
                        ...riskCounter,
                        low: riskCounter.low + 1
                      };
                    default:
                      return riskCounter;
                  }
                },
                {
                  low: 0,
                  medium: 0,
                  high: 0
                }
              );
              return {
                low: acc.low + repoRiskData.low,
                medium: acc.medium + repoRiskData.medium,
                high: acc.high + repoRiskData.high
              };
            }
            return acc;
          },
          { low: 0, medium: 0, high: 0 }
        );
      }
    }
    return riskDataResponce;
  }
  async getLeaksData(options) {
    const response = await fetch(
      `${this.proxyPath}/${options.orgHash}/security/leaks/?date_start=${options.dateStart}&date_end=${options.dateEnd}`,
      generateRequestParams(options.apiKey)
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching analytics data: ${await generateErrorMessage(
          response
        )}`
      );
    }
    const state = await response.json();
    return state;
  }
}

const rootRouteRef = createRouteRef({
  id: "agile-analytics"
});

const agileAnalyticsPlugin = createPlugin({
  id: "agile-analytics",
  apis: [
    createApiFactory({
      api: agileAnalyticsApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new AgileAnalyticsAPIClient({ discoveryApi })
    })
  ],
  routes: {
    root: rootRouteRef
  }
});
const AgileAnalyticsPage = agileAnalyticsPlugin.provide(
  createRoutableExtension({
    name: "AgileAnalyticsPage",
    component: () => import('./index-6ea6c57d.esm.js').then((m) => m.AaMainComponent),
    mountPoint: rootRouteRef
  })
);

export { AgileAnalyticsPage as A, getEndDate as a, agileAnalyticsApiRef as b, getUniqueListByParent as c, agileAnalyticsPlugin as d, getStartDate as g };
//# sourceMappingURL=index-1d398611.esm.js.map
