import type { FeatureInput, Switchboard, SwitchboardConfig, UserContext } from '../types.js';
import { createApiMockMethods } from './api-mocks.js';
import { applyEnvironmentPreset } from './environment.js';
import { type RuntimeContext, getSnapshot, notify, reportError } from './runtime.js';
import { createScenarioMethods } from './scenarios.js';
import { cloneUser, resolveFeatureValue } from './state.js';
import {
  SwitchboardValidationError,
  normalizeFeatureDefinition,
  validateUserContext,
} from '../validate.js';

const DEFAULT_ENVIRONMENT = 'development';

export function createSwitchboardApi(
  ctx: RuntimeContext,
  config: SwitchboardConfig,
  defaultUser: UserContext,
  environmentPresets: NonNullable<SwitchboardConfig['environments']>,
): Switchboard {
  const scenarioMethods = createScenarioMethods(ctx);
  const apiMockMethods = createApiMockMethods(ctx);

  return {
    isEnabled(feature) {
      const entry = ctx.features.get(feature);
      if (!entry) return false;
      return resolveFeatureValue(entry.definition, ctx.getEnvironment(), entry.override);
    },

    getFeature(feature) {
      const entry = ctx.features.get(feature);
      if (!entry) return undefined;
      return resolveFeatureValue(entry.definition, ctx.getEnvironment(), entry.override);
    },

    setFeature(feature, enabled) {
      if (typeof enabled !== 'boolean') {
        throw new SwitchboardValidationError('feature value must be a boolean');
      }
      const entry = ctx.features.get(feature);
      if (!entry) {
        ctx.features.set(feature, { definition: { default: enabled }, override: enabled });
      } else {
        const resolved = resolveFeatureValue(entry.definition, ctx.getEnvironment(), undefined);
        entry.override = enabled === resolved ? undefined : enabled;
      }
      ctx.setActiveScenarioId(null);
      notify(ctx);
    },

    registerFeature(name, definition) {
      if (typeof name !== 'string' || name.length === 0) {
        throw new SwitchboardValidationError('feature name must be a non-empty string');
      }
      const normalized = normalizeFeatureDefinition(definition as FeatureInput);
      ctx.features.set(name, {
        definition: normalized,
        override: ctx.features.get(name)?.override,
      });
      notify(ctx);
    },

    getFeatures() {
      return { ...getSnapshot(ctx).features };
    },

    getUser() {
      return cloneUser(ctx.getUser());
    },

    setUser(partial) {
      if (partial === null || typeof partial !== 'object' || Array.isArray(partial)) {
        throw new SwitchboardValidationError('user update must be an object');
      }
      ctx.setUser(cloneUser(validateUserContext({ ...ctx.getUser(), ...partial })));
      ctx.setActiveScenarioId(null);
      notify(ctx);
    },

    resetUser() {
      ctx.setUser(cloneUser(defaultUser));
      ctx.setActiveScenarioId(null);
      notify(ctx);
    },

    getEnvironment() {
      return ctx.getEnvironment();
    },

    setEnvironment(name) {
      if (typeof name !== 'string' || name.length === 0) {
        throw new SwitchboardValidationError('environment name must be a non-empty string');
      }
      ctx.setEnvironment(name);
      applyEnvironmentPreset(ctx.features, name, environmentPresets, ctx.setUser);
      ctx.setActiveScenarioId(null);
      notify(ctx);
    },

    ...scenarioMethods,
    ...apiMockMethods,

    getState() {
      return getSnapshot(ctx);
    },

    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new SwitchboardValidationError('listener must be a function');
      }
      ctx.listeners.add(listener);
      return () => {
        ctx.listeners.delete(listener);
      };
    },

    reset() {
      for (const entry of ctx.features.values()) {
        entry.override = undefined;
      }
      ctx.setUser(cloneUser(defaultUser));
      ctx.setEnvironment(config.environment ?? DEFAULT_ENVIRONMENT);
      ctx.setActiveScenarioId(null);

      if (ctx.persistence) {
        try {
          ctx.persistence.remove(ctx.persistenceKey);
        } catch (error) {
          reportError(ctx, error);
        }
      }

      notify(ctx);
    },
  };
}
