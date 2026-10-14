import type { ApiEventContext } from './api-events.js';
import { patchApiMock, readMockScope, setMockEnabled } from './api-mock-patch.js';

export function handleApiRuleAction(
  action: string,
  target: Element,
  root: ShadowRoot,
  ctx: ApiEventContext,
): boolean {
  if (!ctx.instance) return false;

  if (action === 'toggle-api-mock') {
    const id = target.getAttribute('data-rule-id');
    if (!id) return true;
    setMockEnabled(ctx.instance, readMockScope(target), id, (target as HTMLInputElement).checked);
    return true;
  }

  if (action === 'save-mock-custom-json') {
    const id = target.getAttribute('data-rule-id');
    if (!id) return true;
    const scope = readMockScope(target);
    const raw =
      (
        root.querySelector(
          `[data-field="mock-custom-json"][data-rule-id="${id}"][data-scope="${scope}"]`,
        ) as HTMLTextAreaElement | null
      )?.value ?? '';
    try {
      ctx.setStatusMessage('Custom JSON saved');
      patchApiMock(ctx.instance, scope, id, { customJson: JSON.parse(raw) as unknown });
    } catch (error) {
      ctx.setStatusMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      ctx.requestRender();
    }
    return true;
  }

  return false;
}
