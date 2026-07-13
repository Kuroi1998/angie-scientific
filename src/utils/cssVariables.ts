// Shared low-level helper for reading resolved CSS custom property values.
// Canvas 2D APIs (fillStyle, strokeStyle, addColorStop, font) never resolve
// `var(--x)` themselves — they are not part of the CSS cascade — so any
// component that wants to reuse a theme token inside a <canvas> must read the
// computed value up front via getComputedStyle.

const VAR_PATTERN = /^var\(\s*(--[a-zA-Z0-9-_]+)\s*(?:,\s*([\s\S]+))?\)$/;

export interface ParsedCssVar {
  varName: string;
  fallback: string | null;
}

export function parseCssVarExpression(value: string): ParsedCssVar | null {
  const match = value.trim().match(VAR_PATTERN);
  if (!match) return null;
  const [, varName, fallback] = match;
  return { varName, fallback: fallback ? fallback.trim() : null };
}

export function readCssCustomProperty(
  varName: string,
  element?: HTMLElement
): string {
  const target = element ?? (typeof document !== 'undefined' ? document.documentElement : undefined);
  if (!target || typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    return '';
  }
  try {
    return window.getComputedStyle(target).getPropertyValue(varName).trim();
  } catch {
    return '';
  }
}
