import React, { useState, useEffect, useCallback } from 'react';
import { Select, Progress, InfoCard, LinearGauge, GaugeCard, Content, Tabs, StructuredMetadataTable, Page, Header, HeaderLabel } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { g as getStartDate, a as getEndDate, b as agileAnalyticsApiRef, c as getUniqueListByParent } from './index-087680fe.esm.js';
import useAsync from 'react-use/lib/useAsync';
import Alert from '@material-ui/lab/Alert';
import { Grid, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton, Collapse } from '@material-ui/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import InfoRounded from '@material-ui/icons/InfoRounded';
import moment from 'moment';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

const AaTimeSelect = ({
  timeperiod,
  setTimeperiod
}) => {
  const timeSelect = [
    {
      date_start: getStartDate(6, "days"),
      date_end: getEndDate(),
      label: "Last 7 days",
      value: "7days"
    },
    {
      date_start: getStartDate(13, "days"),
      date_end: getEndDate(),
      label: "Last 14 days",
      value: "14days"
    },
    {
      date_start: getStartDate(2, "months"),
      date_end: getEndDate(),
      label: "Last 2 months",
      value: "2months"
    },
    {
      date_start: getStartDate(3, "months"),
      date_end: getEndDate(),
      label: "Last 3 months",
      value: "3months"
    }
  ];
  function handleTimeperiodChange(value) {
    const updatedTimeperiod = timeSelect.find((period) => period.value === value);
    if (updatedTimeperiod) {
      setTimeperiod(updatedTimeperiod);
    }
  }
  return /* @__PURE__ */ React.createElement(Select, {
    label: "Timeperiod",
    items: timeSelect,
    selected: "7days",
    onChange: (e) => handleTimeperiodChange(e.toString())
  });
};

const AaDoraChart = ({
  timeperiod,
  charts,
  chartColor = null,
  customOptions,
  customPointFormatter,
  yAxisType = "linear",
  yAxisFormat = "{value}",
  yAxisFormatter,
  chartHeight,
  loading = false,
  className = "",
  yAxisTitle,
  customOpacity,
  isMarker = true,
  isStacking = true,
  setUpdate = null,
  update = 0
}) => {
  var _a, _b, _c, _d;
  const { date_end, date_start } = timeperiod;
  const [yAxisCustomLabels, setYAxisCustomLabels] = useState({
    format: yAxisFormat
  });
  const [tooltip, setTooltip] = useState({
    shared: false,
    headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>'
  });
  const [selectedChart, setSelectedChart] = useState(null);
  const [infoHoverStatus, setInfoHoverStatus] = useState(false);
  useEffect(() => {
    var _a2;
    if (charts == null ? void 0 : charts.length, update === 0) {
      const formatted = {
        ...charts[0],
        series: formatSeries((_a2 = charts[0]) == null ? void 0 : _a2.series)
      };
      setSelectedChart(formatted);
    }
  }, [charts, update]);
  useEffect(() => {
    if (yAxisFormatter) {
      setYAxisCustomLabels({ formatter: yAxisFormatter });
    } else {
      setYAxisCustomLabels({
        format: yAxisFormat
      });
    }
  }, [yAxisFormatter, yAxisFormat]);
  useEffect(() => {
    if (customPointFormatter) {
      setTooltip((prevState) => {
        return { ...prevState, pointFormatter: customPointFormatter };
      });
    } else {
      setTooltip({
        shared: true,
        headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>'
      });
    }
  }, [customPointFormatter]);
  const selectOptions = charts == null ? void 0 : charts.map((chart) => chart.title);
  const options = {
    colors: chartColor != null ? chartColor : ["#7902D7", "#F8C238", "#15A2BB"],
    chart: {
      height: chartHeight
    },
    title: {
      text: ""
    },
    yAxis: {
      labels: yAxisCustomLabels,
      type: yAxisType,
      title: {
        text: yAxisTitle != null ? yAxisTitle : ""
      },
      min: 0
    },
    xAxis: {
      type: "datetime",
      labels: {
        format: "{value:%d %b}",
        align: "right"
      },
      gridLineWidth: 1,
      min: date_start * 1e3,
      max: date_end * 1e3
    },
    credits: {
      enabled: false
    },
    tooltip,
    plotOptions: {
      series: {
        opacity: customOpacity != null ? customOpacity : 0.8,
        stickyTracking: false,
        events: {
          mouseOut: function() {
            this.chart.tooltip.hide();
          }
        }
      },
      area: {
        stacking: isStacking ? "normal" : void 0,
        marker: {
          enabled: isMarker,
          states: {
            hover: {
              enabled: isMarker
            }
          }
        }
      },
      column: {
        stacking: isStacking ? "normal" : void 0,
        dataLabels: {
          enabled: true
        }
      },
      line: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false
            }
          }
        },
        zIndex: -10,
        lineWidth: 1
      },
      scatter: {
        marker: {
          radius: 6
        }
      },
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %"
        }
      }
    },
    legend: {
      enabled: true
    },
    series: (_a = selectedChart == null ? void 0 : selectedChart.series) != null ? _a : [{ data: [null, null] }]
  };
  function formatSeries(series) {
    return series == null ? void 0 : series.map((chart) => {
      var _a2, _b2;
      return {
        name: (_a2 = chart.name) != null ? _a2 : "",
        data: chart.data,
        type: (_b2 = chart.type) != null ? _b2 : "area",
        stickyTracking: false
      };
    });
  }
  function handleChartChange(value) {
    if (setUpdate) {
      setUpdate((prevState) => prevState + 1);
    }
    const selected = charts.find((chart) => chart.title.value === value);
    if (selected) {
      setSelectedChart({
        ...selected,
        series: formatSeries(selected == null ? void 0 : selected.series)
      });
    }
  }
  return /* @__PURE__ */ React.createElement("div", null, ((_c = (_b = charts[0]) == null ? void 0 : _b.title) == null ? void 0 : _c.label) ? /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      height: 70,
      alignItems: "center",
      paddingLeft: 4,
      paddingRight: 4,
      paddingBottom: 24
    }
  }, (charts == null ? void 0 : charts.length) && charts.length > 1 ? /* @__PURE__ */ React.createElement("div", {
    style: { display: "flex", position: "relative" }
  }, /* @__PURE__ */ React.createElement(Select, {
    label: "",
    items: selectOptions,
    selected: "cycle-time",
    onChange: (e) => handleChartChange(e.toString())
  }), (selectedChart == null ? void 0 : selectedChart.description) ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: { marginTop: 20, marginLeft: 4, cursor: "pointer" },
    onMouseOver: () => setInfoHoverStatus(true),
    onFocus: () => setInfoHoverStatus(true),
    onMouseOut: () => setInfoHoverStatus(false),
    onBlur: () => setInfoHoverStatus(false)
  }, /* @__PURE__ */ React.createElement(InfoRounded, null)), infoHoverStatus && /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "absolute",
      top: -4,
      right: -304,
      zIndex: 2,
      fontSize: 12,
      display: "block",
      width: 300
    }
  }, selectedChart.description)) : null) : null, (charts == null ? void 0 : charts.length) && charts.length === 1 ? /* @__PURE__ */ React.createElement("div", {
    style: { display: "flex", position: "relative" }
  }, /* @__PURE__ */ React.createElement("h5", {
    style: { fontSize: 24, fontWeight: 500 }
  }, charts[0].title.label), ((_d = charts[0]) == null ? void 0 : _d.description) ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: { marginTop: 20, marginLeft: 4, cursor: "pointer" },
    onMouseOver: () => setInfoHoverStatus(true),
    onFocus: () => setInfoHoverStatus(true),
    onMouseOut: () => setInfoHoverStatus(false),
    onBlur: () => setInfoHoverStatus(false)
  }, /* @__PURE__ */ React.createElement(InfoRounded, null)), infoHoverStatus && /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "absolute",
      top: -4,
      right: -304,
      zIndex: 2,
      fontSize: 12,
      display: "block",
      width: 300
    }
  }, charts[0].description)) : null) : null, (selectedChart == null ? void 0 : selectedChart.averageValue) ? /* @__PURE__ */ React.createElement("p", {
    style: { fontSize: 24, fontWeight: 700 }
  }, /* @__PURE__ */ React.createElement("span", {
    className: "font-display text-lg font-semibold leading-5"
  }, selectedChart.averageValue), " ", /* @__PURE__ */ React.createElement("span", {
    className: "font-display"
  }, selectedChart == null ? void 0 : selectedChart.averageMeasure)) : null) : null, loading ? /* @__PURE__ */ React.createElement(Progress, null) : /* @__PURE__ */ React.createElement(HighchartsReact, {
    highcharts: Highcharts,
    options: customOptions ? customOptions : options
  }));
};

