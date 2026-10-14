# Examples

## E-commerce employee BO (React Vite UI + Next APIs)

The primary demo is a dual-app setup:

| Package | Role | Port |
| --- | --- | --- |
| `@switchboard/example-react-next` | In-memory REST APIs | `3001` |
| `@switchboard/example-react-vite` | Employee back-office UI | `5174` |

```bash
pnpm install
pnpm build

# Terminal 1
pnpm --filter @switchboard/example-react-next dev

# Terminal 2
pnpm --filter @switchboard/example-react-vite dev
```

Vite proxies browser `/api/*` calls to Next so Switchboard pathname mocks stay simple.

### What it shows

- Lookup customer by company number (`CUST-1001`, `CUST-1002`)
- Manage that customer’s products (PUT/PATCH) and buyer orders (PATCH status)
- Role gating via Switchboard users (`admin`, `account_manager`, `support`, `viewer`)
- Feature flags: `betaBanner`, `bulkOrderActions`, `productCostField`, `newCustomerHeader`
- Happy path hits **real** Next APIs (no global `apiMocks`)
- Failure scenarios overlay mocks for known seed IDs (`CUST-1001`, `p1`, `ord_1`)

Configuration: `examples/react-vite/src/switchboard.ts`.

### Try this

1. Start both apps and open http://localhost:5174
2. Look up `CUST-1001`, edit a product, update an order status
3. Activate **Employee — Viewer** — edits should be disabled
4. Activate **API — Products down** and reopen products for `CUST-1001` — expect a 500
5. Open the Switchboard panel for flags, users, and remaining failure scenarios

## Other example folders

| Path | Status |
| --- | --- |
| `examples/react-vite` | Employee BO UI |
| `examples/react-next` | BO REST APIs |
| `examples/vanilla` | Placeholder |
| `examples/angular` | Deferred (placeholder) |

## Docs site

```bash
pnpm --filter @switchboard/docs dev
```

## Playground

```bash
pnpm --filter @switchboard/playground dev
```
