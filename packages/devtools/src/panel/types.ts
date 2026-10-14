export type PanelTab = 'overview' | 'features' | 'user' | 'scenarios' | 'api' | 'settings';

export type PanelTheme = 'dark' | 'light';

/** Drawer dock side. Legacy `bottom-*` values migrate to these. */
export type PanelPosition = 'right' | 'left';

export interface PanelPrefs {
  theme: PanelTheme;
  position: PanelPosition;
  open: boolean;
  activeTab: PanelTab;
}

export const DEFAULT_PREFS: PanelPrefs = {
  theme: 'light',
  position: 'right',
  open: true,
  activeTab: 'overview',
};

export const PANEL_TAG = 'switchboard-panel';

export const PREFS_STORAGE_KEY = 'switchboard-panel-prefs';

export interface PanelExportPayload {
  version: 1;
  features: Record<string, boolean>;
  user: Record<string, unknown>;
  environment: string;
}

export interface ApiPickerState {
  kind: 'status' | 'response';
  ruleId: string;
}