const AaDoraPage = ({ timeperiod }) => {
  const api = useApi(agileAnalyticsApiRef);
  const config = useApi(configApiRef);
  const orgHash = config.getString("agileAnalytics.orgHash");
  const apiKey = config.getString("agileAnalytics.apiKey");
  const reposState = useAsync(async () => {
    const response = await api.getReposData({
      orgHash,
      apiKey
    });
    return response;
  }, []);
  const [repositoriesFilter, setRepositoriesFilter] = useState([]);
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    var _a;
    if ((_a = reposState == null ? void 0 : reposState.value) == null ? void 0 : _a.length) {
      const formatted = reposState == null ? void 0 : reposState.value.reduce((acc, item) => {
        const group = item.provider_id;
        const options = item.repositories.map((repository) => {
          var _a2;
          return {
            ...repository,
            group,
            isSelected: (_a2 = repository == null ? void 0 : repository.webhook) != null ? _a2 : false
          };
        });
        return [...acc, ...options];
      }, []).filter((repo) => repo.webhook);
      setRepositoriesFilter(formatted);
    } else {
      setRepositoriesFilter([]);
    }
  }, [reposState.value]);
  const [timeperiodByDays, setTimeperiodByDays] = useState([]);
  useEffect(() => {
    if (timeperiod.date_start && timeperiod.date_end) {
      const timestampsByDays = [];
      let dayStartTimestamp = timeperiod.date_start * 1e3;
      let dayEndTimestamp = +moment(dayStartTimestamp).add(1, "days").subtract(1, "seconds").format("x");
      while (dayEndTimestamp < timeperiod.date_end * 1e3) {
        timestampsByDays.push({
          start: dayStartTimestamp,
          end: dayEndTimestamp
        });
        dayStartTimestamp = +moment(dayStartTimestamp).add(1, "days").format("x");
        dayEndTimestamp = +moment(dayEndTimestamp).add(1, "days").format("x");
      }
      timestampsByDays.push({
        start: dayStartTimestamp,
        end: dayEndTimestamp
      });
      setTimeperiodByDays(timestampsByDays);
    }
  }, [timeperiod]);
  const deploymentFreqState = useAsync(async () => {
    const response = await api.getDeploymentFreqData({
      orgHash,
      apiKey,
      dateStart: timeperiod == null ? void 0 : timeperiod.date_start,
      dateEnd: timeperiod == null ? void 0 : timeperiod.date_end
    });
    return response;
  }, [timeperiod]);
  const [filteredDeploymentFreqData, setFilteredDeploymentFreqData] = useState([]);
  const [formattedDeploymentFreqData, setFormattedDeploymentFreqData] = useState([]);
  const [
    formattedDeploymentFreqSuccessData,
    setFormattedDeploymentFreqSuccessData
  ] = useState([]);
  const [
    formattedDeploymentFreqFailedData,
    setFormattedDeploymentFreqFailedData
  ] = useState([]);
  const [averageDeploymentFreq, setAverageDeploymentFreq] = useState(null);
  const chartsDeploymentFreq = [
    {
      title: {
        label: "Deployment frequency",
        value: "deployment-frequency"
      },
      averageMeasure: "p/day",
      averageValue: averageDeploymentFreq,
      series: [
        {
          name: "Successful deployments",
          data: formattedDeploymentFreqSuccessData ? formattedDeploymentFreqSuccessData : []
        },
        {
          name: "Failed deployments",
          data: formattedDeploymentFreqFailedData ? formattedDeploymentFreqFailedData : []
        }
      ]
    }
  ];
  const filterDeploymentFreq = useCallback((data) => {
    const filteredData = data.filter((deployment) => {
      return repositoriesFilter.find((repo) => {
        var _a;
        return repo.isSelected && repo.url.includes((_a = deployment == null ? void 0 : deployment.repository) == null ? void 0 : _a.replace("git@gitlab.com:", ""));
      });
    });
    return filteredData;
  }, [repositoriesFilter]);
  useEffect(() => {
    var _a;
    if ((_a = deploymentFreqState == null ? void 0 : deploymentFreqState.value) == null ? void 0 : _a.length) {
      const filteredData = filterDeploymentFreq(deploymentFreqState.value);
      setFilteredDeploymentFreqData(filteredData);
    } else {
      setFilteredDeploymentFreqData([]);
    }
  }, [deploymentFreqState, filterDeploymentFreq]);
  const formatDeploymentFreq = useCallback((status = "success") => {
    return timeperiodByDays.reduce((acc, day, i) => {
      let deployments = filteredDeploymentFreqData.filter((deployment) => deployment.timestamp * 1e3 >= day.start && deployment.timestamp * 1e3 <= day.end);
      if (status) {
        deployments = deployments.filter((deployment) => deployment.status === status);
      }
      if (i === (timeperiodByDays == null ? void 0 : timeperiodByDays.length) - 1) {
        return [
          ...acc,
          [day.start, deployments.length],
          [day.end, deployments.length]
        ];
      }
      return [...acc, [day.start, deployments.length]];
    }, []);
  }, [filteredDeploymentFreqData, timeperiodByDays]);
  useEffect(() => {
    if (filteredDeploymentFreqData == null ? void 0 : filteredDeploymentFreqData.length) {
      setFormattedDeploymentFreqSuccessData(formatDeploymentFreq("success"));
      setFormattedDeploymentFreqFailedData(formatDeploymentFreq("failed"));
      setFormattedDeploymentFreqData(formatDeploymentFreq());
    } else {
      setFormattedDeploymentFreqSuccessData([]);
      setFormattedDeploymentFreqFailedData([]);
      setFormattedDeploymentFreqData([]);
    }
  }, [filteredDeploymentFreqData == null ? void 0 : filteredDeploymentFreqData.length, formatDeploymentFreq]);
  useEffect(() => {
    if (formattedDeploymentFreqData == null ? void 0 : formattedDeploymentFreqData.length) {
      const totalDeployments = formattedDeploymentFreqData.reduce((acc, item, i) => formattedDeploymentFreqData.length - 1 !== i ? acc + item[1] : acc, 0);
      const avgDeployments = (totalDeployments / timeperiodByDays.length).toFixed(2);
      setAverageDeploymentFreq(avgDeployments);
    } else {
      setAverageDeploymentFreq(null);
    }
  }, [formattedDeploymentFreqData, timeperiodByDays, repositoriesFilter]);
  function handleRepoToggle(repo) {
    const updatedRepos = repositoriesFilter.map((filterRepo) => {
      if (filterRepo.url === repo.url) {
        return { ...filterRepo, isSelected: !filterRepo.isSelected };
      }
      return filterRepo;
    });
    setRepositoriesFilter(updatedRepos);
  }
  const leadTimeState = useAsync(async () => {
    const response = await api.getLeadTimeData({
      orgHash,
      apiKey,
      dateStart: timeperiod == null ? void 0 : timeperiod.date_start,
      dateEnd: timeperiod == null ? void 0 : timeperiod.date_end
    });
    return response;
  }, [timeperiod]);
  const [filteredLeadTimeData, setFilteredLeadTimeData] = useState([]);
  const [formattedLeadTimeData, setFormattedLeadTimeData] = useState([]);
  const [ticketKeys, setTicketKeys] = useState([]);
  const [formattedLeadTimeForChangeData, setFormattedLeadTimeForChangeData] = useState([]);
  const [formattedCycleTimeData, setFormattedCycleTimeData] = useState([]);
  const [averageCycleTimeChartData, setAverageCycleTimeChartData] = useState([]);
  const [averageLeadTimeChartData, setAverageLeadTimeChartData] = useState([]);
  const [
    averageLeadTimeForChangeChartData,
    setAverageLeadTimeForChangeChartData
  ] = useState([]);
  const [averageCycleTime, setAverageCycleTime] = useState(null);
  const chartsLeadTime = [
    {
      title: {
        value: "cycle-time",
        label: "Cycle Time"
      },
      description: "Measures the time difference between the starting time of implementing a requirement and when the changes are delivered to production.",
      averageMeasure: "",
      averageValue: averageCycleTime == null ? void 0 : averageCycleTime.cycleTime,
      series: [
        {
          name: "Deployments Cycle Time",
          type: "scatter",
          data: (formattedCycleTimeData == null ? void 0 : formattedCycleTimeData.length) ? formattedCycleTimeData : []
        },
        {
          name: "Average",
          type: "line",
          data: (averageCycleTimeChartData == null ? void 0 : averageCycleTimeChartData.length) ? averageCycleTimeChartData : []
        }
      ]
    },
    {
      title: {
        value: "lead-time",
        label: "Lead Time"
      },
      description: "Measures the time difference between the time a requirement is created and when the changes are delivered to production.",
      averageMeasure: "",
      averageValue: averageCycleTime == null ? void 0 : averageCycleTime.leadTime,
      series: [
        {
          name: "Deployments Lead Time",
          type: "scatter",
          data: formattedLeadTimeData.length ? formattedLeadTimeData : []
        },
        {
          name: "Average",
          type: "line",
          data: averageLeadTimeChartData.length ? averageLeadTimeChartData : []
        }
      ]
    },
    {
      title: {
        value: "lead-time-for-change",
        label: "Lead Time for Changes"
      },
      description: "Measures the amount of time it takes a commit to get into production.",
      averageMeasure: "",
      averageValue: averageCycleTime == null ? void 0 : averageCycleTime.leadTimeForChange,
      series: [
        {
          name: "Deployments Lead Time For Changes",
          type: "scatter",
          data: formattedLeadTimeForChangeData.length ? formattedLeadTimeForChangeData : []
        },
        {
          name: "Average",
          type: "line",
          data: averageLeadTimeForChangeChartData.length ? averageLeadTimeForChangeChartData : []
        }
      ]
    }
  ];
  useEffect(() => {
    var _a;
    if ((_a = leadTimeState == null ? void 0 : leadTimeState.value) == null ? void 0 : _a.length) {
      const filteredData = filterDeploymentFreq(leadTimeState.value);
      setFilteredLeadTimeData(filteredData);
    } else {
      setFilteredLeadTimeData([]);
    }
  }, [leadTimeState == null ? void 0 : leadTimeState.value, repositoriesFilter, filterDeploymentFreq]);
  const formatLeadTimeData = useCallback((propertyKey) => {
    return filteredLeadTimeData.map((deployment) => [
      deployment.timestamp * 1e3,
      deployment[propertyKey] * 1e3
    ]);
  }, [filteredLeadTimeData]);
  useEffect(() => {
    if (filteredLeadTimeData == null ? void 0 : filteredLeadTimeData.length) {
      setFormattedLeadTimeData(formatLeadTimeData("lead_time"));
      setFormattedCycleTimeData(formatLeadTimeData("cycle_time"));
      setFormattedLeadTimeForChangeData(formatLeadTimeData("lead_time_for_changes"));
      setTicketKeys(filteredLeadTimeData.map((item) => item.key));
    } else {
      setFormattedLeadTimeData([]);
      setFormattedCycleTimeData([]);
      setFormattedLeadTimeForChangeData([]);
      setTicketKeys([]);
    }
  }, [filteredLeadTimeData, formatLeadTimeData, update]);
  const generateAverageChart = useCallback((formattedData) => {
    return timeperiodByDays.reduce((acc, day, i) => {
      const dayDeployments = formattedData.filter((deployment) => deployment[0] >= day.start && deployment[0] <= day.end);
      const dayAverage = (dayDeployments == null ? void 0 : dayDeployments.length) ? dayDeployments.reduce((accum, event) => accum + event[1], 0) / (dayDeployments == null ? void 0 : dayDeployments.length) : null;
      if (!dayAverage) {
        if (i === (timeperiodByDays == null ? void 0 : timeperiodByDays.length) - 1 && (acc == null ? void 0 : acc.length)) {
          return [...acc, [day.end, acc[acc.length - 1][1]]];
        }
        return acc;
      }
      if (!(acc == null ? void 0 : acc.length)) {
        return [
          ...acc,
          [timeperiodByDays[0].start, dayAverage],
          [day.end, dayAverage]
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
      } else if (valueDuration._data.days) {
        formattedValue = `${valueDuration._data.days}d ${valueDuration._data.minutes >= 30 ? valueDuration._data.hours + 1 : valueDuration._data.hours}h`;
      } else if (valueDuration._data.hours) {
        formattedValue = `${valueDuration._data.hours}h ${valueDuration._data.seconds >= 30 ? valueDuration._data.minutes + 1 : valueDuration._data.minutes}m`;
      } else if (valueDuration._data.minutes) {
        formattedValue = `${valueDuration._data.minutes}m ${valueDuration._data.milliseconds >= 30 ? valueDuration._data.seconds + 1 : valueDuration._data.seconds}s`;
      } else if (valueDuration._data.seconds) {
        formattedValue = `${valueDuration._data.milliseconds >= 30 ? valueDuration._data.seconds + 1 : valueDuration._data.seconds}s`;
      }
    }
    return formattedValue;
  }, []);
  useEffect(() => {
    let avgCycleTime = null;
    let avgLeadTime = null;
    let avgLeadTimeForChange = null;
    const totalCycleTime = (formattedCycleTimeData == null ? void 0 : formattedCycleTimeData.length) ? formattedCycleTimeData.reduce((acc, item) => acc + item[1], 0) : null;
    const totalLeadTime = (formattedLeadTimeData == null ? void 0 : formattedLeadTimeData.length) ? formattedLeadTimeData.reduce((acc, item) => acc + item[1], 0) : null;
    const totalLeadTimeForChange = (formattedLeadTimeForChangeData == null ? void 0 : formattedLeadTimeForChangeData.length) ? formattedLeadTimeForChangeData.reduce((acc, item) => acc + item[1], 0) : null;
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
      leadTimeForChange: avgLeadTimeForChange
    });
    setAverageCycleTimeChartData(generateAverageChart(formattedCycleTimeData));
    setAverageLeadTimeChartData(generateAverageChart(formattedLeadTimeData));
    setAverageLeadTimeForChangeChartData(generateAverageChart(formattedLeadTimeForChangeData));
  }, [
    formattedLeadTimeData,
    formattedCycleTimeData,
    formattedLeadTimeForChangeData,
    generateAverageChart,
    formatChartAxisTime
  ]);
  if (reposState == null ? void 0 : reposState.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (reposState == null ? void 0 : reposState.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, reposState == null ? void 0 : reposState.error.message);
  }
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "DORA Metrics"
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    alignItems: "stretch"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4,
    lg: 2
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Repositories"
  }, repositoriesFilter.filter((repo) => repo.isSelected).map((repo) => /* @__PURE__ */ React.createElement(Chip, {
    label: repo.name,
    key: repo.url,
    size: "small",
    onDelete: () => handleRepoToggle(repo)
  })), repositoriesFilter.filter((repo) => !repo.isSelected).map((repo) => /* @__PURE__ */ React.createElement(Chip, {
    label: repo.name,
    key: repo.url,
    size: "small",
    variant: "outlined",
    onClick: () => handleRepoToggle(repo)
  })))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 8,
    lg: 10
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    lg: 6
  }, /* @__PURE__ */ React.createElement(AaDoraChart, {
    timeperiod,
    charts: chartsDeploymentFreq,
    chartColor: ["#3090B3", "#FFA1B5"],
    chartHeight: 360,
    loading: deploymentFreqState.loading,
    customPointFormatter: null,
    customOptions: null,
    yAxisFormatter: null
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    lg: 6
  }, /* @__PURE__ */ React.createElement(AaDoraChart, {
    timeperiod,
    charts: chartsLeadTime,
    chartColor: ["#FF6384", "#333333"],
    yAxisFormatter: function() {
      const formattedValue = formatChartAxisTime(this.value);
      return `<span>${formattedValue}</span>`;
    },
    chartHeight: 360,
    customPointFormatter: function() {
      const formattedValue = formatChartAxisTime(this.options.y);
      const keyIndex = formattedCycleTimeData.findIndex((item) => item[0] === this.options.x);
      return `<span>${this.series.userOptions.name.replace("Deployments ", "")}: ${formattedValue}</span><br/><span>${this.series.initialType === "scatter" ? `Ticket key: ${ticketKeys[keyIndex]}` : ""}`;
    },
    loading: leadTimeState.loading,
    customOptions: null,
    setUpdate,
    update
  }))))));
};

