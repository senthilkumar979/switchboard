# Examples

| Directory     | Framework              | Status |
| ------------- | ---------------------- | ------ |
| `react-vite/` | React + Vite employee BO UI | Dual-app demo (UI) |
| `react-next/` | Next.js App Router APIs     | Dual-app demo (API) |
| `angular/`    | Angular                     | Deferred (placeholder) |
| `vanilla/`    | Vanilla JS                  | Placeholder |

## E-commerce BO demo

```bash
# Terminal 1 — in-memory REST APIs on :3001
pnpm --filter @switchboard-js/example-react-next dev

# Terminal 2 — employee console on :5174 (proxies /api → Next)
pnpm --filter @switchboard-js/example-react-vite dev
```

Look up `CUST-1001` / `CUST-1002`, manage products and orders, and use Switchboard scenarios for roles and API failures.
