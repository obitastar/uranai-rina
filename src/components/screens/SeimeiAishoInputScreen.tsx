"use client";

import { useState, useEffect } from "react";
import { AishoIcon } from "@/components/AishoIcons";

interface Props {
  myName: string;
  onSubmit: (input: { sei: string; mei: string }) => void;
  onBack: () => void;
}

export function SeimeiAishoInputScreen({ myName, onSubmit, onBack }: Props) {
  const [mounted, setMounted] = useState(false);
  const [sei, setSei] = useState("");
  const [mei, setMei] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = () => {
    if (!sei.trim() || !mei.trim()) {
      setError("姓と名を入力してください");
      return;
    }
    const namePattern = /^[\u3000-\u9FFF\uF900-\uFAFF\u{20000}-\u{2FA1F}]+$/u;
    if (!namePattern.test(sei.trim())) {
      setError("姓は漢字・ひらがな・カタカナで入力してください");
      return;
    }
    if (!namePattern.test(mei.trim())) {
      setError("名は漢字・ひらがな・カタカナで入力してください");
      return;
    }
    onSubmit({ sei: sei.trim(), mei: mei.trim() });
  };

  const inputClass =
    "w-full rounded-xl bg-navy-800/60 border border-gold-500/20 text-navy-50 px-4 sm:px-5 py-4 sm:py-5 text-xl sm:text-2xl text-center tracking-[0.2em] focus:outline-none focus:border-gold-500/60 focus:bg-navy-800/80 focus:shadow-[0_0_20px_rgba(212,160,23,0.1)] transition-all duration-300 placeholder:text-navy-600/50 placeholder:text-base placeholder:tracking-normal";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-6 sm:py-8">
      <div className="relative z-10 w-full max-w-md space-y-5 sm:space-y-8">
        <div className={`text-center space-y-2 sm:space-y-3 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div className="flex justify-center mb-1 sm:mb-2"><AishoIcon type="overall" size={48} /></div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] sm:tracking-[0.3em] text-gold-gradient">
            相性診断
          </h1>
          <div className="w-16 sm:w-20 h-px mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <p className="text-[0.65rem] sm:text-xs text-navy-400 tracking-widest">
            相手のお名前を入力してください
          </p>
        </div>

        {/* 自分の情報表示 */}
        <div className={`ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4 text-center ${mounted ? 'animate-fade-in stagger-1 opacity-0' : 'opacity-0'}`}>
          <p className="text-xs text-navy-400/60 tracking-widest mb-1">あなた</p>
          <p className="text-sm text-gold-300/80 tracking-wider">{myName}</p>
        </div>

        <div className={`ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-8 space-y-5 sm:space-y-7 ${mounted ? 'animate-fade-in-up stagger-2 opacity-0' : 'opacity-0'}`}>
          <div className="text-center">
            <p className="text-sm text-pink-300/70 tracking-widest font-medium">相手の情報</p>
          </div>

          {/* 姓 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gold-400/80 tracking-widest font-medium">
              <span className="w-1 h-4 bg-gold-500/60 rounded-full" />
              姓（せい） <span className="text-red-400/80 text-xs">必須</span>
            </label>
            <input
              type="text"
              value={sei}
              onChange={(e) => { setSei(e.target.value); setError(""); }}
              placeholder="例：鈴木"
              className={inputClass}
              autoComplete="off"
            />
          </div>

          {/* 名 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gold-400/80 tracking-widest font-medium">
              <span className="w-1 h-4 bg-gold-500/60 rounded-full" />
              名（めい） <span className="text-red-400/80 text-xs">必須</span>
            </label>
            <input
              type="text"
              value={mei}
              onChange={(e) => { setMei(e.target.value); setError(""); }}
              placeholder="例：一郎"
              className={inputClass}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400/90 text-sm animate-fade-in-up">
              <span>※</span>{error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="group relative w-full py-4 sm:py-5 rounded-xl overflow-hidden text-lg sm:text-xl font-bold tracking-[0.2em] sm:tracking-[0.25em] transition-colors duration-150 active:scale-[0.97]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-700/80 via-pink-500/80 to-pink-700/80 group-hover:from-pink-600/80 group-hover:via-pink-400/80 group-hover:to-pink-600/80 transition-colors duration-150" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-white drop-shadow-sm">相性を鑑定する</span>
          </button>
        </div>

        <div className={`text-center ${mounted ? 'animate-fade-in stagger-4 opacity-0' : 'opacity-0'}`}>
          <button onClick={onBack} className="text-navy-500 hover:text-gold-500/60 text-sm tracking-widest transition-colors duration-300">
            ← 鑑定結果に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
