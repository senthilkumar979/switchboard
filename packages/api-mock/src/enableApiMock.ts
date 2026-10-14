import type { ApiMockRule, HttpMethod, MockJsonPreset, Switchboard } from '@switchboard/core';

export function getRequestPathname(input: RequestInfo | URL): string {
  try {
    if (typeof input === 'string') {
      return new URL(input, 'http://localhost').pathname;
    }
    if (input instanceof URL) return input.pathname;
    return new URL(input.url, 'http://localhost').pathname;
  } catch {
    return typeof input === 'string' ? input : '';
  }
}

export function getRequestMethod(input: RequestInfo | URL, init?: RequestInit): HttpMethod | string {
  if (init?.method) return init.method.toUpperCase();
  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.method.toUpperCase();
  }
  return 'GET';
}

export function matchApiMockRule(
  rule: ApiMockRule,
  pathname: string,
  method: string,
): boolean {
  if (!rule.enabled) return false;
  if (rule.url !== pathname) return false;
  const ruleMethod = rule.method ?? '*';
  if (ruleMethod === '*') return true;
  return ruleMethod === method.toUpperCase();
}

export function resolveMockResponseBody(
  rule: ApiMockRule,
  presets: Record<string, MockJsonPreset>,
): unknown {
  if (rule.responsePresetId === 'other') {
    return rule.customJson !== undefined ? rule.customJson : {};
  }
  return presets[rule.responsePresetId]?.json ?? {};
}

export function findMatchingApiMock(
  rules: ApiMockRule[],
  pathname: string,
  method: string,
): ApiMockRule | undefined {
  return rules.find((rule) => matchApiMockRule(rule, pathname, method));
}

/**
 * Installs a `fetch` interceptor that applies Switchboard effective API mocks.
 * Returns a dispose function that restores the original `fetch`.
 */
export function enableApiMock(switchboard: Switchboard): () => void {
  const original = globalThis.fetch.bind(globalThis);

  const intercepted: typeof fetch = async (input, init) => {
    const pathname = getRequestPathname(input);
    const method = getRequestMethod(input, init);
    const rule = findMatchingApiMock(switchboard.getEffectiveApiMocks(), pathname, method);

    if (!rule) {
      return original(input, init);
    }

    const presets = switchboard.getState().responsePresets;
    let body: string;
    try {
      body = JSON.stringify(resolveMockResponseBody(rule, presets));
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      // Soft-fail: fall through to network rather than crash the host.
      if (typeof console !== 'undefined' && typeof console.warn === 'function') {
        console.warn('[switchboard/api-mock]', err.message);
      }
      return original(input, init);
    }

    return new Response(body, {
      status: rule.statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  globalThis.fetch = intercepted;

  return () => {
    if (globalThis.fetch === intercepted) {
      globalThis.fetch = original;
    }
  };
}
