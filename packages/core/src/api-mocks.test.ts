import { afterEach, describe, expect, it } from 'vitest';

import { createMemoryPersistence, createSwitchboard } from './index.js';
import { SwitchboardValidationError } from './validate.js';

afterEach(() => {
  // no-op cleanup
});

describe('api mocks', () => {
  it('creates presets and global mocks, and resolves effective rules', () => {
    const sb = createSwitchboard({
      persistence: false,
      urlScenarioParam: false,
      responsePresets: [
        { id: 'order-ok', name: 'Order success', json: { ok: true } },
        { id: 'pay-fail', name: 'Payment failed', json: { error: 'payment' } },
      ],
      apiMocks: [
        {
          id: 'orders',
          url: '/api/orders',
          statusCode: 200,
          responsePresetId: 'order-ok',
          enabled: true,
        },
      ],
    });

    expect(sb.getResponsePresets()).toHaveLength(2);
    expect(sb.getApiMocks()).toHaveLength(1);
    expect(sb.getEffectiveApiMocks()[0]?.url).toBe('/api/orders');

    sb.createApiMock({
      id: 'payments',
      url: '/api/payments',
      method: 'POST',
      statusCode: 500,
      responsePresetId: 'pay-fail',
      enabled: true,
    });
    expect(sb.getApiMocks()).toHaveLength(2);

    sb.setApiMockEnabled('orders', false);
    expect(sb.getApiMocks().find((r) => r.id === 'orders')?.enabled).toBe(false);
  });

  it('replaces global mocks when the active scenario defines apiMocks', () => {
    const sb = createSwitchboard({
      persistence: false,
      urlScenarioParam: false,
      responsePresets: [{ id: 'ok', name: 'OK', json: { ok: true } }],
      apiMocks: [
        {
          id: 'global-orders',
          url: '/api/orders',
          statusCode: 200,
          responsePresetId: 'ok',
          enabled: true,
        },
      ],
      scenarios: [
        {
          id: 'fail-payment',
          name: 'Fail payment',
          apiMocks: [
            {
              id: 'scenario-pay',
              url: '/api/payments',
              statusCode: 402,
              responsePresetId: 'other',
              customJson: { error: 'card_declined' },
              enabled: true,
            },
          ],
        },
        {
          id: 'no-mocks-field',
          name: 'No mocks field',
        },
      ],
    });

    expect(sb.getEffectiveApiMocks()).toHaveLength(1);
    expect(sb.getEffectiveApiMocks()[0]?.id).toBe('global-orders');

    sb.activateScenario('fail-payment');
    expect(sb.getEffectiveApiMocks()).toHaveLength(1);
    expect(sb.getEffectiveApiMocks()[0]?.url).toBe('/api/payments');

    sb.activateScenario('no-mocks-field');
    expect(sb.getEffectiveApiMocks()[0]?.id).toBe('global-orders');
  });

  it('persists presets and mocks', () => {
    const persistence = createMemoryPersistence();
    createSwitchboard({
      persistence,
      persistenceKey: 'api-mock-test',
      urlScenarioParam: false,
      responsePresets: [{ id: 'p1', name: 'P1', json: { a: 1 } }],
      apiMocks: [
        {
          id: 'm1',
          url: '/api/x',
          statusCode: 201,
          responsePresetId: 'p1',
          enabled: true,
        },
      ],
    });

    const restored = createSwitchboard({
      persistence,
      persistenceKey: 'api-mock-test',
      urlScenarioParam: false,
    });

    expect(restored.getResponsePresets()[0]?.json).toEqual({ a: 1 });
    expect(restored.getApiMocks()[0]?.statusCode).toBe(201);
  });

  it('rejects invalid presets and rules', () => {
    expect(() =>
      createSwitchboard({
        // @ts-expect-error intentional
        responsePresets: [{ id: 'x' }],
        persistence: false,
      }),
    ).toThrow(SwitchboardValidationError);

    const sb = createSwitchboard({ persistence: false, urlScenarioParam: false });
    expect(() =>
      sb.createApiMock({
        id: 'bad',
        url: '/api',
        statusCode: 200,
        responsePresetId: 'other',
        // @ts-expect-error intentional
        enabled: 'yes',
      }),
    ).toThrow(SwitchboardValidationError);
  });
});
