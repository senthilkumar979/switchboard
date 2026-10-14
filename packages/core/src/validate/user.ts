import type { UserContext } from '../types.js';
import { SwitchboardValidationError, isPlainObject } from './errors.js';

export function validateUserContext(user: unknown, label = 'user'): UserContext {
  if (!isPlainObject(user)) {
    throw new SwitchboardValidationError(`${label} must be an object`);
  }

  const result: UserContext = { ...user };

  if (result.id !== undefined && typeof result.id !== 'string') {
    throw new SwitchboardValidationError(`${label}.id must be a string`);
  }
  if (result.name !== undefined && typeof result.name !== 'string') {
    throw new SwitchboardValidationError(`${label}.name must be a string`);
  }
  if (result.role !== undefined && typeof result.role !== 'string') {
    throw new SwitchboardValidationError(`${label}.role must be a string`);
  }
  if (result.permissions !== undefined) {
    if (
      !Array.isArray(result.permissions) ||
      !result.permissions.every((permission) => typeof permission === 'string')
    ) {
      throw new SwitchboardValidationError(`${label}.permissions must be an array of strings`);
    }
  }

  return result;
}
