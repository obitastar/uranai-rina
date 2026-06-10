"use client";

import { useRouter } from "next/navigation";
import { StarField } from "@/components/StarField";

export default function TopPage() {
  const router = useRouter();

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <StarField />

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* 装飾的な円 */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl scale-150" />
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-slow-spin">
              <circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="0.5"
                strokeDasharray="4 6"
              />
              <circle
                cx="100" cy="100" r="75"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="0.3"
                strokeDasharray="2 8"
              />
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f9db66" />
                  <stop offset="50%" stopColor="#d4a017" />
                  <stop offset="100%" stopColor="#f9db66" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-6xl text-gold-gradient font-bold">命</span>
          </div>
        </div>

        {/* タイトル */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-[0.3em] text-gold-gradient">
            四柱推命
          </h1>
          <p className="text-lg text-navy-200 tracking-[0.2em]">
            運命鑑定
          </p>
          <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <p className="text-sm text-navy-300 leading-relaxed max-w-xs mx-auto">
            生年月日と出生時刻から<br />
            あなたの本質・恋愛・仕事・運勢を<br />
            読み解きます
          </p>
        </div>

        {/* 開始ボタン */}
        <button
          onClick={() => router.push("/input")}
          className="group relative mt-4"
        >
          <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl group-hover:bg-gold-500/30 transition-all" />
          <div className="relative ornament-border rounded-full px-16 py-5 bg-navy-900/80 hover:bg-navy-800/80 transition-all">
            <span className="text-xl tracking-[0.3em] text-gold-gradient font-medium">
              鑑定を始める
            </span>
          </div>
        </button>
      </div>
    </main>
  );
}
