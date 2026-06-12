"use client";

import { useState, useEffect } from "react";
import type { DivinationType } from "@/lib/types";

interface TopScreenProps {
  onSelect: (type: DivinationType) => void;
}

// 八卦の記号
const BAGUA = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

export function TopScreen({ onSelect }: TopScreenProps) {
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
        {/* メイン：八卦曼荼羅 */}
        <div className={`relative ${mounted ? 'animate-fade-in-scale' : 'opacity-0'}`}>
          <div className="relative w-40 h-40 sm:w-60 sm:h-60 flex items-center justify-center">
            {/* 外側の八卦リング（ゆっくり回転） */}
            <svg viewBox="0 0 320 320" className="absolute w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] animate-slow-spin">
              <circle cx="160" cy="160" r="150" fill="none" stroke="rgba(212,160,23,0.15)" strokeWidth="0.5" strokeDasharray="4 8" />
              <circle cx="160" cy="160" r="145" fill="none" stroke="rgba(212,160,23,0.25)" strokeWidth="0.5" />
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
                    opacity="0.5"
                    fontSize="15"
                    fontFamily="serif"
                  >
                    {symbol}
                  </text>
                );
              })}
            </svg>

            {/* 中間リング（逆回転） */}
            <svg viewBox="0 0 240 240" className="absolute w-[150px] h-[150px] sm:w-[220px] sm:h-[220px]" style={{ animation: 'slowSpin 30s linear infinite reverse' }}>
              <circle cx="120" cy="120" r="105" fill="none" stroke="rgba(212,160,23,0.12)" strokeWidth="0.8" strokeDasharray="2 6" />
              {/* 十二支の記号（小さく配置） */}
              {['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'].map((shi, i) => {
                const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
                const x = 120 + Math.cos(angle) * 105;
                const y = 120 + Math.sin(angle) * 105;
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#d4a017"
                    opacity="0.25"
                    fontSize="9"
                    fontFamily="serif"
                  >
                    {shi}
                  </text>
                );
              })}
            </svg>

            {/* 内側グロー */}
            <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gold-500/[0.04] blur-[20px]" />

            {/* 中央の陰陽太極図（拡大・回転） */}
            <div className="absolute flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24" style={{ animation: 'slowSpin 25s linear infinite reverse' }}>
                <defs>
                  <linearGradient id="yinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbe799" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#d4a017" stopOpacity="0.8" />
                  </linearGradient>
                  <radialGradient id="yinGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fbe799" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#d4a017" stopOpacity="0" />
                  </radialGradient>
                  <clipPath id="yinClip">
                    <circle cx="50" cy="50" r="40" />
                  </clipPath>
                </defs>
                {/* グロー */}
                <circle cx="50" cy="50" r="48" fill="url(#yinGlow)" />
                {/* 外枠 */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.6" />
                {/* 陰陽 */}
                <g clipPath="url(#yinClip)">
                  <path d="M50,10 A40,40 0 0,1 50,90 A20,20 0 0,0 50,50 A20,20 0 0,1 50,10" fill="url(#yinGrad)" />
                  <path d="M50,10 A40,40 0 0,0 50,90 A20,20 0 0,1 50,50 A20,20 0 0,0 50,10" fill="#0a0d1c" />
                  <circle cx="50" cy="30" r="6" fill="#0a0d1c" />
                  <circle cx="50" cy="70" r="6" fill="url(#yinGrad)" />
                </g>
                {/* 外枠のキラリ */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="#fbe799" strokeWidth="0.3" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>

        {/* タイトル */}
        <div className="space-y-3">
          <div className={`${mounted ? 'animate-fade-in-up stagger-2 opacity-0' : 'opacity-0'}`}>
            <p className="text-xs text-gold-500/40 tracking-[0.5em] mb-2 font-medium">FORTUNE TELLING</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.3em] sm:tracking-[0.5em] text-gold-gradient leading-tight">
              運命鑑定
            </h1>
          </div>
          <div className={`${mounted ? 'animate-fade-in-up stagger-3 opacity-0' : 'opacity-0'}`}>
            <p className="text-sm sm:text-base text-navy-100/60 tracking-[0.2em] sm:tracking-[0.3em] font-medium">
              鑑定メニューを選択
            </p>
          </div>
          <div className={`w-24 sm:w-40 h-px mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent ${mounted ? 'animate-fade-in stagger-3 opacity-0' : 'opacity-0'}`} />
        </div>

        {/* 選択メニュー：2つのカード */}
        <div className={`w-full max-w-md space-y-4 sm:space-y-6 px-2 ${mounted ? 'animate-fade-in-up stagger-4 opacity-0' : 'opacity-0'}`}>
          {/* 四柱推命カード */}
          <button
            onClick={() => onSelect("shichusuimei")}
            className="group w-full text-left"
          >
            <div className="relative ornament-border rounded-2xl bg-navy-900/50 p-5 sm:p-7 active:bg-navy-800/60 transition-colors duration-150">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* アイコン */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gold-500/10 border border-gold-500/20">
                  <svg viewBox="0 0 40 40" className="w-7 h-7 sm:w-8 sm:h-8">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.6" />
                    <text x="20" y="21" textAnchor="middle" dominantBaseline="central" fill="#d4a017" fontSize="12" fontFamily="serif">命</text>
                  </svg>
                </div>
                {/* テキスト */}
                <div className="flex-1 space-y-2">
                  <ruby className="text-xl sm:text-2xl font-bold text-gold-gradient">
                    四柱推命<rp>(</rp><rt className="text-xs text-gold-300/70">しちゅうすいめい</rt><rp>)</rp>
                  </ruby>
                  <p className="text-xs sm:text-sm text-navy-300/60 leading-relaxed tracking-wider">
                    生年月日から<ruby className="text-navy-300/60">命式<rp>(</rp><rt className="text-[0.6rem] text-navy-400/50">めいしき</rt><rp>)</rp></ruby>を導き、あなたの本質・運勢を読み解きます
                  </p>
                </div>
                {/* 矢印 */}
                <div className="flex-shrink-0 flex items-center h-12 sm:h-14">
                  <span className="text-gold-500/40 text-lg group-hover:text-gold-400/70 transition-colors">›</span>
                </div>
              </div>
            </div>
          </button>

          {/* 姓名判断カード */}
          <button
            onClick={() => onSelect("seimei")}
            className="group w-full text-left"
          >
            <div className="relative ornament-border rounded-2xl bg-navy-900/50 p-5 sm:p-7 active:bg-navy-800/60 transition-colors duration-150">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* アイコン */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gold-500/10 border border-gold-500/20">
                  <svg viewBox="0 0 40 40" className="w-7 h-7 sm:w-8 sm:h-8">
                    <rect x="8" y="8" width="24" height="24" rx="3" fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.6" />
                    <text x="20" y="21" textAnchor="middle" dominantBaseline="central" fill="#d4a017" fontSize="12" fontFamily="serif">名</text>
                  </svg>
                </div>
                {/* テキスト */}
                <div className="flex-1 space-y-2">
                  <ruby className="text-xl sm:text-2xl font-bold text-gold-gradient">
                    姓名判断<rp>(</rp><rt className="text-xs text-gold-300/70">せいめいはんだん</rt><rp>)</rp>
                  </ruby>
                  <p className="text-xs sm:text-sm text-navy-300/60 leading-relaxed tracking-wider">
                    お名前の画数から<ruby className="text-navy-300/60">五格<rp>(</rp><rt className="text-[0.6rem] text-navy-400/50">ごかく</rt><rp>)</rp></ruby>と<ruby className="text-navy-300/60">三才<rp>(</rp><rt className="text-[0.6rem] text-navy-400/50">さんさい</rt><rp>)</rp></ruby>を読み解きます
                  </p>
                </div>
                {/* 矢印 */}
                <div className="flex-shrink-0 flex items-center h-12 sm:h-14">
                  <span className="text-gold-500/40 text-lg group-hover:text-gold-400/70 transition-colors">›</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* 下部の装飾テキスト */}
        <div className={`mt-2 ${mounted ? 'animate-fade-in stagger-6 opacity-0' : 'opacity-0'}`}>
          <p className="text-[0.6rem] text-navy-500/40 tracking-[0.3em]">
            天 ・ 地 ・ 人 ・ 外 ・ 総
          </p>
        </div>
      </div>
    </div>
  );
}
