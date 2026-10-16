import { API_MOCK_STATUS_CODES, type ApiMockRule, type SwitchboardState } from '@switchboard-js/core';

import { escapeHtml } from './tabs.js';
import type { ApiPickerState } from './types.js';

function presetLabel(state: SwitchboardState, presetId: string): string {
  if (presetId === 'other') return 'Other';
  return state.responsePresets[presetId]?.name ?? presetId;
}

function pickerMenu(open: boolean, optionsHtml: string): string {
  return open ? `<div class="picker-menu" role="listbox">${optionsHtml}</div>` : '';
}

export function apiMockRuleCard(
  state: SwitchboardState,
  rule: ApiMockRule,
  picker: ApiPickerState | null,
  scope: 'global' | 'scenario',
): string {
  const ruleId = rule.id;
  const statusOpen = picker?.kind === 'status' && picker.ruleId === ruleId;
  const responseOpen = picker?.kind === 'response' && picker.ruleId === ruleId;

  const statusOptions = API_MOCK_STATUS_CODES.map(
    (code) =>
      `<button type="button" class="picker-option" role="option" data-action="pick-status" data-scope="${scope}" data-rule-id="${escapeHtml(
        ruleId,
      )}" data-value="${code}">${code}</button>`,
  ).join('');

  const responseOptions = [
    ...Object.values(state.responsePresets).map(
      (preset) =>
        `<button type="button" class="picker-option" role="option" data-action="pick-response" data-scope="${scope}" data-rule-id="${escapeHtml(
          ruleId,
        )}" data-value="${escapeHtml(preset.id)}">${escapeHtml(preset.name)}</button>`,
    ),
    `<button type="button" class="picker-option" role="option" data-action="pick-response" data-scope="${scope}" data-rule-id="${escapeHtml(
      ruleId,
    )}" data-value="other">Other</button>`,
  ].join('');

  const customJson =
    rule.responsePresetId === 'other'
      ? `<div class="mock-custom">
          <textarea data-field="mock-custom-json" data-scope="${scope}" data-rule-id="${escapeHtml(
            ruleId,
          )}" rows="4" aria-label="Custom JSON">${escapeHtml(
            JSON.stringify(rule.customJson ?? {}, null, 2),
          )}</textarea>
          <button type="button" class="action" data-action="save-mock-custom-json" data-scope="${scope}" data-rule-id="${escapeHtml(
            ruleId,
          )}">Save JSON</button>
        </div>`
      : '';

  return `<div class="mock-rule">
  <div class="mock-rule-top">
    <span class="mock-url mono" title="${escapeHtml(rule.url)}">${escapeHtml(rule.url)}</span>
    <input class="toggle" type="checkbox" role="switch" data-action="toggle-api-mock" data-scope="${scope}" data-rule-id="${escapeHtml(
      ruleId,
    )}" ${rule.enabled ? 'checked' : ''} aria-label="Enable ${escapeHtml(rule.url)}" />
  </div>
  <div class="mock-rule-controls">
    <div class="mock-field">
      <span class="mock-label">Status</span>
      <div class="mock-cell">
        <button type="button" class="picker-trigger picker-dropdown" data-action="toggle-picker" data-picker="status" data-rule-id="${escapeHtml(
          ruleId,
        )}" aria-expanded="${statusOpen}" aria-haspopup="listbox">${rule.statusCode}<span class="picker-caret" aria-hidden="true"></span></button>
        ${pickerMenu(statusOpen, statusOptions)}
      </div>
    </div>
    <div class="mock-field">
      <span class="mock-label">Response</span>
      <div class="mock-cell mock-cell-response">
        <button type="button" class="picker-trigger picker-dropdown" data-action="toggle-picker" data-picker="response" data-rule-id="${escapeHtml(
          ruleId,
        )}" aria-expanded="${responseOpen}" aria-haspopup="listbox">${escapeHtml(
          presetLabel(state, rule.responsePresetId),
        )}<span class="picker-caret" aria-hidden="true"></span></button>
        ${pickerMenu(responseOpen, responseOptions)}
      </div>
    </div>
  </div>
  ${customJson}
</div>`;
}
