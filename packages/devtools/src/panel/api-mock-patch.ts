import type { ApiMockRule, Switchboard } from '@switchboard-js/core';

export type MockScope = 'global' | 'scenario';

export function readMockScope(target: Element): MockScope {
  return target.getAttribute('data-scope') === 'scenario' ? 'scenario' : 'global';
}

export function patchApiMock(
  instance: Switchboard,
  scope: MockScope,
  ruleId: string,
  patch: Partial<Omit<ApiMockRule, 'id'>>,
): void {
  if (scope === 'global') {
    instance.updateApiMock(ruleId, patch);
    return;
  }

  const activeId = instance.getActiveScenarioId();
  if (!activeId) throw new Error('Activate a scenario first');
  const scenario = instance.getScenario(activeId);
  if (!scenario?.apiMocks) throw new Error('Active scenario has no API mocks');

  const next = scenario.apiMocks.map((rule) =>
    rule.id === ruleId ? { ...rule, ...patch } : rule,
  );
  if (!next.some((rule) => rule.id === ruleId)) {
    throw new Error(`API mock "${ruleId}" not found on active scenario`);
  }
  instance.updateScenario(activeId, { apiMocks: next });
}

export function setMockEnabled(
  instance: Switchboard,
  scope: MockScope,
  ruleId: string,
  enabled: boolean,
): void {
  if (scope === 'global') {
    instance.setApiMockEnabled(ruleId, enabled);
    return;
  }
  patchApiMock(instance, scope, ruleId, { enabled });
}
