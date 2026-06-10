"use client";

import { useState, useEffect } from "react";
import type { FortuneResult, YearlyFortune, GogyoBalance } from "@/lib/shichusuimei";
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
        <div className="flex flex-col items-center justify-start h-full px-4 sm:px-6 py-6 sm:py-10 overflow-y-auto">
          <div className="w-full max-w-lg space-y-4 sm:space-y-6">
            <div className="text-center space-y-2 animate-fade-in-down">
              <p className="text-sm sm:text-base text-navy-300/70 tracking-[0.2em]">{birthLabel}</p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-[0.3em] sm:tracking-[0.4em] text-gold-gradient-animated">
                鑑定結果
              </h1>
              <div className="w-16 sm:w-24 h-[1px] mx-auto animate-glow-line" />
              <p className="text-sm sm:text-base text-navy-200/60 leading-relaxed">
                四柱推命に基づき、あなたの命式を算出しました
              </p>
            </div>

            <div className="animate-reveal-up opacity-0 stagger-1">
              <PillarChart result={result} />
            </div>

            <div className="animate-reveal-up opacity-0 stagger-2">
              <div className="ornament-border rounded-2xl bg-navy-900/40 backdrop-blur-md p-4 sm:p-6">
                <h3 className="text-center text-sm sm:text-base text-gold-500/80 tracking-widest mb-3 sm:mb-5">あなたの守護干支</h3>
                <div className="flex justify-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-navy-400 tracking-widest mb-2 sm:mb-3">日支</p>
                    <ZodiacCharacter shi={fourPillars.day.shi} size="md" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-navy-400 tracking-widest mb-2 sm:mb-3">年支</p>
                    <ZodiacCharacter shi={fourPillars.year.shi} size="md" />
                  </div>
                </div>
                <div className="flex justify-center mt-3 sm:mt-5 gap-2 sm:gap-3 flex-wrap">
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
          subtitle={`${result.nisshuDetail.symbol}の人 ── ${result.nisshuDetail.catchphrase}`}
          description="生まれた日の天干（日主）から読み解く、あなたの生まれ持った性格や本質的な気質です。"
          accentColor={SECTION_COLORS.essence.primary}
          content={result.readings.essence}
          extra={
            <div className="space-y-4 mt-4">
              <div className="flex justify-center gap-2 flex-wrap">
                {result.nisshuDetail.keywords.map(kw => (
                  <span key={kw} className="px-3 py-1.5 rounded-full text-sm tracking-wider border border-purple-400/30 text-purple-200/90 bg-purple-500/10">
                    {kw}
                  </span>
                ))}
              </div>
              <div className="ornament-border rounded-xl bg-navy-900/30 p-4">
                <p className="text-sm text-gold-500/70 tracking-widest mb-2 text-center">
                  十二運「{result.juniunDay}」── {result.juniunDayDetail.catchphrase}
                </p>
                <p className="text-navy-100/80 text-base leading-[2] tracking-wide">
                  {result.juniunDayDetail.message}
                </p>
              </div>
              <div className="flex justify-center">
                <ZodiacCharacter shi={fourPillars.day.shi} size="xl" />
              </div>
            </div>
          }
        />

        {/* ===== スライド3: 恋愛運 ===== */}
        <SlideContent
          iconType="love"
          title="恋愛運"
          subtitle={`蔵干通変星「${result.zokanTsuhensei}」`}
          description="日支の蔵干（内面に隠された星）から、恋愛傾向やパートナーとの関わり方を読み解きます。"
          accentColor={SECTION_COLORS.love.primary}
          content={result.readings.love}
        />

        {/* ===== スライド4: 仕事運 ===== */}
        <SlideContent
          iconType="work"
          title="仕事運"
          subtitle={`月柱通変星「${result.tpiMonth}」── ${result.tsuhenseiDetail.catchphrase}`}
          description="月柱の通変星から、社会での役割・適職・仕事での才能と注意点を診断します。"
          accentColor={SECTION_COLORS.work.primary}
          content={result.readings.work}
          extra={
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-emerald-400/80 tracking-widest mb-2 text-center font-medium">才能</p>
                  <p className="text-navy-100/80 text-sm sm:text-base leading-[1.9]">{result.tsuhenseiDetail.talent}</p>
                </div>
                <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-amber-400/80 tracking-widest mb-2 text-center font-medium">注意点</p>
                  <p className="text-navy-100/80 text-sm sm:text-base leading-[1.9]">{result.tsuhenseiDetail.caution}</p>
                </div>
              </div>
            </div>
          }
        />

        {/* ===== スライド5: 五行バランス ===== */}
        <GogyoSlide gogyoBalance={result.gogyoBalance} gogyoReading={result.gogyoReading} />

        {/* ===== スライド6: 今年の運勢 ===== */}
        <SlideContent
          iconType="yearly"
          title={`${currentYear}年の運勢`}
          subtitle={`${result.nenunDetail.title} ── ${kanshiName(result.currentYearKanshi)} / ${result.currentYearTsuhensei}`}
          description="今年の干支とあなたの日主の関係から、今年一年の運気の流れとテーマを読み解きます。"
          accentColor={SECTION_COLORS.yearly.primary}
          content={result.readings.yearly}
          extra={
            <div className="space-y-4 mt-4">
              <div className="ornament-border rounded-xl bg-navy-900/30 p-4">
                <p className="text-sm text-emerald-400/70 tracking-widest mb-2 text-center font-medium">おすすめの過ごし方</p>
                <p className="text-navy-50/90 text-base sm:text-lg leading-[2] tracking-wide text-center">
                  {result.nenunDetail.luckyAction}
                </p>
              </div>
              <div className="flex justify-center">
                <ZodiacCharacter shi={result.currentYearKanshi.shi} size="xl" />
              </div>
            </div>
          }
        />

        {/* ===== スライド7: 10年運勢 ===== */}
        <DecadeSlide tenYearFortune={result.tenYearFortune} />

        {/* ===== スライド8: 締め ===== */}
        <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6">
          <div className="text-center space-y-5 sm:space-y-8 max-w-sm">
            <div className="animate-fade-in-scale">
              <SectionIcon type="complete" size={80} />
            </div>

            <div className="space-y-2 sm:space-y-3 animate-fade-in-up stagger-1 opacity-0">
              <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient-animated tracking-[0.2em] sm:tracking-[0.3em]">
                鑑定完了
              </h2>
              <div className="w-16 sm:w-20 h-[1px] mx-auto animate-glow-line" />
              <p className="text-navy-200/80 text-sm sm:text-base leading-relaxed tracking-wide mt-3 sm:mt-4">
                今日の鑑定が<br />
                あなたの明日を照らす<br />
                小さな灯りとなりますように
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 animate-fade-in-up stagger-2 opacity-0 pt-2 sm:pt-4">
              <button
                onClick={onRetry}
                className="group relative w-full"
              >
                <div className="absolute inset-0 rounded-xl bg-gold-500/15 blur-xl group-hover:bg-gold-500/25 transition-all duration-500" />
                <div className="relative ornament-border rounded-xl px-6 sm:px-8 py-4 sm:py-5 bg-navy-900/50 backdrop-blur-sm hover:bg-navy-800/50 transition-all duration-500">
                  <span className="text-base sm:text-lg tracking-[0.2em] sm:tracking-[0.25em] text-gold-gradient-animated font-bold">
                    もう一度鑑定する
                  </span>
                </div>
              </button>
              <button
                onClick={onTop}
                className="text-navy-400 hover:text-gold-500/60 text-sm sm:text-base tracking-widest transition-colors duration-300"
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
  description,
  accentColor,
  content,
  extra,
}: {
  iconType: 'essence' | 'love' | 'work' | 'yearly' | 'decade' | 'gogyo';
  title: string;
  subtitle: string;
  description: string;
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
    <div className="flex flex-col items-center justify-start h-full px-4 sm:px-6 py-5 sm:py-8 overflow-y-auto">
      <div className={`w-full max-w-lg space-y-3 sm:space-y-4 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* アイコン */}
        <div className="text-center">
          <SectionIcon type={iconType} size={48} />
        </div>

        {/* タイトル */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient-animated tracking-[0.2em] sm:tracking-[0.3em]">
            {title}
          </h2>
          <p className="text-sm sm:text-base font-medium tracking-widest leading-relaxed" style={{ color: `${accentColor}CC` }}>
            {subtitle}
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto animate-glow-line" />
        </div>

        {/* 説明文 */}
        <p className="text-center text-sm sm:text-base text-navy-300/70 leading-relaxed tracking-wide px-2">
          {description}
        </p>

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
          <div className="p-4 sm:p-5 max-h-[40vh] overflow-y-auto">
            <p className="text-navy-50/90 leading-[2] sm:leading-[2.2] text-base sm:text-lg tracking-wide">
              {content}
            </p>
          </div>
        </div>

        {extra}
      </div>
    </div>
  );
}

// 五行の色
const GOGYO_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  '木': { bg: 'bg-green-500/15', text: 'text-green-400', bar: 'bg-green-400' },
  '火': { bg: 'bg-red-500/15', text: 'text-red-400', bar: 'bg-red-400' },
  '土': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', bar: 'bg-yellow-400' },
  '金': { bg: 'bg-slate-300/15', text: 'text-slate-300', bar: 'bg-slate-300' },
  '水': { bg: 'bg-blue-500/15', text: 'text-blue-400', bar: 'bg-blue-400' },
};

// 五行バランスのスライド
function GogyoSlide({ gogyoBalance, gogyoReading }: { gogyoBalance: GogyoBalance[]; gogyoReading: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const maxCount = Math.max(...gogyoBalance.map(g => g.count), 1);
  const accentColor = SECTION_COLORS.gogyo.primary;

  return (
    <div className="flex flex-col items-center justify-start h-full px-4 sm:px-6 py-5 sm:py-8 overflow-y-auto">
      <div className={`w-full max-w-lg space-y-3 sm:space-y-5 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center">
          <SectionIcon type="gogyo" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient-animated tracking-[0.2em] sm:tracking-[0.3em]">
            五行バランス
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            木 ・ 火 ・ 土 ・ 金 ・ 水
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto animate-glow-line" />
        </div>

        {/* 説明文 */}
        <p className="text-center text-sm sm:text-base text-navy-300/70 leading-relaxed tracking-wide px-2">
          命式に含まれる五行（木・火・土・金・水）の偏りから、あなたの気質の傾向を診断します。
        </p>

        {/* バーチャート */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 backdrop-blur-md p-4 sm:p-5 space-y-3 sm:space-y-4">
          {gogyoBalance.map(({ gogyo, count }) => {
            const colors = GOGYO_COLORS[gogyo];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={gogyo} className="flex items-center gap-2 sm:gap-3">
                <span className={`w-7 sm:w-9 text-center text-lg sm:text-xl font-bold ${colors.text}`}>{gogyo}</span>
                <div className="flex-1 h-6 sm:h-7 rounded-full bg-navy-800/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar} transition-all duration-1000`}
                    style={{ width: `${pct}%`, opacity: 0.7 }}
                  />
                </div>
                <span className="w-6 sm:w-7 text-center text-sm sm:text-base text-navy-200/90 font-medium">{count}</span>
              </div>
            );
          })}
        </div>

        {/* 鑑定文 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 backdrop-blur-md overflow-hidden">
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
              backgroundSize: '200% 100%',
              animation: 'glowLine 3s ease-in-out infinite',
            }}
          />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[2] sm:leading-[2.2] text-base sm:text-lg tracking-wide">
              {gogyoReading}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 運勢レベルの色
function fortuneColor(juniunsei: string): { bg: string; border: string; text: string; dot: string } {
  const good = ['長生', '冠帯', '建禄', '帝旺'];
  const caution = ['病', '死', '絶'];
  if (good.includes(juniunsei)) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' };
  if (caution.includes(juniunsei)) return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' };
  return { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', dot: 'bg-sky-400' };
}

// 10年運勢スライド
function DecadeSlide({ tenYearFortune }: { tenYearFortune: YearlyFortune[] }) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const currentYear = new Date().getFullYear();
  const accentColor = SECTION_COLORS.decade.primary;

  return (
    <div className="flex flex-col items-center justify-start h-full px-4 sm:px-6 py-5 sm:py-8 overflow-y-auto">
      <div className={`w-full max-w-lg space-y-3 sm:space-y-4 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center">
          <SectionIcon type="decade" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-gold-gradient-animated tracking-[0.2em] sm:tracking-[0.3em]">
            10年運勢
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            {currentYear}年 〜 {currentYear + 9}年
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto animate-glow-line" />
        </div>

        {/* 説明文 */}
        <p className="text-center text-sm sm:text-base text-navy-300/70 leading-relaxed tracking-wide px-2">
          毎年の干支とあなたの日主の関係から、向こう10年間の運気の波を一覧で表示しています。
        </p>

        <div className="space-y-1.5 sm:space-y-2 pb-2 sm:pb-4">
          {tenYearFortune.map((yf, idx) => {
            const colors = fortuneColor(yf.juniunsei);
            const isExpanded = expanded === idx;
            const isCurrentYear = yf.year === currentYear;

            return (
              <button
                key={yf.year}
                onClick={() => setExpanded(isExpanded ? null : idx)}
                className={`w-full text-left transition-all duration-300 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm ${isCurrentYear ? 'ring-1 ring-gold-500/30' : ''}`}
              >
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
                  <div className="flex-shrink-0 w-12 sm:w-14 text-center">
                    <span className={`text-sm sm:text-base font-bold ${isCurrentYear ? 'text-gold-400' : 'text-navy-100/90'}`}>
                      {yf.year}
                    </span>
                  </div>
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${colors.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-navy-50/90 text-sm sm:text-base font-medium">
                        {kanshiName(yf.kanshi)}
                      </span>
                      <span className={`text-xs sm:text-sm ${colors.text}`}>
                        {yf.tsuhensei}
                      </span>
                      <span className="text-navy-400 text-xs sm:text-sm">
                        {yf.juniunsei}
                      </span>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 text-navy-400 text-xs sm:text-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-navy-700/30">
                    <p className="text-navy-100/90 text-sm sm:text-base leading-[1.9] sm:leading-[2] tracking-wide">
                      {yf.reading}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
