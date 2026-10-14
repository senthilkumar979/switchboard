import { useSwitchboardInstance } from './context.js';
import { useSwitchboardSelector } from './useSwitchboardSelector.js';

export interface UseFeatureFlagResult {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  isOverridden: boolean;
}

export function useFeatureFlag(name: string): UseFeatureFlagResult {
  const instance = useSwitchboardInstance();
  const enabled = useSwitchboardSelector((state) => state.features[name] ?? false);
  const isOverridden = useSwitchboardSelector(
    (state) => state.featureMeta[name]?.isOverridden ?? false,
  );

  return {
    enabled,
    isOverridden,
    setEnabled: (value: boolean) => {
      instance.setFeature(name, value);
    },
  };
}
