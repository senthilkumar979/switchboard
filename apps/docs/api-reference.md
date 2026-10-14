# API Reference

Primary entry: `@switchboard/core`.

Related packages: `@switchboard/react`, `@switchboard/devtools`, `@switchboard/api-mock`.

---

## `createSwitchboard(config?)`

Creates a Switchboard instance.

```ts
import { createSwitchboard } from '@switchboard/core';

const switchboard = createSwitchboard({
  features: { newDashboard: false },
  user: { role: 'customer' },
  environment: 'development',
  environments: {
    staging: { features: { newDashboard: true } },
  },
  scenarios: [],
  responsePresets: [],
  apiMocks: [],
  urlScenarioParam: 'scenario',
  persistence: 'memory',
  persistenceKey: 'switchboard',
  onError: (error) => console.warn(error),
});
```

### `SwitchboardConfig`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `features` | `Record<string, boolean \| FeatureDefinition>` | `{}` | Initial flags |
| `user` | `UserContext` | `{}` | Simulated user |
| `environment` | `string` | `"development"` | Active environment |
| `environments` | `Record<string, EnvironmentPreset>` | — | Presets on env switch |
| `scenarios` | `Scenario[]` | — | Initial scenarios |
| `responsePresets` | `MockJsonPreset[]` | — | Named JSON bodies |
| `apiMocks` | `ApiMockRule[]` | — | Global mock rules |
| `urlScenarioParam` | `string \| false` | `"scenario"` | URL activation param |
| `persistence` | adapter \| `'memory'` \| `'localStorage'` \| `false` | `'memory'` | Persistence |
| `persistenceKey` | `string` | `"switchboard"` | Storage key |
| `onError` | `(error: Error) => void` | — | Soft-fail callback |

---

## Features

```ts
switchboard.isEnabled(name: string): boolean
switchboard.getFeature(name: string): boolean | undefined
switchboard.getFeatures(): Record<string, boolean>
switchboard.setFeature(name: string, enabled: boolean): void
switchboard.registerFeature(name: string, definition: FeatureInput): void
```

### `FeatureDefinition`

```ts
{
  default: boolean
  group?: string
  description?: string
  environments?: Record<string, boolean>
}
```

---

## User

```ts
switchboard.getUser(): UserContext
switchboard.setUser(partial: Partial<UserContext>): void
switchboard.resetUser(): void
```

---

## Environment

```ts
switchboard.getEnvironment(): string
switchboard.setEnvironment(name: string): void
```

---

## Scenarios

```ts
switchboard.createScenario(scenario: Scenario): void
switchboard.updateScenario(id: string, patch: Partial<Omit<Scenario, 'id'>>): void
switchboard.deleteScenario(id: string): void
switchboard.getScenario(id: string): Scenario | undefined
switchboard.getScenarios(): Scenario[]
switchboard.activateScenario(id: string): void
switchboard.deactivateScenario(): void
switchboard.getActiveScenarioId(): string | null
switchboard.duplicateScenario(id: string, newId?: string): Scenario
switchboard.exportScenarios(): string
switchboard.importScenarios(json: string): void
```

### `Scenario`

```ts
{
  id: string
  name: string
  features?: Record<string, boolean>
  user?: UserContext
  environment?: string
  metadata?: Record<string, unknown>
  apiMocks?: ApiMockRule[]
}
```

---

## Response presets & API mocks

```ts
switchboard.createResponsePreset(preset: MockJsonPreset): void
switchboard.updateResponsePreset(id: string, patch: Partial<Omit<MockJsonPreset, 'id'>>): void
switchboard.deleteResponsePreset(id: string): void
switchboard.getResponsePresets(): MockJsonPreset[]

switchboard.createApiMock(rule: ApiMockRule): void
switchboard.updateApiMock(id: string, patch: Partial<Omit<ApiMockRule, 'id'>>): void
switchboard.deleteApiMock(id: string): void
switchboard.getApiMocks(): ApiMockRule[]
switchboard.setApiMockEnabled(id: string, enabled: boolean): void
switchboard.getEffectiveApiMocks(): ApiMockRule[]
```

### `ApiMockRule`

```ts
{
  id: string
  url: string              // pathname
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | '*'
  statusCode: number
  responsePresetId: string | 'other'
  customJson?: unknown     // when responsePresetId is 'other'
  enabled: boolean
}
```

### `MockJsonPreset`

```ts
{ id: string; name: string; json: unknown }
```

`API_MOCK_STATUS_CODES` — readonly list of status codes offered by the panel picker.

---

## State & lifecycle

```ts
switchboard.getState(): SwitchboardState
switchboard.subscribe(listener: (state: SwitchboardState) => void): () => void
switchboard.reset(): void
```

### `SwitchboardState`

```ts
{
  features: Record<string, boolean>
  featureMeta: Record<string, FeatureMeta>
  user: UserContext
  environment: string
  scenarios: Record<string, Scenario>
  activeScenarioId: string | null
  responsePresets: Record<string, MockJsonPreset>
  apiMocks: Record<string, ApiMockRule>
}
```

---

## `@switchboard/api-mock`

```ts
import { enableApiMock } from '@switchboard/api-mock';

const dispose = enableApiMock(switchboard);
dispose();
```

Also exported: `findMatchingApiMock`, `matchApiMockRule`, `getRequestPathname`, `getRequestMethod`, `resolveMockResponseBody`.

---

## `@switchboard/devtools`

```ts
import {
  registerSwitchboardPanel,
  SwitchboardPanelElement,
  serializeState,
  parseImportPayload,
  applyImportPayload,
} from '@switchboard/devtools';
```

| Export | Description |
| --- | --- |
| `registerSwitchboardPanel()` | Defines `<switchboard-panel>` once |
| `serializeState(state)` | JSON export helper |
| `parseImportPayload(json)` | Validates import JSON |
| `applyImportPayload(instance, payload)` | Applies import |

---

## `@switchboard/react`

| Export | Description |
| --- | --- |
| `SwitchboardProvider` | Context provider (`instance` or `config`) |
| `SwitchboardPanel` | React wrapper around the Web Component |
| `useSwitchboard` | Instance helpers |
| `useFeatureFlag` | Flag read/write |
| `useUserContext` | User read/write |
| `useScenario` | Scenario helpers |
| `useApiMock` | Preset/mock helpers |
| `useSwitchboardSelector` | Selective subscription |

Also re-exports `createSwitchboard` and common core types.

---

## Errors

`SwitchboardValidationError` — thrown for invalid config, scenarios, presets, or mock rules.
