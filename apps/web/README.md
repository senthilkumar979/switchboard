# @switchboard-js/web

Public Switchboard marketing site for [switchboard.mentorbridge.in](https://switchboard.mentorbridge.in).

- `/` — marketing landing
- `/demo` — interactive mini console with the real Switchboard panel
- `/capabilities/:id` — capability deep pages with live previews

Docs are the separate `docs` Vercel service (`apps/docs`), routed at `/docs` via root [`vercel.json`](../../vercel.json).

```bash
pnpm --filter @switchboard-js/web dev
pnpm --filter @switchboard-js/web build
```
