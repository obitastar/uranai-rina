import type { FortuneInput, FortuneResult, FourPillars, YearlyFortune, GogyoBalance, Gogyo, ZokanDetail } from './types';
import { GOGYO } from './types';
import { getYearPillar, getMonthPillar, getDayPillar, getHourPillar, getSetsuMonth } from './calendar';
import { getTsuhensei, getJuniunsei, getZokanTsuhensei } from './stars';
import { getKanshi } from './kanshi';
import { kanGogyo, shiGogyo, zokanHonki } from './gogyo';
import { getReadings, getTenYearReading, getTenYearDetail, getJuniunLevel } from './readings';
import { NISSHU } from './data-nisshu';
import { TSUHENSEI as TSUHENSEI_DATA } from './data-tsuhensei';
import { JUNIUNSEI as JUNIUNSEI_DATA, GOGYO_BALANCE, NENUN } from './data-interpretation';
import { getKuubou, isKuubouYear } from './data-kuubou';
import { analyzeShinsatsu } from './data-shinsatsu';
import { getKyusei } from './data-kyusei';
import { getLuckyData } from './data-lucky';
import { generateHealthReading } from './data-health';
import { analyzeChishiRelations } from './data-chishi-relation';
import { calculateDaiun } from './data-daiun';
import { analyzeStrength } from './data-strength';
import { getNacchin } from './data-nacchin';
import { analyzeKakkyoku } from './data-kakkyoku';
import { ZOKAN_FULL } from './data-zokan';

// 蔵干詳細を計算（1柱分）
function calcZokanDetail(nicchu: string, shi: string): ZokanDetail {
  const entry = ZOKAN_FULL[shi as keyof typeof ZOKAN_FULL];
  return {
    honki: entry.honki,
    chuki: entry.chuki,
    yoki: entry.yoki,
    tpiHonki: getTsuhensei(nicchu as any, entry.honki),
    tpiChuki: entry.chuki ? getTsuhensei(nicchu as any, entry.chuki) : null,
    tpiYoki: entry.yoki ? getTsuhensei(nicchu as any, entry.yoki) : null,
  };
}

// 通変星のグループ判定
function tsuhenseiGroup(star: string): string {
  if (star === '比肩' || star === '劫財') return '比劫';
  if (star === '食神' || star === '傷官') return '食傷';
  if (star === '偏財' || star === '正財') return '財';
  if (star === '偏官' || star === '正官') return '官殺';
  return '印';
}

/**
 * 五行バランスを計算（天干4つ + 地支4つ）
 */
function calculateGogyoBalance(fourPillars: FourPillars): GogyoBalance[] {
  const counts: Record<Gogyo, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  // 天干の五行
  counts[kanGogyo(fourPillars.year.kan)]++;
  counts[kanGogyo(fourPillars.month.kan)]++;
  counts[kanGogyo(fourPillars.day.kan)]++;
  if (fourPillars.hour) counts[kanGogyo(fourPillars.hour.kan)]++;

  // 地支の五行
  counts[shiGogyo(fourPillars.year.shi)]++;
  counts[shiGogyo(fourPillars.month.shi)]++;
  counts[shiGogyo(fourPillars.day.shi)]++;
  if (fourPillars.hour) counts[shiGogyo(fourPillars.hour.shi)]++;

  return GOGYO.map(g => ({ gogyo: g, count: counts[g] }));
}

/**
 * 五行バランスの鑑定文を生成
 */
