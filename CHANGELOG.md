# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Per-package release notes live in `packages/*/CHANGELOG.md` after the first Changesets version PR. This file tracks monorepo-level milestones.

## [Unreleased]

Ready for first npm publish (`0.1.0` expected via pending Changesets). See [RELEASING.md](./RELEASING.md).

### Changed

- Phase 5 (Angular) deferred; `@switchboard/angular` remains a private stub
- Phase 7: Changesets release workflow, `@switchboard/api-mock` publishable
- Developer panel is selection-only: no free-text inputs except API mock custom JSON
- Documentation site (VitePress) with full guides

### Added

- Phase 6 API mocking: presets, global + scenario `apiMocks`, `enableApiMock`, drawer API tab, `useApiMock`
- Phase 4 scenarios: CRUD, persistence, import/export, URL selection, React `useScenario`
- Phase 3 `@switchboard/devtools` panel + React `SwitchboardPanel`
- Phase 2 `@switchboard/react` provider and hooks
- Phase 1 `@switchboard/core` engine
- Phase 0 monorepo foundation (pnpm, Turborepo, CI, tooling)

## Package versions (pre-publish)

| Package | Version on `main` until first release |
| --- | --- |
| `@switchboard/core` | `0.0.0` |
| `@switchboard/react` | `0.0.0` |
| `@switchboard/devtools` | `0.0.0` |
| `@switchboard/api-mock` | `0.0.0` |
