import { resolveCssColor } from '../../utils/resolveCssColor';
import { resolveCssFont } from '../../utils/resolveCssFont';

type BondStyle = 'normal' | 'wedge' | 'dash';

interface VseprCoordinate {
  x: number;
  y: number;
  z: number;
  style: BondStyle;
}

interface DrawVseprArgs {
  canvas: HTMLCanvasElement;
  centralSymbol: string;
  ligand: string;
  count: number;
  lonePairs: number;
}

export const drawVseprStructure = ({ canvas, centralSymbol, ligand, count, lonePairs }: DrawVseprArgs) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const neonPurple = resolveCssColor('var(--neon-purple)', '#9d00ff');
  const neonCyan = resolveCssColor('var(--neon-cyan)', '#00f3ff');
  const neonMagenta = resolveCssColor('var(--neon-magenta)', '#ff007f');
  const project = createProjector(cx, cy);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCentralSphere(ctx, cx, cy, neonPurple, centralSymbol);

  const projected = getVseprCoordinates(count)
    .map((coordinate) => ({ ...project(coordinate.x, coordinate.y, coordinate.z), style: coordinate.style }))
    .sort((a, b) => a.pz - b.pz);

  projected.forEach((point) => drawBond(ctx, cx, cy, point.px, point.py, point.style));
  projected.forEach((point) => drawLigandSphere(ctx, point.px, point.py, ligand, neonCyan));
  drawLonePairLobes(ctx, project, cx, cy, count, lonePairs, neonMagenta);
};

const createProjector = (cx: number, cy: number) => {
  return (x: number, y: number, z: number) => {
    const angleY = Math.PI / 8;
    const angleX = Math.PI / 12;
    const x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
    const z1 = x * Math.sin(angleY) + z * Math.cos(angleY);
    const y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
    const z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);
    return { px: cx + x1 * 50, py: cy - y2 * 50, pz: z2 };
  };
};

const drawCentralSphere = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  neonPurple: string,
  centralSymbol: string
) => {
  ctx.shadowBlur = 10;
  ctx.shadowColor = neonPurple;
  ctx.fillStyle = 'rgba(157, 0, 255, 0.2)';
  ctx.strokeStyle = neonPurple;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.font = resolveCssFont('bold 12px var(--font-title)');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(centralSymbol, cx, cy);
};

const drawBond = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  px: number,
  py: number,
  style: BondStyle
) => {
  ctx.lineWidth = 2;
  if (style === 'wedge') {
    drawWedgeBond(ctx, cx, cy, px, py);
    return;
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.setLineDash(style === 'dash' ? [3, 4] : []);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(px, py);
  ctx.stroke();
  ctx.setLineDash([]);
};

const drawWedgeBond = (ctx: CanvasRenderingContext2D, cx: number, cy: number, px: number, py: number) => {
  ctx.fillStyle = 'var(--text-secondary)';
  const dx = Math.sin(Math.atan2(py - cy, px - cx)) * 4;
  const dy = -Math.cos(Math.atan2(py - cy, px - cx)) * 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(px + dx, py + dy);
  ctx.lineTo(px - dx, py - dy);
  ctx.closePath();
  ctx.fill();
};

const drawLigandSphere = (
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  symbol: string,
  neonCyan: string
) => {
  ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
  ctx.strokeStyle = neonCyan;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(px, py, 11, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = resolveCssFont('bold 9px var(--font-title)');
  ctx.fillText(symbol, px, py);
};

const drawLonePairLobes = (
  ctx: CanvasRenderingContext2D,
  project: (x: number, y: number, z: number) => { px: number; py: number; pz: number },
  cx: number,
  cy: number,
  count: number,
  lonePairs: number,
  neonMagenta: string
) => {
  if (lonePairs <= 0) return;

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
  ctx.lineWidth = 1;
  getLonePairCoordinates(count).slice(0, lonePairs).forEach((coordinate) => {
    const point = project(coordinate.x * 0.7, coordinate.y * 0.7, coordinate.z * 0.7);
    ctx.fillStyle = 'rgba(255, 0, 127, 0.08)';
    ctx.beginPath();
    ctx.ellipse(point.px, point.py, 12, 7, Math.atan2(point.py - cy, point.px - cx), 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = neonMagenta;
    ctx.beginPath();
    ctx.arc(point.px - 2, point.py, 1.5, 0, 2 * Math.PI);
    ctx.arc(point.px + 2, point.py, 1.5, 0, 2 * Math.PI);
    ctx.fill();
  });
  ctx.restore();
};

const getLonePairCoordinates = (count: number) => {
  if (count === 2) return [{ x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 }];
  if (count === 3) return [{ x: 0, y: 0, z: 1 }];
  if (count === 4) return [{ x: 0, y: 0, z: -1 }];
  return [];
};

const getVseprCoordinates = (count: number): VseprCoordinate[] => {
  if (count === 1) return [{ x: 1, y: 0, z: 0, style: 'normal' }];
  if (count === 2) return lineGeometry();
  if (count === 3) return trigonalGeometry();
  if (count === 4) return tetrahedralGeometry();
  if (count === 5) return bipyramidalGeometry();
  return octahedralGeometry();
};

const lineGeometry = (): VseprCoordinate[] => [
  { x: 1, y: 0, z: 0, style: 'normal' },
  { x: -1, y: 0, z: 0, style: 'normal' }
];

const trigonalGeometry = (): VseprCoordinate[] => [
  { x: 0, y: 1, z: 0, style: 'normal' },
  { x: Math.sqrt(3) / 2, y: -0.5, z: 0, style: 'normal' },
  { x: -Math.sqrt(3) / 2, y: -0.5, z: 0, style: 'normal' }
];

const tetrahedralGeometry = (): VseprCoordinate[] => [
  { x: 0, y: 1, z: 0, style: 'normal' },
  { x: Math.sqrt(8 / 9), y: -1 / 3, z: 0, style: 'normal' },
  { x: -Math.sqrt(2 / 9), y: -1 / 3, z: Math.sqrt(2 / 3), style: 'wedge' },
  { x: -Math.sqrt(2 / 9), y: -1 / 3, z: -Math.sqrt(2 / 3), style: 'dash' }
];

const bipyramidalGeometry = (): VseprCoordinate[] => [
  { x: 0, y: 1, z: 0, style: 'normal' },
  { x: 0, y: -1, z: 0, style: 'normal' },
  { x: 1, y: 0, z: 0, style: 'normal' },
  { x: -0.5, y: 0, z: Math.sqrt(3) / 2, style: 'wedge' },
  { x: -0.5, y: 0, z: -Math.sqrt(3) / 2, style: 'dash' }
];

const octahedralGeometry = (): VseprCoordinate[] => [
  { x: 0, y: 1, z: 0, style: 'normal' },
  { x: 0, y: -1, z: 0, style: 'normal' },
  { x: 1, y: 0, z: 0, style: 'normal' },
  { x: -1, y: 0, z: 0, style: 'normal' },
  { x: 0, y: 0, z: 1, style: 'wedge' },
  { x: 0, y: 0, z: -1, style: 'dash' }
];
