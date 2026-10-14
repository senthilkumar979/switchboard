export { createMemoryPersistence } from './memory.js';
export { createLocalStoragePersistence } from './localStorage.js';

import type { PersistenceAdapter, PersistenceOption } from '../types.js';
import { SwitchboardValidationError } from '../validate.js';
import { createLocalStoragePersistence } from './localStorage.js';
import { createMemoryPersistence } from './memory.js';

export function resolvePersistence(
  option: PersistenceOption | undefined,
): PersistenceAdapter | null {
  if (option === false) return null;
  if (option === undefined || option === 'memory') return createMemoryPersistence();
  if (option === 'localStorage') return createLocalStoragePersistence();
  if (
    typeof option === 'object' &&
    option !== null &&
    typeof option.name === 'string' &&
    typeof option.get === 'function' &&
    typeof option.set === 'function' &&
    typeof option.remove === 'function'
  ) {
    return option;
  }
  throw new SwitchboardValidationError(
    'persistence must be "memory", "localStorage", false, or a PersistenceAdapter',
  );
}
