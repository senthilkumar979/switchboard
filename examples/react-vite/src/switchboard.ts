import { createSwitchboard } from '@switchboard/core';

import { admin, boScenarios } from './boScenarios.js';

export const exampleSwitchboard = createSwitchboard({
  features: {
    betaBanner: {
      default: true,
      group: 'ui',
      description: 'Show ops announcement banner',
    },
    bulkOrderActions: {
      default: false,
      group: 'orders',
      description: 'Extra order toolbar actions',
    },
    productCostField: {
      default: true,
      group: 'catalog',
      description: 'Show product cost in editor',
    },
    newCustomerHeader: {
      default: false,
      group: 'ui',
      description: 'Alternate customer header layout',
    },
  },
  user: admin,
  environment: 'development',
  persistence: 'memory',
  // Happy path hits real Next APIs (no global apiMocks).
  scenarios: boScenarios,
});
