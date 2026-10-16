import type { ApiMockRule, Scenario, UserContext } from '@switchboard-js/core';

export const admin: UserContext = {
  id: 'emp-admin',
  name: 'Alex Admin',
  role: 'admin',
  permissions: [
    'customers:read',
    'products:read',
    'products:write',
    'orders:read',
    'orders:write',
  ],
};

export const support: UserContext = {
  id: 'emp-support',
  name: 'Sam Support',
  role: 'support',
  permissions: ['customers:read', 'products:read', 'orders:read', 'orders:write'],
};

export const viewer: UserContext = {
  id: 'emp-viewer',
  name: 'Riley Viewer',
  role: 'viewer',
  permissions: ['customers:read', 'products:read', 'orders:read'],
};

export const accountManager: UserContext = {
  id: 'emp-am',
  name: 'Morgan Manager',
  role: 'account_manager',
  permissions: [
    'customers:read',
    'products:read',
    'products:write',
    'orders:read',
    'orders:write',
  ],
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

export const boScenarios: Scenario[] = [
  {
    id: 'employee-admin',
    name: 'Employee — Admin',
    features: {
      betaBanner: true,
      bulkOrderActions: true,
      productCostField: true,
      newCustomerHeader: true,
    },
    user: admin,
  },
  {
    id: 'employee-support',
    name: 'Employee — Support',
    features: {
      betaBanner: false,
      bulkOrderActions: true,
      productCostField: false,
      newCustomerHeader: false,
    },
    user: support,
  },
  {
    id: 'employee-viewer',
    name: 'Employee — Viewer',
    features: {
      betaBanner: false,
      bulkOrderActions: false,
      productCostField: false,
      newCustomerHeader: false,
    },
    user: viewer,
  },
  {
    id: 'employee-account-manager',
    name: 'Employee — Account manager',
    features: {
      betaBanner: true,
      bulkOrderActions: false,
      productCostField: true,
      newCustomerHeader: true,
    },
    user: accountManager,
  },
  {
    id: 'api-customer-not-found',
    name: 'API — Customer not found',
    user: admin,
    apiMocks: [mock('cust-404', '/api/customers/CUST-1001', 404, { error: 'Customer not found' })],
  },
  {
    id: 'api-products-down',
    name: 'API — Products down',
    user: admin,
    apiMocks: [
      mock('prod-500', '/api/customers/CUST-1001/products', 500, { error: 'Upstream failure' }),
    ],
  },
  {
    id: 'api-order-status-rejected',
    name: 'API — Order status rejected',
    user: support,
    apiMocks: [
      mock(
        'ord-409',
        '/api/orders/ord_1',
        409,
        { error: 'Invalid status transition', current: 'pending' },
        'PATCH',
      ),
    ],
  },
  {
    id: 'api-product-update-forbidden',
    name: 'API — Product update forbidden',
    user: accountManager,
    apiMocks: [mock('prod-403', '/api/products/p1', 403, { error: 'Forbidden' }, 'PUT')],
  },
];
