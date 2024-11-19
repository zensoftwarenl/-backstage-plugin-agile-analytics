import { Ticket } from './api/types';
export declare function encodeApiKey(key: string): string;
export declare function getStartDate(amount: number, period: 'days' | 'months'): number;
export declare function getEndDate(): number;
export declare function getUniqueListByParent(arr: Ticket[]): Ticket[];
