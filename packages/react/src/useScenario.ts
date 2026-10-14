import type { Scenario } from '@switchboard/core';

import { useSwitchboardInstance } from './context.js';
import { useSwitchboardSelector } from './useSwitchboardSelector.js';

export interface UseScenarioResult {
  activeScenarioId: string | null;
  scenarios: Scenario[];
  isSupported: true;
  createScenario: (scenario: Scenario) => void;
  updateScenario: (id: string, patch: Partial<Omit<Scenario, 'id'>>) => void;
  deleteScenario: (id: string) => void;
  activateScenario: (id: string) => void;
  duplicateScenario: (id: string, newId?: string) => Scenario;
  exportScenarios: () => string;
  importScenarios: (json: string) => void;
  saveCurrentAsScenario: (id: string, name: string) => void;
}

export function useScenario(): UseScenarioResult {
  const instance = useSwitchboardInstance();
  const activeScenarioId = useSwitchboardSelector((state) => state.activeScenarioId);
  const scenarios = useSwitchboardSelector((state) => Object.values(state.scenarios));

  return {
    activeScenarioId,
    scenarios,
    isSupported: true,
    createScenario: (scenario) => instance.createScenario(scenario),
    updateScenario: (id, patch) => instance.updateScenario(id, patch),
    deleteScenario: (id) => instance.deleteScenario(id),
    activateScenario: (id) => instance.activateScenario(id),
    duplicateScenario: (id, newId) => instance.duplicateScenario(id, newId),
    exportScenarios: () => instance.exportScenarios(),
    importScenarios: (json) => instance.importScenarios(json),
    saveCurrentAsScenario: (id, name) => {
      const state = instance.getState();
      instance.createScenario({
        id,
        name,
        features: { ...state.features },
        user: { ...state.user },
        environment: state.environment,
      });
    },
  };
}
