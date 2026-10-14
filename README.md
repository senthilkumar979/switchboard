# Switchboard

**Universal development controls for frontend applications.**

Inspect, modify, simulate, and manage application states during development — without changing business logic.

## Features

- Runtime **feature flags** with groups and environment defaults
- **User simulation** (role, permissions, custom fields)
- **Scenarios** — named snapshots including optional API mocks
- **Developer panel** — selection-only drawer (Web Component)
- **API mocking** — pathname/`fetch` interception via `@switchboard/api-mock`
- **React** bindings (`Provider`, hooks, panel wrapper)

## Status

Phases 0–4, 6, and 7 are complete. Angular adapter (Phase 5) is **deferred**. See [TASKS.md](./TASKS.md) and the [docs roadmap](./apps/docs/roadmap.md).

## Documentation

```bash
pnpm --filter @switchboard/docs dev
```

Guides cover installation, core concepts, scenarios, the panel, API mocking, and the full API reference.

## Monorepo

```text
apps/
  docs/           VitePress documentation
  playground/     Local workspace playground
packages/
  core/           @switchboard/core
  react/          @switchboard/react
  devtools/       @switchboard/devtools
  api-mock/       @switchboard/api-mock
  angular/        (private stub — Phase 5 deferred)
  vanilla/        (private stub)
examples/
  react-vite/     Employee BO UI (Vite)
  react-next/     BO REST APIs (Next.js)
tooling/
  eslint-config/
  tsconfig/
```

## Requirements

- Node.js >= 20
- pnpm 9

## Getting started

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

### Develop

```bash
pnpm --filter @switchboard/docs dev

# E-commerce BO demo (two terminals)
pnpm --filter @switchboard/example-react-next dev   # APIs :3001
pnpm --filter @switchboard/example-react-vite dev   # UI :5174
```

### Quick library usage

```bash
pnpm add @switchboard/core @switchboard/react @switchboard/devtools @switchboard/api-mock
```

```ts
import { createSwitchboard } from '@switchboard/core';

const switchboard = createSwitchboard({
  features: { newDashboard: false },
  user: { role: 'admin' },
});
```

## Packages

| Package | Description |
| --- | --- |
| `@switchboard/core` | Framework-independent engine |
| `@switchboard/react` | React adapter |
| `@switchboard/devtools` | Developer panel (Web Component) |
| `@switchboard/api-mock` | Fetch interceptor for API mocks |
| `@switchboard/angular` | Deferred (private stub) |

## Principles

1. Framework-independent core
2. Modular architecture
3. Minimal runtime overhead
4. Development-only by default
5. Local-first persistence
6. Config in code; selection in the panel

## License

MIT — see [LICENSE](./LICENSE).

## Releasing

See [RELEASING.md](./RELEASING.md). First publish requires a GitHub remote and an `NPM_TOKEN` secret.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [TASKS.md](./TASKS.md).
