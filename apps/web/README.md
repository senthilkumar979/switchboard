# @switchboard-js/web

Public Switchboard site for [switchboard.mentorbridge.in](https://switchboard.mentorbridge.in).

- `/` — marketing landing
- `/demo` — interactive mini console with the real Switchboard panel
- `/capabilities/:id` — capability deep pages with live previews
- `/docs/` — VitePress docs (copied into `dist/docs` on build)

```bash
pnpm --filter @switchboard-js/web dev
pnpm --filter @switchboard-js/web build
```
