import type { PersistedSnapshot, PersistenceAdapter } from '../types.js';

export function createMemoryPersistence(): PersistenceAdapter {
  const store = new Map<string, PersistedSnapshot>();

  return {
    name: 'memory',
    get(key) {
      return store.get(key) ?? null;
    },
    set(key, value) {
      store.set(key, value);
    },
    remove(key) {
      store.delete(key);
    },
  };
}
