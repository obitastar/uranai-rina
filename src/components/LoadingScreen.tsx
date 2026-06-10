"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "天の気を読み取っています...",
  "四柱を立てています...",
  "命式を解読しています...",
  "運命の糸を紐解いています...",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 min-h-screen bg-navy-950">
      <div className="flex flex-col items-center gap-10">
        {/* 八卦風の回転シンボル */}
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-slow-spin">
            {/* 外円 */}
            <circle
              cx="100" cy="100" r="90"
              fill="none" stroke="#d4a017" strokeWidth="0.5"
              strokeDasharray="8 4"
            />
            {/* 内円 */}
            <circle
              cx="100" cy="100" r="60"
              fill="none" stroke="#d4a017" strokeWidth="0.3"
              strokeDasharray="4 8"
            />
            {/* 十字 */}
            <line x1="100" y1="15" x2="100" y2="185" stroke="#d4a017" strokeWidth="0.3" opacity="0.5" />
            <line x1="15" y1="100" x2="185" y2="100" stroke="#d4a017" strokeWidth="0.3" opacity="0.5" />
            {/* 斜め十字 */}
            <line x1="30" y1="30" x2="170" y2="170" stroke="#d4a017" strokeWidth="0.2" opacity="0.3" />
            <line x1="170" y1="30" x2="30" y2="170" stroke="#d4a017" strokeWidth="0.2" opacity="0.3" />
          </svg>

          {/* 中央の光 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gold-500 animate-shimmer" />
          </div>
        </div>

        {/* メッセージ */}
        <div className="text-center space-y-4">
          <p className="text-gold-400 text-lg tracking-[0.2em] min-h-[2em] transition-opacity">
            {MESSAGES[messageIndex]}
          </p>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gold-500"
                style={{
                  animation: `gentlePulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
