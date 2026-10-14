import { NextResponse } from 'next/server';

import { getStats } from '@/data/store';

export function GET(request: Request) {
  const url = new URL(request.url);
  const customerNumber = url.searchParams.get('customerNumber') ?? undefined;
  return NextResponse.json(getStats(customerNumber ?? undefined));
}
