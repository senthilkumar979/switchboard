# Installation

## Requirements

- Node.js 20+
- A bundler that supports ES modules (Vite, Next.js, Webpack 5, etc.)

## Packages

Install only what you need.

| Package | Install when you need… |
| --- | --- |
| `@switchboard-js/core` | Always — the engine |
| `@switchboard-js/react` | React provider and hooks |
| `@switchboard-js/devtools` | Web Component panel (also re-exported via React) |
| `@switchboard-js/api-mock` | `fetch` interception for mock rules |

### npm / pnpm / yarn

```bash
# Core only
pnpm add @switchboard-js/core

# Typical React + panel + mocks setup
pnpm add @switchboard-js/core @switchboard-js/react @switchboard-js/devtools @switchboard-js/api-mock
```

```bash
npm install @switchboard-js/core @switchboard-js/react @switchboard-js/devtools @switchboard-js/api-mock
```

```bash
yarn add @switchboard-js/core @switchboard-js/react @switchboard-js/devtools @switchboard-js/api-mock
```

## Peer dependencies

- `@switchboard-js/react` expects **React 18 or 19**
- `@switchboard-js/devtools` has no UI framework peers (Shadow DOM Web Component)
- `@switchboard-js/api-mock` depends on `@switchboard-js/core` and patches global `fetch`

## TypeScript

All public packages ship `.d.ts` files. Import types from `@switchboard-js/core` or re-exports on `@switchboard-js/react`.

```ts
import type { SwitchboardConfig, Scenario, ApiMockRule } from '@switchboard-js/core';
```

## Tree-shaking and production

Keep the panel and `enableApiMock` behind development checks so production bundles can drop them:

```ts
if (import.meta.env.DEV) {
  const { enableApiMock } = await import('@switchboard-js/api-mock');
  enableApiMock(switchboard);
}
```

```tsx
{import.meta.env.DEV && <SwitchboardPanel />}
```

## Monorepo development

```bash
pnpm install
pnpm build
pnpm --filter @switchboard-js/docs dev
pnpm --filter @switchboard-js/example-react-next dev
pnpm --filter @switchboard-js/example-react-vite dev
```
