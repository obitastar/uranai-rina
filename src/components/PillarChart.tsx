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
    { label: "時柱", kanshi: fourPillars.hour, tsuhen: tpiHour, juniun: juniunHour },
    { label: "日柱", kanshi: fourPillars.day, tsuhen: null, juniun: juniunDay },
    { label: "月柱", kanshi: fourPillars.month, tsuhen: tpiMonth, juniun: juniunMonth },
    { label: "年柱", kanshi: fourPillars.year, tsuhen: tpiYear, juniun: juniunYear },
  ];

  return (
    <div className="card-glow ornament-border rounded-2xl bg-navy-900/40 backdrop-blur-md overflow-hidden">
      <div className="h-[1px] w-full animate-glow-line" />
      <div className="p-6">
        <h2 className="text-center text-xl font-bold text-gold-gradient-animated tracking-[0.3em] mb-2">
          命 式
        </h2>
        <p className="text-center text-xs text-navy-500 tracking-widest mb-5">
          Four Pillars of Destiny
        </p>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent mb-6" />

        <div className="grid grid-cols-4 gap-3 text-center">
          {/* ヘッダー */}
          {pillars.map((p, i) => (
            <div
              key={p.label}
              className={`text-xs text-navy-400/80 tracking-widest pb-2 transition-all duration-700 ${
                revealed ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {p.label}
            </div>
          ))}

          {/* 通変星 */}
          {pillars.map((p, i) => (
            <div
              key={`tsuhen-${i}`}
              className={`text-[0.7rem] text-gold-500/70 py-1 tracking-wider transition-all duration-700 ${
                revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {p.tsuhen ?? (p.label === "日柱" ? "日主" : "—")}
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
              {p.label === "日柱" && (
                <div className="absolute inset-0 bg-gold-500/10 rounded-lg border border-gold-500/20" />
              )}
              <span
                className={`relative text-3xl font-black ${
                  p.label === "日柱"
                    ? "text-gold-gradient-animated"
                    : "text-navy-100"
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
              <span className="text-3xl font-black text-navy-200/90">
                {p.kanshi?.shi ?? "—"}
              </span>
            </div>
          ))}

          {/* 十二運 */}
          {pillars.map((p, i) => (
            <div
              key={`juniun-${i}`}
              className={`text-[0.7rem] text-navy-400/60 pt-2 tracking-wider transition-all duration-700 ${
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
