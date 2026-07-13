export class ParticleEngine {
  private static instance: ParticleEngine;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: any[] = [];
  private animationFrameId: number = 0;
  private isRunning: boolean = false;

  private constructor() {
    this.createCanvas();
  }

  public stop() {
    cancelAnimationFrame(this.animationFrameId);
    this.isRunning = false;
  }

  public static getInstance(): ParticleEngine {
    if (!ParticleEngine.instance) {
      ParticleEngine.instance = new ParticleEngine();
    }
    return ParticleEngine.instance;
  }

  private createCanvas() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'angie-particle-engine';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  private resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    this.canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
  }

  public fireFusionSuccess(x?: number, y?: number) {
    if (!this.canvas) return;
    const originX = x ?? window.innerWidth / 2;
    const originY = y ?? window.innerHeight / 2;

    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      this.particles.push({
        x: originX * (window.devicePixelRatio || 1),
        y: originY * (window.devicePixelRatio || 1),
        vx: Math.cos(angle) * speed * (window.devicePixelRatio || 1),
        vy: Math.sin(angle) * speed * (window.devicePixelRatio || 1),
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        color: ['#00f3ff', '#ff007f', '#39ff14'][Math.floor(Math.random() * 3)],
        size: Math.random() * 4 + 2
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }
  
  public fireReactionExplosion(x?: number, y?: number) {
    if (!this.canvas) return;
    const originX = x ?? window.innerWidth / 2;
    const originY = y ?? window.innerHeight / 2;

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.particles.push({
        x: originX * (window.devicePixelRatio || 1),
        y: originY * (window.devicePixelRatio || 1),
        vx: Math.cos(angle) * speed * (window.devicePixelRatio || 1),
        vy: Math.sin(angle) * speed * (window.devicePixelRatio || 1),
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        color: ['#ff3300', '#ffcc00', '#ffffff'][Math.floor(Math.random() * 3)],
        size: Math.random() * 6 + 3
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  private loop() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    let activeParticles = false;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.vy += 0.1 * (window.devicePixelRatio || 1); // Gravity

      if (p.life > 0) {
        activeParticles = true;
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.particles.splice(i, 1);
      }
    }

    this.ctx.globalAlpha = 1.0;

    if (activeParticles) {
      this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    } else {
      this.isRunning = false;
    }
  }
}
