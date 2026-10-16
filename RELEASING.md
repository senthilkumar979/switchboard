# Releasing Switchboard

Publishable packages:

- `@switchboard-js/core`
- `@switchboard-js/react`
- `@switchboard-js/devtools`
- `@switchboard-js/api-mock`

Versioning uses [Changesets](https://github.com/changesets/changesets). Private stubs (`angular`, `vanilla`), apps, examples, and tooling are ignored.

Repository: https://github.com/senthilkumar979/switchboard  
npm scope: `@switchboard-js` (create this org on npm if it does not exist yet)

## Prerequisites

1. Push access to `main` on GitHub.
2. GitHub Actions enabled.
3. Repository secret `NPM_TOKEN` — an npm **granular access** or **automation** token with write access to the `@switchboard-js` org (required because the npm account uses 2FA for publishes).
4. Local: Node 20+, pnpm 9.

Create / rotate the token at https://www.npmjs.com/settings/~/tokens → Granular Access Token → read/write for `@switchboard-js/*` packages (or the whole org).

Add it on GitHub: **Settings → Secrets and variables → Actions → New repository secret** named `NPM_TOKEN`.

## Everyday flow

1. Land features on `main` via PRs. When a publishable package changes, include a changeset:

   ```bash
   pnpm changeset
   ```

2. After merge to `main`, the **Release** workflow either:
   - Opens / updates a **Version Packages** PR, or
   - Publishes to npm when that Version Packages PR is merged.

3. Packages publish as public scopes (`publishConfig.access: public`). CI also sets npm provenance.

## First publish (this repo)

If versions are already bumped on `main` (see package `CHANGELOG.md` files):

1. Confirm `NPM_TOKEN` is set on the GitHub repo.
2. Push `main` (or re-run the **Release** workflow).
3. Verify on npm:
   - https://www.npmjs.com/package/@switchboard-js/core
   - https://www.npmjs.com/package/@switchboard-js/react
   - https://www.npmjs.com/package/@switchboard-js/devtools
   - https://www.npmjs.com/package/@switchboard-js/api-mock

### Manual publish (local fallback)

```bash
pnpm install
pnpm build
# versions already applied via: pnpm version-packages
NPM_TOKEN=<automation-token> pnpm release
```

With 2FA “auth-and-writes”, prefer an automation/granular token in `NPM_TOKEN` over interactive OTP.

Dry-run a tarball before publishing:

```bash
pnpm --filter @switchboard-js/core exec npm pack --dry-run
```

## Root changelog

[CHANGELOG.md](./CHANGELOG.md) is a high-level project log. Per-package changelogs under `packages/*/CHANGELOG.md` are the source of truth for npm release notes.
