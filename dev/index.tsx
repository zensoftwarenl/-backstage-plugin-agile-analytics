import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import {
  agileAnalyticsPluginPlugin,
  AgileAnalyticsPluginPage,
} from '../src/plugin';

createDevApp()
  .registerPlugin({
    ...agileAnalyticsPluginPlugin,
    __experimentalReconfigure: () => {},
  })
  .addPage({
    element: <AgileAnalyticsPluginPage />,
    title: 'Root Page',
    path: '/agile-analytics',
  })
  .render();
