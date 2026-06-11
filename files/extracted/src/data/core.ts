// ============================================================
// 四柱推命 計算用 確定データ（第1層）
// 答えが一意に定まるマスターデータ。鑑定文ではなく定義。
// ============================================================

// ---- 五行 ----
export type Gogyo = "木" | "火" | "土" | "金" | "水";
export type InYo = "陽" | "陰";

// 五行の相生（生み出す関係）: 木→火→土→金→水→木
export const SOSEI: Record<Gogyo, Gogyo> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

// 五行の相剋（抑える関係）: 木→土→水→火→金→木
export const SOKOKU: Record<Gogyo, Gogyo> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

// ---- 天干（十干） ----
export interface Tenkan {
  kanji: string;       // 甲
  yomi: string;        // きのえ
  gogyo: Gogyo;        // 木
  inyo: InYo;          // 陽
}

export const TENKAN: Tenkan[] = [
  { kanji: "甲", yomi: "きのえ", gogyo: "木", inyo: "陽" },
  { kanji: "乙", yomi: "きのと", gogyo: "木", inyo: "陰" },
  { kanji: "丙", yomi: "ひのえ", gogyo: "火", inyo: "陽" },
  { kanji: "丁", yomi: "ひのと", gogyo: "火", inyo: "陰" },
  { kanji: "戊", yomi: "つちのえ", gogyo: "土", inyo: "陽" },
  { kanji: "己", yomi: "つちのと", gogyo: "土", inyo: "陰" },
  { kanji: "庚", yomi: "かのえ", gogyo: "金", inyo: "陽" },
  { kanji: "辛", yomi: "かのと", gogyo: "金", inyo: "陰" },
  { kanji: "壬", yomi: "みずのえ", gogyo: "水", inyo: "陽" },
  { kanji: "癸", yomi: "みずのと", gogyo: "水", inyo: "陰" },
];

// ---- 地支（十二支） ----
export interface Chishi {
  kanji: string;       // 子
  yomi: string;        // ね
  gogyo: Gogyo;        // 水
  inyo: InYo;          // 陽
  zokan: string[];     // 蔵干（内包する天干）主気→中気→余気の順
  jikoku: string;      // 対応する時刻帯
}

export const CHISHI: Chishi[] = [
  { kanji: "子", yomi: "ね", gogyo: "水", inyo: "陽", zokan: ["癸"], jikoku: "23-1時" },
  { kanji: "丑", yomi: "うし", gogyo: "土", inyo: "陰", zokan: ["己", "癸", "辛"], jikoku: "1-3時" },
  { kanji: "寅", yomi: "とら", gogyo: "木", inyo: "陽", zokan: ["甲", "丙", "戊"], jikoku: "3-5時" },
  { kanji: "卯", yomi: "う", gogyo: "木", inyo: "陰", zokan: ["乙"], jikoku: "5-7時" },
  { kanji: "辰", yomi: "たつ", gogyo: "土", inyo: "陽", zokan: ["戊", "乙", "癸"], jikoku: "7-9時" },
  { kanji: "巳", yomi: "み", gogyo: "火", inyo: "陰", zokan: ["丙", "庚", "戊"], jikoku: "9-11時" },
  { kanji: "午", yomi: "うま", gogyo: "火", inyo: "陽", zokan: ["丁", "己"], jikoku: "11-13時" },
  { kanji: "未", yomi: "ひつじ", gogyo: "土", inyo: "陰", zokan: ["己", "丁", "乙"], jikoku: "13-15時" },
  { kanji: "申", yomi: "さる", gogyo: "金", inyo: "陽", zokan: ["庚", "壬", "戊"], jikoku: "15-17時" },
  { kanji: "酉", yomi: "とり", gogyo: "金", inyo: "陰", zokan: ["辛"], jikoku: "17-19時" },
  { kanji: "戌", yomi: "いぬ", gogyo: "土", inyo: "陽", zokan: ["戊", "辛", "丁"], jikoku: "19-21時" },
  { kanji: "亥", yomi: "い", gogyo: "水", inyo: "陰", zokan: ["壬", "甲"], jikoku: "21-23時" },
];

