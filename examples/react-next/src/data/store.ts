import type { Customer, Order, OrderStatus, Product } from './types';
import { ORDER_FLOW } from './types';

const customers: Customer[] = [
  {
    customerNumber: 'CUST-1001',
    name: 'Jordan Lee',
    company: 'Acme Retail',
    email: 'jordan@acmeretail.example',
    status: 'active',
  },
  {
    customerNumber: 'CUST-1002',
    name: 'Sam Rivera',
    company: 'Northwind Goods',
    email: 'sam@northwind.example',
    status: 'active',
  },
];

const products: Product[] = [
  {
    id: 'p1',
    customerNumber: 'CUST-1001',
    sku: 'ACME-MUG-01',
    title: 'Acme Ceramic Mug',
    price: 14.99,
    cost: 4.2,
    stock: 120,
    active: true,
  },
  {
    id: 'p2',
    customerNumber: 'CUST-1001',
    sku: 'ACME-TEE-01',
    title: 'Acme Logo Tee',
    price: 29.0,
    cost: 9.5,
    stock: 45,
    active: true,
  },
  {
    id: 'p3',
    customerNumber: 'CUST-1002',
    sku: 'NW-BAG-02',
    title: 'Northwind Tote',
    price: 24.5,
    cost: 7.0,
    stock: 80,
    active: true,
  },
];

const orders: Order[] = [
  {
    id: 'ord_1',
    customerNumber: 'CUST-1001',
    productId: 'p1',
    productTitle: 'Acme Ceramic Mug',
    buyerName: 'Casey Buyer',
    quantity: 2,
    total: 29.98,
    status: 'pending',
    createdAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'ord_2',
    customerNumber: 'CUST-1001',
    productId: 'p2',
    productTitle: 'Acme Logo Tee',
    buyerName: 'Riley Shopper',
    quantity: 1,
    total: 29.0,
    status: 'confirmed',
    createdAt: '2026-03-21T14:30:00.000Z',
  },
  {
    id: 'ord_3',
    customerNumber: 'CUST-1002',
    productId: 'p3',
    productTitle: 'Northwind Tote',
    buyerName: 'Morgan Patron',
    quantity: 3,
    total: 73.5,
    status: 'shipped',
    createdAt: '2026-03-18T09:15:00.000Z',
  },
];

function cloneCustomer(customer: Customer): Customer {
  return { ...customer };
}

function cloneProduct(product: Product): Product {
  return { ...product };
}

function cloneOrder(order: Order): Order {
  return { ...order };
}

export function getCustomer(customerNumber: string): Customer | undefined {
  const found = customers.find((c) => c.customerNumber === customerNumber);
  return found ? cloneCustomer(found) : undefined;
}

export function listProducts(customerNumber: string): Product[] {
  return products.filter((p) => p.customerNumber === customerNumber).map(cloneProduct);
}

export function getProduct(productId: string): Product | undefined {
  const found = products.find((p) => p.id === productId);
  return found ? cloneProduct(found) : undefined;
}

export function updateProduct(
  productId: string,
  patch: Partial<Omit<Product, 'id' | 'customerNumber' | 'sku'>>,
): Product | undefined {
  const index = products.findIndex((p) => p.id === productId);
  if (index < 0) return undefined;
  const current = products[index]!;
  products[index] = {
    ...current,
    title: patch.title ?? current.title,
    price: patch.price ?? current.price,
    cost: patch.cost ?? current.cost,
    stock: patch.stock ?? current.stock,
    active: patch.active ?? current.active,
  };
  return cloneProduct(products[index]!);
}

export function listOrders(customerNumber: string): Order[] {
  return orders.filter((o) => o.customerNumber === customerNumber).map(cloneOrder);
}

export function getOrder(orderId: string): Order | undefined {
  const found = orders.find((o) => o.id === orderId);
  return found ? cloneOrder(found) : undefined;
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (to === 'cancelled') return from === 'pending' || from === 'confirmed';
  const fromIndex = ORDER_FLOW.indexOf(from);
  const toIndex = ORDER_FLOW.indexOf(to);
  if (fromIndex < 0 || toIndex < 0) return false;
  return toIndex === fromIndex + 1;
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string,
): { order?: Order; error?: string } {
  const index = orders.findIndex((o) => o.id === orderId);
  if (index < 0) return { error: 'not_found' };
  const current = orders[index]!;
  if (!canTransition(current.status, status)) {
    return { error: 'invalid_transition' };
  }
  orders[index] = {
    ...current,
    status,
    note: note ?? current.note,
  };
  return { order: cloneOrder(orders[index]!) };
}

export function getStats(customerNumber?: string) {
  const productList = customerNumber
    ? products.filter((p) => p.customerNumber === customerNumber)
    : products;
  const orderList = customerNumber
    ? orders.filter((o) => o.customerNumber === customerNumber)
    : orders;
  return {
    productCount: productList.length,
    activeProductCount: productList.filter((p) => p.active).length,
    orderCount: orderList.length,
    pendingOrders: orderList.filter((o) => o.status === 'pending' || o.status === 'confirmed')
      .length,
    revenue: orderList
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0),
  };
}
