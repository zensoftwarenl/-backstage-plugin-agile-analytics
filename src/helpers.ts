import moment from 'moment';
import { Ticket } from './api/types';

// encoding
export function encodeApiKey(key: string): string {
  const encoded = Buffer.from(`${key}`).toString('base64');
  return encoded;
}

// timeperiod
export function getStartDate(
  amount: number,
  period: 'days' | 'months',
): number {
  return moment()
    .set({ hours: 0, minutes: 0, seconds: 0 })
    .subtract(amount, period)
    .unix();
}

export function getEndDate(): number {
  return moment().set({ hours: 23, minutes: 59, seconds: 59 }).unix();
}

// si page
export function getUniqueListByParent(arr: Ticket[]) {
  const uniqueListOfLatest: Ticket[] = arr.reduce(
    (acc: Ticket[], item: Ticket) => {
      const isInList = acc.find(
        ticket => ticket.parent.key === item.parent.key,
      );
      if (isInList) {
        const isLater = item.timestamp >= isInList.timestamp;
        if (isLater) {
          return acc.map(task => {
            if (task.parent.key === item.parent.key) {
              return item;
            }
            return task;
          });
        }
        return acc;
      }
      return [...acc, item];
    },
    [],
  );

  return uniqueListOfLatest;
}
