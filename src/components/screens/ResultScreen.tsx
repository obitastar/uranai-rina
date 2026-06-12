"use client";

import { useState, useEffect } from "react";
import type { FortuneResult, YearlyFortune, GogyoBalance, ShinsatsuInfo, KyuseiInfo, LuckyInfo, DaiunResult, DaiunPeriod, StrengthResult, ChishiRelationResult, NacchinInfo, KakkyokuInfo, ZokanDetail, Tsuhensei, Juniunsei } from "@/lib/shichusuimei";
import { SlideViewer } from "@/components/SlideViewer";
import { PillarChart } from "@/components/PillarChart";
import { ZodiacCharacter, ZodiacBadge } from "@/components/ZodiacCharacter";
import { SectionIcon, SECTION_COLORS } from "@/components/SectionIcon";
import { ShareButtons } from "@/components/ShareButtons";
import { encodeShichusuimei } from "@/lib/share";

interface ResultScreenProps {
  result: FortuneResult;
  onRetry: () => void;
  onTop: () => void;
  onAisho?: () => void;
  viewOnly?: boolean;
  full?: boolean;
}

const SLIDE_LABELS = ["命式表", "本質", "恋愛運", "仕事運", "四柱詳解", "五行", "格局", "身強身弱", "納音", "健康運", "空亡", "神殺", "地支", "開運", "大運", "今年", "10年運勢", "完了"];

// 簡易版で表示するスライド（1〜5枚目 + 今年の運勢）
const FREE_SLIDE_INDICES = [0, 1, 2, 3, 5, 15];

