import type { PersistenceAdapter } from '../types.js';
import { isPersistedSnapshot } from '../validate.js';

function getLocalStorage(): Storage | null {
  try {
    if (typeof globalThis === 'undefined') return null;
    const storage = (globalThis as { localStorage?: Storage }).localStorage;
    if (!storage) return null;
    const probe = '__switchboard_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

export function createLocalStoragePersistence(): PersistenceAdapter {
  return {
    name: 'localStorage',
    get(key) {
      const storage = getLocalStorage();
      if (!storage) return null;

      try {
        const raw = storage.getItem(key);
        if (raw === null) return null;
        const parsed: unknown = JSON.parse(raw);
        if (!isPersistedSnapshot(parsed)) return null;
        return parsed;
      } catch {
        return null;
      }
    },
    set(key, value) {
      const storage = getLocalStorage();
      if (!storage) {
        throw new Error('localStorage is unavailable');
      }
      storage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
      const storage = getLocalStorage();
      if (!storage) return;
      storage.removeItem(key);
    },
  };
}
