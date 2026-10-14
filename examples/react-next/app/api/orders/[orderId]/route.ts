import { NextResponse } from 'next/server';

import { getOrder, updateOrderStatus } from '@/data/store';
import type { OrderStatus } from '@/data/types';

const STATUSES = new Set<OrderStatus>([
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]);

export function GET(
  _request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  return context.params.then(({ orderId }) => {
    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const status = body.status;
  if (typeof status !== 'string' || !STATUSES.has(status as OrderStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const note = typeof body.note === 'string' ? body.note : undefined;
  const result = updateOrderStatus(orderId, status as OrderStatus, note);
  if (result.error === 'not_found') {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (result.error === 'invalid_transition') {
    return NextResponse.json(
      { error: 'Invalid status transition', current: getOrder(orderId)?.status },
      { status: 409 },
    );
  }
  return NextResponse.json(result.order);
}
