import type { ApiMockRule, SwitchboardState } from '@switchboard/core';

import { escapeHtml } from './tabs.js';

function mockRowHtml(rule: ApiMockRule): string {
  const method = escapeHtml(rule.method ?? '*');
  const url = escapeHtml(rule.url);
  const status = String(rule.statusCode);
  const preset =
    rule.responsePresetId === 'other'
      ? 'custom JSON'
      : escapeHtml(rule.responsePresetId);
  return `
    <li class="scenario-mock">
      <span class="scenario-mock-method mono">${method}</span>
      <span class="scenario-mock-url mono" title="${url}">${url}</span>
      <span class="scenario-mock-status mono">${status}</span>
      <span class="muted">${preset}</span>
    </li>`;
}

function mocksPanelHtml(mocks: ApiMockRule[] | undefined): string {
  if (!mocks || mocks.length === 0) {
    return '<p class="muted scenario-mocks-empty">No API mocks in this scenario</p>';
  }
  return `
    <ul class="scenario-mocks">
      ${mocks.map(mockRowHtml).join('')}
    </ul>`;
}

export function scenariosHtml(
  state: SwitchboardState,
  message: string,
  expandedScenarioIds: ReadonlySet<string>,
): string {
  const scenarios = Object.values(state.scenarios);
  const list =
    scenarios
      .map((scenario) => {
        const isActive = state.activeScenarioId === scenario.id;
        const isExpanded = expandedScenarioIds.has(scenario.id);
        const badge = isActive ? '<span class="badge">active</span>' : '';
        const mockCount = scenario.apiMocks?.length ?? 0;
        const countLabel =
          mockCount === 0 ? 'No mocks' : `${mockCount} mock${mockCount === 1 ? '' : 's'}`;
        const action = isActive
          ? `<button type="button" class="action" data-action="deactivate-scenario">Deactivate</button>`
          : `<button type="button" class="action primary" data-action="activate-scenario" data-scenario-id="${escapeHtml(
              scenario.id,
            )}">Activate</button>`;

        return `
        <div class="scenario${isExpanded ? ' is-expanded' : ''}">
          <div class="scenario-header">
            <button
              type="button"
              class="scenario-toggle"
              data-action="toggle-scenario-expand"
              data-scenario-id="${escapeHtml(scenario.id)}"
              aria-expanded="${isExpanded}"
            >
              <span class="scenario-caret" aria-hidden="true"></span>
              <span class="scenario-meta">
                <span class="feature-name">${escapeHtml(scenario.name)}${badge}</span>
                <span class="group mono">${escapeHtml(scenario.id)} · ${countLabel}</span>
              </span>
            </button>
            ${action}
          </div>
          ${isExpanded ? `<div class="scenario-body">${mocksPanelHtml(scenario.apiMocks)}</div>` : ''}
        </div>`;
      })
      .join('') || '<p class="muted">No scenarios configured in code.</p>';

  return `
    <div class="stack">
      <div class="stat">
        <span class="muted">Active scenario</span>
        <div class="stat-value">${escapeHtml(state.activeScenarioId ?? 'none')}</div>
      </div>
      <p class="muted">Scenarios are defined in code. Expand one to see its API mocks, then activate or deactivate.</p>
      <p class="section-title">Saved</p>
      <div class="scenario-list">${list}</div>
      ${
        message
          ? `<p class="status ${message.startsWith('Error') ? 'error' : 'success'}">${escapeHtml(
              message,
            )}</p>`
          : ''
      }
    </div>`;
}
