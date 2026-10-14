import { describe, expect, it } from 'vitest';

import { SwitchboardValidationError, createMemoryPersistence, createSwitchboard } from './index.js';

describe('scenarios', () => {
  it('creates, activates, and restores scenarios via persistence', () => {
    const persistence = createMemoryPersistence();

    const first = createSwitchboard({
      features: { newDashboard: false },
      user: { role: 'customer' },
      persistence,
      persistenceKey: 'scenario-test',
      urlScenarioParam: false,
    });

    first.createScenario({
      id: 'admin-user',
      name: 'Admin User',
      features: { newDashboard: true },
      user: { role: 'admin' },
    });

    first.activateScenario('admin-user');
    expect(first.isEnabled('newDashboard')).toBe(true);
    expect(first.getUser().role).toBe('admin');
    expect(first.getActiveScenarioId()).toBe('admin-user');

    const second = createSwitchboard({
      features: { newDashboard: false },
      user: { role: 'customer' },
      persistence,
      persistenceKey: 'scenario-test',
      urlScenarioParam: false,
    });

    expect(second.getScenarios()).toHaveLength(1);
    expect(second.getActiveScenarioId()).toBe('admin-user');
    expect(second.isEnabled('newDashboard')).toBe(true);
  });

  it('updates, duplicates, deletes, and exports/imports scenarios', () => {
    const sb = createSwitchboard({
      features: { flag: false },
      persistence: false,
      urlScenarioParam: false,
    });

    sb.createScenario({
      id: 'base',
      name: 'Base',
      features: { flag: true },
    });

    sb.updateScenario('base', { name: 'Base Updated' });
    expect(sb.getScenario('base')?.name).toBe('Base Updated');

    const copy = sb.duplicateScenario('base', 'base-2');
    expect(copy.id).toBe('base-2');
    expect(sb.getScenarios()).toHaveLength(2);

    const json = sb.exportScenarios();
    sb.deleteScenario('base');
    sb.deleteScenario('base-2');
    expect(sb.getScenarios()).toHaveLength(0);

    sb.importScenarios(json);
    expect(sb.getScenarios()).toHaveLength(2);
  });

  it('activates a scenario from the URL query param', () => {
    const previousLocation = (globalThis as { location?: Location }).location;
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: { search: '?scenario=from-url' },
    });

    try {
      const sb = createSwitchboard({
        features: { flag: false },
        persistence: false,
        scenarios: [
          {
            id: 'from-url',
            name: 'From URL',
            features: { flag: true },
            user: { role: 'qa' },
          },
        ],
      });

      expect(sb.getActiveScenarioId()).toBe('from-url');
      expect(sb.isEnabled('flag')).toBe(true);
      expect(sb.getUser().role).toBe('qa');
    } finally {
      Object.defineProperty(globalThis, 'location', {
        configurable: true,
        value: previousLocation,
      });
    }
  });

  it('rejects invalid scenario definitions', () => {
    const sb = createSwitchboard({ persistence: false, urlScenarioParam: false });
    expect(() =>
      sb.createScenario({
        id: '',
        name: 'Bad',
      }),
    ).toThrow(SwitchboardValidationError);
  });

  it('clears active scenario when manually mutating state', () => {
    const sb = createSwitchboard({
      features: { flag: false },
      persistence: false,
      urlScenarioParam: false,
      scenarios: [{ id: 's1', name: 'S1', features: { flag: true } }],
    });

    sb.activateScenario('s1');
    sb.setFeature('flag', false);
    expect(sb.getActiveScenarioId()).toBeNull();
  });

  it('deactivates the active scenario', () => {
    const sb = createSwitchboard({
      features: { flag: false },
      persistence: false,
      urlScenarioParam: false,
      scenarios: [{ id: 's1', name: 'S1', features: { flag: true } }],
    });

    sb.activateScenario('s1');
    expect(sb.getActiveScenarioId()).toBe('s1');
    sb.deactivateScenario();
    expect(sb.getActiveScenarioId()).toBeNull();
    expect(sb.isEnabled('flag')).toBe(true);
  });
});
