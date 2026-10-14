import type { Switchboard } from '@switchboard/core';

import { handleApiRuleAction } from './api-rule-events.js';
import { patchApiMock, readMockScope } from './api-mock-patch.js';
import type { ApiPickerState } from './types.js';

export interface ApiEventContext {
  instance: Switchboard | null;
  picker: ApiPickerState | null;
  setPicker: (picker: ApiPickerState | null) => void;
  setStatusMessage: (message: string) => void;
  requestRender: () => void;
}

export function handleApiAction(
  action: string,
  target: Element,
  root: ShadowRoot,
  ctx: ApiEventContext,
): boolean {
  if (!ctx.instance) return false;

  if (action === 'toggle-picker') {
    const kind = target.getAttribute('data-picker');
    const ruleId = target.getAttribute('data-rule-id');
    if ((kind !== 'status' && kind !== 'response') || !ruleId) return true;
    const next: ApiPickerState | null =
      ctx.picker?.kind === kind && ctx.picker.ruleId === ruleId ? null : { kind, ruleId };
    ctx.setPicker(next);
    ctx.requestRender();
    return true;
  }

  if (action === 'pick-status') {
    const ruleId = target.getAttribute('data-rule-id');
    const value = Number(target.getAttribute('data-value'));
    if (!ruleId || !Number.isInteger(value)) return true;
    try {
      ctx.setPicker(null);
      ctx.setStatusMessage(`Status set to ${value}`);
      patchApiMock(ctx.instance, readMockScope(target), ruleId, { statusCode: value });
    } catch (error) {
      ctx.setStatusMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      ctx.requestRender();
    }
    return true;
  }

  if (action === 'pick-response') {
    const ruleId = target.getAttribute('data-rule-id');
    const value = target.getAttribute('data-value');
    if (!ruleId || !value) return true;
    try {
      ctx.setPicker(null);
      ctx.setStatusMessage('Response updated');
      patchApiMock(ctx.instance, readMockScope(target), ruleId, { responsePresetId: value });
    } catch (error) {
      ctx.setStatusMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      ctx.requestRender();
    }
    return true;
  }

  return handleApiRuleAction(action, target, root, ctx);
}
