/** Shared tokens + form/chrome styles for the Switchboard drawer. */
export const PANEL_BASE_STYLES = `
:host {
  all: initial;
  font-family: var(--sb-font-body);
  font-size: 12.5px;
  line-height: 1.4;
  color-scheme: light;
  -webkit-font-smoothing: antialiased;
}
:host([data-theme="dark"]) { color-scheme: dark; }
*, *::before, *::after { box-sizing: border-box; }
.root {
  --sb-bg: #eef1f4;
  --sb-panel: #fbfcfd;
  --sb-border: #d5dbe3;
  --sb-text: #15202b;
  --sb-muted: #5b6b7c;
  --sb-accent: #0f766e;
  --sb-accent-soft: #d8f3ef;
  --sb-danger: #b42318;
  --sb-ok: #177245;
  --sb-rail: #e8edf2;
  --sb-font-body: "Lucida Grande", "Segoe UI", "Helvetica Neue", sans-serif;
  --sb-font-display: "Trebuchet MS", "Lucida Grande", "Segoe UI", sans-serif;
  --sb-font-mono: ui-monospace, "Cascadia Code", "SF Mono", Menlo, Consolas, monospace;
  --sb-drawer-w: min(600px, 92vw);
  --sb-radius: 6px;
  --sb-space: 0.5rem;
  position: fixed; inset: 0; z-index: 2147483646; pointer-events: none; color: var(--sb-text);
}
:host([data-theme="dark"]) .root {
  --sb-bg: #0d131a;
  --sb-panel: #141c27;
  --sb-border: #2a3544;
  --sb-text: #e8eef5;
  --sb-muted: #8b9aab;
  --sb-accent: #2dd4bf;
  --sb-accent-soft: #163832;
  --sb-danger: #f07178;
  --sb-ok: #6ecf97;
  --sb-rail: #1b2532;
}
.muted { color: var(--sb-muted); }
.row { display: flex; gap: var(--sb-space); flex-wrap: wrap; margin-top: var(--sb-space); }
.stack { display: grid; gap: 0.75rem; }
.section-title {
  margin: 0.25rem 0 0; font-size: 0.66rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--sb-muted); font-weight: 700;
}
.stat {
  display: grid; gap: 0.12rem; padding: 0.65rem 0;
  border-bottom: 1px solid var(--sb-border);
}
.stat:last-of-type { border-bottom: 0; }
.stat-value { font-family: var(--sb-font-mono); font-size: 0.9rem; font-weight: 500; letter-spacing: -0.01em; }
code, .mono { font-family: var(--sb-font-mono); font-size: 0.84em; }
.field, label.field { display: grid; gap: 0.25rem; }
.field > span, label.field span { color: var(--sb-muted); font-size: 0.7rem; font-weight: 600; }
textarea {
  width: 100%; border: 1px solid var(--sb-border); border-radius: var(--sb-radius);
  background: var(--sb-bg); color: var(--sb-text);
  padding: 0.5rem 0.6rem; font: inherit;
  font-family: var(--sb-font-mono); font-size: 0.78rem; line-height: 1.45;
}
textarea:focus {
  outline: 2px solid color-mix(in srgb, var(--sb-accent) 40%, transparent);
  outline-offset: 1px; border-color: var(--sb-accent);
}
.radio-group { display: grid; gap: 0.3rem; }
.radio {
  display: flex; align-items: center; gap: 0.45rem; cursor: pointer;
  padding: 0.4rem 0.5rem; border-radius: var(--sb-radius); border: 1px solid transparent;
}
.radio:has(input:checked) { border-color: var(--sb-border); background: var(--sb-rail); }
.radio input { accent-color: var(--sb-accent); }
.segment {
  display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius); overflow: hidden; background: var(--sb-rail);
}
.segment-btn {
  border: 0; background: transparent; color: var(--sb-muted);
  padding: 0.45rem 0.6rem; cursor: pointer; font: inherit; font-weight: 600;
}
.segment-btn + .segment-btn { border-inline-start: 1px solid var(--sb-border); }
.segment-btn[aria-pressed="true"] { background: var(--sb-panel); color: var(--sb-text); }
button.action {
  border: 1px solid var(--sb-border); background: var(--sb-panel); color: var(--sb-text);
  border-radius: var(--sb-radius); padding: 0.35rem 0.65rem; cursor: pointer;
  font: inherit; font-weight: 600; letter-spacing: 0.01em;
}
button.action:hover { background: var(--sb-rail); border-color: color-mix(in srgb, var(--sb-accent) 35%, var(--sb-border)); }
button.action.primary {
  background: var(--sb-accent); border-color: var(--sb-accent); color: #fff;
}
:host([data-theme="dark"]) button.action.primary { color: #042f2e; }
button.action.danger {
  color: var(--sb-danger);
  border-color: color-mix(in srgb, var(--sb-danger) 30%, var(--sb-border));
  background: transparent;
}
button.action:disabled { opacity: 0.4; cursor: default; }
.feature {
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  padding: 0.6rem 0; border-bottom: 1px solid var(--sb-border);
}
.feature:last-child { border-bottom: 0; }
.scenario-list { display: grid; gap: 0; }
.scenario {
  border-bottom: 1px solid var(--sb-border);
  padding: 0.35rem 0;
}
.scenario:last-child { border-bottom: 0; }
.scenario-header {
  display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
}
.scenario-toggle {
  display: flex; align-items: flex-start; gap: 0.45rem; min-width: 0; flex: 1 1 auto;
  border: 0; background: transparent; color: inherit; padding: 0.35rem 0.15rem;
  cursor: pointer; font: inherit; text-align: left;
}
.scenario-toggle:hover { color: var(--sb-accent); }
.scenario-caret {
  flex: 0 0 auto; width: 0; height: 0; margin-top: 0.4rem;
  border-left: 4px solid transparent; border-right: 4px solid transparent;
  border-top: 5px solid var(--sb-muted);
  transform: rotate(-90deg); transition: transform 120ms ease;
}
.scenario.is-expanded .scenario-caret { transform: rotate(0deg); }
.scenario-meta { min-width: 0; flex: 1 1 auto; display: grid; gap: 0.08rem; }
.scenario .action { flex: 0 0 auto; }
.scenario-body {
  margin: 0.15rem 0 0.45rem 1.1rem;
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius);
  background: var(--sb-rail);
}
.scenario-mocks { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; }
.scenario-mock {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  gap: 0.4rem; align-items: center;
}
.scenario-mock-method {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.02em;
  color: var(--sb-accent);
}
.scenario-mock-url {
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.78rem;
}
.scenario-mock-status { font-weight: 600; }
.scenario-mocks-empty { margin: 0; font-size: 0.78rem; }
.feature-name { font-weight: 600; letter-spacing: -0.01em; }
.badge {
  display: inline-block; margin-left: 0.35rem; padding: 0.08rem 0.35rem;
  border-radius: 3px; font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--sb-accent); background: var(--sb-accent-soft);
}
.group { font-size: 0.68rem; color: var(--sb-muted); margin-top: 0.12rem; }
.toggle {
  appearance: none; width: 2rem; height: 1.1rem; border-radius: 999px; cursor: pointer;
  background: var(--sb-border); position: relative; flex-shrink: 0; border: 0;
}
.toggle::after {
  content: ''; position: absolute; top: 0.12rem; left: 0.12rem; width: 0.86rem; height: 0.86rem;
  border-radius: 50%; background: #fff; transition: transform 140ms ease;
}
.toggle:checked { background: var(--sb-accent); }
.toggle:checked::after { transform: translateX(0.88rem); }
.error { color: var(--sb-danger); margin: 0; }
.success { color: var(--sb-ok); margin: 0; }
.status { font-size: 0.78rem; }
.picker-trigger {
  display: inline-flex; align-items: center; justify-content: space-between; gap: 0.35rem;
  width: 100%; border: 1px solid var(--sb-border); background: var(--sb-bg);
  color: var(--sb-text); border-radius: var(--sb-radius); padding: 0.4rem 0.55rem;
  cursor: pointer; font: inherit; text-align: left;
}
.picker-dropdown {
  min-width: 0; font-size: 0.8rem; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.picker-caret {
  flex: 0 0 auto; width: 0; height: 0;
  border-left: 3.5px solid transparent; border-right: 3.5px solid transparent;
  border-top: 4.5px solid var(--sb-muted);
}
.picker-trigger[aria-expanded="true"] {
  border-color: var(--sb-accent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--sb-accent) 18%, transparent);
}
.picker-trigger[aria-expanded="true"] .picker-caret { transform: rotate(180deg); }
.picker-menu {
  position: absolute; z-index: 5; top: calc(100% + 0.25rem); left: 0; right: 0;
  display: grid; border: 1px solid var(--sb-border); border-radius: var(--sb-radius);
  overflow: hidden; background: var(--sb-panel); max-height: 180px; overflow-y: auto;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--sb-text) 10%, transparent);
}
.mock-cell-response .picker-menu { min-width: 100%; }
.picker-option {
  border: 0; border-bottom: 1px solid var(--sb-border); background: transparent; color: var(--sb-text);
  text-align: left; padding: 0.42rem 0.55rem; cursor: pointer; font: inherit; white-space: nowrap;
}
.picker-option:last-child { border-bottom: 0; }
.picker-option:hover { background: var(--sb-rail); }
.mock-rule { padding: 0.65rem 0; border-bottom: 1px solid var(--sb-border); }
.mock-rule:last-child { border-bottom: 0; }
.mock-rule-top {
  display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; gap: 0.5rem;
}
.mock-url {
  flex: 1 1 auto; min-width: 0; font-size: 0.82rem; font-weight: 600;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.mock-rule-top > .toggle { flex: 0 0 auto; }
.mock-rule-controls {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem;
}
.mock-field { display: grid; gap: 0.2rem; min-width: 0; }
.mock-label {
  color: var(--sb-muted); font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
}
.mock-cell { position: relative; min-width: 0; z-index: 1; }
.mock-cell:has(.picker-menu) { z-index: 6; }
.mock-custom { display: grid; gap: 0.4rem; margin-top: 0.5rem; }
`;
