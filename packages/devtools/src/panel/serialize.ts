import type { Switchboard, SwitchboardState, UserContext } from '@switchboard-js/core';

import type { PanelExportPayload } from './types.js';

export function exportState(state: SwitchboardState): PanelExportPayload {
  return {
    version: 1,
    features: { ...state.features },
    user: { ...state.user },
    environment: state.environment,
  };
}

export function serializeState(state: SwitchboardState): string {
  return JSON.stringify(exportState(state), null, 2);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseImportPayload(raw: string): PanelExportPayload {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON');
  }

  if (!isPlainObject(parsed) || parsed.version !== 1) {
    throw new Error('Invalid Switchboard export: expected version 1 object');
  }
  if (!isPlainObject(parsed.features)) {
    throw new Error('Invalid Switchboard export: features must be an object');
  }
  if (!isPlainObject(parsed.user)) {
    throw new Error('Invalid Switchboard export: user must be an object');
  }
  if (typeof parsed.environment !== 'string') {
    throw new Error('Invalid Switchboard export: environment must be a string');
  }

  const features: Record<string, boolean> = {};
  for (const [name, value] of Object.entries(parsed.features)) {
    if (typeof value !== 'boolean') {
      throw new Error(`Invalid feature value for "${name}"`);
    }
    features[name] = value;
  }

  return {
    version: 1,
    features,
    user: { ...parsed.user },
    environment: parsed.environment,
  };
}

export function applyImportPayload(instance: Switchboard, payload: PanelExportPayload): void {
  instance.setEnvironment(payload.environment);
  instance.setUser(payload.user as Partial<UserContext>);
  for (const [name, enabled] of Object.entries(payload.features)) {
    instance.setFeature(name, enabled);
  }
}
