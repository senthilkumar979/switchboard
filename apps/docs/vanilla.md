# Vanilla JavaScript

Use `@switchboard-js/core` directly and optionally register the Web Component panel from `@switchboard-js/devtools`.

## Core only

```ts
import { createSwitchboard } from '@switchboard-js/core';

const switchboard = createSwitchboard({
  features: { newDashboard: false },
  user: { role: 'admin' },
});

const button = document.querySelector('#toggle');
button?.addEventListener('click', () => {
  switchboard.setFeature('newDashboard', !switchboard.isEnabled('newDashboard'));
});

switchboard.subscribe((state) => {
  document.body.dataset.dashboard = String(state.features.newDashboard);
});
```

## With the developer panel

```ts
import { createSwitchboard } from '@switchboard-js/core';
import { registerSwitchboardPanel } from '@switchboard-js/devtools';
import { enableApiMock } from '@switchboard-js/api-mock';

registerSwitchboardPanel();

const switchboard = createSwitchboard({
  features: { newDashboard: false },
  scenarios: [{ id: 'admin', name: 'Admin', features: { newDashboard: true } }],
});

enableApiMock(switchboard);

const panel = document.createElement('switchboard-panel');
panel.switchboard = switchboard;
panel.open = true;
document.body.append(panel);
```

### Panel element API

| Property | Type | Description |
| --- | --- | --- |
| `switchboard` | `Switchboard \| null` | Instance to control |
| `open` | `boolean` | Drawer open state |

Prefs (theme, dock side, last tab) persist in `localStorage` under `switchboard-panel-prefs`.

## Without a framework build step

Bundle with Vite/esbuild or load from your package CDN strategy. The panel uses Shadow DOM and does not require React.

## Example

See `examples/vanilla` in the monorepo (scaffold; React Vite example is the most complete demo today).
