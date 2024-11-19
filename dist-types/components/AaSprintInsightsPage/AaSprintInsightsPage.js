var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable no-console */
import React from "react";
import { GaugeCard, InfoCard, Progress } from "@backstage/core-components";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import useAsync from "react-use/lib/useAsync";
import Alert from "@material-ui/lab/Alert";
import { Grid } from "@material-ui/core";
import { agileAnalyticsApiRef } from "../../api";
import { AaSprintInsightsTable } from "../AaSprintInsightsTable";
export const AaSprintInsightsPage = ({ timeperiod, }) => {
    const api = useApi(agileAnalyticsApiRef);
    const config = useApi(configApiRef);
    const orgHash = config.getString("agileAnalytics.orgHash");
    const apiKey = config.getString("agileAnalytics.apiKey");
    const siState = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.getSiData({
            orgHash,
            apiKey,
            dateStart: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_start,
            dateEnd: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_end,
        });
        return response;
    }), [timeperiod]);
    if (siState === null || siState === void 0 ? void 0 : siState.loading) {
        return React.createElement(Progress, null);
    }
    else if (siState === null || siState === void 0 ? void 0 : siState.error) {
        return React.createElement(Alert, { severity: "error" }, siState === null || siState === void 0 ? void 0 : siState.error.message);
    }
    const ticketsTotal = siState.value.featuresAmount + siState.value.notFeaturesAmount;
    const featuresPart = siState.value.featuresAmount / ticketsTotal;
    const notFeaturesPart = siState.value.notFeaturesAmount / ticketsTotal;
    const timeTotal = siState.value.featuresTime + siState.value.notFeaturesTime;
    const featuresTimePart = siState.value.featuresTime / timeTotal;
    const notFeaturesTimePart = siState.value.notFeaturesTime / timeTotal;
    return (React.createElement(Grid, { container: true, spacing: 2 },
        React.createElement(Grid, { item: true },
            React.createElement(InfoCard, { title: "Feature - not feature", subheader: "How many features and not-feature tasks are in development" },
                React.createElement(Grid, { container: true, spacing: 2 },
                    React.createElement(Grid, { item: true },
                        React.createElement(GaugeCard, { title: "Features", progress: featuresPart, description: `${siState.value.featuresAmount} tickets` })),
                    React.createElement(Grid, { item: true },
                        React.createElement(GaugeCard, { title: "Not features", progress: notFeaturesPart, description: `${siState.value.notFeaturesAmount} tickets` }))))),
        React.createElement(Grid, { item: true },
            React.createElement(InfoCard, { title: "Time spent", subheader: "How much time were spent on features and not-feature tasks" },
                React.createElement(Grid, { container: true, spacing: 2 },
                    React.createElement(Grid, { item: true },
                        React.createElement(GaugeCard, { title: "Features", progress: featuresTimePart, description: `${siState.value.featuresTime} hours spent` })),
                    React.createElement(Grid, { item: true },
                        React.createElement(GaugeCard, { title: "Not features", progress: notFeaturesTimePart, description: `${siState.value.notFeaturesTime} hours spent` }))))),
        React.createElement(AaSprintInsightsTable, { timeperiod: timeperiod, tickets: siState.value.tickets })));
};
