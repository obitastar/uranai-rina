"use client";

import type { SeimeiResult, GokakuDetail } from "@/lib/seimei";
import { SlideViewer } from "@/components/SlideViewer";
import { ShareButtons } from "@/components/ShareButtons";
import { encodeSeimei } from "@/lib/share";

interface SeimeiResultScreenProps {
  result: SeimeiResult;
  onRetry: () => void;
  onTop: () => void;
  onAisho?: () => void;
}

const SLIDE_LABELS = ["総合", "画数解析", "人格", "地格", "総格", "外格", "三才", "陰陽", "アドバイス"];

// 吉凶のカラー
function kikkyoColor(kikkyo: string): string {
  if (kikkyo === "大吉") return "text-gold-300";
  if (kikkyo === "吉") return "text-emerald-300";
  if (kikkyo === "半吉") return "text-sky-300";
  if (kikkyo === "吉凶混合") return "text-amber-300";
  if (kikkyo === "凶") return "text-red-300/80";
  return "text-red-300";
}

function kikkyoBg(kikkyo: string): string {
  if (kikkyo === "大吉") return "bg-gold-500/20 border-gold-500/30";
  if (kikkyo === "吉") return "bg-emerald-500/15 border-emerald-500/30";
  if (kikkyo === "半吉") return "bg-sky-500/15 border-sky-500/30";
  if (kikkyo === "吉凶混合") return "bg-amber-500/15 border-amber-500/30";
  if (kikkyo === "凶") return "bg-red-500/10 border-red-500/20";
  return "bg-red-500/15 border-red-500/25";
}

// 五行の色
function gogyoColor(gogyo: string): string {
  switch (gogyo) {
    case "木": return "text-green-300";
    case "火": return "text-red-300";
    case "土": return "text-amber-300";
    case "金": return "text-slate-200";
    case "水": return "text-blue-300";
    default: return "text-navy-200";
  }
}

function gogyoBg(gogyo: string): string {
  switch (gogyo) {
    case "木": return "bg-green-500/15";
    case "火": return "bg-red-500/15";
    case "土": return "bg-amber-500/15";
    case "金": return "bg-slate-400/15";
    case "水": return "bg-blue-500/15";
    default: return "bg-navy-500/15";
  }
}

// 総合スコアを計算
function calcOverallScore(details: GokakuDetail[]): { label: string; stars: number } {
  let score = 0;
  for (const d of details) {
    const weight = 6 - d.importance; // importance 1=最重要 → weight 5
    if (d.suri.kikkyo === "大吉") score += 2 * weight;
    else if (d.suri.kikkyo === "吉") score += 1 * weight;
    else if (d.suri.kikkyo === "吉凶混合") score += 0;
    else if (d.suri.kikkyo === "凶") score -= 1 * weight;
    else score -= 2 * weight;
  }
  // -30〜+30 のレンジを1〜5に正規化
  const normalized = Math.round(((score + 30) / 60) * 4) + 1;
  const stars = Math.max(1, Math.min(5, normalized));
  const labels = ["要注意", "やや注意", "まずまず", "好運", "大吉運"];
  return { label: labels[stars - 1], stars };
}

