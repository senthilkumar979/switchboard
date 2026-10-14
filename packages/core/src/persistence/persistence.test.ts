import { describe, expect, it } from 'vitest';

import { createLocalStoragePersistence } from './localStorage.js';
import { createMemoryPersistence } from './memory.js';

describe('memory persistence', () => {
  it('stores and removes snapshots', () => {
    const adapter = createMemoryPersistence();
    const snapshot = {
      version: 1 as const,
      features: { a: true },
      user: { role: 'admin' },
      environment: 'development',
    };

    adapter.set('key', snapshot);
    expect(adapter.get('key')).toEqual(snapshot);
    adapter.remove('key');
    expect(adapter.get('key')).toBeNull();
  });
});

describe('localStorage persistence', () => {
  it('returns null when localStorage is unavailable', () => {
    const adapter = createLocalStoragePersistence();
    expect(adapter.get('missing')).toBeNull();
  });

  it('round-trips when localStorage is available', () => {
    const store = new Map<string, string>();
    const mockStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    } as Storage;

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: mockStorage,
    });

    const adapter = createLocalStoragePersistence();
    const snapshot = {
      version: 1 as const,
      features: { a: false },
      user: { id: 'u1' },
      environment: 'staging',
    };

    adapter.set('sb', snapshot);
    expect(adapter.get('sb')).toEqual(snapshot);
    adapter.remove('sb');
    expect(adapter.get('sb')).toBeNull();
  });
});
