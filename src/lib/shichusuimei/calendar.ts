import { getKanshi, type Kanshi } from './kanshi';
import { JIKKAN, JUNISHI } from './types';

/**
 * 節気テーブル（月の切り替わり日）
 * 四柱推命では太陽暦の節気で月が切り替わる
 *
 * 簡易版: 各月の節入り日を固定値で持つ
 * （実際は年によって1日前後するが、店頭体験用途としては十分な精度）
 *
 * 月支: 寅月(1月)=立春〜, 卯月(2月)=啓蟄〜, ...
 */
const SETSU_DATES: { month: number; day: number }[] = [
  { month: 2, day: 4 },   // 立春（寅月開始）→ 四柱推命の1月
  { month: 3, day: 6 },   // 啓蟄（卯月開始）
  { month: 4, day: 5 },   // 清明（辰月開始）
  { month: 5, day: 6 },   // 立夏（巳月開始）
  { month: 6, day: 6 },   // 芒種（午月開始）
  { month: 7, day: 7 },   // 小暑（未月開始）
  { month: 8, day: 7 },   // 立秋（申月開始）
  { month: 9, day: 8 },   // 白露（酉月開始）
  { month: 10, day: 8 },  // 寒露（戌月開始）
  { month: 11, day: 7 },  // 立冬（亥月開始）
  { month: 12, day: 7 },  // 大雪（子月開始）
  { month: 1, day: 6 },   // 小寒（丑月開始）
];

/**
 * 節気精密テーブル（年ごとの節入り日のずれ）
 * 主要な年の補正値。テーブルにない年は標準日を使用
 */
const SETSU_CORRECTIONS: Record<number, Partial<Record<number, number>>> = {
  // 形式: { 年: { 節気月(1-12): 日のずれ } }
  // 例: 2024年の立春は2/4で標準通り
  // ここは必要に応じて拡張可能
};

/**
 * 太陽暦の日付から、四柱推命上の「月」（節月）を求める
 * 返り値: 1(寅月)〜12(丑月)
 */
export function getSetsuMonth(year: number, month: number, day: number): { setsuMonth: number; setsuYear: number } {
  // 節気の切り替わりをチェック
  // 丑月(12)の開始: 1/6頃
  // 寅月(1)の開始: 2/4頃
  // ...
  // 子月(11)の開始: 12/7頃

  let setsuMonth: number;
  let setsuYear = year;

  // 各節入り日と比較
  if (month === 1) {
    // 1月: 小寒(1/6)前なら前年の子月(11)、後なら丑月(12)
    const correction = SETSU_CORRECTIONS[year]?.[1] ?? 0;
    if (day < SETSU_DATES[11].day + correction) {
      setsuMonth = 11; // 子月
      setsuYear = year - 1;
    } else {
      setsuMonth = 12; // 丑月
      setsuYear = year - 1;
    }
  } else if (month === 2) {
    const correction = SETSU_CORRECTIONS[year]?.[2] ?? 0;
    if (day < SETSU_DATES[0].day + correction) {
      setsuMonth = 12; // まだ丑月
      setsuYear = year - 1;
    } else {
      setsuMonth = 1; // 寅月開始
    }
  } else {
    // 3月〜12月
    const setsuIdx = month - 2; // SETSU_DATES配列のインデックス (3月→1, 4月→2, ...)
    const correction = SETSU_CORRECTIONS[year]?.[month] ?? 0;
    if (day < SETSU_DATES[setsuIdx].day + correction) {
      setsuMonth = setsuIdx; // 前の月
      if (setsuMonth === 0) {
        setsuMonth = 12;
        setsuYear = year - 1;
      }
    } else {
      setsuMonth = setsuIdx + 1;
    }
  }

  return { setsuMonth, setsuYear };
}

/**
 * 年柱を求める
 * 四柱推命では立春で年が切り替わる
 * 年干支 = (西暦年 - 4) % 60 のインデックス
 */
export function getYearPillar(setsuYear: number): Kanshi {
  const index = ((setsuYear - 4) % 60 + 60) % 60;
  return getKanshi(index);
}

/**
 * 月柱を求める
 * 年干から月干を導出（年干×月支の組み合わせ）
 *
 * 年干が甲・己の年: 寅月=丙寅
 * 年干が乙・庚の年: 寅月=戊寅
 * 年干が丙・辛の年: 寅月=庚寅
 * 年干が丁・壬の年: 寅月=壬寅
 * 年干が戊・癸の年: 寅月=甲寅
 */
export function getMonthPillar(yearKan: string, setsuMonth: number): Kanshi {
  const yearKanIdx = JIKKAN.indexOf(yearKan as any);
  // 年干 % 5 で寅月の天干の開始位置が決まる
  const baseKanIdx = ((yearKanIdx % 5) * 2 + 2) % 10;

  // setsuMonth: 1=寅, 2=卯, ... 12=丑
  const monthOffset = setsuMonth - 1;
  const kanIdx = (baseKanIdx + monthOffset) % 10;

  // 月支: 寅(2)から始まる
  const shiIdx = (monthOffset + 2) % 12;

  // 六十干支のインデックスを求める
  for (let i = 0; i < 60; i++) {
    if (i % 10 === kanIdx && i % 12 === shiIdx) {
      return getKanshi(i);
    }
  }

  // フォールバック（到達しないはず）
  return getKanshi(0);
}

/**
 * 日柱を求める
 * 基準日からの経過日数で六十干支を計算
 * 基準: 1900年1月1日 = 甲子(0)... ではなく庚子(36)
 *
 * 正確な基準: 2000年1月1日 = 甲子日ではない
 * 実際の基準: 1900年1月1日 = 庚子(36)
 */
export function getDayPillar(year: number, month: number, day: number): Kanshi {
  // ユリウス日を使って経過日数を計算
  const jd = toJulianDay(year, month, day);
  // 基準: ユリウス日 2451911 = 2001年1月1日 = 乙巳日(41)
  // より簡単な基準: JD 2440588 = 1970年1月1日 = ?
  // 確実な基準: 2000年1月7日 = 甲子日(0)
  const baseJd = toJulianDay(2000, 1, 7); // 甲子日
  const diff = jd - baseJd;
  const index = ((diff % 60) + 60) % 60;
  return getKanshi(index);
}

/**
 * 時柱を求める
 * 日干から時干を導出
 *
 * 日干が甲・己の日: 子の刻=甲子
 * 日干が乙・庚の日: 子の刻=丙子
 * 日干が丙・辛の日: 子の刻=戊子
 * 日干が丁・壬の日: 子の刻=庚子
 * 日干が戊・癸の日: 子の刻=壬子
 */
export function getHourPillar(dayKan: string, hour: number): Kanshi {
  // 時刻 → 十二支
  const shiIdx = getHourShi(hour);

  const dayKanIdx = JIKKAN.indexOf(dayKan as any);
  const baseKanIdx = ((dayKanIdx % 5) * 2) % 10;
  const kanIdx = (baseKanIdx + shiIdx) % 10;

  for (let i = 0; i < 60; i++) {
    if (i % 10 === kanIdx && i % 12 === shiIdx) {
      return getKanshi(i);
    }
  }

  return getKanshi(0);
}

/**
 * 時刻(0-23) → 十二支インデックス
 * 23:00-00:59 = 子(0), 01:00-02:59 = 丑(1), ...
 */
function getHourShi(hour: number): number {
  if (hour === 23) return 0; // 子の刻
  return Math.floor((hour + 1) / 2) % 12;
}

/**
 * ユリウス日計算
 */
function toJulianDay(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}
