import { handleApiAction } from './api-events.js';
import type { PanelEventContext } from './event-context.js';
import { handleScenarioAction } from './scenario-events.js';
import { getVisibleTabs } from './tab-visibility.js';
import type { PanelTab, PanelTheme, PanelPosition } from './types.js';

export type { PanelEventContext } from './event-context.js';

export function handlePanelEvent(event: Event, root: ShadowRoot, ctx: PanelEventContext): void {
  const raw = event.target;
  if (!(raw instanceof Element)) return;

  const target = raw.closest('[data-action]');
  if (!(target instanceof Element) || !root.contains(target)) return;

  const action = target.getAttribute('data-action');
  if (!action) return;

  if (action === 'toggle-open') {
    ctx.setPrefs({ ...ctx.prefs, open: !ctx.prefs.open });
    return;
  }

  if (action === 'tab') {
    const tab = target.getAttribute('data-tab') as PanelTab | null;
    if (!tab) return;
    if (ctx.instance && !getVisibleTabs(ctx.instance.getState()).includes(tab)) return;
    ctx.setPrefs({ ...ctx.prefs, activeTab: tab });
    ctx.setStatusMessage('');
    ctx.setApiPicker(null);
    return;
  }

  if (action === 'toggle-feature' && ctx.instance) {
    const name = target.getAttribute('data-feature');
    if (!name) return;
    ctx.instance.setFeature(name, (target as HTMLInputElement).checked);
    return;
  }

  if (action === 'set-user-role' && ctx.instance) {
    const role = target.getAttribute('data-value');
    if (!role) return;
    ctx.instance.setUser({ ...ctx.instance.getUser(), role });
    ctx.setStatusMessage(`Role set to ${role}`);
    return;
  }

  if (action === 'reset-user' && ctx.instance) {
    ctx.instance.resetUser();
    return;
  }

  if (action === 'reset-all' && ctx.instance) {
    ctx.instance.reset();
    ctx.setStatusMessage('Reset complete');
    return;
  }

  if (action === 'theme') {
    const theme = target.getAttribute('data-value') as PanelTheme | null;
    if (theme !== 'light' && theme !== 'dark') return;
    ctx.setPrefs({ ...ctx.prefs, theme });
    return;
  }

  if (action === 'position') {
    const position = target.getAttribute('data-value') as PanelPosition | null;
    if (position !== 'left' && position !== 'right') return;
    ctx.setPrefs({ ...ctx.prefs, position });
    return;
  }

  if (
    handleScenarioAction(action, target, root, {
      instance: ctx.instance,
      expandedScenarioIds: ctx.expandedScenarioIds,
      setExpandedScenarioIds: ctx.setExpandedScenarioIds,
      setStatusMessage: ctx.setStatusMessage,
      requestRender: ctx.requestRender,
    })
  ) {
    return;
  }

  handleApiAction(action, target, root, {
    instance: ctx.instance,
    picker: ctx.apiPicker,
    setPicker: ctx.setApiPicker,
    setStatusMessage: ctx.setStatusMessage,
    requestRender: ctx.requestRender,
  });
}
