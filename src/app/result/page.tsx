"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { calculateFortune, kanshiName } from "@/lib/shichusuimei";
import type { FortuneResult, Gender } from "@/lib/shichusuimei";
import { StarField } from "@/components/StarField";
import { ResultCard } from "@/components/ResultCard";
import { PillarChart } from "@/components/PillarChart";
import { LoadingScreen } from "@/components/LoadingScreen";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    // 演出のための遅延
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
      } catch (e) {
        setError("鑑定中にエラーが発生しました");
      }
      setLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !result) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <p className="text-red-400 text-lg mb-8">{error || "結果を取得できませんでした"}</p>
        <button
          onClick={() => router.push("/input")}
          className="text-gold-400 hover:text-gold-300 tracking-wider"
        >
          もう一度入力する
        </button>
      </main>
    );
  }

  const { input } = result;
  const birthLabel = `${input.year}年${input.month}月${input.day}日${
    input.hour !== null ? ` ${input.hour}時` : ""
  }生`;

  return (
    <main className="relative flex flex-col items-center min-h-screen px-4 py-8">
      <StarField />

      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* ヘッダー */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <p className="text-sm text-navy-400 tracking-wider">{birthLabel}</p>
          <h1 className="text-3xl font-bold tracking-[0.2em] text-gold-gradient">
            鑑定結果
          </h1>
          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>

        {/* 命式表 */}
        <div className="animate-fade-in-up stagger-1 opacity-0">
          <PillarChart result={result} />
        </div>

        {/* 本質 */}
        <div className="animate-fade-in-up stagger-1 opacity-0">
          <ResultCard
            title="本質"
            subtitle={`日主: ${result.nicchu}`}
            icon="◆"
            content={result.readings.essence}
          />
        </div>

        {/* 恋愛 */}
        <div className="animate-fade-in-up stagger-2 opacity-0">
          <ResultCard
            title="恋愛運"
            subtitle={`${result.zokanTsuhensei}`}
            icon="♥"
            content={result.readings.love}
          />
        </div>

        {/* 仕事 */}
        <div className="animate-fade-in-up stagger-3 opacity-0">
          <ResultCard
            title="仕事運"
            subtitle={`${result.tpiMonth}`}
            icon="★"
            content={result.readings.work}
          />
        </div>

        {/* 今年の運勢 */}
        <div className="animate-fade-in-up stagger-4 opacity-0">
          <ResultCard
            title={`${new Date().getFullYear()}年の運勢`}
            subtitle={`流年: ${kanshiName(result.currentYearKanshi)} / ${result.currentYearTsuhensei}`}
            icon="◎"
            content={result.readings.yearly}
          />
        </div>

        {/* アクションボタン */}
        <div className="animate-fade-in-up stagger-4 opacity-0 flex flex-col items-center gap-4 pt-4 pb-12">
          <button
            onClick={() => router.push("/input")}
            className="ornament-border rounded-full px-12 py-4 bg-navy-900/80 hover:bg-navy-800/80 transition-all"
          >
            <span className="text-lg tracking-[0.2em] text-gold-gradient font-medium">
              もう一度鑑定する
            </span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-navy-400 hover:text-navy-200 text-sm tracking-wider transition-colors"
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
