export interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isHovered: boolean;
}

export class CelestialParticle {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  radius = 0;
  baseAlpha = 0;
  alpha = 0;
  pulseSpeed = 0;
  pulse = 0;
  isGold = false;

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  reset(width: number, height: number): void {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45 - 0.15;
    this.radius = Math.random() * 2 + 0.8;
    this.baseAlpha = Math.random() * 0.6 + 0.2;
    this.alpha = this.baseAlpha;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
    this.pulse = Math.random() * Math.PI * 2;
    this.isGold = Math.random() > 0.45;
  }

  update(width: number, height: number, mouse: MouseState): void {
    this.pulse += this.pulseSpeed;
    this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.2;
    this.applyMouseForce(mouse);
    this.x += this.vx;
    this.y += this.vy;
    this.wrapBounds(width, height);
  }

  private applyMouseForce(mouse: MouseState): void {
    if (!mouse.isHovered) return;
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 140 && dist > 0) {
      const force = (140 - dist) / 140;
      this.x -= (dx / dist) * force * 1.5;
      this.y -= (dy / dist) * force * 1.5;
    }
  }

  private wrapBounds(width: number, height: number): void {
    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
    if (this.y < -20) this.y = height + 20;
    if (this.y > height + 20) this.y = -20;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isGold
      ? `rgba(212, 175, 55, ${Math.max(0, this.alpha).toString()})`
      : `rgba(0, 210, 196, ${Math.max(0, this.alpha).toString()})`;
    ctx.fill();
  }
}

function drawStarSquares(ctx: CanvasRenderingContext2D, currentR: number): void {
  for (let k = 0; k < 2; k++) {
    ctx.save();
    ctx.rotate((k * Math.PI) / 4);
    const halfSide = currentR * 0.72;
    ctx.beginPath();
    ctx.rect(-halfSide / 2, -halfSide / 2, halfSide, halfSide);
    ctx.stroke();
    ctx.restore();
  }
}

function drawCirclesAndRays(ctx: CanvasRenderingContext2D, currentR: number): void {
  ctx.beginPath();
  ctx.arc(0, 0, currentR, 0, Math.PI * 2);
  ctx.setLineDash([6, 8]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(0, 0, currentR * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (currentR * 0.5), Math.sin(a) * (currentR * 0.5));
    ctx.lineTo(Math.cos(a) * currentR, Math.sin(a) * currentR);
    ctx.stroke();
  }
}

export class IslamicGeometryRing {
  x: number;
  y: number;
  radius: number;
  angle = Math.random() * Math.PI * 2;
  rotationSpeed: number;
  strokeColor: string;
  lineWidth: number;
  pulse = Math.random() * Math.PI;

  constructor(
    x: number,
    y: number,
    radius: number,
    rotationSpeed: number,
    strokeColor: string,
    lineWidth: number,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotationSpeed = rotationSpeed;
    this.strokeColor = strokeColor;
    this.lineWidth = lineWidth;
  }

  update(): void {
    this.angle += this.rotationSpeed;
    this.pulse += 0.008;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    const currentR = this.radius + Math.sin(this.pulse) * 4;
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.lineWidth;
    drawStarSquares(ctx, currentR);
    drawCirclesAndRays(ctx, currentR);
    ctx.restore();
  }
}

function drawLink(
  ctx: CanvasRenderingContext2D,
  p1: CelestialParticle,
  p2: CelestialParticle,
  maxDist: number,
): void {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= maxDist) return;
  const alpha = (1 - dist / maxDist) * 0.15;
  ctx.strokeStyle = `rgba(212, 175, 55, ${alpha.toString()})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

export function drawParticleLinks(
  ctx: CanvasRenderingContext2D,
  particles: readonly CelestialParticle[],
): void {
  const maxDist = 95;
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    if (p1 === undefined) continue;
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      if (p2 !== undefined) drawLink(ctx, p1, p2, maxDist);
    }
  }
}

export function drawMouseLinks(
  ctx: CanvasRenderingContext2D,
  particles: readonly CelestialParticle[],
  mouse: MouseState,
): void {
  if (!mouse.isHovered) return;
  for (const p of particles) {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const alpha = (1 - dist / 120) * 0.25;
      ctx.strokeStyle = `rgba(0, 210, 196, ${alpha.toString()})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }
}
