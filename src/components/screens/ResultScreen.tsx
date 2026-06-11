"use client";

import { useState, useEffect } from "react";
import type { FortuneResult, YearlyFortune, GogyoBalance } from "@/lib/shichusuimei";
import { SlideViewer } from "@/components/SlideViewer";
import { PillarChart } from "@/components/PillarChart";
import { ZodiacCharacter, ZodiacBadge } from "@/components/ZodiacCharacter";
import { SectionIcon, SECTION_COLORS } from "@/components/SectionIcon";

interface ResultScreenProps {
  result: FortuneResult;
  onRetry: () => void;
  onTop: () => void;
}

const SLIDE_LABELS = ["命式表", "本質", "恋愛運", "仕事運", "五行", "今年", "10年運勢", "完了"];

export function ResultScreen({ result, onRetry, onTop }: ResultScreenProps) {
  const { input, fourPillars } = result;
  const birthLabel = `${input.year}年${input.month}月${input.day}日${input.hour !== null ? ` ${input.hour}時` : ""}生`;
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full h-screen">
      <SlideViewer slideLabels={SLIDE_LABELS}>
        {/* ===== スライド1: 命式表 + 干支キャラ ===== */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-lg space-y-4 sm:space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm sm:text-base text-navy-300/70 tracking-[0.2em]">{birthLabel}</p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-[0.3em] sm:tracking-[0.4em] text-gold-gradient">
                鑑定結果
              </h1>
              <div className="w-16 sm:w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <p className="text-sm sm:text-base text-navy-200/60 leading-relaxed">
                生年月日から、あなたの運命の星を読み解きました
              </p>
            </div>

            <PillarChart result={result} />

            <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-6">
              <h3 className="text-center text-sm sm:text-base text-gold-500/80 tracking-widest mb-3 sm:mb-5">あなたの守護動物</h3>
              <div className="flex justify-center gap-4 sm:gap-8">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-navy-400 tracking-widest mb-2 sm:mb-3">生まれ日</p>
                  <ZodiacCharacter shi={fourPillars.day.shi} size="md" />
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-navy-400 tracking-widest mb-2 sm:mb-3">生まれ年</p>
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

        {/* ===== スライド2: 本質 ===== */}
        <SlideContent
          iconType="essence"
          title="本質"
          subtitle={`${result.nisshuDetail.symbol}の人 ── ${result.nisshuDetail.catchphrase}`}
          description={<>あなたの<ruby>日主<rt className="text-[0.5rem] opacity-60">にっしゅ</rt></ruby>── 生まれた日の星から読み解く、生まれ持った性格や本質的な気質です。</>}
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
                  <ruby>十二運<rt className="text-[0.5rem] opacity-60">じゅうにうん</rt></ruby>「{result.juniunDay}」── {result.juniunDayDetail.catchphrase}
                </p>
                <p className="text-navy-100/80 text-sm leading-[1.9] tracking-wide">
                  {result.juniunDayDetail.message}
                </p>
              </div>
              <div className="flex justify-center">
                <ZodiacCharacter shi={fourPillars.day.shi} size="lg" />
              </div>
            </div>
          }
        />

        {/* ===== スライド3: 恋愛運 ===== */}
        <SlideContent
          iconType="love"
          title="恋愛運"
          subtitle={`内面の星「${result.zokanTsuhensei}」`}
          description={<>あなたの内面に秘められた星（<ruby>通変星<rt className="text-[0.5rem] opacity-60">つうへんせい</rt></ruby>）から、恋愛傾向やパートナーとの関わり方を読み解きます。</>}
          accentColor={SECTION_COLORS.love.primary}
          content={result.readings.love}
        />

        {/* ===== スライド4: 仕事運 ===== */}
        <SlideContent
          iconType="work"
          title="仕事運"
          subtitle={`社会運の星「${result.tpiMonth}」── ${result.tsuhenseiDetail.catchphrase}`}
          description={<>社会での役割を表す<ruby>通変星<rt className="text-[0.5rem] opacity-60">つうへんせい</rt></ruby>から、あなたの適職・仕事での才能と注意点を診断します。</>}
          accentColor={SECTION_COLORS.work.primary}
          content={result.readings.work}
          extra={
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-emerald-400/80 tracking-widest mb-2 text-center font-medium">才能</p>
                  <p className="text-navy-100/80 text-sm leading-[1.9]">{result.tsuhenseiDetail.talent}</p>
                </div>
                <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-amber-400/80 tracking-widest mb-2 text-center font-medium">注意点</p>
                  <p className="text-navy-100/80 text-sm leading-[1.9]">{result.tsuhenseiDetail.caution}</p>
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
          subtitle={`${result.nenunDetail.title} ── 今年の星「${result.currentYearTsuhensei}」`}
          description={<>今年の星の巡り（<ruby>年運<rt className="text-[0.5rem] opacity-60">ねんうん</rt></ruby>）から、一年間の運気の流れとテーマを読み解きます。</>}
          accentColor={SECTION_COLORS.yearly.primary}
          content={result.readings.yearly}
          extra={
            <div className="space-y-4 mt-4">
              <div className="ornament-border rounded-xl bg-navy-900/30 p-4">
                <p className="text-sm text-emerald-400/70 tracking-widest mb-2 text-center font-medium">おすすめの過ごし方</p>
                <p className="text-navy-50/90 text-sm sm:text-base leading-[1.9] tracking-wide text-center">
                  {result.nenunDetail.luckyAction}
                </p>
              </div>
              <div className="flex justify-center">
                <ZodiacCharacter shi={result.currentYearKanshi.shi} size="lg" />
              </div>
            </div>
          }
        />

        {/* ===== スライド7: 10年運勢 ===== */}
        <DecadeSlide tenYearFortune={result.tenYearFortune} />

        {/* ===== スライド8: 締め ===== */}
        <div className="flex flex-col items-center justify-center min-h-full px-4 sm:px-6">
          <div className="text-center space-y-5 sm:space-y-8 max-w-sm">
            <SectionIcon type="complete" size={64} />

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
                鑑定完了
              </h2>
              <div className="w-16 sm:w-20 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <p className="text-navy-200/80 text-sm sm:text-base leading-relaxed tracking-wide mt-3 sm:mt-4">
                今日の鑑定が<br />
                あなたの明日を照らす<br />
                小さな灯りとなりますように
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              <button
                onClick={onRetry}
                className="group relative w-full"
              >
                <div className="relative ornament-border rounded-xl px-6 sm:px-8 py-4 sm:py-5 bg-navy-900/50 active:bg-navy-800/60">
                  <span className="text-base sm:text-lg tracking-[0.2em] sm:tracking-[0.25em] text-gold-gradient font-bold">
                    もう一度鑑定する
                  </span>
                </div>
              </button>
              <button
                onClick={onTop}
                className="text-navy-400 hover:text-gold-500/60 text-sm sm:text-base tracking-widest"
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
  description: React.ReactNode;
  accentColor: string;
  content: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        {/* アイコン */}
        <div className="text-center">
          <SectionIcon type={iconType} size={48} />
        </div>

        {/* タイトル */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            {title}
          </h2>
          <p className="text-sm sm:text-base font-medium tracking-widest leading-relaxed" style={{ color: `${accentColor}CC` }}>
            {subtitle}
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        {/* 説明文 */}
        <p className="text-center text-sm sm:text-base text-navy-300/70 leading-relaxed tracking-wide px-2">
          {description}
        </p>

        {/* コンテンツ */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
            }}
          />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
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
  const maxCount = Math.max(...gogyoBalance.map(g => g.count), 1);
  const accentColor = SECTION_COLORS.gogyo.primary;

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-5">
        <div className="text-center">
          <SectionIcon type="gogyo" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            <ruby>五行<rt className="text-[0.5rem] opacity-60">ごぎょう</rt></ruby>バランス
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            木 ・ 火 ・ 土 ・ 金 ・ 水
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-sm sm:text-base text-navy-300/70 leading-relaxed tracking-wide px-2">
          自然界の5つのエネルギー（<ruby>五行<rt className="text-[0.5rem] opacity-60">ごぎょう</rt></ruby>）のバランスから、あなたの気質の傾向を診断します。
        </p>

        {/* バーチャート */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5 space-y-3 sm:space-y-4">
          {gogyoBalance.map(({ gogyo, count }) => {
            const colors = GOGYO_COLORS[gogyo];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={gogyo} className="flex items-center gap-2 sm:gap-3">
                <span className={`w-7 sm:w-9 text-center text-lg sm:text-xl font-bold ${colors.text}`}>{gogyo}</span>
                <div className="flex-1 h-6 sm:h-7 rounded-full bg-navy-800/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar}`}
                    style={{ width: `${pct}%`, opacity: 0.7 }}
                  />
                </div>
                <span className="w-6 sm:w-7 text-center text-sm sm:text-base text-navy-200/90 font-medium">{count}</span>
              </div>
            );
          })}
        </div>

        {/* 鑑定文 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
            }}
          />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
              {gogyoReading}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 運勢レベルの色
const LEVEL_COLORS = {
  good: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: '好調', labelBg: 'bg-emerald-500/20' },
  neutral: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', dot: 'bg-sky-400', label: '平穏', labelBg: 'bg-sky-500/20' },
  caution: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', label: '注意', labelBg: 'bg-amber-500/20' },
};

// カテゴリSVGアイコン
function CategoryIcon({ type, color }: { type: string; color: string }) {
  const paths: Record<string, string> = {
    work: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4zM2 4v16h20V4H2zm2 2h16v12H4V6z M9 9l2 2 4-4',
    love: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    money: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v1.5h1c1.1 0 2 .9 2 2s-.9 2-2 2h-1V14h1.5v-1h.5c1.93 0 3.5-1.57 3.5-3.5S14.43 6 12.5 6zM11 15h2v2h-2z',
    marriage: 'M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7L12 2z',
    children: 'M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 4c-2.21 0-4 1.79-4 4v3h2v5h4v-5h2v-3c0-2.21-1.79-4-4-4z M7 3c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm10 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z',
    health: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h4v2h-4v4h-2v-4H7v-2h4V7z',
  };
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type] || ''} fill={color} fillOpacity="0.15" stroke={color} />
    </svg>
  );
}

// カテゴリ定義
const DETAIL_CATEGORIES = [
  { key: 'work' as const, label: '仕事運', color: '#60a5fa', gradient: 'from-blue-500/20 to-blue-400/5' },
  { key: 'love' as const, label: '恋愛運', color: '#f472b6', gradient: 'from-pink-500/20 to-pink-400/5' },
  { key: 'money' as const, label: '金運', color: '#fbbf24', gradient: 'from-yellow-500/20 to-yellow-400/5' },
  { key: 'marriage' as const, label: '結婚運', color: '#fb923c', gradient: 'from-orange-500/20 to-orange-400/5' },
  { key: 'children' as const, label: '子供運', color: '#4ade80', gradient: 'from-green-500/20 to-green-400/5' },
  { key: 'health' as const, label: '健康運', color: '#22d3ee', gradient: 'from-cyan-500/20 to-cyan-400/5' },
];

// 10年運勢スライド
function DecadeSlide({ tenYearFortune }: { tenYearFortune: YearlyFortune[] }) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();
  const accentColor = SECTION_COLORS.decade.primary;
  const selectedFortune = tenYearFortune.find(yf => yf.year === selectedYear);

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="decade" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            10年運勢
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            {currentYear}年 〜 {currentYear + 9}年
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-xs sm:text-sm text-navy-300/70 leading-relaxed tracking-wide px-2">
          各年をタップすると、仕事・恋愛・金運など詳しい運勢が見られます
        </p>

        {/* 年タイムライン */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pb-1">
          {tenYearFortune.map((yf) => {
            const colors = LEVEL_COLORS[yf.level];
            const isSelected = selectedYear === yf.year;
            const isCurrent = yf.year === currentYear;

            return (
              <button
                key={yf.year}
                onClick={() => setSelectedYear(isSelected ? null : yf.year)}
                className={`relative rounded-lg py-2 sm:py-2.5 border ${
                  isSelected
                    ? `${colors.border} ${colors.bg}`
                    : `border-navy-700/30 bg-navy-900/30 active:bg-navy-800/40`
                }`}
              >
                <div className="text-center">
                  <span className={`block text-xs sm:text-sm font-bold ${
                    isCurrent ? 'text-gold-400' : isSelected ? 'text-navy-50' : 'text-navy-200/80'
                  }`}>
                    {yf.year}
                  </span>
                  <div className={`mx-auto mt-1 w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                </div>
                {isCurrent && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[0.5rem] text-gold-400 tracking-wider whitespace-nowrap">
                    今年
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 選択された年の詳細 */}
        {selectedFortune ? (
          <div className="space-y-3">
            {/* 年ヘッダー */}
            <div className={`ornament-border rounded-xl ${LEVEL_COLORS[selectedFortune.level].bg} p-3 sm:p-4`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-black text-navy-50">
                  {selectedFortune.year}年
                  {selectedFortune.year === currentYear && (
                    <span className="ml-2 text-xs sm:text-sm text-gold-400 font-medium">（今年）</span>
                  )}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium ${LEVEL_COLORS[selectedFortune.level].labelBg} ${LEVEL_COLORS[selectedFortune.level].text}`}>
                  {LEVEL_COLORS[selectedFortune.level].label}
                </span>
              </div>
              <p className="text-navy-100/90 text-sm sm:text-base leading-[1.9] tracking-wide">
                {selectedFortune.reading}
              </p>
            </div>

            {/* カテゴリ別詳細 */}
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
              {DETAIL_CATEGORIES.map(cat => (
                <div
                  key={cat.key}
                  className={`rounded-xl border border-white/5 bg-gradient-to-r ${cat.gradient} p-3 sm:p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                      <CategoryIcon type={cat.key} color={cat.color} />
                      <p className="text-[0.55rem] font-bold tracking-wider" style={{ color: cat.color }}>{cat.label}</p>
                    </div>
                    <p className="flex-1 text-navy-100/90 text-xs sm:text-sm leading-[1.8] tracking-wide">
                      {selectedFortune.detail[cat.key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedYear(null)}
              className="w-full text-center py-2 text-sm text-navy-400 active:text-gold-500/60 tracking-widest"
            >
              一覧に戻る
            </button>
          </div>
        ) : (
          /* 未選択時のプレビュー一覧 */
          <div className="space-y-1.5 sm:space-y-2 pb-2 sm:pb-4">
            {tenYearFortune.map((yf) => {
              const colors = LEVEL_COLORS[yf.level];
              const isCurrent = yf.year === currentYear;

              return (
                <button
                  key={yf.year}
                  onClick={() => setSelectedYear(yf.year)}
                  className={`w-full text-left rounded-xl border ${colors.border} ${colors.bg} ${isCurrent ? 'ring-1 ring-gold-500/30' : ''} active:opacity-80`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
                    <div className="flex-shrink-0 w-12 sm:w-14 text-center">
                      <span className={`text-sm sm:text-base font-bold ${isCurrent ? 'text-gold-400' : 'text-navy-100/90'}`}>
                        {yf.year}
                      </span>
                    </div>
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${colors.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-navy-100/80 text-xs sm:text-sm leading-relaxed line-clamp-1">
                        {yf.reading}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[0.6rem] sm:text-xs font-medium ${colors.labelBg} ${colors.text}`}>
                      {colors.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
