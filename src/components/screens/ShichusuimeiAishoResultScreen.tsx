"use client";

import type { FortuneResult } from "@/lib/shichusuimei";
import type { ShichusuimeiCompatibility } from "@/lib/shichusuimei/compatibility";
import { ZodiacCharacter } from "@/components/ZodiacCharacter";
import { AishoIcon } from "@/components/AishoIcons";

interface Props {
  myResult: FortuneResult;
  partnerResult: FortuneResult;
  compatibility: ShichusuimeiCompatibility;
  onAnotherPartner: () => void;
  onBackToResult: () => void;
  onTop: () => void;
}

function ScoreCircle({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const r = size === "lg" ? 54 : 32;
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
        <span className={`font-black text-gold-gradient ${size === "lg" ? "text-3xl sm:text-4xl" : "text-lg"}`}>{score}</span>
        {size === "lg" && <span className="text-xs text-navy-400 tracking-wider mt-0.5">/ 100</span>}
      </div>
    </div>
  );
}

function StarsDisplay({ stars, level }: { stars: number; level: string }) {
  const color = level === '大吉' ? 'text-gold-400' : level === '吉' ? 'text-emerald-300' : level === '吉凶混合' ? 'text-amber-300' : 'text-red-300';
  return (
    <div className="flex items-center gap-2">
      <div className="text-lg tracking-wider">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < stars ? "text-gold-400" : "text-navy-700"}>★</span>
        ))}
      </div>
      <span className={`text-sm font-bold ${color}`}>{level}</span>
    </div>
  );
}

function CategorySection({
  iconType,
  title,
  category,
  accentColor,
  extra,
}: {
  iconType: 'love' | 'marriage' | 'children' | 'work' | 'money';
  title: string;
  category: { score: number; level: string; stars: number; description: string };
  accentColor: string;
  extra?: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <AishoIcon type={iconType} size={44} />
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-[0.15em] text-gold-gradient">{title}</h2>
          <StarsDisplay stars={category.stars} level={category.level} />
        </div>
        <div className="ml-auto">
          <ScoreCircle score={category.score} size="sm" />
        </div>
      </div>
      <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
        <div className="p-4 sm:p-5">
          <p className="text-navy-50/90 leading-[1.9] text-sm sm:text-base tracking-wide">
            {category.description}
          </p>
        </div>
      </div>
      {extra}
    </section>
  );
}

function Divider() {
  return <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent my-2" />;
}

