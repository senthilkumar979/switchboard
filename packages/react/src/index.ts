export { SwitchboardProvider } from './SwitchboardProvider.js';
export type { SwitchboardProviderProps } from './SwitchboardProvider.js';

export { SwitchboardPanel } from './SwitchboardPanel.js';
export type { SwitchboardPanelProps } from './SwitchboardPanel.js';

export { useSwitchboard } from './useSwitchboard.js';
export type { UseSwitchboardResult } from './useSwitchboard.js';

export { useFeatureFlag } from './useFeatureFlag.js';
export type { UseFeatureFlagResult } from './useFeatureFlag.js';

export { useUserContext } from './useUserContext.js';
export type { UseUserContextResult } from './useUserContext.js';

export { useScenario } from './useScenario.js';
export type { UseScenarioResult } from './useScenario.js';

export { useApiMock } from './useApiMock.js';
export type { UseApiMockResult } from './useApiMock.js';

export { useSwitchboardSelector } from './useSwitchboardSelector.js';

export {
  PACKAGE_NAME as CORE_PACKAGE_NAME,
  PACKAGE_VERSION as CORE_PACKAGE_VERSION,
  createSwitchboard,
} from '@switchboard/core';

export type {
  FeatureDefinition,
  FeatureInput,
  FeatureMeta,
  FeatureValue,
  Switchboard,
  SwitchboardConfig,
  SwitchboardState,
  UserContext,
} from '@switchboard/core';

export const PACKAGE_NAME = '@switchboard/react' as const;
export const PACKAGE_VERSION = '0.0.0' as const;
