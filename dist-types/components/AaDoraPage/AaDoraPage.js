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
import React, { useState, useEffect, useCallback } from "react";
import { InfoCard, Progress } from "@backstage/core-components";
import { Chip, Grid } from "@material-ui/core";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import { agileAnalyticsApiRef } from "../../api";
import useAsync from "react-use/lib/useAsync";
import Alert from "@material-ui/lab/Alert";
import { AaDoraChart } from "../AaDoraChart";
import moment from "moment";
export const AaDoraPage = ({ timeperiod }) => {
    const api = useApi(agileAnalyticsApiRef);
    const config = useApi(configApiRef);
    const orgHash = config.getString("agileAnalytics.orgHash");
    const apiKey = config.getString("agileAnalytics.apiKey");
    // =======FILTER  SETUP========
    const reposState = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.getReposData({
            orgHash,
            apiKey,
        });
        return response;
    }), []);
    const [repositoriesFilter, setRepositoriesFilter] = useState([]);
    const [update, setUpdate] = useState(0);
    // formatting All repositories for the filter (adding isSelected: true/false)
    useEffect(() => {
        var _a;
        if ((_a = reposState === null || reposState === void 0 ? void 0 : reposState.value) === null || _a === void 0 ? void 0 : _a.length) {
            const formatted = reposState === null || reposState === void 0 ? void 0 : reposState.value.reduce((acc, item) => {
                const group = item.provider_id;
                const options = item.repositories.map((repository) => {
                    var _a;
                    return Object.assign(Object.assign({}, repository), { group: group, isSelected: (_a = repository === null || repository === void 0 ? void 0 : repository.webhook) !== null && _a !== void 0 ? _a : false });
                });
                return [...acc, ...options];
            }, []).filter((repo) => repo.webhook);
            setRepositoriesFilter(formatted);
        }
        else {
            setRepositoriesFilter([]);
        }
    }, [reposState.value]);
    // ============= GENERAL DORA CHARTS SETUP===================
    const [timeperiodByDays, setTimeperiodByDays] = useState([]);
    useEffect(() => {
        if (timeperiod.date_start && timeperiod.date_end) {
            const timestampsByDays = [];
            let dayStartTimestamp = timeperiod.date_start * 1000;
            let dayEndTimestamp = +moment(dayStartTimestamp)
                .add(1, "days")
                .subtract(1, "seconds")
                .format("x");
            while (dayEndTimestamp < timeperiod.date_end * 1000) {
                timestampsByDays.push({
                    start: dayStartTimestamp,
                    end: dayEndTimestamp,
                });
                dayStartTimestamp = +moment(dayStartTimestamp)
                    .add(1, "days")
                    .format("x");
                dayEndTimestamp = +moment(dayEndTimestamp).add(1, "days").format("x");
            }
            timestampsByDays.push({
                start: dayStartTimestamp,
                end: dayEndTimestamp,
            });
            setTimeperiodByDays(timestampsByDays);
        }
    }, [timeperiod]);
    // ===================DEPLOYMENT FREQUENCY SETUP=============================
    const deploymentFreqState = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.getDeploymentFreqData({
            orgHash,
            apiKey,
            dateStart: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_start,
            dateEnd: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_end,
        });
        return response;
    }), [timeperiod]);
    const [filteredDeploymentFreqData, setFilteredDeploymentFreqData] = useState([]);
    const [formattedDeploymentFreqData, setFormattedDeploymentFreqData] = useState([]);
    const [formattedDeploymentFreqSuccessData, setFormattedDeploymentFreqSuccessData,] = useState([]);
    const [formattedDeploymentFreqFailedData, setFormattedDeploymentFreqFailedData,] = useState([]);
    const [averageDeploymentFreq, setAverageDeploymentFreq] = useState(null);
    const chartsDeploymentFreq = [
        {
            title: {
                label: "Deployment frequency",
                value: "deployment-frequency",
            },
            averageMeasure: "p/day",
            averageValue: averageDeploymentFreq,
            series: [
                {
                    name: "Successful deployments",
                    data: formattedDeploymentFreqSuccessData
                        ? formattedDeploymentFreqSuccessData
                        : [],
                },
                {
                    name: "Failed deployments",
                    data: formattedDeploymentFreqFailedData
                        ? formattedDeploymentFreqFailedData
                        : [],
                },
            ],
        },
    ];
    const filterDeploymentFreq = useCallback((data) => {
        const filteredData = data.filter((deployment) => {
            return repositoriesFilter.find((repo) => {
                var _a;
                return repo.isSelected &&
                    repo.url.includes((_a = deployment === null || deployment === void 0 ? void 0 : deployment.repository) === null || _a === void 0 ? void 0 : _a.replace("git@gitlab.com:", ""));
            });
        });
        return filteredData;
    }, [repositoriesFilter]);
    useEffect(() => {
        var _a;
        if ((_a = deploymentFreqState === null || deploymentFreqState === void 0 ? void 0 : deploymentFreqState.value) === null || _a === void 0 ? void 0 : _a.length) {
            const filteredData = filterDeploymentFreq(deploymentFreqState.value);
            setFilteredDeploymentFreqData(filteredData);
        }
        else {
            setFilteredDeploymentFreqData([]);
        }
    }, [deploymentFreqState, filterDeploymentFreq]);
    const formatDeploymentFreq = useCallback((status = "success") => {
        return timeperiodByDays.reduce((acc, day, i) => {
            let deployments = filteredDeploymentFreqData.filter((deployment) => deployment.timestamp * 1000 >= day.start &&
                deployment.timestamp * 1000 <= day.end);
            if (status) {
                deployments = deployments.filter((deployment) => deployment.status === status);
            }
            if (i === (timeperiodByDays === null || timeperiodByDays === void 0 ? void 0 : timeperiodByDays.length) - 1) {
                return [
                    ...acc,
                    [day.start, deployments.length],
                    [day.end, deployments.length],
                ];
            }
            return [...acc, [day.start, deployments.length]];
        }, []);
    }, [filteredDeploymentFreqData, timeperiodByDays]);
    useEffect(() => {
        if (filteredDeploymentFreqData === null || filteredDeploymentFreqData === void 0 ? void 0 : filteredDeploymentFreqData.length) {
            setFormattedDeploymentFreqSuccessData(formatDeploymentFreq("success"));
            setFormattedDeploymentFreqFailedData(formatDeploymentFreq("failed"));
            setFormattedDeploymentFreqData(formatDeploymentFreq());
        }
        else {
            setFormattedDeploymentFreqSuccessData([]);
            setFormattedDeploymentFreqFailedData([]);
            setFormattedDeploymentFreqData([]);
        }
    }, [filteredDeploymentFreqData === null || filteredDeploymentFreqData === void 0 ? void 0 : filteredDeploymentFreqData.length, formatDeploymentFreq]);
    useEffect(() => {
        if (formattedDeploymentFreqData === null || formattedDeploymentFreqData === void 0 ? void 0 : formattedDeploymentFreqData.length) {
            const totalDeployments = formattedDeploymentFreqData.reduce((acc, item, i) => formattedDeploymentFreqData.length - 1 !== i ? acc + item[1] : acc, 0);
            const avgDeployments = (totalDeployments / timeperiodByDays.length).toFixed(2);
            setAverageDeploymentFreq(avgDeployments);
        }
        else {
            setAverageDeploymentFreq(null);
        }
    }, [formattedDeploymentFreqData, timeperiodByDays, repositoriesFilter]);
    function handleRepoToggle(repo) {
        const updatedRepos = repositoriesFilter.map((filterRepo) => {
            if (filterRepo.url === repo.url) {
                return Object.assign(Object.assign({}, filterRepo), { isSelected: !filterRepo.isSelected });
            }
            return filterRepo;
        });
        setRepositoriesFilter(updatedRepos);
    }
    // =============== LEAD/CYCLE TIME SETUP ========================
    const leadTimeState = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.getLeadTimeData({
            orgHash,
            apiKey,
            dateStart: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_start,
            dateEnd: timeperiod === null || timeperiod === void 0 ? void 0 : timeperiod.date_end,
        });
        return response;
    }), [timeperiod]);
    const [filteredLeadTimeData, setFilteredLeadTimeData] = useState([]);
    const [formattedLeadTimeData, setFormattedLeadTimeData] = useState([]);
    const [ticketKeys, setTicketKeys] = useState([]);
    const [formattedLeadTimeForChangeData, setFormattedLeadTimeForChangeData] = useState([]);
    const [formattedCycleTimeData, setFormattedCycleTimeData] = useState([]);
    const [averageCycleTimeChartData, setAverageCycleTimeChartData] = useState([]);
    const [averageLeadTimeChartData, setAverageLeadTimeChartData] = useState([]);
    const [averageLeadTimeForChangeChartData, setAverageLeadTimeForChangeChartData,] = useState([]);
    const [averageCycleTime, setAverageCycleTime] = useState(null);
    const chartsLeadTime = [
        {
            title: {
                value: "cycle-time",
                label: "Cycle Time",
            },
            description: "Measures the time difference between the starting time of implementing a requirement and when the changes are delivered to production.",
            averageMeasure: "",
            averageValue: averageCycleTime === null || averageCycleTime === void 0 ? void 0 : averageCycleTime.cycleTime,
            series: [
                {
                    name: "Deployments Cycle Time",
                    type: "scatter",
                    data: (formattedCycleTimeData === null || formattedCycleTimeData === void 0 ? void 0 : formattedCycleTimeData.length) ? formattedCycleTimeData : [],
                },
                {
                    name: "Average",
                    type: "line",
                    data: (averageCycleTimeChartData === null || averageCycleTimeChartData === void 0 ? void 0 : averageCycleTimeChartData.length)
                        ? averageCycleTimeChartData
                        : [],
                },
            ],
        },
        {
            title: {
                value: "lead-time",
                label: "Lead Time",
            },
            description: "Measures the time difference between the time a requirement is created and when the changes are delivered to production.",
            averageMeasure: "",
            averageValue: averageCycleTime === null || averageCycleTime === void 0 ? void 0 : averageCycleTime.leadTime,
            series: [
                {
                    name: "Deployments Lead Time",
                    type: "scatter",
                    data: formattedLeadTimeData.length ? formattedLeadTimeData : [],
                },
                {
                    name: "Average",
                    type: "line",
                    data: averageLeadTimeChartData.length ? averageLeadTimeChartData : [],
                },
            ],
        },
        {
            title: {
                value: "lead-time-for-change",
                label: "Lead Time for Changes",
            },
            description: "Measures the amount of time it takes a commit to get into production.",
            averageMeasure: "",
            averageValue: averageCycleTime === null || averageCycleTime === void 0 ? void 0 : averageCycleTime.leadTimeForChange,
            series: [
                {
                    name: "Deployments Lead Time For Changes",
                    type: "scatter",
                    data: formattedLeadTimeForChangeData.length
                        ? formattedLeadTimeForChangeData
                        : [],
                },
                {
                    name: "Average",
                    type: "line",
                    data: averageLeadTimeForChangeChartData.length
                        ? averageLeadTimeForChangeChartData
                        : [],
                },
            ],
        },
    ];
    // FILTER API RESPONCE
    useEffect(() => {
        var _a;
        if ((_a = leadTimeState === null || leadTimeState === void 0 ? void 0 : leadTimeState.value) === null || _a === void 0 ? void 0 : _a.length) {
            const filteredData = filterDeploymentFreq(leadTimeState.value);
            setFilteredLeadTimeData(filteredData);
        }
        else {
            setFilteredLeadTimeData([]);
        }
    }, [leadTimeState === null || leadTimeState === void 0 ? void 0 : leadTimeState.value, repositoriesFilter, filterDeploymentFreq]);
    // FORMAT FILTERED  API RESPONSE
    const formatLeadTimeData = useCallback((propertyKey) => {
        return filteredLeadTimeData.map((deployment) => [
            deployment.timestamp * 1000,
            deployment[propertyKey] * 1000, // the value comes in seconds, convert to milliseconds
        ]);
    }, [filteredLeadTimeData]);
    useEffect(() => {
        if (filteredLeadTimeData === null || filteredLeadTimeData === void 0 ? void 0 : filteredLeadTimeData.length) {
            setFormattedLeadTimeData(formatLeadTimeData("lead_time"));
            setFormattedCycleTimeData(formatLeadTimeData("cycle_time"));
            setFormattedLeadTimeForChangeData(formatLeadTimeData("lead_time_for_changes"));
            setTicketKeys(filteredLeadTimeData.map((item) => item.key));
        }
        else {
            setFormattedLeadTimeData([]);
            setFormattedCycleTimeData([]);
            setFormattedLeadTimeForChangeData([]);
            setTicketKeys([]);
        }
    }, [filteredLeadTimeData, formatLeadTimeData, update]);
    // SET AVERAGE
    const generateAverageChart = useCallback((formattedData) => {
        return timeperiodByDays.reduce((acc, day, i) => {
            const dayDeployments = formattedData.filter((deployment) => deployment[0] >= day.start && deployment[0] <= day.end);
            const dayAverage = (dayDeployments === null || dayDeployments === void 0 ? void 0 : dayDeployments.length)
                ? dayDeployments.reduce((accum, event) => accum + event[1], 0) / (dayDeployments === null || dayDeployments === void 0 ? void 0 : dayDeployments.length)
                : null;
            if (!dayAverage) {
                if (i === (timeperiodByDays === null || timeperiodByDays === void 0 ? void 0 : timeperiodByDays.length) - 1 && (acc === null || acc === void 0 ? void 0 : acc.length)) {
                    return [...acc, [day.end, acc[acc.length - 1][1]]];
                }
                return acc;
            }
            if (!(acc === null || acc === void 0 ? void 0 : acc.length)) {
                return [
                    ...acc,
                    [timeperiodByDays[0].start, dayAverage],
                    [day.end, dayAverage],
                ];
            }
            return [...acc, [day.end, dayAverage]];
        }, []);
    }, [timeperiodByDays]);
    const formatChartAxisTime = useCallback((value) => {
        const valueDuration = moment.duration(value);
        let formattedValue = "0";
        if (value !== 0) {
            if (valueDuration._data.months) {
                formattedValue = `${Math.floor(valueDuration.asDays())}d`;
            }
            else if (valueDuration._data.days) {
                formattedValue = `${valueDuration._data.days}d ${valueDuration._data.minutes >= 30
                    ? valueDuration._data.hours + 1
                    : valueDuration._data.hours}h`;
            }
            else if (valueDuration._data.hours) {
                formattedValue = `${valueDuration._data.hours}h ${valueDuration._data.seconds >= 30
                    ? valueDuration._data.minutes + 1
                    : valueDuration._data.minutes}m`;
            }
            else if (valueDuration._data.minutes) {
                formattedValue = `${valueDuration._data.minutes}m ${valueDuration._data.milliseconds >= 30
                    ? valueDuration._data.seconds + 1
                    : valueDuration._data.seconds}s`;
            }
            else if (valueDuration._data.seconds) {
                formattedValue = `${valueDuration._data.milliseconds >= 30
                    ? valueDuration._data.seconds + 1
                    : valueDuration._data.seconds}s`;
            }
        }
        return formattedValue;
    }, []);
    useEffect(() => {
        // calculate average number per timepareiod
        let avgCycleTime = null;
        let avgLeadTime = null;
        let avgLeadTimeForChange = null;
        const totalCycleTime = (formattedCycleTimeData === null || formattedCycleTimeData === void 0 ? void 0 : formattedCycleTimeData.length)
            ? formattedCycleTimeData.reduce((acc, item) => acc + item[1], 0)
            : null;
        const totalLeadTime = (formattedLeadTimeData === null || formattedLeadTimeData === void 0 ? void 0 : formattedLeadTimeData.length)
            ? formattedLeadTimeData.reduce((acc, item) => acc + item[1], 0)
            : null;
        const totalLeadTimeForChange = (formattedLeadTimeForChangeData === null || formattedLeadTimeForChangeData === void 0 ? void 0 : formattedLeadTimeForChangeData.length)
            ? formattedLeadTimeForChangeData.reduce((acc, item) => acc + item[1], 0)
            : null;
        if (totalCycleTime) {
            avgCycleTime = formatChartAxisTime(totalCycleTime / formattedCycleTimeData.length);
        }
        if (totalLeadTime) {
            avgLeadTime = formatChartAxisTime(totalLeadTime / formattedLeadTimeData.length);
        }
        if (totalLeadTimeForChange) {
            avgLeadTimeForChange = formatChartAxisTime(totalLeadTimeForChange / formattedLeadTimeForChangeData.length);
        }
        setAverageCycleTime({
            cycleTime: avgCycleTime,
            leadTime: avgLeadTime,
            leadTimeForChange: avgLeadTimeForChange,
        });
        // calculate average chart data (avarage for every day in the timeperiod)
        setAverageCycleTimeChartData(generateAverageChart(formattedCycleTimeData));
        setAverageLeadTimeChartData(generateAverageChart(formattedLeadTimeData));
        setAverageLeadTimeForChangeChartData(generateAverageChart(formattedLeadTimeForChangeData));
    }, [
        formattedLeadTimeData,
        formattedCycleTimeData,
        formattedLeadTimeForChangeData,
        generateAverageChart,
        formatChartAxisTime,
    ]);
    if (reposState === null || reposState === void 0 ? void 0 : reposState.loading) {
        return React.createElement(Progress, null);
    }
    else if (reposState === null || reposState === void 0 ? void 0 : reposState.error) {
        return React.createElement(Alert, { severity: "error" }, reposState === null || reposState === void 0 ? void 0 : reposState.error.message);
    }
    return (React.createElement(InfoCard, { title: "DORA Metrics" },
        React.createElement(Grid, { container: true, spacing: 3, alignItems: "stretch" },
            React.createElement(Grid, { item: true, xs: 4, lg: 2 },
                React.createElement(InfoCard, { title: "Repositories" },
                    repositoriesFilter
                        .filter((repo) => repo.isSelected)
                        .map((repo) => (React.createElement(Chip, { label: repo.name, key: repo.url, size: "small", onDelete: () => handleRepoToggle(repo) }))),
                    repositoriesFilter
                        .filter((repo) => !repo.isSelected)
                        .map((repo) => (React.createElement(Chip, { label: repo.name, key: repo.url, size: "small", variant: "outlined", onClick: () => handleRepoToggle(repo) }))))),
            React.createElement(Grid, { item: true, xs: 8, lg: 10 },
                React.createElement(Grid, { container: true, spacing: 3 },
                    React.createElement(Grid, { item: true, xs: 12, lg: 6 },
                        React.createElement(AaDoraChart, { timeperiod: timeperiod, charts: chartsDeploymentFreq, chartColor: ["#3090B3", "#FFA1B5"], chartHeight: 360, loading: deploymentFreqState.loading, customPointFormatter: null, customOptions: null, yAxisFormatter: null })),
                    React.createElement(Grid, { item: true, xs: 12, lg: 6 },
                        React.createElement(AaDoraChart, { timeperiod: timeperiod, charts: chartsLeadTime, chartColor: ["#FF6384", "#333333"], yAxisFormatter: function () {
                                const formattedValue = formatChartAxisTime(this.value);
                                return `<span>${formattedValue}</span>`;
                            }, chartHeight: 360, customPointFormatter: function () {
                                const formattedValue = formatChartAxisTime(this.options.y);
                                const keyIndex = formattedCycleTimeData.findIndex((item) => item[0] === this.options.x);
                                return `<span>${this.series.userOptions.name.replace("Deployments ", "")}: ${formattedValue}</span><br/><span>${this.series.initialType === "scatter"
                                    ? `Ticket key: ${ticketKeys[keyIndex]}`
                                    : ""}`;
                            }, loading: leadTimeState.loading, customOptions: null, setUpdate: setUpdate, update: update })))))));
};
