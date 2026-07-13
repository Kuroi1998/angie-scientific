import React, { useRef, useEffect } from 'react';
import { resolveCssColor } from '../../utils/resolveCssColor';
import { resolveCssFont } from '../../utils/resolveCssFont';
import { setupHiDPICanvas, prefersReducedMotion } from '../../utils/canvasSetup';

interface AtomModelCanvasProps {
  shells: number[];
  categoryColor: string;
  symbol: string;
}

export const AtomModelCanvas: React.FC<AtomModelCanvasProps> = ({ shells, categoryColor, symbol }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resolvedCategoryColor = resolveCssColor(categoryColor, '#00f3ff');
    const titleFont = resolveCssFont('bold 12px var(--font-title)');
    const monoFont = resolveCssFont('9px var(--font-mono)');
    const reducedMotion = prefersReducedMotion();

    let animationFrameId: number;
    let cancelled = false;
    let cssWidth = 300;
    let cssHeight = 300;
    const angles = shells.map(() => Math.random() * Math.PI * 2);

    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetRotY = (x / (rect.width / 2)) * Math.PI * 0.3; 
      targetRotX = -(y / (rect.height / 2)) * Math.PI * 0.3;
    };
    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const resizeCanvas = () => {
      cssWidth = canvas.parentElement?.clientWidth || 300;
      cssHeight = canvas.parentElement?.clientHeight || 300;
      if (cssWidth <= 0) cssWidth = 300;
      if (cssHeight <= 0) cssHeight = 300;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      if (cancelled) return;
      const ctx = setupHiDPICanvas(canvas, cssWidth, cssHeight);
      if (!ctx) return;

      const width = cssWidth;
      const height = cssHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Background grid telemetry
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.stroke();

      // 2. Draw Concentric Shell Paths and Orbiting Electrons
      const shellCount = shells.length;
      const step = (maxRadius - 30) / Math.max(shellCount, 1);

      // Collect electrons to sort by Z-index (for 3D overlap)
      const electronsToDraw: {x: number, y: number, z: number}[] = [];

      for (let s = 0; s < shellCount; s++) {
        const radius = 30 + (s + 1) * step;
        const electronCount = shells[s];

        // Unique tilt per shell for a 3D atom look
        const baseTiltX = Math.PI * 0.25; 
        const shellRotZ = (s * Math.PI) / shellCount;
        
        const finalRotX = baseTiltX + rotX;
        const finalRotY = rotY;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
        ctx.ellipse(centerX, centerY, radius, radius * Math.cos(finalRotX), shellRotZ + finalRotY, 0, Math.PI * 2);
        ctx.stroke();

        if (!reducedMotion) {
          const speed = (0.02 / (s + 1)) + 0.005;
          angles[s] += speed;
        }

        for (let e = 0; e < electronCount; e++) {
          const angle = angles[s] + (e * Math.PI * 2) / electronCount;
          // Calculate 3D position
          const bx = Math.cos(angle) * radius;
          const by = Math.sin(angle) * radius;
          
          // Apply shell base tilt
          const z1 = by * Math.sin(baseTiltX);
          const y1 = by * Math.cos(baseTiltX);
          
          // Apply shell Z rotation
          const x2 = bx * Math.cos(shellRotZ) - y1 * Math.sin(shellRotZ);
          const y2 = bx * Math.sin(shellRotZ) + y1 * Math.cos(shellRotZ);
          
          // Apply mouse rotations
          const y3 = y2 * Math.cos(rotX) - z1 * Math.sin(rotX);
          const z3 = y2 * Math.sin(rotX) + z1 * Math.cos(rotX);
          
          const x4 = x2 * Math.cos(rotY) + z3 * Math.sin(rotY);
          const z4 = -x2 * Math.sin(rotY) + z3 * Math.cos(rotY);

          electronsToDraw.push({
            x: centerX + x4,
            y: centerY + y3,
            z: z4
          });
        }
      }

      // 3. Draw Pulsing Nucleus in the center
      const pulseRadius = reducedMotion ? 17 : 16 + Math.sin(Date.now() * 0.005) * 2;
      const nucGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      nucGrad.addColorStop(0, '#fff');
      nucGrad.addColorStop(0.2, resolvedCategoryColor);
      nucGrad.addColorStop(0.8, 'rgba(10, 10, 20, 0.6)');
      nucGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = nucGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Symbol text in center
      ctx.fillStyle = '#fff';
      ctx.font = titleFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, centerX, centerY);

      // Draw sorted electrons
      electronsToDraw.sort((a, b) => a.z - b.z).forEach(el => {
        // Size scales slightly with Z
        const scale = 1 + (el.z / maxRadius) * 0.3;
        const eRadius = Math.max(2, 6 * scale);

        const grad = ctx.createRadialGradient(el.x, el.y, 0, el.x, el.y, eRadius);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, resolvedCategoryColor);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(el.x, el.y, eRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Telemetry Shell Data Labels (rendered inside canvas)
      ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
      ctx.font = monoFont;
      ctx.textAlign = 'left';
      ctx.fillText(`SHELLS: [${shells.join(', ')}]`, 15, height - 15);

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [shells, categoryColor, symbol]);

  return React.createElement('canvas', {
    ref: canvasRef,
    role: 'img',
    'aria-label': `Modèle atomique de Bohr pour ${symbol}, couches électroniques : ${shells.join(', ')}`,
    style: {
      width: '100%',
      height: '100%',
      display: 'block',
      maxHeight: '350px'
    }
  });
};
