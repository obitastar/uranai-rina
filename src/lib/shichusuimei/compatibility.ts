// ============================================================
// 四柱推命 相性診断ロジック
// 日主の五行関係・十二支の相性・通変星の組み合わせから算出
// ============================================================

import type { FortuneResult, Gogyo, Jikkan, Junishi } from './types';
import { kanGogyo, shiGogyo } from './gogyo';

// --- 型定義 ---

export interface CompatibilityCategory {
  score: number;       // 0-100
  level: string;       // 大吉/吉/吉凶混合/凶
  stars: number;       // 1-5
  description: string;
}

export interface ShichusuimeiCompatibility {
  overall: CompatibilityCategory;
  love: CompatibilityCategory;
  work: CompatibilityCategory;
  money: CompatibilityCategory;
  marriage: CompatibilityCategory;
  children: CompatibilityCategory;
  nisshuRelation: { type: string; description: string };
  junishiRelation: { type: string; description: string };
  gogyoBalance: { description: string };
  advice: string;
}

// --- 五行の相生・相剋判定 ---

type GogyoRelation = '相生' | '被生' | '相剋' | '被剋' | '比和';

function getGogyoRelation(a: Gogyo, b: Gogyo): GogyoRelation {
  if (a === b) return '比和';
  // 相生: 木→火→土→金→水→木
  const sojo: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  if (sojo[a] === b) return '相生';
  if (sojo[b] === a) return '被生';
  // 相剋: 木→土→水→火→金→木
  const sokoku: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  if (sokoku[a] === b) return '相剋';
  return '被剋';
}

// --- 十二支の相性 ---

// 六合（最良の相性ペア）
const ROKUGOU: [Junishi, Junishi][] = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未'],
];

// 三合（調和のトライアングル）
const SANGOU: Junishi[][] = [
  ['寅', '午', '戌'], // 火局
  ['亥', '卯', '未'], // 木局
  ['申', '子', '辰'], // 水局
  ['巳', '酉', '丑'], // 金局
];

