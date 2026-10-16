import type { SwitchboardState } from '@switchboard-js/core';

import type { PanelPrefs } from './types.js';

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function overviewHtml(state: SwitchboardState): string {
  const flagCount = Object.keys(state.features).length;
  const overridden = Object.values(state.featureMeta).filter((meta) => meta.isOverridden).length;
  const scenarioCount = Object.keys(state.scenarios).length;
  return `
    <div class="stack">
      <div class="stat">
        <span class="muted">Environment</span>
        <div class="stat-value">${escapeHtml(state.environment)}</div>
      </div>
      <div class="stat">
        <span class="muted">Features</span>
        <div class="stat-value">${flagCount} registered · ${overridden} overridden</div>
      </div>
      <div class="stat">
        <span class="muted">User</span>
        <div class="stat-value">${escapeHtml(state.user.name ?? state.user.id ?? '—')} · ${escapeHtml(
          String(state.user.role ?? 'no role'),
        )}</div>
      </div>
      <div class="stat">
        <span class="muted">Scenarios</span>
        <div class="stat-value">${scenarioCount} saved · active ${escapeHtml(
          state.activeScenarioId ?? 'none',
        )}</div>
      </div>
      <div class="row">
        <button type="button" class="action danger" data-action="reset-all">Reset all</button>
      </div>
    </div>`;
}

export function featuresHtml(state: SwitchboardState): string {
  const entries = Object.entries(state.features);
  const list = entries
    .map(([name, enabled]) => {
      const meta = state.featureMeta[name];
      const group = meta?.group ? `<div class="group">${escapeHtml(meta.group)}</div>` : '';
      const badge = meta?.isOverridden ? `<span class="badge">overridden</span>` : '';
      return `
        <div class="feature">
          <div>
            <div class="feature-name">${escapeHtml(name)}${badge}</div>
            ${group}
          </div>
          <input class="toggle" type="checkbox" role="switch" aria-label="${escapeHtml(
            name,
          )}" data-action="toggle-feature" data-feature="${escapeHtml(name)}" ${
            enabled ? 'checked' : ''
          } />
        </div>`;
    })
    .join('');

  return `
    <div class="stack">
      <div>${list || '<p class="muted">No features registered.</p>'}</div>
    </div>`;
}

export function userHtml(state: SwitchboardState): string {
  const permissions = Array.isArray(state.user.permissions)
    ? state.user.permissions.join(', ')
    : '—';
  const roles = new Set<string>();
  if (typeof state.user.role === 'string' && state.user.role) roles.add(state.user.role);
  for (const scenario of Object.values(state.scenarios)) {
    if (typeof scenario.user?.role === 'string' && scenario.user.role) {
      roles.add(scenario.user.role);
    }
  }

  const roleRadios =
    [...roles]
      .map(
        (role) => `
      <label class="radio">
        <input type="radio" name="user-role" data-action="set-user-role" data-value="${escapeHtml(
          role,
        )}" ${state.user.role === role ? 'checked' : ''} />
        <span>${escapeHtml(role)}</span>
      </label>`,
      )
      .join('') || '<p class="muted">No roles available from config/scenarios.</p>';

  return `
    <div class="stack">
      <div class="stat">
        <span class="muted">id</span>
        <div class="stat-value">${escapeHtml(String(state.user.id ?? '—'))}</div>
      </div>
      <div class="stat">
        <span class="muted">name</span>
        <div class="stat-value">${escapeHtml(String(state.user.name ?? '—'))}</div>
      </div>
      <div class="stat">
        <span class="muted">permissions</span>
        <div class="stat-value">${escapeHtml(permissions)}</div>
      </div>
      <p class="section-title">Role</p>
      <div class="radio-group" role="radiogroup" aria-label="User role">${roleRadios}</div>
      <div class="row">
        <button type="button" class="action" data-action="reset-user">Reset user</button>
      </div>
    </div>`;
}

export function settingsHtml(prefs: PanelPrefs): string {
  return `
    <div class="stack">
      <div class="field">
        <span>Theme</span>
        <div class="segment" role="group" aria-label="Theme">
          <button type="button" class="segment-btn" data-action="theme" data-value="light" aria-pressed="${
            prefs.theme === 'light'
          }">Light</button>
          <button type="button" class="segment-btn" data-action="theme" data-value="dark" aria-pressed="${
            prefs.theme === 'dark'
          }">Dark</button>
        </div>
      </div>
      <div class="field">
        <span>Drawer side</span>
        <div class="segment" role="group" aria-label="Drawer side">
          <button type="button" class="segment-btn" data-action="position" data-value="left" aria-pressed="${
            prefs.position === 'left'
          }">Left</button>
          <button type="button" class="segment-btn" data-action="position" data-value="right" aria-pressed="${
            prefs.position === 'right'
          }">Right</button>
        </div>
      </div>
      <div class="row">
        <button type="button" class="action danger" data-action="reset-all">Reset all Switchboard state</button>
      </div>
    </div>`;
}
