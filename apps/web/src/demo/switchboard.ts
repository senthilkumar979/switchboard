import { createSwitchboard } from '@switchboard-js/core';

import { admin, demoScenarios } from './scenarios.js';

export const demoSwitchboard = createSwitchboard({
  features: {
    betaBanner: {
      default: true,
      group: 'ui',
      description: 'Show ops announcement banner',
    },
    bulkActions: {
      default: true,
      group: 'orders',
      description: 'Extra toolbar actions',
    },
  },
  user: admin,
  environment: 'development',
  persistence: 'memory',
  apiMocks: [
    {
      id: 'products-ok',
      url: '/api/demo/products',
      method: 'GET',
      statusCode: 200,
      responsePresetId: 'other',
      customJson: {
        items: [
          { id: 'p1', name: 'Ceramic mug', price: 18 },
          { id: 'p2', name: 'Desk lamp', price: 42 },
          { id: 'p3', name: 'Notebook set', price: 12 },
        ],
      },
      enabled: true,
    },
  ],
  scenarios: demoScenarios,
});
