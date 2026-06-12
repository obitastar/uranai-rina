"use client";

import { useState, useCallback, useEffect } from "react";
import type { FortuneInput, FortuneResult } from "@/lib/shichusuimei";
import { TopScreen } from "@/components/screens/TopScreen";
import { InputScreen } from "@/components/screens/InputScreen";
import { LoadingScreen } from "@/components/screens/LoadingScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { SeimeiInputScreen } from "@/components/screens/SeimeiInputScreen";
import { SeimeiResultScreen } from "@/components/screens/SeimeiResultScreen";
import { ShichusuimeiAishoInputScreen } from "@/components/screens/ShichusuimeiAishoInputScreen";
import { ShichusuimeiAishoResultScreen } from "@/components/screens/ShichusuimeiAishoResultScreen";
import { SeimeiAishoInputScreen } from "@/components/screens/SeimeiAishoInputScreen";
import { SeimeiAishoResultScreen } from "@/components/screens/SeimeiAishoResultScreen";
import { calculateFortune } from "@/lib/shichusuimei";
import type { SeimeiResult } from "@/lib/seimei";
import { calculateSeimei } from "@/lib/seimei";
import { calculateShichusuimeiCompatibility } from "@/lib/shichusuimei/compatibility";
import type { ShichusuimeiCompatibility } from "@/lib/shichusuimei/compatibility";
import { calculateSeimeiCompatibility } from "@/lib/seimei/compatibility";
import type { SeimeiCompatibility } from "@/lib/seimei/compatibility";
import type { DivinationType } from "@/lib/types";
import { parseHash } from "@/lib/share";

