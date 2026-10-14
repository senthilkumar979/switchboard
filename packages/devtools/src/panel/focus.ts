export interface FocusSnapshot {
  selector: string | null;
  selectionStart: number | null;
  selectionEnd: number | null;
  bodyScrollTop: number;
}

function focusSelector(active: HTMLElement): string | null {
  const action = active.getAttribute('data-action');
  const field = active.getAttribute('data-field');
  const feature = active.getAttribute('data-feature');
  const ruleId = active.getAttribute('data-rule-id');
  const picker = active.getAttribute('data-picker');

  if (action === 'toggle-feature' && feature) {
    return `[data-action="${action}"][data-feature="${feature}"]`;
  }
  if (action === 'toggle-picker' && ruleId && picker) {
    return `[data-action="toggle-picker"][data-picker="${picker}"][data-rule-id="${ruleId}"]`;
  }
  if (action && ruleId) {
    return `[data-action="${action}"][data-rule-id="${ruleId}"]`;
  }
  if (action) return `[data-action="${action}"]`;
  if (field && ruleId) return `[data-field="${field}"][data-rule-id="${ruleId}"]`;
  if (field) return `[data-field="${field}"]`;
  return null;
}

export function snapshotFocus(root: ShadowRoot): FocusSnapshot {
  const active = root.activeElement;
  const body = root.querySelector('.body');
  let selector: string | null = null;
  let selectionStart: number | null = null;
  let selectionEnd: number | null = null;

  if (active instanceof HTMLElement) {
    selector = focusSelector(active);
    if (
      (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) &&
      typeof active.selectionStart === 'number'
    ) {
      selectionStart = active.selectionStart;
      selectionEnd = active.selectionEnd;
    }
  }

  return {
    selector,
    selectionStart,
    selectionEnd,
    bodyScrollTop: body instanceof HTMLElement ? body.scrollTop : 0,
  };
}

export function restoreFocus(root: ShadowRoot, snapshot: FocusSnapshot): void {
  const body = root.querySelector('.body');
  if (body instanceof HTMLElement) body.scrollTop = snapshot.bodyScrollTop;

  if (!snapshot.selector) return;
  const el = root.querySelector(snapshot.selector);
  if (!(el instanceof HTMLElement)) return;
  el.focus({ preventScroll: true });
  if (
    (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
    snapshot.selectionStart !== null &&
    snapshot.selectionEnd !== null
  ) {
    el.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
  }
}
