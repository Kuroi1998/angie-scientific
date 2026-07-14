import { resolveCssColor } from '../../../../../../utils/resolveCssColor';
import type { GasDefinition } from '../types/gas.types';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GasAnimationArgs {
  idealCanvas: HTMLCanvasElement;
  vdwCanvas: HTMLCanvasElement;
  volume: number;
  temp: number;
  gas: GasDefinition;
  particlesMultiplier: number;
  speed: number;
  isPaused: boolean;
}

export const animateGasCanvases = ({ idealCanvas, vdwCanvas, volume, temp, gas, particlesMultiplier, speed, isPaused }: GasAnimationArgs) => {
  const idealCtx = idealCanvas.getContext('2d');
  const vdwCtx = vdwCanvas.getContext('2d');
  if (!idealCtx || !vdwCtx) return () => undefined;

  const palette = {
    bgTertiary: resolveCssColor('var(--as-surface-tertiary)', '#171b2a'),
    neonCyan: resolveCssColor('var(--as-accent-cyan)', '#00f3ff'),
    neonMagenta: resolveCssColor('var(--as-accent-magenta)', '#ff007f')
  };

  const count = Math.min(Math.max(Math.floor(35 * particlesMultiplier), 5), 150);
  
  if (!(idealCanvas as any).__particles || (idealCanvas as any).__particles.length !== count) {
    (idealCanvas as any).__particles = createParticles(count);
    (vdwCanvas as any).__particles = createParticles(count);
  }

  const idealParticles = (idealCanvas as any).__particles;
  const vdwParticles = (vdwCanvas as any).__particles;
  
  let animationId = 0;

  const draw = () => {
    const idealTopY = drawContainer(idealCtx, idealCanvas.width, idealCanvas.height, volume, palette);
    const vdwTopY = drawContainer(vdwCtx, vdwCanvas.width, vdwCanvas.height, volume, palette);
    const speedFactor = Math.sqrt(temp / 300) * speed;

    if (!isPaused) {
      updateIdealParticles(idealCtx, idealParticles, idealCanvas, idealTopY, speedFactor, palette.neonCyan);
      updateVdwParticles(vdwCtx, vdwParticles, vdwCanvas, vdwTopY, speedFactor, gas, gas.color);
    } else {
      drawParticles(idealCtx, idealParticles, palette.neonCyan, 2);
      drawParticles(vdwCtx, vdwParticles, gas.color, 3);
    }
    
    animationId = requestAnimationFrame(draw);
  };

  draw();
  return () => cancelAnimationFrame(animationId);
};

const createParticles = (count: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 180 + 10,
    y: Math.random() * 180 + 10,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2
  }));
};

const drawContainer = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  volume: number,
  palette: { bgTertiary: string; neonCyan: string }
) => {
  // Volume ranges from 0.1 to 10
  const mappedVolume = Math.min(Math.max(volume, 0.1), 10);
  const topY = 20 + (10 - mappedVolume) * 12;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(10, topY, width - 20, height - topY - 10);
  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--surface-border').trim() || 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, topY, width - 20, height - topY - 10);
  ctx.fillStyle = palette.bgTertiary;
  ctx.strokeStyle = palette.neonCyan;
  ctx.fillRect(8, topY - 8, width - 16, 8);
  ctx.strokeRect(8, topY - 8, width - 16, 8);
  return topY;
};

const moveParticle = (p: Particle, speed: number) => {
  p.x += p.vx * speed;
  p.y += p.vy * speed;
};

const bounceParticle = (p: Particle, minX: number, maxX: number, minY: number, maxY: number) => {
  if (p.x < minX) { p.x = minX; p.vx *= -1; }
  if (p.x > maxX) { p.x = maxX; p.vx *= -1; }
  if (p.y < minY) { p.y = minY; p.vy *= -1; }
  if (p.y > maxY) { p.y = maxY; p.vy *= -1; }
};

const updateIdealParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  canvas: HTMLCanvasElement,
  topY: number,
  speedFactor: number,
  color: string
) => {
  particles.forEach((particle) => {
    moveParticle(particle, speedFactor);
    bounceParticle(particle, 14, canvas.width - 14, topY + 4, canvas.height - 14);
  });
  drawParticles(ctx, particles, color, 2);
};

const updateVdwParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  canvas: HTMLCanvasElement,
  topY: number,
  speedFactor: number,
  gas: GasDefinition,
  color: string
) => {
  const attractionRadius = 30 + gas.a * 10;
  const pullStrength = gas.a * 0.05;
  const particleRadius = 2 + gas.b * 30;

  particles.forEach((particle, i) => {
    let ax = 0;
    let ay = 0;

    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const other = particles[j];
      const dx = other.x - particle.x;
      const dy = other.y - particle.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < attractionRadius * attractionRadius && distSq > 100) {
        const dist = Math.sqrt(distSq);
        const force = pullStrength / distSq;
        ax += (dx / dist) * force;
        ay += (dy / dist) * force;
      }
    }

    particle.vx += ax;
    particle.vy += ay;
    
    // Limits
    const maxV = 2;
    const vMag = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (vMag > maxV) {
      particle.vx = (particle.vx / vMag) * maxV;
      particle.vy = (particle.vy / vMag) * maxV;
    }

    moveParticle(particle, speedFactor);
    bounceParticle(particle, 10 + particleRadius, canvas.width - 10 - particleRadius, topY + particleRadius, canvas.height - 10 - particleRadius);
  });
  
  drawParticles(ctx, particles, color, particleRadius);
};

const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[], color: string, radius: number) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  particles.forEach((p) => {
    ctx.moveTo(p.x, p.y);
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  });
  ctx.fill();
};
