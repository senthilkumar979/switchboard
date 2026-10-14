import type { SwitchboardConfig, UserContext } from '../types.js';
import { type InternalFeature, cloneUser, resolveFeatureValue } from './state.js';
import { validateUserContext } from '../validate.js';

export function applyEnvironmentPreset(
  features: Map<string, InternalFeature>,
  name: string,
  presets: NonNullable<SwitchboardConfig['environments']>,
  setUser: (user: UserContext) => void,
): void {
  const preset = presets[name];
  if (!preset) return;

  if (preset.user) {
    setUser(cloneUser(validateUserContext(preset.user)));
  }

  if (!preset.features) return;

  for (const [featureName, value] of Object.entries(preset.features)) {
    const entry = features.get(featureName);
    if (!entry) {
      features.set(featureName, {
        definition: { default: value },
        override: undefined,
      });
      continue;
    }
    const resolvedDefault = resolveFeatureValue(entry.definition, name, undefined);
    entry.override = value === resolvedDefault ? undefined : value;
  }
}
