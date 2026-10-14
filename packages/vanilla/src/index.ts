/**
 * Vanilla JavaScript integration — thin re-export of core (future).
 * Not implemented beyond naming stub in Phase 0.
 */
export { PACKAGE_NAME as CORE_PACKAGE_NAME } from '@switchboard/core';

export const PACKAGE_NAME = '@switchboard/vanilla' as const;

export const NOT_IMPLEMENTED =
  '@switchboard/vanilla is a thin core re-export stub. Prefer @switchboard/core directly for now.' as const;
