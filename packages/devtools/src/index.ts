export { registerSwitchboardPanel, SwitchboardPanelElement } from './panel/SwitchboardPanel.js';
export {
  exportState,
  serializeState,
  parseImportPayload,
  applyImportPayload,
} from './panel/serialize.js';
export { PANEL_TAG, PREFS_STORAGE_KEY } from './panel/types.js';
export type {
  PanelExportPayload,
  PanelPrefs,
  PanelTab,
  PanelTheme,
  PanelPosition,
} from './panel/types.js';

export { PACKAGE_NAME as CORE_PACKAGE_NAME } from '@switchboard/core';

export const PACKAGE_NAME = '@switchboard/devtools' as const;
export const PACKAGE_VERSION = '0.0.0' as const;
