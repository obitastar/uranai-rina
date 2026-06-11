// ============================================================
// 神殺（しんさつ）データ
// 代表的な15の神殺の算出と鑑定テキスト
// ============================================================

import type { Jikkan, Junishi, FourPillars } from './types';

export interface ShinsatsuResult {
  name: string;         // 神殺の名称
  exists: boolean;      // 命式中に存在するか
  description: string;  // 意味テキスト or 鑑定テキスト
}

// ============================================================
// ルックアップテーブル
// ============================================================

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

// --- 文昌貴人（日主→地支） ---
const BUNSHO_KIJIN: Record<Jikkan, Junishi> = {
  '甲': '巳',
  '乙': '午',
  '丙': '申',
  '丁': '酉',
  '戊': '申',
  '己': '酉',
  '庚': '亥',
  '辛': '子',
  '壬': '寅',
  '癸': '卯',
};

// --- 太極貴人（日主→地支） ---
const TAIKYOKU_KIJIN: Record<Jikkan, Junishi[]> = {
  '甲': ['子', '午'],
  '乙': ['子', '午'],
  '丙': ['卯', '酉'],
  '丁': ['卯', '酉'],
  '戊': ['辰', '戌', '丑', '未'],
  '己': ['辰', '戌', '丑', '未'],
  '庚': ['寅', '亥'],
  '辛': ['寅', '亥'],
  '壬': ['巳', '申'],
  '癸': ['巳', '申'],
};

// --- 月徳貴人（月支→天干） ---
const GETTOKU_KIJIN_GROUPS: { members: Junishi[]; star: Jikkan }[] = [
  { members: ['寅', '午', '戌'], star: '丙' },
  { members: ['亥', '卯', '未'], star: '甲' },
  { members: ['申', '子', '辰'], star: '壬' },
  { members: ['巳', '酉', '丑'], star: '庚' },
];

// --- 天徳貴人（月支→天干）簡易版 ---
const TENTOKU_KIJIN: Record<Junishi, Jikkan> = {
  '寅': '丁',
  '卯': '庚',
  '辰': '壬',
  '巳': '辛',
  '午': '壬',
  '未': '甲',
  '申': '癸',
  '酉': '甲',
  '戌': '丙',
  '亥': '乙',
  '子': '丙',
  '丑': '庚',
};

// --- 将星（日支→地支）三合局の帝旺位 ---
const SHOUSEI_GROUPS: { members: Junishi[]; star: Junishi }[] = [
  { members: ['寅', '午', '戌'], star: '午' },
  { members: ['巳', '酉', '丑'], star: '酉' },
  { members: ['申', '子', '辰'], star: '子' },
  { members: ['亥', '卯', '未'], star: '卯' },
];

// --- 金輿禄（日主→地支） ---
const KINYOROKU: Record<Jikkan, Junishi> = {
  '甲': '辰',
  '乙': '巳',
  '丙': '未',
  '丁': '申',
  '戊': '未',
  '己': '申',
  '庚': '戌',
  '辛': '亥',
  '壬': '丑',
  '癸': '寅',
};

// --- 亡神（日支→地支）三合局ベース ---
const BOUSHIN_GROUPS: { members: Junishi[]; star: Junishi }[] = [
  { members: ['寅', '午', '戌'], star: '巳' },
  { members: ['巳', '酉', '丑'], star: '申' },
  { members: ['申', '子', '辰'], star: '亥' },
  { members: ['亥', '卯', '未'], star: '寅' },
];

// --- 劫殺（日支→地支）三合局ベース ---
const GOUSATSU_GROUPS: { members: Junishi[]; star: Junishi }[] = [
  { members: ['寅', '午', '戌'], star: '亥' },
  { members: ['巳', '酉', '丑'], star: '寅' },
  { members: ['申', '子', '辰'], star: '巳' },
  { members: ['亥', '卯', '未'], star: '申' },
];

// --- 災殺（日支→地支）三合局ベース ---
const SAISATSU_GROUPS: { members: Junishi[]; star: Junishi }[] = [
  { members: ['寅', '午', '戌'], star: '子' },
  { members: ['巳', '酉', '丑'], star: '卯' },
  { members: ['申', '子', '辰'], star: '午' },
  { members: ['亥', '卯', '未'], star: '酉' },
];

