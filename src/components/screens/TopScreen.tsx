"use client";

import { useState, useEffect } from "react";

interface TopScreenProps {
  onStart: () => void;
}

// 八卦の記号
const BAGUA = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

export function TopScreen({ onStart }: TopScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-8 sm:py-12 text-center overflow-hidden">
      {/* 静的な背景グロー（CSSのみ） */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold-500/[0.03] blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-10">
        {/* メイン：八卦曼荼羅 - 簡略版 */}
        <div className={`relative ${mounted ? 'animate-fade-in-scale' : 'opacity-0'}`}>
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* 八卦リング（1つだけ回転） */}
            <svg viewBox="0 0 320 320" className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] animate-slow-spin">
              <circle cx="160" cy="160" r="145" fill="none" stroke="rgba(212,160,23,0.2)" strokeWidth="0.5" />
              {BAGUA.map((symbol, i) => {
                const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
                const x = 160 + Math.cos(angle) * 145;
                const y = 160 + Math.sin(angle) * 145;
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#d4a017"
                    opacity="0.4"
                    fontSize="14"
                    fontFamily="serif"
                  >
                    {symbol}
                  </text>
                );
              })}
            </svg>

            {/* 内側の静的リング */}
            <svg viewBox="0 0 200 200" className="absolute w-48 h-48 sm:w-52 sm:h-52">
              <circle cx="100" cy="100" r="65" fill="none" stroke="#d4a017" strokeWidth="0.3" opacity="0.2" />
            </svg>

            {/* 中央の陰陽太極図 */}
            <div className="absolute flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24">
                <defs>
                  <linearGradient id="yinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbe799" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#d4a017" stopOpacity="0.7" />
                  </linearGradient>
                  <clipPath id="yinClip">
                    <circle cx="50" cy="50" r="38" />
                  </clipPath>
                </defs>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#d4a017" strokeWidth="0.8" opacity="0.5" />
                <g clipPath="url(#yinClip)">
                  <path d="M50,12 A38,38 0 0,1 50,88 A19,19 0 0,0 50,50 A19,19 0 0,1 50,12" fill="url(#yinGrad)" />
                  <path d="M50,12 A38,38 0 0,0 50,88 A19,19 0 0,1 50,50 A19,19 0 0,0 50,12" fill="#0a0d1c" stroke="#d4a017" strokeWidth="0.3" />
                  <circle cx="50" cy="31" r="5" fill="#0a0d1c" />
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
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.3em] sm:tracking-[0.5em] text-gold-gradient leading-tight">
              四柱推命
            </h1>
          </div>
          <div className={`${mounted ? 'animate-fade-in-up stagger-3 opacity-0' : 'opacity-0'}`}>
            <p className="text-base sm:text-xl text-navy-100/60 tracking-[0.3em] sm:tracking-[0.4em] font-medium">
              運 命 鑑 定
            </p>
          </div>
          <div className={`w-24 sm:w-40 h-px mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent ${mounted ? 'animate-fade-in stagger-3 opacity-0' : 'opacity-0'}`} />
          <p className={`text-xs sm:text-sm text-navy-300/50 leading-[2] sm:leading-[2.2] max-w-sm mx-auto tracking-wider ${mounted ? 'animate-fade-in-up stagger-4 opacity-0' : 'opacity-0'}`}>
            天の理に基づき、生年月日と出生時刻から<br />
            あなたの本質・恋愛・仕事・運勢を読み解く
          </p>
        </div>

        {/* 開始ボタン */}
        <button
          onClick={onStart}
          className={`group relative mt-4 ${mounted ? 'animate-fade-in-up stagger-5 opacity-0' : 'opacity-0'}`}
        >
          <div className="relative ornament-border rounded-full px-10 sm:px-16 py-4 sm:py-5 bg-navy-900/50 active:bg-navy-800/60">
            <span className="text-base sm:text-xl tracking-[0.25em] sm:tracking-[0.35em] text-gold-gradient font-bold">
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
