import type { UserContext } from '@switchboard-js/core';

import { useSwitchboardInstance } from './context.js';
import { useSwitchboardSelector } from './useSwitchboardSelector.js';

export interface UseUserContextResult {
  user: UserContext;
  setUser: (user: Partial<UserContext>) => void;
  resetUser: () => void;
}

export function useUserContext(): UseUserContextResult {
  const instance = useSwitchboardInstance();
  const user = useSwitchboardSelector((state) => state.user);

  return {
    user,
    setUser: (partial) => {
      instance.setUser(partial);
    },
    resetUser: () => {
      instance.resetUser();
    },
  };
}
