# What is Switchboard?

Switchboard is an open-source **development-only control plane** for frontend apps. It lets you inspect and change the state your UI depends on — feature flags, simulated users, named scenarios, and mocked API responses — without wiring that into production business logic.

## Why it exists

Frontend work often means toggling flags in remote dashboards, editing fixtures by hand, or rebuilding to try another user role. Switchboard keeps those controls **local**, **fast**, and **next to your app**:

- Flip a flag and see the UI update immediately
- Activate a scenario that sets features, user, and API mocks together
- Open a drawer to activate scenarios and enable mocks — configuration stays in code

## Design principles

1. **Framework-independent core** — `@switchboard/core` has no React/Angular dependency
2. **Modular packages** — adopt core alone, or add React, the panel, and API mocking as needed
3. **Minimal runtime cost** — small in-memory engine; panel and fetch patch are opt-in
4. **Development-only by default** — mount the panel and enable mocks only in `DEV` / non-prod builds
5. **Local-first persistence** — memory or `localStorage`; custom adapters supported
6. **Config in code, selection in the panel** — no free-text forms except API custom JSON

## Package map

| Package | Role |
| --- | --- |
| `@switchboard/core` | Engine: features, user, environments, scenarios, presets, mock rules |
| `@switchboard/react` | Provider, hooks, React panel wrapper |
| `@switchboard/devtools` | Framework-agnostic `<switchboard-panel>` Web Component |
| `@switchboard/api-mock` | `enableApiMock()` fetch interceptor |
| `@switchboard/angular` | Deferred (private stub) |

## What Switchboard is not

- Not a production feature-flag SaaS
- Not a replacement for real auth or authorization
- Not a full network proxy — API mocks only intercept `fetch` for matching pathnames when enabled

## Next steps

- [Getting Started](/getting-started) — first instance in under a minute
- [Core Concepts](/core-concepts) — mental model
- [React](/react) — provider and hooks
