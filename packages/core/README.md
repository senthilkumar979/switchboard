# `@switchboard/core`

Framework-independent Switchboard engine: feature flags, user simulation, environments, scenarios, response presets, and API mock rules.

## Install

```bash
pnpm add @switchboard/core
```

## Quick example

```ts
import { createSwitchboard } from '@switchboard/core';

const switchboard = createSwitchboard({
  features: { newDashboard: false },
  user: { role: 'admin' },
});

switchboard.setFeature('newDashboard', true);
switchboard.isEnabled('newDashboard'); // true
```

## Docs

Full guides and API reference: run `pnpm --filter @switchboard/docs dev` in the monorepo.
