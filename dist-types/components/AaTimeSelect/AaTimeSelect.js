/* eslint-disable no-console */
import React from 'react';
import { Select } from '@backstage/core-components';
import { getEndDate, getStartDate } from '../../helpers';
export const AaTimeSelect = ({ timeperiod, setTimeperiod, }) => {
    const timeSelect = [
        {
            date_start: getStartDate(6, 'days'),
            date_end: getEndDate(),
            label: 'Last 7 days',
            value: '7days',
        },
        {
            date_start: getStartDate(13, 'days'),
            date_end: getEndDate(),
            label: 'Last 14 days',
            value: '14days',
        },
        {
            date_start: getStartDate(2, 'months'),
            date_end: getEndDate(),
            label: 'Last 2 months',
            value: '2months',
        },
        {
            date_start: getStartDate(3, 'months'),
            date_end: getEndDate(),
            label: 'Last 3 months',
            value: '3months',
        },
    ];
    function handleTimeperiodChange(value) {
        const updatedTimeperiod = timeSelect.find(period => period.value === value);
        if (updatedTimeperiod) {
            setTimeperiod(updatedTimeperiod);
        }
    }
    return (React.createElement(Select, { label: "Timeperiod", items: timeSelect, selected: "7days", onChange: e => handleTimeperiodChange(e.toString()) }));
};
