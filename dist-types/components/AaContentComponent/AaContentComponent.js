/* eslint-disable no-console */
import React, { useState } from "react";
import { Grid, Link } from "@material-ui/core";
import { Content, InfoCard, StructuredMetadataTable, Tabs, } from "@backstage/core-components";
import { AaTimeSelect } from "../AaTimeSelect";
import { getEndDate, getStartDate } from "../../helpers";
import { AaDoraPage } from "../AaDoraPage";
import { AaSprintInsightsPage } from "../AaSprintInsightsPage";
import { AaStockPage } from "../AaStockPage";
import { AaLeaksPage } from "../AaLeaksPage";
import { Alert } from "@material-ui/lab";
export const AaContentComponent = ({ orgData, }) => {
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
            content: (React.createElement(Grid, { container: true, spacing: 3, direction: "column", style: cardContentStyle },
                React.createElement(Grid, { item: true },
                    React.createElement(InfoCard, { title: "Organisation's Details" },
                        React.createElement(StructuredMetadataTable, { metadata: overviewMetadata }))))),
        },
        {
            label: "SPRINT INSIGHTS",
            content: (React.createElement(Grid, { container: true, spacing: 3, direction: "column" },
                React.createElement(Grid, { item: true }, (orgData === null || orgData === void 0 ? void 0 : orgData.subscription) === "enterprise-plus" ? (React.createElement(AaSprintInsightsPage, { timeperiod: timeperiod })) : (renderUpgradeWarning())))),
        },
        {
            label: "DORA",
            content: (React.createElement(Grid, { container: true, spacing: 3, direction: "column" },
                React.createElement(Grid, { item: true }, (orgData === null || orgData === void 0 ? void 0 : orgData.subscription) === "enterprise-plus" ? (React.createElement(AaDoraPage, { timeperiod: timeperiod })) : (renderUpgradeWarning())))),
        },
        {
            label: "STOCK",
            content: (React.createElement(Grid, { container: true, spacing: 3, direction: "column" },
                React.createElement(Grid, { item: true }, (orgData === null || orgData === void 0 ? void 0 : orgData.subscription) === "enterprise-plus" ? (React.createElement(AaStockPage, { timeperiod: timeperiod })) : (renderUpgradeWarning())))),
        },
        {
            label: "LEAKS",
            content: (React.createElement(Grid, { container: true, spacing: 3, direction: "column" },
                React.createElement(Grid, { item: true }, (orgData === null || orgData === void 0 ? void 0 : orgData.subscription) === "enterprise-plus" ? (React.createElement(AaLeaksPage, { timeperiod: timeperiod })) : (renderUpgradeWarning())))),
        },
    ];
    function renderUpgradeWarning() {
        return (React.createElement(Alert, { severity: "warning" },
            "Agile Analytics Backstage.io integration is available only for Enterprise+ organizations. Please",
            " ",
            React.createElement(Link, { href: "https://www.prod.agileanalytics.cloud/settings/organisation", underline: "always", color: "inherit" }, "upgrade your plan")));
    }
    return (React.createElement(Content, null,
        React.createElement(Grid, { container: true, spacing: 3, direction: "column" },
            React.createElement(Grid, { item: true },
                React.createElement(AaTimeSelect, { timeperiod: timeperiod, setTimeperiod: setTimeperiod })),
            React.createElement(Grid, { item: true },
                React.createElement(Tabs, { tabs: tabs })))));
};
