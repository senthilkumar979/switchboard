# Scenarios

A **scenario** is a named snapshot you can activate to put the app into a known development state. Scenarios can set features, user, environment, and optionally **replace** global API mocks.

## Define scenarios in config

```ts
createSwitchboard({
  features: { newDashboard: false },
  user: { role: 'customer' },
  scenarios: [
    {
      id: 'admin-beta',
      name: 'Admin + beta dashboard',
      features: { newDashboard: true },
      user: { role: 'admin', permissions: ['read', 'write'] },
    },
    {
      id: 'order-card-fail-payment',
      name: 'Order a card — Failing at payment',
      apiMocks: [
        {
          id: 'pay',
          url: '/api/payments',
          method: 'POST',
          statusCode: 402,
          responsePresetId: 'payment-fail',
          enabled: true,
        },
      ],
    },
  ],
});
```

### Scenario fields

| Field | Required | Description |
| --- | --- | --- |
| `id` | yes | Stable identifier |
| `name` | yes | Display label |
| `features` | no | Feature values to apply on activate |
| `user` | no | User context to apply |
| `environment` | no | Environment name to apply |
| `metadata` | no | Arbitrary notes for tooling |
| `apiMocks` | no | If present (even `[]`), **replaces** global mocks while active |

## Activate and deactivate

```ts
switchboard.activateScenario('admin-beta');
switchboard.getActiveScenarioId(); // "admin-beta"

switchboard.deactivateScenario(); // clears active id; does not auto-reset features/user
```

### URL activation

On startup, Switchboard reads `?scenario=admin-beta` (default param name `scenario`).

```ts
createSwitchboard({
  urlScenarioParam: 'scenario', // default
  // urlScenarioParam: false,   // disable
  // urlScenarioParam: 'sb',    // use ?sb=
});
```

## Programmatic CRUD

```ts
switchboard.createScenario({ id: 'x', name: 'X', features: { newDashboard: true } });
switchboard.updateScenario('x', { name: 'X renamed' });
switchboard.duplicateScenario('x'); // creates x-copy
switchboard.deleteScenario('x');
switchboard.getScenario('x');
switchboard.getScenarios();
switchboard.exportScenarios(); // JSON string
switchboard.importScenarios(json);
```

## API mocks and scenarios

- **No `apiMocks` field** on the active scenario → global `apiMocks` stay in effect
- **`apiMocks` present** → `getEffectiveApiMocks()` returns only those rules for the duration of activation

This lets a “happy path” scenario and a “payment fails” scenario own different mock sets without editing globals.

## React

```tsx
const {
  scenarios,
  activeScenarioId,
  activateScenario,
  saveCurrentAsScenario,
  exportScenarios,
  importScenarios,
} = useScenario();
```

`useScenario` does not currently expose `deactivateScenario`; call `useSwitchboard().instance.deactivateScenario()` or use the panel.

## Panel

The **Scenarios** tab lists scenarios from code:

- **Activate** / **Deactivate** on the same row as the name
- No duplicate/delete/import UI in the panel (use core APIs or code)
- Tab hidden when no scenarios are registered
