import type {
  ApiMockRule,
  FeatureDefinition,
  FeatureMeta,
  FeatureValue,
  MockJsonPreset,
  Scenario,
  UserContext,
} from '../types.js';
import { cloneApiMockRule } from '../validate/api-mock.js';
import { cloneMockJsonPreset } from '../validate/api-mock.js';
import { cloneScenario } from '../validate/scenario.js';

export interface InternalFeature {
  definition: FeatureDefinition;
  override: FeatureValue | undefined;
}

export function cloneUser(user: UserContext): UserContext {
  return {
    ...user,
    permissions: user.permissions ? [...user.permissions] : undefined,
  };
}

export function resolveFeatureValue(
  definition: FeatureDefinition,
  environment: string,
  override: FeatureValue | undefined,
): FeatureValue {
  if (override !== undefined) return override;
  const envDefault = definition.environments?.[environment];
  if (envDefault !== undefined) return envDefault;
  return definition.default;
}

export function buildState(
  features: Map<string, InternalFeature>,
  user: UserContext,
  environment: string,
  scenarios: Map<string, Scenario>,
  activeScenarioId: string | null,
  responsePresets: Map<string, MockJsonPreset>,
  apiMocks: Map<string, ApiMockRule>,
) {
  const featureValues: Record<string, FeatureValue> = {};
  const featureMeta: Record<string, FeatureMeta> = {};

  for (const [name, entry] of features) {
    const value = resolveFeatureValue(entry.definition, environment, entry.override);
    featureValues[name] = value;
    featureMeta[name] = {
      default: entry.definition.default,
      group: entry.definition.group,
      description: entry.definition.description,
      environments: entry.definition.environments
        ? { ...entry.definition.environments }
        : undefined,
      isOverridden: entry.override !== undefined,
    };
  }

  const scenarioRecord: Record<string, Scenario> = {};
  for (const [id, scenario] of scenarios) {
    scenarioRecord[id] = cloneScenario(scenario);
  }

  const presetRecord: Record<string, MockJsonPreset> = {};
  for (const [id, preset] of responsePresets) {
    presetRecord[id] = cloneMockJsonPreset(preset);
  }

  const mockRecord: Record<string, ApiMockRule> = {};
  for (const [id, rule] of apiMocks) {
    mockRecord[id] = cloneApiMockRule(rule);
  }

  return {
    features: featureValues,
    featureMeta,
    user: cloneUser(user),
    environment,
    scenarios: scenarioRecord,
    activeScenarioId,
    responsePresets: presetRecord,
    apiMocks: mockRecord,
  };
}
