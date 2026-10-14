# `@switchboard/devtools`

Framework-independent Switchboard developer panel (`<switchboard-panel>` Web Component).

## Install

```bash
pnpm add @switchboard/devtools @switchboard/core
```

## Quick example

```ts
import { registerSwitchboardPanel } from '@switchboard/devtools';

registerSwitchboardPanel();
const el = document.createElement('switchboard-panel');
el.switchboard = switchboardInstance;
document.body.append(el);
```

React apps can use `SwitchboardPanel` from `@switchboard/react` instead.

## Docs

See **Developer Panel** in the monorepo docs site.
