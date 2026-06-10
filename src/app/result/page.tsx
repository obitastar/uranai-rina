"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { calculateFortune, kanshiName } from "@/lib/shichusuimei";
import type { FortuneResult, Gender } from "@/lib/shichusuimei";
import { StarField } from "@/components/StarField";
import { ResultCard } from "@/components/ResultCard";
import { PillarChart } from "@/components/PillarChart";
import { LoadingScreen } from "@/components/LoadingScreen";

const SECTION_ICONS = [
  { icon: "◆", color: "from-purple-500/20 to-indigo-500/20" },
  { icon: "♥", color: "from-pink-500/20 to-rose-500/20" },
  { icon: "★", color: "from-amber-500/20 to-yellow-500/20" },
  { icon: "◎", color: "from-emerald-500/20 to-teal-500/20" },
];

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const y = searchParams.get("y");
    const m = searchParams.get("m");
    const d = searchParams.get("d");
    const h = searchParams.get("h");
    const g = searchParams.get("g");

    if (!y || !m || !d || !g) {
      setError("パラメータが不足しています");
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      try {
        const fortune = calculateFortune({
          year: Number(y),
          month: Number(m),
          day: Number(d),
          hour: h ? Number(h) : null,
          gender: g as Gender,
        });
        setResult(fortune);
      } catch {
        setError("鑑定中にエラーが発生しました");
      }
      setLoading(false);
      // コンテンツの表示を少し遅らせて演出
      setTimeout(() => setShowContent(true), 200);
    }, 3800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !result) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 bg-mystical min-h-screen">
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="text-4xl text-navy-400">☰</div>
          <p className="text-red-400/80 text-lg">{error || "結果を取得できませんでした"}</p>
          <button
            onClick={() => router.push("/input")}
            className="ornament-border rounded-full px-10 py-3 bg-navy-900/60 text-gold-400 hover:text-gold-300 tracking-wider transition-all"
          >
            もう一度入力する
          </button>
        </div>
      </main>
    );
  }

  const { input } = result;
  const birthLabel = `${input.year}年${input.month}月${input.day}日${
    input.hour !== null ? ` ${input.hour}時` : ""
  }生`;

  return (
    <main className="relative flex flex-col items-center min-h-screen px-4 py-8 bg-mystical">
      <StarField />

      <div className={`relative z-10 w-full max-w-lg transition-all duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* ヘッダー */}
        <div className="text-center space-y-3 mb-8">
          <div className="animate-fade-in-down opacity-0">
            <p className="text-sm text-navy-400/60 tracking-[0.2em]">{birthLabel}</p>
          </div>
          <div className="animate-fade-in-scale opacity-0 stagger-1">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gold-500/10 blur-3xl rounded-full scale-150" />
              <h1 className="relative text-4xl font-black tracking-[0.4em] text-gold-gradient-animated">
                鑑定結果
              </h1>
            </div>
          </div>
          <div className="animate-fade-in opacity-0 stagger-2">
            <div className="w-24 h-[1px] mx-auto animate-glow-line" />
          </div>
        </div>

        {/* 命式表 */}
        <div className="mb-8 animate-reveal-up opacity-0 stagger-2">
          <PillarChart result={result} />
        </div>

        {/* 鑑定セクション */}
        <div className="space-y-6">
          {/* 本質 */}
          <div className="animate-reveal-up opacity-0 stagger-3">
            <ResultCard
              title="本質"
              subtitle={`日主: ${result.nicchu}`}
              icon={SECTION_ICONS[0].icon}
              content={result.readings.essence}
            />
          </div>

          {/* 恋愛 */}
          <div className="animate-reveal-up opacity-0 stagger-4">
            <ResultCard
              title="恋愛運"
              subtitle={`${result.zokanTsuhensei}`}
              icon={SECTION_ICONS[1].icon}
              content={result.readings.love}
            />
          </div>

          {/* 仕事 */}
          <div className="animate-reveal-up opacity-0 stagger-5">
            <ResultCard
              title="仕事運"
              subtitle={`${result.tpiMonth}`}
              icon={SECTION_ICONS[2].icon}
              content={result.readings.work}
            />
          </div>

          {/* 今年の運勢 */}
          <div className="animate-reveal-up opacity-0 stagger-6">
            <ResultCard
              title={`${new Date().getFullYear()}年の運勢`}
              subtitle={`流年: ${kanshiName(result.currentYearKanshi)} / ${result.currentYearTsuhensei}`}
              icon={SECTION_ICONS[3].icon}
              content={result.readings.yearly}
            />
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col items-center gap-5 pt-10 pb-16 animate-fade-in-up opacity-0 stagger-6">
          <button
            onClick={() => router.push("/input")}
            className="group relative"
          >
            <div className="absolute inset-0 rounded-full bg-gold-500/15 blur-xl group-hover:bg-gold-500/25 transition-all duration-500" />
            <div className="relative ornament-border rounded-full px-14 py-4 bg-navy-900/50 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-500 animate-breathe">
              <span className="text-lg tracking-[0.25em] text-gold-gradient-animated font-bold">
                もう一度鑑定する
              </span>
            </div>
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-navy-500 hover:text-gold-500/50 text-sm tracking-widest transition-colors duration-300"
          >
            トップに戻る
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ResultContent />
    </Suspense>
  );
}
