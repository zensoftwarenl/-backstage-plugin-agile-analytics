# [Agile Analytics](https://www.prod.agileanalytics.cloud)

Welcome to the Backstage Agile Analytics
This plugin adds Agile Analytics' Reporting to your Backstage environment.

## Install

```
# From your Backstage root directory
yarn add --cwd packages/app @zensoftwarenl/backstage-plugin-agile-analytics
```

## Configure

### Configure Agile Analytics organisation

Add below configuration in the `app-config.yaml`

```
agileAnalytics:
  apiKey: ${AGILE_ANALYTICS_API_KEY}
  orgHash: ${AGILE_ANALYTICS_ORG_HASH}
```

API Key can be created [here](https://www.prod.agileanalytics.cloud/settings/api-key).
OrgHash can be found [here](https://www.prod.agileanalytics.cloud/settings/organisation).

### Setup Agile Analytics Tab

In `App.tsx`

```
import { AgileAnalyticsPage } from '@zensoftwarenl/backstage-plugin-agile-analytics';

...

const routes = (
  <FlatRoutes>
    // other routes
    <Route
      path="/agile-analytics"
      element={<AgileAnalyticsPage />}
    />
    // other routes
  </FlatRoutes>
);

...
const App = () => (
  <AppProvider>
    // ...
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);
```

_In order to add Agile Analytics to the Backstage sidebar_, in `components/` `Root.tsx`:

```
<SidebarItem icon={MapIcon} to="agile-analytics" text="Agile Analytics" />
```
