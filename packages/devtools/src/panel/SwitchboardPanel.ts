import type { Switchboard } from '@switchboard/core';

import { handlePanelEvent } from './events.js';
import { restoreFocus, snapshotFocus } from './focus.js';
import { bindPickerDismiss } from './picker-dismiss.js';
import { loadPrefs, savePrefs } from './prefs.js';
import { renderPanelHtml } from './render.js';
import { PANEL_STYLES } from './styles.js';
import { PANEL_TAG, type ApiPickerState, type PanelPrefs } from './types.js';

export class SwitchboardPanelElement extends HTMLElement {
  static readonly tagName = PANEL_TAG;

  #shadow: ShadowRoot;
  #instance: Switchboard | null = null;
  #unsubscribe: (() => void) | null = null;
  #unbindPickerDismiss: (() => void) | null = null;
  #prefs: PanelPrefs = loadPrefs();
  #statusMessage = '';
  #apiPicker: ApiPickerState | null = null;
  #expandedScenarioIds = new Set<string>();
  #wasOpen = false;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.addEventListener('click', (event) => this.#onEvent(event));
    this.#shadow.addEventListener('input', (event) => this.#onEvent(event));
    this.#shadow.addEventListener('change', (event) => this.#onEvent(event));
  }

  get switchboard(): Switchboard | null {
    return this.#instance;
  }

  set switchboard(instance: Switchboard | null) {
    if (this.#instance === instance) return;
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#instance = instance;
    if (instance) {
      this.#unsubscribe = instance.subscribe(() => this.#render());
    }
    this.#render();
  }

  get open(): boolean {
    return this.#prefs.open;
  }

  set open(value: boolean) {
    this.#setPrefs({ ...this.#prefs, open: value });
  }

  connectedCallback(): void {
    this.#render();
  }

  disconnectedCallback(): void {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#unbindPickerDismiss?.();
    this.#unbindPickerDismiss = null;
  }

  #setPrefs(prefs: PanelPrefs): void {
    this.#prefs = prefs;
    savePrefs(prefs);
    this.#render();
  }

  #closeApiPicker(): void {
    if (!this.#apiPicker) return;
    this.#apiPicker = null;
    this.#render();
  }

  #onEvent(event: Event): void {
    handlePanelEvent(event, this.#shadow, {
      instance: this.#instance,
      prefs: this.#prefs,
      statusMessage: this.#statusMessage,
      apiPicker: this.#apiPicker,
      expandedScenarioIds: this.#expandedScenarioIds,
      setPrefs: (prefs) => this.#setPrefs(prefs),
      setStatusMessage: (message) => {
        this.#statusMessage = message;
      },
      setApiPicker: (picker) => {
        this.#apiPicker = picker;
      },
      setExpandedScenarioIds: (ids) => {
        this.#expandedScenarioIds = ids;
        this.#render();
      },
      requestRender: () => this.#render(),
    });
  }

  #render(): void {
    this.#unbindPickerDismiss?.();
    this.#unbindPickerDismiss = null;

    const animateOpen = this.#prefs.open && !this.#wasOpen;
    const snapshot = this.#wasOpen && this.#prefs.open ? snapshotFocus(this.#shadow) : null;
    this.dataset.theme = this.#prefs.theme;
    const state = this.#instance?.getState() ?? null;
    this.#shadow.innerHTML = `<style>${PANEL_STYLES}</style>${renderPanelHtml({
      state,
      prefs: this.#prefs,
      statusMessage: this.#statusMessage,
      animateOpen,
      apiPicker: this.#apiPicker,
      expandedScenarioIds: this.#expandedScenarioIds,
    })}`;
    this.#wasOpen = this.#prefs.open;
    if (snapshot) restoreFocus(this.#shadow, snapshot);

    this.#unbindPickerDismiss = bindPickerDismiss(
      this.#shadow,
      () => this.#apiPicker !== null,
      () => this.#closeApiPicker(),
    );
  }
}

export function registerSwitchboardPanel(): void {
  if (typeof customElements === 'undefined') return;
  if (customElements.get(PANEL_TAG)) return;
  customElements.define(PANEL_TAG, SwitchboardPanelElement);
}

declare global {
  interface HTMLElementTagNameMap {
    'switchboard-panel': SwitchboardPanelElement;
  }
}
