export function readUrlScenarioId(paramName: string | false | undefined): string | null {
  if (paramName === false) return null;
  const key = paramName ?? 'scenario';
  try {
    if (typeof globalThis === 'undefined') return null;
    const loc = (globalThis as { location?: { search?: string } }).location;
    if (!loc?.search) return null;
    return new URLSearchParams(loc.search).get(key);
  } catch {
    return null;
  }
}
