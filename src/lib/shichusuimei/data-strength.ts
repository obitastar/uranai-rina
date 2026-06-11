import type { Jikkan, Junishi, Gogyo, FourPillars } from './types';
import { kanGogyo, shiGogyo, zokanHonki } from './gogyo';
import { getJuniunsei } from './stars';

// ---------- 型定義 ----------

export type StrengthLevel = '身強' | 'やや身強' | '中和' | 'やや身弱' | '身弱';

export interface StrengthResult {
  level: StrengthLevel;
  score: number;
  tokureiScore: number;
  tokusei: number;
  tokuchi: number;
  youjin: Gogyo;
  kijin: Gogyo;
  kijin_bad: Gogyo;
  reading: string;
}

// ---------- 五行の相生・相克 ----------

// 相生: 木→火→土→金→水→木
const SOSHO_MAP: Record<Gogyo, Gogyo> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

// 相克: 木→土→水→火→金→木
const SOKOKU_MAP: Record<Gogyo, Gogyo> = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火',
};

// 日主を生じる五行（印星）
function inseiGogyo(g: Gogyo): Gogyo {
  // 相生で g を生む五行 = 相生サイクルで g の1つ前
  const entries = Object.entries(SOSHO_MAP) as [Gogyo, Gogyo][];
  const found = entries.find(([, to]) => to === g);
  return found![0];
}

// 日主が生じる五行（食傷）
function shokushoGogyo(g: Gogyo): Gogyo {
  return SOSHO_MAP[g];
}

// 日主が克す五行（財）
function zaiGogyo(g: Gogyo): Gogyo {
  return SOKOKU_MAP[g];
}

// 日主を克す五行（官殺）
function kansatsuGogyo(g: Gogyo): Gogyo {
  const entries = Object.entries(SOKOKU_MAP) as [Gogyo, Gogyo][];
  const found = entries.find(([, to]) => to === g);
  return found![0];
}

// ---------- 得令（月令） ----------

// 月支の地支を旧暦の月番号(setsuMonth 1-12)ではなく、
// FourPillars.month.shi から直接判定する
const TOKUREI_SHI: Record<Gogyo, Junishi[]> = {
  '木': ['寅', '卯'],
  '火': ['巳', '午'],
  '土': ['辰', '未', '戌', '丑'],
  '金': ['申', '酉'],
  '水': ['亥', '子'],
};

function calcTokureiScore(nichuGogyo: Gogyo, monthShi: Junishi): number {
  const favorable = TOKUREI_SHI[nichuGogyo];
  return favorable.includes(monthShi) ? 3 : -3;
}

// ---------- 得勢 ----------

function isHelping(nichuGogyo: Gogyo, targetGogyo: Gogyo): boolean {
  // 同じ五行（比劫）または日主を生じる五行（印星）
  return targetGogyo === nichuGogyo || targetGogyo === inseiGogyo(nichuGogyo);
}

function calcTokusei(nicchu: Jikkan, fourPillars: FourPillars): number {
  const nichuGogyo = kanGogyo(nicchu);

  let helping = 0;
  let weakening = 0;

  // 天干を集める（日干自身は除く）
  const kans: Jikkan[] = [
    fourPillars.year.kan,
    fourPillars.month.kan,
  ];
  if (fourPillars.hour) {
    kans.push(fourPillars.hour.kan);
  }

  for (const kan of kans) {
    if (isHelping(nichuGogyo, kanGogyo(kan))) {
      helping++;
    } else {
      weakening++;
    }
  }

  // 地支の蔵干本気を集める（全4柱）
  const shis: Junishi[] = [
    fourPillars.year.shi,
    fourPillars.month.shi,
    fourPillars.day.shi,
  ];
  if (fourPillars.hour) {
    shis.push(fourPillars.hour.shi);
  }

  for (const shi of shis) {
    const honki = zokanHonki(shi);
    if (isHelping(nichuGogyo, kanGogyo(honki))) {
      helping++;
    } else {
      weakening++;
    }
  }

  return helping - weakening;
}

// ---------- 得地（日支の十二運） ----------

