import { useEffect, useRef } from 'react';
import {
  CelestialParticle,
  drawMouseLinks,
  drawParticleLinks,
  IslamicGeometryRing,
  type MouseState,
} from './celestial-canvas';

function initRings(width: number, height: number): IslamicGeometryRing[] {
  return [
    new IslamicGeometryRing(
      width * 0.12,
      height * 0.28,
      120,
      0.0012,
      'rgba(212, 175, 55, 0.12)',
      1.2,
    ),
    new IslamicGeometryRing(
      width * 0.88,
      height * 0.35,
      140,
      -0.0009,
      'rgba(0, 210, 196, 0.1)',
      1.2,
    ),
    new IslamicGeometryRing(
      width * 0.5,
      height * 0.82,
      160,
      0.0007,
      'rgba(212, 175, 55, 0.08)',
      1.4,
    ),
  ];
}

function initParticles(width: number, height: number): CelestialParticle[] {
  const count = Math.floor(Math.min(width, 1400) / 18);
  const result: CelestialParticle[] = [];
  for (let i = 0; i < count; i++) {
    result.push(new CelestialParticle(width, height));
  }
  return result;
}

export function CelestialBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = initParticles(width, height);
    let rings = initRings(width, height);

    const mouse: MouseState = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = initParticles(width, height);
      rings = initRings(width, height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId = 0;
    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      ctx.clearRect(0, 0, width, height);

      for (const ring of rings) {
        ring.update();
        ring.draw(ctx);
      }

      drawParticleLinks(ctx, particles);
      drawMouseLinks(ctx, particles, mouse);

      for (const p of particles) {
        p.update(width, height, mouse);
        p.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <canvas ref={canvasRef} className="fixed inset-0 size-full pointer-events-none" />
      <div className="ambient-layer pointer-events-none fixed inset-0 opacity-70 dark:opacity-90" />
      <div className="islamic-pattern-overlay pointer-events-none fixed inset-0 opacity-[0.035]" />
    </div>
  );
}
