"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SlideViewerProps {
  children: React.ReactNode[];
  onSlideChange?: (index: number) => void;
}

export function SlideViewer({ children, onSlideChange }: SlideViewerProps) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = children.length;

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(index, total - 1));
    setCurrent(next);
    onSlideChange?.(next);
  }, [total, onSlideChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
    setTouchDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - touchStart;
    setTouchDelta(delta);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(touchDelta) > 60) {
      if (touchDelta < 0 && current < total - 1) goTo(current + 1);
      if (touchDelta > 0 && current > 0) goTo(current - 1);
    }
    setTouchDelta(0);
  };

  // キーボード操作
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, goTo]);

  const dragOffset = isDragging ? touchDelta * 0.3 : 0;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* スライドコンテナ */}
      <div
        ref={containerRef}
        className="h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children.map((child, i) => {
          const offset = i - current;
          const isActive = i === current;
          const isPrev = i === current - 1;
          const isNext = i === current + 1;

          return (
            <div
              key={i}
              className="absolute inset-0 w-full h-full transition-all ease-out"
              style={{
                transform: `translateX(${offset * 100 + dragOffset}%) scale(${isActive ? 1 : 0.9})`,
                opacity: isActive ? 1 : (isPrev || isNext) ? 0.3 : 0,
                transitionDuration: isDragging ? '0ms' : '500ms',
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 10 : 0,
              }}
            >
              {child}
            </div>
          );
        })}
      </div>

      {/* ドットインジケーター */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-2 bg-gold-500'
                : 'w-2 h-2 bg-navy-600 hover:bg-navy-500'
            }`}
            aria-label={`スライド ${i + 1}`}
          />
        ))}
      </div>

      {/* 矢印ナビ */}
      {current > 0 && (
        <button
          onClick={() => goTo(current - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-navy-900/60 border border-gold-500/20 flex items-center justify-center text-gold-500/60 hover:text-gold-400 hover:border-gold-500/40 transition-all backdrop-blur-sm"
          aria-label="前へ"
        >
          ‹
        </button>
      )}
      {current < total - 1 && (
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-navy-900/60 border border-gold-500/20 flex items-center justify-center text-gold-500/60 hover:text-gold-400 hover:border-gold-500/40 transition-all backdrop-blur-sm"
          aria-label="次へ"
        >
          ›
        </button>
      )}

      {/* スワイプヒント（最初のスライドのみ） */}
      {current === 0 && (
        <div className="absolute bottom-14 left-0 right-0 text-center z-20 animate-fade-in">
          <p className="text-navy-500 text-xs tracking-widest animate-gentle-pulse">
            ← スワイプで次へ →
          </p>
        </div>
      )}
    </div>
  );
}
