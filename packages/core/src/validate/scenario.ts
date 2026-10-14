import type { Scenario } from '../types.js';
import { cloneApiMockRule, validateApiMockRule } from './api-mock.js';
import { SwitchboardValidationError, isPlainObject } from './errors.js';
import { isFeatureValue } from './features.js';
import { validateUserContext } from './user.js';

export function validateScenario(input: unknown, label = 'scenario'): Scenario {
  if (!isPlainObject(input)) {
    throw new SwitchboardValidationError(`${label} must be an object`);
  }
  if (typeof input.id !== 'string' || input.id.length === 0) {
    throw new SwitchboardValidationError(`${label}.id must be a non-empty string`);
  }
  if (typeof input.name !== 'string' || input.name.length === 0) {
    throw new SwitchboardValidationError(`${label}.name must be a non-empty string`);
  }

  const scenario: Scenario = {
    id: input.id,
    name: input.name,
  };

  if (input.features !== undefined) {
    if (!isPlainObject(input.features)) {
      throw new SwitchboardValidationError(`${label}.features must be an object`);
    }
    const features: Record<string, boolean> = {};
    for (const [name, value] of Object.entries(input.features)) {
      if (!isFeatureValue(value)) {
        throw new SwitchboardValidationError(`${label}.features.${name} must be a boolean`);
      }
      features[name] = value;
    }
    scenario.features = features;
  }

  if (input.user !== undefined) {
    scenario.user = validateUserContext(input.user, `${label}.user`);
  }

  if (input.environment !== undefined) {
    if (typeof input.environment !== 'string') {
      throw new SwitchboardValidationError(`${label}.environment must be a string`);
    }
    scenario.environment = input.environment;
  }

  if (input.metadata !== undefined) {
    if (!isPlainObject(input.metadata)) {
      throw new SwitchboardValidationError(`${label}.metadata must be an object`);
    }
    scenario.metadata = { ...input.metadata };
  }

  if (input.apiMocks !== undefined) {
    if (!Array.isArray(input.apiMocks)) {
      throw new SwitchboardValidationError(`${label}.apiMocks must be an array`);
    }
    scenario.apiMocks = input.apiMocks.map((rule, index) =>
      validateApiMockRule(rule, `${label}.apiMocks[${index}]`),
    );
  }

  return scenario;
}

export function cloneScenario(scenario: Scenario): Scenario {
  return {
    id: scenario.id,
    name: scenario.name,
    features: scenario.features ? { ...scenario.features } : undefined,
    user: scenario.user ? validateUserContext(scenario.user) : undefined,
    environment: scenario.environment,
    metadata: scenario.metadata ? { ...scenario.metadata } : undefined,
    apiMocks: scenario.apiMocks ? scenario.apiMocks.map(cloneApiMockRule) : undefined,
  };
}
