export class SwitchboardValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SwitchboardValidationError';
  }
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
