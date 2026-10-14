# React

`@switchboard/react` wraps the core engine with a provider, hooks, and a panel component.

## Install

```bash
pnpm add @switchboard/react @switchboard/core
```

Optional:

```bash
pnpm add @switchboard/devtools @switchboard/api-mock
```

## Provider

Pass either a pre-built `instance` or a `config` object (an instance is created for you).

```tsx
import { SwitchboardProvider, SwitchboardPanel } from '@switchboard/react';
import { exampleSwitchboard } from './switchboard';

export function App() {
  return (
    <SwitchboardProvider instance={exampleSwitchboard}>
      <Routes />
      {import.meta.env.DEV && <SwitchboardPanel />}
    </SwitchboardProvider>
  );
}
```

```tsx
<SwitchboardProvider
  config={{
    features: { newDashboard: false },
    user: { role: 'admin' },
    persistence: 'memory',
  }}
>
  {children}
</SwitchboardProvider>
```

## Hooks

### `useSwitchboard`

Returns the instance API surface commonly needed in components (`reset`, `getState`-driven fields, etc.) plus access patterns used by other hooks.

```tsx
const { reset, instance } = useSwitchboard();
instance.deactivateScenario();
```

### `useFeatureFlag(name)`

```tsx
const { enabled, setEnabled, meta } = useFeatureFlag('newDashboard');
```

### `useUserContext`

```tsx
const { user, setUser, resetUser } = useUserContext();
```

### `useScenario`

```tsx
const {
  scenarios,
  activeScenarioId,
  activateScenario,
  createScenario,
  saveCurrentAsScenario,
  exportScenarios,
  importScenarios,
  duplicateScenario,
  deleteScenario,
  updateScenario,
} = useScenario();
```

To deactivate from React:

```tsx
const { instance } = useSwitchboard();
instance.deactivateScenario();
```

The developer panel also provides **Deactivate** on the Scenarios tab.

### `useApiMock`

```tsx
const {
  responsePresets,
  apiMocks,
  effectiveApiMocks,
  createApiMock,
  updateApiMock,
  setApiMockEnabled,
} = useApiMock();
```

### `useSwitchboardSelector(selector)`

Subscribe to a sliced piece of state with `useSyncExternalStore` semantics:

```tsx
const role = useSwitchboardSelector((state) => state.user.role);
```

## Panel

```tsx
import { SwitchboardPanel } from '@switchboard/react';

{import.meta.env.DEV && <SwitchboardPanel />}
```

See [Developer Panel](/developer-panel).

## Enabling API mocks

Do this once near app bootstrap (not inside every component render):

```ts
import { enableApiMock } from '@switchboard/api-mock';
import { exampleSwitchboard } from './switchboard';

if (import.meta.env.DEV) {
  enableApiMock(exampleSwitchboard);
}
```

## Example app

```bash
pnpm --filter @switchboard/example-react-next dev
pnpm --filter @switchboard/example-react-vite dev
```

Employee BO UI with role gating, feature flags, and API failure scenarios over real Next APIs.
