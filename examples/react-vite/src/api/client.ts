export interface Customer {
  customerNumber: string;
  name: string;
  company: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  customerNumber: string;
  sku: string;
  title: string;
  price: number;
  cost?: number;
  stock: number;
  active: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerNumber: string;
  productId: string;
  productTitle: string;
  buyerName: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Stats {
  productCount: number;
  activeProductCount: number;
  orderCount: number;
  pendingOrders: number;
  revenue: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(typeof body === 'object' && body && 'error' in body ? String((body as { error: unknown }).error) : `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const text = await response.text();
  const body = text ? (JSON.parse(text) as unknown) : null;
  if (!response.ok) throw new ApiError(response.status, body);
  return body as T;
}
