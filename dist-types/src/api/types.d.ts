import { DiscoveryApi } from '@backstage/core-plugin-api';
export type ApiConstructorOptions = {
    discoveryApi: DiscoveryApi;
    proxyPath?: string;
};
export type OrganisationDataOptions = {
    apiKey: string;
    orgHash: string;
};
export type OrganisationDataResponse = {
    orgHash: string;
    orgName: string;
    usersNumber: number;
    status: string;
    subscription: string;
};
export type Ticket = {
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
export type RowFormattedTicket = {
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
export type SiDataOptions = {
    apiKey: string;
    orgHash: string;
    dateStart: number;
    dateEnd: number;
};
export type SiDataResponse = {
    featuresAmount: number;
    notFeaturesAmount: number;
    featuresTime: number;
    notFeaturesTime: number;
    tickets: Ticket[];
};
export type Deployment = {
    environment: string;
    provider: string;
    repository: string;
    status: string;
    user: string;
    timestamp: number;
};
export type DeploymentFreqResponse = Deployment[];
export type LeadTimeEvent = {
    key: string;
    provider: string;
    repository: string;
    lead_time_for_changes: number;
    lead_time: number;
    cycle_time: number;
    timestamp: number;
};
export type LeadTimeResponse = LeadTimeEvent[];
export type RiskChartResponse = {
    low: number;
    medium: number;
    high: number;
};
export type LeaksStatisticsItem = {
    date: string;
    leaks_fixed: number;
    leaks_quantity: number;
};
export type LeaksResponse = {
    statistics: LeaksStatisticsItem[];
};
export type Timeperiod = {
    value: string;
    label: string;
    date_start: number;
    date_end: number;
};
export type ReposDataOptions = {
    apiKey: string;
    orgHash: string;
};
export type Repo = {
    provider: string;
    provider_id: string;
    repositories: {
        name: string;
        url: string;
        webhook: boolean;
    }[];
};
export type ReposDataResponse = Repo[];
export type FilterRepo = {
    name: string;
    url: string;
    webhook: boolean;
    group: string;
    isSelected: boolean;
};
export type Option = {
    value: string;
    label: string;
};
export type DoraChart = {
    title: Option;
    name: string;
    type: string;
    data: any[];
};
export type DoraSeries = {
    name: string;
    type: string;
    data: any[];
    stickyTracking: boolean;
};
export type RiskChartData = {
    repo_name: string;
    repo_url: string;
    table_rows: number;
};