function getGogyoReading(balance: GogyoBalance[]): string {
  const sorted = [...balance].sort((a, b) => b.count - a.count);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const parts: string[] = [];
  if (strongest.count >= 3) {
    const data = GOGYO_BALANCE[strongest.gogyo];
    if (data) parts.push(data.strong);
  }
  if (weakest.count === 0) {
    const data = GOGYO_BALANCE[weakest.gogyo];
    if (data) parts.push(data.weak);
  }

  if (parts.length === 0) {
    return '五行がバランスよく巡っています。偏りが少なく、安定した運気の持ち主。どんな環境にも適応できる柔軟さがあります。';
  }
  return parts.join('');
}

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

  // 日主の詳細情報
  const nisshuData = NISSHU[nicchu];
  const nisshuDetail = {
    symbol: nisshuData.symbol,
    catchphrase: nisshuData.catchphrase,
    keywords: nisshuData.keywords,
  };

  // 通変星（各柱の天干と日主の関係）
  const tpiYear = getTsuhensei(nicchu, yearPillar.kan);
  const tpiMonth = getTsuhensei(nicchu, monthPillar.kan);
  const tpiHour = hourPillar ? getTsuhensei(nicchu, hourPillar.kan) : null;

  // 月柱通変星の詳細
  const tpiMonthData = TSUHENSEI_DATA[tpiMonth];
  const tsuhenseiDetail = {
    catchphrase: tpiMonthData.catchphrase,
    talent: tpiMonthData.talent,
    caution: tpiMonthData.caution,
  };

  // 十二運
  const juniunYear = getJuniunsei(nicchu, yearPillar.shi);
  const juniunMonth = getJuniunsei(nicchu, monthPillar.shi);
  const juniunDay = getJuniunsei(nicchu, dayPillar.shi);
  const juniunHour = hourPillar ? getJuniunsei(nicchu, hourPillar.shi) : null;

  // 日柱十二運の詳細
  const juniunDayData = JUNIUNSEI_DATA[juniunDay];
  const juniunDayDetail = {
    catchphrase: juniunDayData.catchphrase,
    energy: juniunDayData.energy,
    message: juniunDayData.message,
  };

  // 蔵干通変星（日支の本気）
  const zokanTsuhensei = getZokanTsuhensei(nicchu, dayPillar.shi);

  // 五行バランス
  const gogyoBalance = calculateGogyoBalance(fourPillars);
  const gogyoReading = getGogyoReading(gogyoBalance);

  // 今年の干支
  const currentYear = new Date().getFullYear();
  const currentYearKanshi = getKanshi(((currentYear - 4) % 60 + 60) % 60);
  const currentYearTsuhensei = getTsuhensei(nicchu, currentYearKanshi.kan);

  // 年運の追加情報
  const nenunGroup = tsuhenseiGroup(currentYearTsuhensei);
  const nenunData = NENUN[nenunGroup];
  const nenunDetail = {
    title: nenunData.title,
    luckyAction: nenunData.luckyAction,
  };

  // 10年運勢を算出
  const tenYearFortune: YearlyFortune[] = [];
  for (let i = 0; i < 10; i++) {
    const targetYear = currentYear + i;
    const yearKanshi = getKanshi(((targetYear - 4) % 60 + 60) % 60);
    const yearTsuhensei = getTsuhensei(nicchu, yearKanshi.kan);
    const yearJuniunsei = getJuniunsei(nicchu, yearKanshi.shi);
    const reading = getTenYearReading(yearTsuhensei, yearJuniunsei);
    const detail = getTenYearDetail(yearTsuhensei, yearJuniunsei);
    const level = getJuniunLevel(yearJuniunsei);
    tenYearFortune.push({
      year: targetYear,
      kanshi: yearKanshi,
      tsuhensei: yearTsuhensei,
      juniunsei: yearJuniunsei,
      level,
      reading,
      detail,
    });
  }

  // 鑑定文を取得
  const readings = getReadings({
    nicchu,
    zokanTsuhensei,
    tpiMonth,
    juniunDay,
    currentYearTsuhensei,
    gender: input.gender,
  });

  // 空亡（天中殺）
  const kuubouData = getKuubou(dayPillar.index);
  const kuubou = {
    pair: kuubouData.pair,
    junName: kuubouData.junName,
    meaning: kuubouData.meaning,
    advice: kuubouData.advice,
    isKuubouYear: isKuubouYear(kuubouData.pair, currentYearKanshi.shi),
  };

  // 神殺
  const shinsatsu = analyzeShinsatsu(nicchu, fourPillars).map(s => ({
    name: s.name,
    exists: s.exists,
    description: s.description,
  }));

  // 九星気学
  const kyuseiData = getKyusei(input.year, input.month, input.day);
  const kyusei = {
    number: kyuseiData.number,
    name: kyuseiData.name,
    gogyo: kyuseiData.gogyo,
    colors: kyuseiData.colors,
    luckyNumbers: kyuseiData.luckyNumbers,
    luckyDirections: kyuseiData.luckyDirections,
    personality: kyuseiData.personality,
  };

  // ラッキーデータ
  const lucky = getLuckyData(nicchu);

  // 健康運
  const healthReading = generateHealthReading(gogyoBalance);

  // 地支関係（冲・合・刑・害・破）
  const chishiRelations = analyzeChishiRelations(fourPillars);

  // 大運
  const daiun = calculateDaiun(
    { year: input.year, month: input.month, day: input.day },
    fourPillars,
    nicchu,
    input.gender,
  );

  // 身強身弱・用神
  const strength = analyzeStrength(nicchu, fourPillars, setsuMonth);

  // 納音（日柱の六十干支から）
  const nacchinData = getNacchin(dayPillar.index);
  const nacchin = {
    name: nacchinData.name,
    yomi: nacchinData.yomi,
    gogyo: nacchinData.gogyo,
    symbol: nacchinData.symbol,
    personality: nacchinData.personality,
  };

  // 格局
  const kakkyokuData = analyzeKakkyoku(nicchu, fourPillars);
  const kakkyoku = {
    name: kakkyokuData.name,
    category: kakkyokuData.category,
    description: kakkyokuData.description,
    reading: kakkyokuData.reading,
    strength: kakkyokuData.strength,
    weakness: kakkyokuData.weakness,
  };

  // 蔵干詳細（全柱分）
  const zokanDetails = {
    year: calcZokanDetail(nicchu, yearPillar.shi),
    month: calcZokanDetail(nicchu, monthPillar.shi),
    day: calcZokanDetail(nicchu, dayPillar.shi),
    hour: hourPillar ? calcZokanDetail(nicchu, hourPillar.shi) : null,
  };

  return {
    input,
    fourPillars,
    nicchu,
    nisshuDetail,
    tpiYear,
    tpiMonth,
    tpiHour,
    tsuhenseiDetail,
    juniunYear,
    juniunMonth,
    juniunDay,
    juniunHour,
    juniunDayDetail,
    zokanTsuhensei,
    gogyoBalance,
    gogyoReading,
    currentYearKanshi,
    currentYearTsuhensei,
    nenunDetail,
    tenYearFortune,
    readings,
    kuubou,
    shinsatsu,
    kyusei,
    lucky,
    healthReading,
    chishiRelations,
    daiun,
    strength,
    nacchin,
    kakkyoku,
    zokanDetails,
  };
}
