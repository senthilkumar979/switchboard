import type { SwitchboardConfig } from '../types.js';
import { SwitchboardValidationError, isPlainObject } from './errors.js';
import { isFeatureValue } from './features.js';
import { validateUserContext } from './user.js';

export function validateEnvironmentPresets(
  environments: SwitchboardConfig['environments'],
): void {
  if (environments === undefined) return;

  if (!isPlainObject(environments)) {
    throw new SwitchboardValidationError('environments must be an object');
  }

  for (const [name, preset] of Object.entries(environments)) {
    if (!isPlainObject(preset)) {
      throw new SwitchboardValidationError(`environments.${name} must be an object`);
    }
    if (preset.features !== undefined) {
      if (!isPlainObject(preset.features)) {
        throw new SwitchboardValidationError(`environments.${name}.features must be an object`);
      }
      for (const [featureName, value] of Object.entries(preset.features)) {
        if (!isFeatureValue(value)) {
          throw new SwitchboardValidationError(
            `environments.${name}.features.${featureName} must be a boolean`,
          );
        }
      }
    }
    if (preset.user !== undefined) {
      validateUserContext(preset.user, `environments.${name}.user`);
    }
  }
}