// --- 天官貴人（日主→地支）簡易版 ---
const TENKAN_KIJIN: Record<Jikkan, Junishi> = {
  '甲': '未',
  '乙': '辰',
  '丙': '巳',
  '丁': '寅',
  '戊': '卯',
  '己': '子',
  '庚': '午',
  '辛': '卯',
  '壬': '午',
  '癸': '卯',
};

// ============================================================
// 意味テキスト（命式に無い場合の短い説明）
// ============================================================

const MEANINGS = {
  天乙貴人: '最も尊い吉星。困った時に貴人の助けが現れ、危機を乗り越える力を授かります。',
  駅馬: '移動・変化を司る星。旅行や転勤、転職など動きのある人生に縁があります。',
  桃花: '異性を惹きつける魅力の星。恋愛運や人気運を高め、華やかな交際を暗示します。',
  華蓋: '芸術・学問・精神世界の星。孤高の才能を持ち、専門分野で輝く知性の持ち主です。',
  羊刃: '強い意志と行動力の星。決断力に優れますが、勢い余ると摩擦を生むことも。',
  文昌貴人: '学問と知性を司る吉星。試験運や資格取得に良い影響を与えます。',
  太極貴人: '万物の根源に通じる星。精神的な安定と深い洞察力を授けます。',
  月徳貴人: '月の恩恵を受ける吉星。穏やかな人徳で周囲の信頼を集めます。',
  天徳貴人: '天の守護を受ける吉星。災厄を遠ざけ、自然と安泰に導かれます。',
  将星: '統率力を司る星。組織やチームの中心に立つ器量を持ちます。',
  金輿禄: '移動に幸運が伴う星。引越しや旅行が良い転機となります。',
  亡神: '精神的な試練を暗示する星。内面の葛藤を乗り越える力が問われます。',
  劫殺: '外部からの圧力に注意を促す星。警戒心と行動力が試されます。',
  災殺: '突発的な災難への備えを促す星。慎重さが身を守る鍵となります。',
  天官貴人: '社会的地位と名誉を司る星。公的な場での活躍に縁があります。',
};

// ============================================================
// 鑑定テキスト（命式にある場合の詳しい読み）
// ============================================================

const READINGS = {
  天乙貴人: '人生の節目で不思議と助けてくれる人が現れます。人徳に恵まれ、社会的な信用を得やすい星回り。感謝を忘れなければ、その加護は一生続きます。',
  駅馬: 'じっとしているより動いた方が運が開けるタイプ。海外や遠方との縁が深く、行動範囲を広げることで大きなチャンスを掴みます。フットワークの軽さが武器です。',
  桃花: '華やかなオーラで自然と人が集まります。恋愛だけでなく、営業や接客など人と関わる場面で才能を発揮。魅力を活かしつつ節度を保てば、良縁に恵まれます。',
  華蓋: '独自の世界観と深い思索力を持ちます。芸術・宗教・哲学など精神的な分野で非凡な才を発揮。一人の時間が創造の源となり、孤独を力に変えられる人です。',
  羊刃: '困難に立ち向かう強い精神力の持ち主。リーダーシップを発揮し、大胆な決断で道を切り開きます。その力を正しい方向に向ければ、大きな成果を生み出せます。',
  文昌貴人: '知識の吸収力と表現力に優れた星の持ち主です。学問や資格の取得で良い結果を出しやすく、文章や言葉で人を動かす才能があります。知的好奇心を大切にしてください。',
  太極貴人: '物事の本質を見抜く深い直感力をお持ちです。精神的に安定した基盤があり、周囲に安心感を与えます。信仰や哲学に触れることで、さらに運が開かれます。',
  月徳貴人: '穏やかな人柄で自然と人望が集まる星回りです。困難な状況でも周囲の協力を得やすく、特に目上の方からの引き立てに恵まれます。謙虚さが幸運の鍵です。',
  天徳貴人: '天の加護により災いが自然と遠ざかる星をお持ちです。事故や病気などの凶事が軽く済む傾向があり、守られた人生を歩みます。その恩恵を周囲に分かち合うことで、さらに運が高まります。',
  将星: '生まれながらにリーダーの資質をお持ちです。組織の中で自然と中心的な役割を担い、人を束ねる力があります。責任ある立場に就くほど、その才能が輝きます。',
  金輿禄: '移動や環境の変化が幸運を呼び込む星です。引越し・旅行・転職など、動くことで新しい縁や好機に恵まれます。行き詰まりを感じたら、場所を変えてみるのが吉です。',
  亡神: '繊細な感受性を持ち、内面の葛藤を経験しやすい星です。しかしその試練は精神的な成長の糧となります。自分の心と向き合う力を磨けば、深い知恵と共感力に変わります。',
  劫殺: '外部からの予期せぬ変化に遭いやすい星ですが、同時に危機を察知する鋭い直感力も授かっています。この警戒心を活かし、備えを怠らなければ、逆境を跳ね返す強さとなります。',
  災殺: '突発的なトラブルに注意が必要な星ですが、備えることで災いを最小限に抑える力を持ちます。慎重に行動する習慣が身を守り、その堅実さは周囲からの信頼にもつながります。',
  天官貴人: '社会的な地位や名誉に恵まれる星をお持ちです。公的な場や組織での活躍に縁があり、努力が正当に評価されやすい運勢です。誠実に職務を全うすることで、さらなる昇進の道が開かれます。',
};

