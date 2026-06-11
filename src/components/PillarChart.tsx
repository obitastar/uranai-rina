"use client";

import { useEffect, useState } from "react";
import type { FortuneResult } from "@/lib/shichusuimei";

interface PillarChartProps {
  result: FortuneResult;
}

export function PillarChart({ result }: PillarChartProps) {
  const { fourPillars, tpiYear, tpiMonth, tpiHour, juniunYear, juniunMonth, juniunDay, juniunHour } = result;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const pillars = [
    { label: "時の星", subLabel: "行動・晩年", kanshi: fourPillars.hour, tsuhen: tpiHour, juniun: juniunHour, isDay: false },
    { label: "日の星", subLabel: "自分自身", kanshi: fourPillars.day, tsuhen: null, juniun: juniunDay, isDay: true },
    { label: "月の星", subLabel: "仕事・社会", kanshi: fourPillars.month, tsuhen: tpiMonth, juniun: juniunMonth, isDay: false },
    { label: "年の星", subLabel: "家系・目上", kanshi: fourPillars.year, tsuhen: tpiYear, juniun: juniunYear, isDay: false },
  ];

  return (
    <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="p-4 sm:p-6">
        <h2 className="text-center text-xl sm:text-2xl font-bold text-gold-gradient-animated tracking-[0.3em] mb-1">
          <ruby>命式<rt className="text-[0.5rem] opacity-60">めいしき</rt></ruby>
        </h2>
        <p className="text-center text-sm sm:text-base text-navy-300/70 tracking-wide mb-2 sm:mb-3">
          生年月日から導き出された、あなただけの星の配置です
        </p>
        <div className="flex justify-center gap-3 sm:gap-4 text-[0.6rem] sm:text-xs text-navy-400/60 tracking-wider mb-3 sm:mb-4">
          <span><ruby>通変星<rt className="text-[0.5rem] opacity-60">つうへんせい</rt></ruby></span>
          <span><ruby>天干<rt className="text-[0.5rem] opacity-60">てんかん</rt></ruby></span>
          <span><ruby>地支<rt className="text-[0.5rem] opacity-60">ちし</rt></ruby></span>
          <span><ruby>十二運<rt className="text-[0.5rem] opacity-60">じゅうにうん</rt></ruby></span>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent mb-4 sm:mb-6" />

        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
          {/* ヘッダー */}
          {pillars.map((p, i) => (
            <div
              key={p.label}
              className={`pb-1 transition-all duration-700 ${
                revealed ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-sm sm:text-base text-navy-200/90 tracking-widest font-medium">{p.label}</span>
              <br />
              <span className="text-[0.6rem] sm:text-xs text-navy-400/70">{p.subLabel}</span>
            </div>
          ))}

          {/* 通変星 */}
          {pillars.map((p, i) => (
            <div
              key={`tsuhen-${i}`}
              className={`text-xs sm:text-sm text-gold-400/80 py-1 tracking-wider transition-all duration-700 ${
                revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {p.tsuhen ?? (p.isDay ? "本質" : "—")}
            </div>
          ))}

          {/* 天干 */}
          {pillars.map((p, i) => (
            <div
              key={`kan-${i}`}
              className={`relative py-3 transition-all duration-1000 ${
                revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transitionDelay: `${400 + i * 150}ms` }}
            >
              {p.isDay && (
                <div className="absolute inset-0 bg-gold-500/10 rounded-lg border border-gold-500/20" />
              )}
              <span
                className={`relative text-2xl sm:text-3xl font-black ${
                  p.isDay
                    ? "text-gold-gradient-animated"
                    : "text-navy-50"
                }`}
              >
                {p.kanshi?.kan ?? "—"}
              </span>
            </div>
          ))}

          {/* 地支 */}
          {pillars.map((p, i) => (
            <div
              key={`shi-${i}`}
              className={`py-3 transition-all duration-1000 ${
                revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transitionDelay: `${700 + i * 150}ms` }}
            >
              <span className="text-2xl sm:text-3xl font-black text-navy-100/90">
                {p.kanshi?.shi ?? "—"}
              </span>
            </div>
          ))}

          {/* 十二運 */}
          {pillars.map((p, i) => (
            <div
              key={`juniun-${i}`}
              className={`text-xs sm:text-sm text-navy-300/70 pt-2 tracking-wider transition-all duration-700 ${
                revealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
              style={{ transitionDelay: `${1000 + i * 100}ms` }}
            >
              {p.juniun ?? "—"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
