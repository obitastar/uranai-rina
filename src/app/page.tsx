"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { StarField } from "@/components/StarField";

const FLOATING_KANJI = ['命', '運', '星', '天', '地', '陰', '陽', '気', '魂', '道', '縁', '心'];

export default function TopPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 text-center bg-mystical min-h-screen overflow-hidden">
      <StarField />

      {/* 浮遊する漢字 */}
      {mounted && FLOATING_KANJI.map((kanji, i) => (
        <span
          key={i}
          className="fixed text-gold-500/[0.04] text-4xl font-bold pointer-events-none select-none"
          style={{
            left: `${8 + (i * 7.5) % 85}%`,
            top: `${10 + (i * 13) % 75}%`,
            animation: `float ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`,
          }}
        >
          {kanji}
        </span>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-14">
        {/* 装飾的な多重円 */}
        <div className={`relative ${mounted ? 'animate-fade-in-scale' : 'opacity-0'}`}>
          <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-[80px] scale-[2]" />
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* 外側の装飾リング */}
            <svg viewBox="0 0 240 240" className="absolute w-72 h-72 animate-slow-spin">
              <defs>
                <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbe799" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#d4a017" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fbe799" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <circle cx="120" cy="120" r="110" fill="none" stroke="url(#goldGrad1)" strokeWidth="0.5" strokeDasharray="3 9" />
              {/* 八方位の点 */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
                const x = 120 + Math.cos(angle) * 110;
                const y = 120 + Math.sin(angle) * 110;
                return <circle key={i} cx={x} cy={y} r="2" fill="#d4a017" opacity="0.6" />;
              })}
            </svg>

            {/* 中間リング - 逆回転 */}
            <svg viewBox="0 0 200 200" className="absolute w-60 h-60 animate-slow-spin-reverse">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#d4a017" strokeWidth="0.3" strokeDasharray="1 5" opacity="0.5" />
              {/* 十二支の位置にドット */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 85;
                const y = 100 + Math.sin(angle) * 85;
                return <circle key={i} cx={x} cy={y} r="1.2" fill="#f9db66" opacity="0.4" />;
              })}
            </svg>

            {/* 内側のリング */}
            <svg viewBox="0 0 200 200" className="w-full h-full animate-slow-spin">
              <defs>
                <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f9db66" />
                  <stop offset="50%" stopColor="#d4a017" />
                  <stop offset="100%" stopColor="#f9db66" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="70" fill="none" stroke="url(#goldGrad2)" strokeWidth="0.8" strokeDasharray="6 8" />
              <circle cx="100" cy="100" r="55" fill="none" stroke="#d4a017" strokeWidth="0.3" opacity="0.4" />
            </svg>

            {/* 中央の「命」 */}
            <span className="absolute text-7xl text-gold-gradient-animated font-black animate-float drop-shadow-[0_0_30px_rgba(212,160,23,0.3)]">
              命
            </span>
          </div>
        </div>

        {/* タイトル */}
        <div className="space-y-5">
          <h1
            className={`text-5xl md:text-6xl font-black tracking-[0.4em] text-gold-gradient-animated ${
              mounted ? 'animate-fade-in-up stagger-2 opacity-0' : 'opacity-0'
            }`}
          >
            四柱推命
          </h1>
          <p
            className={`text-xl text-navy-200/80 tracking-[0.3em] font-medium ${
              mounted ? 'animate-fade-in-up stagger-3 opacity-0' : 'opacity-0'
            }`}
          >
            運 命 鑑 定
          </p>
          <div
            className={`w-32 h-px mx-auto animate-glow-line ${
              mounted ? 'animate-fade-in stagger-3 opacity-0' : 'opacity-0'
            }`}
          />
          <p
            className={`text-sm text-navy-300/70 leading-loose max-w-xs mx-auto tracking-wider ${
              mounted ? 'animate-fade-in-up stagger-4 opacity-0' : 'opacity-0'
            }`}
          >
            生年月日と出生時刻から<br />
            あなたの本質・恋愛・仕事・運勢を<br />
            読み解きます
          </p>
        </div>

        {/* 開始ボタン */}
        <button
          onClick={() => router.push("/input")}
          className={`group relative mt-2 ${
            mounted ? 'animate-fade-in-up stagger-5 opacity-0' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-2xl group-hover:bg-gold-500/40 group-hover:blur-3xl transition-all duration-700" />
          <div className="relative ornament-border rounded-full px-16 py-5 bg-navy-900/60 backdrop-blur-sm hover:bg-navy-800/60 transition-all duration-500 animate-breathe">
            <span className="text-xl tracking-[0.3em] text-gold-gradient-animated font-bold">
              鑑定を始める
            </span>
          </div>
        </button>
      </div>
    </main>
  );
}
