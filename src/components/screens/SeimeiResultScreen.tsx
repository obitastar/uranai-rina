"use client";

import { useState, useEffect } from "react";
import type { SeimeiResult } from "@/lib/seimei";

interface SeimeiResultScreenProps {
  result: SeimeiResult;
  onRetry: () => void;
  onTop: () => void;
}

export function SeimeiResultScreen({ result, onRetry, onTop }: SeimeiResultScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const gokaku = result.gokakuDetails.map((d) => ({
    label: d.name,
    reading: d.yomi,
    value: { strokes: d.kaku, kikkyo: d.suri.kikkyo },
  }));

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="relative z-10 w-full max-w-md space-y-6 sm:space-y-8">
        {/* タイトル */}
        <div className={`text-center space-y-2 sm:space-y-3 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div className="text-gold-500/60 text-2xl sm:text-3xl mb-1 sm:mb-2">
            <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10 mx-auto">
              <rect x="8" y="8" width="24" height="24" rx="3" fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.6" />
              <text x="20" y="21" textAnchor="middle" dominantBaseline="central" fill="#d4a017" fontSize="12" fontFamily="serif">名</text>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] sm:tracking-[0.3em] text-gold-gradient">
            鑑定結果
          </h1>
          <div className="w-16 sm:w-20 h-px mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <p className="text-sm text-navy-300/60 tracking-wider">
            {result.sei} {result.mei} さん
          </p>
        </div>

        {/* 五格の画数表示 */}
        <div className={`ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-8 space-y-4 ${mounted ? 'animate-fade-in-up stagger-1 opacity-0' : 'opacity-0'}`}>
          <h2 className="text-center text-sm text-gold-400/80 tracking-widest font-medium mb-4">
            <ruby>五格<rp>(</rp><rt className="text-[0.6rem]">ごかく</rt><rp>)</rp></ruby>の画数
          </h2>
          <div className="space-y-3">
            {gokaku.map(({ label, reading, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gold-500/10 last:border-b-0">
                <span className="text-sm text-navy-200/70 tracking-wider">
                  <ruby>{label}<rp>(</rp><rt className="text-[0.55rem] text-navy-400/50">{reading}</rt><rp>)</rp></ruby>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gold-gradient">{value.strokes}</span>
                  <span className="text-xs text-navy-400/60">画</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    value.kikkyo === "大吉" ? "bg-gold-500/20 text-gold-300" :
                    value.kikkyo === "吉" ? "bg-emerald-500/20 text-emerald-300" :
                    value.kikkyo === "吉凶混合" ? "bg-amber-500/20 text-amber-300" :
                    value.kikkyo === "凶" ? "bg-red-500/15 text-red-300/80" :
                    "bg-red-500/25 text-red-300"
                  }`}>
                    {value.kikkyo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <div className={`space-y-3 ${mounted ? 'animate-fade-in stagger-4 opacity-0' : 'opacity-0'}`}>
          <button
            onClick={onRetry}
            className="w-full ornament-border rounded-full px-10 py-3 bg-navy-900/60 text-gold-400 tracking-wider text-sm"
          >
            別の名前で鑑定する
          </button>
          <div className="text-center">
            <button onClick={onTop} className="text-navy-500 hover:text-gold-500/60 text-sm tracking-widest transition-colors duration-300">
              ← トップに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