const AaSprintInsightsTable = ({
  timeperiod,
  tickets
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const latestTasksWithUniqueParent = getUniqueListByParent(tickets).sort((a, b) => b.timestamp - a.timestamp);
  const parentTaskWithSubTasks = latestTasksWithUniqueParent.map((uniqueTask) => {
    let parentTaskWithLatestTimestamp = { ...uniqueTask, isParent: true };
    const parentTasksUpdates = tickets.filter((task) => task.key === uniqueTask.parent.key).sort((a, b) => b.timestamp - a.timestamp);
    if (parentTasksUpdates.length) {
      const parentTask = parentTasksUpdates[0];
      parentTaskWithLatestTimestamp = {
        ...parentTask,
        timestamp: uniqueTask.timestamp,
        isParent: true
      };
    }
    const allSubtasks = tickets.filter((task) => task.parent.key === uniqueTask.parent.key);
    return { ...parentTaskWithLatestTimestamp, subtasks: [...allSubtasks] };
  });
  const formattedTableData = parentTaskWithSubTasks.map((ticket) => {
    var _a, _b, _c;
    const formattedTicket = {
      "date event": ticket.timestamp,
      "transition from": ticket.transition_from,
      "transition to": ticket.transition_to,
      sprint: (_a = ticket.sprint) != null ? _a : "",
      "ticket key": ticket.key,
      type: ticket.type,
      summary: ticket.summary,
      hours: ticket.hours,
      label: (_b = ticket.parent.label.split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")) != null ? _b : "",
      confidence: +ticket.parent.predictions[0].value,
      subtasks: ((_c = ticket == null ? void 0 : ticket.subtasks) == null ? void 0 : _c.length) ? ticket.subtasks.map((subtask) => {
        var _a2;
        return {
          "date event": subtask.timestamp,
          "transition from": subtask.transition_from,
          "transition to": subtask.transition_to,
          sprint: (_a2 = subtask.sprint) != null ? _a2 : "",
          "ticket key": subtask.key,
          type: subtask.type,
          summary: subtask.summary,
          hours: subtask.hours,
          label: "",
          confidence: +ticket.parent.predictions[0].value
        };
      }) : null
    };
    return formattedTicket;
  });
  return /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(Table, {
    "aria-label": "collapsible table"
  }, /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, {
    padding: "normal"
  }), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "none"
  }, "Date Event"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "normal"
  }, "From"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "none"
  }, "To"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "normal"
  }, "Sprint"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "none"
  }, "Ticket key"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "normal"
  }, "Type"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "none",
    size: "medium"
  }, "Description"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "normal"
  }, "Hours"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "none"
  }, "Label"), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "normal"
  }, "Confidence"))), /* @__PURE__ */ React.createElement(TableBody, null, formattedTableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => /* @__PURE__ */ React.createElement(Row, {
    key: row["date event"],
    row
  }))))), /* @__PURE__ */ React.createElement(TablePagination, {
    rowsPerPageOptions: [10, 25, 100],
    component: "div",
    count: formattedTableData.length,
    rowsPerPage,
    page,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage
  }));
};
function Row(props) {
  var _a;
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "3%", paddingTop: 4, paddingBottom: 4 }
  }, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => setOpen(!open)
  }, open ? /* @__PURE__ */ React.createElement(KeyboardArrowUp, null) : /* @__PURE__ */ React.createElement(KeyboardArrowDown, null))), /* @__PURE__ */ React.createElement(TableCell, {
    padding: "none",
    component: "th",
    scope: "row",
    style: { width: "10%", paddingTop: 4, paddingBottom: 4 }
  }, row["date event"]), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 }
  }, row["transition from"]), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 },
    padding: "none"
  }, row["transition to"]), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "8%", paddingTop: 4, paddingBottom: 4 }
  }, row.sprint), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 },
    padding: "none"
  }, row["ticket key"]), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 }
  }, row.type), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "30%", paddingTop: 4, paddingBottom: 4 },
    padding: "none",
    size: "medium"
  }, row.summary), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "5%", paddingTop: 4, paddingBottom: 4 }
  }, row.hours), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 },
    padding: "none"
  }, row.label), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "9%", paddingTop: 4, paddingBottom: 4 }
  }, /* @__PURE__ */ React.createElement(LinearGauge, {
    value: row.confidence
  }))), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, {
    style: {
      paddingBottom: 0,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0
    },
    colSpan: 12
  }, /* @__PURE__ */ React.createElement(Collapse, {
    in: open,
    timeout: "auto",
    unmountOnExit: true
  }, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableBody, null, (_a = row == null ? void 0 : row.subtasks) == null ? void 0 : _a.map((subtask) => /* @__PURE__ */ React.createElement(TableRow, {
    key: subtask["ticket key"]
  }, /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "3%", paddingTop: 4, paddingBottom: 4 }
  }, /* @__PURE__ */ React.createElement("div", {
    style: { width: 48, opacity: 0 }
  }, " test")), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "10%", paddingTop: 4, paddingBottom: 4 },
    padding: "none",
    component: "th",
    scope: "row"
  }, subtask["date event"]), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 }
  }, subtask["transition from"]), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 },
    padding: "none"
  }, subtask["transition to"]), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "8%", paddingTop: 4, paddingBottom: 4 }
  }, subtask.sprint), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 },
    padding: "none"
  }, subtask["ticket key"]), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 }
  }, subtask.type), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "30%", paddingTop: 4, paddingBottom: 4 },
    padding: "none",
    size: "medium"
  }, subtask.summary), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "5%", paddingTop: 4, paddingBottom: 4 }
  }, subtask.hours), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "7%", paddingTop: 4, paddingBottom: 4 },
    padding: "none"
  }, row.label), /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: "9%", paddingTop: 4, paddingBottom: 4 }
  }, /* @__PURE__ */ React.createElement(LinearGauge, {
    value: row.confidence
  }))))))))));
}

