"use client";

import { useState, useEffect, useRef } from "react";

const MESSAGES = [
  "天の気を読み取っています",
  "四柱を立てています",
  "通変星を算出しています",
  "命式を解読しています",
  "運命の糸を紐解いています",
];

const BAGUA = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
const KANSHI_CHARS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'gathering' | 'calculating' | 'revealing'>('gathering');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((prev) => Math.min(prev + 1, MESSAGES.length - 1));
    }, 700);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // 非線形な進行（最初は速く、後半はゆっくり）
        const increment = prev < 40 ? 3 : prev < 70 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    const phaseTimers = [
      setTimeout(() => setPhase('calculating'), 1200),
      setTimeout(() => setPhase('revealing'), 2500),
    ];

    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
      phaseTimers.forEach(clearTimeout);
    };
  }, []);

  // パーティクル集約アニメーション
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const w = canvas.width = 300;
    const h = canvas.height = 300;
    const cx = w / 2, cy = h / 2;

    interface LoadParticle {
      angle: number;
      radius: number;
      targetRadius: number;
      size: number;
      speed: number;
      opacity: number;
      char?: string;
    }

    const particles: LoadParticle[] = Array.from({ length: 40 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 40 + Math.random() * 0.3,
      radius: 100 + Math.random() * 50,
      targetRadius: 100 + Math.random() * 50,
      size: 1 + Math.random() * 2,
      speed: 0.005 + Math.random() * 0.01,
      opacity: 0.3 + Math.random() * 0.5,
      char: i < 10 ? KANSHI_CHARS[i] : undefined,
    }));

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // フェーズに応じてパーティクルの目標半径を変える
      const phaseRadius = phase === 'gathering' ? 120 : phase === 'calculating' ? 60 : 20;

      for (const p of particles) {
        p.targetRadius = phaseRadius + Math.sin(time * 0.001 + p.angle) * 15;
        p.radius += (p.targetRadius - p.radius) * 0.02;
        p.angle += p.speed;

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        const flicker = Math.sin(time * 0.003 + p.angle) * 0.3 + 0.7;

        if (p.char && p.radius > 40) {
          ctx.font = `${10 + p.size * 2}px "Noto Serif JP", serif`;
          ctx.fillStyle = `rgba(212, 160, 23, ${p.opacity * flicker * 0.6})`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.char, x, y);
        } else {
          // グロー
          ctx.beginPath();
          ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 160, 23, ${p.opacity * flicker * 0.1})`;
          ctx.fill();
          // 本体
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249, 219, 102, ${p.opacity * flicker})`;
          ctx.fill();
        }
      }

      // 中央のグロー
      const glowSize = phase === 'revealing' ? 40 : 15;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
      gradient.addColorStop(0, `rgba(249, 219, 102, ${phase === 'revealing' ? 0.4 : 0.2})`);
      gradient.addColorStop(1, "rgba(249, 219, 102, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [phase]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 min-h-screen bg-mystical">
      <div className="flex flex-col items-center gap-6">
        {/* 八卦シンボルの回転リング */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* 外周の八卦 */}
          <div className="absolute w-72 h-72 animate-slow-spin">
            {BAGUA.map((symbol, i) => {
              const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
              const x = 50 + Math.cos(angle) * 42;
              const y = 50 + Math.sin(angle) * 42;
              return (
                <span
                  key={i}
                  className="absolute text-2xl text-gold-500/40"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    animation: `shimmer 2s ease-in-out ${i * 0.25}s infinite`,
                  }}
                >
                  {symbol}
                </span>
              );
            })}
          </div>

          {/* パーティクルCanvas */}
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="absolute inset-0 w-full h-full"
          />

          {/* 中央テキスト */}
          <div className="relative z-10 text-center">
            <span
              className={`text-4xl font-black text-gold-gradient-animated transition-all duration-1000 ${
                phase === 'revealing' ? 'scale-110 opacity-100' : 'scale-100 opacity-80'
              }`}
            >
              {phase === 'revealing' ? '命' : '占'}
            </span>
          </div>
        </div>

        {/* メッセージ */}
        <div className="text-center space-y-4 min-w-[280px]">
          <p
            key={messageIndex}
            className="text-gold-400/90 text-lg tracking-[0.15em] animate-fade-in"
          >
            {MESSAGES[messageIndex]}...
          </p>

          {/* プログレスバー */}
          <div className="relative w-48 h-[2px] mx-auto bg-navy-800 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 bg-gold-300/50 rounded-full blur-sm transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
