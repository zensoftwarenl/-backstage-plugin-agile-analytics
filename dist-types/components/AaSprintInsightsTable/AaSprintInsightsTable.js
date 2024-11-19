/* eslint-disable no-console */
import React, { useState } from 'react';
import { LinearGauge } from '@backstage/core-components';
import { Collapse, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, } from '@material-ui/core';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { getUniqueListByParent } from '../../helpers';
export const AaSprintInsightsTable = ({ timeperiod, tickets, }) => {
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
    const parentTaskWithSubTasks = latestTasksWithUniqueParent.map(uniqueTask => {
        // if parent task wasn`t updated in the time period, display latest subtask hours & timestam as tasks group`s parent
        let parentTaskWithLatestTimestamp = Object.assign(Object.assign({}, uniqueTask), { isParent: true });
        // check if parent task of the uniqueTask was updated in the time period
        const parentTasksUpdates = tickets
            .filter(task => task.key === uniqueTask.parent.key)
            .sort((a, b) => b.timestamp - a.timestamp);
        if (parentTasksUpdates.length) {
            // pick latest parent task update
            const parentTask = parentTasksUpdates[0];
            // if parent task was modifified, display it as tasks group`s parent, but with latest subtask timestamp
            parentTaskWithLatestTimestamp = Object.assign(Object.assign({}, parentTask), { timestamp: uniqueTask.timestamp, isParent: true });
        }
        const allSubtasks = tickets.filter(task => task.parent.key === uniqueTask.parent.key);
        return Object.assign(Object.assign({}, parentTaskWithLatestTimestamp), { subtasks: [...allSubtasks] });
    });
    const formattedTableData = parentTaskWithSubTasks.map(ticket => {
        var _a, _b, _c;
        const formattedTicket = {
            'date event': ticket.timestamp,
            'transition from': ticket.transition_from,
            'transition to': ticket.transition_to,
            sprint: (_a = ticket.sprint) !== null && _a !== void 0 ? _a : '',
            'ticket key': ticket.key,
            type: ticket.type,
            summary: ticket.summary,
            hours: ticket.hours,
            label: (_b = ticket.parent.label
                .split(' ')
                .map(word => word[0].toUpperCase() + word.slice(1))
                .join(' ')) !== null && _b !== void 0 ? _b : '',
            confidence: +ticket.parent.predictions[0].value,
            subtasks: ((_c = ticket === null || ticket === void 0 ? void 0 : ticket.subtasks) === null || _c === void 0 ? void 0 : _c.length)
                ? ticket.subtasks.map(subtask => {
                    var _a;
                    return {
                        'date event': subtask.timestamp,
                        'transition from': subtask.transition_from,
                        'transition to': subtask.transition_to,
                        sprint: (_a = subtask.sprint) !== null && _a !== void 0 ? _a : '',
                        'ticket key': subtask.key,
                        type: subtask.type,
                        summary: subtask.summary,
                        hours: subtask.hours,
                        label: '',
                        confidence: +ticket.parent.predictions[0].value,
                    };
                })
                : null,
        };
        return formattedTicket;
    });
    return (React.createElement(Grid, { item: true, xs: 12 },
        React.createElement(TableContainer, null,
            React.createElement(Table, { "aria-label": "collapsible table" },
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, { padding: "normal" }),
                        React.createElement(TableCell, { padding: "none" }, "Date Event"),
                        React.createElement(TableCell, { padding: "normal" }, "From"),
                        React.createElement(TableCell, { padding: "none" }, "To"),
                        React.createElement(TableCell, { padding: "normal" }, "Sprint"),
                        React.createElement(TableCell, { padding: "none" }, "Ticket key"),
                        React.createElement(TableCell, { padding: "normal" }, "Type"),
                        React.createElement(TableCell, { padding: "none", size: "medium" }, "Description"),
                        React.createElement(TableCell, { padding: "normal" }, "Hours"),
                        React.createElement(TableCell, { padding: "none" }, "Label"),
                        React.createElement(TableCell, { padding: "normal" }, "Confidence"))),
                React.createElement(TableBody, null, formattedTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (React.createElement(Row, { key: row['date event'], row: row })))))),
        React.createElement(TablePagination, { rowsPerPageOptions: [10, 25, 100], component: "div", count: formattedTableData.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })));
};
function Row(props) {
    var _a;
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(TableRow, null,
            React.createElement(TableCell, { style: { width: '3%', paddingTop: 4, paddingBottom: 4 } },
                React.createElement(IconButton
                // aria-label="expand row"
                , { 
                    // aria-label="expand row"
                    onClick: () => setOpen(!open) }, open ? React.createElement(KeyboardArrowUp, null) : React.createElement(KeyboardArrowDown, null))),
            React.createElement(TableCell, { padding: "none", component: "th", scope: "row", style: { width: '10%', paddingTop: 4, paddingBottom: 4 } }, row['date event']),
            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 } }, row['transition from']),
            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 }, padding: "none" }, row['transition to']),
            React.createElement(TableCell, { style: { width: '8%', paddingTop: 4, paddingBottom: 4 } }, row.sprint),
            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 }, padding: "none" }, row['ticket key']),
            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 } }, row.type),
            React.createElement(TableCell, { style: { width: '30%', paddingTop: 4, paddingBottom: 4 }, padding: "none", size: "medium" }, row.summary),
            React.createElement(TableCell, { style: { width: '5%', paddingTop: 4, paddingBottom: 4 } }, row.hours),
            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 }, padding: "none" }, row.label),
            React.createElement(TableCell, { style: { width: '9%', paddingTop: 4, paddingBottom: 4 } },
                React.createElement(LinearGauge, { value: row.confidence }))),
        React.createElement(TableRow, null,
            React.createElement(TableCell, { style: {
                    paddingBottom: 0,
                    paddingTop: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                }, colSpan: 12 },
                React.createElement(Collapse, { in: open, timeout: "auto", unmountOnExit: true },
                    React.createElement(Table, null,
                        React.createElement(TableBody, null, (_a = row === null || row === void 0 ? void 0 : row.subtasks) === null || _a === void 0 ? void 0 : _a.map((subtask) => (React.createElement(TableRow, { key: subtask['ticket key'] },
                            React.createElement(TableCell, { style: { width: '3%', paddingTop: 4, paddingBottom: 4 } },
                                React.createElement("div", { style: { width: 48, opacity: 0 } }, " test")),
                            React.createElement(TableCell, { style: { width: '10%', paddingTop: 4, paddingBottom: 4 }, padding: "none", component: "th", scope: "row" }, subtask['date event']),
                            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 } }, subtask['transition from']),
                            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 }, padding: "none" }, subtask['transition to']),
                            React.createElement(TableCell, { style: { width: '8%', paddingTop: 4, paddingBottom: 4 } }, subtask.sprint),
                            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 }, padding: "none" }, subtask['ticket key']),
                            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 } }, subtask.type),
                            React.createElement(TableCell, { style: { width: '30%', paddingTop: 4, paddingBottom: 4 }, padding: "none", size: "medium" }, subtask.summary),
                            React.createElement(TableCell, { style: { width: '5%', paddingTop: 4, paddingBottom: 4 } }, subtask.hours),
                            React.createElement(TableCell, { style: { width: '7%', paddingTop: 4, paddingBottom: 4 }, padding: "none" }, row.label),
                            React.createElement(TableCell, { style: { width: '9%', paddingTop: 4, paddingBottom: 4 } },
                                React.createElement(LinearGauge, { value: row.confidence }))))))))))));
}