const AaSprintInsightsPage = ({
  timeperiod
}) => {
  const api = useApi(agileAnalyticsApiRef);
  const config = useApi(configApiRef);
  const orgHash = config.getString("agileAnalytics.orgHash");
  const apiKey = config.getString("agileAnalytics.apiKey");
  const siState = useAsync(async () => {
    const response = await api.getSiData({
      orgHash,
      apiKey,
      dateStart: timeperiod == null ? void 0 : timeperiod.date_start,
      dateEnd: timeperiod == null ? void 0 : timeperiod.date_end
    });
    return response;
  }, [timeperiod]);
  if (siState == null ? void 0 : siState.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (siState == null ? void 0 : siState.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, siState == null ? void 0 : siState.error.message);
  }
  const ticketsTotal = siState.value.featuresAmount + siState.value.notFeaturesAmount;
  const featuresPart = siState.value.featuresAmount / ticketsTotal;
  const notFeaturesPart = siState.value.notFeaturesAmount / ticketsTotal;
  const timeTotal = siState.value.featuresTime + siState.value.notFeaturesTime;
  const featuresTimePart = siState.value.featuresTime / timeTotal;
  const notFeaturesTimePart = siState.value.notFeaturesTime / timeTotal;
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Feature - not feature",
    subheader: "How many features and not-feature tasks are in development"
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(GaugeCard, {
    title: "Features",
    progress: featuresPart,
    description: `${siState.value.featuresAmount} tickets`
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(GaugeCard, {
    title: "Not features",
    progress: notFeaturesPart,
    description: `${siState.value.notFeaturesAmount} tickets`
  }))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Time spent",
    subheader: "How much time were spent on features and not-feature tasks"
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(GaugeCard, {
    title: "Features",
    progress: featuresTimePart,
    description: `${siState.value.featuresTime} hours spent`
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(GaugeCard, {
    title: "Not features",
    progress: notFeaturesTimePart,
    description: `${siState.value.notFeaturesTime} hours spent`
  }))))), /* @__PURE__ */ React.createElement(AaSprintInsightsTable, {
    timeperiod,
    tickets: siState.value.tickets
  }));
};

