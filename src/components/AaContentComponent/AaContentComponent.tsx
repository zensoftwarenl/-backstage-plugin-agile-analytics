/* eslint-disable no-console */
import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import {
  Content,
  InfoCard,
  StructuredMetadataTable,
  Tabs,
} from "@backstage/core-components";
import { OrganisationDataResponse } from "../../api/types";
import { AaTimeSelect } from "../AaTimeSelect";
import { getEndDate, getStartDate } from "../../helpers";
import { AaDoraPage } from "../AaDoraPage";
import { AaSprintInsightsPage } from "../AaSprintInsightsPage";
import { AaStockPage } from "../AaStockPage";
import { AaLeaksPage } from "../AaLeaksPage";
import { Alert } from "@material-ui/lab";

export const AaContentComponent = ({
  orgData,
}: {
  orgData: OrganisationDataResponse;
}) => {
  const [timeperiod, setTimeperiod] = useState({
    date_start: getStartDate(6, "days"),
    date_end: getEndDate(),
    label: "Last 7 days",
    value: "7days",
  });

  const overviewMetadata = {
    "Organisation hash": orgData.orgHash,
    "Organisation name": orgData.orgName,
    "Number of users": orgData.usersNumber,
    Status: orgData.status,
    Subscription: orgData.subscription,
  };

  const cardContentStyle = { heightX: 200, width: 600 };
  const tabs = [
    {
      label: "OVERVIEW",
      content: (
        <Grid container spacing={3} direction="column" style={cardContentStyle}>
          <Grid item>
            <InfoCard title="Organisation's Details">
              <StructuredMetadataTable metadata={overviewMetadata} />
            </InfoCard>
          </Grid>
        </Grid>
      ),
    },
    {
      label: "SPRINT INSIGHTS",
      content: (
        <Grid container spacing={3} direction="column">
          <Grid item>
            {orgData?.subscription === "enterprise-plus" ? (
              <AaSprintInsightsPage
                timeperiod={timeperiod}
                plan={orgData.subscription}
              />
            ) : (
              renderUpgradeWarning()
            )}
          </Grid>
        </Grid>
      ),
    },
    {
      label: "DORA",
      content: (
        <Grid container spacing={3} direction="column">
          <Grid item>
            {orgData?.subscription === "enterprise-plus" ? (
              <AaDoraPage timeperiod={timeperiod} plan={orgData.subscription} />
            ) : (
              renderUpgradeWarning()
            )}
          </Grid>
        </Grid>
      ),
    },
    {
      label: "STOCK",
      content: (
        <Grid container spacing={3} direction="column">
          <Grid item>
            {orgData?.subscription === "enterprise-plus" ? (
              <AaStockPage
                timeperiod={timeperiod}
                plan={orgData.subscription}
              />
            ) : (
              renderUpgradeWarning()
            )}
          </Grid>
        </Grid>
      ),
    },
    {
      label: "LEAKS",
      content: (
        <Grid container spacing={3} direction="column">
          <Grid item>
            {orgData?.subscription === "enterprise-plus" ? (
              <AaLeaksPage
                timeperiod={timeperiod}
                plan={orgData.subscription}
              />
            ) : (
              renderUpgradeWarning()
            )}
          </Grid>
        </Grid>
      ),
    },
  ];

  function renderUpgradeWarning() {
    return (
      <Alert severity="warning">
        Agile Analytics Backstage.io intagration available only for Enterprise+
        organisations.{" "}
        <a href="https://www.prod.agileanalytics.cloud/settings/organisation">
          Upgrade your plan
        </a>
      </Alert>
    );
  }

  return (
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <AaTimeSelect timeperiod={timeperiod} setTimeperiod={setTimeperiod} />
        </Grid>
        <Grid item>
          <Tabs tabs={tabs} />
        </Grid>
      </Grid>
    </Content>
  );
};
