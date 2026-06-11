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

// 年ごとの詳細運勢
export interface YearlyFortuneDetail {
  work: string;
  love: string;
  money: string;
  marriage: string;
  children: string;
  health: string;
}

// 年ごとの運勢
export interface YearlyFortune {
  year: number;
  kanshi: Kanshi;
  tsuhensei: Tsuhensei;
  juniunsei: Juniunsei;
  level: 'good' | 'neutral' | 'caution';
  reading: string;
  detail: YearlyFortuneDetail;
}

// 五行バランス
export interface GogyoBalance {
  gogyo: Gogyo;
  count: number;
}

// 日主の詳細情報
export interface NisshuDetail {
  symbol: string;
  catchphrase: string;
  keywords: string[];
}

// 通変星の詳細情報
export interface TsuhenseiDetail {
  catchphrase: string;
  talent: string;
  caution: string;
}

// 十二運星の詳細情報
export interface JuniunseiDetail {
  catchphrase: string;
  energy: string;
  message: string;
}

// 年運の追加情報
export interface NenunDetail {
  title: string;
  luckyAction: string;
}

// 空亡データ
export interface KuubouInfo {
  pair: [Junishi, Junishi];
  junName: string;
  meaning: string;
  advice: string;
  isKuubouYear: boolean; // 今年が空亡年か
}

// 神殺データ
export interface ShinsatsuInfo {
  name: string;
  exists: boolean;
  description: string;
}

// 九星データ
export interface KyuseiInfo {
  number: number;
  name: string;
  gogyo: string;
  colors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
  personality: string;
}

// ラッキーデータ
export interface LuckyInfo {
  colors: string[];
  items: string[];
  numbers: number[];
  direction: string;
  season: string;
  description: string;
}

// 地支関係
export interface ChishiRelation {
  type: '冲' | '支合' | '三合' | '刑' | '害' | '破';
  branches: string[];
  positions: string[];
  result?: string;
  description: string;
}

export interface ChishiRelationResult {
  relations: ChishiRelation[];
  summary: string;
}

// 大運
export interface DaiunPeriod {
  startAge: number;
  endAge: number;
  kanshi: Kanshi;
  tsuhensei: Tsuhensei;
  juniunsei: Juniunsei;
}

export interface DaiunResult {
  direction: '順行' | '逆行';
  startAge: number;
  periods: DaiunPeriod[];
  reading: string;
}

// 身強身弱
export type StrengthLevel = '身強' | 'やや身強' | '中和' | 'やや身弱' | '身弱';

export interface StrengthResult {
  level: StrengthLevel;
  score: number;
  youjin: Gogyo;
  kijin: Gogyo;
  kijin_bad: Gogyo;
  reading: string;
}

// 納音
export interface NacchinInfo {
  name: string;
  yomi: string;
  gogyo: Gogyo;
  symbol: string;
  personality: string;
}

// 格局
export interface KakkyokuInfo {
  name: string;
  category: '内格' | '外格';
  description: string;
  reading: string;
  strength: string;
  weakness: string;
}

// 蔵干詳細（全柱分）
export interface ZokanDetail {
  honki: Jikkan;
  chuki: Jikkan | null;
  yoki: Jikkan | null;
  tpiHonki: Tsuhensei;
  tpiChuki: Tsuhensei | null;
  tpiYoki: Tsuhensei | null;
}

// 鑑定結果
export interface FortuneResult {
  input: FortuneInput;
  fourPillars: FourPillars;
  // 日主
  nicchu: Jikkan;
  nisshuDetail: NisshuDetail;
  // 通変星（年・月・日・時）
  tpiYear: Tsuhensei;
  tpiMonth: Tsuhensei;
  tpiHour: Tsuhensei | null;
  // 通変星の詳細
  tsuhenseiDetail: TsuhenseiDetail;
  // 十二運（年支・月支・日支・時支）
  juniunYear: Juniunsei;
  juniunMonth: Juniunsei;
  juniunDay: Juniunsei;
  juniunHour: Juniunsei | null;
  // 十二運の詳細
  juniunDayDetail: JuniunseiDetail;
  // 蔵干（日支の蔵干通変星）
  zokanTsuhensei: Tsuhensei;
  // 五行バランス
  gogyoBalance: GogyoBalance[];
  gogyoReading: string;
  // 今年の干支
  currentYearKanshi: Kanshi;
  currentYearTsuhensei: Tsuhensei;
  // 年運の追加情報
  nenunDetail: NenunDetail;
  // 10年運勢
  tenYearFortune: YearlyFortune[];
  // 鑑定文
  readings: {
    essence: string;
    love: string;
    work: string;
    yearly: string;
  };
  // --- 新規追加 ---
  // 空亡（天中殺）
  kuubou: KuubouInfo;
  // 神殺
  shinsatsu: ShinsatsuInfo[];
  // 九星気学
  kyusei: KyuseiInfo;
  // ラッキーカラー・アイテム
  lucky: LuckyInfo;
  // 健康運
  healthReading: string;
  // 地支関係（冲・合・刑・害・破）
  chishiRelations: ChishiRelationResult;
  // 大運
  daiun: DaiunResult;
  // 身強身弱・用神
  strength: StrengthResult;
  // 納音
  nacchin: NacchinInfo;
  // 格局
  kakkyoku: KakkyokuInfo;
  // 蔵干詳細（年・月・日・時の全柱分）
  zokanDetails: {
    year: ZokanDetail;
    month: ZokanDetail;
    day: ZokanDetail;
    hour: ZokanDetail | null;
  };
}
