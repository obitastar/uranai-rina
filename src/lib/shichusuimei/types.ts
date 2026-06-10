// 十干（天干）
export const JIKKAN = [
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
] as const;
export type Jikkan = (typeof JIKKAN)[number];

// 十二支（地支）
export const JUNISHI = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
] as const;
export type Junishi = (typeof JUNISHI)[number];

// 五行
export const GOGYO = ['木', '火', '土', '金', '水'] as const;
export type Gogyo = (typeof GOGYO)[number];

// 陰陽
export type Inyo = '陽' | '陰';

// 干支（六十干支の1つ）
export interface Kanshi {
  kan: Jikkan;
  shi: Junishi;
  index: number; // 0-59
}

// 四柱
export interface FourPillars {
  year: Kanshi;
  month: Kanshi;
  day: Kanshi;
  hour: Kanshi | null; // 出生時刻不明の場合null
}

// 通変星
export const TSUHENSEI = [
  '比肩', '劫財', '食神', '傷官', '偏財',
  '正財', '偏官', '正官', '偏印', '印綬',
] as const;
export type Tsuhensei = (typeof TSUHENSEI)[number];

// 十二運
export const JUNIUNSEI = [
  '長生', '沐浴', '冠帯', '建禄', '帝旺', '衰',
  '病', '死', '墓', '絶', '胎', '養',
] as const;
export type Juniunsei = (typeof JUNIUNSEI)[number];

// 性別
export type Gender = 'male' | 'female';

// 入力
export interface FortuneInput {
  year: number;
  month: number;
  day: number;
  hour: number | null; // 0-23, nullなら不明
  gender: Gender;
}

// 年ごとの運勢
export interface YearlyFortune {
  year: number;
  kanshi: Kanshi;
  tsuhensei: Tsuhensei;
  juniunsei: Juniunsei;
  reading: string;
}

// 鑑定結果
export interface FortuneResult {
  input: FortuneInput;
  fourPillars: FourPillars;
  // 日主
  nicchu: Jikkan;
  // 通変星（年・月・日・時）
  tpiYear: Tsuhensei;
  tpiMonth: Tsuhensei;
  tpiHour: Tsuhensei | null;
  // 十二運（年支・月支・日支・時支）
  juniunYear: Juniunsei;
  juniunMonth: Juniunsei;
  juniunDay: Juniunsei;
  juniunHour: Juniunsei | null;
  // 蔵干（日支の蔵干通変星）
  zokanTsuhensei: Tsuhensei;
  // 今年の干支
  currentYearKanshi: Kanshi;
  currentYearTsuhensei: Tsuhensei;
  // 10年運勢
  tenYearFortune: YearlyFortune[];
  // 鑑定文
  readings: {
    essence: string;
    love: string;
    work: string;
    yearly: string;
  };
}
