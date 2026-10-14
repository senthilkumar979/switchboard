import type { Switchboard } from '@switchboard/core';

import type { ApiPickerState, PanelPrefs } from './types.js';

export interface PanelEventContext {
  instance: Switchboard | null;
  prefs: PanelPrefs;
  statusMessage: string;
  apiPicker: ApiPickerState | null;
  expandedScenarioIds: ReadonlySet<string>;
  setPrefs: (prefs: PanelPrefs) => void;
  setStatusMessage: (message: string) => void;
  setApiPicker: (picker: ApiPickerState | null) => void;
  setExpandedScenarioIds: (ids: Set<string>) => void;
  requestRender: () => void;
}
