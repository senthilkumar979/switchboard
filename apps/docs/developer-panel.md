# Developer Panel

The panel is a **Shadow DOM Web Component** (`<switchboard-panel>`) that attaches to a Switchboard instance. It is framework-agnostic; React apps typically use the thin `SwitchboardPanel` wrapper.

## Goals

- Fast activation of scenarios and mocks during development
- **No data-entry forms** — configure in code
- Only free-text control: custom JSON when a mock response is **Other**
- Hide tabs that have nothing to show

## Install and mount

### React

```tsx
import { SwitchboardProvider, SwitchboardPanel } from '@switchboard/react';

export function App() {
  return (
    <SwitchboardProvider config={{ features: { newDashboard: false } }}>
      <MainApp />
      {import.meta.env.DEV && <SwitchboardPanel />}
    </SwitchboardProvider>
  );
}
```

### Vanilla

```ts
import { createSwitchboard } from '@switchboard/core';
import { registerSwitchboardPanel } from '@switchboard/devtools';

registerSwitchboardPanel();

const switchboard = createSwitchboard({ features: { newDashboard: false } });
const el = document.createElement('switchboard-panel');
el.switchboard = switchboard;
document.body.append(el);
```

## Tabs

| Tab | Shown when | Controls |
| --- | --- | --- |
| Overview | always | Summary + reset all |
| Features | ≥1 feature registered | Toggle switches |
| User | User/scenario user has content | Role radios + reset user |
| Scenarios | ≥1 scenario | Activate / Deactivate |
| API | ≥1 mock rule (global or on any scenario) | Enable, status/response dropdowns, custom JSON |
| Settings | always | Theme, drawer side, reset |

If the saved active tab is hidden, the panel falls back to **Overview**.

## API tab behavior

Each mock rule is two rows:

1. URL + enable toggle
2. **Status** and **Response** dropdowns

Choosing **Other** reveals a JSON textarea + Save. Dropdowns close on outside click or panel body scroll.

When a scenario with `apiMocks` is active, the API tab edits those scenario rules; otherwise it edits global rules.

## Settings

- Light / dark theme (persisted in `localStorage` under panel prefs)
- Left / right drawer dock
- Reset all Switchboard state

Drawer width remains `min(600px, 92vw)`.

## Programmatic import / export

State JSON helpers live on `@switchboard/devtools` for tooling — not as panel textareas:

```ts
import { serializeState, parseImportPayload, applyImportPayload } from '@switchboard/devtools';

const json = serializeState(switchboard.getState());
applyImportPayload(switchboard, parseImportPayload(json));
```

Scenario JSON: `exportScenarios` / `importScenarios` on the core instance.
