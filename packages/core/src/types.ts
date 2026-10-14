/**
 * Public types for @switchboard/core.
 */

export type FeatureValue = boolean;

export interface FeatureDefinition {
  /** Default enabled state when no override or environment default applies. */
  default: FeatureValue;
  /** Optional group name for UI organization. */
  group?: string;
  /** Environment-specific defaults keyed by environment name. */
  environments?: Record<string, FeatureValue>;
  /** Human-readable description. */
  description?: string;
}

export type FeatureInput = FeatureValue | FeatureDefinition;

export interface UserContext {
  id?: string;
  name?: string;
  role?: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface EnvironmentPreset {
  features?: Record<string, FeatureValue>;
  user?: UserContext;
  metadata?: Record<string, unknown>;
}

export interface FeatureMeta {
  default: FeatureValue;
  group?: string;
  description?: string;
  environments?: Record<string, FeatureValue>;
  /** True when the current value differs from the resolved default for the active environment. */
  isOverridden: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | '*';

export interface MockJsonPreset {
  id: string;
  name: string;
  json: unknown;
}

export interface ApiMockRule {
  id: string;
  /** Request pathname, e.g. `/api/payments`. */
  url: string;
  /** HTTP method to match. Defaults to `"*"`. */
  method?: HttpMethod;
  statusCode: number;
  /** Preset id, or `"other"` for `customJson`. */
  responsePresetId: string | 'other';
  /** Used when `responsePresetId` is `"other"`. */
  customJson?: unknown;
  enabled: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  features?: Record<string, FeatureValue>;
  user?: UserContext;
  environment?: string;
  metadata?: Record<string, unknown>;
  /** When set, replaces global apiMocks while this scenario is active. */
  apiMocks?: ApiMockRule[];
}

export interface SwitchboardState {
  features: Record<string, FeatureValue>;
  featureMeta: Record<string, FeatureMeta>;
  user: UserContext;
  environment: string;
  scenarios: Record<string, Scenario>;
  activeScenarioId: string | null;
  responsePresets: Record<string, MockJsonPreset>;
  apiMocks: Record<string, ApiMockRule>;
}

export interface PersistedSnapshot {
  version: 1;
  features: Record<string, FeatureValue>;
  user: UserContext;
  environment: string;
  scenarios?: Record<string, Scenario>;
  activeScenarioId?: string | null;
  responsePresets?: Record<string, MockJsonPreset>;
  apiMocks?: Record<string, ApiMockRule>;
}

export interface PersistenceAdapter {
  readonly name: string;
  get(key: string): PersistedSnapshot | null;
  set(key: string, value: PersistedSnapshot): void;
  remove(key: string): void;
}

export type PersistenceOption = PersistenceAdapter | 'memory' | 'localStorage' | false;

export interface SwitchboardConfig {
  features?: Record<string, FeatureInput>;
  user?: UserContext;
  /** Active environment name. Defaults to `"development"`. */
  environment?: string;
  /** Named environment presets (feature/user overrides when switching). */
  environments?: Record<string, EnvironmentPreset>;
  /** Initial scenarios to register. */
  scenarios?: Scenario[];
  /** Named JSON bodies selectable by mock rules. */
  responsePresets?: MockJsonPreset[];
  /** Standalone (global) API mock rules. */
  apiMocks?: ApiMockRule[];
  /**
   * Query param used to activate a scenario from the URL (e.g. `?scenario=admin-user`).
   * Set to `false` to disable. Defaults to `"scenario"`.
   */
  urlScenarioParam?: string | false;
  /**
   * Persistence adapter. Defaults to `"memory"`.
   * Pass `false` to disable persistence entirely.
   */
  persistence?: PersistenceOption;
  /** Storage key used by persistence adapters. Defaults to `"switchboard"`. */
  persistenceKey?: string;
  /** Called when persistence or validation fails without aborting the host app. */
  onError?: (error: Error) => void;
}

export type SwitchboardListener = (state: SwitchboardState) => void;

export interface Switchboard {
  isEnabled(feature: string): boolean;
  getFeature(feature: string): FeatureValue | undefined;
  setFeature(feature: string, enabled: FeatureValue): void;
  registerFeature(name: string, definition: FeatureInput): void;
  getFeatures(): Record<string, FeatureValue>;

  getUser(): UserContext;
  setUser(user: Partial<UserContext>): void;
  resetUser(): void;

  getEnvironment(): string;
  setEnvironment(name: string): void;

  createScenario(scenario: Scenario): void;
  updateScenario(id: string, patch: Partial<Omit<Scenario, 'id'>>): void;
  deleteScenario(id: string): void;
  getScenario(id: string): Scenario | undefined;
  getScenarios(): Scenario[];
  activateScenario(id: string): void;
  /** Clears the active scenario without resetting features/user overrides. */
  deactivateScenario(): void;
  getActiveScenarioId(): string | null;
  duplicateScenario(id: string, newId?: string): Scenario;
  exportScenarios(): string;
  importScenarios(json: string): void;

  createResponsePreset(preset: MockJsonPreset): void;
  updateResponsePreset(id: string, patch: Partial<Omit<MockJsonPreset, 'id'>>): void;
  deleteResponsePreset(id: string): void;
  getResponsePresets(): MockJsonPreset[];

  createApiMock(rule: ApiMockRule): void;
  updateApiMock(id: string, patch: Partial<Omit<ApiMockRule, 'id'>>): void;
  deleteApiMock(id: string): void;
  getApiMocks(): ApiMockRule[];
  setApiMockEnabled(id: string, enabled: boolean): void;
  /** Scenario apiMocks when present on the active scenario; otherwise global rules. */
  getEffectiveApiMocks(): ApiMockRule[];

  getState(): SwitchboardState;
  subscribe(listener: SwitchboardListener): () => void;
  reset(): void;
}

/** Status codes offered by the developer panel picker. */
export const API_MOCK_STATUS_CODES = [
  200, 201, 204, 400, 401, 403, 404, 409, 422, 500, 502, 503,
] as const;
