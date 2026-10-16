# `@switchboard-js/devtools`

Framework-independent Switchboard developer panel (`<switchboard-panel>` Web Component).

## Install

```bash
pnpm add @switchboard-js/devtools @switchboard-js/core
```

## Quick example

```ts
import { registerSwitchboardPanel } from '@switchboard-js/devtools';

registerSwitchboardPanel();
const el = document.createElement('switchboard-panel');
el.switchboard = switchboardInstance;
document.body.append(el);
```

React apps can use `SwitchboardPanel` from `@switchboard-js/react` instead.

## Docs

See **Developer Panel** in the monorepo docs site.
