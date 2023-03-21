import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { AgileAnalyticsAPIClient, agileAnalyticsApiRef } from './api';

import { rootRouteRef } from './routes';

export const agileAnalyticsPluginPlugin = createPlugin({
  id: 'agile-analytics',
  apis: [
    createApiFactory({
      api: agileAnalyticsApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) =>
        new AgileAnalyticsAPIClient({ discoveryApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const AgileAnalyticsPluginPage = agileAnalyticsPluginPlugin.provide(
  createRoutableExtension({
    name: 'Agile Analytics Plugin Page',
    component: () =>
      import('./components/AaMainPageComponent').then(
        m => m.AaMainPageComponent,
      ),
    mountPoint: rootRouteRef,
  }),
);
