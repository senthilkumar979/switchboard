import { cleanup, render, screen, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createSwitchboard } from '@switchboard/core';

import {
  SwitchboardPanel,
  SwitchboardProvider,
  useApiMock,
  useFeatureFlag,
  useScenario,
  useSwitchboard,
  useUserContext,
} from './index.js';
import type { SwitchboardPanelElement } from '@switchboard/devtools';

afterEach(() => {
  cleanup();
});

function FeatureProbe({ name }: { name: string }) {
  const { enabled } = useFeatureFlag(name);
  const { setFeature } = useSwitchboard();
  return (
    <div>
      <span data-testid="flag">{enabled ? 'on' : 'off'}</span>
      <button type="button" onClick={() => setFeature(name, !enabled)}>
        toggle
      </button>
    </div>
  );
}

function UserProbe() {
  const { user, setUser } = useUserContext();
  return (
    <div>
      <span data-testid="role">{user.role ?? 'none'}</span>
      <button type="button" onClick={() => setUser({ role: 'customer' })}>
        set-customer
      </button>
    </div>
  );
}

describe('SwitchboardProvider', () => {
  it('throws when hooks are used outside the provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<FeatureProbe name="flag" />)).toThrow(
      /Switchboard hooks must be used within/,
    );
    consoleError.mockRestore();
  });

  it('provides reactive feature flag updates', () => {
    render(
      <SwitchboardProvider
        config={{
          features: { newDashboard: false },
          persistence: false,
        }}
      >
        <FeatureProbe name="newDashboard" />
      </SwitchboardProvider>,
    );

    expect(screen.getByTestId('flag').textContent).toBe('off');

    act(() => {
      screen.getByRole('button', { name: 'toggle' }).click();
    });

    expect(screen.getByTestId('flag').textContent).toBe('on');
  });

  it('accepts an external Switchboard instance', () => {
    const instance = createSwitchboard({
      features: { flag: true },
      user: { role: 'admin' },
      persistence: false,
    });

    render(
      <SwitchboardProvider instance={instance}>
        <FeatureProbe name="flag" />
        <UserProbe />
      </SwitchboardProvider>,
    );

    expect(screen.getByTestId('flag').textContent).toBe('on');
    expect(screen.getByTestId('role').textContent).toBe('admin');

    act(() => {
      screen.getByRole('button', { name: 'set-customer' }).click();
    });

    expect(screen.getByTestId('role').textContent).toBe('customer');
  });

  it('exposes useScenario with CRUD helpers', () => {
    function ScenarioProbe() {
      const scenario = useScenario();
      return (
        <div>
          <span data-testid="supported">{String(scenario.isSupported)}</span>
          <span data-testid="count">{scenario.scenarios.length}</span>
          <button
            type="button"
            onClick={() =>
              scenario.createScenario({
                id: 's1',
                name: 'S1',
                features: { flag: true },
              })
            }
          >
            create
          </button>
          <button type="button" onClick={() => scenario.activateScenario('s1')}>
            activate
          </button>
          <span data-testid="active">{scenario.activeScenarioId ?? 'none'}</span>
        </div>
      );
    }

    render(
      <SwitchboardProvider
        config={{
          features: { flag: false },
          persistence: false,
          urlScenarioParam: false,
        }}
      >
        <ScenarioProbe />
      </SwitchboardProvider>,
    );

    expect(screen.getByTestId('supported').textContent).toBe('true');
    expect(screen.getByTestId('count').textContent).toBe('0');

    act(() => {
      screen.getByRole('button', { name: 'create' }).click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');

    act(() => {
      screen.getByRole('button', { name: 'activate' }).click();
    });
    expect(screen.getByTestId('active').textContent).toBe('s1');
  });

  it('binds the context instance to SwitchboardPanel', () => {
    const instance = createSwitchboard({
      features: { flag: true },
      persistence: false,
    });

    const { container } = render(
      <SwitchboardProvider instance={instance}>
        <SwitchboardPanel open />
      </SwitchboardProvider>,
    );

    const el = container.querySelector('switchboard-panel') as SwitchboardPanelElement | null;
    expect(el).toBeTruthy();
    expect(el?.switchboard).toBe(instance);
  });

  it('exposes useApiMock helpers', () => {
    function ApiProbe() {
      const api = useApiMock();
      return (
        <div>
          <span data-testid="presets">{api.responsePresets.length}</span>
          <button
            type="button"
            onClick={() =>
              api.createResponsePreset({ id: 'p1', name: 'P1', json: { ok: true } })
            }
          >
            add-preset
          </button>
          <button
            type="button"
            onClick={() =>
              api.createApiMock({
                id: 'm1',
                url: '/api/x',
                statusCode: 200,
                responsePresetId: 'p1',
                enabled: true,
              })
            }
          >
            add-mock
          </button>
          <span data-testid="mocks">{api.apiMocks.length}</span>
        </div>
      );
    }

    render(
      <SwitchboardProvider config={{ persistence: false, urlScenarioParam: false }}>
        <ApiProbe />
      </SwitchboardProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'add-preset' }).click();
    });
    expect(screen.getByTestId('presets').textContent).toBe('1');

    act(() => {
      screen.getByRole('button', { name: 'add-mock' }).click();
    });
    expect(screen.getByTestId('mocks').textContent).toBe('1');
  });
});
