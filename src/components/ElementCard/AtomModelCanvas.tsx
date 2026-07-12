import React, { useRef, useEffect } from 'react';

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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angles = shells.map(() => Math.random() * Math.PI * 2);

    // Set dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 300;
      if (canvas.width === 0) canvas.width = 300;
      if (canvas.height === 0) canvas.height = 300;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation Loop
    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

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

      for (let s = 0; s < shellCount; s++) {
        const radius = 30 + (s + 1) * step;
        const electronCount = shells[s];

        // Draw Shell Circle Path
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Rotation speed decreases for outer shells
        const speed = (0.02 / (s + 1)) + 0.005;
        angles[s] += speed;

        // Draw Electrons on this shell
        for (let e = 0; e < electronCount; e++) {
          // Space electrons evenly around the orbit
          const angle = angles[s] + (e * Math.PI * 2) / electronCount;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Draw Electron Glow
          const grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
          grad.addColorStop(0, '#fff');
          grad.addColorStop(0.3, categoryColor);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Draw Pulsing Nucleus in the center
      const pulseRadius = 16 + Math.sin(Date.now() * 0.005) * 2;
      const nucGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      nucGrad.addColorStop(0, '#fff');
      nucGrad.addColorStop(0.2, categoryColor);
      nucGrad.addColorStop(0.8, 'rgba(10, 10, 20, 0.6)');
      nucGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = nucGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Symbol text in center
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px var(--font-title)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, centerX, centerY);

      // Telemetry Shell Data Labels (rendered inside canvas)
      ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
      ctx.font = '9px var(--font-mono)';
      ctx.textAlign = 'left';
      ctx.fillText(`SHELLS: [${shells.join(', ')}]`, 15, height - 15);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [shells, categoryColor, symbol]);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: {
      width: '100%',
      height: '100%',
      display: 'block',
      maxHeight: '350px'
    }
  });
};
