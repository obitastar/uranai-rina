// ============================================================
// 姓名判断 エントリポイント
// 熊崎健翁式に基づく姓名判断ロジック
// ============================================================

import { getSuri, type SuriData } from "./suri";
import { calcGokaku, calcSansai, GOKAKU_META, type Gokaku, type SansaiData, type Gogyo } from "./gokaku";
import { getStrokes } from "./kakusu-dict";

// --- 型定義 ---

export interface SeimeiInput {
  sei: string;  // 姓（漢字・ひらがな・カタカナ）
  mei: string;  // 名（漢字・ひらがな・カタカナ）
}

export interface GokakuDetail {
  key: string;
  name: string;
  yomi: string;
  period: string;
  meaning: string;
  importance: number;
  kaku: number;          // 画数
  suri: SuriData;        // 対応する数理
}

export interface SeimeiResult {
  sei: string;
  mei: string;
  seiStrokes: number[];  // 姓の各文字の画数
  meiStrokes: number[];  // 名の各文字の画数
  gokaku: Gokaku;        // 五格の数値
  gokakuDetails: GokakuDetail[];  // 五格それぞれの数理結果（重要度順）
  sansai: SansaiData;    // 三才配置
  unknownChars?: string[]; // 辞書にない文字（あれば）
}

export class SeimeiError extends Error {
  constructor(
    message: string,
    public readonly unknownChars?: string[]
  ) {
    super(message);
    this.name = "SeimeiError";
  }
}

// --- メイン鑑定関数 ---

/**
 * 姓名判断の鑑定を行う
 * @param sei 姓
 * @param mei 名
 * @returns 鑑定結果
 * @throws SeimeiError 辞書にない文字が含まれる場合
 */
export function analyzeSeimei(sei: string, mei: string): SeimeiResult {
  if (!sei || !mei) {
    throw new SeimeiError("姓と名の両方を入力してください。");
  }

  // 画数を取得
  const seiResult = getStrokes(sei);
  const meiResult = getStrokes(mei);

  // 辞書にない文字のチェック
  const allUnknown = [...seiResult.unknownChars, ...meiResult.unknownChars];
  if (allUnknown.length > 0) {
    throw new SeimeiError(
      `以下の文字の画数が辞書にありません: ${allUnknown.join("、")}。手動で画数を入力してください。`,
      allUnknown
    );
  }

  // 五格計算
  const gokaku = calcGokaku(seiResult.strokes, meiResult.strokes);

  // 各格の数理を取得（重要度順にソート）
  const gokakuDetails: GokakuDetail[] = GOKAKU_META
    .slice()
    .sort((a, b) => a.importance - b.importance)
    .map((meta) => {
      const kaku = gokaku[meta.key as keyof Gokaku];
      const suri = getSuri(kaku);
      return {
        key: meta.key,
        name: meta.name,
        yomi: meta.yomi,
        period: meta.period,
        meaning: meta.meaning,
        importance: meta.importance,
        kaku,
        suri,
      };
    });

  // 三才配置
  const sansai = calcSansai(gokaku);

  return {
    sei,
    mei,
    seiStrokes: seiResult.strokes,
    meiStrokes: meiResult.strokes,
    gokaku,
    gokakuDetails,
    sansai,
  };
}

/**
 * 手動画数指定版の鑑定関数
 * 辞書にない文字がある場合に画数を直接指定して鑑定する
 */
export function analyzeSeimeiWithStrokes(
  sei: string,
  mei: string,
  seiStrokes: number[],
  meiStrokes: number[]
): SeimeiResult {
  if (seiStrokes.length !== [...sei].length) {
    throw new SeimeiError("姓の文字数と画数配列の長さが一致しません。");
  }
  if (meiStrokes.length !== [...mei].length) {
    throw new SeimeiError("名の文字数と画数配列の長さが一致しません。");
  }

  const gokaku = calcGokaku(seiStrokes, meiStrokes);

  const gokakuDetails: GokakuDetail[] = GOKAKU_META
    .slice()
    .sort((a, b) => a.importance - b.importance)
    .map((meta) => {
      const kaku = gokaku[meta.key as keyof Gokaku];
      const suri = getSuri(kaku);
      return {
        key: meta.key,
        name: meta.name,
        yomi: meta.yomi,
        period: meta.period,
        meaning: meta.meaning,
        importance: meta.importance,
        kaku,
        suri,
      };
    });

  const sansai = calcSansai(gokaku);

  return {
    sei,
    mei,
    seiStrokes,
    meiStrokes,
    gokaku,
    gokakuDetails,
    sansai,
  };
}

// --- 後方互換: 旧API (calculateSeimei) ---
// 既存のUI側が calculateSeimei を呼んでいる場合に備えた互換ラッパー
export function calculateSeimei(sei: string, mei: string) {
  return analyzeSeimei(sei, mei);
}

// Re-export
export type { SuriData, Kikkyo } from "./suri";
export type { Gokaku, SansaiData, Gogyo, GokakuMeta } from "./gokaku";
export { getSuri, normalizeKaku, KIKKYO_SCORE } from "./suri";
export { calcGokaku, calcSansai, kakuToGogyo, GOKAKU_META } from "./gokaku";
export { getCharKakusu, getStrokes, KANJI_KAKUSU, HIRAGANA_KAKUSU, KATAKANA_KAKUSU } from "./kakusu-dict";