const AaStockPage = ({ timeperiod }) => {
  const api = useApi(agileAnalyticsApiRef);
  const config = useApi(configApiRef);
  const orgHash = config.getString("agileAnalytics.orgHash");
  const apiKey = config.getString("agileAnalytics.apiKey");
  const stockState = useAsync(async () => {
    const response = await api.getStockData({
      orgHash,
      apiKey,
      dateStart: timeperiod == null ? void 0 : timeperiod.date_start,
      dateEnd: timeperiod == null ? void 0 : timeperiod.date_end
    });
    return response;
  }, [timeperiod]);
  const riskChartState = useAsync(async () => {
    const response = await api.getRiskChartData({
      orgHash,
      apiKey,
      dateStart: timeperiod == null ? void 0 : timeperiod.date_start,
      dateEnd: timeperiod == null ? void 0 : timeperiod.date_end
    });
    return response;
  }, [timeperiod]);
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
    const series = (stockState == null ? void 0 : stockState.value) ? Object.keys(stockState == null ? void 0 : stockState.value).filter((item) => item !== "buckets").reduce((acc, item) => {
      var _a;
      const formatted = {
        name: item,
        data: getLabels((_a = stockState.value) == null ? void 0 : _a.buckets).map((date, i) => {
          var _a2;
          return [
            date * 1e3,
            (_a2 = stockState.value[item][i]) == null ? void 0 : _a2.avg_branch_total_modified_lines
          ];
        }),
        type: "column"
      };
      return [...acc, formatted];
    }, []) : [];
    return series;
  };
  const createRiskChartSeriesFromData = () => {
    if (!(riskChartState == null ? void 0 : riskChartState.value)) {
      return [];
    }
    const series = [
      {
        name: "",
        data: Object.entries(riskChartState == null ? void 0 : riskChartState.value).map((entry) => {
          return [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]];
        }),
        type: "pie"
      }
    ];
    return series;
  };
  const chartOptions = [
    {
      series: createChartSeriesFromData()
    }
  ];
  const riskChartOptions = [
    {
      series: createRiskChartSeriesFromData()
    }
  ];
  if (stockState == null ? void 0 : stockState.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (stockState == null ? void 0 : stockState.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, stockState == null ? void 0 : stockState.error.message);
  }
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    lg: 8
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Stock"
  }, /* @__PURE__ */ React.createElement(AaDoraChart, {
    timeperiod,
    charts: chartOptions,
    chartColor: [
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
      "#ff6384"
    ],
    loading: stockState.loading,
    customPointFormatter: null,
    customOptions: null,
    yAxisFormatter: null,
    yAxisTitle: "Average number of modified lines",
    customOpacity: 1
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    lg: 4
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Risk Chart",
    deepLink: {
      title: "Go to Agile Analytics to see a detailed report  ",
      link: "https://www.prod.agileanalytics.cloud/stock"
    }
  }, riskChartState.error ? /* @__PURE__ */ React.createElement(Alert, {
    severity: "error"
  }, riskChartState == null ? void 0 : riskChartState.error.message) : null, /* @__PURE__ */ React.createElement(AaDoraChart, {
    timeperiod,
    charts: riskChartOptions,
    chartColor: ["#92CE52", "#F8C238", "#E11E1E"],
    loading: riskChartState.loading,
    customPointFormatter: function() {
      return `<span>Branches amount: <b>${this.options.y}</b></span>`;
    },
    customOptions: null,
    yAxisFormatter: null,
    customOpacity: 1
  }))));
};

