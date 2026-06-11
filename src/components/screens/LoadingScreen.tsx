"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "星の配置を読んでいます",
  "運命の流れを辿っています",
  "あなたの星を見つけました",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((prev) => Math.min(prev + 1, MESSAGES.length - 1));
    }, 500);
    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 3, 100));
    }, 40);
    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="flex flex-col items-center gap-6">
        {/* CSSのみの陰陽シンボル */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36">
          <div className="absolute inset-0 rounded-full border border-gold-500/30 animate-slow-spin" />
          <div className="absolute inset-2 rounded-full border border-gold-500/15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl font-black text-gold-gradient">
              占
            </span>
          </div>
          {/* 4つの点が回転 */}
          <div className="absolute inset-0 animate-slow-spin">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gold-500/60"
                style={{
                  left: `${50 + Math.cos(i * Math.PI / 2) * 46}%`,
                  top: `${50 + Math.sin(i * Math.PI / 2) * 46}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center space-y-3 min-w-[240px]">
          <p className="text-gold-400/90 text-base sm:text-lg tracking-[0.15em]">
            {MESSAGES[messageIndex]}...
          </p>
          <div className="relative w-40 sm:w-48 h-[2px] mx-auto bg-navy-800 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 rounded-full"
              style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
