import { ApiConstructorOptions, DeploymentFreqResponse, LeadTimeResponse, LeaksResponse, OrganisationDataOptions, OrganisationDataResponse, ReposDataOptions, ReposDataResponse, RiskChartResponse, SiDataOptions, SiDataResponse } from './types';
export interface AgileAnalyticsAPI {
    getOrganisationData(options: OrganisationDataOptions): Promise<OrganisationDataResponse>;
    getSiData(options: SiDataOptions): Promise<SiDataResponse>;
    getReposData(options: ReposDataOptions): Promise<ReposDataResponse>;
    getDeploymentFreqData(options: SiDataOptions): Promise<DeploymentFreqResponse>;
    getLeadTimeData(options: SiDataOptions): Promise<LeadTimeResponse>;
    getStockData(options: SiDataOptions): Promise<any>;
    getRiskChartData(options: SiDataOptions): Promise<RiskChartResponse>;
    getLeaksData(options: SiDataOptions): Promise<LeaksResponse>;
}
export declare const agileAnalyticsApiRef: import("@backstage/core-plugin-api").ApiRef<AgileAnalyticsAPI>;
export declare class AgileAnalyticsAPIClient implements AgileAnalyticsAPI {
    private readonly proxyPath;
    constructor(options: ApiConstructorOptions);
    getOrganisationData(options: OrganisationDataOptions): Promise<OrganisationDataResponse>;
    getSiData(options: SiDataOptions): Promise<SiDataResponse>;
    getReposData(options: ReposDataOptions): Promise<ReposDataResponse>;
    getDeploymentFreqData(options: SiDataOptions): Promise<DeploymentFreqResponse>;
    getLeadTimeData(options: SiDataOptions): Promise<LeadTimeResponse>;
    getStockData(options: SiDataOptions): Promise<any>;
    getRiskChartData(options: SiDataOptions): Promise<RiskChartResponse>;
    getLeaksData(options: SiDataOptions): Promise<LeaksResponse>;
}