const TOKUCHI_SCORES: Record<string, number> = {
  '長生': 2, '冠帯': 2, '建禄': 2, '帝旺': 2,
  '養': 1, '衰': 1,
  '沐浴': 0,
  '病': -1, '死': -1, '墓': -1, '絶': -1, '胎': -1,
};

function calcTokuchi(nicchu: Jikkan, dayShi: Junishi): number {
  const juniunsei = getJuniunsei(nicchu, dayShi);
  return TOKUCHI_SCORES[juniunsei] ?? 0;
}

// ---------- レベル判定 ----------

function toLevel(score: number): StrengthLevel {
  if (score >= 5) return '身強';
  if (score >= 2) return 'やや身強';
  if (score >= -1) return '中和';
  if (score >= -4) return 'やや身弱';
  return '身弱';
}

// ---------- 用神・喜神・忌神 ----------

interface JinResult {
  youjin: Gogyo;
  kijin: Gogyo;
  kijin_bad: Gogyo;
}

function calcYoujin(nichuGogyo: Gogyo, level: StrengthLevel): JinResult {
  const isMikyou = level === '身強' || level === 'やや身強';

  if (isMikyou) {
    // 身強 → 弱める五行が用神
    return {
      youjin: shokushoGogyo(nichuGogyo),   // 食傷（日主が生じる五行）
      kijin: zaiGogyo(nichuGogyo),          // 財（日主が克す五行）
      kijin_bad: inseiGogyo(nichuGogyo),    // 忌神 = 印星（さらに強めてしまう）
    };
  } else {
    // 身弱・中和 → 助ける五行が用神
    return {
      youjin: inseiGogyo(nichuGogyo),       // 印星（日主を生じる五行）
      kijin: nichuGogyo,                    // 比劫（日主と同じ五行）
      kijin_bad: kansatsuGogyo(nichuGogyo), // 忌神 = 官殺（さらに弱める）
    };
  }
}

// ---------- 鑑定文 ----------

const READINGS: Record<StrengthLevel, string> = {
  '身強':
    '自我が強く行動力に溢れる命式です。エネルギーが豊富なため、それを外に向けて発散することが開運の鍵。仕事や趣味で積極的に動き、周囲と協力することで大きな成果を生みます。',
  'やや身強':
    '芯の強さと実行力を備えた命式です。自分の力で道を切り開くタイプですが、時には周囲に頼ることも大切。バランスよくエネルギーを使うことで、安定した成功を手に入れられます。',
  '中和':
    '五行のバランスが取れた調和型の命式です。どんな環境にも柔軟に適応できる強みがあります。偏りがない分、自分の軸を意識して行動すると運気がさらに安定します。',
  'やや身弱':
    '繊細な感性と協調性を持つ命式です。周囲との調和を大切にし、サポートを上手に受け入れることで力を発揮します。無理をせず、自分のペースを守ることが開運の秘訣です。',
  '身弱':
    '繊細で感受性豊かな命式です。周囲の支えを受け入れることが開運のポイント。信頼できる仲間や環境を大切にし、無理をせず自分のペースで進むことで才能が花開きます。',
};

// ---------- メイン関数 ----------

/**
 * 身強・身弱判定と用神を算出する
 * @param nicchu 日主（日干）
 * @param fourPillars 四柱
 * @param _setsuMonth 節月（1-12）※現在は月支から直接判定するため未使用だが互換性のため残す
 */
export function analyzeStrength(
  nicchu: Jikkan,
  fourPillars: FourPillars,
  _setsuMonth: number,
): StrengthResult {
  const monthShi = fourPillars.month.shi;
  const dayShi = fourPillars.day.shi;
  const nichuGogyo = kanGogyo(nicchu);

  // 3要素のスコア計算
  const tokureiScore = calcTokureiScore(nichuGogyo, monthShi);
  const tokusei = calcTokusei(nicchu, fourPillars);
  const tokuchi = calcTokuchi(nicchu, dayShi);

  const score = tokureiScore + tokusei + tokuchi;
  const level = toLevel(score);

  // 用神・喜神・忌神
  const { youjin, kijin, kijin_bad } = calcYoujin(nichuGogyo, level);

  return {
    level,
    score,
    tokureiScore,
    tokusei,
    tokuchi,
    youjin,
    kijin,
    kijin_bad,
    reading: READINGS[level],
  };
}
