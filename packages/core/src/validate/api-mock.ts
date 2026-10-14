import type { ApiMockRule, HttpMethod, MockJsonPreset } from '../types.js';
import { SwitchboardValidationError, isPlainObject } from './errors.js';

const HTTP_METHODS = new Set<HttpMethod>(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', '*']);

export function validateMockJsonPreset(input: unknown, label = 'responsePreset'): MockJsonPreset {
  if (!isPlainObject(input)) {
    throw new SwitchboardValidationError(`${label} must be an object`);
  }
  if (typeof input.id !== 'string' || input.id.length === 0) {
    throw new SwitchboardValidationError(`${label}.id must be a non-empty string`);
  }
  if (typeof input.name !== 'string' || input.name.length === 0) {
    throw new SwitchboardValidationError(`${label}.name must be a non-empty string`);
  }
  if (!('json' in input)) {
    throw new SwitchboardValidationError(`${label}.json is required`);
  }
  return { id: input.id, name: input.name, json: structuredCloneJson(input.json) };
}

export function cloneMockJsonPreset(preset: MockJsonPreset): MockJsonPreset {
  return {
    id: preset.id,
    name: preset.name,
    json: structuredCloneJson(preset.json),
  };
}

export function validateApiMockRule(input: unknown, label = 'apiMock'): ApiMockRule {
  if (!isPlainObject(input)) {
    throw new SwitchboardValidationError(`${label} must be an object`);
  }
  if (typeof input.id !== 'string' || input.id.length === 0) {
    throw new SwitchboardValidationError(`${label}.id must be a non-empty string`);
  }
  if (typeof input.url !== 'string' || input.url.length === 0) {
    throw new SwitchboardValidationError(`${label}.url must be a non-empty string`);
  }
  if (typeof input.statusCode !== 'number' || !Number.isInteger(input.statusCode)) {
    throw new SwitchboardValidationError(`${label}.statusCode must be an integer`);
  }
  if (typeof input.enabled !== 'boolean') {
    throw new SwitchboardValidationError(`${label}.enabled must be a boolean`);
  }
  if (typeof input.responsePresetId !== 'string' || input.responsePresetId.length === 0) {
    throw new SwitchboardValidationError(`${label}.responsePresetId must be a non-empty string`);
  }

  const rule: ApiMockRule = {
    id: input.id,
    url: input.url,
    statusCode: input.statusCode,
    responsePresetId: input.responsePresetId,
    enabled: input.enabled,
  };

  if (input.method !== undefined) {
    if (typeof input.method !== 'string' || !HTTP_METHODS.has(input.method as HttpMethod)) {
      throw new SwitchboardValidationError(
        `${label}.method must be GET, POST, PUT, PATCH, DELETE, or *`,
      );
    }
    rule.method = input.method as HttpMethod;
  }

  if (input.customJson !== undefined) {
    rule.customJson = structuredCloneJson(input.customJson);
  }

  return rule;
}

export function cloneApiMockRule(rule: ApiMockRule): ApiMockRule {
  return {
    id: rule.id,
    url: rule.url,
    method: rule.method,
    statusCode: rule.statusCode,
    responsePresetId: rule.responsePresetId,
    customJson: rule.customJson !== undefined ? structuredCloneJson(rule.customJson) : undefined,
    enabled: rule.enabled,
  };
}

function structuredCloneJson(value: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(value)) as unknown;
  } catch {
    throw new SwitchboardValidationError('value must be JSON-serializable');
  }
}
