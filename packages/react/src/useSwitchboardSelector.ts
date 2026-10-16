import { useCallback, useSyncExternalStore } from 'react';

import type { SwitchboardState } from '@switchboard-js/core';

import { useSwitchboardInstance } from './context.js';

/**
 * Subscribe to Switchboard state with an optional selector.
 * Uses `useSyncExternalStore` for React 18/19 concurrent-safe subscriptions.
 * The core store caches snapshots so `getState()` is referentially stable between updates.
 */
export function useSwitchboardSelector<T>(selector: (state: SwitchboardState) => T): T {
  const instance = useSwitchboardInstance();

  const subscribe = useCallback(
    (onStoreChange: () => void) => instance.subscribe(() => onStoreChange()),
    [instance],
  );

  const getSnapshot = useCallback(() => instance.getState(), [instance]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return selector(state);
}
