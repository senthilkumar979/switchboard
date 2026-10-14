import type {
  ApiMockRule,
  FeatureInput,
  MockJsonPreset,
  Scenario,
  Switchboard,
  SwitchboardConfig,
  SwitchboardListener,
  UserContext,
} from './types.js';
import { createSwitchboardApi } from './internal/api.js';
import { getSnapshot, hydrate, persist, type RuntimeContext } from './internal/runtime.js';
import { applyScenarioToContext } from './internal/scenarios.js';
import { readUrlScenarioId } from './internal/url.js';
import { type InternalFeature, cloneUser } from './internal/state.js';
import { resolvePersistence } from './persistence/index.js';
import {
  normalizeFeatureDefinition,
  validateConfig,
  validateScenario,
  validateUserContext,
} from './validate.js';
import {
  cloneApiMockRule,
  cloneMockJsonPreset,
  validateApiMockRule,
  validateMockJsonPreset,
} from './validate/api-mock.js';
import { cloneScenario } from './validate/scenario.js';

const DEFAULT_ENVIRONMENT = 'development';
const DEFAULT_PERSISTENCE_KEY = 'switchboard';

export function createSwitchboard(config: SwitchboardConfig = {}): Switchboard {
  validateConfig(config);

  const defaultUser: UserContext = config.user ? cloneUser(validateUserContext(config.user)) : {};
  const features = new Map<string, InternalFeature>();
  const scenarios = new Map<string, Scenario>();
  const responsePresets = new Map<string, MockJsonPreset>();
  const apiMocks = new Map<string, ApiMockRule>();

  for (const [name, input] of Object.entries(config.features ?? {})) {
    features.set(name, {
      definition: normalizeFeatureDefinition(input as FeatureInput),
      override: undefined,
    });
  }

  for (const scenario of config.scenarios ?? []) {
    const validated = validateScenario(scenario);
    scenarios.set(validated.id, cloneScenario(validated));
  }

  for (const preset of config.responsePresets ?? []) {
    const validated = validateMockJsonPreset(preset);
    responsePresets.set(validated.id, cloneMockJsonPreset(validated));
  }

  for (const rule of config.apiMocks ?? []) {
    const validated = validateApiMockRule(rule);
    apiMocks.set(validated.id, cloneApiMockRule(validated));
  }

  let environment = config.environment ?? DEFAULT_ENVIRONMENT;
  let user = cloneUser(defaultUser);
  let activeScenarioId: string | null = null;
  const listeners = new Set<SwitchboardListener>();

  const ctx: RuntimeContext = {
    features,
    scenarios,
    responsePresets,
    apiMocks,
    getUser: () => user,
    setUser: (next) => {
      user = next;
    },
    getDefaultUser: () => defaultUser,
    getEnvironment: () => environment,
    setEnvironment: (next) => {
      environment = next;
    },
    getActiveScenarioId: () => activeScenarioId,
    setActiveScenarioId: (id) => {
      activeScenarioId = id;
    },
    listeners,
    persistence: resolvePersistence(config.persistence),
    persistenceKey: config.persistenceKey ?? DEFAULT_PERSISTENCE_KEY,
    onError: config.onError,
    cachedState: null,
  };

  hydrate(ctx);

  const urlScenarioId = readUrlScenarioId(config.urlScenarioParam);
  if (urlScenarioId && ctx.scenarios.has(urlScenarioId)) {
    applyScenarioToContext(ctx, ctx.scenarios.get(urlScenarioId)!);
  }

  ctx.cachedState = getSnapshot(ctx);

  const api = createSwitchboardApi(ctx, config, defaultUser, config.environments ?? {});
  persist(ctx, ctx.cachedState);
  return api;
}
