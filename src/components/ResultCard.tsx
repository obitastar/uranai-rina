"use client";

import { useEffect, useRef, useState } from "react";

interface ResultCardProps {
  title: string;
  subtitle: string;
  icon: string;
  content: string;
}

export function ResultCard({ title, subtitle, icon, content }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`card-glow ornament-border rounded-2xl bg-navy-900/40 backdrop-blur-md overflow-hidden transition-all duration-1000 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
      }`}
    >
      {/* 上部のアクセントライン */}
      <div className="h-[1px] w-full animate-glow-line" />

      <div className="p-7">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-lg" />
            <div className="relative w-12 h-12 rounded-full bg-navy-800/80 border border-gold-500/30 flex items-center justify-center">
              <span className="text-gold-400 text-xl">{icon}</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gold-gradient tracking-wider">
              {title}
            </h2>
            <p className="text-xs text-navy-400/80 tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent mb-5" />

        <p className="text-navy-100/90 leading-[1.9] text-[0.95rem] tracking-wide">{content}</p>
      </div>
    </div>
  );
}
