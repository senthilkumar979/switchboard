import type {
  FeatureInput,
  PersistedSnapshot,
  PersistenceAdapter,
  PersistenceOption,
  SwitchboardConfig,
} from '../types.js';
import { SwitchboardValidationError, isPlainObject } from './errors.js';
import { isFeatureValue, normalizeFeatureDefinition } from './features.js';
import { validateApiMockRule, validateMockJsonPreset } from './api-mock.js';
import { validateScenario } from './scenario.js';
import { validateEnvironmentPresets } from './environments.js';
import { validateUserContext } from './user.js';

export function isPersistedSnapshot(value: unknown): value is PersistedSnapshot {
  if (!isPlainObject(value)) return false;
  if (value.version !== 1) return false;
  if (!isPlainObject(value.features)) return false;
  if (!isPlainObject(value.user)) return false;
  if (typeof value.environment !== 'string') return false;

  for (const featureValue of Object.values(value.features)) {
    if (!isFeatureValue(featureValue)) return false;
  }

  try {
    validateUserContext(value.user, 'persisted.user');
  } catch {
    return false;
  }

  if (value.scenarios !== undefined) {
    if (!isPlainObject(value.scenarios)) return false;
    try {
      for (const scenario of Object.values(value.scenarios)) {
        validateScenario(scenario, 'persisted.scenario');
      }
    } catch {
      return false;
    }
  }

  if (
    value.activeScenarioId !== undefined &&
    value.activeScenarioId !== null &&
    typeof value.activeScenarioId !== 'string'
  ) {
    return false;
  }

  if (value.responsePresets !== undefined) {
    if (!isPlainObject(value.responsePresets)) return false;
    try {
      for (const preset of Object.values(value.responsePresets)) {
        validateMockJsonPreset(preset, 'persisted.responsePreset');
      }
    } catch {
      return false;
    }
  }

  if (value.apiMocks !== undefined) {
    if (!isPlainObject(value.apiMocks)) return false;
    try {
      for (const rule of Object.values(value.apiMocks)) {
        validateApiMockRule(rule, 'persisted.apiMock');
      }
    } catch {
      return false;
    }
  }

  return true;
}


export function assertPersistenceOption(option: PersistenceOption | undefined): void {
  if (
    option === undefined ||
    option === false ||
    option === 'memory' ||
    option === 'localStorage'
  ) {
    return;
  }

  if (
    isPlainObject(option) &&
    typeof option.name === 'string' &&
    typeof (option as PersistenceAdapter).get === 'function' &&
    typeof (option as PersistenceAdapter).set === 'function' &&
    typeof (option as PersistenceAdapter).remove === 'function'
  ) {
    return;
  }

  throw new SwitchboardValidationError(
    'persistence must be "memory", "localStorage", false, or a PersistenceAdapter',
  );
}

export function validateConfig(config: SwitchboardConfig): void {
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    throw new SwitchboardValidationError('config must be an object');
  }

  if (config.features !== undefined) {
    if (!isPlainObject(config.features)) {
      throw new SwitchboardValidationError('features must be an object');
    }
    for (const [name, input] of Object.entries(config.features)) {
      if (name.length === 0) {
        throw new SwitchboardValidationError('feature names must be non-empty strings');
      }
      normalizeFeatureDefinition(input as FeatureInput);
    }
  }

  if (config.user !== undefined) {
    validateUserContext(config.user);
  }

  if (config.environment !== undefined && typeof config.environment !== 'string') {
    throw new SwitchboardValidationError('environment must be a string');
  }

  validateEnvironmentPresets(config.environments);

  if (config.scenarios !== undefined) {
    if (!Array.isArray(config.scenarios)) {
      throw new SwitchboardValidationError('scenarios must be an array');
    }
    for (const [index, scenario] of config.scenarios.entries()) {
      validateScenario(scenario, `scenarios[${index}]`);
    }
  }

  if (config.responsePresets !== undefined) {
    if (!Array.isArray(config.responsePresets)) {
      throw new SwitchboardValidationError('responsePresets must be an array');
    }
    for (const [index, preset] of config.responsePresets.entries()) {
      validateMockJsonPreset(preset, `responsePresets[${index}]`);
    }
  }

  if (config.apiMocks !== undefined) {
    if (!Array.isArray(config.apiMocks)) {
      throw new SwitchboardValidationError('apiMocks must be an array');
    }
    for (const [index, rule] of config.apiMocks.entries()) {
      validateApiMockRule(rule, `apiMocks[${index}]`);
    }
  }

  if (
    config.urlScenarioParam !== undefined &&
    config.urlScenarioParam !== false &&
    typeof config.urlScenarioParam !== 'string'
  ) {
    throw new SwitchboardValidationError('urlScenarioParam must be a string or false');
  }

  if (config.persistenceKey !== undefined && typeof config.persistenceKey !== 'string') {
    throw new SwitchboardValidationError('persistenceKey must be a string');
  }

  if (config.onError !== undefined && typeof config.onError !== 'function') {
    throw new SwitchboardValidationError('onError must be a function');
  }

  assertPersistenceOption(config.persistence);
}
