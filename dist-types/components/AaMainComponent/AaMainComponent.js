var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { Header, Page, HeaderLabel, Progress, } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { agileAnalyticsApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import Alert from '@material-ui/lab/Alert';
import { AaContentComponent } from '../AaContentComponent';
export const AaMainComponent = () => {
    var _a, _b;
    const api = useApi(agileAnalyticsApiRef);
    const config = useApi(configApiRef);
    const orgHash = config.getString('agileAnalytics.orgHash');
    const apiKey = config.getString('agileAnalytics.apiKey');
    const organisationState = useAsync(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.getOrganisationData({
            orgHash,
            apiKey,
        });
        return response;
    }), []);
    return (React.createElement(Page, { themeId: "tool" },
        React.createElement(Header
        // title="Agile Analytics"
        , { 
            // title="Agile Analytics"
            title: ((_a = organisationState === null || organisationState === void 0 ? void 0 : organisationState.value) === null || _a === void 0 ? void 0 : _a.orgName)
                ? organisationState.value.orgName.trim()
                : 'Agile Analytics', subtitle: `${((_b = organisationState === null || organisationState === void 0 ? void 0 : organisationState.value) === null || _b === void 0 ? void 0 : _b.orgName)
                ? organisationState.value.orgName.trim()
                : 'Your company'}'s essential metrics from Agile Analytics` },
            React.createElement(HeaderLabel, { label: "Owner", value: "Zen Software" }),
            React.createElement(HeaderLabel, { label: "Lifecycle", value: "Alpha" })),
        (organisationState === null || organisationState === void 0 ? void 0 : organisationState.loading) ? React.createElement(Progress, null) : null,
        (organisationState === null || organisationState === void 0 ? void 0 : organisationState.error) ? (React.createElement(Alert, { severity: "error" }, organisationState === null || organisationState === void 0 ? void 0 : organisationState.error.message)) : null,
        !organisationState.loading && !organisationState.error ? (React.createElement(AaContentComponent, { orgData: organisationState === null || organisationState === void 0 ? void 0 : organisationState.value })) : null));
};
