import { useEffect, useRef, type Ref } from 'react';

import { registerSwitchboardPanel, type SwitchboardPanelElement } from '@switchboard-js/devtools';

import { useSwitchboardInstance } from './context.js';

export interface SwitchboardPanelProps {
  /** Controlled open state. When omitted, the panel manages its own open preference. */
  open?: boolean;
}

/**
 * React wrapper that binds the context Switchboard instance to `<switchboard-panel>`.
 */
export function SwitchboardPanel({ open }: SwitchboardPanelProps) {
  const instance = useSwitchboardInstance();
  const ref = useRef<SwitchboardPanelElement | null>(null);

  useEffect(() => {
    registerSwitchboardPanel();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.switchboard = instance;
  }, [instance]);

  useEffect(() => {
    const el = ref.current;
    if (!el || open === undefined) return;
    el.open = open;
  }, [open]);

  return <switchboard-panel ref={ref as Ref<SwitchboardPanelElement>} />;
}
