import type { Jikkan, Junishi, Kanshi, FourPillars, Tsuhensei, Juniunsei, Gender } from './types';
import { JIKKAN } from './types';
import { getTsuhensei, getJuniunsei } from './stars';
import { getKanshi } from './kanshi';
import { kanInyo } from './gogyo';

// ---------- 型定義 ----------

export interface DaiunPeriod {
  startAge: number;       // 開始年齢
  endAge: number;         // 終了年齢（startAge + 9）
  kanshi: Kanshi;         // 大運の干支
  tsuhensei: Tsuhensei;   // 日主から見た通変星
  juniunsei: Juniunsei;   // 日主から見た十二運
}

export interface DaiunResult {
  direction: '順行' | '逆行';
  startAge: number;       // 立運年齢
  periods: DaiunPeriod[]; // 大運一覧（8期分 = 80年分）
  reading: string;        // 大運全体の鑑定文
}

// ---------- 節入り日テーブル（calendar.ts と同じ標準値） ----------

/** 各節気の標準日。インデックス0=立春(2/4)〜11=小寒(1/6) */
const SETSU_DATES: { month: number; day: number }[] = [
  { month: 2, day: 4 },   // 立春
  { month: 3, day: 6 },   // 啓蟄
  { month: 4, day: 5 },   // 清明
  { month: 5, day: 6 },   // 立夏
  { month: 6, day: 6 },   // 芒種
  { month: 7, day: 7 },   // 小暑
  { month: 8, day: 7 },   // 立秋
  { month: 9, day: 8 },   // 白露
  { month: 10, day: 8 },  // 寒露
  { month: 11, day: 7 },  // 立冬
  { month: 12, day: 7 },  // 大雪
  { month: 1, day: 6 },   // 小寒
];

// ---------- 日数計算ユーティリティ ----------

/** Date オブジェクトを UTC 基準で生成（タイムゾーンずれ防止） */
function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

/** 2つの日付間の日数差（絶対値） */
function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// ---------- 節入り日の前後を求める ----------

/**
 * 生年月日に対して「前の節入り日」と「次の節入り日」を返す
 * calendar.ts の SETSU_DATES 標準値ベース
 */
function getAdjacentSetsuDates(
  year: number, month: number, day: number
): { prev: Date; next: Date } {
  // 当年 ± 1年分の全節入り日を列挙（年またぎ対策）
  const allSetsu: Date[] = [];
  for (const y of [year - 1, year, year + 1]) {
    for (const s of SETSU_DATES) {
      allSetsu.push(utcDate(y, s.month, s.day));
    }
  }

  const birth = utcDate(year, month, day);
  let prev: Date = allSetsu[0];
  let next: Date = allSetsu[allSetsu.length - 1];

  for (let i = 0; i < allSetsu.length; i++) {
    const setsu = allSetsu[i];
    if (setsu.getTime() <= birth.getTime()) {
      prev = setsu;
    }
    if (setsu.getTime() > birth.getTime()) {
      next = setsu;
      break;
    }
  }

  return { prev, next };
}

// ---------- 順行・逆行の判定 ----------

/**
 * 年干の陰陽と性別から順行・逆行を判定
 * - 陽干 × 男性 → 順行
 * - 陰干 × 女性 → 順行
 * - 陰干 × 男性 → 逆行
 * - 陽干 × 女性 → 逆行
 */
function getDirection(yearKan: Jikkan, gender: Gender): '順行' | '逆行' {
  const isYang = kanInyo(yearKan) === '陽';
  const isMale = gender === 'male';
  return (isYang === isMale) ? '順行' : '逆行';
}

// ---------- 立運年齢の算出 ----------

/**
 * 生年月日と順逆から立運年齢を求める
 * 日数 ÷ 3 = 年齢（余り1→+4ヶ月、余り2→+8ヶ月、簡易版は四捨五入）
 */
