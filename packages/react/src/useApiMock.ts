import type { ApiMockRule, MockJsonPreset } from '@switchboard/core';

import { useSwitchboardInstance } from './context.js';
import { useSwitchboardSelector } from './useSwitchboardSelector.js';

export interface UseApiMockResult {
  responsePresets: MockJsonPreset[];
  apiMocks: ApiMockRule[];
  effectiveApiMocks: ApiMockRule[];
  createResponsePreset: (preset: MockJsonPreset) => void;
  updateResponsePreset: (id: string, patch: Partial<Omit<MockJsonPreset, 'id'>>) => void;
  deleteResponsePreset: (id: string) => void;
  createApiMock: (rule: ApiMockRule) => void;
  updateApiMock: (id: string, patch: Partial<Omit<ApiMockRule, 'id'>>) => void;
  deleteApiMock: (id: string) => void;
  setApiMockEnabled: (id: string, enabled: boolean) => void;
}

export function useApiMock(): UseApiMockResult {
  const instance = useSwitchboardInstance();
  const responsePresets = useSwitchboardSelector((state) => Object.values(state.responsePresets));
  const apiMocks = useSwitchboardSelector((state) => Object.values(state.apiMocks));
  const effectiveApiMocks = useSwitchboardSelector((state) => {
    const activeId = state.activeScenarioId;
    if (activeId && state.scenarios[activeId]?.apiMocks !== undefined) {
      return state.scenarios[activeId]!.apiMocks ?? [];
    }
    return Object.values(state.apiMocks);
  });

  return {
    responsePresets,
    apiMocks,
    effectiveApiMocks,
    createResponsePreset: (preset) => instance.createResponsePreset(preset),
    updateResponsePreset: (id, patch) => instance.updateResponsePreset(id, patch),
    deleteResponsePreset: (id) => instance.deleteResponsePreset(id),
    createApiMock: (rule) => instance.createApiMock(rule),
    updateApiMock: (id, patch) => instance.updateApiMock(id, patch),
    deleteApiMock: (id) => instance.deleteApiMock(id),
    setApiMockEnabled: (id, enabled) => instance.setApiMockEnabled(id, enabled),
  };
}
