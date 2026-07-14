const MS_PER_CHARACTER = 60;
const MIN_DURATION_MS = 3000;
const MAX_DURATION_MS = 14000;

/** Reading-speed based floor so long explanations never auto-close early. */
export function computeReadableDuration(text: string): number {
  const estimate = text.length * MS_PER_CHARACTER;
  return Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, estimate));
}
