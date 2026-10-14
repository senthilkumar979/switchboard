import type { ApiMockRule, MockJsonPreset, Switchboard } from '../types.js';
import {
  cloneApiMockRule,
  cloneMockJsonPreset,
  validateApiMockRule,
  validateMockJsonPreset,
} from '../validate/api-mock.js';
import { SwitchboardValidationError } from '../validate/errors.js';
import { type RuntimeContext, notify } from './runtime.js';

export function createApiMockMethods(
  ctx: RuntimeContext,
): Pick<
  Switchboard,
  | 'createResponsePreset'
  | 'updateResponsePreset'
  | 'deleteResponsePreset'
  | 'getResponsePresets'
  | 'createApiMock'
  | 'updateApiMock'
  | 'deleteApiMock'
  | 'getApiMocks'
  | 'setApiMockEnabled'
  | 'getEffectiveApiMocks'
> {
  return {
    createResponsePreset(input) {
      const preset = validateMockJsonPreset(input);
      if (ctx.responsePresets.has(preset.id)) {
        throw new SwitchboardValidationError(`Response preset "${preset.id}" already exists`);
      }
      ctx.responsePresets.set(preset.id, cloneMockJsonPreset(preset));
      notify(ctx);
    },

    updateResponsePreset(id, patch) {
      const existing = ctx.responsePresets.get(id);
      if (!existing) {
        throw new SwitchboardValidationError(`Response preset "${id}" not found`);
      }
      const next = validateMockJsonPreset({ ...existing, ...patch, id });
      ctx.responsePresets.set(id, cloneMockJsonPreset(next));
      notify(ctx);
    },

    deleteResponsePreset(id) {
      if (!ctx.responsePresets.has(id)) {
        throw new SwitchboardValidationError(`Response preset "${id}" not found`);
      }
      ctx.responsePresets.delete(id);
      notify(ctx);
    },

    getResponsePresets() {
      return [...ctx.responsePresets.values()].map(cloneMockJsonPreset);
    },

    createApiMock(input) {
      const rule = validateApiMockRule(input);
      if (ctx.apiMocks.has(rule.id)) {
        throw new SwitchboardValidationError(`API mock "${rule.id}" already exists`);
      }
      ctx.apiMocks.set(rule.id, cloneApiMockRule(rule));
      notify(ctx);
    },

    updateApiMock(id, patch) {
      const existing = ctx.apiMocks.get(id);
      if (!existing) {
        throw new SwitchboardValidationError(`API mock "${id}" not found`);
      }
      const next = validateApiMockRule({ ...existing, ...patch, id });
      ctx.apiMocks.set(id, cloneApiMockRule(next));
      notify(ctx);
    },

    deleteApiMock(id) {
      if (!ctx.apiMocks.has(id)) {
        throw new SwitchboardValidationError(`API mock "${id}" not found`);
      }
      ctx.apiMocks.delete(id);
      notify(ctx);
    },

    getApiMocks() {
      return [...ctx.apiMocks.values()].map(cloneApiMockRule);
    },

    setApiMockEnabled(id, enabled) {
      if (typeof enabled !== 'boolean') {
        throw new SwitchboardValidationError('enabled must be a boolean');
      }
      const existing = ctx.apiMocks.get(id);
      if (!existing) {
        throw new SwitchboardValidationError(`API mock "${id}" not found`);
      }
      ctx.apiMocks.set(id, cloneApiMockRule({ ...existing, enabled }));
      notify(ctx);
    },

    getEffectiveApiMocks() {
      return resolveEffectiveApiMocks(ctx);
    },
  };
}

export function resolveEffectiveApiMocks(ctx: RuntimeContext): ApiMockRule[] {
  const activeId = ctx.getActiveScenarioId();
  if (activeId) {
    const scenario = ctx.scenarios.get(activeId);
    if (scenario && scenario.apiMocks !== undefined) {
      return scenario.apiMocks.map(cloneApiMockRule);
    }
  }
  return [...ctx.apiMocks.values()].map(cloneApiMockRule);
}

export function resolveMockBody(
  rule: ApiMockRule,
  presets: Map<string, MockJsonPreset>,
): unknown {
  if (rule.responsePresetId === 'other') {
    return rule.customJson !== undefined ? rule.customJson : {};
  }
  const preset = presets.get(rule.responsePresetId);
  return preset ? preset.json : {};
}
