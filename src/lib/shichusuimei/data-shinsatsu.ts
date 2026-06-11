// ============================================================
// 神殺（しんさつ）データ
// 代表的な5つの神殺の算出と鑑定テキスト
// ============================================================

import type { Jikkan, Junishi, FourPillars } from './types';

export interface ShinsatsuResult {
  name: string;         // 神殺の名称
  exists: boolean;      // 命式中に存在するか
  description: string;  // 意味テキスト or 鑑定テキスト
}

// --- 天乙貴人（日主→地支） ---
const TENISTU_KIJIN: Record<Jikkan, Junishi[]> = {
  '甲': ['丑', '未'],
  '乙': ['子', '申'],
  '丙': ['亥', '酉'],
  '丁': ['亥', '酉'],
  '戊': ['丑', '未'],
  '己': ['子', '申'],
  '庚': ['丑', '未'],
  '辛': ['寅', '午'],
  '壬': ['卯', '巳'],
  '癸': ['卯', '巳'],
};

// --- 駅馬（日支→星） 三合局ベース ---
const EKIBA_GROUPS: { members: Junishi[]; star: Junishi }[] = [
  { members: ['寅', '午', '戌'], star: '申' },
  { members: ['巳', '酉', '丑'], star: '亥' },
  { members: ['申', '子', '辰'], star: '寅' },
  { members: ['亥', '卯', '未'], star: '巳' },
];

// --- 桃花（咸池）（日支→星） ---
const TOUKA_GROUPS: { members: Junishi[]; star: Junishi }[] = [
  { members: ['寅', '午', '戌'], star: '卯' },
  { members: ['巳', '酉', '丑'], star: '午' },
  { members: ['申', '子', '辰'], star: '酉' },
  { members: ['亥', '卯', '未'], star: '子' },
];

// --- 華蓋（日支→星） ---
const KAGAI_GROUPS: { members: Junishi[]; star: Junishi }[] = [
  { members: ['寅', '午', '戌'], star: '戌' },
  { members: ['巳', '酉', '丑'], star: '丑' },
  { members: ['申', '子', '辰'], star: '辰' },
  { members: ['亥', '卯', '未'], star: '未' },
];

// --- 羊刃（日主→地支）陽干のみ ---
const YOUJIN: Partial<Record<Jikkan, Junishi>> = {
  '甲': '卯',
  '丙': '午',
  '戊': '午',
  '庚': '酉',
  '壬': '子',
};

// --- 意味テキスト ---
const MEANINGS = {
  天乙貴人: '最も尊い吉星。困った時に貴人の助けが現れ、危機を乗り越える力を授かります。',
  駅馬: '移動・変化を司る星。旅行や転勤、転職など動きのある人生に縁があります。',
  桃花: '異性を惹きつける魅力の星。恋愛運や人気運を高め、華やかな交際を暗示します。',
  華蓋: '芸術・学問・精神世界の星。孤高の才能を持ち、専門分野で輝く知性の持ち主です。',
  羊刃: '強い意志と行動力の星。決断力に優れますが、勢い余ると摩擦を生むことも。',
};

const READINGS = {
  天乙貴人: '人生の節目で不思議と助けてくれる人が現れます。人徳に恵まれ、社会的な信用を得やすい星回り。感謝を忘れなければ、その加護は一生続きます。',
  駅馬: 'じっとしているより動いた方が運が開けるタイプ。海外や遠方との縁が深く、行動範囲を広げることで大きなチャンスを掴みます。フットワークの軽さが武器です。',
  桃花: '華やかなオーラで自然と人が集まります。恋愛だけでなく、営業や接客など人と関わる場面で才能を発揮。魅力を活かしつつ節度を保てば、良縁に恵まれます。',
  華蓋: '独自の世界観と深い思索力を持ちます。芸術・宗教・哲学など精神的な分野で非凡な才を発揮。一人の時間が創造の源となり、孤独を力に変えられる人です。',
  羊刃: '困難に立ち向かう強い精神力の持ち主。リーダーシップを発揮し、大胆な決断で道を切り開きます。その力を正しい方向に向ければ、大きな成果を生み出せます。',
};

// 四柱から全地支を取得
function getAllShi(fourPillars: FourPillars): Junishi[] {
  const result: Junishi[] = [
    fourPillars.year.shi,
    fourPillars.month.shi,
    fourPillars.day.shi,
  ];
  if (fourPillars.hour) {
    result.push(fourPillars.hour.shi);
  }
  return result;
}

// 三合局グループからstarを検索
function findGroupStar(
  groups: { members: Junishi[]; star: Junishi }[],
  dayShi: Junishi,
): Junishi | null {
  for (const g of groups) {
    if (g.members.includes(dayShi)) return g.star;
  }
  return null;
}

/**
 * 神殺を分析して結果を返す
 * @param nicchu 日主（日干）
 * @param fourPillars 四柱
 */
export function analyzeShinsatsu(
  nicchu: Jikkan,
  fourPillars: FourPillars,
): ShinsatsuResult[] {
  const allShi = getAllShi(fourPillars);
  const dayShi = fourPillars.day.shi;
  const results: ShinsatsuResult[] = [];

  // 1. 天乙貴人
  const kijinTargets = TENISTU_KIJIN[nicchu];
  const hasKijin = kijinTargets.some((t) => allShi.includes(t));
  results.push({
    name: '天乙貴人',
    exists: hasKijin,
    description: hasKijin ? READINGS.天乙貴人 : MEANINGS.天乙貴人,
  });

  // 2. 駅馬
  const ekibaStar = findGroupStar(EKIBA_GROUPS, dayShi);
  const hasEkiba = ekibaStar !== null && allShi.includes(ekibaStar);
  results.push({
    name: '駅馬',
    exists: hasEkiba,
    description: hasEkiba ? READINGS.駅馬 : MEANINGS.駅馬,
  });

  // 3. 桃花（咸池）
  const toukaStar = findGroupStar(TOUKA_GROUPS, dayShi);
  const hasTouka = toukaStar !== null && allShi.includes(toukaStar);
  results.push({
    name: '桃花',
    exists: hasTouka,
    description: hasTouka ? READINGS.桃花 : MEANINGS.桃花,
  });

  // 4. 華蓋
  const kagaiStar = findGroupStar(KAGAI_GROUPS, dayShi);
  const hasKagai = kagaiStar !== null && allShi.includes(kagaiStar);
  results.push({
    name: '華蓋',
    exists: hasKagai,
    description: hasKagai ? READINGS.華蓋 : MEANINGS.華蓋,
  });

  // 5. 羊刃（陽干のみ）
  const youjinStar = YOUJIN[nicchu] ?? null;
  const hasYoujin = youjinStar !== null && allShi.includes(youjinStar);
  results.push({
    name: '羊刃',
    exists: hasYoujin,
    description: hasYoujin ? READINGS.羊刃 : MEANINGS.羊刃,
  });

  return results;
}
