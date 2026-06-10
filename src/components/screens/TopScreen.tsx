"use client";

import { useState, useEffect, useRef } from "react";

interface TopScreenProps {
  onStart: () => void;
}

// 八卦の記号
const BAGUA = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
// 天干
const JIKKAN_CHARS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

export function TopScreen({ onStart }: TopScreenProps) {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 背景パーティクル
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; decay: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 初期パーティクル
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        decay: Math.random() * 0.002 + 0.001,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < -10) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.alpha = Math.random() * 0.5 + 0.1;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = -Math.random() * 0.4 - 0.1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 160, 23, ${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center overflow-hidden">
      {/* 背景パーティクル */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* 背景の光彩 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-navy-400/[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* メイン：八卦曼荼羅 */}
        <div className={`relative ${mounted ? 'animate-fade-in-scale' : 'opacity-0'}`}>
          {/* 最外周の光輪 */}
          <div className="absolute inset-0 rounded-full bg-gold-500/[0.06] blur-[100px] scale-[2.5]" />

          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* 外側リング：八卦 */}
            <svg viewBox="0 0 320 320" className="absolute w-[360px] h-[360px] md:w-[400px] md:h-[400px] animate-slow-spin">
              <defs>
                <linearGradient id="topRing1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbe799" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#d4a017" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#fbe799" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <circle cx="160" cy="160" r="150" fill="none" stroke="url(#topRing1)" strokeWidth="0.5" />
              {BAGUA.map((symbol, i) => {
                const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
                const x = 160 + Math.cos(angle) * 150;
                const y = 160 + Math.sin(angle) * 150;
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#d4a017"
                    opacity="0.5"
                    fontSize="14"
                    fontFamily="serif"
                  >
                    {symbol}
                  </text>
                );
              })}
            </svg>

            {/* 中間リング：天干 */}
            <svg viewBox="0 0 280 280" className="absolute w-[310px] h-[310px] md:w-[340px] md:h-[340px] animate-slow-spin-reverse">
              <circle cx="140" cy="140" r="120" fill="none" stroke="#d4a017" strokeWidth="0.3" strokeDasharray="2 6" opacity="0.3" />
              {JIKKAN_CHARS.map((char, i) => {
                const angle = (i * Math.PI * 2) / 10 - Math.PI / 2;
                const x = 140 + Math.cos(angle) * 120;
                const y = 140 + Math.sin(angle) * 120;
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#f9db66"
                    opacity="0.3"
                    fontSize="11"
                    fontFamily="serif"
                  >
                    {char}
                  </text>
                );
              })}
            </svg>

            {/* 内側リング：装飾 */}
            <svg viewBox="0 0 240 240" className="absolute w-64 h-64 md:w-72 md:h-72 animate-slow-spin" style={{ animationDuration: '30s' }}>
              <defs>
                <linearGradient id="topRing3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbe799" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#d4a017" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fbe799" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <circle cx="120" cy="120" r="90" fill="none" stroke="url(#topRing3)" strokeWidth="0.6" strokeDasharray="4 12" />
              {/* 四隅の菱形装飾 */}
              {[0, 1, 2, 3].map(i => {
                const angle = (i * Math.PI * 2) / 4 - Math.PI / 4;
                const x = 120 + Math.cos(angle) * 90;
                const y = 120 + Math.sin(angle) * 90;
                return (
                  <g key={i} transform={`translate(${x},${y}) rotate(${i * 90 + 45})`}>
                    <path d="M0,-5 L3,0 L0,5 L-3,0 Z" fill="#d4a017" opacity="0.5" />
                  </g>
                );
              })}
            </svg>

            {/* 最内周リング */}
            <svg viewBox="0 0 200 200" className="absolute w-52 h-52 md:w-56 md:h-56">
              <circle cx="100" cy="100" r="65" fill="none" stroke="#d4a017" strokeWidth="0.4" opacity="0.25" />
              <circle cx="100" cy="100" r="50" fill="none" stroke="#d4a017" strokeWidth="0.2" opacity="0.15" />
            </svg>

            {/* 中央の陰陽太極図 */}
            <div className="absolute flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-28 md:h-28 animate-float" style={{ filter: 'drop-shadow(0 0 20px rgba(212, 160, 23, 0.3))' }}>
                <defs>
                  <linearGradient id="yinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbe799" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#d4a017" stopOpacity="0.7" />
                  </linearGradient>
                  <clipPath id="yinClip">
                    <circle cx="50" cy="50" r="38" />
                  </clipPath>
                </defs>
                {/* 外枠 */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#d4a017" strokeWidth="0.8" opacity="0.5" />
                {/* 陰陽図 */}
                <g clipPath="url(#yinClip)">
                  {/* 陽（金色半分） */}
                  <path d="M50,12 A38,38 0 0,1 50,88 A19,19 0 0,0 50,50 A19,19 0 0,1 50,12" fill="url(#yinGrad)" />
                  {/* 陰（暗い半分） */}
                  <path d="M50,12 A38,38 0 0,0 50,88 A19,19 0 0,1 50,50 A19,19 0 0,0 50,12" fill="#0a0d1c" stroke="#d4a017" strokeWidth="0.3" />
                  {/* 陽中の陰 */}
                  <circle cx="50" cy="31" r="5" fill="#0a0d1c" />
                  {/* 陰中の陽 */}
                  <circle cx="50" cy="69" r="5" fill="url(#yinGrad)" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* タイトル */}
        <div className="space-y-4">
          <div className={`${mounted ? 'animate-fade-in-up stagger-2 opacity-0' : 'opacity-0'}`}>
            <p className="text-xs text-gold-500/40 tracking-[0.5em] mb-3 font-medium">FORTUNE TELLING</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-[0.5em] text-gold-gradient-animated leading-tight">
              四柱推命
            </h1>
          </div>
          <div className={`${mounted ? 'animate-fade-in-up stagger-3 opacity-0' : 'opacity-0'}`}>
            <p className="text-xl text-navy-100/60 tracking-[0.4em] font-medium">
              運 命 鑑 定
            </p>
          </div>
          <div className={`w-40 h-px mx-auto animate-glow-line ${mounted ? 'animate-fade-in stagger-3 opacity-0' : 'opacity-0'}`} />
          <p className={`text-sm text-navy-300/50 leading-[2.2] max-w-sm mx-auto tracking-wider ${mounted ? 'animate-fade-in-up stagger-4 opacity-0' : 'opacity-0'}`}>
            天の理に基づき、生年月日と出生時刻から<br />
            あなたの本質・恋愛・仕事・運勢を読み解く
          </p>
        </div>

        {/* 開始ボタン */}
        <button
          onClick={onStart}
          className={`group relative mt-4 ${mounted ? 'animate-fade-in-up stagger-5 opacity-0' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 rounded-full bg-gold-500/15 blur-2xl group-hover:bg-gold-500/30 group-hover:blur-3xl transition-all duration-700" />
          <div className="relative ornament-border rounded-full px-16 py-5 bg-navy-900/50 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-500 animate-breathe">
            <span className="text-xl tracking-[0.35em] text-gold-gradient-animated font-bold">
              鑑定を始める
            </span>
          </div>
        </button>

        {/* 下部の装飾テキスト */}
        <div className={`mt-2 ${mounted ? 'animate-fade-in stagger-6 opacity-0' : 'opacity-0'}`}>
          <p className="text-[0.6rem] text-navy-500/40 tracking-[0.3em]">
            年柱 ・ 月柱 ・ 日柱 ・ 時柱
          </p>
        </div>
      </div>
    </div>
  );
}
