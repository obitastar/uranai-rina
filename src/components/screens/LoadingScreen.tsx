"use client";

import { useState, useEffect, useRef } from "react";

const MESSAGES = [
  "星の配置を読んでいます",
  "運命の流れを辿っています",
  "あなたの星を見つけました",
];

const BAGUA = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((prev) => Math.min(prev + 1, MESSAGES.length - 1));
    }, 800);
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(prev + 2, 100);
      });
    }, 40);
    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const size = isMobile ? 200 : 300;
    const w = canvas.width = size;
    const h = canvas.height = size;
    const cx = w / 2, cy = h / 2;

    const particleCount = isMobile ? 20 : 40;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (Math.PI * 2 * i) / particleCount + Math.random() * 0.3,
      radius: 80 + Math.random() * 30,
      size: 1 + Math.random() * 1.5,
      speed: 0.008 + Math.random() * 0.012,
      opacity: 0.3 + Math.random() * 0.5,
    }));

    let lastDraw = 0;
    const frameInterval = isMobile ? 33 : 16;

    const draw = (time: number) => {
      if (time - lastDraw < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      ctx.clearRect(0, 0, w, h);

      // 中央のグロー（進行に応じて大きく）
      const glowProgress = progress / 100;
      const glowSize = 15 + glowProgress * 25;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
      gradient.addColorStop(0, `rgba(249, 219, 102, ${0.2 + glowProgress * 0.3})`);
      gradient.addColorStop(1, "rgba(249, 219, 102, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // パーティクル（中央に集まる）
      const targetRadius = 80 - glowProgress * 60;
      for (const p of particles) {
        p.radius += (targetRadius + Math.sin(time * 0.001 + p.angle) * 10 - p.radius) * 0.03;
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        const flicker = Math.sin(time * 0.003 + p.angle) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 219, 102, ${p.opacity * flicker})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [isMobile, progress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="flex flex-col items-center gap-5 sm:gap-6">
        <div className="relative w-52 h-52 sm:w-72 sm:h-72 flex items-center justify-center">
          <div className="absolute w-52 h-52 sm:w-72 sm:h-72 animate-slow-spin">
            {BAGUA.map((symbol, i) => {
              const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
              return (
                <span
                  key={i}
                  className="absolute text-xl sm:text-2xl text-gold-500/40"
                  style={{
                    left: `${50 + Math.cos(angle) * 42}%`,
                    top: `${50 + Math.sin(angle) * 42}%`,
                    transform: "translate(-50%, -50%)",
                    animation: `shimmer 2s ease-in-out ${i * 0.25}s infinite`,
                  }}
                >
                  {symbol}
                </span>
              );
            })}
          </div>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div className="relative z-10 text-center">
            <span className="text-3xl sm:text-4xl font-black text-gold-gradient-animated">
              占
            </span>
          </div>
        </div>

        <div className="text-center space-y-3 sm:space-y-4 min-w-[240px] sm:min-w-[280px]">
          <p key={messageIndex} className="text-gold-400/90 text-base sm:text-lg tracking-[0.15em] animate-fade-in">
            {MESSAGES[messageIndex]}...
          </p>
          <div className="relative w-40 sm:w-48 h-[2px] mx-auto bg-navy-800 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 rounded-full transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
