import { parseCssVarExpression, readCssCustomProperty } from './cssVariables';

// Canvas gradients/fillStyle/strokeStyle throw (addColorStop) or silently
// no-op (fillStyle/strokeStyle) when given a raw `var(--token)` string,
// because the Canvas 2D API never resolves CSS custom properties. This
// module centralizes the resolution so every canvas-drawing component can
// safely pass theme tokens through and always end up with a color string
// Canvas can actually parse.

export const DEFAULT_FALLBACK_COLOR = '#ffffff';

const NAMED_COLORS = new Set([
  'transparent', 'currentcolor', 'inherit',
  'black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
  'gray', 'grey', 'orange', 'purple', 'pink', 'brown', 'lime', 'navy',
  'teal', 'maroon', 'olive', 'silver', 'gold', 'indigo', 'violet', 'coral',
  'crimson', 'salmon', 'khaki', 'plum', 'orchid', 'tan', 'beige', 'ivory',
]);

const HEX_PATTERN = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNC_PATTERN = /^(rgb|rgba|hsl|hsla)\(\s*[^)]+\)$/i;

/** Whether `value` is a concrete CSS color Canvas can parse (i.e. not a `var()` reference). */
export function isResolvedCssColor(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (HEX_PATTERN.test(v)) return true;
  if (FUNC_PATTERN.test(v)) return true;
  if (/^[a-z]+$/i.test(v)) return NAMED_COLORS.has(v.toLowerCase());
  return false;
}

/**
 * Resolves a CSS color that may be a direct value (`#0ff`, `rgb(...)`, `hsl(...)`,
 * a named color) or a `var(--token)` reference, into a concrete color string
 * that is always safe to hand to a CanvasRenderingContext2D (fillStyle,
 * strokeStyle, addColorStop). Falls back to `fallback` (default white) when
 * the input is empty/undefined, the variable is not defined, or the resolved
 * value still isn't a color Canvas can parse.
 */
export function resolveCssColor(
  input: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK_COLOR,
  element?: HTMLElement
): string {
  if (!input) return fallback;
  const trimmed = input.trim();
  if (!trimmed) return fallback;

  const parsedVar = parseCssVarExpression(trimmed);
  if (parsedVar) {
    const computed = readCssCustomProperty(parsedVar.varName, element);
    if (computed && isResolvedCssColor(computed)) return computed;
    if (parsedVar.fallback) return resolveCssColor(parsedVar.fallback, fallback, element);
    return fallback;
  }

  return isResolvedCssColor(trimmed) ? trimmed : fallback;
}
