"use client";

import type { FortuneResult } from "@/lib/shichusuimei";
import { kanshiName } from "@/lib/shichusuimei";

interface PillarChartProps {
  result: FortuneResult;
}

export function PillarChart({ result }: PillarChartProps) {
  const { fourPillars, nicchu, tpiYear, tpiMonth, tpiHour, juniunYear, juniunMonth, juniunDay, juniunHour } = result;

  const pillars = [
    { label: "時柱", kanshi: fourPillars.hour, tsuhen: tpiHour, juniun: juniunHour },
    { label: "日柱", kanshi: fourPillars.day, tsuhen: null, juniun: juniunDay },
    { label: "月柱", kanshi: fourPillars.month, tsuhen: tpiMonth, juniun: juniunMonth },
    { label: "年柱", kanshi: fourPillars.year, tsuhen: tpiYear, juniun: juniunYear },
  ];

  return (
    <div className="ornament-border rounded-2xl bg-navy-900/60 p-6 backdrop-blur-sm">
      <h2 className="text-center text-lg font-bold text-gold-gradient tracking-wider mb-4">
        命式
      </h2>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent mb-4" />

      <div className="grid grid-cols-4 gap-2 text-center">
        {/* ヘッダー行 */}
        {pillars.map((p) => (
          <div key={p.label} className="text-xs text-navy-400 tracking-wider pb-2">
            {p.label}
          </div>
        ))}

        {/* 通変星 */}
        {pillars.map((p, i) => (
          <div key={`tsuhen-${i}`} className="text-xs text-gold-400 py-1">
            {p.tsuhen ?? (p.label === "日柱" ? "日主" : "---")}
          </div>
        ))}

        {/* 天干 */}
        {pillars.map((p, i) => (
          <div
            key={`kan-${i}`}
            className={`text-2xl font-bold py-2 ${
              p.label === "日柱" ? "text-gold-300" : "text-navy-100"
            }`}
          >
            {p.kanshi?.kan ?? "—"}
          </div>
        ))}

        {/* 地支 */}
        {pillars.map((p, i) => (
          <div key={`shi-${i}`} className="text-2xl font-bold py-2 text-navy-200">
            {p.kanshi?.shi ?? "—"}
          </div>
        ))}

        {/* 十二運 */}
        {pillars.map((p, i) => (
          <div key={`juniun-${i}`} className="text-xs text-navy-400 pt-2">
            {p.juniun ?? "---"}
          </div>
        ))}
      </div>
    </div>
  );
}
