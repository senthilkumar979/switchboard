import type { Scenario, Switchboard } from '../types.js';
import { SwitchboardValidationError, validateUserContext } from '../validate.js';
import { cloneScenario, validateScenario } from '../validate/scenario.js';
import type { RuntimeContext } from './runtime.js';
import { notify } from './runtime.js';
import { cloneUser, resolveFeatureValue } from './state.js';

export function applyScenarioToContext(ctx: RuntimeContext, scenario: Scenario): void {
  if (scenario.environment) {
    ctx.setEnvironment(scenario.environment);
  }

  if (scenario.user) {
    ctx.setUser(cloneUser(validateUserContext(scenario.user)));
  }

  if (scenario.features) {
    for (const [name, value] of Object.entries(scenario.features)) {
      const entry = ctx.features.get(name);
      if (!entry) {
        ctx.features.set(name, {
          definition: { default: value },
          override: value,
        });
        continue;
      }
      const resolved = resolveFeatureValue(entry.definition, ctx.getEnvironment(), undefined);
      entry.override = value === resolved ? undefined : value;
    }
  }

  ctx.setActiveScenarioId(scenario.id);
}

export function createScenarioMethods(ctx: RuntimeContext): Pick<
  Switchboard,
  | 'createScenario'
  | 'updateScenario'
  | 'deleteScenario'
  | 'getScenario'
  | 'getScenarios'
  | 'activateScenario'
  | 'deactivateScenario'
  | 'getActiveScenarioId'
  | 'duplicateScenario'
  | 'exportScenarios'
  | 'importScenarios'
> {
  return {
    createScenario(input) {
      const scenario = validateScenario(input);
      if (ctx.scenarios.has(scenario.id)) {
        throw new SwitchboardValidationError(`Scenario "${scenario.id}" already exists`);
      }
      ctx.scenarios.set(scenario.id, cloneScenario(scenario));
      notify(ctx);
    },

    updateScenario(id, patch) {
      const existing = ctx.scenarios.get(id);
      if (!existing) {
        throw new SwitchboardValidationError(`Scenario "${id}" not found`);
      }
      const next = validateScenario({ ...existing, ...patch, id });
      ctx.scenarios.set(id, cloneScenario(next));
      notify(ctx);
    },

    deleteScenario(id) {
      if (!ctx.scenarios.has(id)) {
        throw new SwitchboardValidationError(`Scenario "${id}" not found`);
      }
      ctx.scenarios.delete(id);
      if (ctx.getActiveScenarioId() === id) {
        ctx.setActiveScenarioId(null);
      }
      notify(ctx);
    },

    getScenario(id) {
      const scenario = ctx.scenarios.get(id);
      return scenario ? cloneScenario(scenario) : undefined;
    },

    getScenarios() {
      return [...ctx.scenarios.values()].map(cloneScenario);
    },

    activateScenario(id) {
      const scenario = ctx.scenarios.get(id);
      if (!scenario) {
        throw new SwitchboardValidationError(`Scenario "${id}" not found`);
      }
      applyScenarioToContext(ctx, scenario);
      notify(ctx);
    },

    deactivateScenario() {
      if (ctx.getActiveScenarioId() === null) return;
      ctx.setActiveScenarioId(null);
      notify(ctx);
    },

    getActiveScenarioId() {
      return ctx.getActiveScenarioId();
    },

    duplicateScenario(id, newId) {
      const existing = ctx.scenarios.get(id);
      if (!existing) {
        throw new SwitchboardValidationError(`Scenario "${id}" not found`);
      }
      const duplicateId = newId ?? `${id}-copy`;
      if (ctx.scenarios.has(duplicateId)) {
        throw new SwitchboardValidationError(`Scenario "${duplicateId}" already exists`);
      }
      const duplicated = cloneScenario({
        ...existing,
        id: duplicateId,
        name: `${existing.name} (copy)`,
      });
      ctx.scenarios.set(duplicateId, duplicated);
      notify(ctx);
      return cloneScenario(duplicated);
    },

    exportScenarios() {
      return JSON.stringify([...ctx.scenarios.values()].map(cloneScenario), null, 2);
    },

    importScenarios(json) {
      importScenariosJson(ctx, json);
      notify(ctx);
    },
  };
}

function importScenariosJson(ctx: RuntimeContext, json: string): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new SwitchboardValidationError('Invalid scenarios JSON');
  }
  const list = Array.isArray(parsed) ? parsed : [parsed];
  for (const item of list) {
    const scenario = validateScenario(item);
    ctx.scenarios.set(scenario.id, cloneScenario(scenario));
  }
}