const AaLeaksPage = ({ timeperiod }) => {
  var _a, _b, _c, _d;
  const api = useApi(agileAnalyticsApiRef);
  const config = useApi(configApiRef);
  const orgHash = config.getString("agileAnalytics.orgHash");
  const apiKey = config.getString("agileAnalytics.apiKey");
  const leaksState = useAsync(async () => {
    const response = await api.getLeaksData({
      orgHash,
      apiKey,
      dateStart: timeperiod == null ? void 0 : timeperiod.date_start,
      dateEnd: timeperiod == null ? void 0 : timeperiod.date_end
    });
    return response;
  }, [timeperiod]);
  const chartOptions = [
    {
      series: [
        {
          name: "All leakes",
          data: ((_b = (_a = leaksState == null ? void 0 : leaksState.value) == null ? void 0 : _a.statistics) == null ? void 0 : _b.length) ? leaksState.value.statistics.map((item) => {
            return [moment(item.date).unix() * 1e3, item.leaks_quantity];
          }) : []
        },
        {
          name: "Solved",
          data: ((_d = (_c = leaksState == null ? void 0 : leaksState.value) == null ? void 0 : _c.statistics) == null ? void 0 : _d.length) ? leaksState.value.statistics.map((item) => {
            return [moment(item.date).unix() * 1e3, item.leaks_fixed];
          }) : []
        }
      ]
    }
  ];
  if (leaksState == null ? void 0 : leaksState.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (leaksState == null ? void 0 : leaksState.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, leaksState == null ? void 0 : leaksState.error.message);
  }
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Leaks",
    deepLink: {
      title: "Go to Agile Analytics to see a detailed report  ",
      link: "https://www.prod.agileanalytics.cloud/leaks"
    }
  }, /* @__PURE__ */ React.createElement(AaDoraChart, {
    timeperiod,
    charts: chartOptions,
    chartColor: ["#FF6384", "#15A2BB"],
    loading: leaksState.loading,
    customPointFormatter: null,
    customOptions: null,
    yAxisFormatter: null,
    yAxisTitle: "Leaks amount",
    customOpacity: 1,
    isMarker: false,
    isStacking: false
  }))));
};