export function SeimeiResultScreen({ result, onRetry, onTop, onAisho }: SeimeiResultScreenProps) {
  const { sei, mei, seiStrokes, meiStrokes, gokakuDetails, sansai } = result;
  const overall = calcOverallScore(gokakuDetails);

  // 重要度順にソート済みのdetails（人格→地格→総格→外格→天格）
  const jinkaku = gokakuDetails.find(d => d.key === "jinkaku")!;
  const chikaku = gokakuDetails.find(d => d.key === "chikaku")!;
  const soukaku = gokakuDetails.find(d => d.key === "soukaku")!;
  const gaikaku = gokakuDetails.find(d => d.key === "gaikaku")!;
  const tenkaku = gokakuDetails.find(d => d.key === "tenkaku")!;

  return (
    <div className="w-full h-screen">
      <SlideViewer slideLabels={SLIDE_LABELS}>
        {/* ===== スライド1: 総合結果 ===== */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-md space-y-5 sm:space-y-7">
            <div className="text-center space-y-2">
              <p className="text-sm text-navy-300/60 tracking-wider">
                <ruby>姓名判断<rp>(</rp><rt className="text-[0.5rem] opacity-60">せいめいはんだん</rt><rp>)</rp></ruby>
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-[0.3em] text-gold-gradient">
                鑑定結果
              </h1>
              <div className="w-16 sm:w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <p className="text-lg text-navy-100/80 tracking-widest font-medium mt-3">
                {sei} {mei} さん
              </p>
            </div>

            {/* 総合運 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 text-center space-y-3">
              <p className="text-sm text-gold-400/70 tracking-widest">総合運勢</p>
              <div className="text-3xl tracking-wider">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < overall.stars ? "text-gold-400" : "text-navy-700"}>★</span>
                ))}
              </div>
              <p className={`text-xl font-bold ${overall.stars >= 4 ? "text-gold-300" : overall.stars >= 3 ? "text-emerald-300" : "text-amber-300"}`}>
                {overall.label}
              </p>
            </div>

            {/* 五格サマリー */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-4 sm:p-6 space-y-3">
              <h2 className="text-center text-sm text-gold-400/80 tracking-widest font-medium">
                <ruby>五格<rp>(</rp><rt className="text-[0.5rem]">ごかく</rt><rp>)</rp></ruby>一覧
              </h2>
              <div className="space-y-2">
                {[jinkaku, chikaku, soukaku, gaikaku, tenkaku].map((d) => (
                  <div key={d.key} className="flex items-center justify-between py-1.5 border-b border-gold-500/10 last:border-b-0">
                    <span className="text-sm text-navy-200/70">
                      <ruby>{d.name}<rp>(</rp><rt className="text-[0.5rem] text-navy-400/50">{d.yomi}</rt><rp>)</rp></ruby>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gold-gradient">{d.kaku}</span>
                      <span className="text-xs text-navy-400/60">画</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${kikkyoBg(d.suri.kikkyo)}`}>
                        <span className={kikkyoColor(d.suri.kikkyo)}>{d.suri.kikkyo}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== スライド2: 画数解析（名前の構成） ===== */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-md space-y-5 sm:space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-[0.2em] text-gold-gradient">画数解析</h2>
              <p className="text-sm text-navy-300/60">お名前の一文字ずつの画数と五格の構成</p>
            </div>

            {/* 姓名の画数表示 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 space-y-5">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gold-400/60 tracking-widest mb-2">姓</p>
                  <div className="flex gap-3 justify-center">
                    {[...sei].map((ch, i) => (
                      <div key={i} className="text-center">
                        <span className="text-2xl sm:text-3xl text-navy-100">{ch}</span>
                        <p className="text-gold-400 font-bold mt-1">{seiStrokes[i]}画</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-navy-300/60 mt-1">合計 {seiStrokes.reduce((a, b) => a + b, 0)} 画</p>
                </div>
                <div className="w-full h-px bg-gold-500/10" />
                <div>
                  <p className="text-xs text-gold-400/60 tracking-widest mb-2">名</p>
                  <div className="flex gap-3 justify-center">
                    {[...mei].map((ch, i) => (
                      <div key={i} className="text-center">
                        <span className="text-2xl sm:text-3xl text-navy-100">{ch}</span>
                        <p className="text-gold-400 font-bold mt-1">{meiStrokes[i]}画</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-navy-300/60 mt-1">合計 {meiStrokes.reduce((a, b) => a + b, 0)} 画</p>
                </div>
              </div>
            </div>

            {/* 五格の計算方法の図解 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-6 space-y-3">
              <h3 className="text-center text-sm text-gold-400/70 tracking-widest">五格の算出</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-navy-300/70">天格 = 姓の合計</span>
                  <span className="font-bold text-gold-300">{tenkaku.kaku}画</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-navy-300/70">人格 = 姓の末尾 + 名の先頭</span>
                  <span className="font-bold text-gold-300">{seiStrokes[seiStrokes.length - 1]} + {meiStrokes[0]} = {jinkaku.kaku}画</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-navy-300/70">地格 = 名の合計</span>
                  <span className="font-bold text-gold-300">{chikaku.kaku}画</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-navy-300/70">外格 = 総格 − 人格</span>
                  <span className="font-bold text-gold-300">{soukaku.kaku} − {jinkaku.kaku} = {gaikaku.kaku}画</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-navy-300/70">総格 = 全文字の合計</span>
                  <span className="font-bold text-gold-300">{soukaku.kaku}画</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== スライド3: 人格（最重要） ===== */}
        <GokakuSlide detail={jinkaku} highlight />

        {/* ===== スライド4: 地格 ===== */}
        <GokakuSlide detail={chikaku} />

        {/* ===== スライド5: 総格 ===== */}
        <GokakuSlide detail={soukaku} />

        {/* ===== スライド6: 外格 ===== */}
        <GokakuSlide detail={gaikaku} />

        {/* ===== スライド7: 三才配置 ===== */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-md space-y-5 sm:space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-[0.2em] text-gold-gradient">
                <ruby>三才配置<rp>(</rp><rt className="text-[0.5rem] opacity-60">さんさいはいち</rt><rp>)</rp></ruby>
              </h2>
              <p className="text-sm text-navy-300/60">天・人・地の<ruby>五行<rp>(</rp><rt className="text-[0.5rem] opacity-60">ごぎょう</rt><rp>)</rp></ruby>バランス</p>
            </div>

            {/* 三才の図 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 space-y-5">
              <div className="flex justify-center items-center gap-4">
                {sansai.tenchi.map((g, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-navy-400/60 mb-1">{["天", "人", "地"][i]}</p>
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${gogyoBg(g)} border border-opacity-30`}>
                      <span className={`text-xl sm:text-2xl font-bold ${gogyoColor(g)}`}>{g}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 吉凶 */}
              <div className="text-center">
                <span className={`inline-block text-lg font-bold px-4 py-1 rounded-full border ${kikkyoBg(sansai.kikkyo)}`}>
                  <span className={kikkyoColor(sansai.kikkyo)}>{sansai.kikkyo}</span>
                </span>
              </div>

              {/* 解説 */}
              <p className="text-sm text-navy-200/80 leading-relaxed">
                {sansai.description}
              </p>
            </div>

            {/* 五行の相性解説 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-6 space-y-3">
              <h3 className="text-center text-sm text-gold-400/70 tracking-widest">五行の関係</h3>
              <div className="text-sm text-navy-200/70 leading-relaxed space-y-2">
                <p><span className="text-gold-400">相生</span>（生み出す）: 木→火→土→金→水→木</p>
                <p><span className="text-red-300/80">相剋</span>（剋し合う）: 木→土→水→火→金→木</p>
                <p className="text-navy-400/60 text-xs mt-2">
                  天格・人格・地格の五行が相生で巡ると大吉。相剋が多いと苦労を暗示します。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== スライド8: 陰陽配列 ===== */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-md space-y-5 sm:space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-[0.2em] text-gold-gradient">
                <ruby>陰陽配列<rp>(</rp><rt className="text-[0.5rem] opacity-60">いんようはいれつ</rt><rp>)</rp></ruby>
              </h2>
              <p className="text-sm text-navy-300/60">各文字の画数の奇偶から読み解く気の流れ</p>
            </div>

            {/* 陰陽パターン表示 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 space-y-5">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gold-400/60 tracking-widest mb-3 text-center">姓</p>
                  <div className="flex gap-3 justify-center">
                    {[...sei].map((ch, i) => (
                      <div key={i} className="text-center">
                        <span className="text-xl text-navy-100">{ch}</span>
                        <p className="text-xs text-navy-400 mt-1">{seiStrokes[i]}画</p>
                        <div className={`mt-1.5 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          result.inyo.pattern[i] === '陽'
                            ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                            : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                        }`}>
                          {result.inyo.pattern[i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full h-px bg-gold-500/10" />
                <div>
                  <p className="text-xs text-gold-400/60 tracking-widest mb-3 text-center">名</p>
                  <div className="flex gap-3 justify-center">
                    {[...mei].map((ch, i) => {
                      const patternIdx = seiStrokes.length + i;
                      return (
                        <div key={i} className="text-center">
                          <span className="text-xl text-navy-100">{ch}</span>
                          <p className="text-xs text-navy-400 mt-1">{meiStrokes[i]}画</p>
                          <div className={`mt-1.5 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            result.inyo.pattern[patternIdx] === '陽'
                              ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                              : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                          }`}>
                            {result.inyo.pattern[patternIdx]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 吉凶 */}
              <div className="text-center">
                <span className={`inline-block text-lg font-bold px-4 py-1 rounded-full border ${kikkyoBg(result.inyo.kikkyo)}`}>
                  <span className={kikkyoColor(result.inyo.kikkyo)}>{result.inyo.kikkyo}</span>
                </span>
              </div>
            </div>

            {/* 解説 */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-6 space-y-3">
              <h3 className="text-center text-sm text-gold-400/70 tracking-widest">陰陽配列の意味</h3>
              <p className="text-sm text-navy-200/80 leading-relaxed">
                {result.inyo.description}
              </p>
            </div>

            <div className="ornament-border rounded-xl bg-navy-900/30 p-4 space-y-2">
              <p className="text-xs text-navy-400/60 tracking-widest">陰陽配列とは</p>
              <p className="text-sm text-navy-300/60 leading-relaxed">
                名前の各文字の画数が奇数（陽）か偶数（陰）かを見て、配列のバランスから吉凶を判断する手法です。
                陰陽が交互に並ぶ配列が最も良く、全て同じに偏ると凶とされます。
              </p>
            </div>
          </div>
        </div>

        {/* ===== スライド9: アドバイス＆完了 ===== */}
        <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
          <div className="w-full max-w-md space-y-5 sm:space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-[0.2em] text-gold-gradient">総合アドバイス</h2>
              <p className="text-sm text-navy-300/60">あなたの名前が持つ力を活かすヒント</p>
            </div>

            {/* メインアドバイス */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 space-y-4">
              <div className="text-center">
                <p className="text-gold-400/70 text-sm tracking-widest mb-2">あなたの本質（人格）</p>
                <p className="text-lg text-navy-100 font-medium">{jinkaku.suri.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {jinkaku.suri.keywords.map(kw => (
                  <span key={kw} className="px-3 py-1 rounded-full text-xs border border-gold-500/20 text-gold-300/80 bg-gold-500/5">
                    {kw}
                  </span>
                ))}
              </div>
              <p className="text-sm text-navy-200/80 leading-relaxed">{jinkaku.suri.detail}</p>
            </div>

            {/* 強みと注意点 */}
            <div className="grid grid-cols-1 gap-3">
              <div className="ornament-border rounded-xl bg-navy-900/40 p-4 space-y-2">
                <p className="text-sm text-emerald-300/80 tracking-widest font-medium">強み</p>
                <p className="text-sm text-navy-200/80 leading-relaxed">
                  {getStrength(gokakuDetails)}
                </p>
              </div>
              <div className="ornament-border rounded-xl bg-navy-900/40 p-4 space-y-2">
                <p className="text-sm text-amber-300/80 tracking-widest font-medium">気をつけたい点</p>
                <p className="text-sm text-navy-200/80 leading-relaxed">
                  {getCaution(gokakuDetails, sansai)}
                </p>
              </div>
            </div>

            {/* ラッキーポイント */}
            <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 space-y-3">
              <p className="text-center text-sm text-gold-400/70 tracking-widest">開運のヒント</p>
              <p className="text-sm text-navy-200/80 leading-relaxed">
                {getAdvice(jinkaku, sansai)}
              </p>
            </div>

            {/* 共有ボタン */}
            <ShareButtons
              resultUrl={encodeSeimei(result.sei, result.mei)}
            />

            {/* ボタン */}
            <div className="space-y-3 pt-2">
              {onAisho && (
                <button onClick={onAisho} className="group relative w-full">
                  <div className="relative ornament-border rounded-xl px-6 py-4 bg-pink-500/10 border border-pink-500/30 active:bg-pink-500/20">
                    <span className="text-base tracking-[0.2em] text-pink-300 font-bold">
                      相性診断へ
                    </span>
                    <p className="text-xs text-navy-400/60 tracking-wider mt-1">あなたの情報はそのまま使えます</p>
                  </div>
                </button>
              )}
              <button
                onClick={onRetry}
                className="w-full ornament-border rounded-full px-10 py-3 bg-navy-900/60 text-gold-400 tracking-wider text-sm"
              >
                別の名前で鑑定する
              </button>
              <div className="text-center">
                <button onClick={onTop} className="text-navy-500 hover:text-gold-500/60 text-sm tracking-widest transition-colors duration-300">
                  ← トップに戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      </SlideViewer>
    </div>
  );
}

// ===== 五格詳細スライド =====
function GokakuSlide({ detail, highlight }: { detail: GokakuDetail; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-md space-y-5 sm:space-y-7">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-[0.2em] text-gold-gradient">
            <ruby>{detail.name}<rp>(</rp><rt className="text-[0.5rem] opacity-60">{detail.yomi}</rt><rp>)</rp></ruby>
            {highlight && <span className="ml-2 text-xs text-gold-500/60 align-middle">★最重要</span>}
          </h2>
          <p className="text-sm text-navy-300/60">{detail.period} — {detail.meaning}</p>
        </div>

        {/* 画数と吉凶 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-7 text-center space-y-4">
          <div>
            <span className="text-5xl font-black text-gold-gradient">{detail.kaku}</span>
            <span className="text-lg text-navy-300/60 ml-1">画</span>
          </div>
          <div>
            <span className={`inline-block text-xl font-bold px-5 py-1.5 rounded-full border ${kikkyoBg(detail.suri.kikkyo)}`}>
              <span className={kikkyoColor(detail.suri.kikkyo)}>{detail.suri.kikkyo}</span>
            </span>
            {detail.suri.saijo && (
              <p className="text-xs text-gold-400/60 mt-2 tracking-wider">★ 最上吉数</p>
            )}
          </div>
        </div>

        {/* キーワード */}
        <div className="flex flex-wrap gap-2 justify-center">
          {detail.suri.keywords.map(kw => (
            <span key={kw} className="px-3 py-1.5 rounded-full text-sm border border-gold-500/20 text-gold-300/80 bg-gold-500/5 tracking-wider">
              {kw}
            </span>
          ))}
        </div>

        {/* 解説 */}
        <div className="ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-6 space-y-3">
          <h3 className="text-sm text-gold-400/70 tracking-widest">{detail.suri.summary}</h3>
          <p className="text-sm text-navy-200/80 leading-relaxed">{detail.suri.detail}</p>
        </div>

        {/* 数理の意味 */}
        <div className="ornament-border rounded-xl bg-navy-900/30 p-4 space-y-2">
          <p className="text-xs text-navy-400/60 tracking-widest">この格が示すもの</p>
          <p className="text-sm text-navy-200/70 leading-relaxed">{detail.meaning}</p>
          <p className="text-xs text-navy-400/50 mt-1">影響する時期: {detail.period}</p>
        </div>
      </div>
    </div>
  );
}

// ===== ヘルパー関数 =====

function getStrength(details: GokakuDetail[]): string {
  const good = details.filter(d => d.suri.kikkyo === "大吉" || d.suri.kikkyo === "吉");
  if (good.length === 0) return "困難を乗り越える粘り強さと、逆境をバネにする力を秘めています。";
  if (good.length >= 4) return "名前全体のバランスが非常に良く、どの時期においても安定した運勢に恵まれています。特に" + good[0].name + "が示す「" + good[0].suri.keywords[0] + "」の力が際立っています。";
  const best = good[0];
  return `${best.name}（${best.period}）の運勢が特に強く、「${best.suri.keywords.join("・")}」の力に恵まれています。${best.suri.summary}`;
}

function getCaution(details: GokakuDetail[], sansai: { kikkyo: string }): string {
  const bad = details.filter(d => d.suri.kikkyo === "凶" || d.suri.kikkyo === "大凶");
  if (bad.length === 0 && sansai.kikkyo !== "凶") return "特に大きな注意点はありません。現在の良い流れを維持し、慢心せず歩み続けることが開運の鍵です。";
  if (bad.length > 0) {
    const worst = bad[0];
    return `${worst.name}（${worst.period}）にやや弱さが見られます。${worst.suri.detail} 意識して補うことで運勢は十分に好転します。`;
  }
  return "三才配置にやや緊張がある時期があります。無理をせず、周囲の支えを大切にすることで乗り越えられます。";
}

function getAdvice(jinkaku: GokakuDetail, sansai: { kikkyo: string; tenchi: [string, string, string] }): string {
  const jin = sansai.tenchi[1]; // 人格の五行
  const adviceMap: Record<string, string> = {
    "木": "木の気を持つあなたは、成長と発展を象徴します。自然に触れる時間や、新しいことへの挑戦が開運につながります。春の生命力のように、伸びやかに生きることを心がけましょう。",
    "火": "火の気を持つあなたは、情熱と輝きを象徴します。人前に出ること、自分を表現することが開運の鍵。明るさと温かさを周囲に分け与えることで、さらなる幸運を引き寄せます。",
    "土": "土の気を持つあなたは、安定と信頼を象徴します。基盤をしっかり固めること、誠実に人と向き合うことが開運につながります。焦らず着実に積み上げる姿勢が幸福を呼びます。",
    "金": "金の気を持つあなたは、決断力と洗練を象徴します。質の高いものに触れること、整理整頓された環境が開運の鍵。自分の美意識と判断力を信じて行動しましょう。",
    "水": "水の気を持つあなたは、知恵と柔軟性を象徴します。学び続けること、流れに逆らわず変化を受け入れることが開運につながります。深い思考と直感力があなたの最大の武器です。",
  };
  return adviceMap[jin] || "バランスを大切に、自分らしく歩み続けることが開運の鍵です。";
}
