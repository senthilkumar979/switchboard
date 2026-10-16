import type { UserContext } from '@switchboard-js/core';

export function can(user: UserContext, permission: string): boolean {
  const permissions = Array.isArray(user.permissions) ? user.permissions : [];
  return permissions.includes(permission);
}
