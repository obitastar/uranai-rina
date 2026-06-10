"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  phase: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 金系カラーパレット
    const goldColors = [
      "rgba(212, 160, 23,",
      "rgba(249, 219, 102,",
      "rgba(251, 231, 153,",
      "rgba(166, 124, 17,",
      "rgba(200, 180, 140,",
    ];

    // 星
    const stars: Star[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
    }));

    // 流れ星
    const shootingStars: ShootingStar[] = [];
    let shootingTimer = 0;

    // ゆらめくパーティクル
    const particles: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.15 + 0.05,
      life: Math.random() * 500,
      maxLife: 500 + Math.random() * 300,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // 星
      for (const star of stars) {
        const flicker = Math.sin(time * 0.001 * star.speed + star.phase) * 0.4 + 0.6;
        const a = star.opacity * flicker;

        // 大きい星はグロー付き
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color} ${a * 0.1})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color} ${a})`;
        ctx.fill();
      }

      // 流れ星の発生
      shootingTimer += 16;
      if (shootingTimer > 3000 + Math.random() * 5000) {
        shootingTimer = 0;
        shootingStars.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.3,
          length: 80 + Math.random() * 120,
          speed: 4 + Math.random() * 4,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
          opacity: 0.8,
          life: 0,
          maxLife: 60,
        });
      }

      // 流れ星の描画
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        const progress = s.life / s.maxLife;
        s.opacity = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        grad.addColorStop(0, `rgba(249, 219, 102, ${s.opacity * 0.9})`);
        grad.addColorStop(0.3, `rgba(212, 160, 23, ${s.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(212, 160, 23, 0)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 先端のグロー
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 200, ${s.opacity * 0.8})`;
        ctx.fill();

        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }

      // ゆらめくパーティクル
      for (const p of particles) {
        p.life++;
        p.x += p.vx + Math.sin(time * 0.001 + p.phase) * 0.2;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        const a = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 160, 23, ${p.opacity * a})`;
        ctx.fill();

        // リセット
        if (p.life >= p.maxLife || p.y < -10) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.life = 0;
          p.maxLife = 500 + Math.random() * 300;
          p.opacity = Math.random() * 0.15 + 0.05;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