export function ShichusuimeiAishoResultScreen({ myResult, partnerResult, compatibility, onAnotherPartner, onBackToResult, onTop }: Props) {
  const myInput = myResult.input;
  const pInput = partnerResult.input;
  const myLabel = `${myInput.year}年${myInput.month}月${myInput.day}日生`;
  const pLabel = `${pInput.year}年${pInput.month}月${pInput.day}日生`;

  return (
    <div className="w-full min-h-screen overflow-y-auto pb-12">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">

        {/* ===== ヘッダー ===== */}
        <div className="text-center space-y-3">
          <p className="text-sm text-navy-300/60 tracking-wider">四柱推命</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-[0.3em] text-gold-gradient">相性鑑定</h1>
          <div className="w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
        </div>

        {/* ===== 二人の情報 ===== */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-6">
          <div className="flex items-center justify-around gap-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-gold-400/60 tracking-widest">あなた</p>
              <ZodiacCharacter shi={myResult.fourPillars.day.shi} size="sm" />
              <p className="text-xs text-navy-300/70">{myLabel}</p>
            </div>
            <div className="text-2xl text-pink-400/60">×</div>
            <div className="text-center space-y-2">
              <p className="text-xs text-pink-300/60 tracking-widest">相手</p>
              <ZodiacCharacter shi={partnerResult.fourPillars.day.shi} size="sm" />
              <p className="text-xs text-navy-300/70">{pLabel}</p>
            </div>
          </div>
        </div>

        {/* ===== 総合スコア ===== */}
        <section className="text-center space-y-4">
          <AishoIcon type="overall" size={56} />
          <div className="flex justify-center">
            <ScoreCircle score={compatibility.overall.score} />
          </div>
          <StarsDisplay stars={compatibility.overall.stars} level={compatibility.overall.level} />
          <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5">
            <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide text-center">
              {compatibility.overall.description}
            </p>
          </div>
        </section>

        {/* ===== カテゴリサマリー（グリッド） ===== */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "恋愛", score: compatibility.love.score, color: "#f472b6", icon: 'love' as const },
            { label: "結婚", score: compatibility.marriage.score, color: "#fb923c", icon: 'marriage' as const },
            { label: "子宝", score: compatibility.children.score, color: "#4ade80", icon: 'children' as const },
          ].map(({ label, score, color, icon }) => (
            <div key={label} className="ornament-border rounded-xl bg-navy-900/30 p-3 text-center space-y-2">
              <div className="flex justify-center"><AishoIcon type={icon} size={32} /></div>
              <p className="text-xs tracking-widest" style={{ color }}>{label}</p>
              <ScoreCircle score={score} size="sm" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            { label: "仕事", score: compatibility.work.score, color: "#60a5fa", icon: 'work' as const },
            { label: "金運", score: compatibility.money.score, color: "#fbbf24", icon: 'money' as const },
          ].map(({ label, score, color, icon }) => (
            <div key={label} className="ornament-border rounded-xl bg-navy-900/30 p-3 text-center space-y-2">
              <div className="flex justify-center"><AishoIcon type={icon} size={32} /></div>
              <p className="text-xs tracking-widest" style={{ color }}>{label}</p>
              <ScoreCircle score={score} size="sm" />
            </div>
          ))}
        </div>

        <Divider />

        {/* ===== 各カテゴリ詳細 ===== */}
        <CategorySection iconType="love" title="恋愛相性" category={compatibility.love} accentColor="#f472b6" />
        <Divider />
        <CategorySection iconType="marriage" title="結婚運" category={compatibility.marriage} accentColor="#fb923c" />
        <Divider />
        <CategorySection iconType="children" title="子宝運" category={compatibility.children} accentColor="#4ade80" />
        <Divider />
        <CategorySection iconType="work" title="仕事相性" category={compatibility.work} accentColor="#60a5fa" />
        <Divider />
        <CategorySection iconType="money" title="金運相性" category={compatibility.money} accentColor="#fbbf24" />

        <Divider />

        {/* ===== 日主の関係 ===== */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <AishoIcon type="nisshu" size={44} />
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-[0.15em] text-gold-gradient">
                <ruby>日主<rp>(</rp><rt className="text-[0.5rem] opacity-60">にっしゅ</rt><rp>)</rp></ruby>の関係
              </h2>
              <p className="text-xs text-navy-300/60">お二人の本質的な相性</p>
            </div>
          </div>
          <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 space-y-4">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-xs text-gold-400/60 tracking-widest mb-1">あなた</p>
                <p className="text-3xl font-black text-gold-gradient">{myResult.nicchu}</p>
              </div>
              <div className="text-xl text-pink-400/40">×</div>
              <div className="text-center">
                <p className="text-xs text-pink-300/60 tracking-widest mb-1">相手</p>
                <p className="text-3xl font-black text-gold-gradient">{partnerResult.nicchu}</p>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-sm font-bold tracking-wider">
                {compatibility.nisshuRelation.type}
              </span>
            </div>
          </div>
          <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5">
            <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide">
              {compatibility.nisshuRelation.description}
            </p>
          </div>
        </section>

        <Divider />

        {/* ===== 十二支の相性 ===== */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <AishoIcon type="junishi" size={44} />
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-[0.15em] text-gold-gradient">
                <ruby>十二支<rp>(</rp><rt className="text-[0.5rem] opacity-60">じゅうにし</rt><rp>)</rp></ruby>の相性
              </h2>
              <p className="text-xs text-navy-300/60">生まれ日の支が示す縁の深さ</p>
            </div>
          </div>
          <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7">
            <div className="flex items-center justify-around mb-5">
              <div className="text-center">
                <p className="text-xs text-gold-400/60 tracking-widest mb-2">あなた</p>
                <ZodiacCharacter shi={myResult.fourPillars.day.shi} size="md" />
              </div>
              <div className="text-xl text-pink-400/40">×</div>
              <div className="text-center">
                <p className="text-xs text-pink-300/60 tracking-widest mb-2">相手</p>
                <ZodiacCharacter shi={partnerResult.fourPillars.day.shi} size="md" />
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-sm font-bold tracking-wider">
                {compatibility.junishiRelation.type}
              </span>
            </div>
          </div>
          <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5">
            <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide">
              {compatibility.junishiRelation.description}
            </p>
          </div>
        </section>

        <Divider />

        {/* ===== 五行の調和 + アドバイス ===== */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <AishoIcon type="gogyo" size={44} />
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-[0.15em] text-gold-gradient">
                <ruby>五行<rp>(</rp><rt className="text-[0.5rem] opacity-60">ごぎょう</rt><rp>)</rp></ruby>の調和
              </h2>
              <p className="text-xs text-navy-300/60">二人の五行バランスの相性</p>
            </div>
          </div>
          <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5">
            <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide">
              {compatibility.gogyoBalance.description}
            </p>
          </div>
          <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-6">
            <h3 className="text-center text-sm text-gold-400/70 tracking-widest mb-4">開運アドバイス</h3>
            <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide">
              {compatibility.advice}
            </p>
          </div>
        </section>

        <Divider />

        {/* ===== フッターボタン ===== */}
        <div className="text-center space-y-3 pt-4">
          <div className="space-y-2 sm:space-y-3 mb-3">
            <p className="text-navy-200/80 text-sm leading-relaxed tracking-wide">
              お二人の星が照らす<br />明るい未来をお祈りいたします
            </p>
          </div>

          <button onClick={onAnotherPartner} className="group relative w-full max-w-sm mx-auto block">
            <div className="relative ornament-border rounded-xl px-6 py-4 bg-pink-500/10 border border-pink-500/30 active:bg-pink-500/20">
              <span className="text-base tracking-[0.2em] text-pink-300 font-bold">
                別の相手と相性診断
              </span>
            </div>
          </button>
          <button onClick={onBackToResult} className="group relative w-full max-w-sm mx-auto block">
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
  );
}
