# Switchboard Tasks

Track implementation progress by phase. Update checkboxes when work is complete.

## Phase 0 — Repository Foundation

- [x] Initialize pnpm workspace
- [x] Configure Turborepo
- [x] Configure TypeScript (`tooling/tsconfig`)
- [x] Configure ESLint and Prettier
- [x] Configure Vitest (smoke tests on buildable packages)
- [x] Establish package naming (`@switchboard-js/*`)
- [x] Establish build conventions (tsup) and release conventions (Changesets)
- [x] Add GitHub Actions CI
- [x] Add LICENSE and contribution guidelines
- [x] Scaffold apps (`docs`, `playground` → `web`) and example placeholders
- [x] Public marketing site + demo (`apps/web`, switchboard.mentorbridge.in)
- [x] Verify install / build / test / lint / typecheck

**Status:** Complete

## Phase 1 — Core Engine

- [x] `createSwitchboard`
- [x] Feature registry and toggles
- [x] User context
- [x] Subscription system
- [x] Reset
- [x] Memory + localStorage persistence
- [x] Configuration validation
- [x] Unit tests

**Status:** Complete

## Phase 2 — React Adapter

- [x] `SwitchboardProvider`
- [x] `useSwitchboard`, `useFeatureFlag`, `useUserContext`, `useScenario`
- [x] `useSyncExternalStore` integration
- [x] React 18/19 compatibility
- [x] Vite React example

**Status:** Complete

## Phase 3 — Developer Panel

- [x] Web Component + Shadow DOM
- [x] Floating panel UI
- [x] Feature / user / scenario controls
- [x] Import / export / reset

**Status:** Complete

## Phase 4 — Scenario Management

- [x] Scenario CRUD + activation
- [x] Local persistence
- [x] JSON validation + import/export
- [x] URL-based scenario selection

**Status:** Complete

## Phase 5 — Angular Adapter

- [ ] Injectable service + DI
- [ ] Signals integration
- [ ] Angular example

**Status:** Deferred (stub package remains private)

## Phase 6 — API Mocking

- [x] Endpoint overrides (pathname + method + status + JSON body)
- [x] Scenario-specific responses (`Scenario.apiMocks` replaces globals)

**Status:** Complete

## Phase 7 — Documentation and Release

- [x] Full docs site content
- [x] Publishing workflow (Changesets + GitHub Actions release)
- [x] Changelog / versioning polish (`@switchboard-js/api-mock` publishable)

**Status:** Complete
