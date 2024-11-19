var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createApiRef } from '@backstage/core-plugin-api';
import { encodeApiKey } from '../helpers';
export const agileAnalyticsApiRef = createApiRef({
    id: 'plugin.agile-analytics.service',
});
const DEFAULT_PROXY_PATH = 'https://api.prod.agileanalytics.cloud';
function generateRequestParams(apiKey) {
    return {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': `${encodeApiKey(apiKey)}`,
            'Access-Control-Allow-Origin': '*',
        },
    };
}
function generateErrorMessage(res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if ((_a = res.statusText) === null || _a === void 0 ? void 0 : _a.length) {
            return res.statusText;
        }
        const errorText = yield res.text();
        if (errorText === null || errorText === void 0 ? void 0 : errorText.length) {
            return errorText;
        }
        if (res.status) {
            return res.status;
        }
        return 'unknown error.';
    });
}
export class AgileAnalyticsAPIClient {
    constructor(options) {
        this.proxyPath = DEFAULT_PROXY_PATH;
    }
    getOrganisationData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.proxyPath}/${options.orgHash}/settings/organisations/`, generateRequestParams(options.apiKey));
            if (!response.ok) {
                throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
            }
            const { org_hash, org_name, number_of_users, status, subscription_level } = yield response.json();
            const orgState = {
                orgHash: org_hash,
                orgName: org_name,
                usersNumber: number_of_users,
                status,
                subscription: subscription_level,
            };
            return orgState;
        });
    }
    getSiData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const limit = 50;
            let totalData = {
                featuresAmount: 0,
                notFeaturesAmount: 0,
                featuresTime: 0,
                notFeaturesTime: 0,
                tickets: [],
            };
            let offset = 0;
            let response = null;
            do {
                response = yield fetch(`${this.proxyPath}/${options.orgHash}/si/?date_start=${options.dateStart}&date_end=${options.dateEnd}&issue_key=^.*$&label=^.*$&transition_from=^.*$&transition_to=^Done$&limit=${limit}&offset=${offset}`, // &limit=50&offset=0 <--- add for pagination???
                generateRequestParams(options.apiKey));
                if (!response.ok) {
                    throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
                }
                if (response.status === 200) {
                    const { features, not_features, time_spent, tickets } = yield response.json();
                    const siState = {
                        featuresAmount: features,
                        notFeaturesAmount: not_features,
                        featuresTime: (_a = time_spent === null || time_spent === void 0 ? void 0 : time_spent.feature) !== null && _a !== void 0 ? _a : 0,
                        notFeaturesTime: (_b = time_spent === null || time_spent === void 0 ? void 0 : time_spent['not feature']) !== null && _b !== void 0 ? _b : 0,
                        tickets,
                    };
                    totalData = {
                        featuresAmount: totalData.featuresAmount + siState.featuresAmount,
                        notFeaturesAmount: totalData.notFeaturesAmount + siState.notFeaturesAmount,
                        featuresTime: totalData.featuresTime + siState.featuresTime,
                        notFeaturesTime: totalData.notFeaturesTime + siState.notFeaturesTime,
                        tickets: [...totalData.tickets, ...siState.tickets],
                    };
                    offset += limit;
                }
            } while ((response === null || response === void 0 ? void 0 : response.status) !== 204);
            return totalData;
        });
    }
    getReposData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.proxyPath}/${options.orgHash}/swarm/selected/`, generateRequestParams(options.apiKey));
            if (!response.ok) {
                throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
            }
            const reposState = yield response.json();
            return reposState;
        });
    }
    getDeploymentFreqData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.proxyPath}/${options.orgHash}/dora/deployment_frequency/?date_start=${options.dateStart}&date_end=${options.dateEnd}`, generateRequestParams(options.apiKey));
            if (!response.ok) {
                throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
            }
            const state = yield response.json();
            return state;
        });
    }
    getLeadTimeData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.proxyPath}/${options.orgHash}/dora/lead_time/?date_start=${options.dateStart}&date_end=${options.dateEnd}`, generateRequestParams(options.apiKey));
            if (!response.ok) {
                throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
            }
            const state = yield response.json();
            return state;
        });
    }
    getStockData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.proxyPath}/${options.orgHash}/stock/branches/?date_start=${options.dateStart}&date_end=${options.dateEnd}`, generateRequestParams(options.apiKey));
            if (!response.ok) {
                throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
            }
            const state = yield response.json();
            return state;
        });
    }
    getRiskChartData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let riskDataResponce = { low: 0, medium: 0, high: 0 };
            const response = yield fetch(`${this.proxyPath}/${options.orgHash}/stock/risk/?date_start=${options.dateStart}&date_end=${options.dateEnd}`, generateRequestParams(options.apiKey));
            if (!response.ok) {
                throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
            }
            const tableData = yield response.json();
            if (tableData === null || tableData === void 0 ? void 0 : tableData.length) {
                const reposData = yield Promise.allSettled(tableData.map((repo) => __awaiter(this, void 0, void 0, function* () {
                    const res = yield fetch(`${this.proxyPath}/${options.orgHash}/stock/risk/?date_start=${options.dateStart}&date_end=${options.dateEnd}
              &direction=start&sort=branch&repository=${repo.repo_name}&start=0&end=${repo.table_rows - 1}`, generateRequestParams(options.apiKey));
                    if (!res.ok) {
                        throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
                    }
                    const data = yield res.json();
                    return data;
                })));
                if (reposData.length) {
                    let status = 200;
                    if (!reposData.find(value => { var _a; return value.status === 'fulfilled' && ((_a = value === null || value === void 0 ? void 0 : value.value) === null || _a === void 0 ? void 0 : _a.length) > 0; })) {
                        status = 204;
                    }
                    riskDataResponce = reposData
                        .filter(repo => repo.status === 'fulfilled')
                        .reduce((acc, repo) => {
                        var _a, _b;
                        if ((_a = repo === null || repo === void 0 ? void 0 : repo.value) === null || _a === void 0 ? void 0 : _a.length) {
                            const repoRiskData = (_b = repo === null || repo === void 0 ? void 0 : repo.value) === null || _b === void 0 ? void 0 : _b.reduce((riskCounter, row) => {
                                switch (row.risk) {
                                    case 'highest':
                                    case 'high':
                                        return Object.assign(Object.assign({}, riskCounter), { high: riskCounter.high + 1 });
                                    case 'medium':
                                        return Object.assign(Object.assign({}, riskCounter), { medium: riskCounter.medium + 1 });
                                    case 'low':
                                    case 'lowest':
                                        return Object.assign(Object.assign({}, riskCounter), { low: riskCounter.low + 1 });
                                    default:
                                        return riskCounter;
                                }
                            }, {
                                low: 0,
                                medium: 0,
                                high: 0,
                            });
                            return {
                                low: acc.low + repoRiskData.low,
                                medium: acc.medium + repoRiskData.medium,
                                high: acc.high + repoRiskData.high,
                            };
                        }
                        return acc;
                    }, { low: 0, medium: 0, high: 0 });
                }
            }
            return riskDataResponce;
        });
    }
    getLeaksData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.proxyPath}/${options.orgHash}/security/leaks/?date_start=${options.dateStart}&date_end=${options.dateEnd}`, generateRequestParams(options.apiKey));
            if (!response.ok) {
                throw new Error(`There was a problem fetching analytics data: ${yield generateErrorMessage(response)}`);
            }
            const state = yield response.json();
            return state;
        });
    }
}
