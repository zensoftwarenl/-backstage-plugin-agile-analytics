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
export const AaStockPage = ({ timeperiod }) => {
    const api = useApi(agileAnalyticsApiRef);
    const config = useApi(configApiRef);
    const orgHash = config.getString("agileAnalytics.orgHash");
    const apiKey = config.getString("agileAnalytics.apiKey");
    const stockState = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.getStockData({
            orgHash,
            apiKey,
            dateStart: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_start,
            dateEnd: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_end,
        });
        return response;
    }), [timeperiod]);
    const riskChartState = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.getRiskChartData({
            orgHash,
            apiKey,
            dateStart: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_start,
            dateEnd: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_end,
        });
        return response;
    }), [timeperiod]);
    console.log(riskChartState);
    const createChartSeriesFromData = () => {
        const getLabels = (buckets) => {
            if (!buckets) {
                return [];
            }
            const labels = [];
            const timestamps = Object.keys(buckets);
            if (!timestamps.length) {
                return [];
            }
            timestamps.forEach((item) => {
                const start_date = moment(item).unix();
                labels.push(start_date);
            });
            return labels;
        };
        const series = (stockState === null || stockState === void 0 ? void 0 : stockState.value)
            ? Object.keys(stockState === null || stockState === void 0 ? void 0 : stockState.value)
                .filter((item) => item !== "buckets")
                .reduce((acc, item) => {
                var _a;
                const formatted = {
                    name: item,
                    data: getLabels((_a = stockState.value) === null || _a === void 0 ? void 0 : _a.buckets).map((date, i) => {
                        var _a;
                        return [
                            date * 1000,
                            (_a = stockState.value[item][i]) === null || _a === void 0 ? void 0 : _a.avg_branch_total_modified_lines,
                        ];
                    }),
                    type: "column",
                };
                return [...acc, formatted];
            }, [])
            : [];
        return series;
    };
    const createRiskChartSeriesFromData = () => {
        if (!(riskChartState === null || riskChartState === void 0 ? void 0 : riskChartState.value)) {
            return [];
        }
        const series = [
            {
                name: "",
                data: Object.entries(riskChartState === null || riskChartState === void 0 ? void 0 : riskChartState.value).map((entry) => {
                    return [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]];
                }),
                type: "pie",
            },
        ];
        return series;
    };
    const chartOptions = [
        {
            series: createChartSeriesFromData(),
        },
    ];
    const riskChartOptions = [
        {
            series: createRiskChartSeriesFromData(),
        },
    ];
    if (stockState === null || stockState === void 0 ? void 0 : stockState.loading) {
        return React.createElement(Progress, null);
    }
    else if (stockState === null || stockState === void 0 ? void 0 : stockState.error) {
        return React.createElement(Alert, { severity: "error" }, stockState === null || stockState === void 0 ? void 0 : stockState.error.message);
    }
    return (React.createElement(Grid, { container: true, spacing: 2 },
        React.createElement(Grid, { item: true, xs: 12, lg: 8 },
            React.createElement(InfoCard, { title: "Stock" },
                React.createElement(AaDoraChart, { timeperiod: timeperiod, charts: chartOptions, chartColor: [
                        "#15a2bb",
                        "#54afc4",
                        "#79bccd",
                        "#99c9d6",
                        "#b7d6df",
                        "#d4e3e8",
                        "#f1f1f1",
                        "#f7dbde",
                        "#fcc5cb",
                        "#ffaeb9",
                        "#ff97a7",
                        "#ff7e95",
                        "#ff6384",
                    ], 
                    // chartHeight={360}
                    loading: stockState.loading, customPointFormatter: null, customOptions: null, yAxisFormatter: null, yAxisTitle: "Average number of modified lines", customOpacity: 1 }))),
        React.createElement(Grid, { item: true, xs: 12, lg: 4 },
            React.createElement(InfoCard, { title: "Risk Chart", deepLink: {
                    title: "Go to Agile Analytics to see a detailed report  ",
                    link: "https://www.prod.agileanalytics.cloud/stock",
                } },
                riskChartState.error ? (React.createElement(Alert, { severity: "error" }, riskChartState === null || riskChartState === void 0 ? void 0 : riskChartState.error.message)) : null,
                React.createElement(AaDoraChart, { timeperiod: timeperiod, charts: riskChartOptions, chartColor: ["#92CE52", "#F8C238", "#E11E1E"], loading: riskChartState.loading, customPointFormatter: function () {
                        return `<span>Branches amount: <b>${this.options.y}</b></span>`;
                    }, customOptions: null, yAxisFormatter: null, customOpacity: 1 })))));
};
