# React + Vite example (Employee BO UI)

E-commerce **employee back-office** console powered by `@switchboard-js/react`. Looks up a customer by company number, then manages that customer’s products and buyer orders.

Real APIs come from `@switchboard-js/example-react-next` (proxied at `/api` → `http://localhost:3001`).

## Run (two terminals)

```bash
# Terminal 1 — APIs
pnpm --filter @switchboard-js/example-react-next dev

# Terminal 2 — Employee UI
pnpm --filter @switchboard-js/example-react-vite dev
```

Open **http://localhost:5174**.

## Flow

1. Enter `CUST-1001` or `CUST-1002` on the lookup page
2. Open **Products** to view / edit catalog (role-gated)
3. Open **Orders** to update buyer order status
4. Use persona chips or the Switchboard panel to change employee role / flags / API failure overlays

## Switchboard scenarios

| Scenario | What it demos |
| --- | --- |
| `employee-admin` | Admin + all feature flags (real API) |
| `employee-support` | Support — order status only |
| `employee-viewer` | Read-only |
| `employee-account-manager` | Products + orders + cost field |
| `api-customer-not-found` | Mock `GET /api/customers/CUST-1001` → 404 |
| `api-products-down` | Mock products list → 500 |
| `api-order-status-rejected` | Mock `PATCH /api/orders/ord_1` → 409 |
| `api-product-update-forbidden` | Mock `PUT /api/products/p1` → 403 |

Happy-path CRUD has **no** global `apiMocks` — requests hit Next. Failure scenarios use exact pathname mocks (known seed IDs).

## Feature flags

- `betaBanner` — ops announcement strip
- `bulkOrderActions` — confirm-selected toolbar on orders
- `productCostField` — cost field in product editor
- `newCustomerHeader` — alternate customer header

Configuration: `src/switchboard.ts`.
