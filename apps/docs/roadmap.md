# Roadmap

| Phase | Focus | Status |
| --- | --- | --- |
| 0 | Monorepo foundation (pnpm, Turbo, CI, tooling) | Done |
| 1 | `@switchboard/core` engine | Done |
| 2 | `@switchboard/react` | Done |
| 3 | `@switchboard/devtools` panel | Done |
| 4 | Scenario management | Done |
| 5 | Angular adapter | Deferred |
| 6 | `@switchboard/api-mock` | Done |
| 7 | Documentation & release polish | Done |

## Phase 5 — Angular (deferred)

Parked for now. The `@switchboard/angular` package remains a private stub.

When resumed:

- Injectable service + DI
- Signals integration
- Angular example app

## Phase 7 — Release (done)

- Docs site content (this site)
- Publishing workflow (Changesets + GitHub Actions)
- Versioning and changelog polish; `@switchboard/api-mock` is publishable

First npm publish: merge a Version Packages PR after `NPM_TOKEN` is configured on the repo.

## Ideas under consideration

- Angular adapter (Phase 5)
- Storybook addon
- Vue / Svelte thin adapters
- Request header matching for API mocks
- Panel theming tokens as CSS custom properties for host overrides

Contributions welcome — see [Contributing](/contributing).