// ============================================================
// ヘルパー関数
// ============================================================

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

// 四柱から全天干を取得
function getAllKan(fourPillars: FourPillars): Jikkan[] {
  const result: Jikkan[] = [
    fourPillars.year.kan,
    fourPillars.month.kan,
    fourPillars.day.kan,
  ];
  if (fourPillars.hour) {
    result.push(fourPillars.hour.kan);
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

// 三合局グループから天干starを検索（月徳貴人用）
function findGroupKanStar(
  groups: { members: Junishi[]; star: Jikkan }[],
  monthShi: Junishi,
): Jikkan | null {
  for (const g of groups) {
    if (g.members.includes(monthShi)) return g.star;
  }
  return null;
}

// ============================================================
// メイン分析関数
// ============================================================

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
  const allKan = getAllKan(fourPillars);
  const dayShi = fourPillars.day.shi;
  const monthShi = fourPillars.month.shi;
  const results: ShinsatsuResult[] = [];

  // 1. 天乙貴人（日主→地支）
  const kijinTargets = TENISTU_KIJIN[nicchu];
  const hasKijin = kijinTargets.some((t) => allShi.includes(t));
  results.push({
    name: '天乙貴人',
    exists: hasKijin,
    description: hasKijin ? READINGS.天乙貴人 : MEANINGS.天乙貴人,
  });

  // 2. 駅馬（日支→地支）
  const ekibaStar = findGroupStar(EKIBA_GROUPS, dayShi);
  const hasEkiba = ekibaStar !== null && allShi.includes(ekibaStar);
  results.push({
    name: '駅馬',
    exists: hasEkiba,
    description: hasEkiba ? READINGS.駅馬 : MEANINGS.駅馬,
  });

  // 3. 桃花（咸池）（日支→地支）
  const toukaStar = findGroupStar(TOUKA_GROUPS, dayShi);
  const hasTouka = toukaStar !== null && allShi.includes(toukaStar);
  results.push({
    name: '桃花',
    exists: hasTouka,
    description: hasTouka ? READINGS.桃花 : MEANINGS.桃花,
  });

  // 4. 華蓋（日支→地支）
  const kagaiStar = findGroupStar(KAGAI_GROUPS, dayShi);
  const hasKagai = kagaiStar !== null && allShi.includes(kagaiStar);
  results.push({
    name: '華蓋',
    exists: hasKagai,
    description: hasKagai ? READINGS.華蓋 : MEANINGS.華蓋,
  });

  // 5. 羊刃（日主→地支、陽干のみ）
  const youjinStar = YOUJIN[nicchu] ?? null;
  const hasYoujin = youjinStar !== null && allShi.includes(youjinStar);
  results.push({
    name: '羊刃',
    exists: hasYoujin,
    description: hasYoujin ? READINGS.羊刃 : MEANINGS.羊刃,
  });

  // 6. 文昌貴人（日主→地支）
  const bunshoStar = BUNSHO_KIJIN[nicchu];
  const hasBunsho = allShi.includes(bunshoStar);
  results.push({
    name: '文昌貴人',
    exists: hasBunsho,
    description: hasBunsho ? READINGS.文昌貴人 : MEANINGS.文昌貴人,
  });

  // 7. 太極貴人（日主→地支）
  const taikyokuTargets = TAIKYOKU_KIJIN[nicchu];
  const hasTaikyoku = taikyokuTargets.some((t) => allShi.includes(t));
  results.push({
    name: '太極貴人',
    exists: hasTaikyoku,
    description: hasTaikyoku ? READINGS.太極貴人 : MEANINGS.太極貴人,
  });

  // 8. 月徳貴人（月支→天干、四柱の天干にその干があれば成立）
  const gettokuStar = findGroupKanStar(GETTOKU_KIJIN_GROUPS, monthShi);
  const hasGettoku = gettokuStar !== null && allKan.includes(gettokuStar);
  results.push({
    name: '月徳貴人',
    exists: hasGettoku,
    description: hasGettoku ? READINGS.月徳貴人 : MEANINGS.月徳貴人,
  });

  // 9. 天徳貴人（月支→天干、四柱の天干にその干があれば成立）
  const tentokuStar = TENTOKU_KIJIN[monthShi];
  const hasTentoku = allKan.includes(tentokuStar);
  results.push({
    name: '天徳貴人',
    exists: hasTentoku,
    description: hasTentoku ? READINGS.天徳貴人 : MEANINGS.天徳貴人,
  });

  // 10. 将星（日支→地支、三合局の帝旺位）
  const shouseiStar = findGroupStar(SHOUSEI_GROUPS, dayShi);
  const hasShousel = shouseiStar !== null && allShi.includes(shouseiStar);
  results.push({
    name: '将星',
    exists: hasShousel,
    description: hasShousel ? READINGS.将星 : MEANINGS.将星,
  });

  // 11. 金輿禄（日主→地支）
  const kinyoStar = KINYOROKU[nicchu];
  const hasKinyo = allShi.includes(kinyoStar);
  results.push({
    name: '金輿禄',
    exists: hasKinyo,
    description: hasKinyo ? READINGS.金輿禄 : MEANINGS.金輿禄,
  });

  // 12. 亡神（日支→地支、三合局ベース）
  const boushinStar = findGroupStar(BOUSHIN_GROUPS, dayShi);
  const hasBoushin = boushinStar !== null && allShi.includes(boushinStar);
  results.push({
    name: '亡神',
    exists: hasBoushin,
    description: hasBoushin ? READINGS.亡神 : MEANINGS.亡神,
  });

  // 13. 劫殺（日支→地支、三合局ベース）
  const gousatsuStar = findGroupStar(GOUSATSU_GROUPS, dayShi);
  const hasGousatsu = gousatsuStar !== null && allShi.includes(gousatsuStar);
  results.push({
    name: '劫殺',
    exists: hasGousatsu,
    description: hasGousatsu ? READINGS.劫殺 : MEANINGS.劫殺,
  });

  // 14. 災殺（日支→地支、三合局ベース）
  const saisatsuStar = findGroupStar(SAISATSU_GROUPS, dayShi);
  const hasSaisatsu = saisatsuStar !== null && allShi.includes(saisatsuStar);
  results.push({
    name: '災殺',
    exists: hasSaisatsu,
    description: hasSaisatsu ? READINGS.災殺 : MEANINGS.災殺,
  });

  // 15. 天官貴人（日主→地支）
  const tenkanStar = TENKAN_KIJIN[nicchu];
  const hasTenkan = allShi.includes(tenkanStar);
  results.push({
    name: '天官貴人',
    exists: hasTenkan,
    description: hasTenkan ? READINGS.天官貴人 : MEANINGS.天官貴人,
  });

  return results;
}
