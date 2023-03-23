import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { AgileAnalyticsAPIClient, agileAnalyticsApiRef } from './api';
import { rootRouteRef } from './routes';

export const agileAnalyticsPlugin = createPlugin({
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

export const AgileAnalyticsPage = agileAnalyticsPlugin.provide(
  createRoutableExtension({
    name: 'AgileAnalyticsPage',
    component: () =>
      import('./components/AaMainComponent').then(m => m.AaMainComponent),
    mountPoint: rootRouteRef,
  }),
);
