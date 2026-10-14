import { createContext, useContext } from 'react';

import type { Switchboard } from '@switchboard/core';

export const SwitchboardContext = createContext<Switchboard | null>(null);

export function useSwitchboardInstance(): Switchboard {
  const instance = useContext(SwitchboardContext);
  if (!instance) {
    throw new Error('Switchboard hooks must be used within a <SwitchboardProvider>.');
  }
  return instance;
}
