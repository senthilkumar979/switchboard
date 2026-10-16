# React + Next.js example (E-commerce BO API)

In-memory REST API for the Switchboard employee back-office demo.

## Run

```bash
pnpm --filter @switchboard-js/example-react-next dev
```

Listens on **http://localhost:3001**.

## Seed customers

| Customer number | Company |
| --- | --- |
| `CUST-1001` | Acme Retail |
| `CUST-1002` | Northwind Goods |

Known product/order IDs for Switchboard failure demos: `p1`, `p2`, `ord_1`, `ord_2`.

## Endpoints

| Method | Path |
| --- | --- |
| GET | `/api/health` |
| GET | `/api/customers/[customerNumber]` |
| GET | `/api/customers/[customerNumber]/products` |
| GET | `/api/customers/[customerNumber]/orders` |
| GET/PUT/PATCH | `/api/products/[productId]` |
| GET/PATCH | `/api/orders/[orderId]` |
| GET | `/api/stats?customerNumber=` |

Pair with `@switchboard-js/example-react-vite` (proxies `/api` here).
