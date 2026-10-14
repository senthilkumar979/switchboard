import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  PACKAGE_NAME,
  PACKAGE_VERSION,
  SwitchboardValidationError,
  createMemoryPersistence,
  createSwitchboard,
} from './index.js';

describe('@switchboard/core package', () => {
  it('exports package identity', () => {
    expect(PACKAGE_NAME).toBe('@switchboard/core');
    expect(PACKAGE_VERSION).toBe('0.0.0');
  });
});

describe('createSwitchboard features', () => {
  it('registers boolean features and reads defaults', () => {
    const sb = createSwitchboard({
      features: {
        newDashboard: false,
        betaFeature: true,
      },
      persistence: false,
    });

    expect(sb.isEnabled('newDashboard')).toBe(false);
    expect(sb.isEnabled('betaFeature')).toBe(true);
    expect(sb.getFeature('missing')).toBeUndefined();
    expect(sb.isEnabled('missing')).toBe(false);
  });

  it('toggles features and notifies subscribers', () => {
    const sb = createSwitchboard({
      features: { newDashboard: false },
      persistence: false,
    });

    const listener = vi.fn();
    const unsubscribe = sb.subscribe(listener);

    sb.setFeature('newDashboard', true);

    expect(sb.isEnabled('newDashboard')).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]?.[0]?.features.newDashboard).toBe(true);

    unsubscribe();
    sb.setFeature('newDashboard', false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('supports grouped feature definitions and environment defaults', () => {
    const sb = createSwitchboard({
      environment: 'development',
      features: {
        newDashboard: {
          default: false,
          group: 'ui',
          description: 'New dashboard',
          environments: {
            staging: true,
          },
        },
      },
      persistence: false,
    });

    expect(sb.isEnabled('newDashboard')).toBe(false);
    sb.setEnvironment('staging');
    expect(sb.isEnabled('newDashboard')).toBe(true);
    expect(sb.getState().featureMeta.newDashboard?.group).toBe('ui');
  });

  it('marks overridden features in state metadata', () => {
    const sb = createSwitchboard({
      features: { flag: false },
      persistence: false,
    });

    expect(sb.getState().featureMeta.flag?.isOverridden).toBe(false);
    sb.setFeature('flag', true);
    expect(sb.getState().featureMeta.flag?.isOverridden).toBe(true);
    sb.setFeature('flag', false);
    expect(sb.getState().featureMeta.flag?.isOverridden).toBe(false);
  });

  it('registers features at runtime', () => {
    const sb = createSwitchboard({ persistence: false });
    sb.registerFeature('runtimeFlag', { default: true, group: 'runtime' });
    expect(sb.isEnabled('runtimeFlag')).toBe(true);
    expect(sb.getState().featureMeta.runtimeFlag?.group).toBe('runtime');
  });
});

describe('createSwitchboard user context', () => {
  it('reads and updates user context immutably', () => {
    const sb = createSwitchboard({
      user: {
        id: 'dev-user',
        name: 'Developer',
        role: 'admin',
        permissions: ['read', 'write'],
      },
      persistence: false,
    });

    const user = sb.getUser();
    expect(user.role).toBe('admin');
    user.role = 'mutated';
    expect(sb.getUser().role).toBe('admin');

    sb.setUser({ role: 'customer' });
    expect(sb.getUser().role).toBe('customer');
    expect(sb.getUser().id).toBe('dev-user');

    sb.resetUser();
    expect(sb.getUser().role).toBe('admin');
  });
});

describe('createSwitchboard subscriptions and reset', () => {
  it('returns immutable state snapshots', () => {
    const sb = createSwitchboard({
      features: { a: true },
      persistence: false,
    });

    const state = sb.getState();
    state.features.a = false;
    expect(sb.isEnabled('a')).toBe(true);
  });

  it('resets overrides, user, and environment', () => {
    const sb = createSwitchboard({
      features: { flag: false },
      user: { role: 'admin' },
      environment: 'development',
      persistence: false,
    });

    sb.setFeature('flag', true);
    sb.setUser({ role: 'customer' });
    sb.setEnvironment('staging');
    sb.reset();

    expect(sb.isEnabled('flag')).toBe(false);
    expect(sb.getUser().role).toBe('admin');
    expect(sb.getEnvironment()).toBe('development');
  });

  it('supports multiple independent instances', () => {
    const a = createSwitchboard({
      features: { flag: false },
      persistence: false,
    });
    const b = createSwitchboard({
      features: { flag: false },
      persistence: false,
    });

    a.setFeature('flag', true);
    expect(a.isEnabled('flag')).toBe(true);
    expect(b.isEnabled('flag')).toBe(false);
  });
});

describe('createSwitchboard persistence', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('persists and restores via memory adapter', () => {
    const persistence = createMemoryPersistence();

    const first = createSwitchboard({
      features: { flag: false },
      user: { role: 'admin' },
      persistence,
      persistenceKey: 'sb-test',
    });

    first.setFeature('flag', true);
    first.setUser({ role: 'customer' });

    const second = createSwitchboard({
      features: { flag: false },
      user: { role: 'admin' },
      persistence,
      persistenceKey: 'sb-test',
    });

    expect(second.isEnabled('flag')).toBe(true);
    expect(second.getUser().role).toBe('customer');
  });

  it('does not crash the host when persistence set fails', () => {
    const onError = vi.fn();
    const persistence = {
      name: 'failing',
      get: () => null,
      set: () => {
        throw new Error('write failed');
      },
      remove: () => undefined,
    };

    const sb = createSwitchboard({
      features: { flag: false },
      persistence,
      onError,
    });

    expect(() => sb.setFeature('flag', true)).not.toThrow();
    expect(sb.isEnabled('flag')).toBe(true);
    expect(onError).toHaveBeenCalled();
  });

  it('clears overrides on reset and persists defaults', () => {
    const persistence = createMemoryPersistence();
    const sb = createSwitchboard({
      features: { flag: false },
      persistence,
      persistenceKey: 'reset-key',
    });

    sb.setFeature('flag', true);
    sb.reset();

    expect(sb.isEnabled('flag')).toBe(false);
    expect(persistence.get('reset-key')?.features.flag).toBe(false);
  });
});

describe('createSwitchboard validation', () => {
  it('rejects invalid feature definitions', () => {
    expect(() =>
      createSwitchboard({
        // @ts-expect-error intentional invalid input
        features: { bad: 'yes' },
      }),
    ).toThrow(SwitchboardValidationError);
  });

  it('rejects invalid user permissions', () => {
    expect(() =>
      createSwitchboard({
        // @ts-expect-error intentional invalid input
        user: { permissions: [1, 2] },
      }),
    ).toThrow(SwitchboardValidationError);
  });
});

describe('createSwitchboard snapshot stability', () => {
  it('returns a stable getState snapshot between updates', () => {
    const sb = createSwitchboard({
      features: { flag: false },
      persistence: false,
    });

    const first = sb.getState();
    const second = sb.getState();
    expect(first).toBe(second);

    sb.setFeature('flag', true);
    const third = sb.getState();
    expect(third).not.toBe(first);
    expect(third.features.flag).toBe(true);
  });
});
