# Switchboard

**Universal development controls for frontend applications.**

Inspect, modify, simulate, and manage application states during development — without changing business logic.

## Features

- Runtime **feature flags** with groups and environment defaults
- **User simulation** (role, permissions, custom fields)
- **Scenarios** — named snapshots including optional API mocks
- **Developer panel** — selection-only drawer (Web Component)
- **API mocking** — pathname/`fetch` interception via `@switchboard-js/api-mock`
- **React** bindings (`Provider`, hooks, panel wrapper)

## Status

Phases 0–4, 6, and 7 are complete. Angular adapter (Phase 5) is **deferred**. See [TASKS.md](./TASKS.md) and the [docs roadmap](./apps/docs/roadmap.md).

## Website

Public site: [switchboard.mentorbridge.in](https://switchboard.mentorbridge.in)

```bash
pnpm --filter @switchboard-js/web dev
```

Marketing landing, interactive demo (`/demo`), and capability pages. VitePress docs are a separate Vercel **service** at `/docs`. Deploy with the root [`vercel.json`](./vercel.json) (set the project framework to **Services**, custom domain `switchboard.mentorbridge.in`).

## Documentation

```bash
pnpm --filter @switchboard-js/docs dev
```

Guides cover installation, core concepts, scenarios, the panel, API mocking, and the full API reference. On the public site they are served under `/docs/`.

## Monorepo

```text
apps/
  docs/           VitePress documentation (base /docs/)
  web/            Marketing site + interactive demo
packages/
  core/           @switchboard-js/core
  react/          @switchboard-js/react
  devtools/       @switchboard-js/devtools
  api-mock/       @switchboard-js/api-mock
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
pnpm --filter @switchboard-js/web dev    # landing + demo :5173
pnpm --filter @switchboard-js/docs dev   # docs only (base /docs/)

# E-commerce BO example (two terminals)
pnpm --filter @switchboard-js/example-react-next dev   # APIs :3001
pnpm --filter @switchboard-js/example-react-vite dev   # UI :5174
```

### Quick library usage

```bash
pnpm add @switchboard-js/core @switchboard-js/react @switchboard-js/devtools @switchboard-js/api-mock
```

```ts
import { createSwitchboard } from '@switchboard-js/core';

const switchboard = createSwitchboard({
  features: { newDashboard: false },
  user: { role: 'admin' },
});
```

## Packages

| Package | Description |
| --- | --- |
| `@switchboard-js/core` | Framework-independent engine |
| `@switchboard-js/react` | React adapter |
| `@switchboard-js/devtools` | Developer panel (Web Component) |
| `@switchboard-js/api-mock` | Fetch interceptor for API mocks |
| `@switchboard-js/angular` | Deferred (private stub) |

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

Publishable packages are at **0.1.0**. See [RELEASING.md](./RELEASING.md) — set the GitHub Actions `NPM_TOKEN` secret, then push `main` (or run `pnpm release` locally with an automation token).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [TASKS.md](./TASKS.md).
