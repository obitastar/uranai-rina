"use client";

import { useState, useCallback } from "react";
import type { FortuneInput, FortuneResult } from "@/lib/shichusuimei";
import { TopScreen } from "@/components/screens/TopScreen";
import { InputScreen } from "@/components/screens/InputScreen";
import { LoadingScreen } from "@/components/screens/LoadingScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { SeimeiInputScreen } from "@/components/screens/SeimeiInputScreen";
import { SeimeiResultScreen } from "@/components/screens/SeimeiResultScreen";
import { calculateFortune } from "@/lib/shichusuimei";
import type { SeimeiResult } from "@/lib/seimei";
import { calculateSeimei } from "@/lib/seimei";
import type { DivinationType } from "@/lib/types";
type Screen = "top" | "shichusuimei-input" | "seimei-input" | "loading" | "shichusuimei-result" | "seimei-result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("top");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [seimeiResult, setSeimeiResult] = useState<SeimeiResult | null>(null);

  const handleSelect = useCallback((type: DivinationType) => {
    if (type === "shichusuimei") {
      setScreen("shichusuimei-input");
    } else {
      setScreen("seimei-input");
    }
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
      setScreen("shichusuimei-result");
    }, 1500);
  }, []);

  const handleSeimeiSubmit = useCallback((input: { sei: string; mei: string }) => {
    setScreen("loading");

    let seimei: SeimeiResult | null = null;
    try {
      seimei = calculateSeimei(input.sei, input.mei);
    } catch {
      seimei = null;
    }

    setTimeout(() => {
      setSeimeiResult(seimei);
      setScreen("seimei-result");
    }, 1500);
  }, []);

  const handleRetry = useCallback(() => {
    setResult(null);
    setScreen("shichusuimei-input");
  }, []);

  const handleSeimeiRetry = useCallback(() => {
    setSeimeiResult(null);
    setScreen("seimei-input");
  }, []);

  const handleTop = useCallback(() => {
    setResult(null);
    setSeimeiResult(null);
    setScreen("top");
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-mystical touch-manipulation">
      {screen === "top" && <TopScreen onSelect={handleSelect} />}
      {screen === "shichusuimei-input" && (
        <InputScreen onSubmit={handleSubmit} onBack={handleTop} />
      )}
      {screen === "seimei-input" && (
        <SeimeiInputScreen onSubmit={handleSeimeiSubmit} onBack={handleTop} />
      )}
      {screen === "loading" && <LoadingScreen />}
      {screen === "shichusuimei-result" && result && (
        <ResultScreen result={result} onRetry={handleRetry} onTop={handleTop} />
      )}
      {screen === "shichusuimei-result" && !result && (
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
      {screen === "seimei-result" && seimeiResult && (
        <SeimeiResultScreen result={seimeiResult} onRetry={handleSeimeiRetry} onTop={handleTop} />
      )}
      {screen === "seimei-result" && !seimeiResult && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="text-red-400/80 text-lg">鑑定中にエラーが発生しました</p>
          <button
            onClick={handleSeimeiRetry}
            className="ornament-border rounded-full px-10 py-3 bg-navy-900/60 text-gold-400 tracking-wider"
          >
            もう一度入力する
          </button>
        </div>
      )}
    </div>
  );
}
