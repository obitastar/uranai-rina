"use client";

import { useState, useEffect } from "react";
import type { FortuneResult } from "@/lib/shichusuimei";
import { kanshiName } from "@/lib/shichusuimei";
import { SlideViewer } from "@/components/SlideViewer";
import { PillarChart } from "@/components/PillarChart";
import { ZodiacCharacter, ZodiacBadge } from "@/components/ZodiacCharacter";
import { SectionIcon, SECTION_COLORS } from "@/components/SectionIcon";

interface ResultScreenProps {
  result: FortuneResult;
  onRetry: () => void;
  onTop: () => void;
}

export function ResultScreen({ result, onRetry, onTop }: ResultScreenProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  const { input, fourPillars } = result;
  const birthLabel = `${input.year}年${input.month}月${input.day}日${input.hour !== null ? ` ${input.hour}時` : ""}生`;
  const currentYear = new Date().getFullYear();

  return (
    <div className={`w-full h-screen transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
      <SlideViewer>
        {/* ===== スライド1: 命式表 + 干支キャラ ===== */}
        <div className="flex flex-col items-center justify-center h-full px-6 py-10 overflow-y-auto">
          <div className="w-full max-w-lg space-y-6">
            <div className="text-center space-y-2 animate-fade-in-down">
              <p className="text-sm text-navy-400/60 tracking-[0.2em]">{birthLabel}</p>
              <h1 className="text-4xl font-black tracking-[0.4em] text-gold-gradient-animated">
                鑑定結果
              </h1>
              <div className="w-24 h-[1px] mx-auto animate-glow-line" />
            </div>

            <div className="animate-reveal-up opacity-0 stagger-1">
              <PillarChart result={result} />
            </div>

            <div className="animate-reveal-up opacity-0 stagger-2">
              <div className="ornament-border rounded-2xl bg-navy-900/40 backdrop-blur-md p-6">
                <h3 className="text-center text-sm text-gold-500/70 tracking-widest mb-5">あなたの守護干支</h3>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <p className="text-[0.55rem] text-navy-500 tracking-widest mb-3">日支</p>
                    <ZodiacCharacter shi={fourPillars.day.shi} size="md" />
                  </div>
                  <div className="text-center">
                    <p className="text-[0.55rem] text-navy-500 tracking-widest mb-3">年支</p>
                    <ZodiacCharacter shi={fourPillars.year.shi} size="md" />
                  </div>
                </div>
                <div className="flex justify-center mt-5 gap-3 flex-wrap">
                  <ZodiacBadge shi={fourPillars.month.shi} />
                  {fourPillars.hour && <ZodiacBadge shi={fourPillars.hour.shi} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== スライド2: 本質 ===== */}
        <SlideContent
          iconType="essence"
          title="本質"
          subtitle={`日主: ${result.nicchu}`}
          accentColor={SECTION_COLORS.essence.primary}
          content={result.readings.essence}
          extra={
            <div className="mt-5 flex justify-center">
              <ZodiacCharacter shi={fourPillars.day.shi} size="lg" />
            </div>
          }
        />

        {/* ===== スライド3: 恋愛運 ===== */}
        <SlideContent
          iconType="love"
          title="恋愛運"
          subtitle={result.zokanTsuhensei}
          accentColor={SECTION_COLORS.love.primary}
          content={result.readings.love}
        />

        {/* ===== スライド4: 仕事運 ===== */}
        <SlideContent
          iconType="work"
          title="仕事運"
          subtitle={result.tpiMonth}
          accentColor={SECTION_COLORS.work.primary}
          content={result.readings.work}
        />

        {/* ===== スライド5: 今年の運勢 ===== */}
        <SlideContent
          iconType="yearly"
          title={`${currentYear}年の運勢`}
          subtitle={`流年: ${kanshiName(result.currentYearKanshi)} / ${result.currentYearTsuhensei}`}
          accentColor={SECTION_COLORS.yearly.primary}
          content={result.readings.yearly}
          extra={
            <div className="mt-5 flex justify-center">
              <ZodiacCharacter shi={result.currentYearKanshi.shi} size="md" />
            </div>
          }
        />

        {/* ===== スライド6: 締め ===== */}
        <div className="flex flex-col items-center justify-center h-full px-6">
          <div className="text-center space-y-8 max-w-sm">
            <div className="animate-fade-in-scale">
              <SectionIcon type="complete" size={100} />
            </div>

            <div className="space-y-3 animate-fade-in-up stagger-1 opacity-0">
              <h2 className="text-3xl font-black text-gold-gradient-animated tracking-[0.3em]">
                鑑定完了
              </h2>
              <div className="w-20 h-[1px] mx-auto animate-glow-line" />
              <p className="text-navy-300/70 text-sm leading-relaxed tracking-wide mt-4">
                今日の鑑定が<br />
                あなたの明日を照らす<br />
                小さな灯りとなりますように
              </p>
            </div>

            <div className="space-y-4 animate-fade-in-up stagger-2 opacity-0 pt-4">
              <button
                onClick={onRetry}
                className="group relative w-full"
              >
                <div className="absolute inset-0 rounded-xl bg-gold-500/15 blur-xl group-hover:bg-gold-500/25 transition-all duration-500" />
                <div className="relative ornament-border rounded-xl px-8 py-5 bg-navy-900/50 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-500">
                  <span className="text-lg tracking-[0.25em] text-gold-gradient-animated font-bold">
                    もう一度鑑定する
                  </span>
                </div>
              </button>
              <button
                onClick={onTop}
                className="text-navy-500 hover:text-gold-500/50 text-sm tracking-widest transition-colors duration-300"
              >
                トップに戻る
              </button>
            </div>
          </div>
        </div>
      </SlideViewer>
    </div>
  );
}

// 各スライドの共通コンポーネント
function SlideContent({
  iconType,
  title,
  subtitle,
  accentColor,
  content,
  extra,
}: {
  iconType: 'essence' | 'love' | 'work' | 'yearly';
  title: string;
  subtitle: string;
  accentColor: string;
  content: string;
  extra?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10 overflow-y-auto">
      <div className={`w-full max-w-lg space-y-5 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* アイコン */}
        <div className="text-center">
          <SectionIcon type={iconType} size={72} />
        </div>

        {/* タイトル */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gold-gradient-animated tracking-[0.3em]">
            {title}
          </h2>
          <p className="text-xs tracking-widest" style={{ color: `${accentColor}99` }}>
            {subtitle}
          </p>
          <div className="w-16 h-[1px] mx-auto animate-glow-line" />
        </div>

        {/* コンテンツ */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 backdrop-blur-md overflow-hidden">
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
              backgroundSize: '200% 100%',
              animation: 'glowLine 3s ease-in-out infinite',
            }}
          />
          <div className="p-6 max-h-[45vh] overflow-y-auto">
            <p className="text-navy-100/90 leading-[2.1] text-[0.92rem] tracking-wide">
              {content}
            </p>
          </div>
        </div>

        {extra}
      </div>
    </div>
  );
}
