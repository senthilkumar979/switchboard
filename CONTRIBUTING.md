# Contributing to Switchboard

Thanks for your interest in contributing.

## Development setup

1. Install [Node.js](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/) 9.
2. Clone the repository and install dependencies:

```bash
pnpm install
```

3. Build all packages:

```bash
pnpm build
```

4. Run checks:

```bash
pnpm test
pnpm lint
pnpm typecheck
```

## Phase discipline

See [TASKS.md](./TASKS.md). Phases 0–4, 6, and 7 are complete. **Phase 5 (Angular) is deferred** — leave `@switchboard-js/angular` as a private stub unless that phase is explicitly resumed.

Rules:

- Keep `@switchboard-js/core` free of React, Angular, Vue, and UI libraries.
- Do not add unnecessary dependencies.
- Write tests alongside implementation.
- Update `TASKS.md` when phase status changes.

## Branch and PR flow

1. Create a branch from `main`.
2. Make focused changes.
3. Ensure `pnpm turbo run lint typecheck test build` passes.
4. Open a pull request with a clear description.

## Releases (Changesets)

Versioning uses [Changesets](https://github.com/changesets/changesets). Publishing is automated on `main` via `.github/workflows/release.yml`.

When you change a publishable package (`core`, `react`, `devtools`, `api-mock`):

```bash
pnpm changeset
```

Follow the prompts, commit the generated file under `.changeset/`, and include it in your PR.

Full release steps: [RELEASING.md](./RELEASING.md).

## Code style

- TypeScript strict mode
- No `any` unless explicitly justified
- Prettier for formatting (`pnpm format`)
- ESLint via `@switchboard-js/eslint-config`

## Code of conduct

Be respectful. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
