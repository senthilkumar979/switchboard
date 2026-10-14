import { NextResponse } from 'next/server';

import { getCustomer, listOrders } from '@/data/store';

export async function GET(
  _request: Request,
  context: { params: Promise<{ customerNumber: string }> },
) {
  const { customerNumber } = await context.params;
  const number = decodeURIComponent(customerNumber);
  if (!getCustomer(number)) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  return NextResponse.json({ items: listOrders(number) });
}
