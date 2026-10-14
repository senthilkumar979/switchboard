import type { PanelPrefs, PanelPosition } from './types.js';
import { DEFAULT_PREFS, PREFS_STORAGE_KEY } from './types.js';

function normalizePosition(value: unknown): PanelPosition {
  if (value === 'left' || value === 'bottom-left') return 'left';
  return 'right';
}

export function loadPrefs(): PanelPrefs {
  try {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFS };
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return { ...DEFAULT_PREFS };
    const record = parsed as Partial<PanelPrefs> & { position?: string };
    return {
      theme: record.theme === 'dark' ? 'dark' : 'light',
      position: normalizePosition(record.position),
      open: typeof record.open === 'boolean' ? record.open : DEFAULT_PREFS.open,
      activeTab:
        record.activeTab === 'features' ||
        record.activeTab === 'user' ||
        record.activeTab === 'scenarios' ||
        record.activeTab === 'api' ||
        record.activeTab === 'settings'
          ? record.activeTab
          : 'overview',
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(prefs: PanelPrefs): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Soft-fail: never crash the host app.
  }
}
