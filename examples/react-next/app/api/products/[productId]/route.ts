import { NextResponse } from 'next/server';

import { getProduct, updateProduct } from '@/data/store';

export async function GET(
  _request: Request,
  context: { params: Promise<{ productId: string }> },
) {
  const { productId } = await context.params;
  const product = getProduct(productId);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

async function applyUpdate(request: Request, productId: string, mode: 'put' | 'patch') {
  if (!getProduct(productId)) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const patch: {
    title?: string;
    price?: number;
    cost?: number;
    stock?: number;
    active?: boolean;
  } = {};

  if (mode === 'put' || 'title' in body) {
    if (typeof body.title !== 'string' || body.title.length === 0) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }
    patch.title = body.title;
  }
  if (mode === 'put' || 'price' in body) {
    if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
      return NextResponse.json({ error: 'price must be a number' }, { status: 400 });
    }
    patch.price = body.price;
  }
  if (mode === 'put' || 'stock' in body) {
    if (typeof body.stock !== 'number' || !Number.isInteger(body.stock)) {
      return NextResponse.json({ error: 'stock must be an integer' }, { status: 400 });
    }
    patch.stock = body.stock;
  }
  if (mode === 'put' || 'active' in body) {
    if (typeof body.active !== 'boolean') {
      return NextResponse.json({ error: 'active must be a boolean' }, { status: 400 });
    }
    patch.active = body.active;
  }
  if ('cost' in body) {
    if (typeof body.cost !== 'number' || Number.isNaN(body.cost)) {
      return NextResponse.json({ error: 'cost must be a number' }, { status: 400 });
    }
    patch.cost = body.cost;
  }

  return NextResponse.json(updateProduct(productId, patch));
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ productId: string }> },
) {
  const { productId } = await context.params;
  return applyUpdate(request, productId, 'put');
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ productId: string }> },
) {
  const { productId } = await context.params;
  return applyUpdate(request, productId, 'patch');
}
