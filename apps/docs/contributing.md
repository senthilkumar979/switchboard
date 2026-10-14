# Contributing

Thanks for helping improve Switchboard.

## Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

Requirements: Node 20+, pnpm 9.

## Project layout

```text
packages/core        Engine
packages/react       React adapter
packages/devtools    Developer panel
packages/api-mock    Fetch interceptor
apps/docs            VitePress documentation
examples/react-vite  Employee BO UI demo
examples/react-next  BO REST APIs for the Vite demo
```

## Workflow

1. Create a branch from `main`
2. Make focused changes (prefer small PRs)
3. Add/update Vitest coverage for behavior changes
4. Update docs when you change public APIs or panel UX
5. Add a Changeset when touching published packages (`core`, `react`, `devtools`, `api-mock`): `pnpm changeset`
6. Open a PR

Publishing is automated on `main` (Changesets Version PR → npm). See the repo root `RELEASING.md`. Angular (Phase 5) is deferred.

## Package scripts

```bash
pnpm --filter @switchboard/core test
pnpm --filter @switchboard/devtools test
pnpm --filter @switchboard/docs dev
pnpm --filter @switchboard/example-react-next dev
pnpm --filter @switchboard/example-react-vite dev
```

## Code guidelines

- TypeScript throughout; avoid `any`
- Prefer small files (≈150 lines for components/hooks/utilities)
- Named exports
- Soft-fail persistence and panel prefs — never crash the host app
- Panel remains selection-only (no new text inputs except API custom JSON)

## Documentation

Edit markdown under `apps/docs/`. Theme tokens live in `.vitepress/theme/custom.css`.

```bash
pnpm --filter @switchboard/docs build
```

## License

MIT — see the repository `LICENSE` file.
