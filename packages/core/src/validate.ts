export { SwitchboardValidationError, isPlainObject } from './validate/errors.js';
export { isFeatureValue, normalizeFeatureDefinition } from './validate/features.js';
export { validateUserContext } from './validate/user.js';
export { validateScenario, cloneScenario } from './validate/scenario.js';
export {
  validateApiMockRule,
  validateMockJsonPreset,
  cloneApiMockRule,
  cloneMockJsonPreset,
} from './validate/api-mock.js';
export { assertPersistenceOption, isPersistedSnapshot, validateConfig } from './validate/config.js';
