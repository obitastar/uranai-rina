"use client";

import { useEffect, useRef, useState } from "react";

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

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

    const goldColors = [
      "rgba(212, 160, 23,",
      "rgba(249, 219, 102,",
      "rgba(251, 231, 153,",
    ];

    // スマホは星を減らす
    const starCount = isMobile ? 50 : 120;
    const particleCount = isMobile ? 10 : 30;

    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * (w || 400),
      y: Math.random() * (h || 800),
      size: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
    }));

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (w || 400),
      y: Math.random() * (h || 800),
      vx: (Math.random() - 0.5) * 0.2,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.12 + 0.03,
      life: Math.random() * 500,
      maxLife: 500 + Math.random() * 300,
      phase: Math.random() * Math.PI * 2,
    }));

    // スマホは流れ星を無効化
    let shootingTimer = 0;
    interface ShootingStar { x: number; y: number; length: number; speed: number; angle: number; opacity: number; life: number; maxLife: number; }
    const shootingStars: ShootingStar[] = [];

    // スマホはフレームレートを間引く
    let lastDraw = 0;
    const frameInterval = isMobile ? 33 : 16; // スマホ: 30fps, PC: 60fps

    const draw = (time: number) => {
      if (time - lastDraw < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;

      ctx.clearRect(0, 0, w, h);

      // 星
      for (const star of stars) {
        const flicker = Math.sin(time * 0.001 * star.speed + star.phase) * 0.4 + 0.6;
        const a = star.opacity * flicker;

        if (star.size > 1.2 && !isMobile) {
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

      // 流れ星（PCのみ）
      if (!isMobile) {
        shootingTimer += 16;
        if (shootingTimer > 4000 + Math.random() * 5000) {
          shootingTimer = 0;
          shootingStars.push({
            x: Math.random() * w * 0.8,
            y: Math.random() * h * 0.3,
            length: 80 + Math.random() * 100,
            speed: 4 + Math.random() * 3,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            opacity: 0.8,
            life: 0,
            maxLife: 60,
          });
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.life++;
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          const progress = s.life / s.maxLife;
          s.opacity = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

          const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
          grad.addColorStop(0, `rgba(249, 219, 102, ${s.opacity * 0.9})`);
          grad.addColorStop(0.3, `rgba(212, 160, 23, ${s.opacity * 0.4})`);
          grad.addColorStop(1, `rgba(212, 160, 23, 0)`);

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 240, 200, ${s.opacity * 0.8})`;
          ctx.fill();

          if (s.life >= s.maxLife) shootingStars.splice(i, 1);
        }
      }

      // パーティクル
      for (const p of particles) {
        p.life++;
        p.x += p.vx + Math.sin(time * 0.001 + p.phase) * 0.15;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        const a = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 160, 23, ${p.opacity * a})`;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.life = 0;
          p.maxLife = 500 + Math.random() * 300;
          p.opacity = Math.random() * 0.12 + 0.03;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
