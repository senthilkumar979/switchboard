import type { Switchboard } from '@switchboard/core';

export interface ScenarioEventContext {
  instance: Switchboard | null;
  expandedScenarioIds: ReadonlySet<string>;
  setExpandedScenarioIds: (ids: Set<string>) => void;
  setStatusMessage: (message: string) => void;
  requestRender: () => void;
}

export function handleScenarioAction(
  action: string,
  target: Element,
  _root: ShadowRoot,
  ctx: ScenarioEventContext,
): boolean {
  if (action === 'toggle-scenario-expand') {
    const id = target.getAttribute('data-scenario-id');
    if (!id) return true;
    const next = new Set(ctx.expandedScenarioIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    ctx.setExpandedScenarioIds(next);
    return true;
  }

  if (!ctx.instance) return false;

  if (action === 'activate-scenario') {
    const id = target.getAttribute('data-scenario-id');
    if (!id) return true;
    try {
      ctx.instance.activateScenario(id);
      ctx.setStatusMessage(`Activated "${id}"`);
    } catch (error) {
      ctx.setStatusMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      ctx.requestRender();
    }
    return true;
  }

  if (action === 'deactivate-scenario') {
    ctx.instance.deactivateScenario();
    ctx.setStatusMessage('Scenario deactivated');
    return true;
  }

  return false;
}
