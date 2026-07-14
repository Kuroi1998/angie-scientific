import type { VirtualExperiment } from './virtualLabData';
import { resolveCssColor } from '../../utils/resolveCssColor';

// The bench/beaker scene is a deliberately dark illustrative backdrop (like a
// photo of a lab under museum lighting) and stays fixed across themes. Only
// the reaction-identity colors (bubbles, liquids, sparks) route through the
// accent tokens so they stay legible in the high-contrast theme.
function reactionPalette() {
  return {
    coral: resolveCssColor('var(--as-accent-coral)', '#ef6b5b'),
    cyan: resolveCssColor('var(--as-accent-cyan)', '#18b8c8'),
    amber: resolveCssColor('var(--as-accent-amber)', '#f2b84b'),
    green: resolveCssColor('var(--as-accent-green)', '#39a76d'),
    info: resolveCssColor('var(--as-info)', '#167aa4'),
    borderStrong: resolveCssColor('var(--as-border-strong)', '#9eb0bb'),
  };
}

interface DrawOptions {
  completed: boolean;
  experiment: VirtualExperiment;
  hasIndicator: boolean;
  isRunning: boolean;
  m1: number;
  m2: number;
  progress: number;
  temp: number;
}

export function drawVirtualExperiment(canvas: HTMLCanvasElement, options: DrawOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { completed, experiment, hasIndicator, isRunning, m1, m2, progress, temp } = options;
  const w = canvas.width;
  const h = canvas.height;
  const bx = w / 2;
  const by = h - 34;
  const bw = 110;
  const bh = 150;
  const palette = reactionPalette();

  ctx.clearRect(0, 0, w, h);
  drawBench(ctx, w, h);
  drawBeaker(ctx, bx, by, bw, bh);

  if (experiment.id === 'h2o') drawWaterSynthesis(ctx, bx, by, bw, bh, m1, m2, progress, isRunning, completed, palette);
  if (experiment.id === 'nacl') drawSaltSynthesis(ctx, bx, by, bw, bh, m1, temp, progress, isRunning, completed, palette);
  if (experiment.id === 'neutralization') {
    drawNeutralization(ctx, bx, by, bw, bh, m1, m2, progress, hasIndicator, isRunning, palette);
  }

  drawProgressRing(ctx, w - 38, 38, isRunning || completed ? progress : 0, completed, palette);
}

type ReactionPalette = ReturnType<typeof reactionPalette>;

function drawBench(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#071018';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  for (let y = 20; y < h; y += 26) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawBeaker(ctx: CanvasRenderingContext2D, bx: number, by: number, bw: number, bh: number) {
  ctx.strokeStyle = 'rgba(247,250,252,0.45)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(bx - bw / 2, by - bh);
  ctx.lineTo(bx - bw / 2, by);
  ctx.quadraticCurveTo(bx - bw / 2, by + 16, bx, by + 16);
  ctx.quadraticCurveTo(bx + bw / 2, by + 16, bx + bw / 2, by);
  ctx.lineTo(bx + bw / 2, by - bh);
  ctx.stroke();
}

function drawWaterSynthesis(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  m1: number,
  m2: number,
  progress: number,
  isRunning: boolean,
  completed: boolean,
  palette: ReactionPalette,
) {
  const count = Math.min(52, Math.round((m1 + m2) * 2));
  for (let i = 0; i < count; i++) {
    const x = bx - bw / 2 + 12 + (Math.sin(i * 17 + progress * 8) * 0.5 + 0.5) * (bw - 24);
    const y = by - bh + 18 + (Math.cos(i * 11 + progress * 12) * 0.5 + 0.5) * (bh - 36);
    ctx.fillStyle = i % 3 === 0 ? palette.coral : palette.cyan;
    ctx.beginPath();
    ctx.arc(x, y, i % 3 === 0 ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (isRunning && progress < 0.4) {
    ctx.globalAlpha = 1 - progress;
    ctx.fillStyle = palette.amber;
    ctx.beginPath();
    ctx.arc(bx, by - bh / 2, bw * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (completed || progress > 0.2) fillLiquid(ctx, bx, by, bw, 0.35, palette.info);
}

function drawSaltSynthesis(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  m1: number,
  temp: number,
  progress: number,
  isRunning: boolean,
  completed: boolean,
  palette: ReactionPalette,
) {
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = palette.green;
  ctx.fillRect(bx - bw / 2 + 3, by - bh + 3, bw - 6, bh - 3);
  ctx.globalAlpha = 1;
  ctx.fillStyle = isRunning ? palette.amber : palette.borderStrong;
  const size = Math.max(12, m1 * 1.4);
  if (temp >= 370) {
    ctx.beginPath();
    ctx.ellipse(bx, by - 14, size * 1.5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(bx - size / 2, by - size - 8, size, size);
  }
  if (completed) drawCrystals(ctx, bx, by, bw);
  if (isRunning) drawSpark(ctx, bx, by - 80, progress, palette);
}

function drawNeutralization(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  m1: number,
  m2: number,
  progress: number,
  hasIndicator: boolean,
  isRunning: boolean,
  palette: ReactionPalette,
) {
  const isBasic = m2 / 40 > m1 / 36.46;
  // Phenolphthalein indicator pink is a fixed chemical property, not a theme color.
  fillLiquid(ctx, bx, by, bw, 0.48, hasIndicator && isBasic ? '#ef6b9a' : palette.cyan);
  if (isRunning) {
    ctx.fillStyle = '#f7fafc';
    ctx.beginPath();
    ctx.arc(bx, by - bh + progress * bh * 0.72, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function fillLiquid(ctx: CanvasRenderingContext2D, bx: number, by: number, bw: number, ratio: number, color: string) {
  const height = 118 * ratio;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.42;
  ctx.fillRect(bx - bw / 2 + 4, by - height, bw - 8, height);
  ctx.globalAlpha = 1;
}

function drawCrystals(ctx: CanvasRenderingContext2D, bx: number, by: number, bw: number) {
  ctx.fillStyle = '#f7fafc';
  for (let i = 0; i < 18; i++) {
    const x = bx - bw / 2 + 12 + (i * 17) % (bw - 24);
    const y = by - 10 + Math.sin(i) * 5;
    ctx.fillRect(x, y, 3, 3);
  }
}

function drawSpark(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number, palette: ReactionPalette) {
  ctx.globalAlpha = 1 - progress * 0.6;
  ctx.strokeStyle = palette.amber;
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(i) * 36 * progress, y + Math.sin(i) * 36 * progress);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawProgressRing(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number, completed: boolean, palette: ReactionPalette) {
  ctx.strokeStyle = 'rgba(247,250,252,0.25)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = completed ? palette.green : palette.cyan;
  ctx.beginPath();
  ctx.arc(x, y, 20, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();
}

