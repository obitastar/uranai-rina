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
                生年月日から、あなたの運命の星を読み解きました
              </p>
            </div>

            <div className="animate-reveal-up opacity-0 stagger-1">
              <PillarChart result={result} />
            </div>

            <div className="animate-reveal-up opacity-0 stagger-2">
              <div className="ornament-border rounded-2xl bg-navy-900/40 backdrop-blur-md p-4 sm:p-6">
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
        </div>

        {/* ===== スライド2: 本質 ===== */}
        <SlideContent
          iconType="essence"
          title="本質"
          subtitle={`${result.nisshuDetail.symbol}の人 ── ${result.nisshuDetail.catchphrase}`}
          description="あなたが生まれた日の星から読み解く、生まれ持った性格や本質的な気質です。"
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
                  運勢エネルギー「{result.juniunDay}」── {result.juniunDayDetail.catchphrase}
                </p>
                <p className="text-navy-100/80 text-sm leading-[1.9] tracking-wide">
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
          subtitle={`内面の星「${result.zokanTsuhensei}」`}
          description="あなたの内面に秘められた星から、恋愛傾向やパートナーとの関わり方を読み解きます。"
          accentColor={SECTION_COLORS.love.primary}
          content={result.readings.love}
        />

        {/* ===== スライド4: 仕事運 ===== */}
        <SlideContent
          iconType="work"
          title="仕事運"
          subtitle={`社会運の星「${result.tpiMonth}」── ${result.tsuhenseiDetail.catchphrase}`}
          description="社会での役割を表す星から、あなたの適職・仕事での才能と注意点を診断します。"
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
          subtitle={`${result.nenunDetail.title} ── 今年の星「${result.currentYearTsuhensei}」`}
          description="今年の星の巡りから、一年間の運気の流れとテーマを読み解きます。"
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
            エネルギーバランス
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            木 ・ 火 ・ 土 ・ 金 ・ 水
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto animate-glow-line" />
        </div>

        {/* 説明文 */}
        <p className="text-center text-sm sm:text-base text-navy-300/70 leading-relaxed tracking-wide px-2">
          自然界の5つのエネルギー（木・火・土・金・水）のバランスから、あなたの気質の傾向を診断します。
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

// カテゴリアイコンと色
const DETAIL_CATEGORIES = [
  { key: 'work' as const, label: '仕事運', color: 'text-blue-400', icon: '💼' },
  { key: 'love' as const, label: '恋愛運', color: 'text-pink-400', icon: '💕' },
  { key: 'money' as const, label: '金運', color: 'text-yellow-400', icon: '💰' },
  { key: 'marriage' as const, label: '結婚運', color: 'text-rose-300', icon: '💍' },
  { key: 'children' as const, label: '子供運', color: 'text-green-400', icon: '👶' },
  { key: 'health' as const, label: '健康運', color: 'text-cyan-400', icon: '🏥' },
];

// 10年運勢スライド
function DecadeSlide({ tenYearFortune }: { tenYearFortune: YearlyFortune[] }) {
  const [visible, setVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const currentYear = new Date().getFullYear();
  const accentColor = SECTION_COLORS.decade.primary;
  const selectedFortune = tenYearFortune.find(yf => yf.year === selectedYear);

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
                className={`relative rounded-lg py-2 sm:py-2.5 transition-all duration-300 border ${
                  isSelected
                    ? `${colors.border} ${colors.bg} ring-1 ring-gold-500/40 scale-105`
                    : `border-navy-700/30 bg-navy-900/30 hover:bg-navy-800/40`
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
          <div className="space-y-3 animate-fade-in-up">
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
                  className="ornament-border rounded-xl bg-navy-900/40 backdrop-blur-sm p-3 sm:p-4"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex-shrink-0 w-8 sm:w-9 text-center">
                      <span className="text-lg sm:text-xl">{cat.icon}</span>
                      <p className={`text-[0.6rem] sm:text-xs font-bold mt-0.5 ${cat.color} tracking-wider`}>{cat.label}</p>
                    </div>
                    <p className="flex-1 text-navy-100/90 text-xs sm:text-sm leading-[1.8] sm:leading-[1.9] tracking-wide">
                      {selectedFortune.detail[cat.key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                  className={`w-full text-left transition-all duration-300 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm ${isCurrent ? 'ring-1 ring-gold-500/30' : ''}`}
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

        {/* 戻るボタン（詳細表示時） */}
        {selectedFortune && (
          <button
            onClick={() => setSelectedYear(null)}
            className="w-full text-center py-2 text-sm text-navy-400 hover:text-gold-500/60 tracking-widest transition-colors"
          >
            一覧に戻る
          </button>
        )}
      </div>
    </div>
  );
}
