import { afterEach, describe, expect, it } from 'vitest';

import { createSwitchboard } from '@switchboard/core';

import {
  applyImportPayload,
  parseImportPayload,
  registerSwitchboardPanel,
  serializeState,
  SwitchboardPanelElement,
} from './index.js';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('registerSwitchboardPanel', () => {
  it('registers the custom element idempotently', () => {
    registerSwitchboardPanel();
    registerSwitchboardPanel();
    expect(customElements.get('switchboard-panel')).toBe(SwitchboardPanelElement);
  });
});

describe('serialize / import', () => {
  it('round-trips state through JSON', () => {
    const sb = createSwitchboard({
      features: { newDashboard: false },
      user: { role: 'admin' },
      environment: 'development',
      persistence: false,
    });

    sb.setFeature('newDashboard', true);
    const json = serializeState(sb.getState());
    const payload = parseImportPayload(json);

    const other = createSwitchboard({
      features: { newDashboard: false },
      user: { role: 'customer' },
      persistence: false,
    });
    applyImportPayload(other, payload);

    expect(other.isEnabled('newDashboard')).toBe(true);
    expect(other.getUser().role).toBe('admin');
    expect(other.getEnvironment()).toBe('development');
  });

  it('rejects invalid import payloads', () => {
    expect(() => parseImportPayload('{')).toThrow(/Invalid JSON/);
    expect(() => parseImportPayload('{"version":2}')).toThrow(/version 1/);
  });
});

