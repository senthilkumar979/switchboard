import type { SwitchboardState } from '@switchboard-js/core';

import { apiMockRuleCard } from './api-rule-card.js';
import { escapeHtml } from './tabs.js';
import type { ApiPickerState } from './types.js';

export function apiHtml(
  state: SwitchboardState,
  message: string,
  picker: ApiPickerState | null,
): string {
  const activeId = state.activeScenarioId;
  const scenarioMocks =
    activeId && state.scenarios[activeId]?.apiMocks !== undefined
      ? state.scenarios[activeId]!.apiMocks!
      : null;
  const scope = scenarioMocks ? 'scenario' : 'global';
  const rules = (scenarioMocks ?? Object.values(state.apiMocks))
    .map((rule) => apiMockRuleCard(state, rule, picker, scope))
    .join('');

  return `
    <div class="stack">
      <p class="muted">${
        scenarioMocks
          ? 'Editing active scenario API mocks. Custom JSON is the only free-text field.'
          : 'Editing global API mocks. Custom JSON is the only free-text field.'
      }</p>
      <p class="section-title">Mock rules</p>
      <div>${rules || '<p class="muted">No mock rules configured.</p>'}</div>
      ${
        message
          ? `<p class="status ${message.startsWith('Error') ? 'error' : 'success'}">${escapeHtml(
              message,
            )}</p>`
          : ''
      }
    </div>`;
}
