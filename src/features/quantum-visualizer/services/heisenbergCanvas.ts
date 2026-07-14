import { resolveCssColor } from '../../../utils/resolveCssColor';
import { resolveCssFont } from '../../../utils/resolveCssFont';

export const drawSpaceWavePacket = (canvas: HTMLCanvasElement, dx: number) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const midX = width / 2;
  const midY = height / 2;
  const neonCyan = resolveCssColor('var(--neon-cyan)', '#00f3ff');

  ctx.clearRect(0, 0, width, height);
  drawVerticalGrid(ctx, width, height, 'rgba(0, 243, 255, 0.02)');
  drawEnvelope(ctx, width, height, dx, 'rgba(0, 243, 255, 0.15)', 'rgba(0, 243, 255, 0.03)');
  drawOscillation(ctx, width, height, dx, 0.25, neonCyan);
  drawUncertaintyBounds(ctx, midX, midY, dx, neonCyan, 'Delta x');
};

export const drawMomentumWavePacket = (canvas: HTMLCanvasElement, dp: number) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const midX = width / 2;
  const midY = height / 2;
  const neonMagenta = resolveCssColor('var(--neon-magenta)', '#ff007f');

  ctx.clearRect(0, 0, width, height);
  drawVerticalGrid(ctx, width, height, 'rgba(255, 0, 127, 0.02)');
  drawEnvelope(ctx, width, height, dp, 'rgba(255, 0, 127, 0.15)', 'rgba(255, 0, 127, 0.03)');
  drawOscillation(ctx, width, height, dp, 0.03 * dp, neonMagenta);
  drawUncertaintyBounds(ctx, midX, midY, dp, neonMagenta, 'Delta p');
};

const drawVerticalGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, stroke: string) => {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
};

const drawEnvelope = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spread: number,
  stroke: string,
  fill: string
) => {
  const midX = width / 2;
  const midY = height / 2;

  ctx.beginPath();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  ctx.lineWidth = 1;
  ctx.moveTo(0, midY);

  for (let x = 0; x < width; x++) {
    ctx.lineTo(x, midY - gaussianAmplitude(x, midX, spread, height));
  }
  for (let x = width - 1; x >= 0; x--) {
    ctx.lineTo(x, midY + gaussianAmplitude(x, midX, spread, height));
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

const drawOscillation = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spread: number,
  waveNumber: number,
  stroke: string
) => {
  const midX = width / 2;
  const midY = height / 2;

  ctx.beginPath();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  for (let x = 0; x < width; x++) {
    const dist = x - midX;
    const envelope = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(spread, 2)));
    const y = midY - Math.cos(dist * waveNumber) * envelope * (height * 0.4);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
};

const drawUncertaintyBounds = (
  ctx: CanvasRenderingContext2D,
  midX: number,
  midY: number,
  spread: number,
  color: string,
  label: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(midX - spread, midY + 45);
  ctx.lineTo(midX + spread, midY + 45);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(midX - spread, midY + 40);
  ctx.lineTo(midX - spread, midY + 50);
  ctx.moveTo(midX + spread, midY + 40);
  ctx.lineTo(midX + spread, midY + 50);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = resolveCssFont('9px var(--font-mono)');
  ctx.fillText(label, midX - 20, midY + 38);
};

const gaussianAmplitude = (x: number, midX: number, spread: number, height: number) => {
  const dist = x - midX;
  const envelope = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(spread, 2)));
  return envelope * (height * 0.4);
};
