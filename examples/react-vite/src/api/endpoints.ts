import { apiFetch, type Customer, type Order, type OrderStatus, type Product, type Stats } from './client.js';

export function getCustomer(customerNumber: string) {
  return apiFetch<Customer>(`/api/customers/${encodeURIComponent(customerNumber)}`);
}

export function listProducts(customerNumber: string) {
  return apiFetch<{ items: Product[] }>(
    `/api/customers/${encodeURIComponent(customerNumber)}/products`,
  );
}

export function listOrders(customerNumber: string) {
  return apiFetch<{ items: Order[] }>(
    `/api/customers/${encodeURIComponent(customerNumber)}/orders`,
  );
}

export function getOrder(orderId: string) {
  return apiFetch<Order>(`/api/orders/${encodeURIComponent(orderId)}`);
}

export function updateProduct(
  productId: string,
  body: Partial<Pick<Product, 'title' | 'price' | 'cost' | 'stock' | 'active'>>,
  method: 'PUT' | 'PATCH' = 'PUT',
) {
  return apiFetch<Product>(`/api/products/${encodeURIComponent(productId)}`, {
    method,
    body: JSON.stringify(body),
  });
}

export function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  return apiFetch<Order>(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
}

export function getStats(customerNumber?: string) {
  const query = customerNumber
    ? `?customerNumber=${encodeURIComponent(customerNumber)}`
    : '';
  return apiFetch<Stats>(`/api/stats${query}`);
}
