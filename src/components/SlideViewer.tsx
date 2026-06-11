"use client";

import { useState, useCallback, useEffect } from "react";

interface SlideViewerProps {
  children: React.ReactNode[];
  slideLabels?: string[];
  onSlideChange?: (index: number) => void;
}

export function SlideViewer({ children, slideLabels, onSlideChange }: SlideViewerProps) {
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
      {/* スライドコンテナ - 現在±1のみレンダリング */}
      <div className="h-full">
        {children.map((child, i) => {
          // 現在のスライドと前後1枚のみDOMに存在させる
          if (Math.abs(i - current) > 1) return null;

          const isActive = i === current;

          return (
            <div
              key={i}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 10 : 0,
                transition: 'opacity 200ms ease-out',
              }}
            >
              <div className="h-full pb-20 overflow-y-auto overscroll-contain">
                {child}
              </div>
            </div>
          );
        })}
      </div>

      {/* 下部ナビゲーション */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-navy-950/90 border-t border-gold-500/10 safe-area-bottom">
        <div className="flex items-center justify-between max-w-md mx-auto px-4 py-2.5">
          {/* 戻るボタン */}
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium tracking-wider ${
              current === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-navy-800/80 border border-gold-500/20 text-gold-400/80 active:bg-navy-700/80'
            }`}
            aria-label="前へ"
          >
            <span className="text-base">‹</span>
            戻る
          </button>

          {/* ページ表示 */}
          <div className="text-center">
            <span className="text-sm text-gold-400/80 font-medium">
              {current + 1} / {total}
            </span>
            {slideLabels && slideLabels[current] && (
              <span className="block text-[0.6rem] text-navy-400 tracking-widest mt-0.5">
                {slideLabels[current]}
              </span>
            )}
          </div>

          {/* 次へボタン */}
          <button
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium tracking-wider ${
              current === total - 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-gold-500/15 border border-gold-500/30 text-gold-300 active:bg-gold-500/25'
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
