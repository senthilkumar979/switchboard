# Getting Started

Create a Switchboard instance, read a feature flag, and optionally mount the developer panel.

## 1. Install

```bash
pnpm add @switchboard/core
```

For React apps also install the adapter (and optionally the panel + API mock packages):

```bash
pnpm add @switchboard/react @switchboard/devtools @switchboard/api-mock
```

See [Installation](/installation) for the full matrix.

## 2. Create an instance

```ts
import { createSwitchboard } from '@switchboard/core';

export const switchboard = createSwitchboard({
  features: {
    newDashboard: false,
    betaBanner: {
      default: true,
      group: 'experiments',
      description: 'Show the beta banner',
    },
  },
  user: {
    id: 'dev-user',
    name: 'Developer',
    role: 'admin',
    permissions: ['read', 'write'],
  },
  environment: 'development',
  persistence: 'memory',
});
```

## 3. Use it in UI logic

```ts
if (switchboard.isEnabled('newDashboard')) {
  // render the new dashboard
}

const { role } = switchboard.getUser();
```

Subscribe when you need reactive updates outside React:

```ts
const unsubscribe = switchboard.subscribe((state) => {
  console.log(state.features, state.user.role);
});
```

## 4. React (recommended path)

```tsx
import { SwitchboardProvider, useFeatureFlag, SwitchboardPanel } from '@switchboard/react';
import { switchboard } from './switchboard';

export function App() {
  return (
    <SwitchboardProvider instance={switchboard}>
      <MainApp />
      {import.meta.env.DEV && <SwitchboardPanel />}
    </SwitchboardProvider>
  );
}

function MainApp() {
  const { enabled, setEnabled } = useFeatureFlag('newDashboard');
  return (
    <button type="button" onClick={() => setEnabled(!enabled)}>
      newDashboard: {enabled ? 'on' : 'off'}
    </button>
  );
}
```

`SwitchboardProvider` also accepts a `config` prop instead of a pre-built `instance`.

## 5. Optional: API mocking

```ts
import { enableApiMock } from '@switchboard/api-mock';

const dispose = enableApiMock(switchboard);
// call dispose() when tearing down the app shell
```

Configure presets and rules in `createSwitchboard({ responsePresets, apiMocks, scenarios })`. Details: [API Mocking](/api-mocking).

## 6. Try the example

From the monorepo:

```bash
pnpm install
pnpm --filter @switchboard/example-react-next dev
pnpm --filter @switchboard/example-react-vite dev
```

Open http://localhost:5174 — look up `CUST-1001`, then use the Switchboard launcher for roles and API failure scenarios.

## Next

- [Feature Flags](/feature-flags)
- [Scenarios](/scenarios)
- [Developer Panel](/developer-panel)
- [API Reference](/api-reference)
