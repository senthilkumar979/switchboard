import { NextResponse } from 'next/server';

import { getCustomer } from '@/data/store';

export async function GET(
  _request: Request,
  context: { params: Promise<{ customerNumber: string }> },
) {
  const { customerNumber } = await context.params;
  const customer = getCustomer(decodeURIComponent(customerNumber));
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  return NextResponse.json(customer);
}
