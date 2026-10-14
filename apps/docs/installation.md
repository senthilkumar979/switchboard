# Installation

## Requirements

- Node.js 20+
- A bundler that supports ES modules (Vite, Next.js, Webpack 5, etc.)

## Packages

Install only what you need.

| Package | Install when you need… |
| --- | --- |
| `@switchboard/core` | Always — the engine |
| `@switchboard/react` | React provider and hooks |
| `@switchboard/devtools` | Web Component panel (also re-exported via React) |
| `@switchboard/api-mock` | `fetch` interception for mock rules |

### npm / pnpm / yarn

```bash
# Core only
pnpm add @switchboard/core

# Typical React + panel + mocks setup
pnpm add @switchboard/core @switchboard/react @switchboard/devtools @switchboard/api-mock
```

```bash
npm install @switchboard/core @switchboard/react @switchboard/devtools @switchboard/api-mock
```

```bash
yarn add @switchboard/core @switchboard/react @switchboard/devtools @switchboard/api-mock
```

## Peer dependencies

- `@switchboard/react` expects **React 18 or 19**
- `@switchboard/devtools` has no UI framework peers (Shadow DOM Web Component)
- `@switchboard/api-mock` depends on `@switchboard/core` and patches global `fetch`

## TypeScript

All public packages ship `.d.ts` files. Import types from `@switchboard/core` or re-exports on `@switchboard/react`.

```ts
import type { SwitchboardConfig, Scenario, ApiMockRule } from '@switchboard/core';
```

## Tree-shaking and production

Keep the panel and `enableApiMock` behind development checks so production bundles can drop them:

```ts
if (import.meta.env.DEV) {
  const { enableApiMock } = await import('@switchboard/api-mock');
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
pnpm --filter @switchboard/docs dev
pnpm --filter @switchboard/example-react-next dev
pnpm --filter @switchboard/example-react-vite dev
```
