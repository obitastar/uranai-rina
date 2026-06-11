"use client";

import { useState, useCallback } from "react";
import type { FortuneInput, FortuneResult } from "@/lib/shichusuimei";
import { TopScreen } from "@/components/screens/TopScreen";
import { InputScreen } from "@/components/screens/InputScreen";
import { LoadingScreen } from "@/components/screens/LoadingScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { calculateFortune } from "@/lib/shichusuimei";

type Screen = "top" | "input" | "loading" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("top");
  const [result, setResult] = useState<FortuneResult | null>(null);

  const handleStart = useCallback(() => {
    setScreen("input");
  }, []);

  const handleSubmit = useCallback((input: FortuneInput) => {
    setScreen("loading");

    // 計算は即座に実行
    let fortune: FortuneResult | null = null;
    try {
      fortune = calculateFortune(input);
    } catch {
      fortune = null;
    }

    // 演出を最小限に（1.5秒）
    setTimeout(() => {
      setResult(fortune);
      setScreen("result");
    }, 1500);
  }, []);

  const handleRetry = useCallback(() => {
    setResult(null);
    setScreen("input");
  }, []);

  const handleTop = useCallback(() => {
    setResult(null);
    setScreen("top");
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-mystical touch-manipulation">
      {screen === "top" && <TopScreen onStart={handleStart} />}
      {screen === "input" && (
        <InputScreen onSubmit={handleSubmit} onBack={handleTop} />
      )}
      {screen === "loading" && <LoadingScreen />}
      {screen === "result" && result && (
        <ResultScreen result={result} onRetry={handleRetry} onTop={handleTop} />
      )}
      {screen === "result" && !result && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="text-red-400/80 text-lg">鑑定中にエラーが発生しました</p>
          <button
            onClick={handleRetry}
            className="ornament-border rounded-full px-10 py-3 bg-navy-900/60 text-gold-400 tracking-wider"
          >
            もう一度入力する
          </button>
        </div>
      )}
    </div>
  );
}
