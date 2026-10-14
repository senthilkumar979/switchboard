import type { FeatureDefinition, FeatureInput, FeatureValue } from '../types.js';
import { SwitchboardValidationError, isPlainObject } from './errors.js';

export function isFeatureValue(value: unknown): value is FeatureValue {
  return typeof value === 'boolean';
}

export function normalizeFeatureDefinition(input: FeatureInput): FeatureDefinition {
  if (typeof input === 'boolean') {
    return { default: input };
  }

  if (!isPlainObject(input) || !isFeatureValue(input.default)) {
    throw new SwitchboardValidationError(
      'Feature definition must be a boolean or an object with a boolean `default`',
    );
  }

  const definition: FeatureDefinition = { default: input.default };

  if (input.group !== undefined) {
    if (typeof input.group !== 'string') {
      throw new SwitchboardValidationError('Feature `group` must be a string');
    }
    definition.group = input.group;
  }

  if (input.description !== undefined) {
    if (typeof input.description !== 'string') {
      throw new SwitchboardValidationError('Feature `description` must be a string');
    }
    definition.description = input.description;
  }

  if (input.environments !== undefined) {
    if (!isPlainObject(input.environments)) {
      throw new SwitchboardValidationError('Feature `environments` must be an object');
    }
    const environments: Record<string, FeatureValue> = {};
    for (const [name, value] of Object.entries(input.environments)) {
      if (!isFeatureValue(value)) {
        throw new SwitchboardValidationError(
          `Feature environment default "${name}" must be a boolean`,
        );
      }
      environments[name] = value;
    }
    definition.environments = environments;
  }

  return definition;
}
