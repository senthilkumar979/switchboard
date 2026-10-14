export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

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

export const ORDER_FLOW: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];
