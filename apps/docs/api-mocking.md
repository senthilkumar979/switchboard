# API Mocking

`@switchboard/api-mock` patches `fetch` so matching requests return Switchboard-configured status codes and JSON bodies. Unmatched requests pass through unchanged.

## Install

```bash
pnpm add @switchboard/core @switchboard/api-mock
```

## Enable

```ts
import { createSwitchboard } from '@switchboard/core';
import { enableApiMock } from '@switchboard/api-mock';

const switchboard = createSwitchboard({
  responsePresets: [
    { id: 'order-ok', name: 'Order created', json: { orderId: '1' } },
    { id: 'pay-fail', name: 'Payment failed', json: { code: 'CARD_DECLINED' } },
  ],
  apiMocks: [
    {
      id: 'orders',
      url: '/api/orders',
      method: 'POST',
      statusCode: 201,
      responsePresetId: 'order-ok',
      enabled: true,
    },
  ],
});

const dispose = enableApiMock(switchboard);
```

Call `dispose()` to restore the previous `fetch`.

Prefer enabling only in development:

```ts
if (import.meta.env.DEV) {
  enableApiMock(switchboard);
}
```

## Matching rules

| Aspect | Behavior |
| --- | --- |
| URL | Compared to the request **pathname** (e.g. `/api/payments`) |
| Method | Optional; default `*` matches any method |
| Enabled | Disabled rules are ignored |
| Body | From the named response preset, or `customJson` when `responsePresetId === 'other'` |

### Effective mocks

```ts
switchboard.getEffectiveApiMocks();
```

- If the active scenario defines `apiMocks` → those rules only
- Otherwise → global `apiMocks`

## Scenario-specific failures

```ts
scenarios: [
  {
    id: 'order-card-fail-payment',
    name: 'Order a card — Failing at payment',
    apiMocks: [
      {
        id: 'pay',
        url: '/api/payments',
        method: 'POST',
        statusCode: 402,
        responsePresetId: 'pay-fail',
        enabled: true,
      },
    ],
  },
],
```

Activate the scenario (panel, `activateScenario`, or `?scenario=`) to swap the mock set.

## Core API

```ts
switchboard.createResponsePreset({ id: 'empty', name: 'Empty', json: {} });
switchboard.createApiMock({
  id: 'health',
  url: '/api/health',
  statusCode: 200,
  responsePresetId: 'empty',
  enabled: true,
});
switchboard.setApiMockEnabled('health', false);
switchboard.updateApiMock('health', { statusCode: 503, responsePresetId: 'other', customJson: { ok: false } });
```

## React

```tsx
const { effectiveApiMocks, createApiMock, setApiMockEnabled } = useApiMock();
```

## Panel

Use the **API** tab to enable rules and pick status/response. Response presets are configured in code (not listed as an editable section in the panel). Custom JSON appears only for **Other**.

## Helpers

Advanced matching helpers are exported for tests:

`findMatchingApiMock`, `matchApiMockRule`, `getRequestPathname`, `getRequestMethod`, `resolveMockResponseBody`.
