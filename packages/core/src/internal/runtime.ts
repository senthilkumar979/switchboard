import type {
  ApiMockRule,
  MockJsonPreset,
  PersistedSnapshot,
  PersistenceAdapter,
  Scenario,
  SwitchboardListener,
  SwitchboardState,
  UserContext,
} from '../types.js';
import {
  cloneApiMockRule,
  cloneMockJsonPreset,
  validateApiMockRule,
  validateMockJsonPreset,
} from '../validate/api-mock.js';
import { cloneScenario } from '../validate/scenario.js';
import { isPersistedSnapshot, validateUserContext } from '../validate.js';
import { type InternalFeature, buildState, cloneUser, resolveFeatureValue } from './state.js';

export interface RuntimeContext {
  features: Map<string, InternalFeature>;
  scenarios: Map<string, Scenario>;
  responsePresets: Map<string, MockJsonPreset>;
  apiMocks: Map<string, ApiMockRule>;
  getUser: () => UserContext;
  setUser: (user: UserContext) => void;
  getDefaultUser: () => UserContext;
  getEnvironment: () => string;
  setEnvironment: (environment: string) => void;
  getActiveScenarioId: () => string | null;
  setActiveScenarioId: (id: string | null) => void;
  listeners: Set<SwitchboardListener>;
  persistence: PersistenceAdapter | null;
  persistenceKey: string;
  onError?: (error: Error) => void;
  cachedState: SwitchboardState | null;
}

export function reportError(ctx: RuntimeContext, error: unknown): void {
  const err = error instanceof Error ? error : new Error(String(error));
  if (ctx.onError) {
    try {
      ctx.onError(err);
    } catch {
      // Never let onError crash the host application.
    }
    return;
  }
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn('[switchboard]', err.message);
  }
}

export function getSnapshot(ctx: RuntimeContext): SwitchboardState {
  if (ctx.cachedState) return ctx.cachedState;
  ctx.cachedState = buildState(
    ctx.features,
    ctx.getUser(),
    ctx.getEnvironment(),
    ctx.scenarios,
    ctx.getActiveScenarioId(),
    ctx.responsePresets,
    ctx.apiMocks,
  );
  return ctx.cachedState;
}

function toPersistedSnapshot(state: SwitchboardState): PersistedSnapshot {
  return {
    version: 1,
    features: { ...state.features },
    user: cloneUser(state.user),
    environment: state.environment,
    scenarios: { ...state.scenarios },
    activeScenarioId: state.activeScenarioId,
    responsePresets: { ...state.responsePresets },
    apiMocks: { ...state.apiMocks },
  };
}

export function persist(ctx: RuntimeContext, state: SwitchboardState): void {
  if (!ctx.persistence) return;
  try {
    ctx.persistence.set(ctx.persistenceKey, toPersistedSnapshot(state));
  } catch (error) {
    reportError(ctx, error);
  }
}

export function notify(ctx: RuntimeContext): void {
  ctx.cachedState = buildState(
    ctx.features,
    ctx.getUser(),
    ctx.getEnvironment(),
    ctx.scenarios,
    ctx.getActiveScenarioId(),
    ctx.responsePresets,
    ctx.apiMocks,
  );
  const snapshot = ctx.cachedState;
  for (const listener of ctx.listeners) {
    try {
      listener(snapshot);
    } catch (error) {
      reportError(ctx, error);
    }
  }
  persist(ctx, snapshot);
}

export function applyPersistedSnapshot(ctx: RuntimeContext, snapshot: PersistedSnapshot): void {
  ctx.setEnvironment(snapshot.environment);

  try {
    ctx.setUser(cloneUser(validateUserContext(snapshot.user, 'persisted.user')));
  } catch (error) {
    reportError(ctx, error);
    ctx.setUser(cloneUser(ctx.getDefaultUser()));
  }

  for (const [name, value] of Object.entries(snapshot.features)) {
    const existing = ctx.features.get(name);
    if (!existing) {
      ctx.features.set(name, {
        definition: { default: value },
        override: value,
      });
      continue;
    }

    const resolvedDefault = resolveFeatureValue(
      existing.definition,
      ctx.getEnvironment(),
      undefined,
    );
    existing.override = value === resolvedDefault ? undefined : value;
  }

  if (snapshot.scenarios) {
    for (const [id, scenario] of Object.entries(snapshot.scenarios)) {
      ctx.scenarios.set(id, cloneScenario(scenario));
    }
  }

  if (snapshot.activeScenarioId !== undefined) {
    ctx.setActiveScenarioId(snapshot.activeScenarioId);
  }

  if (snapshot.responsePresets) {
    for (const [id, preset] of Object.entries(snapshot.responsePresets)) {
      try {
        ctx.responsePresets.set(id, cloneMockJsonPreset(validateMockJsonPreset(preset)));
      } catch (error) {
        reportError(ctx, error);
      }
    }
  }

  if (snapshot.apiMocks) {
    for (const [id, rule] of Object.entries(snapshot.apiMocks)) {
      try {
        ctx.apiMocks.set(id, cloneApiMockRule(validateApiMockRule(rule)));
      } catch (error) {
        reportError(ctx, error);
      }
    }
  }
}

export function hydrate(ctx: RuntimeContext): void {
  if (!ctx.persistence) return;
  try {
    const snapshot = ctx.persistence.get(ctx.persistenceKey);
    if (!snapshot || !isPersistedSnapshot(snapshot)) return;
    applyPersistedSnapshot(ctx, snapshot);
  } catch (error) {
    reportError(ctx, error);
  }
}