function calcStartAge(
  year: number, month: number, day: number,
  direction: '順行' | '逆行'
): number {
  const { prev, next } = getAdjacentSetsuDates(year, month, day);
  const birth = utcDate(year, month, day);

  const days = direction === '順行'
    ? daysBetween(next, birth)
    : daysBetween(birth, prev);

  const baseAge = Math.floor(days / 3);
  const remainder = days % 3;

  // 余り1(+4ヶ月)→四捨五入で+0、余り2(+8ヶ月)→四捨五入で+1
  return remainder >= 2 ? baseAge + 1 : baseAge;
}

// ---------- 鑑定文の生成 ----------

/** 通変星のカテゴリ（鑑定文用） */
function tsuhenseiCategory(ts: Tsuhensei): string {
  switch (ts) {
    case '比肩': case '劫財':
      return '自立・競争';
    case '食神': case '傷官':
      return '表現・才能の発揮';
    case '偏財': case '正財':
      return '財運・人脈の広がり';
    case '偏官': case '正官':
      return '地位・責任の拡大';
    case '偏印': case '印綬':
      return '学び・知恵の蓄積';
    default:
      return '';
  }
}

/** 大運全体の流れを俯瞰した鑑定文（100-150字）を生成 */
function generateReading(periods: DaiunPeriod[]): string {
  if (periods.length === 0) return '';

  // 前半（0-3期 ≒ 若年期）と後半（4-7期 ≒ 壮年〜老年期）に分割
  const half = Math.ceil(periods.length / 2);
  const earlyPeriods = periods.slice(0, half);
  const latePeriods = periods.slice(half);

  const earlyTheme = tsuhenseiCategory(earlyPeriods[0].tsuhensei);
  const lateTheme = tsuhenseiCategory(latePeriods[0].tsuhensei);

  // 十二運のエネルギー傾向で強弱を判定
  const STRONG_SEI: Juniunsei[] = ['長生', '冠帯', '建禄', '帝旺'];
  const earlyStrong = earlyPeriods.filter(p => STRONG_SEI.includes(p.juniunsei)).length;
  const lateStrong = latePeriods.filter(p => STRONG_SEI.includes(p.juniunsei)).length;

  const earlyTone = earlyStrong >= 2 ? '勢いに満ちた' : '着実に力を蓄える';
  const lateTone = lateStrong >= 2 ? '充実した運気が続く' : '穏やかに安定へ向かう';

  return (
    `人生前半は${earlyTone}時期で、${earlyTheme}がテーマとなります。` +
    `後半は${lateTone}流れとなり、${lateTheme}が鍵を握ります。` +
    `大運の切り替わり時期は環境の変化が起こりやすいため、柔軟な心構えが大切です。`
  );
}

// ---------- メイン関数 ----------

/**
 * 大運を算出する
 * @param input  生年月日 { year, month, day }
 * @param fourPillars 四柱
 * @param nicchu 日主（日柱天干）
 * @param gender 性別
 * @returns DaiunResult
 */
export function calculateDaiun(
  input: { year: number; month: number; day: number },
  fourPillars: FourPillars,
  nicchu: Jikkan,
  gender: Gender,
): DaiunResult {
  const yearKan = fourPillars.year.kan;
  const direction = getDirection(yearKan, gender);

  // 立運年齢
  const startAge = calcStartAge(input.year, input.month, input.day, direction);

  // 月柱の六十干支インデックスを起点に大運干支を求める
  const monthIndex = fourPillars.month.index;
  const step = direction === '順行' ? 1 : -1;

  const periods: DaiunPeriod[] = [];
  const PERIOD_COUNT = 8; // 8期分（約80年）

  for (let i = 1; i <= PERIOD_COUNT; i++) {
    const kanshi = getKanshi(monthIndex + step * i);
    const periodStartAge = startAge + (i - 1) * 10;
    const tsuhensei = getTsuhensei(nicchu, kanshi.kan);
    const juniunsei = getJuniunsei(nicchu, kanshi.shi);

    periods.push({
      startAge: periodStartAge,
      endAge: periodStartAge + 9,
      kanshi,
      tsuhensei,
      juniunsei,
    });
  }

  const reading = generateReading(periods);

  return {
    direction,
    startAge,
    periods,
    reading,
  };
}
