"use client";

import type { SeimeiResult } from "@/lib/seimei";
import type { SeimeiCompatibility } from "@/lib/seimei/compatibility";
import { SlideViewer } from "@/components/SlideViewer";
import { kakuToGogyo } from "@/lib/seimei";

interface Props {
  myResult: SeimeiResult;
  partnerResult: SeimeiResult;
  compatibility: SeimeiCompatibility;
  onAnotherPartner: () => void;
  onBackToResult: () => void;
  onTop: () => void;
}

const SLIDE_LABELS = ["総合", "恋愛", "結婚", "子宝", "仕事", "人格", "三才", "完了"];

function gogyoColor(gogyo: string): string {
  switch (gogyo) {
    case "木": return "text-green-300";
    case "火": return "text-red-300";
    case "土": return "text-amber-300";
    case "金": return "text-slate-200";
    case "水": return "text-blue-300";
    default: return "text-navy-200";
  }
}

function gogyoBg(gogyo: string): string {
  switch (gogyo) {
    case "木": return "bg-green-500/15";
    case "火": return "bg-red-500/15";
    case "土": return "bg-amber-500/15";
    case "金": return "bg-slate-400/15";
    case "水": return "bg-blue-500/15";
    default: return "bg-navy-500/15";
  }
}

function ScoreCircle({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const r = size === "lg" ? 54 : 36;
  const stroke = size === "lg" ? 6 : 4;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const svgSize = (r + stroke) * 2;
  const color = score >= 75 ? "#d4a017" : score >= 55 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle cx={r + stroke} cy={r + stroke} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle
          cx={r + stroke} cy={r + stroke} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-black text-gold-gradient ${size === "lg" ? "text-3xl sm:text-4xl" : "text-xl"}`}>{score}</span>
        {size === "lg" && <span className="text-xs text-navy-400 tracking-wider mt-0.5">/ 100</span>}
      </div>
    </div>
  );
}

function StarsDisplay({ stars, level }: { stars: number; level: string }) {
  const color = level === '大吉' ? 'text-gold-400' : level === '吉' ? 'text-emerald-300' : level === '吉凶混合' ? 'text-amber-300' : 'text-red-300';
  return (
    <div className="flex items-center gap-2">
      <div className="text-xl tracking-wider">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < stars ? "text-gold-400" : "text-navy-700"}>★</span>
        ))}
      </div>
      <span className={`text-sm font-bold ${color}`}>{level}</span>
    </div>
  );
}

function CategorySlide({
  title,
  icon,
  category,
  accentColor,
}: {
  title: string;
  icon: string;
  category: { score: number; level: string; stars: number; description: string };
  accentColor: string;
}) {
  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-md space-y-5 sm:space-y-7">
        <div className="text-center space-y-2">
          <div className="text-3xl sm:text-4xl mb-2">{icon}</div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-gold-gradient">{title}</h2>
          <div className="w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>
        <div className="flex justify-center">
          <ScoreCircle score={category.score} />
        </div>
        <div className="flex justify-center">
          <StarsDisplay stars={category.stars} level={category.level} />
        </div>
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
              {category.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeimeiAishoResultScreen({ myResult, partnerResult, compatibility, onAnotherPartner, onBackToResult, onTop }: Props) {
  const myJinkaku = myResult.gokakuDetails.find(d => d.key === 'jinkaku')!;
  const pJinkaku = partnerResult.gokakuDetails.find(d => d.key === 'jinkaku')!;
  const myGogyo = kakuToGogyo(myJinkaku.kaku);
  const pGogyo = kakuToGogyo(pJinkaku.kaku);

  return (
    <div className="w-full h-screen">
      <SlideViewer slideLabels={SLIDE_LABELS}>
        {/* スライド1: 総合 */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-md space-y-5 sm:space-y-7">
            <div className="text-center space-y-2">
              <p className="text-sm text-navy-300/60 tracking-wider">姓名判断</p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-[0.3em] text-gold-gradient">相性鑑定</h1>
              <div className="w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
            </div>

            {/* 二人の情報 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-6">
              <div className="flex items-center justify-around gap-4">
                <div className="text-center space-y-1">
                  <p className="text-xs text-gold-400/60 tracking-widest">あなた</p>
                  <p className="text-lg font-bold text-navy-100">{myResult.sei} {myResult.mei}</p>
                  <div className={`inline-block px-2 py-0.5 rounded-full ${gogyoBg(myGogyo)}`}>
                    <span className={`text-xs font-bold ${gogyoColor(myGogyo)}`}>{myGogyo}</span>
                  </div>
                </div>
                <div className="text-2xl text-pink-400/60">×</div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-pink-300/60 tracking-widest">相手</p>
                  <p className="text-lg font-bold text-navy-100">{partnerResult.sei} {partnerResult.mei}</p>
                  <div className={`inline-block px-2 py-0.5 rounded-full ${gogyoBg(pGogyo)}`}>
                    <span className={`text-xs font-bold ${gogyoColor(pGogyo)}`}>{pGogyo}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ScoreCircle score={compatibility.overall.score} />
            </div>
            <div className="flex justify-center">
              <StarsDisplay stars={compatibility.overall.stars} level={compatibility.overall.level} />
            </div>
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5">
              <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide text-center">
                {compatibility.overall.description}
              </p>
            </div>

            {/* カテゴリサマリー */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "恋愛", score: compatibility.love.score, color: "#f472b6" },
                { label: "結婚", score: compatibility.marriage.score, color: "#fb923c" },
                { label: "子宝", score: compatibility.children.score, color: "#4ade80" },
              ].map(({ label, score, color }) => (
                <div key={label} className="ornament-border rounded-xl bg-navy-900/30 p-3 text-center">
                  <p className="text-xs tracking-widest mb-2" style={{ color }}>{label}</p>
                  <ScoreCircle score={score} size="sm" />
                </div>
              ))}
            </div>
            <div className="ornament-border rounded-xl bg-navy-900/30 p-3 text-center max-w-[140px] mx-auto">
              <p className="text-xs tracking-widest mb-2" style={{ color: "#60a5fa" }}>仕事</p>
              <ScoreCircle score={compatibility.work.score} size="sm" />
            </div>
          </div>
        </div>

        {/* スライド2: 恋愛 */}
        <CategorySlide
          title="恋愛相性"
          icon="💕"
          category={compatibility.love}
          accentColor="#f472b6"
        />

        {/* スライド3: 結婚運 */}
        <CategorySlide
          title="結婚運"
          icon="💒"
          category={compatibility.marriage}
          accentColor="#fb923c"
        />

        {/* スライド4: 子宝運 */}
        <CategorySlide
          title="子宝運"
          icon="👶"
          category={compatibility.children}
          accentColor="#4ade80"
        />

        {/* スライド5: 仕事 */}
        <CategorySlide
          title="仕事相性"
          icon="💼"
          category={compatibility.work}
          accentColor="#60a5fa"
        />

        {/* スライド6: 人格の関係 */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-md space-y-5 sm:space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-gold-gradient">
                <ruby>人格<rp>(</rp><rt className="text-[0.5rem] opacity-60">じんかく</rt><rp>)</rp></ruby>の関係
              </h2>
              <p className="text-sm text-navy-300/60">お二人の本質的な相性</p>
            </div>

            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-around">
                <div className="text-center space-y-2">
                  <p className="text-xs text-gold-400/60 tracking-widest">あなた</p>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${gogyoBg(myGogyo)} border border-opacity-30`}>
                    <span className={`text-xl font-bold ${gogyoColor(myGogyo)}`}>{myGogyo}</span>
                  </div>
                  <p className="text-xs text-navy-300/60">{myJinkaku.kaku}画</p>
                </div>
                <div className="text-xl text-pink-400/40">×</div>
                <div className="text-center space-y-2">
                  <p className="text-xs text-pink-300/60 tracking-widest">相手</p>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${gogyoBg(pGogyo)} border border-opacity-30`}>
                    <span className={`text-xl font-bold ${gogyoColor(pGogyo)}`}>{pGogyo}</span>
                  </div>
                  <p className="text-xs text-navy-300/60">{pJinkaku.kaku}画</p>
                </div>
              </div>
              <div className="text-center">
                <span className="inline-block px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-sm font-bold tracking-wider">
                  {compatibility.jinkakuRelation.type}
                </span>
              </div>
            </div>

            <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5">
              <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide">
                {compatibility.jinkakuRelation.description}
              </p>
            </div>
          </div>
        </div>

        {/* スライド5: 三才配置 + アドバイス */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-md space-y-5 sm:space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-gold-gradient">
                <ruby>三才<rp>(</rp><rt className="text-[0.5rem] opacity-60">さんさい</rt><rp>)</rp></ruby>の調和
              </h2>
              <p className="text-sm text-navy-300/60">天・人・地の五行バランスの相性</p>
            </div>

            {/* 二人の三才を並べて表示 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-xs text-gold-400/60 tracking-widest mb-3">あなた</p>
                  <div className="flex justify-center gap-2">
                    {myResult.sansai.tenchi.map((g, i) => (
                      <div key={i} className="text-center">
                        <p className="text-[0.6rem] text-navy-400/60 mb-0.5">{["天", "人", "地"][i]}</p>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${gogyoBg(g)}`}>
                          <span className={`text-sm font-bold ${gogyoColor(g)}`}>{g}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-pink-300/60 tracking-widest mb-3">相手</p>
                  <div className="flex justify-center gap-2">
                    {partnerResult.sansai.tenchi.map((g, i) => (
                      <div key={i} className="text-center">
                        <p className="text-[0.6rem] text-navy-400/60 mb-0.5">{["天", "人", "地"][i]}</p>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${gogyoBg(g)}`}>
                          <span className={`text-sm font-bold ${gogyoColor(g)}`}>{g}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5">
              <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide">
                {compatibility.sansaiRelation.description}
              </p>
            </div>

            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-6">
              <h3 className="text-center text-sm text-gold-400/70 tracking-widest mb-3">開運アドバイス</h3>
              <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide">
                {compatibility.advice}
              </p>
            </div>
          </div>
        </div>

        {/* スライド6: 完了 */}
        <div className="flex flex-col items-center justify-center min-h-full px-4 sm:px-6">
          <div className="text-center space-y-5 sm:space-y-8 max-w-sm">
            <div className="text-4xl">☯</div>
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em]">
                鑑定完了
              </h2>
              <div className="w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <p className="text-navy-200/80 text-sm leading-relaxed tracking-wide mt-3">
                お二人の名前が紡ぐ<br />
                素敵なご縁を<br />
                心よりお祈りいたします
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button onClick={onAnotherPartner} className="group relative w-full">
                <div className="relative ornament-border rounded-xl px-6 py-4 bg-pink-500/10 border border-pink-500/30 active:bg-pink-500/20">
                  <span className="text-base tracking-[0.2em] text-pink-300 font-bold">
                    別の相手と相性診断
                  </span>
                </div>
              </button>
              <button onClick={onBackToResult} className="group relative w-full">
                <div className="relative ornament-border rounded-xl px-6 py-4 bg-navy-900/50 active:bg-navy-800/60">
                  <span className="text-base tracking-[0.2em] text-gold-gradient font-bold">
                    自分の鑑定結果に戻る
                  </span>
                </div>
              </button>
              <button onClick={onTop} className="text-navy-400 hover:text-gold-500/60 text-sm tracking-widest">
                トップに戻る
              </button>
            </div>
          </div>
        </div>
      </SlideViewer>
    </div>
  );
}
