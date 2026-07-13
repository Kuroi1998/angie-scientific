import { parseCssVarExpression, readCssCustomProperty } from './cssVariables';

// Same problem as resolveCssColor but for the `font` shorthand: Canvas silently
// ignores the whole assignment (and keeps the previous font) if any token in
// the string fails to parse, so `ctx.font = 'bold 12px var(--font-title)'`
// never applies the intended family — it silently falls back to whatever
// font was last successfully set (browser default on first draw).

export const DEFAULT_FALLBACK_FONT_FAMILY = 'sans-serif';

const VAR_TOKEN_PATTERN = /var\(\s*--[a-zA-Z0-9-_]+\s*(?:,\s*[^)]+)?\)/g;

/**
 * Replaces every `var(--token)` occurrence inside a canvas font shorthand
 * string (e.g. `"bold 12px var(--font-title)"`) with its resolved computed
 * value, so the result is always a font string Canvas can parse. Falls back
 * to `fallbackFamily` for any variable that isn't defined.
 */
export function resolveCssFont(
  fontString: string,
  fallbackFamily: string = DEFAULT_FALLBACK_FONT_FAMILY,
  element?: HTMLElement
): string {
  if (!fontString) return fontString;

  return fontString.replace(VAR_TOKEN_PATTERN, (token) => {
    const parsed = parseCssVarExpression(token);
    if (!parsed) return fallbackFamily;
    const computed = readCssCustomProperty(parsed.varName, element);
    if (computed) return computed;
    if (parsed.fallback) return parsed.fallback;
    return fallbackFamily;
  });
}