const AaContentComponent = ({
  orgData
}) => {
  const [timeperiod, setTimeperiod] = useState({
    date_start: getStartDate(6, "days"),
    date_end: getEndDate(),
    label: "Last 7 days",
    value: "7days"
  });
  const overviewMetadata = {
    "Organisation hash": orgData.orgHash,
    "Organisation name": orgData.orgName,
    "Number of users": orgData.usersNumber,
    Status: orgData.status,
    Subscription: orgData.subscription
  };
  const cardContentStyle = { heightX: 200, width: 600 };
  const tabs = [
    {
      label: "OVERVIEW",
      content: /* @__PURE__ */ React.createElement(Grid, {
        container: true,
        spacing: 3,
        direction: "column",
        style: cardContentStyle
      }, /* @__PURE__ */ React.createElement(Grid, {
        item: true
      }, /* @__PURE__ */ React.createElement(InfoCard, {
        title: "Organisation's Details"
      }, /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
        metadata: overviewMetadata
      }))))
    },
    {
      label: "SPRINT INSIGHTS",
      content: /* @__PURE__ */ React.createElement(Grid, {
        container: true,
        spacing: 3,
        direction: "column"
      }, /* @__PURE__ */ React.createElement(Grid, {
        item: true
      }, /* @__PURE__ */ React.createElement(AaSprintInsightsPage, {
        timeperiod
      })))
    },
    {
      label: "DORA",
      content: /* @__PURE__ */ React.createElement(Grid, {
        container: true,
        spacing: 3,
        direction: "column"
      }, /* @__PURE__ */ React.createElement(Grid, {
        item: true
      }, /* @__PURE__ */ React.createElement(AaDoraPage, {
        timeperiod
      })))
    },
    {
      label: "STOCK",
      content: /* @__PURE__ */ React.createElement(Grid, {
        container: true,
        spacing: 3,
        direction: "column"
      }, /* @__PURE__ */ React.createElement(Grid, {
        item: true
      }, /* @__PURE__ */ React.createElement(AaStockPage, {
        timeperiod
      })))
    },
    {
      label: "LEAKS",
      content: /* @__PURE__ */ React.createElement(Grid, {
        container: true,
        spacing: 3,
        direction: "column"
      }, /* @__PURE__ */ React.createElement(Grid, {
        item: true
      }, /* @__PURE__ */ React.createElement(AaLeaksPage, {
        timeperiod
      })))
    }
  ];
  return /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "column"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(AaTimeSelect, {
    timeperiod,
    setTimeperiod
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Tabs, {
    tabs
  }))));
};

