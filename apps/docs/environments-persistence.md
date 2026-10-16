# Environments & Persistence

## Environments

The active environment is a string (default `"development"`). Definitions can supply per-environment feature defaults, and `environments` presets can bundle feature/user overrides when switching.

```ts
createSwitchboard({
  environment: 'staging',
  environments: {
    staging: {
      features: { newDashboard: true },
      user: { role: 'qa' },
    },
    production: {
      features: { newDashboard: false },
    },
  },
  features: {
    newDashboard: {
      default: false,
      environments: {
        staging: true,
        production: false,
      },
    },
  },
});

switchboard.setEnvironment('production');
switchboard.getEnvironment(); // "production"
```

Use environments to mirror how your app talks about deploy targets — Switchboard does not deploy anything; it only changes local simulation state.

## Persistence

### Options

```ts
createSwitchboard({
  persistence: 'memory', // default
  // persistence: 'localStorage',
  // persistence: false,
  // persistence: myAdapter,
  persistenceKey: 'switchboard', // storage key
  onError: (error) => console.warn(error),
});
```

| Value | Use when |
| --- | --- |
| `'memory'` | Defaults; fine for demos and most local work |
| `'localStorage'` | You want flags/scenarios to survive reloads |
| `false` | Tests or ephemeral sessions |
| Custom adapter | Sync to IndexedDB, sessionStorage, etc. |

### Custom adapter

```ts
import type { PersistenceAdapter } from '@switchboard-js/core';

const sessionAdapter: PersistenceAdapter = {
  name: 'sessionStorage',
  get(key) {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  },
  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    sessionStorage.removeItem(key);
  },
};
```

### Snapshot version

Persisted data uses `version: 1` and may include features, user, environment, scenarios, active scenario, response presets, and API mocks.

### Reset

```ts
switchboard.reset();
```

Restores the instance to the original configuration (and clears persisted overrides according to adapter behavior).