export function ResultScreen({ result, onRetry, onTop, onAisho, viewOnly, full }: ResultScreenProps) {
  const isLimited = viewOnly && !full;
  const { input, fourPillars } = result;
  const birthLabel = `${input.year}年${input.month}月${input.day}日${input.hour !== null ? ` ${input.hour}時` : ""}生`;
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full h-screen">
      <SlideViewer slideLabels={SLIDE_LABELS} visibleIndices={isLimited ? FREE_SLIDE_INDICES : undefined}>
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

        {/* ===== スライド5: 四柱詳解 ===== */}
        <PillarsDetailSlide result={result} />

        {/* ===== スライド6: 五行バランス ===== */}
        <GogyoSlide gogyoBalance={result.gogyoBalance} gogyoReading={result.gogyoReading} />

        {/* ===== スライド6: 格局 ===== */}
        <KakkyokuSlide kakkyoku={result.kakkyoku} />

        {/* ===== スライド7: 身強身弱 ===== */}
        <StrengthSlide strength={result.strength} />

        {/* ===== スライド8: 納音 ===== */}
        <NacchinSlide nacchin={result.nacchin} />

        {/* ===== スライド7: 健康運 ===== */}
        <SlideContent
          iconType="health"
          title="健康運"
          subtitle={`五行バランスから読み解く体質`}
          description={<>命式の<ruby>五行<rt className="text-[0.5rem] opacity-60">ごぎょう</rt></ruby>バランスから、注意すべき体の部位や健康のアドバイスをお伝えします。</>}
          accentColor={SECTION_COLORS.health.primary}
          content={result.healthReading}
        />

        {/* ===== スライド7: 空亡（天中殺） ===== */}
        <SlideContent
          iconType="kuubou"
          title="空亡（天中殺）"
          subtitle={`${result.kuubou.junName} ── ${result.kuubou.pair[0]}・${result.kuubou.pair[1]}が空亡`}
          description={<><ruby>空亡<rt className="text-[0.5rem] opacity-60">くうぼう</rt></ruby>とは運気が不安定になる時期のこと。自分の空亡を知ることで、備えと活かし方が見えてきます。</>}
          accentColor={SECTION_COLORS.kuubou.primary}
          content={result.kuubou.meaning}
          extra={
            <div className="space-y-3 mt-4">
              {result.kuubou.isKuubouYear && (
                <div className="ornament-border rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
                  <p className="text-sm text-amber-400 tracking-widest mb-1 text-center font-medium">今年は空亡年です</p>
                  <p className="text-navy-100/80 text-sm leading-[1.9] tracking-wide text-center">
                    新しいことを始めるより、内面を磨く時期です。焦らず種まきの年と捉えましょう。
                  </p>
                </div>
              )}
              <div className="ornament-border rounded-xl bg-navy-900/30 p-4">
                <p className="text-sm text-emerald-400/70 tracking-widest mb-2 text-center font-medium">空亡期間の過ごし方</p>
                <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide text-center">
                  {result.kuubou.advice}
                </p>
              </div>
            </div>
          }
        />

        {/* ===== スライド8: 神殺 ===== */}
        <ShinsatsuSlide shinsatsu={result.shinsatsu} />

        {/* ===== スライド10: 地支関係 ===== */}
        <ChishiSlide chishiRelations={result.chishiRelations} />

        {/* ===== スライド11: 開運（九星 + ラッキー） ===== */}
        <LuckySlide kyusei={result.kyusei} lucky={result.lucky} />

        {/* ===== スライド12: 大運 ===== */}
        <DaiunSlide daiun={result.daiun} />

        {/* ===== スライド13: 今年の運勢 ===== */}
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

            {!viewOnly && (
              <>
                <ShareButtons
                  freeUrl={encodeShichusuimei(input.year, input.month, input.day, input.hour, input.gender)}
                  fullUrl={encodeShichusuimei(input.year, input.month, input.day, input.hour, input.gender, true)}
                />

                <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                  {onAisho && (
                    <button onClick={onAisho} className="group relative w-full">
                      <div className="relative ornament-border rounded-xl px-6 sm:px-8 py-4 sm:py-5 bg-pink-500/10 border border-pink-500/30 active:bg-pink-500/20">
                        <span className="text-base sm:text-lg tracking-[0.2em] sm:tracking-[0.25em] text-pink-300 font-bold">
                          相性診断へ
                        </span>
                        <p className="text-xs text-navy-400/60 tracking-wider mt-1">あなたの情報はそのまま使えます</p>
                      </div>
                    </button>
                  )}
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
              </>
            )}
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
  iconType: 'essence' | 'love' | 'work' | 'yearly' | 'decade' | 'gogyo' | 'health' | 'kuubou' | 'shinsatsu' | 'lucky' | 'strength' | 'chishi' | 'daiun' | 'nacchin' | 'kakkyoku' | 'pillars';
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

// 四柱詳解スライド
function PillarsDetailSlide({ result }: { result: FortuneResult }) {
  const accentColor = SECTION_COLORS.pillars.primary;
  const { fourPillars, zokanDetails, nicchu } = result;

  const pillarsData: {
    key: string;
    label: string;
    meaning: string;
    color: string;
    kan: string;
    shi: string;
    tsuhensei: Tsuhensei | null;
    juniunsei: Juniunsei;
    zokan: ZokanDetail;
  }[] = [
    {
      key: 'year', label: '年柱', meaning: '先祖運・幼少期', color: '#4ade80',
      kan: fourPillars.year.kan, shi: fourPillars.year.shi,
      tsuhensei: result.tpiYear, juniunsei: result.juniunYear,
      zokan: zokanDetails.year,
    },
    {
      key: 'month', label: '月柱', meaning: '社会運・壮年期', color: '#60a5fa',
      kan: fourPillars.month.kan, shi: fourPillars.month.shi,
      tsuhensei: result.tpiMonth, juniunsei: result.juniunMonth,
      zokan: zokanDetails.month,
    },
    {
      key: 'day', label: '日柱', meaning: '自分自身・配偶者', color: '#f472b6',
      kan: fourPillars.day.kan, shi: fourPillars.day.shi,
      tsuhensei: null, juniunsei: result.juniunDay,
      zokan: zokanDetails.day,
    },
    ...(fourPillars.hour && zokanDetails.hour ? [{
      key: 'hour', label: '時柱', meaning: '晩年運・子供運', color: '#fbbf24',
      kan: fourPillars.hour.kan, shi: fourPillars.hour.shi,
      tsuhensei: result.tpiHour, juniunsei: result.juniunHour!,
      zokan: zokanDetails.hour,
    }] : []),
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="pillars" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            <ruby>四柱詳解<rt className="text-[0.5rem] opacity-60">しちゅうしょうかい</rt></ruby>
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            日主「{nicchu}」── 四つの柱を読み解く
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-sm text-navy-300/70 leading-relaxed tracking-wide px-2">
          年柱・月柱・日柱・時柱それぞれの<ruby>通変星<rt className="text-[0.5rem] opacity-60">つうへんせい</rt></ruby>・<ruby>十二運<rt className="text-[0.5rem] opacity-60">じゅうにうん</rt></ruby>・<ruby>蔵干<rt className="text-[0.5rem] opacity-60">ぞうかん</rt></ruby>から、人生の各領域を詳しく診断します。
        </p>

        <div className="space-y-3">
          {pillarsData.map((p) => (
            <div key={p.key} className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
              <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${p.color}60, transparent)` }} />
              <div className="p-4 sm:p-5 space-y-3">
                {/* 柱ヘッダー */}
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black tracking-wider" style={{ color: p.color }}>{p.label}</span>
                  <span className="text-xs text-navy-300/70 tracking-widest">{p.meaning}</span>
                </div>

                {/* 干支 */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-navy-400 tracking-wider">天干</span>
                    <span className="text-lg font-bold text-navy-50">{p.kan}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-navy-400 tracking-wider">地支</span>
                    <span className="text-lg font-bold text-navy-50">{p.shi}</span>
                  </div>
                  {p.tsuhensei && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-navy-400 tracking-wider">通変星</span>
                      <span className="text-sm font-medium px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-navy-100">{p.tsuhensei}</span>
                    </div>
                  )}
                  {p.key === 'day' && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-navy-400 tracking-wider">日主</span>
                      <span className="text-sm font-medium px-2 py-0.5 rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-200">{nicchu}</span>
                    </div>
                  )}
                </div>

                {/* 十二運 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-navy-400 tracking-wider">十二運</span>
                  <span className="text-sm font-medium px-2.5 py-0.5 rounded-full border text-navy-100" style={{ borderColor: `${p.color}40`, backgroundColor: `${p.color}10` }}>
                    {p.juniunsei}
                  </span>
                </div>

                {/* 蔵干 */}
                <div className="rounded-xl bg-navy-800/30 p-3 space-y-1.5">
                  <p className="text-xs text-gold-500/70 tracking-widest font-medium">蔵干（地支に内包される天干）</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[0.65rem] text-navy-400">本気</span>
                      <span className="text-sm font-medium text-navy-100">{p.zokan.honki}</span>
                      <span className="text-[0.65rem] text-navy-400 ml-0.5">→</span>
                      <span className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-navy-700/40 text-navy-200">{p.zokan.tpiHonki}</span>
                    </div>
                    {p.zokan.chuki && (
                      <div className="flex items-center gap-1">
                        <span className="text-[0.65rem] text-navy-400">中気</span>
                        <span className="text-sm font-medium text-navy-100">{p.zokan.chuki}</span>
                        <span className="text-[0.65rem] text-navy-400 ml-0.5">→</span>
                        <span className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-navy-700/40 text-navy-200">{p.zokan.tpiChuki}</span>
                      </div>
                    )}
                    {p.zokan.yoki && (
                      <div className="flex items-center gap-1">
                        <span className="text-[0.65rem] text-navy-400">余気</span>
                        <span className="text-sm font-medium text-navy-100">{p.zokan.yoki}</span>
                        <span className="text-[0.65rem] text-navy-400 ml-0.5">→</span>
                        <span className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-navy-700/40 text-navy-200">{p.zokan.tpiYoki}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
  { key: 'children' as const, label: '妊娠・出産', color: '#4ade80', gradient: 'from-green-500/20 to-green-400/5' },
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
        <div className="grid grid-cols-5 gap-1 sm:gap-2 pb-1">
          {tenYearFortune.map((yf) => {
            const colors = LEVEL_COLORS[yf.level];
            const isSelected = selectedYear === yf.year;
            const isCurrent = yf.year === currentYear;

            return (
              <button
                key={yf.year}
                onClick={() => setSelectedYear(isSelected ? null : yf.year)}
                className={`relative rounded-lg py-1.5 sm:py-2.5 border ${
                  isSelected
                    ? `${colors.border} ${colors.bg}`
                    : `border-navy-700/30 bg-navy-900/30 active:bg-navy-800/40`
                }`}
              >
                <div className="text-center">
                  <span className={`block text-[0.65rem] sm:text-sm font-bold ${
                    isCurrent ? 'text-gold-400' : isSelected ? 'text-navy-50' : 'text-navy-200/80'
                  }`}>
                    {yf.year}
                  </span>
                  <div className={`mx-auto mt-0.5 sm:mt-1 w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                </div>
                {isCurrent && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[0.45rem] sm:text-[0.5rem] text-gold-400 tracking-wider whitespace-nowrap">
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
                  <div className="flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-3">
                    <div className="flex-shrink-0 w-10 sm:w-14 text-center">
                      <span className={`text-xs sm:text-base font-bold ${isCurrent ? 'text-gold-400' : 'text-navy-100/90'}`}>
                        {yf.year}
                      </span>
                    </div>
                    <div className={`flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${colors.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-navy-100/80 text-[0.65rem] sm:text-sm leading-relaxed line-clamp-1">
                        {yf.reading}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 rounded-full text-[0.55rem] sm:text-xs font-medium ${colors.labelBg} ${colors.text}`}>
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

// 格局スライド
function KakkyokuSlide({ kakkyoku }: { kakkyoku: KakkyokuInfo }) {
  const accentColor = SECTION_COLORS.kakkyoku.primary;

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="kakkyoku" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            <ruby>格局<rt className="text-[0.5rem] opacity-60">かっきょく</rt></ruby>
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            {kakkyoku.name}（{kakkyoku.category}）
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-sm text-navy-300/70 leading-relaxed tracking-wide px-2">
          <ruby>格局<rt className="text-[0.5rem] opacity-60">かっきょく</rt></ruby>は命式全体の構造パターン。あなたの運命の骨格を表し、用神を定める基盤となります。
        </p>

        {/* 格局名と説明 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 text-center space-y-3">
          <span className="inline-block text-xl font-bold px-5 py-2 rounded-full border border-sky-400/30 text-sky-300 bg-sky-500/10">
            {kakkyoku.name}
          </span>
          <p className="text-navy-200/80 text-sm tracking-wider">{kakkyoku.description}</p>
        </div>

        {/* 鑑定文 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
              {kakkyoku.reading}
            </p>
          </div>
        </div>

        {/* 強み・弱み */}
        <div className="grid grid-cols-2 gap-3">
          <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
            <p className="text-xs text-emerald-400/80 tracking-widest mb-2 text-center font-medium">強み</p>
            <p className="text-navy-100/80 text-sm leading-[1.8]">{kakkyoku.strength}</p>
          </div>
          <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
            <p className="text-xs text-amber-400/80 tracking-widest mb-2 text-center font-medium">課題</p>
            <p className="text-navy-100/80 text-sm leading-[1.8]">{kakkyoku.weakness}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 納音スライド
function NacchinSlide({ nacchin }: { nacchin: NacchinInfo }) {
  const accentColor = SECTION_COLORS.nacchin.primary;
  const gogyoColors: Record<string, string> = {
    '木': 'text-green-400 bg-green-500/10 border-green-500/20',
    '火': 'text-red-400 bg-red-500/10 border-red-500/20',
    '土': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    '金': 'text-slate-300 bg-slate-500/10 border-slate-500/20',
    '水': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };
  const gogyoColor = gogyoColors[nacchin.gogyo] || gogyoColors['土'];

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="nacchin" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            <ruby>納音<rt className="text-[0.5rem] opacity-60">なっちん</rt></ruby>
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            {nacchin.name}（{nacchin.yomi}）
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-sm text-navy-300/70 leading-relaxed tracking-wide px-2">
          <ruby>納音<rt className="text-[0.5rem] opacity-60">なっちん</rt></ruby>は干支が奏でる「音」。六十干支の五行の本質を詩的に表し、人の気質の底流を読み解きます。
        </p>

        {/* 納音の象徴 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 text-center space-y-3">
          <p className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.3em]">{nacchin.name}</p>
          <p className="text-navy-200/70 text-sm tracking-[0.2em]">{nacchin.symbol}</p>
          <div className="flex justify-center">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${gogyoColor}`}>
              {nacchin.gogyo}の気
            </span>
          </div>
        </div>

        {/* 鑑定文 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
              {nacchin.personality}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 神殺スライド
function ShinsatsuSlide({ shinsatsu }: { shinsatsu: ShinsatsuInfo[] }) {
  const accentColor = SECTION_COLORS.shinsatsu.primary;

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="shinsatsu" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            <ruby>神殺<rt className="text-[0.5rem] opacity-60">しんさつ</rt></ruby>
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            命式に宿る特別な星たち
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-sm text-navy-300/70 leading-relaxed tracking-wide px-2">
          あなたの命式に宿る吉凶の特殊星です。存在する星はより詳しい鑑定文で表示されます。
        </p>

        <div className="space-y-2 sm:space-y-3">
          {shinsatsu.map((s) => (
            <div
              key={s.name}
              className={`ornament-border rounded-xl p-3 sm:p-4 ${
                s.exists
                  ? 'bg-amber-500/10 border border-amber-500/20'
                  : 'bg-navy-900/30 border border-navy-700/20 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-lg font-bold ${s.exists ? 'text-amber-400' : 'text-navy-400'}`}>
                  {s.name}
                </span>
                {s.exists ? (
                  <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-amber-500/20 text-amber-400 tracking-wider">
                    命式に存在
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-navy-700/30 text-navy-400 tracking-wider">
                    なし
                  </span>
                )}
              </div>
              <p className={`text-sm leading-[1.9] tracking-wide ${s.exists ? 'text-navy-50/90' : 'text-navy-300/60'}`}>
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 開運スライド（九星 + ラッキー）
function LuckySlide({ kyusei, lucky }: { kyusei: KyuseiInfo; lucky: LuckyInfo }) {
  const accentColor = SECTION_COLORS.lucky.primary;

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="lucky" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            開運ガイド
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            {kyusei.name}のあなたへ
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        {/* 九星気学 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-5">
          <h3 className="text-center text-sm text-gold-500/80 tracking-widest mb-3">
            <ruby>九星気学<rt className="text-[0.5rem] opacity-60">きゅうせいきがく</rt></ruby>
          </h3>
          <p className="text-navy-50/90 text-sm leading-[1.9] tracking-wide text-center">
            {kyusei.personality}
          </p>
        </div>

        {/* ラッキーアイテム一覧 */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
          <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
            <p className="text-xs text-pink-400/80 tracking-widest mb-2 text-center font-medium">ラッキーカラー</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {lucky.colors.map(c => (
                <span key={c} className="px-2 py-1 rounded-full text-xs border border-pink-400/20 text-pink-200/90 bg-pink-500/10">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
            <p className="text-xs text-amber-400/80 tracking-widest mb-2 text-center font-medium">ラッキーナンバー</p>
            <div className="flex justify-center gap-2">
              {lucky.numbers.map(n => (
                <span key={n} className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border border-amber-400/20 text-amber-200/90 bg-amber-500/10">
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
            <p className="text-xs text-emerald-400/80 tracking-widest mb-2 text-center font-medium">吉方位</p>
            <p className="text-center text-sm text-navy-50/90">{lucky.direction}</p>
          </div>
          <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
            <p className="text-xs text-sky-400/80 tracking-widest mb-2 text-center font-medium">ラッキーシーズン</p>
            <p className="text-center text-sm text-navy-50/90">{lucky.season}</p>
          </div>
        </div>

        {/* ラッキーアイテム */}
        <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
          <p className="text-xs text-purple-400/80 tracking-widest mb-2 text-center font-medium">ラッキーアイテム</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {lucky.items.map(item => (
              <span key={item} className="px-3 py-1.5 rounded-full text-sm border border-purple-400/20 text-purple-200/90 bg-purple-500/10">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 九星の吉方位 */}
        <div className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4">
          <p className="text-xs text-gold-500/80 tracking-widest mb-2 text-center font-medium">九星の吉方位</p>
          <div className="flex justify-center gap-2">
            {kyusei.luckyDirections.map(d => (
              <span key={d} className="px-3 py-1.5 rounded-full text-sm border border-gold-500/20 text-gold-300/90 bg-gold-500/10">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* 開運メッセージ */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div
            className="h-[2px] w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }}
          />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
              {lucky.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 身強身弱スライド
function StrengthSlide({ strength }: { strength: StrengthResult }) {
  const accentColor = SECTION_COLORS.strength.primary;
  const levelColors: Record<string, string> = {
    '身強': 'text-red-400 bg-red-500/15 border-red-500/30',
    'やや身強': 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    '中和': 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    'やや身弱': 'text-sky-400 bg-sky-500/15 border-sky-500/30',
    '身弱': 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
  };
  const color = levelColors[strength.level] || levelColors['中和'];

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="strength" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            <ruby>身強身弱<rt className="text-[0.5rem] opacity-60">みきょうみじゃく</rt></ruby>
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            日主のエネルギー強度
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-sm text-navy-300/70 leading-relaxed tracking-wide px-2">
          命式全体の五行バランスから、あなたの日主（自分自身）の強さを判定します。
        </p>

        {/* 判定結果 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 text-center space-y-4">
          <span className={`inline-block text-xl font-bold px-5 py-2 rounded-full border ${color}`}>
            {strength.level}
          </span>

          {/* スコアバー */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-navy-400">
              <span>身弱</span>
              <span>中和</span>
              <span>身強</span>
            </div>
            <div className="h-3 rounded-full bg-navy-800/60 overflow-hidden relative">
              <div
                className="absolute top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-red-500 opacity-70"
                style={{ width: '100%' }}
              />
              <div
                className="absolute top-0 w-1.5 h-full bg-white rounded-full"
                style={{ left: `${Math.max(5, Math.min(95, ((strength.score + 10) / 20) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 用神・喜神・忌神 */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          <div className="ornament-border rounded-xl bg-navy-900/30 p-2 sm:p-3 text-center">
            <p className="text-[0.6rem] sm:text-xs text-emerald-400/80 tracking-wider sm:tracking-widest mb-1 font-medium">
              <ruby>用神<rt className="text-[0.4rem] sm:text-[0.45rem]">ようじん</rt></ruby>
            </p>
            <span className="text-base sm:text-lg font-bold text-emerald-300">{strength.youjin}</span>
            <p className="text-[0.5rem] sm:text-[0.6rem] text-navy-400 mt-0.5 sm:mt-1">最も必要な五行</p>
          </div>
          <div className="ornament-border rounded-xl bg-navy-900/30 p-2 sm:p-3 text-center">
            <p className="text-[0.6rem] sm:text-xs text-sky-400/80 tracking-wider sm:tracking-widest mb-1 font-medium">
              <ruby>喜神<rt className="text-[0.4rem] sm:text-[0.45rem]">きじん</rt></ruby>
            </p>
            <span className="text-base sm:text-lg font-bold text-sky-300">{strength.kijin}</span>
            <p className="text-[0.5rem] sm:text-[0.6rem] text-navy-400 mt-0.5 sm:mt-1">味方の五行</p>
          </div>
          <div className="ornament-border rounded-xl bg-navy-900/30 p-2 sm:p-3 text-center">
            <p className="text-[0.6rem] sm:text-xs text-red-400/80 tracking-wider sm:tracking-widest mb-1 font-medium">
              <ruby>忌神<rt className="text-[0.4rem] sm:text-[0.45rem]">いまがみ</rt></ruby>
            </p>
            <span className="text-base sm:text-lg font-bold text-red-300">{strength.kijin_bad}</span>
            <p className="text-[0.5rem] sm:text-[0.6rem] text-navy-400 mt-0.5 sm:mt-1">注意の五行</p>
          </div>
        </div>

        {/* 鑑定文 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
              {strength.reading}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 地支関係スライド
function ChishiSlide({ chishiRelations }: { chishiRelations: ChishiRelationResult }) {
  const accentColor = SECTION_COLORS.chishi.primary;
  const typeColors: Record<string, string> = {
    '冲': 'text-red-400 bg-red-500/15 border-red-500/25',
    '刑': 'text-amber-400 bg-amber-500/15 border-amber-500/25',
    '害': 'text-orange-400 bg-orange-500/15 border-orange-500/25',
    '破': 'text-yellow-400 bg-yellow-500/15 border-yellow-500/25',
    '支合': 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25',
    '三合': 'text-sky-400 bg-sky-500/15 border-sky-500/25',
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="chishi" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            地支の関係
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            冲・合・刑・害・破
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-sm text-navy-300/70 leading-relaxed tracking-wide px-2">
          命式の地支同士の相互作用から、人生に影響を与える力学を読み解きます。
        </p>

        {chishiRelations.relations.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {chishiRelations.relations.map((rel, i) => {
              const color = typeColors[rel.type] || typeColors['冲'];
              return (
                <div key={i} className={`ornament-border rounded-xl p-2.5 sm:p-4 border ${color.split(' ').slice(1).join(' ')}`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[0.6rem] sm:text-xs font-bold ${color}`}>
                      {rel.type}
                    </span>
                    <span className="text-xs sm:text-sm text-navy-200/80 font-medium">
                      {rel.branches.join('・')}
                    </span>
                    <span className="text-[0.6rem] sm:text-xs text-navy-400">
                      （{rel.positions.join('柱・')}柱）
                    </span>
                  </div>
                  <p className="text-sm text-navy-100/80 leading-[1.8] tracking-wide">
                    {rel.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 text-center">
            <p className="text-navy-200/70 text-sm">命式の地支に特別な関係は見られません。</p>
          </div>
        )}

        {/* 総合鑑定 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
              {chishiRelations.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 大運スライド
// 通変星の読みと説明（大運用）
const TSUHENSEI_YOMI: Record<string, string> = {
  '比肩': 'ひけん', '劫財': 'ごうざい', '食神': 'しょくじん', '傷官': 'しょうかん', '偏財': 'へんざい',
  '正財': 'せいざい', '偏官': 'へんかん', '正官': 'せいかん', '偏印': 'へんいん', '印綬': 'いんじゅ',
};
const TSUHENSEI_DESC: Record<string, string> = {
  '比肩': '自立心が高まり、独立や新しい挑戦に向く時期。競争意識が強まるが、孤立に注意。',
  '劫財': '人との関わりが増え、協力や共同事業に縁がある時期。散財や対人トラブルに注意。',
  '食神': '才能が開花し、表現力・創造力が豊かになる時期。食や趣味を通じた充実の時。',
  '傷官': '感性が鋭くなり、技術や専門性が磨かれる時期。批判的になりやすく、人間関係に注意。',
  '偏財': '商才・社交運が高まり、人脈や収入が広がる時期。投機的な判断は慎重に。',
  '正財': '堅実な財運に恵まれ、地道な努力が実を結ぶ時期。安定した収入と貯蓄のチャンス。',
  '偏官': '行動力と決断力が増し、大きな変革や挑戦に向く時期。無理や衝突に注意。',
  '正官': '社会的な信用・地位が高まり、昇進や責任ある立場に就く時期。規律と秩序を重んじる時。',
  '偏印': '学びや研究に没頭しやすく、独創的なアイデアが湧く時期。気まぐれや方向転換に注意。',
  '印綬': '知性と教養が深まり、資格取得や学問に最適な時期。目上からの引き立てに恵まれる。',
};

// 十干・十二支の読み
const JIKKAN_YOMI: Record<string, string> = {
  '甲': 'きのえ', '乙': 'きのと', '丙': 'ひのえ', '丁': 'ひのと', '戊': 'つちのえ',
  '己': 'つちのと', '庚': 'かのえ', '辛': 'かのと', '壬': 'みずのえ', '癸': 'みずのと',
};
const JUNISHI_YOMI: Record<string, string> = {
  '子': 'ね', '丑': 'うし', '寅': 'とら', '卯': 'う', '辰': 'たつ', '巳': 'み',
  '午': 'うま', '未': 'ひつじ', '申': 'さる', '酉': 'とり', '戌': 'いぬ', '亥': 'い',
};

// 通変星×十二運 組み合わせ説明（大運用）
const DAIUN_COMBINED: Record<string, Record<string, string>> = {
  '比肩': {
    '長生': '自立心が芽生え、新たな挑戦への意欲が湧く。自分の力で一歩踏み出すのに良い時期。',
    '沐浴': '独立心に揺れが生じやすい。周囲の誘惑に流されず、自分軸を保つことが大切。',
    '冠帯': '自分の実力が社会に認められ始める。自信を持ってリーダーシップを発揮できる。',
    '建禄': '自立の基盤が安定し、堅実に自分の道を歩める。独立・起業にも好機。',
    '帝旺': '自立心が最高潮に達する。大きな挑戦に向くが、強すぎる自我が衝突を招くことも。',
    '衰': '一人で頑張り続けた疲れが出やすい。ペースを落とし、経験を活かした判断に切り替える時。',
    '病': '自立のエネルギーが弱まり、孤独感を感じやすい。無理せず心身を休めることが大切。',
    '死': '従来の自分のあり方に区切りがつく。古い殻を脱ぎ、新しい自分に生まれ変わる転換期。',
    '墓': '独立心を内に蓄える時期。経験と知恵を整理し、次の飛躍に向けた準備を進めて。',
    '絶': '自立の方向性が完全にリセットされる。全く新しいフィールドでの再スタートの暗示。',
    '胎': '新しい自分の可能性が胎動し始める。直感に従い、未来の方向性を見定めて。',
    '養': '自立の力を静かに養う時期。焦らず学び、来るべき飛躍に備えることが吉。',
  },
  '劫財': {
    '長生': '人脈が広がり始め、新しい仲間との出会いがある。共同事業の種まきに好機。',
    '沐浴': '人間関係に波乱が起きやすい。金銭の貸し借りや軽率な約束は避けること。',
    '冠帯': '社交性が輝き、仲間との協力関係が実を結ぶ。グループ活動での成功運あり。',
    '建禄': '信頼できる仲間に恵まれ、チームワークが安定する。堅実な共同事業に吉。',
    '帝旺': '人脈の力が最大化。大きなプロジェクトを仲間と推進できるが、主導権争いに注意。',
    '衰': '人付き合いに疲れが出やすい。関係を整理し、本当に大切な人との絆を深める時。',
    '病': '対人関係のストレスが体調に影響しやすい。無理な付き合いは控え、自分を守って。',
    '死': '古い人間関係が自然に終わりを迎える。執着せず手放すことで、新たな縁が生まれる。',
    '墓': '人脈を整理・保存する時期。これまでの人間関係から、将来に繋がる縁を見極めて。',
    '絶': '人間関係が大きく入れ替わる転換期。環境の変化を受け入れ、新しい出会いに開こう。',
    '胎': '将来のパートナーとなる人との縁が芽生え始める。直感を信じた人選が吉。',
    '養': '人間関係をゆっくり育てる時期。信頼関係の土台づくりに時間をかけることが大切。',
  },
  '食神': {
    '長生': '創造力が芽生え、新しい表現の世界が広がる。趣味や創作活動のスタートに最適。',
    '沐浴': '感受性が豊かになるが、誘惑にも弱くなる。楽しみに溺れず、才能の方向性を見極めて。',
    '冠帯': '才能が認められ、表現の場が広がる。発信力が高まり、注目を集める時期。',
    '建禄': '才能を安定的に発揮でき、着実に成果を積み上げる。食に関する運気も好調。',
    '帝旺': '創造力が最高潮。芸術・エンタメ・食の分野で大成功の可能性。楽しみすぎに注意。',
    '衰': '創作意欲がやや落ち着く。これまでの作品や経験をまとめ、次の創造に活かす時。',
    '病': '表現のエネルギーが弱まり、スランプを感じやすい。焦らず感性を休ませることが大切。',
    '死': '従来の表現方法に限界を感じる。一度手放すことで、全く新しい才能が開花する兆し。',
    '墓': '才能を内に秘め、熟成させる時期。インプットを増やし、次なる表現のための蓄えを。',
    '絶': '創造の方向性が根本から変わる転換期。過去のスタイルに固執せず、新境地を開こう。',
    '胎': '新しい才能の芽が生まれ始める。小さなインスピレーションを大切に育ててみて。',
    '養': '表現力をじっくり養う時期。基礎を固め、師匠や先輩から学ぶことで大きく成長する。',
  },
  '傷官': {
    '長生': '鋭い感性が芽生え、技術向上への意欲が高まる。専門分野の学び始めに最適。',
    '沐浴': '感受性が極度に高まり、繊細になりすぎる。批判的な言動が人間関係を壊さないよう注意。',
    '冠帯': '専門的な技術が評価され、プロフェッショナルとしての地位が確立する時期。',
    '建禄': '技術力が安定し、専門家として堅実な実績を積める。資格取得にも好機。',
    '帝旺': '感性と技術が最高潮に。天才的な閃きが得られるが、完璧主義が周囲を傷つけることも。',
    '衰': '鋭すぎた感性が落ち着き、円熟した技術を活かせる時期。後進の指導にも向く。',
    '病': '繊細さが心身の負担になりやすい。完璧を求めすぎず、自分を許すことが回復の鍵。',
    '死': '古い技術やこだわりに区切りがつく。プライドを手放すことで、新しい道が見えてくる。',
    '墓': '技術や知識を体系化する時期。これまでの経験をまとめ、次世代に伝える準備を。',
    '絶': '専門分野が大きく変わる転換期。全く新しいジャンルへの転身も視野に入れて。',
    '胎': '新たな専門性への興味が芽生える。直感的に惹かれる分野にアンテナを張ってみて。',
    '養': '技術力をじっくり磨く時期。基礎からやり直すことで、将来大きな実りが得られる。',
  },
  '偏財': {
    '長生': 'ビジネスチャンスが芽生え、新しい収入源の可能性が見えてくる。営業力も上昇。',
    '沐浴': '金銭面で誘惑が多い時期。衝動買いや投機には要注意。堅実な判断を心がけて。',
    '冠帯': '社交力が輝き、ビジネスの場で存在感を発揮。人脈を通じた利益が得られる時期。',
    '建禄': '商才が安定し、堅実な収益が見込める。事業拡大にも良いタイミング。',
    '帝旺': '財運が最高潮。大きな商談や取引で成功するが、調子に乗りすぎると大損のリスクも。',
    '衰': 'ビジネスの勢いがやや鈍化。手堅い運用に切り替え、守りの姿勢で資産を守る時期。',
    '病': '金銭面でのストレスが体調に影響しやすい。無理な投資は避け、健康を最優先に。',
    '死': '従来のビジネスモデルに限界が来る。古い稼ぎ方を手放し、新しい収入の形を模索して。',
    '墓': '資産を蓄え守る時期。投資よりも貯蓄、拡大よりも保全を意識することが吉。',
    '絶': '金銭感覚がリセットされる転換期。価値観の変化を受け入れ、新たな財の築き方を。',
    '胎': '新しいビジネスアイデアが芽生える。小さく試してみることで、将来の大きな利益に。',
    '養': '商才をじっくり育てる時期。資金を焦って動かさず、学びと準備に時間をかけて。',
  },
  '正財': {
    '長生': '安定した収入の道が開けてくる。計画的な貯蓄や資産形成を始めるのに最適。',
    '沐浴': '堅実さが揺らぎやすい時期。浪費の誘惑に負けず、計画通りの家計管理を続けて。',
    '冠帯': '経済的な信用が高まり、安定した収入基盤が確立する。不動産購入にも好機。',
    '建禄': '財運が最も安定する時期。地道な努力が確実に報われ、着実な資産増加が見込める。',
    '帝旺': '堅実な財運が頂点に。大きな買い物や投資も成功しやすいが、慢心は禁物。',
    '衰': '収入の伸びがやや鈍化。生活の見直しと節約を意識し、無駄な支出を削る時。',
    '病': '経済的な不安を感じやすい。焦って動くより、現状維持に徹して体勢を立て直して。',
    '死': '経済的な一区切り。定期収入の変化や環境の転換を受け入れ、新しい基盤づくりを。',
    '墓': '財産をしっかり守り蓄える時期。相続・保険の見直しなど、資産整理に向く。',
    '絶': '収入源が大きく変わる可能性。変化を恐れず、新しい働き方や稼ぎ方を受け入れて。',
    '胎': '将来の安定に繋がる新しい収入の芽が生まれる。小さなチャンスを見逃さないで。',
    '養': '経済力を着実に育てる時期。スキルアップや資格取得で、将来の収入増に備えて。',
  },
  '偏官': {
    '長生': '行動力が芽生え、新しいことへの挑戦意欲が高まる。変革のスタートに最適。',
    '沐浴': '衝動的な行動に走りやすい。勢いだけで突っ走らず、冷静な判断を忘れずに。',
    '冠帯': 'リーダーとしての行動力が認められ、大きな責任を任される時期。決断力が冴える。',
    '建禄': '行動力が安定し、計画的な挑戦が実を結ぶ。組織の中での昇進や抜擢にも縁がある。',
    '帝旺': '行動力と変革の力が最大に。大きな挑戦に向くが、暴走や強引さには厳重注意。',
    '衰': '行動のペースを落とす時期。がむしゃらに動くより、経験に基づく戦略的な立ち回りを。',
    '病': '無理な行動が体調を崩す原因に。休養を取り、エネルギーの回復を最優先に。',
    '死': '闘争心が一段落する。戦い続けてきた自分を労い、次のステージへの準備期間に。',
    '墓': '行動力を内に蓄える時期。過去の挑戦から学びを得て、次の大きな行動の計画を練る。',
    '絶': '行動の方向性が根本から変わる。これまでの戦い方を捨て、全く新しい手法を模索して。',
    '胎': '新しい挑戦への衝動が芽生える。具体的な行動はまだ早いが、準備は始めてよい。',
    '養': '行動のための力を養う時期。体力づくりやスキル向上に専念し、将来の大きな成果に備えて。',
  },
  '正官': {
    '長生': '社会的な信用が芽生え始める。組織での評価が上がり、新しい役職に就く可能性。',
    '沐浴': '地位が不安定になりやすい。規律を乱す行動は避け、信用を守ることに専念して。',
    '冠帯': '社会的地位が確立し、周囲からの信頼が厚くなる。昇進・栄転の好機。',
    '建禄': '地位と信用が最も安定する時期。責任ある立場で堅実に実績を積み上げられる。',
    '帝旺': '社会的な影響力が頂点に。出世や栄誉に恵まれるが、権力の驕りには注意。',
    '衰': '地位の維持に力を要する時期。後進への権限移譲や引き際の見極めが大切に。',
    '病': '社会的なプレッシャーが心身の負担に。責任を抱え込みすぎず、周囲に頼ることも必要。',
    '死': '現在の立場や肩書きに区切りがつく。退職・転職・異動など環境の変化を受け入れて。',
    '墓': '社会的実績を整理・保存する時期。これまでの功績をまとめ、次のキャリアに活かす。',
    '絶': '社会的立場が大きく変わる転換期。肩書きに固執せず、新たな役割を見つけて。',
    '胎': '新しいキャリアの方向性が見え始める。将来の立場につながる種を蒔いておこう。',
    '養': '社会的信用をじっくり育てる時期。実績と人望を着実に積み上げることが将来の飛躍に。',
  },
  '偏印': {
    '長生': '新しい分野への知的好奇心が芽生える。学び直しや新しい趣味のスタートに最適。',
    '沐浴': '興味が次々と移り変わりやすい。一つに絞れない時は、広く浅く試すのも悪くない。',
    '冠帯': '独創的なアイデアが評価される時期。ユニークな発想を活かした活動が実を結ぶ。',
    '建禄': '学びの成果が安定的に活かせる。独自の知識や技術を仕事に結びつけられる好機。',
    '帝旺': '独創性が最大限に発揮される。革新的なアイデアで周囲を驚かせるが、現実離れに注意。',
    '衰': '知的活動のペースがやや落ちる。新しいことより、既存の知識を深める方向が吉。',
    '病': '考えすぎて心が疲れやすい。思考を休め、自然や芸術に触れてリフレッシュして。',
    '死': '従来の学びの方向が終わりを迎える。執着を手放すことで、新しい知の扉が開く。',
    '墓': '知識や経験を整理する時期。学んだことを体系化し、自分だけのノウハウにまとめて。',
    '絶': '知的関心が根本からリセットされる。全く未知の分野に目を向ける転換期。',
    '胎': '新しい知的好奇心の芽が生まれる。直感的に惹かれるテーマを大切にしてみて。',
    '養': '知識をゆっくり養う時期。読書や学習に時間をかけ、将来の知的資産を蓄えて。',
  },
  '印綬': {
    '長生': '学問への意欲が芽生え、教養を深めるチャンスが訪れる。良い師との出会いにも恵まれる。',
    '沐浴': '学びに集中しにくく、気持ちが揺れやすい。環境を整え、落ち着いて学べる場を確保して。',
    '冠帯': '知性と教養が評価され、指導者や助言者としての役割が増える。試験運も好調。',
    '建禄': '学問の成果が安定的に活かせる。資格取得や論文発表など、実績として形に残せる時期。',
    '帝旺': '知的能力が最高潮に達する。研究・教育・執筆で大きな成果を上げられる好機。',
    '衰': '学びのペースがやや緩やかに。これまでの知識を整理し、後進に伝える役割に移る時。',
    '病': '精神的な疲労が溜まりやすい。学業や仕事のプレッシャーから少し距離を置いて。',
    '死': '学びの一つの章が終わる。卒業・修了など区切りを経て、新たな知的探求が始まる。',
    '墓': '知識を保存・集約する時期。教材を作る、本を書くなど学びの集大成に向く。',
    '絶': '知的方向性が根本から変わる。これまでの専門にこだわらず、新分野への転身も考えて。',
    '胎': '新しい学びへの直感的な関心が芽生える。その小さな興味が将来の大きな知恵に育つ。',
    '養': '教養をじっくり育てる時期。目上からの引き立てを受けながら、知識の土台を固めて。',
  },
};

// 十二運の読みと説明（大運用）
const JUNIUNSEI_YOMI: Record<string, string> = {
  '長生': 'ちょうせい', '沐浴': 'もくよく', '冠帯': 'かんたい', '建禄': 'けんろく', '帝旺': 'ていおう', '衰': 'すい',
  '病': 'びょう', '死': 'し', '墓': 'ぼ', '絶': 'ぜつ', '胎': 'たい', '養': 'よう',
};
const JUNIUNSEI_DESC: Record<string, string> = {
  '長生': 'エネルギーが芽吹く時期。成長の始まりで、新しいことを始めるのに最適。',
  '沐浴': '感受性が高まり、変化の多い時期。迷いやすいが、自分磨きには好機。',
  '冠帯': '社会的に認められ始める時期。自信がつき、活躍の場が広がる。',
  '建禄': '実力が安定し、着実に成果を積み上げる時期。最も堅実な運気。',
  '帝旺': 'エネルギーが最も強い時期。大きな成功のチャンスだが、強引さに注意。',
  '衰': 'ピークを過ぎ、落ち着きと円熟を迎える時期。経験を活かした判断が吉。',
  '病': 'エネルギーが低下し、心身のケアが必要な時期。内面を見つめ直す好機。',
  '死': '一つの周期が終わる時期。古いものを手放し、再生への準備をする時。',
  '墓': '蓄積・保存の時期。成果をまとめ、次の飛躍に備えて力を蓄える。',
  '絶': '転換期。すべてがリセットされ、まったく新しい流れが始まる。',
  '胎': '新しい命が宿る時期。将来の可能性が芽生え、直感が冴える。',
  '養': '力を養い育てる時期。焦らず準備を進めることで、大きな実りにつながる。',
};

function DaiunSlide({ daiun }: { daiun: DaiunResult }) {
  const accentColor = SECTION_COLORS.daiun.primary;

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-5 sm:py-8">
      <div className="w-full max-w-lg space-y-3 sm:space-y-4">
        <div className="text-center">
          <SectionIcon type="daiun" size={48} />
        </div>
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-[0.2em] sm:tracking-[0.3em]">
            <ruby>大運<rt className="text-[0.5rem] opacity-60">だいうん</rt></ruby>
          </h2>
          <p className="text-sm sm:text-base tracking-widest font-medium" style={{ color: `${accentColor}CC` }}>
            {daiun.direction} ── {daiun.startAge}歳から開始
          </p>
          <div className="w-12 sm:w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </div>

        <p className="text-center text-sm text-navy-300/70 leading-relaxed tracking-wide px-2">
          10年ごとに巡る大きな運気の流れ。人生の転換期や好機を読み解きます。
        </p>

        {/* 大運タイムライン */}
        <div className="space-y-2 sm:space-y-3">
          {daiun.periods.map((period, i) => (
              <div key={i} className="ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4 space-y-2">
                {/* ヘッダー行 */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-[4.5rem] sm:w-20 text-center">
                    <span className="text-xs sm:text-sm font-bold text-gold-300">
                      {period.startAge}〜{period.endAge}歳
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <span className="text-base sm:text-lg font-bold text-navy-100">
                      <ruby>{period.kanshi.kan}<rt className="text-[0.4rem] opacity-60">{JIKKAN_YOMI[period.kanshi.kan]}</rt></ruby><ruby>{period.kanshi.shi}<rt className="text-[0.4rem] opacity-60">{JUNISHI_YOMI[period.kanshi.shi]}</rt></ruby>
                    </span>
                  </div>
                  <div className="flex-1 flex gap-1 sm:gap-2 flex-wrap">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[0.6rem] sm:text-xs border border-purple-400/20 text-purple-200/90 bg-purple-500/10">
                      {period.tsuhensei}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[0.6rem] sm:text-xs border border-sky-400/20 text-sky-200/90 bg-sky-500/10">
                      {period.juniunsei}
                    </span>
                  </div>
                </div>
                {/* 通変星の説明 */}
                <div className="rounded-lg bg-purple-500/5 border border-purple-400/10 px-3 py-2">
                  <p className="text-[0.65rem] sm:text-xs text-purple-300/80 tracking-wider mb-0.5 font-medium">
                    <ruby>通変星<rt className="text-[0.4rem] opacity-60">つうへんせい</rt></ruby>「<ruby>{period.tsuhensei}<rt className="text-[0.4rem] opacity-60">{TSUHENSEI_YOMI[period.tsuhensei]}</rt></ruby>」
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-navy-100/80 leading-[1.7]">
                    {TSUHENSEI_DESC[period.tsuhensei] || ''}
                  </p>
                </div>
                {/* 十二運の説明 */}
                <div className="rounded-lg bg-sky-500/5 border border-sky-400/10 px-3 py-2">
                  <p className="text-[0.65rem] sm:text-xs text-sky-300/80 tracking-wider mb-0.5 font-medium">
                    <ruby>十二運<rt className="text-[0.4rem] opacity-60">じゅうにうん</rt></ruby>「<ruby>{period.juniunsei}<rt className="text-[0.4rem] opacity-60">{JUNIUNSEI_YOMI[period.juniunsei]}</rt></ruby>」
                  </p>
                  <p className="text-[0.65rem] sm:text-xs text-navy-100/80 leading-[1.7]">
                    {JUNIUNSEI_DESC[period.juniunsei] || ''}
                  </p>
                </div>
                {/* 組み合わせ総合 */}
                {DAIUN_COMBINED[period.tsuhensei]?.[period.juniunsei] && (
                  <div className="rounded-lg bg-gold-500/5 border border-gold-500/15 px-3 py-2">
                    <p className="text-[0.65rem] sm:text-xs text-gold-400/80 tracking-wider mb-0.5 font-medium">
                      この時期の総合 ──「<ruby>{period.tsuhensei}<rt className="text-[0.4rem] opacity-60">{TSUHENSEI_YOMI[period.tsuhensei]}</rt></ruby>」×「<ruby>{period.juniunsei}<rt className="text-[0.4rem] opacity-60">{JUNIUNSEI_YOMI[period.juniunsei]}</rt></ruby>」
                    </p>
                    <p className="text-[0.65rem] sm:text-xs text-navy-50/90 leading-[1.7]">
                      {DAIUN_COMBINED[period.tsuhensei][period.juniunsei]}
                    </p>
                  </div>
                )}
              </div>
          ))}
        </div>

        {/* 鑑定文 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 overflow-hidden">
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
          <div className="p-4 sm:p-5">
            <p className="text-navy-50/90 leading-[1.9] sm:leading-[2] text-sm sm:text-base tracking-wide">
              {daiun.reading}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
