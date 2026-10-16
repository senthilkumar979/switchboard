import type { SwitchboardState } from '@switchboard-js/core';

import { apiHtml } from './api-tab.js';
import { scenariosHtml } from './scenarios-tab.js';
import { getVisibleTabs, resolveActiveTab } from './tab-visibility.js';
import { featuresHtml, overviewHtml, settingsHtml, userHtml } from './tabs.js';
import type { ApiPickerState, PanelPrefs, PanelTab } from './types.js';

const TAB_LABELS: Record<PanelTab, string> = {
  overview: 'Overview',
  features: 'Features',
  user: 'User',
  scenarios: 'Scenarios',
  api: 'API',
  settings: 'Settings',
};

function tabsHtml(active: PanelTab, visible: PanelTab[]): string {
  return visible
    .map(
      (tab) => `
      <button type="button" class="tab" data-action="tab" data-tab="${tab}" aria-selected="${
        active === tab
      }">${TAB_LABELS[tab]}</button>`,
    )
    .join('');
}

function brandHeader(): string {
  return `
    <div class="header">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <div>
          <h1>Switchboard</h1>
          <span class="eyebrow">Dev controls</span>
        </div>
      </div>
      <button type="button" class="icon-btn" data-action="toggle-open" aria-label="Close drawer">×</button>
    </div>`;
}

function launcherHtml(expanded: boolean): string {
  return `
    <button type="button" class="launcher" data-action="toggle-open" aria-expanded="${expanded}">
      <span class="launcher-mark" aria-hidden="true"></span>
      Switchboard
    </button>`;
}

function drawerShell(
  prefs: PanelPrefs,
  inner: string,
  showLauncher: boolean,
  animateOpen: boolean,
): string {
  const openAttr = prefs.open ? 'true' : 'false';
  const enterClass = animateOpen ? ' is-entering' : '';
  return `<div class="root" data-position="${prefs.position}" data-open="${openAttr}">
    ${
      prefs.open
        ? `<div class="scrim${enterClass}" data-action="toggle-open" aria-hidden="true"></div>
      <aside class="drawer${enterClass}" role="dialog" aria-modal="true" aria-label="Switchboard developer drawer">
        ${inner}
      </aside>`
        : ''
    }
    ${showLauncher || !prefs.open ? launcherHtml(prefs.open) : ''}
  </div>`;
}

function tabBody(
  tab: PanelTab,
  state: SwitchboardState,
  prefs: PanelPrefs,
  statusMessage: string,
  apiPicker: ApiPickerState | null,
  expandedScenarioIds: ReadonlySet<string>,
): string {
  switch (tab) {
    case 'features':
      return featuresHtml(state);
    case 'user':
      return userHtml(state);
    case 'scenarios':
      return scenariosHtml(state, statusMessage, expandedScenarioIds);
    case 'api':
      return apiHtml(state, statusMessage, apiPicker);
    case 'settings':
      return settingsHtml(prefs);
    default:
      return overviewHtml(state);
  }
}

export interface RenderModel {
  state: SwitchboardState | null;
  prefs: PanelPrefs;
  statusMessage: string;
  animateOpen?: boolean;
  apiPicker?: ApiPickerState | null;
  expandedScenarioIds?: ReadonlySet<string>;
}

export function renderPanelHtml(model: RenderModel): string {
  const {
    state,
    prefs,
    statusMessage,
    animateOpen = false,
    apiPicker = null,
    expandedScenarioIds = new Set(),
  } = model;

  if (!prefs.open) {
    return drawerShell(prefs, '', true, false);
  }

  if (!state) {
    return drawerShell(
      prefs,
      `${brandHeader()}<div class="body"><p class="muted">No Switchboard instance attached.</p></div>`,
      false,
      animateOpen,
    );
  }

  const visible = getVisibleTabs(state);
  const activeTab = resolveActiveTab(state, prefs.activeTab);
  const body = tabBody(activeTab, state, prefs, statusMessage, apiPicker, expandedScenarioIds);

  return drawerShell(
    prefs,
    `${brandHeader()}
      <div class="tabs" role="tablist">${tabsHtml(activeTab, visible)}</div>
      <div class="body">${body}</div>`,
    false,
    animateOpen,
  );
}
