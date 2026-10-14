# `@switchboard/react`

React bindings for Switchboard: provider, hooks, and panel wrapper.

## Install

```bash
pnpm add @switchboard/react @switchboard/core
```

## Quick example

```tsx
import { SwitchboardProvider, useFeatureFlag, SwitchboardPanel } from '@switchboard/react';

export function App() {
  return (
    <SwitchboardProvider config={{ features: { newDashboard: false } }}>
      <Main />
      {import.meta.env.DEV && <SwitchboardPanel />}
    </SwitchboardProvider>
  );
}
```

## Docs

See the monorepo docs site (`apps/docs`) — React guide and API reference.
