/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Progress, Select } from '@backstage/core-components';
import InfoRounded from '@material-ui/icons/InfoRounded';
export const AaDoraChart = ({ timeperiod, charts, chartColor = null, customOptions, customPointFormatter, yAxisType = 'linear', yAxisFormat = '{value}', yAxisFormatter, chartHeight, loading = false, className = '', yAxisTitle, customOpacity, isMarker = true, isStacking = true, setUpdate = null, update = 0, }) => {
    var _a, _b, _c, _d;
    // console.log('charts 1', charts[1]?.series[0].data[0]);
    const { date_end, date_start } = timeperiod;
    const [yAxisCustomLabels, setYAxisCustomLabels] = useState({
        format: yAxisFormat,
    });
    const [tooltip, setTooltip] = useState({
        shared: false,
        headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>',
    }); // shared: false -> tooltip will be hidden on mouseout; currently to have shared:false, providing customPointFormatter is required (otherwise it`ll be changed to true (line 69))
    const [selectedChart, setSelectedChart] = useState(null);
    // console.log('selectedChart', selectedChart);
    const [infoHoverStatus, setInfoHoverStatus] = useState(false);
    useEffect(() => {
        var _a;
        if ((charts === null || charts === void 0 ? void 0 : charts.length, update === 0)) {
            const formatted = Object.assign(Object.assign({}, charts[0]), { series: formatSeries((_a = charts[0]) === null || _a === void 0 ? void 0 : _a.series) });
            setSelectedChart(formatted);
        }
    }, [charts, update]);
    useEffect(() => {
        if (yAxisFormatter) {
            setYAxisCustomLabels({ formatter: yAxisFormatter });
        }
        else {
            setYAxisCustomLabels({
                format: yAxisFormat,
            });
        }
    }, [yAxisFormatter, yAxisFormat]);
    useEffect(() => {
        if (customPointFormatter) {
            setTooltip(prevState => {
                return Object.assign(Object.assign({}, prevState), { pointFormatter: customPointFormatter });
            });
        }
        else {
            setTooltip({
                shared: true,
                headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>',
            });
        }
    }, [customPointFormatter]);
    const selectOptions = charts === null || charts === void 0 ? void 0 : charts.map((chart) => chart.title);
    const options = {
        colors: chartColor !== null && chartColor !== void 0 ? chartColor : ['#7902D7', '#F8C238', '#15A2BB'],
        chart: {
            height: chartHeight,
        },
        title: {
            text: '',
        },
        yAxis: {
            labels: yAxisCustomLabels,
            type: yAxisType,
            title: {
                text: yAxisTitle !== null && yAxisTitle !== void 0 ? yAxisTitle : '',
            },
            min: 0,
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%d %b}',
                align: 'right',
            },
            gridLineWidth: 1,
            min: date_start * 1000,
            max: date_end * 1000,
        },
        credits: {
            enabled: false,
        },
        tooltip: tooltip,
        plotOptions: {
            series: {
                opacity: customOpacity !== null && customOpacity !== void 0 ? customOpacity : 0.8,
                stickyTracking: false,
                events: {
                    mouseOut: function () {
                        this.chart.tooltip.hide();
                    },
                },
            },
            area: {
                stacking: isStacking ? 'normal' : undefined,
                marker: {
                    enabled: isMarker,
                    states: {
                        hover: {
                            enabled: isMarker,
                        },
                    },
                },
            },
            column: {
                stacking: isStacking ? 'normal' : undefined,
                dataLabels: {
                    enabled: true,
                },
            },
            line: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false,
                        },
                    },
                },
                zIndex: -10,
                lineWidth: 1,
            },
            scatter: {
                marker: {
                    radius: 6,
                },
            },
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                },
            },
        },
        legend: {
            enabled: true,
        },
        series: (_a = selectedChart === null || selectedChart === void 0 ? void 0 : selectedChart.series) !== null && _a !== void 0 ? _a : [{ data: [null, null] }],
    };
    function formatSeries(series) {
        return series === null || series === void 0 ? void 0 : series.map((chart) => {
            var _a, _b;
            return {
                name: (_a = chart.name) !== null && _a !== void 0 ? _a : '',
                data: chart.data,
                type: (_b = chart.type) !== null && _b !== void 0 ? _b : 'area',
                stickyTracking: false,
            };
        });
    }
    function handleChartChange(value) {
        if (setUpdate) {
            setUpdate(prevState => prevState + 1);
        }
        const selected = charts.find((chart) => chart.title.value === value);
        if (selected) {
            setSelectedChart(Object.assign(Object.assign({}, selected), { series: formatSeries(selected === null || selected === void 0 ? void 0 : selected.series) }));
        }
    }
    return (React.createElement("div", null,
        ((_c = (_b = charts[0]) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c.label) ? (React.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'space-between',
                height: 70,
                alignItems: 'center',
                paddingLeft: 4,
                paddingRight: 4,
                paddingBottom: 24,
            } },
            (charts === null || charts === void 0 ? void 0 : charts.length) && charts.length > 1 ? (React.createElement("div", { style: { display: 'flex', position: 'relative' } },
                React.createElement(Select, { label: "", items: selectOptions, selected: "cycle-time", onChange: e => handleChartChange(e.toString()) }),
                (selectedChart === null || selectedChart === void 0 ? void 0 : selectedChart.description) ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { marginTop: 20, marginLeft: 4, cursor: 'pointer' }, onMouseOver: () => setInfoHoverStatus(true), onFocus: () => setInfoHoverStatus(true), onMouseOut: () => setInfoHoverStatus(false), onBlur: () => setInfoHoverStatus(false) },
                        React.createElement(InfoRounded, null)),
                    infoHoverStatus && (React.createElement("div", { style: {
                            position: 'absolute',
                            top: -4,
                            right: -304,
                            zIndex: 2,
                            fontSize: 12,
                            display: 'block',
                            width: 300,
                        } }, selectedChart.description)))) : null)) : null,
            (charts === null || charts === void 0 ? void 0 : charts.length) && charts.length === 1 ? (React.createElement("div", { style: { display: 'flex', position: 'relative' } },
                React.createElement("h5", { style: { fontSize: 24, fontWeight: 500 } }, charts[0].title.label),
                ((_d = charts[0]) === null || _d === void 0 ? void 0 : _d.description) ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { marginTop: 20, marginLeft: 4, cursor: 'pointer' }, onMouseOver: () => setInfoHoverStatus(true), onFocus: () => setInfoHoverStatus(true), onMouseOut: () => setInfoHoverStatus(false), onBlur: () => setInfoHoverStatus(false) },
                        React.createElement(InfoRounded, null)),
                    infoHoverStatus && (React.createElement("div", { style: {
                            position: 'absolute',
                            top: -4,
                            right: -304,
                            zIndex: 2,
                            fontSize: 12,
                            display: 'block',
                            width: 300,
                        } }, charts[0].description)))) : null)) : null,
            (selectedChart === null || selectedChart === void 0 ? void 0 : selectedChart.averageValue) ? (React.createElement("p", { style: { fontSize: 24, fontWeight: 700 } },
                React.createElement("span", { className: "font-display text-lg font-semibold leading-5" }, selectedChart.averageValue),
                ' ',
                React.createElement("span", { className: "font-display" }, selectedChart === null || selectedChart === void 0 ? void 0 : selectedChart.averageMeasure))) : null)) : null,
        loading ? (React.createElement(Progress, null)) : (React.createElement(HighchartsReact, { highcharts: Highcharts, options: customOptions ? customOptions : options }))));
};
