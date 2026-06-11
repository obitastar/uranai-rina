"use client";

import { useState, useCallback, useEffect } from "react";

interface SlideViewerProps {
  children: React.ReactNode[];
  onSlideChange?: (index: number) => void;
}

export function SlideViewer({ children, onSlideChange }: SlideViewerProps) {
  const [current, setCurrent] = useState(0);
  const total = children.length;

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(index, total - 1));
    setCurrent(next);
    onSlideChange?.(next);
  }, [total, onSlideChange]);

  // キーボード操作
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, goTo]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* スライドコンテナ */}
      <div className="h-full">
        {children.map((child, i) => {
          const offset = i - current;
          const isActive = i === current;

          return (
            <div
              key={i}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `translateX(${offset * 100}%)`,
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 10 : 0,
                transition: 'transform 200ms ease-out, opacity 150ms ease-out',
                willChange: isActive ? 'auto' : 'transform',
              }}
            >
              <div className="h-full pb-16 sm:pb-20 overflow-y-auto overscroll-contain">
                {child}
              </div>
            </div>
          );
        })}
      </div>

      {/* 下部ナビゲーション */}
      <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 z-20 px-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* 戻るボタン */}
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium tracking-wider transition-opacity duration-150 ${
              current === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-navy-800/80 border border-gold-500/20 text-gold-400/80 active:opacity-70'
            }`}
            aria-label="前へ"
          >
            <span className="text-base">‹</span>
            戻る
          </button>

          {/* ドットインジケーター */}
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-150 ${
                  i === current
                    ? 'w-5 h-1.5 bg-gold-500'
                    : 'w-1.5 h-1.5 bg-navy-600'
                }`}
              />
            ))}
          </div>

          {/* 次へボタン */}
          <button
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium tracking-wider transition-opacity duration-150 ${
              current === total - 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-gold-500/15 border border-gold-500/30 text-gold-300 active:opacity-70'
            }`}
            aria-label="次へ"
          >
            次へ
            <span className="text-base">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
