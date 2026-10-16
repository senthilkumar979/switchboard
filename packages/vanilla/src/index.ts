/**
 * Vanilla JavaScript integration — thin re-export of core (future).
 * Not implemented beyond naming stub in Phase 0.
 */
export { PACKAGE_NAME as CORE_PACKAGE_NAME } from '@switchboard-js/core';

export const PACKAGE_NAME = '@switchboard-js/vanilla' as const;

export const NOT_IMPLEMENTED =
  '@switchboard-js/vanilla is a thin core re-export stub. Prefer @switchboard-js/core directly for now.' as const;
