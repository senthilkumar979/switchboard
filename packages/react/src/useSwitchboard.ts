import type { FeatureValue, Switchboard, SwitchboardState, UserContext } from '@switchboard-js/core';

import { useSwitchboardInstance } from './context.js';
import { useSwitchboardSelector } from './useSwitchboardSelector.js';

export interface UseSwitchboardResult {
  state: SwitchboardState;
  isEnabled: (feature: string) => boolean;
  getFeature: (feature: string) => FeatureValue | undefined;
  setFeature: Switchboard['setFeature'];
  registerFeature: Switchboard['registerFeature'];
  getFeatures: Switchboard['getFeatures'];
  getUser: () => UserContext;
  setUser: Switchboard['setUser'];
  resetUser: Switchboard['resetUser'];
  getEnvironment: () => string;
  setEnvironment: Switchboard['setEnvironment'];
  getState: Switchboard['getState'];
  subscribe: Switchboard['subscribe'];
  reset: Switchboard['reset'];
  instance: Switchboard;
}

export function useSwitchboard(): UseSwitchboardResult {
  const instance = useSwitchboardInstance();
  const state = useSwitchboardSelector((snapshot) => snapshot);

  return {
    state,
    instance,
    isEnabled: (feature) => state.features[feature] ?? false,
    getFeature: (feature) => state.features[feature],
    setFeature: instance.setFeature.bind(instance),
    registerFeature: instance.registerFeature.bind(instance),
    getFeatures: () => ({ ...state.features }),
    getUser: () => state.user,
    setUser: instance.setUser.bind(instance),
    resetUser: instance.resetUser.bind(instance),
    getEnvironment: () => state.environment,
    setEnvironment: instance.setEnvironment.bind(instance),
    getState: instance.getState.bind(instance),
    subscribe: instance.subscribe.bind(instance),
    reset: instance.reset.bind(instance),
  };
}
