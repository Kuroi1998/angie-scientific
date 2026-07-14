import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import i18n from './i18n';

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

afterEach(async () => {
  await i18n.changeLanguage('fr');
});
