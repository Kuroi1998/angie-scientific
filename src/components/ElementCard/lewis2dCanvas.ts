import { resolveCssColor } from '../../utils/resolveCssColor';
import { resolveCssFont } from '../../utils/resolveCssFont';

interface DrawLewisArgs {
  canvas: HTMLCanvasElement;
  centralSymbol: string;
  ligand: string;
  count: number;
  lonePairs: number;
}

export const drawLewisStructure = ({ canvas, centralSymbol, ligand, count, lonePairs }: DrawLewisArgs) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const neonCyan = resolveCssColor('var(--neon-cyan)', '#00f3ff');
  const neonMagenta = resolveCssColor('var(--neon-magenta)', '#ff007f');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCentralAtom(ctx, cx, cy, centralSymbol, neonCyan);
  drawLigandBonds(ctx, cx, cy, ligand, count, neonCyan);
  drawLonePairs(ctx, cx, cy, count, lonePairs, neonMagenta);
};

const drawCentralAtom = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  centralSymbol: string,
  neonCyan: string
) => {
  ctx.font = resolveCssFont('bold 20px var(--font-title)');
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 8;
  ctx.shadowColor = neonCyan;
  ctx.fillText(centralSymbol, cx, cy);
  ctx.shadowBlur = 0;
};

const drawLigandBonds = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  ligand: string,
  count: number,
  neonCyan: string
) => {
  getLewisAngles(count).forEach((angle) => {
    const distance = 55;
    const lx = cx + distance * Math.cos(angle);
    const ly = cy + distance * Math.sin(angle);

    ctx.strokeStyle = neonCyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ligand === 'O' && count <= 2) drawDoubleBond(ctx, cx, cy, lx, ly, angle);
    else drawSingleBond(ctx, cx, cy, lx, ly, angle);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = resolveCssFont('bold 15px var(--font-title)');
    ctx.fillText(ligand, lx, ly);
  });
};

const drawSingleBond = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  lx: number,
  ly: number,
  angle: number
) => {
  ctx.moveTo(cx + Math.cos(angle) * 15, cy + Math.sin(angle) * 15);
  ctx.lineTo(lx - Math.cos(angle) * 12, ly - Math.sin(angle) * 12);
};

const drawDoubleBond = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  lx: number,
  ly: number,
  angle: number
) => {
  const dx = Math.sin(angle) * 3;
  const dy = -Math.cos(angle) * 3;
  ctx.moveTo(cx + Math.cos(angle) * 15 + dx, cy + Math.sin(angle) * 15 + dy);
  ctx.lineTo(lx - Math.cos(angle) * 12 + dx, ly - Math.sin(angle) * 12 + dy);
  ctx.moveTo(cx + Math.cos(angle) * 15 - dx, cy + Math.sin(angle) * 15 - dy);
  ctx.lineTo(lx - Math.cos(angle) * 12 - dx, ly - Math.sin(angle) * 12 - dy);
};

const drawLonePairs = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  count: number,
  lonePairs: number,
  neonMagenta: string
) => {
  if (lonePairs <= 0) return;

  ctx.fillStyle = neonMagenta;
  getLonePairAngles(count).slice(0, lonePairs).forEach((angle) => {
    const lpx1 = cx + 18 * Math.cos(angle) - Math.sin(angle) * 3;
    const lpy1 = cy + 18 * Math.sin(angle) + Math.cos(angle) * 3;
    const lpx2 = cx + 18 * Math.cos(angle) + Math.sin(angle) * 3;
    const lpy2 = cy + 18 * Math.sin(angle) - Math.cos(angle) * 3;

    ctx.beginPath();
    ctx.arc(lpx1, lpy1, 2, 0, 2 * Math.PI);
    ctx.arc(lpx2, lpy2, 2, 0, 2 * Math.PI);
    ctx.fill();
  });
};

const getLewisAngles = (count: number) => {
  if (count === 1) return [0];
  if (count === 2) return [0, Math.PI];
  if (count === 3) return [-Math.PI / 6, 5 * Math.PI / 6, 3 * Math.PI / 2];
  if (count === 4) return [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
  return Array.from({ length: count }, (_, index) => (index * 2 * Math.PI) / count);
};

const getLonePairAngles = (count: number) => {
  if (count === 1) return [Math.PI, Math.PI / 2, 3 * Math.PI / 2];
  if (count === 2) return [Math.PI / 2, 3 * Math.PI / 2];
  if (count === 3) return [Math.PI / 2];
  if (count === 4) return [Math.PI / 4, 5 * Math.PI / 4];
  return [];
};
