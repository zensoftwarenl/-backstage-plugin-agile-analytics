/* eslint-disable no-console */
import React, { useState } from "react";
import { Grid, Link } from "@material-ui/core";
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
              <AaSprintInsightsPage timeperiod={timeperiod} />
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
              <AaDoraPage timeperiod={timeperiod} />
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
              <AaStockPage timeperiod={timeperiod} />
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
              <AaLeaksPage timeperiod={timeperiod} />
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
        Agile Analytics Backstage.io integration is available only for
        Enterprise+ organizations. Please{" "}
        <Link
          href="https://www.prod.agileanalytics.cloud/settings/organisation"
          underline="always"
          color="inherit"
        >
          upgrade your plan
        </Link>
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
