import type { FortuneInput, FortuneResult, FourPillars } from './types';
import { getYearPillar, getMonthPillar, getDayPillar, getHourPillar, getSetsuMonth } from './calendar';
import { getTsuhensei, getJuniunsei, getZokanTsuhensei } from './stars';
import { getKanshi } from './kanshi';
import { getReadings } from './readings';

/**
 * 四柱推命のメイン計算
 */
export function calculateFortune(input: FortuneInput): FortuneResult {
  // 節月・節年を求める
  const { setsuMonth, setsuYear } = getSetsuMonth(input.year, input.month, input.day);

  // 四柱算出
  const yearPillar = getYearPillar(setsuYear);
  const monthPillar = getMonthPillar(yearPillar.kan, setsuMonth);
  const dayPillar = getDayPillar(input.year, input.month, input.day);
  const hourPillar = input.hour !== null
    ? getHourPillar(dayPillar.kan, input.hour)
    : null;

  const fourPillars: FourPillars = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };

  // 日主
  const nicchu = dayPillar.kan;

  // 通変星（各柱の天干と日主の関係）
  const tpiYear = getTsuhensei(nicchu, yearPillar.kan);
  const tpiMonth = getTsuhensei(nicchu, monthPillar.kan);
  const tpiHour = hourPillar ? getTsuhensei(nicchu, hourPillar.kan) : null;

  // 十二運
  const juniunYear = getJuniunsei(nicchu, yearPillar.shi);
  const juniunMonth = getJuniunsei(nicchu, monthPillar.shi);
  const juniunDay = getJuniunsei(nicchu, dayPillar.shi);
  const juniunHour = hourPillar ? getJuniunsei(nicchu, hourPillar.shi) : null;

  // 蔵干通変星（日支の本気）
  const zokanTsuhensei = getZokanTsuhensei(nicchu, dayPillar.shi);

  // 今年の干支（2026年 = 丙午）
  const currentYear = new Date().getFullYear();
  const currentYearKanshi = getKanshi(((currentYear - 4) % 60 + 60) % 60);
  const currentYearTsuhensei = getTsuhensei(nicchu, currentYearKanshi.kan);

  // 鑑定文を取得
  const readings = getReadings({
    nicchu,
    zokanTsuhensei,
    tpiMonth,
    juniunDay,
    currentYearTsuhensei,
    gender: input.gender,
  });

  return {
    input,
    fourPillars,
    nicchu,
    tpiYear,
    tpiMonth,
    tpiHour,
    juniunYear,
    juniunMonth,
    juniunDay,
    juniunHour,
    zokanTsuhensei,
    currentYearKanshi,
    currentYearTsuhensei,
    readings,
  };
}
