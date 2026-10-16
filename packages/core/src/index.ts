export { createSwitchboard } from './createSwitchboard.js';
export {
  createMemoryPersistence,
  createLocalStoragePersistence,
  resolvePersistence,
} from './persistence/index.js';
export {
  SwitchboardValidationError,
  isPersistedSnapshot,
  normalizeFeatureDefinition,
  validateConfig,
  validateUserContext,
  validateScenario,
  validateApiMockRule,
  validateMockJsonPreset,
} from './validate.js';

export { API_MOCK_STATUS_CODES } from './types.js';

export type {
  ApiMockRule,
  EnvironmentPreset,
  FeatureDefinition,
  FeatureInput,
  FeatureMeta,
  FeatureValue,
  HttpMethod,
  MockJsonPreset,
  PersistedSnapshot,
  PersistenceAdapter,
  PersistenceOption,
  Scenario,
  Switchboard,
  SwitchboardConfig,
  SwitchboardListener,
  SwitchboardState,
  UserContext,
} from './types.js';

export const PACKAGE_NAME = '@switchboard-js/core' as const;
export const PACKAGE_VERSION = '0.0.0' as const;
