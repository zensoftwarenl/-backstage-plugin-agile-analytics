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
import { AaMainComponent } from './AaMainComponent';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers, renderInTestApp, } from '@backstage/test-utils';
describe('AaMainComponent', () => {
    const server = setupServer();
    // Enable sane handlers for network requests
    setupRequestMockHandlers(server);
    // setup mock response
    beforeEach(() => {
        server.use(rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))));
    });
    it('should render', () => __awaiter(void 0, void 0, void 0, function* () {
        const rendered = yield renderInTestApp(React.createElement(ThemeProvider, { theme: lightTheme },
            React.createElement(AaMainComponent, null)));
        expect(rendered.getByText('Welcome to agile-analytics!')).toBeInTheDocument();
    }));
});
