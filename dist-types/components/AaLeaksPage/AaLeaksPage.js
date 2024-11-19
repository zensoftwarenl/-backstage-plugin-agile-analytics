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
import moment from "moment";
import { InfoCard, Progress } from "@backstage/core-components";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import useAsync from "react-use/lib/useAsync";
import Alert from "@material-ui/lab/Alert";
import { Grid } from "@material-ui/core";
import { agileAnalyticsApiRef } from "../../api";
import { AaDoraChart } from "../AaDoraChart";
export const AaLeaksPage = ({ timeperiod }) => {
    var _a, _b, _c, _d;
    const api = useApi(agileAnalyticsApiRef);
    const config = useApi(configApiRef);
    const orgHash = config.getString("agileAnalytics.orgHash");
    const apiKey = config.getString("agileAnalytics.apiKey");
    const leaksState = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.getLeaksData({
            orgHash,
            apiKey,
            dateStart: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_start,
            dateEnd: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_end,
        });
        return response;
    }), [timeperiod]);
    const chartOptions = [
        {
            series: [
                {
                    name: "All leakes",
                    data: ((_b = (_a = leaksState === null || leaksState === void 0 ? void 0 : leaksState.value) === null || _a === void 0 ? void 0 : _a.statistics) === null || _b === void 0 ? void 0 : _b.length)
                        ? leaksState.value.statistics.map((item) => {
                            return [moment(item.date).unix() * 1000, item.leaks_quantity];
                        })
                        : [],
                },
                {
                    name: "Solved",
                    data: ((_d = (_c = leaksState === null || leaksState === void 0 ? void 0 : leaksState.value) === null || _c === void 0 ? void 0 : _c.statistics) === null || _d === void 0 ? void 0 : _d.length)
                        ? leaksState.value.statistics.map((item) => {
                            return [moment(item.date).unix() * 1000, item.leaks_fixed];
                        })
                        : [],
                },
            ],
        },
    ];
    if (leaksState === null || leaksState === void 0 ? void 0 : leaksState.loading) {
        return React.createElement(Progress, null);
    }
    else if (leaksState === null || leaksState === void 0 ? void 0 : leaksState.error) {
        return React.createElement(Alert, { severity: "error" }, leaksState === null || leaksState === void 0 ? void 0 : leaksState.error.message);
    }
    return (React.createElement(Grid, { container: true, spacing: 2 },
        React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(InfoCard, { title: "Leaks", deepLink: {
                    title: "Go to Agile Analytics to see a detailed report  ",
                    link: "https://www.prod.agileanalytics.cloud/leaks",
                } },
                React.createElement(AaDoraChart, { timeperiod: timeperiod, charts: chartOptions, chartColor: ["#FF6384", "#15A2BB"], loading: leaksState.loading, customPointFormatter: null, customOptions: null, yAxisFormatter: null, yAxisTitle: "Leaks amount", customOpacity: 1, isMarker: false, isStacking: false })))));
};
