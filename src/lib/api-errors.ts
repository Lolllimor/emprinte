/** Maps typical API JSON error bodies to a single message string. */
export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (data !== null && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (d.details != null) return JSON.stringify(d.details);
    if (typeof d.error === 'string') return d.error;
  }
  return fallback;
}
