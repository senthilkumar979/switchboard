import type { SwitchboardState, UserContext } from '@switchboard/core';

import type { PanelTab } from './types.js';

const ALWAYS_VISIBLE: PanelTab[] = ['overview', 'settings'];

function userHasContent(user: UserContext | undefined): boolean {
  if (!user) return false;
  if (typeof user.id === 'string' && user.id.length > 0) return true;
  if (typeof user.name === 'string' && user.name.length > 0) return true;
  if (typeof user.role === 'string' && user.role.length > 0) return true;
  if (Array.isArray(user.permissions) && user.permissions.length > 0) return true;
  return Object.entries(user).some(([key, value]) => {
    if (key === 'id' || key === 'name' || key === 'role' || key === 'permissions') return false;
    return value !== undefined;
  });
}

function hasUserContext(state: SwitchboardState): boolean {
  if (userHasContent(state.user)) return true;
  return Object.values(state.scenarios).some((scenario) => userHasContent(scenario.user));
}

function hasApiMocks(state: SwitchboardState): boolean {
  if (Object.keys(state.apiMocks).length > 0) return true;
  return Object.values(state.scenarios).some(
    (scenario) => scenario.apiMocks !== undefined && scenario.apiMocks.length > 0,
  );
}

/** Tabs that have something to show for the current Switchboard state. */
export function getVisibleTabs(state: SwitchboardState): PanelTab[] {
  const tabs: PanelTab[] = ['overview'];
  if (Object.keys(state.features).length > 0) tabs.push('features');
  if (hasUserContext(state)) tabs.push('user');
  if (Object.keys(state.scenarios).length > 0) tabs.push('scenarios');
  if (hasApiMocks(state)) tabs.push('api');
  tabs.push('settings');
  return tabs;
}

export function resolveActiveTab(state: SwitchboardState, preferred: PanelTab): PanelTab {
  const visible = getVisibleTabs(state);
  if (visible.includes(preferred)) return preferred;
  return ALWAYS_VISIBLE[0]!;
}