describe('SwitchboardPanelElement', () => {
  it('renders features and toggles via the core instance', () => {
    registerSwitchboardPanel();
    const sb = createSwitchboard({
      features: { betaBanner: true },
      persistence: false,
    });

    const el = document.createElement('switchboard-panel') as SwitchboardPanelElement;
    document.body.appendChild(el);
    el.switchboard = sb;
    el.open = true;

    const shadow = el.shadowRoot;
    expect(shadow).toBeTruthy();

    const featuresTab = shadow!.querySelector('[data-tab="features"]') as HTMLButtonElement;
    featuresTab.click();

    const checkbox = shadow!.querySelector(
      '[data-action="toggle-feature"][data-feature="betaBanner"]',
    ) as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    expect(sb.isEnabled('betaBanner')).toBe(false);
  });

  it('sets user role via radio', () => {
    registerSwitchboardPanel();
    const sb = createSwitchboard({
      user: { role: 'admin', name: 'Dev' },
      persistence: false,
      urlScenarioParam: false,
      scenarios: [
        {
          id: 'customer-view',
          name: 'Customer',
          user: { role: 'customer' },
        },
      ],
    });

    const el = document.createElement('switchboard-panel') as SwitchboardPanelElement;
    document.body.appendChild(el);
    el.switchboard = sb;
    el.open = true;

    const shadow = el.shadowRoot!;
    (shadow.querySelector('[data-tab="user"]') as HTMLButtonElement).click();

    const roleRadio = shadow.querySelector(
      '[data-action="set-user-role"][data-value="customer"]',
    ) as HTMLInputElement;
    expect(roleRadio).toBeTruthy();
    roleRadio.checked = true;
    roleRadio.dispatchEvent(new Event('change', { bubbles: true }));

    expect(sb.getUser().role).toBe('customer');
  });

  it('activates and deactivates scenarios without text inputs', () => {
    registerSwitchboardPanel();
    const sb = createSwitchboard({
      features: { newDashboard: false },
      user: { role: 'admin' },
      persistence: false,
      urlScenarioParam: false,
      scenarios: [
        {
          id: 'admin-dash',
          name: 'Admin dashboard',
          features: { newDashboard: true },
        },
        {
          id: 'api-fail',
          name: 'API failure',
          apiMocks: [
            {
              id: 'pay-fail',
              url: '/api/payments',
              method: 'POST',
              statusCode: 500,
              responsePresetId: 'other',
              customJson: { error: 'down' },
              enabled: true,
            },
          ],
        },
      ],
    });

    const el = document.createElement('switchboard-panel') as SwitchboardPanelElement;
    document.body.appendChild(el);
    el.switchboard = sb;
    el.open = true;

    const shadow = el.shadowRoot!;
    (shadow.querySelector('[data-tab="scenarios"]') as HTMLButtonElement).click();

    expect(shadow.querySelector('input[type="text"]')).toBeNull();
    expect(shadow.querySelector('textarea')).toBeNull();
    expect(shadow.querySelector('[data-action="save-scenario-snapshot"]')).toBeNull();
    expect(shadow.querySelector('[data-action="save-mocks-to-scenario"]')).toBeNull();
    expect(shadow.querySelector('.scenario-body')).toBeNull();

    (
      shadow.querySelector(
        '[data-action="toggle-scenario-expand"][data-scenario-id="api-fail"]',
      ) as HTMLButtonElement
    ).click();

    const body = shadow.querySelector('.scenario.is-expanded .scenario-body');
    expect(body).toBeTruthy();
    expect(body?.textContent).toContain('POST');
    expect(body?.textContent).toContain('/api/payments');
    expect(body?.textContent).toContain('500');

    (
      shadow.querySelector(
        '[data-action="toggle-scenario-expand"][data-scenario-id="admin-dash"]',
      ) as HTMLButtonElement
    ).click();
    expect(shadow.querySelector('.scenario.is-expanded .scenario-mocks-empty')?.textContent).toContain(
      'No API mocks',
    );

    (
      shadow.querySelector(
        '[data-action="activate-scenario"][data-scenario-id="admin-dash"]',
      ) as HTMLButtonElement
    ).click();

    expect(sb.isEnabled('newDashboard')).toBe(true);
    expect(sb.getActiveScenarioId()).toBe('admin-dash');
    expect(shadow.querySelector('[data-action="duplicate-scenario"]')).toBeNull();
    expect(shadow.querySelector('[data-action="delete-scenario"]')).toBeNull();
    // Expand state survives activate re-render
    expect(shadow.querySelectorAll('.scenario.is-expanded')).toHaveLength(2);

    (shadow.querySelector('[data-action="deactivate-scenario"]') as HTMLButtonElement).click();
    expect(sb.getActiveScenarioId()).toBeNull();
  });

  it('opens as a drawer and switches theme via segments', () => {
    registerSwitchboardPanel();
    const sb = createSwitchboard({ persistence: false, urlScenarioParam: false });
    const el = document.createElement('switchboard-panel') as SwitchboardPanelElement;
    document.body.appendChild(el);
    el.switchboard = sb;
    el.open = true;

    const shadow = el.shadowRoot!;
    expect(shadow.querySelector('.drawer')).toBeTruthy();
    expect(shadow.querySelector('.scrim')).toBeTruthy();

    (shadow.querySelector('[data-tab="settings"]') as HTMLButtonElement).click();
    (shadow.querySelector('[data-action="theme"][data-value="dark"]') as HTMLButtonElement).click();
    expect(el.dataset.theme).toBe('dark');

    (
      shadow.querySelector('[data-action="position"][data-value="left"]') as HTMLButtonElement
    ).click();
    expect(shadow.querySelector('.root')?.getAttribute('data-position')).toBe('left');
  });

  it('picks API mock status without text inputs except custom JSON', () => {
    registerSwitchboardPanel();
    const sb = createSwitchboard({
      persistence: false,
      urlScenarioParam: false,
      responsePresets: [{ id: 'empty', name: 'Empty', json: {} }],
      apiMocks: [
        {
          id: 'orders',
          url: '/api/orders',
          statusCode: 200,
          responsePresetId: 'empty',
          enabled: true,
        },
      ],
    });
    const el = document.createElement('switchboard-panel') as SwitchboardPanelElement;
    document.body.appendChild(el);
    el.switchboard = sb;
    el.open = true;

    const shadow = el.shadowRoot!;
    (shadow.querySelector('[data-tab="api"]') as HTMLButtonElement).click();

    expect(shadow.querySelector('input[type="text"]')).toBeNull();

    (
      shadow.querySelector(
        '[data-action="toggle-picker"][data-picker="status"]',
      ) as HTMLButtonElement
    ).click();
    (
      shadow.querySelector('[data-action="pick-status"][data-value="500"]') as HTMLButtonElement
    ).click();
    expect(sb.getApiMocks()[0]?.statusCode).toBe(500);

    (
      shadow.querySelector(
        '[data-action="toggle-picker"][data-picker="response"]',
      ) as HTMLButtonElement
    ).click();
    (
      shadow.querySelector('[data-action="pick-response"][data-value="other"]') as HTMLButtonElement
    ).click();
    expect(sb.getApiMocks()[0]?.responsePresetId).toBe('other');
    expect(shadow.querySelector('[data-field="mock-custom-json"]')).toBeTruthy();
  });

  it('closes API dropdown on outside click', async () => {
    registerSwitchboardPanel();
    const sb = createSwitchboard({
      persistence: false,
      urlScenarioParam: false,
      responsePresets: [{ id: 'empty', name: 'Empty', json: {} }],
      apiMocks: [
        {
          id: 'orders',
          url: '/api/orders',
          statusCode: 200,
          responsePresetId: 'empty',
          enabled: true,
        },
      ],
    });
    const el = document.createElement('switchboard-panel') as SwitchboardPanelElement;
    document.body.appendChild(el);
    el.switchboard = sb;
    el.open = true;

    const shadow = el.shadowRoot!;
    (shadow.querySelector('[data-tab="api"]') as HTMLButtonElement).click();
    (
      shadow.querySelector(
        '[data-action="toggle-picker"][data-picker="status"]',
      ) as HTMLButtonElement
    ).click();
    expect(shadow.querySelector('.picker-menu')).toBeTruthy();

    await new Promise((resolve) => setTimeout(resolve, 0));
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
    expect(shadow.querySelector('.picker-menu')).toBeNull();
  });

  it('opens dropdown when clicking the caret inside the trigger', () => {
    registerSwitchboardPanel();
    const sb = createSwitchboard({
      persistence: false,
      urlScenarioParam: false,
      responsePresets: [{ id: 'empty', name: 'Empty', json: {} }],
      apiMocks: [
        {
          id: 'orders',
          url: '/api/orders',
          statusCode: 200,
          responsePresetId: 'empty',
          enabled: true,
        },
      ],
    });
    const el = document.createElement('switchboard-panel') as SwitchboardPanelElement;
    document.body.appendChild(el);
    el.switchboard = sb;
    el.open = true;

    const shadow = el.shadowRoot!;
    (shadow.querySelector('[data-tab="api"]') as HTMLButtonElement).click();
    const caret = shadow.querySelector(
      '[data-action="toggle-picker"][data-picker="status"] .picker-caret',
    ) as HTMLElement;
    expect(caret).toBeTruthy();
    caret.click();
    expect(shadow.querySelector('.picker-menu')).toBeTruthy();
  });

  it('hides tabs when their data is not configured', () => {
    registerSwitchboardPanel();
    const sb = createSwitchboard({
      features: { betaBanner: true },
      persistence: false,
      urlScenarioParam: false,
    });
    const el = document.createElement('switchboard-panel') as SwitchboardPanelElement;
    document.body.appendChild(el);
    el.switchboard = sb;
    el.open = true;

    const shadow = el.shadowRoot!;
    expect(shadow.querySelector('[data-tab="overview"]')).toBeTruthy();
    expect(shadow.querySelector('[data-tab="features"]')).toBeTruthy();
    expect(shadow.querySelector('[data-tab="settings"]')).toBeTruthy();
    expect(shadow.querySelector('[data-tab="user"]')).toBeNull();
    expect(shadow.querySelector('[data-tab="scenarios"]')).toBeNull();
    expect(shadow.querySelector('[data-tab="api"]')).toBeNull();
  });
});
