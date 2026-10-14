import { useMemo, useRef, type ReactNode } from 'react';

import { createSwitchboard, type Switchboard, type SwitchboardConfig } from '@switchboard/core';

import { SwitchboardContext } from './context.js';

export interface SwitchboardProviderProps {
  children: ReactNode;
  /** Configuration used to create a new Switchboard instance on first mount. Ignored when `instance` is set. */
  config?: SwitchboardConfig;
  /** Optional externally owned Switchboard instance. */
  instance?: Switchboard;
}

export function SwitchboardProvider({ children, config, instance }: SwitchboardProviderProps) {
  const configRef = useRef(config);

  const value = useMemo(() => {
    if (instance) return instance;
    return createSwitchboard(configRef.current ?? { persistence: false });
  }, [instance]);

  return <SwitchboardContext.Provider value={value}>{children}</SwitchboardContext.Provider>;
}
