/**
 * Close API pickers on outside click or panel-body scroll.
 * Ignores the opening interaction and scroll caused by focus restore.
 */
export function bindPickerDismiss(
  root: ShadowRoot,
  getPickerOpen: () => boolean,
  closePicker: () => void,
): () => void {
  let armed = false;
  const armTimer = window.setTimeout(() => {
    armed = true;
  }, 0);

  const onMouseDown = (event: Event) => {
    if (!armed || !getPickerOpen()) return;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    const inPickerUi = path.some(
      (node) =>
        node instanceof Element &&
        (node.classList.contains('mock-cell') || node.classList.contains('picker-menu')),
    );
    if (inPickerUi) return;
    closePicker();
  };

  const onScroll = (event: Event) => {
    if (!armed || !getPickerOpen()) return;
    // Ignore scrolls inside the open menu itself.
    const target = event.target;
    if (target instanceof Element && target.closest('.picker-menu')) return;
    closePicker();
  };

  const body = root.querySelector('.body');
  body?.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('mousedown', onMouseDown, true);

  return () => {
    window.clearTimeout(armTimer);
    body?.removeEventListener('scroll', onScroll);
    document.removeEventListener('mousedown', onMouseDown, true);
  };
}
