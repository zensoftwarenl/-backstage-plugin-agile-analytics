import { DiscoveryApi } from '@backstage/core-plugin-api';
export declare type ApiConstructorOptions = {
    discoveryApi: DiscoveryApi;
    proxyPath?: string;
};
export declare type OrganisationDataOptions = {
    apiKey: string;
    orgHash: string;
};
export declare type OrganisationDataResponse = {
    orgHash: string;
    orgName: string;
    usersNumber: number;
    status: string;
    subscription: string;
};
export declare type Ticket = {
    summary: string;
    key: string;
    hours: number;
    timestamp: number;
    parent: {
        key: string;
        label: string;
        predictions: {
            value: number;
        }[];
    };
    subtasks?: Ticket[];
    transition_from: string;
    transition_to: string;
    sprint: string;
    type: string;
    confidence: number;
};
export declare type RowFormattedTicket = {
    summary: string;
    'ticket key': string;
    hours: number;
    'date event': number;
    subtasks?: RowFormattedTicket[] | null;
    'transition from': string;
    'transition to': string;
    sprint: string;
    type: string;
    confidence: number;
    label: string;
};
export declare type SiDataOptions = {
    apiKey: string;
    orgHash: string;
    dateStart: number;
    dateEnd: number;
};
export declare type SiDataResponse = {
    featuresAmount: number;
    notFeaturesAmount: number;
    featuresTime: number;
    notFeaturesTime: number;
    tickets: Ticket[];
};
export declare type Deployment = {
    environment: string;
    provider: string;
    repository: string;
    status: string;
    user: string;
    timestamp: number;
};
export declare type DeploymentFreqResponse = Deployment[];
export declare type LeadTimeEvent = {
    key: string;
    provider: string;
    repository: string;
    lead_time_for_changes: number;
    lead_time: number;
    cycle_time: number;
    timestamp: number;
};
export declare type LeadTimeResponse = LeadTimeEvent[];
export declare type RiskChartResponse = {
    low: number;
    medium: number;
    high: number;
};
export declare type LeaksStatisticsItem = {
    date: string;
    leaks_fixed: number;
    leaks_quantity: number;
};
export declare type LeaksResponse = {
    statistics: LeaksStatisticsItem[];
};
export declare type Timeperiod = {
    value: string;
    label: string;
    date_start: number;
    date_end: number;
};
export declare type ReposDataOptions = {
    apiKey: string;
    orgHash: string;
};
export declare type Repo = {
    provider: string;
    provider_id: string;
    repositories: {
        name: string;
        url: string;
        webhook: boolean;
    }[];
};
export declare type ReposDataResponse = Repo[];
export declare type FilterRepo = {
    name: string;
    url: string;
    webhook: boolean;
    group: string;
    isSelected: boolean;
};
export declare type Option = {
    value: string;
    label: string;
};
export declare type DoraChart = {
    title: Option;
    name: string;
    type: string;
    data: any[];
};
export declare type DoraSeries = {
    name: string;
    type: string;
    data: any[];
    stickyTracking: boolean;
};
export declare type RiskChartData = {
    repo_name: string;
    repo_url: string;
    table_rows: number;
};