// 冲（正反対の対立）
const CHUU: [Junishi, Junishi][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

// 支合（半合・準良好な相性）
const HANGOU: [Junishi, Junishi][] = [
  ['寅', '戌'], ['午', '戌'], ['寅', '午'],
  ['亥', '未'], ['卯', '未'], ['亥', '卯'],
  ['申', '辰'], ['子', '辰'], ['申', '子'],
  ['巳', '丑'], ['酉', '丑'], ['巳', '酉'],
];

function isRokugou(a: Junishi, b: Junishi): boolean {
  return ROKUGOU.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

function isSangou(a: Junishi, b: Junishi): boolean {
  return SANGOU.some(group => group.includes(a) && group.includes(b));
}

function isChuu(a: Junishi, b: Junishi): boolean {
  return CHUU.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

function isHangou(a: Junishi, b: Junishi): boolean {
  return HANGOU.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

// --- 日主同士の相性テキスト ---

const NISSHU_RELATION: Record<GogyoRelation, { type: string; desc: string }> = {
  '比和': {
    type: '同気の縁',
    desc: '同じ五行を持つ者同士。お互いの気持ちを自然に理解でき、共感しやすい関係です。ただし似た者同士ゆえに、成長の刺激はやや少なめ。',
  },
  '相生': {
    type: '育む縁',
    desc: 'あなたが相手を育て支える関係。相手の成長を喜べる懐の深さがあり、感謝される場面が多いでしょう。与えすぎに注意すればとても良い関係です。',
  },
  '被生': {
    type: '育まれる縁',
    desc: '相手があなたを支え育ててくれる関係。安心感を得やすく、自然体でいられます。甘えすぎず自立心も持てば最良のパートナーシップに。',
  },
  '相剋': {
    type: '刺激の縁',
    desc: 'あなたが相手に対して強い影響を与える関係。リーダーシップを発揮しやすいですが、相手の個性も尊重することで良い関係が築けます。',
  },
  '被剋': {
    type: '試練の縁',
    desc: '相手から強い刺激を受ける関係。成長の機会が多い反面、プレッシャーも感じやすいです。お互いの違いを尊重すれば、大きく成長できます。',
  },
};

// --- 十二支の関係テキスト ---

function getJunishiRelationText(aDayShi: Junishi, bDayShi: Junishi): { type: string; description: string } {
  if (isRokugou(aDayShi, bDayShi)) {
    return {
      type: '六合（最良の縁）',
      description: `${aDayShi}と${bDayShi}は六合の関係。十二支の中で最も深い縁で結ばれた組み合わせです。自然と引き寄せ合い、一緒にいるだけで安心感が生まれます。`,
    };
  }
  if (isSangou(aDayShi, bDayShi)) {
    return {
      type: '三合（調和の縁）',
      description: `${aDayShi}と${bDayShi}は三合の関係。三つの支が力を合わせる調和のトライアングルに属し、協力することで大きな力を生み出します。`,
    };
  }
  if (isChuu(aDayShi, bDayShi)) {
    return {
      type: '冲（対立の縁）',
      description: `${aDayShi}と${bDayShi}は冲の関係。正反対の性質を持つ組み合わせで、刺激的ですが衝突も生まれやすい関係です。お互いの違いを認め合うことが大切です。`,
    };
  }
  if (isHangou(aDayShi, bDayShi)) {
    return {
      type: '半合（好縁）',
      description: `${aDayShi}と${bDayShi}は半合の関係。三合の一部を成す好相性で、協力し合える良い関係です。`,
    };
  }
  // その他
  const rel = getGogyoRelation(shiGogyo(aDayShi), shiGogyo(bDayShi));
  if (rel === '比和') {
    return { type: '同気', description: `${aDayShi}と${bDayShi}は同じ五行を持ち、穏やかに共存できる関係です。` };
  }
  return { type: '普通', description: `${aDayShi}と${bDayShi}は特別な吉凶関係はありません。日々の接し方次第で良い関係を築けます。` };
}

// --- スコア計算 ---

function scoreToLevel(score: number): string {
  if (score >= 80) return '大吉';
  if (score >= 60) return '吉';
  if (score >= 40) return '吉凶混合';
  return '凶';
}

function scoreToStars(score: number): number {
  if (score >= 85) return 5;
  if (score >= 70) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  return 1;
}

// 五行関係のスコア
function gogyoRelationScore(rel: GogyoRelation): number {
  switch (rel) {
    case '比和': return 70;
    case '相生': return 85;
    case '被生': return 80;
    case '相剋': return 40;
    case '被剋': return 35;
  }
}

// 十二支関係のスコア
function junishiRelationScore(aDayShi: Junishi, bDayShi: Junishi): number {
  if (isRokugou(aDayShi, bDayShi)) return 95;
  if (isSangou(aDayShi, bDayShi)) return 85;
  if (isHangou(aDayShi, bDayShi)) return 75;
  if (isChuu(aDayShi, bDayShi)) return 30;
  // 五行による判定
  const rel = getGogyoRelation(shiGogyo(aDayShi), shiGogyo(bDayShi));
  return gogyoRelationScore(rel);
}

// 通変星の相性（仕事面重視）
function tsuhenseiWorkScore(aMonth: string, bMonth: string): number {
  const complementary = [
    ['比肩', '正財'], ['劫財', '偏財'], ['食神', '偏官'], ['傷官', '正官'],
    ['偏財', '劫財'], ['正財', '比肩'], ['偏官', '食神'], ['正官', '傷官'],
    ['偏印', '傷官'], ['印綬', '食神'],
  ];
  if (aMonth === bMonth) return 65; // 同じ星
  if (complementary.some(([a, b]) => (aMonth === a && bMonth === b) || (aMonth === b && bMonth === a))) return 85;

  // グループの相性
  const getGroup = (s: string) => {
    if (s === '比肩' || s === '劫財') return '比劫';
    if (s === '食神' || s === '傷官') return '食傷';
    if (s === '偏財' || s === '正財') return '財';
    if (s === '偏官' || s === '正官') return '官殺';
    return '印';
  };
  const ga = getGroup(aMonth);
  const gb = getGroup(bMonth);
  if (ga === gb) return 70;

  // 相生グループ: 比劫→食傷→財→官殺→印→比劫
  const groupOrder = ['比劫', '食傷', '財', '官殺', '印'];
  const ia = groupOrder.indexOf(ga);
  const ib = groupOrder.indexOf(gb);
  const diff = ((ib - ia) + 5) % 5;
  if (diff === 1 || diff === 4) return 75; // 隣接
  return 55; // 対角
}

// --- カテゴリ別テキスト生成 ---

function generateLoveText(a: FortuneResult, b: FortuneResult, score: number): string {
  const aGogyo = kanGogyo(a.nicchu);
  const bGogyo = kanGogyo(b.nicchu);
  const rel = getGogyoRelation(aGogyo, bGogyo);

  const texts: Record<GogyoRelation, string> = {
    '比和': `${aGogyo}同士のお二人は、価値観が自然と合い、穏やかな愛情で結ばれます。阿吽の呼吸で通じ合える関係ですが、マンネリを防ぐために新しい体験を共有することも大切です。`,
    '相生': `あなた（${aGogyo}）が相手（${bGogyo}）を温かく包み込む関係。愛情を注ぐことで相手が輝き、その姿があなたの喜びになるという好循環が生まれます。`,
    '被生': `相手（${bGogyo}）があなた（${aGogyo}）を優しく支えてくれる関係。安心感の中で素直な気持ちを表現でき、自然体の恋愛が楽しめます。`,
    '相剋': `あなた（${aGogyo}）が相手（${bGogyo}）をリードする形の恋愛。情熱的な関係になりやすいですが、相手のペースも尊重することで長続きします。`,
    '被剋': `相手（${bGogyo}）の存在があなた（${aGogyo}）の心を強く揺さぶる関係。ドラマチックな恋愛になりやすく、成長を促してくれる相手です。`,
  };
  return texts[rel];
}

function generateWorkText(a: FortuneResult, b: FortuneResult, score: number): string {
  const aMonth = a.tpiMonth;
  const bMonth = b.tpiMonth;
  const aGogyo = kanGogyo(a.nicchu);
  const bGogyo = kanGogyo(b.nicchu);
  const rel = getGogyoRelation(aGogyo, bGogyo);

  if (score >= 75) {
    return `${aMonth}と${bMonth}の組み合わせは仕事の相性が良好です。お互いの得意分野が補完し合い、チームとして高い成果を出せます。${rel === '相生' || rel === '被生' ? '自然な役割分担ができ、ストレスなく協力できるでしょう。' : '適度な刺激が生産性を高めます。'}`;
  }
  if (score >= 55) {
    return `${aMonth}と${bMonth}の組み合わせは標準的な仕事相性です。意識的にコミュニケーションを取り合うことで、良いパートナーシップが築けます。お互いの専門性を尊重しましょう。`;
  }
  return `${aMonth}と${bMonth}の組み合わせは仕事面でやや摩擦が生じやすい傾向があります。役割を明確に分けることで衝突を避け、それぞれの持ち味を活かす工夫が大切です。`;
}

function generateMoneyText(a: FortuneResult, b: FortuneResult, score: number): string {
  if (score >= 75) {
    return '金銭感覚のバランスが良い組み合わせです。お互いの価値観を尊重しながら、着実に財を築いていけるでしょう。共同での投資や事業も吉。';
  }
  if (score >= 55) {
    return '金銭面では大きな問題はありませんが、使い方の優先順位に違いが出ることも。大きな出費の前には話し合いを心がけると安心です。';
  }
  return '金銭感覚に違いが出やすい組み合わせです。お金の管理方法をあらかじめ話し合い、ルールを決めておくことでトラブルを防げます。';
}

function generateMarriageText(a: FortuneResult, b: FortuneResult, score: number): string {
  const aGogyo = kanGogyo(a.nicchu);
  const bGogyo = kanGogyo(b.nicchu);
  const rel = getGogyoRelation(aGogyo, bGogyo);
  const aDayShi = a.fourPillars.day.shi;
  const bDayShi = b.fourPillars.day.shi;
  const hasRokugou = isRokugou(aDayShi, bDayShi);
  const hasSangou = isSangou(aDayShi, bDayShi);

  if (score >= 80) {
    return `結婚相性は非常に良好です。${hasRokugou ? `${aDayShi}と${bDayShi}の六合は夫婦の縁として最高の組み合わせ。` : hasSangou ? '三合の調和が家庭に安定をもたらします。' : ''}日々の生活の中で自然と支え合い、年月とともに絆が深まる夫婦になれるでしょう。家庭運にも恵まれ、穏やかで温かい家庭を築けます。`;
  }
  if (score >= 60) {
    return `結婚相性はまずまずです。${rel === '相生' || rel === '被生' ? `${aGogyo}と${bGogyo}の相生関係が家庭に安らぎをもたらします。` : ''}お互いの価値観をすり合わせる努力を惜しまなければ、安定した家庭を築いていけます。生活リズムや金銭感覚について、結婚前にしっかり話し合うと吉。`;
  }
  if (score >= 45) {
    return `結婚生活では意見の違いが表面化しやすい組み合わせです。しかし、それは悪いことではありません。異なる視点を持つ二人だからこそ、多角的な判断で家庭を守れます。互いの「譲れないこと」を尊重し合うルール作りが幸せの鍵です。`;
  }
  return `結婚に際しては互いの違いをよく理解することが大切です。${rel === '相剋' || rel === '被剋' ? '強い刺激を与え合う関係は、上手く活かせば情熱的な家庭に。' : ''}価値観のすり合わせに時間をかけ、焦らず関係を育てましょう。困難を共に乗り越えた経験が、かけがえのない絆になります。`;
}

function generateChildrenText(a: FortuneResult, b: FortuneResult, score: number): string {
  const aGogyo = kanGogyo(a.nicchu);
  const bGogyo = kanGogyo(b.nicchu);
  const rel = getGogyoRelation(aGogyo, bGogyo);

  // 五行の相生は「生み出す力」に直結
  const isGenerative = rel === '相生' || rel === '被生';
  // 水と木の組み合わせは「育む」象徴
  const hasNurture = (aGogyo === '水' && bGogyo === '木') || (aGogyo === '木' && bGogyo === '水');
  // 土は「育てる大地」の象徴
  const hasEarth = aGogyo === '土' || bGogyo === '土';

  if (score >= 80) {
    return `子宝運は大変恵まれています。${isGenerative ? '相生の関係が「生み育てる」力を強めており、子宝に恵まれやすい組み合わせです。' : ''}${hasNurture ? '水と木の組み合わせは、新しい命を育む最良の象徴。' : hasEarth ? '土の気が大地のように温かく子供を育む力を与えてくれます。' : ''}子供との相性も良く、明るく健やかな家庭を築けるでしょう。`;
  }
  if (score >= 60) {
    return `子宝運は良好です。${isGenerative ? '相生の流れが子育てに良い影響を与えます。' : ''}二人の異なる個性が子供に多様な刺激を与え、バランスの取れた育児ができる組み合わせです。子供を通じて夫婦の絆もさらに深まるでしょう。`;
  }
  if (score >= 45) {
    return `子宝運は標準的です。子育てにおいては方針の違いが出やすいですが、それは子供にとって「両方の視点」を得られるメリットにもなります。教育方針を事前に話し合い、一貫性を持たせることが大切です。`;
  }
  return `子宝に関しては焦らないことが大切です。二人の関係をまず安定させることが、巡り巡って子宝運を高めます。${rel === '相剋' || rel === '被剋' ? '異なる気質の親を持つ子供は、多様な才能に恵まれる可能性があります。' : ''}二人で子供の未来をじっくり話し合い、温かい家庭の土台を作りましょう。`;
}

function generateAdvice(a: FortuneResult, b: FortuneResult, overall: number): string {
  const aGogyo = kanGogyo(a.nicchu);
  const bGogyo = kanGogyo(b.nicchu);
  const rel = getGogyoRelation(aGogyo, bGogyo);

  if (overall >= 75) {
    return `${aGogyo}と${bGogyo}のお二人は自然な調和を持つ好相性です。お互いの良さを認め合い、感謝の気持ちを忘れずにいれば、末長く良い関係を続けられるでしょう。`;
  }
  if (overall >= 55) {
    return `相性はまずまずですが、より良い関係のために意識的な歩み寄りが大切です。${rel === '相剋' || rel === '被剋' ? '異なる価値観こそが成長のチャンス。相手の視点から学ぶ姿勢が関係を深めます。' : 'コミュニケーションを大切にし、小さな気遣いを積み重ねましょう。'}`;
  }
  return `正反対の要素を持つ組み合わせですが、だからこそ得られるものも大きい関係です。相手を変えようとせず、違いを楽しむ心の余裕を持つことが開運の秘訣。お互いの得意分野を任せ合う関係を築きましょう。`;
}

// --- 五行バランスの相性テキスト ---

function generateGogyoBalanceText(a: FortuneResult, b: FortuneResult): string {
  const aStrong = [...a.gogyoBalance].sort((x, y) => y.count - x.count)[0];
  const bStrong = [...b.gogyoBalance].sort((x, y) => y.count - x.count)[0];
  const aWeak = [...a.gogyoBalance].sort((x, y) => x.count - y.count)[0];
  const bWeak = [...b.gogyoBalance].sort((x, y) => x.count - y.count)[0];

  // 相手の強みが自分の弱みを補完するかチェック
  if (aWeak.gogyo === bStrong.gogyo || bWeak.gogyo === aStrong.gogyo) {
    return `お互いの五行バランスが補い合う好相性です。あなたの${aStrong.gogyo}の力と相手の${bStrong.gogyo}の力が組み合わさり、二人で一つのバランスの取れた形になります。`;
  }
  if (aStrong.gogyo === bStrong.gogyo) {
    return `お二人とも${aStrong.gogyo}の気が強く、同じ方向を向いて進める関係です。ただし、不足する要素も共通するため、意識的に${aWeak.gogyo}の要素を取り入れると吉。`;
  }
  return `五行バランスはそれぞれ異なる個性を持っています。あなたの${aStrong.gogyo}の強みと相手の${bStrong.gogyo}の強みを活かし合うことで、より豊かな関係を築けます。`;
}

// --- メイン計算関数 ---

export function calculateShichusuimeiCompatibility(
  a: FortuneResult,
  b: FortuneResult
): ShichusuimeiCompatibility {
  const aGogyo = kanGogyo(a.nicchu);
  const bGogyo = kanGogyo(b.nicchu);
  const gogyoRel = getGogyoRelation(aGogyo, bGogyo);

  const aDayShi = a.fourPillars.day.shi;
  const bDayShi = b.fourPillars.day.shi;

  // 基礎スコア
  const nisshuScore = gogyoRelationScore(gogyoRel);
  const junishiScore = junishiRelationScore(aDayShi, bDayShi);
  const workTsuhenScore = tsuhenseiWorkScore(a.tpiMonth, b.tpiMonth);

  // 年支の相性（補助要素）
  const yearShiScore = junishiRelationScore(a.fourPillars.year.shi, b.fourPillars.year.shi);

  // カテゴリ別スコア
  const overallScore = Math.round(nisshuScore * 0.35 + junishiScore * 0.30 + workTsuhenScore * 0.20 + yearShiScore * 0.15);
  const loveScore = Math.round(nisshuScore * 0.30 + junishiScore * 0.45 + yearShiScore * 0.25);
  const workScore = Math.round(workTsuhenScore * 0.45 + nisshuScore * 0.30 + junishiScore * 0.25);
  const moneyScore = Math.round(nisshuScore * 0.35 + workTsuhenScore * 0.35 + junishiScore * 0.30);
  // 結婚運: 日支の相性（家庭）を最重視 + 日主の五行 + 年支
  const marriageScore = Math.round(junishiScore * 0.45 + nisshuScore * 0.30 + yearShiScore * 0.25);
  // 子宝運: 相生関係（生む力）を重視 + 日支 + 年支
  const childrenScore = Math.round(nisshuScore * 0.40 + junishiScore * 0.35 + yearShiScore * 0.25);

  // 日主関係
  const nisshuRel = NISSHU_RELATION[gogyoRel];

  // 十二支関係
  const junishiRel = getJunishiRelationText(aDayShi, bDayShi);

  // カテゴリ生成
  const makeCategory = (score: number, desc: string): CompatibilityCategory => ({
    score,
    level: scoreToLevel(score),
    stars: scoreToStars(score),
    description: desc,
  });

  return {
    overall: makeCategory(overallScore,
      overallScore >= 75
        ? '互いの星が調和し、自然体で居心地の良い関係を築ける好相性です。'
        : overallScore >= 55
          ? 'バランスの取れた相性です。意識的なコミュニケーションでさらに深まります。'
          : '異なる要素を持つ組み合わせ。違いを認め合うことで成長できる関係です。'
    ),
    love: makeCategory(loveScore, generateLoveText(a, b, loveScore)),
    work: makeCategory(workScore, generateWorkText(a, b, workScore)),
    money: makeCategory(moneyScore, generateMoneyText(a, b, moneyScore)),
    marriage: makeCategory(marriageScore, generateMarriageText(a, b, marriageScore)),
    children: makeCategory(childrenScore, generateChildrenText(a, b, childrenScore)),
    nisshuRelation: { type: nisshuRel.type, description: nisshuRel.desc },
    junishiRelation: junishiRel,
    gogyoBalance: { description: generateGogyoBalanceText(a, b) },
    advice: generateAdvice(a, b, overallScore),
  };
}
