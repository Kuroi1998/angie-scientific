// Small shared helpers for robust <canvas> setup: device-pixel-ratio aware
// sizing and respecting the user's reduced-motion preference.

/**
 * Resizes `canvas` so its backing pixel buffer matches the device pixel
 * ratio (crisp on HiDPI screens) while keeping its CSS/logical size at
 * `cssWidth` x `cssHeight`. Returns a 2D context whose transform is scaled
 * so draw calls can keep using logical (CSS pixel) coordinates.
 * Returns null if a 2D context is unavailable or the requested size is invalid.
 */
export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number
): CanvasRenderingContext2D | null {
  if (!Number.isFinite(cssWidth) || !Number.isFinite(cssHeight) || cssWidth <= 0 || cssHeight <= 0) {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const dpr = typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1;
  const targetWidth = Math.max(1, Math.round(cssWidth * dpr));
  const targetHeight = Math.max(1, Math.round(cssHeight * dpr));

  if (canvas.width !== targetWidth) canvas.width = targetWidth;
  if (canvas.height !== targetHeight) canvas.height = targetHeight;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/** Whether the user's OS/browser is set to reduce motion. Safe to call outside the browser. */
export function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined' && document.documentElement.getAttribute('data-reduced-motion') === 'true') {
    return true;
  }
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
