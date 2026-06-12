"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface SlideViewerProps {
  children: React.ReactNode[];
  slideLabels?: string[];
  onSlideChange?: (index: number) => void;
  visibleIndices?: number[];
}

export function SlideViewer({ children, slideLabels, onSlideChange, visibleIndices }: SlideViewerProps) {
  const [current, setCurrent] = useState(0);

  // visibleIndicesが指定されたら、そのインデックスのスライドだけ表示
  const slides = visibleIndices
    ? visibleIndices.map(i => children[i]).filter(Boolean)
    : children;
  const labels = visibleIndices && slideLabels
    ? visibleIndices.map(i => slideLabels[i]).filter(Boolean) as string[]
    : slideLabels;
  const total = slides.length;

  // スワイプ用
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

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

  // スワイプハンドラー
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    const dx = Math.abs(touchEndX.current - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // 水平方向の動きが垂直より大きければスワイプ判定
    if (dx > 10 && dx > dy) {
      isSwiping.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) {
      goTo(current + 1); // 左スワイプ → 次へ
    } else if (diff < -threshold) {
      goTo(current - 1); // 右スワイプ → 戻る
    }
    isSwiping.current = false;
  }, [current, goTo]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* スライドコンテナ - 現在±1のみレンダリング */}
      <div className="h-full">
        {slides.map((child, i) => {
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
              <div className="h-full pb-16 sm:pb-20 overflow-y-auto overscroll-contain">
                {child}
              </div>
            </div>
          );
        })}
      </div>

      {/* 下部ナビゲーション */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-navy-950/90 backdrop-blur-sm border-t border-gold-500/10 safe-area-bottom">
        <div className="flex items-center justify-between max-w-md mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
          {/* 戻るボタン */}
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className={`flex items-center gap-1 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wider min-h-[36px] sm:min-h-[40px] ${
              current === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-navy-800/80 border border-gold-500/20 text-gold-400/80 active:bg-navy-700/80'
            }`}
            aria-label="前へ"
          >
            <span className="text-sm sm:text-base">‹</span>
            戻る
          </button>

          {/* ページ表示 */}
          <div className="text-center min-w-0">
            <span className="text-xs sm:text-sm text-gold-400/80 font-medium">
              {current + 1} / {total}
            </span>
            {labels && labels[current] && (
              <span className="block text-[0.55rem] sm:text-[0.6rem] text-navy-400 tracking-widest mt-0.5 truncate max-w-[100px] sm:max-w-none mx-auto">
                {labels[current]}
              </span>
            )}
          </div>

          {/* 次へボタン */}
          <button
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            className={`flex items-center gap-1 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wider min-h-[36px] sm:min-h-[40px] ${
              current === total - 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-gold-500/15 border border-gold-500/30 text-gold-300 active:bg-gold-500/25'
            }`}
            aria-label="次へ"
          >
            次へ
            <span className="text-sm sm:text-base">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
