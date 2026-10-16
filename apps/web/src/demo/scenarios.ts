import type { ApiMockRule, Scenario, UserContext } from '@switchboard-js/core';

export const admin: UserContext = {
  id: 'emp-admin',
  name: 'Alex Admin',
  role: 'admin',
  permissions: ['products:read', 'products:write', 'orders:read'],
};

export const viewer: UserContext = {
  id: 'emp-viewer',
  name: 'Riley Viewer',
  role: 'viewer',
  permissions: ['products:read', 'orders:read'],
};

function mock(
  id: string,
  url: string,
  statusCode: number,
  body: unknown,
  method: ApiMockRule['method'] = 'GET',
): ApiMockRule {
  return {
    id,
    url,
    method,
    statusCode,
    responsePresetId: 'other',
    customJson: body,
    enabled: true,
  };
}

const productsOk = mock('products-ok', '/api/demo/products', 200, {
  items: [
    { id: 'p1', name: 'Ceramic mug', price: 18 },
    { id: 'p2', name: 'Desk lamp', price: 42 },
    { id: 'p3', name: 'Notebook set', price: 12 },
  ],
});

const productsDown = mock('products-500', '/api/demo/products', 500, {
  error: 'Upstream failure',
});

export const demoScenarios: Scenario[] = [
  {
    id: 'happy-path',
    name: 'Happy path — Admin',
    features: { betaBanner: true, bulkActions: true },
    user: admin,
    apiMocks: [productsOk],
  },
  {
    id: 'viewer',
    name: 'Employee — Viewer',
    features: { betaBanner: false, bulkActions: false },
    user: viewer,
    apiMocks: [productsOk],
  },
  {
    id: 'products-down',
    name: 'API — Products down',
    features: { betaBanner: true, bulkActions: true },
    user: admin,
    apiMocks: [productsDown],
  },
];
