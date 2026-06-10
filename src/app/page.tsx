"use client";

import { useState, useCallback } from "react";
import type { FortuneInput, FortuneResult } from "@/lib/shichusuimei";
import { TopScreen } from "@/components/screens/TopScreen";
import { InputScreen } from "@/components/screens/InputScreen";
import { LoadingScreen } from "@/components/screens/LoadingScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { StarField } from "@/components/StarField";
import { calculateFortune } from "@/lib/shichusuimei";

type Screen = "top" | "input" | "loading" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("top");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  const transition = useCallback((to: Screen) => {
    setFadeOut(true);
    setTimeout(() => {
      setScreen(to);
      setFadeOut(false);
    }, 500);
  }, []);

  const handleStart = useCallback(() => {
    transition("input");
  }, [transition]);

  const handleSubmit = useCallback((input: FortuneInput) => {
    setScreen("loading");
    setFadeOut(false);

    setTimeout(() => {
      try {
        const fortune = calculateFortune(input);
        setResult(fortune);
      } catch {
        setResult(null);
      }
      setFadeOut(true);
      setTimeout(() => {
        setScreen("result");
        setFadeOut(false);
      }, 500);
    }, 4000);
  }, []);

  const handleRetry = useCallback(() => {
    setResult(null);
    transition("input");
  }, [transition]);

  const handleTop = useCallback(() => {
    setResult(null);
    transition("top");
  }, [transition]);

  return (
    <div className="relative w-full min-h-screen bg-mystical overflow-hidden">
      <StarField />

      <div
        className={`relative z-10 w-full min-h-screen transition-all duration-500 ${
          fadeOut ? "opacity-0 scale-[0.97]" : "opacity-100 scale-100"
        }`}
      >
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
    </div>
  );
}
