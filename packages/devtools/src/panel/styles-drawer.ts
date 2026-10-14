/** Drawer shell, launcher, header, and tabs. */
export const PANEL_DRAWER_STYLES = `
.scrim {
  position: absolute; inset: 0; pointer-events: auto; cursor: pointer;
  background: color-mix(in srgb, #0a1218 48%, transparent);
}
.scrim.is-entering { animation: sb-fade 160ms ease; }
.drawer {
  position: absolute; top: 0; bottom: 0; width: var(--sb-drawer-w); pointer-events: auto;
  display: flex; flex-direction: column; margin: 10px !important; border-radius: 20px !important;
  background: var(--sb-panel);
  border-inline-start: 1px solid var(--sb-border);
  box-shadow: -12px 0 40px color-mix(in srgb, #0a1218 12%, transparent);
}
.drawer::before {
  content: ''; position: absolute; inset: 0 auto 0 0; width: 3px;
  // background: linear-gradient(180deg, var(--sb-accent), color-mix(in srgb, var(--sb-accent) 20%, transparent));
  pointer-events: none;
}
.root[data-position="left"] .drawer::before { inset: 0 0 0 auto; }
.drawer.is-entering { animation: sb-slide-right 220ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.root[data-position="left"] .drawer {
  left: 0; right: auto; border-inline-start: 0; border-inline-end: 1px solid var(--sb-border);
  box-shadow: 12px 0 40px color-mix(in srgb, #0a1218 12%, transparent);
}
.root[data-position="left"] .drawer.is-entering { animation-name: sb-slide-left; }
.root[data-position="right"] .drawer { right: 0; left: auto; }
@keyframes sb-slide-right { from { transform: translateX(100%); } to { transform: none; } }
@keyframes sb-slide-left { from { transform: translateX(-100%); } to { transform: none; } }
@keyframes sb-fade { from { opacity: 0; } to { opacity: 1; } }
.launcher {
  position: absolute; bottom: 16px; right: 16px; pointer-events: auto;
  display: inline-flex; align-items: center; gap: 0.4rem;
  border: 1px solid var(--sb-border); background: var(--sb-panel); color: var(--sb-text);
  border-radius: var(--sb-radius); padding: 0.5rem 0.75rem; cursor: pointer;
  font-family: var(--sb-font-display); font-weight: 700; letter-spacing: -0.02em;
  box-shadow: 0 6px 18px color-mix(in srgb, #0a1218 10%, transparent);
  transition: border-color 140ms ease, transform 140ms ease;
}
.root[data-position="left"] .launcher { right: auto; left: 16px; }
.launcher:hover { border-color: var(--sb-accent); transform: translateY(-1px); }
.launcher-mark, .brand-mark {
  width: 0.65rem; height: 0.65rem; border-radius: 2px; flex-shrink: 0;
  background: var(--sb-accent);
  box-shadow: 0.28rem 0.28rem 0 0 var(--sb-accent-soft);
}
@media (prefers-reduced-motion: reduce) {
  .drawer, .scrim, .launcher { animation: none; transition: none; }
}
.header {
  display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
  padding: 0.9rem 1rem 0.7rem; flex-shrink: 0;
  border-bottom: 1px solid var(--sb-border);
  background: color-mix(in srgb, var(--sb-bg) 55%, var(--sb-panel));
  border-radius: 20px !important;
}
.brand { display: flex; align-items: center; gap: 0.55rem; min-width: 0; }
.header h1 {
  margin: 0; font-family: var(--sb-font-display); font-size: 1.05rem; font-weight: 700;
  letter-spacing: -0.03em; line-height: 1.05;
}
.header .eyebrow {
  display: block; margin-top: 0.18rem; color: var(--sb-muted);
  font-size: 0.64rem; letter-spacing: 0.07em; text-transform: uppercase; font-weight: 600;
}
.icon-btn {
  border: 1px solid var(--sb-border); background: var(--sb-panel); color: var(--sb-muted);
  border-radius: var(--sb-radius); width: 1.85rem; height: 1.85rem; cursor: pointer;
  font-size: 1.05rem; line-height: 1;
}
.icon-btn:hover { color: var(--sb-text); border-color: var(--sb-text); }
.tabs {
  display: flex; gap: 0.1rem; padding: 0 0.65rem;
  border-bottom: 1px solid var(--sb-border); background: var(--sb-panel);
  overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
}
.tab {
  border: 0; background: transparent; color: var(--sb-muted);
  padding: 0.7rem 0.6rem 0.65rem; cursor: pointer; white-space: nowrap;
  font: inherit; font-weight: 600; position: relative; letter-spacing: 0.01em;
}
.tab::after {
  content: ''; position: absolute; left: 0.45rem; right: 0.45rem; bottom: 0; height: 2px;
  background: transparent; border-radius: 2px 2px 0 0;
}
.tab:hover { color: var(--sb-text); }
.tab[aria-selected="true"] { color: var(--sb-accent); }
.tab[aria-selected="true"]::after { background: var(--sb-accent); }
.body { padding: 0.9rem 1rem 1.1rem; overflow: auto; flex: 1; background: var(--sb-panel);     border-radius: 20px !important;}
`;
