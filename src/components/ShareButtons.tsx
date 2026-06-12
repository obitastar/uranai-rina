"use client";

import { useState, useCallback } from "react";
import { LINE_ADD_FRIEND_URL } from "@/lib/share";

interface ShareButtonsProps {
  freeUrl: string;
  fullUrl: string;
}

function useCopyButton() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
}

export function ShareButtons({ freeUrl, fullUrl }: ShareButtonsProps) {
  const free = useCopyButton();
  const full = useCopyButton();

  return (
    <div className="space-y-3 w-full max-w-sm mx-auto">
      <div className="text-center space-y-1">
        <p className="text-sm text-gold-400/70 tracking-widest">診断結果URLを発行</p>
      </div>

      {/* 簡易版URLをコピー */}
      <button onClick={() => free.copy(freeUrl)} className="w-full">
        <div className={`relative ornament-border rounded-xl px-6 py-4 active:bg-navy-800/50 flex items-center justify-center gap-2 transition-colors duration-300 ${
          free.copied ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-navy-900/40"
        }`}>
          {free.copied ? (
            <span className="text-base tracking-[0.15em] text-emerald-300 font-bold">
              コピーしました
            </span>
          ) : (
            <span className="text-base tracking-[0.15em] text-gold-gradient font-bold">
              簡易版URLをコピー
            </span>
          )}
        </div>
      </button>

      {/* 完全版URLをコピー */}
      <button onClick={() => full.copy(fullUrl)} className="w-full">
        <div className={`relative ornament-border rounded-xl px-6 py-4 active:bg-navy-800/50 flex items-center justify-center gap-2 transition-colors duration-300 ${
          full.copied ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-gold-500/10 border border-gold-500/30"
        }`}>
          {full.copied ? (
            <span className="text-base tracking-[0.15em] text-emerald-300 font-bold">
              コピーしました
            </span>
          ) : (
            <span className="text-base tracking-[0.15em] text-gold-gradient font-bold">
              完全版URLをコピー
            </span>
          )}
        </div>
      </button>

      {/* LINE友だち追加 */}
      <a
        href={LINE_ADD_FRIEND_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-full block"
      >
        <div className="relative ornament-border rounded-xl px-6 py-3 bg-[#06C755]/10 border border-[#06C755]/25 active:bg-[#06C755]/20 flex items-center justify-center gap-3">
          <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="#06C755">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          <span className="text-sm tracking-[0.15em] text-[#06C755]/90 font-medium">
            LINE友だち追加
          </span>
        </div>
      </a>
    </div>
  );
}
