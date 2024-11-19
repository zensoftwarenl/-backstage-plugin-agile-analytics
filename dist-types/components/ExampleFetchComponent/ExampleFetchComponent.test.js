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
import { render } from '@testing-library/react';
import { ExampleFetchComponent } from './ExampleFetchComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers } from '@backstage/test-utils';
describe('ExampleFetchComponent', () => {
    const server = setupServer();
    // Enable sane handlers for network requests
    setupRequestMockHandlers(server);
    // setup mock response
    beforeEach(() => {
        server.use(rest.get('https://randomuser.me/*', (_, res, ctx) => res(ctx.status(200), ctx.delay(2000), ctx.json({}))));
    });
    it('should render', () => __awaiter(void 0, void 0, void 0, function* () {
        const rendered = render(React.createElement(ExampleFetchComponent, null));
        expect(yield rendered.findByTestId('progress')).toBeInTheDocument();
    }));
});