// ---- 60干支（六十干支）----
// 天干と地支を順に組み合わせた循環。日柱算出などの基礎。
export const KANSHI_60: string[] = (() => {
  const arr: string[] = [];
  for (let i = 0; i < 60; i++) {
    arr.push(TENKAN[i % 10].kanji + CHISHI[i % 12].kanji);
  }
  return arr;
})();

// ---- 通変星（十神）----
// 日主（自分の天干）から見た、対象の天干の関係性で決まる10種。
export type Tsuhensei =
  | "比肩" | "劫財"     // 同じ五行（自分と同質）
  | "食神" | "傷官"     // 自分が生じる五行
  | "偏財" | "正財"     // 自分が剋す五行
  | "偏官" | "正官"     // 自分を剋す五行
  | "偏印" | "印綬";    // 自分を生じる五行

// 通変星の判定ロジック（日主と対象天干から算出）
export function getTsuhensei(nisshu: Tenkan, target: Tenkan): Tsuhensei {
  const sameInyo = nisshu.inyo === target.inyo;
  // 同質（比劫）
  if (nisshu.gogyo === target.gogyo) {
    return sameInyo ? "比肩" : "劫財";
  }
  // 自分が生じる（食傷）
  if (SOSEI[nisshu.gogyo] === target.gogyo) {
    return sameInyo ? "食神" : "傷官";
  }
  // 自分が剋す（財）
  if (SOKOKU[nisshu.gogyo] === target.gogyo) {
    return sameInyo ? "偏財" : "正財";
  }
  // 自分を剋す（官殺）
  if (SOKOKU[target.gogyo] === nisshu.gogyo) {
    return sameInyo ? "偏官" : "正官";
  }
  // 自分を生じる（印）
  return sameInyo ? "偏印" : "印綬";
}

// ---- 十二運星 ----
// 日主の天干が、各地支においてどのエネルギー段階にあるかを示す12段階。
export type Juniunsei =
  | "長生" | "沐浴" | "冠帯" | "建禄" | "帝旺" | "衰"
  | "病" | "死" | "墓" | "絶" | "胎" | "養";

// 各天干の十二運の起点（長生にあたる地支のindex）
// 陽干は順行、陰干は逆行する。
const CHOSEI_START: Record<string, { startChishiIndex: number; forward: boolean }> = {
  甲: { startChishiIndex: 11, forward: true },  // 亥
  丙: { startChishiIndex: 2, forward: true },   // 寅
  戊: { startChishiIndex: 2, forward: true },   // 寅
  庚: { startChishiIndex: 5, forward: true },   // 巳
  壬: { startChishiIndex: 8, forward: true },   // 申
  乙: { startChishiIndex: 6, forward: false },  // 午
  丁: { startChishiIndex: 9, forward: false },  // 酉
  己: { startChishiIndex: 9, forward: false },  // 酉
  辛: { startChishiIndex: 0, forward: false },  // 子
  癸: { startChishiIndex: 3, forward: false },  // 卯
};

const JUNIUNSEI_ORDER: Juniunsei[] = [
  "長生", "沐浴", "冠帯", "建禄", "帝旺", "衰",
  "病", "死", "墓", "絶", "胎", "養",
];

// 日主と地支から十二運星を算出
export function getJuniunsei(nisshuKanji: string, chishiIndex: number): Juniunsei {
  const cfg = CHOSEI_START[nisshuKanji];
  let step: number;
  if (cfg.forward) {
    step = (chishiIndex - cfg.startChishiIndex + 12) % 12;
  } else {
    step = (cfg.startChishiIndex - chishiIndex + 12) % 12;
  }
  return JUNIUNSEI_ORDER[step];
}

// ---- 索引ヘルパー ----
export const findTenkan = (kanji: string) =>
  TENKAN.find((t) => t.kanji === kanji)!;
export const findChishi = (kanji: string) =>
  CHISHI.find((c) => c.kanji === kanji)!;
export const findChishiIndex = (kanji: string) =>
  CHISHI.findIndex((c) => c.kanji === kanji);
