/* eslint-disable no-console */
import React, { useState } from 'react';
import { LinearGauge } from '@backstage/core-components';
import {
  Collapse,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { RowFormattedTicket, Ticket, Timeperiod } from '../../api/types';
import { getUniqueListByParent } from '../../helpers';

export const AaSprintInsightsTable = ({
  timeperiod,
  tickets,
}: {
  timeperiod: Timeperiod;
  tickets: Ticket[];
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const latestTasksWithUniqueParent = getUniqueListByParent(tickets).sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  const parentTaskWithSubTasks: Ticket[] = latestTasksWithUniqueParent.map(
    uniqueTask => {
      // if parent task wasn`t updated in the time period, display latest subtask hours & timestam as tasks group`s parent
      let parentTaskWithLatestTimestamp = { ...uniqueTask, isParent: true };

      // check if parent task of the uniqueTask was updated in the time period
      const parentTasksUpdates = tickets
        .filter(task => task.key === uniqueTask.parent.key)
        .sort((a, b) => b.timestamp - a.timestamp);

      if (parentTasksUpdates.length) {
        // pick latest parent task update
        const parentTask = parentTasksUpdates[0];

        // if parent task was modifified, display it as tasks group`s parent, but with latest subtask timestamp
        parentTaskWithLatestTimestamp = {
          ...parentTask,
          timestamp: uniqueTask.timestamp,
          isParent: true,
        };
      }

      const allSubtasks = tickets.filter(
        task => task.parent.key === uniqueTask.parent.key,
      );

      return { ...parentTaskWithLatestTimestamp, subtasks: [...allSubtasks] };
    },
  );

  const formattedTableData = parentTaskWithSubTasks.map(ticket => {
    const formattedTicket = {
      'date event': ticket.timestamp,
      'transition from': ticket.transition_from,
      'transition to': ticket.transition_to,
      sprint: ticket.sprint ?? '',
      'ticket key': ticket.key,
      type: ticket.type,
      summary: ticket.summary,
      hours: ticket.hours,
      label:
        ticket.parent.label
          .split(' ')
          .map(word => word[0].toUpperCase() + word.slice(1))
          .join(' ') ?? '',
      confidence: +ticket.parent.predictions[0].value,
      subtasks: ticket?.subtasks?.length
        ? ticket.subtasks.map(subtask => {
            return {
              'date event': subtask.timestamp,
              'transition from': subtask.transition_from,
              'transition to': subtask.transition_to,
              sprint: subtask.sprint ?? '',
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

  return (
    <Grid item xs={12}>
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell padding="normal" />
              <TableCell padding="none">Date Event</TableCell>
              <TableCell padding="normal">From</TableCell>
              <TableCell padding="none">To</TableCell>
              <TableCell padding="normal">Sprint</TableCell>
              <TableCell padding="none">Ticket key</TableCell>
              <TableCell padding="normal">Type</TableCell>
              <TableCell padding="none" size="medium">
                Description
              </TableCell>
              <TableCell padding="normal">Hours</TableCell>
              <TableCell padding="none">Label</TableCell>
              <TableCell padding="normal">Confidence</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formattedTableData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => (
                <Row key={row['date event']} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={formattedTableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

function Row(props: { row: RowFormattedTicket }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell style={{ width: '3%', paddingTop: 4, paddingBottom: 4 }}>
          <IconButton
            // aria-label="expand row"

            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell
          padding="none"
          component="th"
          scope="row"
          style={{ width: '10%', paddingTop: 4, paddingBottom: 4 }}
        >
          {row['date event']}
        </TableCell>
        <TableCell style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}>
          {row['transition from']}
        </TableCell>
        <TableCell
          style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}
          padding="none"
        >
          {row['transition to']}
        </TableCell>
        <TableCell style={{ width: '8%', paddingTop: 4, paddingBottom: 4 }}>
          {row.sprint}
        </TableCell>
        <TableCell
          style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}
          padding="none"
        >
          {row['ticket key']}
        </TableCell>
        <TableCell style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}>
          {row.type}
        </TableCell>
        <TableCell
          style={{ width: '30%', paddingTop: 4, paddingBottom: 4 }}
          padding="none"
          size="medium"
        >
          {row.summary}
        </TableCell>
        <TableCell style={{ width: '5%', paddingTop: 4, paddingBottom: 4 }}>
          {row.hours}
        </TableCell>
        <TableCell
          style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}
          padding="none"
        >
          {row.label}
        </TableCell>
        <TableCell style={{ width: '9%', paddingTop: 4, paddingBottom: 4 }}>
          <LinearGauge value={row.confidence} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          colSpan={12}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table>
              <TableBody>
                {row?.subtasks?.map((subtask: any) => (
                  <TableRow key={subtask['ticket key']}>
                    <TableCell
                      style={{ width: '3%', paddingTop: 4, paddingBottom: 4 }}
                    >
                      <div style={{ width: 48, opacity: 0 }}> test</div>
                    </TableCell>
                    {/* <TableCell style={{ width: '3%' }} /> */}
                    <TableCell
                      style={{ width: '10%', paddingTop: 4, paddingBottom: 4 }}
                      padding="none"
                      component="th"
                      scope="row"
                    >
                      {subtask['date event']}
                    </TableCell>
                    <TableCell
                      style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}
                    >
                      {subtask['transition from']}
                    </TableCell>
                    <TableCell
                      style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}
                      padding="none"
                    >
                      {subtask['transition to']}
                    </TableCell>
                    <TableCell
                      style={{ width: '8%', paddingTop: 4, paddingBottom: 4 }}
                    >
                      {subtask.sprint}
                    </TableCell>
                    <TableCell
                      style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}
                      padding="none"
                    >
                      {subtask['ticket key']}
                    </TableCell>
                    <TableCell
                      style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}
                    >
                      {subtask.type}
                    </TableCell>
                    <TableCell
                      style={{ width: '30%', paddingTop: 4, paddingBottom: 4 }}
                      padding="none"
                      size="medium"
                    >
                      {subtask.summary}
                    </TableCell>
                    <TableCell
                      style={{ width: '5%', paddingTop: 4, paddingBottom: 4 }}
                    >
                      {subtask.hours}
                    </TableCell>
                    <TableCell
                      style={{ width: '7%', paddingTop: 4, paddingBottom: 4 }}
                      padding="none"
                    >
                      {row.label}
                    </TableCell>
                    <TableCell
                      style={{ width: '9%', paddingTop: 4, paddingBottom: 4 }}
                    >
                      <LinearGauge value={row.confidence} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