const AaMainComponent = () => {
  var _a, _b;
  const api = useApi(agileAnalyticsApiRef);
  const config = useApi(configApiRef);
  const orgHash = config.getString("agileAnalytics.orgHash");
  const apiKey = config.getString("agileAnalytics.apiKey");
  const organisationState = useAsync(async () => {
    const response = await api.getOrganisationData({
      orgHash,
      apiKey
    });
    return response;
  }, []);
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: ((_a = organisationState == null ? void 0 : organisationState.value) == null ? void 0 : _a.orgName) ? organisationState.value.orgName.trim() : "Agile Analytics",
    subtitle: `${((_b = organisationState == null ? void 0 : organisationState.value) == null ? void 0 : _b.orgName) ? organisationState.value.orgName.trim() : "Your company"}'s essential metrics from Agile Analytics`
  }, /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Owner",
    value: "Zen Software"
  }), /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Lifecycle",
    value: "Alpha"
  })), (organisationState == null ? void 0 : organisationState.loading) ? /* @__PURE__ */ React.createElement(Progress, null) : null, (organisationState == null ? void 0 : organisationState.error) ? /* @__PURE__ */ React.createElement(Alert, {
    severity: "error"
  }, organisationState == null ? void 0 : organisationState.error.message) : null, !organisationState.loading && !organisationState.error ? /* @__PURE__ */ React.createElement(AaContentComponent, {
    orgData: organisationState == null ? void 0 : organisationState.value
  }) : null);
};

export { AaMainComponent };
//# sourceMappingURL=index-51ff7a8a.esm.js.map
