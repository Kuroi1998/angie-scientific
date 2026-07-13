import '@testing-library/jest-dom/vitest';

// jsdom has no real <canvas> renderer ("Not implemented: HTMLCanvasElement's
// getContext()"). Component tests only need canvas-drawing code to run without
// throwing (the app itself already no-ops when getContext() returns null) —
// this stub silences the console noise for that expected environment gap
// without pulling in a native canvas dependency.
const noop = () => {};
const mock2DContext = {
  clearRect: noop, fillRect: noop, strokeRect: noop,
  beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop,
  arc: noop, ellipse: noop, rect: noop,
  quadraticCurveTo: noop, bezierCurveTo: noop,
  fill: noop, stroke: noop, fillText: noop, strokeText: noop,
  save: noop, restore: noop, scale: noop, rotate: noop, translate: noop,
  setTransform: noop, setLineDash: noop, measureText: () => ({ width: 0 }),
  createRadialGradient: () => ({ addColorStop: noop }),
  createLinearGradient: () => ({ addColorStop: noop }),
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => mock2DContext,
  writable: true,
});
