import { afterEach, describe, expect, it, vi } from 'vitest';

import { createSwitchboard } from '@switchboard/core';

import { enableApiMock } from './enableApiMock.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('enableApiMock', () => {
  it('returns mocked JSON for matching pathname and passes through otherwise', async () => {
    const passthrough = vi.fn(async () => new Response('{"live":true}', { status: 200 }));
    vi.stubGlobal('fetch', passthrough);

    const sb = createSwitchboard({
      persistence: false,
      urlScenarioParam: false,
      responsePresets: [{ id: 'ok', name: 'OK', json: { mocked: true } }],
      apiMocks: [
        {
          id: 'orders',
          url: '/api/orders',
          statusCode: 201,
          responsePresetId: 'ok',
          enabled: true,
        },
      ],
    });

    const dispose = enableApiMock(sb);

    const mocked = await fetch('http://localhost:5173/api/orders');
    expect(mocked.status).toBe(201);
    expect(await mocked.json()).toEqual({ mocked: true });
    expect(passthrough).not.toHaveBeenCalled();

    const live = await fetch('http://localhost:5173/api/other');
    expect(await live.json()).toEqual({ live: true });
    expect(passthrough).toHaveBeenCalledOnce();

    dispose();
    await fetch('http://localhost:5173/api/orders');
    expect(passthrough).toHaveBeenCalledTimes(2);
  });

  it('uses scenario mocks when active scenario defines apiMocks', async () => {
    const passthrough = vi.fn(async () => new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', passthrough);

    const sb = createSwitchboard({
      persistence: false,
      urlScenarioParam: false,
      responsePresets: [{ id: 'fail', name: 'Fail', json: { error: 'payment' } }],
      apiMocks: [
        {
          id: 'global',
          url: '/api/orders',
          statusCode: 200,
          responsePresetId: 'other',
          customJson: { global: true },
          enabled: true,
        },
      ],
      scenarios: [
        {
          id: 'fail-pay',
          name: 'Fail pay',
          apiMocks: [
            {
              id: 'pay',
              url: '/api/payments',
              method: 'POST',
              statusCode: 402,
              responsePresetId: 'fail',
              enabled: true,
            },
          ],
        },
      ],
    });

    enableApiMock(sb);
    sb.activateScenario('fail-pay');

    const pay = await fetch('/api/payments', { method: 'POST' });
    expect(pay.status).toBe(402);
    expect(await pay.json()).toEqual({ error: 'payment' });

    // Global orders rule is replaced while scenario is active
    const orders = await fetch('/api/orders');
    expect(passthrough).toHaveBeenCalled();
    void orders;
  });
});