type Screen =
  | "top"
  | "shichusuimei-input"
  | "seimei-input"
  | "loading"
  | "shichusuimei-result"
  | "seimei-result"
  | "shichusuimei-aisho-input"
  | "seimei-aisho-input"
  | "shichusuimei-aisho-result"
  | "seimei-aisho-result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("top");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [seimeiResult, setSeimeiResult] = useState<SeimeiResult | null>(null);

  // 相性診断用
  const [partnerResult, setPartnerResult] = useState<FortuneResult | null>(null);
  const [partnerSeimeiResult, setPartnerSeimeiResult] = useState<SeimeiResult | null>(null);
  const [shichuCompatibility, setShichuCompatibility] = useState<ShichusuimeiCompatibility | null>(null);
  const [seimeiCompatibility, setSeimeiCompatibility] = useState<SeimeiCompatibility | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelect = useCallback((type: DivinationType) => {
    if (type === "shichusuimei") {
      setScreen("shichusuimei-input");
    } else {
      setScreen("seimei-input");
    }
  }, []);

  // --- 四柱推命 ---

  const handleSubmit = useCallback((input: FortuneInput) => {
    setErrorMessage(null);
    setScreen("loading");

    let fortune: FortuneResult | null = null;
    try {
      fortune = calculateFortune(input);
    } catch (e) {
      console.error("四柱推命エラー:", e);
      setErrorMessage(e instanceof Error ? e.message : "不明なエラー");
      fortune = null;
    }

    setTimeout(() => {
      setResult(fortune);
      setScreen("shichusuimei-result");
    }, 1500);
  }, []);

  const handleRetry = useCallback(() => {
    setResult(null);
    setScreen("shichusuimei-input");
  }, []);

  // --- 姓名判断 ---

  const handleSeimeiSubmit = useCallback((input: { sei: string; mei: string }) => {
    setErrorMessage(null);
    setScreen("loading");

    let seimei: SeimeiResult | null = null;
    try {
      seimei = calculateSeimei(input.sei, input.mei);
    } catch (e) {
      console.error("姓名判断エラー:", e);
      setErrorMessage(e instanceof Error ? e.message : "不明なエラー");
      seimei = null;
    }

    setTimeout(() => {
      setSeimeiResult(seimei);
      setScreen("seimei-result");
    }, 1500);
  }, []);

  const handleSeimeiRetry = useCallback(() => {
    setSeimeiResult(null);
    setScreen("seimei-input");
  }, []);

  // --- 四柱推命 相性診断 ---

  const handleShichuAisho = useCallback(() => {
    setScreen("shichusuimei-aisho-input");
  }, []);

  const handleShichuAishoSubmit = useCallback((input: FortuneInput) => {
    setErrorMessage(null);
    setScreen("loading");

    let partner: FortuneResult | null = null;
    let compat: ShichusuimeiCompatibility | null = null;
    try {
      partner = calculateFortune(input);
      if (result && partner) {
        compat = calculateShichusuimeiCompatibility(result, partner);
      }
    } catch (e) {
      console.error("四柱推命相性エラー:", e);
      setErrorMessage(e instanceof Error ? e.message : "不明なエラー");
      partner = null;
      compat = null;
    }

    setTimeout(() => {
      setPartnerResult(partner);
      setShichuCompatibility(compat);
      setScreen("shichusuimei-aisho-result");
    }, 1500);
  }, [result]);

  const handleShichuAishoAnother = useCallback(() => {
    setPartnerResult(null);
    setShichuCompatibility(null);
    setScreen("shichusuimei-aisho-input");
  }, []);

  const handleShichuAishoBackToResult = useCallback(() => {
    setScreen("shichusuimei-result");
  }, []);

  // --- 姓名判断 相性診断 ---

  const handleSeimeiAisho = useCallback(() => {
    setScreen("seimei-aisho-input");
  }, []);

  const handleSeimeiAishoSubmit = useCallback((input: { sei: string; mei: string }) => {
    setErrorMessage(null);
    setScreen("loading");

    let partner: SeimeiResult | null = null;
    let compat: SeimeiCompatibility | null = null;
    try {
      partner = calculateSeimei(input.sei, input.mei);
      if (seimeiResult && partner) {
        compat = calculateSeimeiCompatibility(seimeiResult, partner);
      }
    } catch (e) {
      console.error("姓名判断相性エラー:", e);
      setErrorMessage(e instanceof Error ? e.message : "不明なエラー");
      partner = null;
      compat = null;
    }

    setTimeout(() => {
      setPartnerSeimeiResult(partner);
      setSeimeiCompatibility(compat);
      setScreen("seimei-aisho-result");
    }, 1500);
  }, [seimeiResult]);

  const handleSeimeiAishoAnother = useCallback(() => {
    setPartnerSeimeiResult(null);
    setSeimeiCompatibility(null);
    setScreen("seimei-aisho-input");
  }, []);

  const handleSeimeiAishoBackToResult = useCallback(() => {
    setScreen("seimei-result");
  }, []);

  // --- トップ ---

  const handleTop = useCallback(() => {
    setResult(null);
    setSeimeiResult(null);
    setPartnerResult(null);
    setPartnerSeimeiResult(null);
    setShichuCompatibility(null);
    setSeimeiCompatibility(null);
    setScreen("top");
  }, []);

  // --- URLハッシュから結果を復元 ---
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const params = parseHash(hash);
    if (!params) return;

    // ハッシュを消す（履歴に残さない）
    history.replaceState(null, "", window.location.pathname);

    try {
      if (params.type === "shichusuimei") {
        const fortune = calculateFortune(params);
        setResult(fortune);
        setScreen("shichusuimei-result");
      } else if (params.type === "seimei") {
        const seimei = calculateSeimei(params.sei, params.mei);
        setSeimeiResult(seimei);
        setScreen("seimei-result");
      } else if (params.type === "shichusuimei-aisho") {
        const my = calculateFortune(params.person1);
        const partner = calculateFortune(params.person2);
        const compat = calculateShichusuimeiCompatibility(my, partner);
        setResult(my);
        setPartnerResult(partner);
        setShichuCompatibility(compat);
        setScreen("shichusuimei-aisho-result");
      } else if (params.type === "seimei-aisho") {
        const my = calculateSeimei(params.person1.sei, params.person1.mei);
        const partner = calculateSeimei(params.person2.sei, params.person2.mei);
        const compat = calculateSeimeiCompatibility(my, partner);
        setSeimeiResult(my);
        setPartnerSeimeiResult(partner);
        setSeimeiCompatibility(compat);
        setScreen("seimei-aisho-result");
      }
    } catch (e) {
      console.error("URLからの復元に失敗:", e);
    }
  }, []);

  // 生年月日ラベル
  const myBirthLabel = result
    ? `${result.input.year}年${result.input.month}月${result.input.day}日${result.input.hour !== null ? ` ${result.input.hour}時` : ""}生（${result.input.gender === "male" ? "男性" : "女性"}）`
    : "";

  const myNameLabel = seimeiResult
    ? `${seimeiResult.sei} ${seimeiResult.mei}`
    : "";

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
        <ResultScreen result={result} onRetry={handleRetry} onTop={handleTop} onAisho={handleShichuAisho} />
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
        <SeimeiResultScreen result={seimeiResult} onRetry={handleSeimeiRetry} onTop={handleTop} onAisho={handleSeimeiAisho} />
      )}
      {screen === "seimei-result" && !seimeiResult && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
          <p className="text-red-400/80 text-lg">鑑定中にエラーが発生しました</p>
          {errorMessage && (
            <p className="text-navy-300/70 text-sm text-center max-w-sm">{errorMessage}</p>
          )}
          <button
            onClick={handleSeimeiRetry}
            className="ornament-border rounded-full px-10 py-3 bg-navy-900/60 text-gold-400 tracking-wider"
          >
            もう一度入力する
          </button>
        </div>
      )}

      {/* 四柱推命 相性診断 */}
      {screen === "shichusuimei-aisho-input" && (
        <ShichusuimeiAishoInputScreen
          myBirthLabel={myBirthLabel}
          onSubmit={handleShichuAishoSubmit}
          onBack={handleShichuAishoBackToResult}
        />
      )}
      {screen === "shichusuimei-aisho-result" && result && partnerResult && shichuCompatibility && (
        <ShichusuimeiAishoResultScreen
          myResult={result}
          partnerResult={partnerResult}
          compatibility={shichuCompatibility}
          onAnotherPartner={handleShichuAishoAnother}
          onBackToResult={handleShichuAishoBackToResult}
          onTop={handleTop}
        />
      )}
      {screen === "shichusuimei-aisho-result" && (!partnerResult || !shichuCompatibility) && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="text-red-400/80 text-lg">鑑定中にエラーが発生しました</p>
          <button
            onClick={handleShichuAishoAnother}
            className="ornament-border rounded-full px-10 py-3 bg-navy-900/60 text-gold-400 tracking-wider"
          >
            もう一度入力する
          </button>
        </div>
      )}

      {/* 姓名判断 相性診断 */}
      {screen === "seimei-aisho-input" && (
        <SeimeiAishoInputScreen
          myName={myNameLabel}
          onSubmit={handleSeimeiAishoSubmit}
          onBack={handleSeimeiAishoBackToResult}
        />
      )}
      {screen === "seimei-aisho-result" && seimeiResult && partnerSeimeiResult && seimeiCompatibility && (
        <SeimeiAishoResultScreen
          myResult={seimeiResult}
          partnerResult={partnerSeimeiResult}
          compatibility={seimeiCompatibility}
          onAnotherPartner={handleSeimeiAishoAnother}
          onBackToResult={handleSeimeiAishoBackToResult}
          onTop={handleTop}
        />
      )}
      {screen === "seimei-aisho-result" && (!partnerSeimeiResult || !seimeiCompatibility) && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="text-red-400/80 text-lg">鑑定中にエラーが発生しました</p>
          <button
            onClick={handleSeimeiAishoAnother}
            className="ornament-border rounded-full px-10 py-3 bg-navy-900/60 text-gold-400 tracking-wider"
          >
            もう一度入力する
          </button>
        </div>
      )}
    </div>
  );
}
