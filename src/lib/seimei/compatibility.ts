// ============================================================
// 姓名判断 相性診断ロジック
// 人格の五行関係・五格の吉凶バランス・三才配置から算出
// ============================================================

import type { SeimeiResult, GokakuDetail } from './index';
import { kakuToGogyo } from './gokaku';
import type { Gogyo } from './gokaku';

// --- 型定義 ---

export interface CompatibilityCategory {
  score: number;       // 0-100
  level: string;       // 大吉/吉/吉凶混合/凶
  stars: number;       // 1-5
  description: string;
}

export interface SeimeiCompatibility {
  overall: CompatibilityCategory;
  love: CompatibilityCategory;
  work: CompatibilityCategory;
  marriage: CompatibilityCategory;
  children: CompatibilityCategory;
  jinkakuRelation: { type: string; description: string };
  sansaiRelation: { description: string };
  gogyoRelation: { type: string; description: string };
  advice: string;
}

// --- 五行の相性判定 ---

type GogyoRelation = '相生' | '被生' | '相剋' | '被剋' | '比和';

function getGogyoRelation(a: Gogyo, b: Gogyo): GogyoRelation {
  if (a === b) return '比和';
  const sojo: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  if (sojo[a] === b) return '相生';
  if (sojo[b] === a) return '被生';
  const sokoku: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  if (sokoku[a] === b) return '相剋';
  return '被剋';
}

function gogyoRelationScore(rel: GogyoRelation): number {
  switch (rel) {
    case '比和': return 70;
    case '相生': return 90;
    case '被生': return 85;
    case '相剋': return 35;
    case '被剋': return 30;
  }
}

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

// --- 五格の吉凶スコア ---

function gokakuKikkyoScore(detail: GokakuDetail): number {
  switch (detail.suri.kikkyo) {
    case '大吉': return 100;
    case '吉': return 75;
    case '吉凶混合': return 50;
    case '凶': return 25;
    case '大凶': return 10;
    default: return 50;
  }
}

// 二人の五格吉凶バランスの相性
function gokakuHarmonyScore(a: GokakuDetail[], b: GokakuDetail[]): number {
  let totalScore = 0;
  const weights: Record<string, number> = {
    jinkaku: 5, chikaku: 3, soukaku: 4, gaikaku: 3, tenkaku: 1,
  };
  let totalWeight = 0;

  for (const ad of a) {
    const bd = b.find(d => d.key === ad.key);
    if (!bd) continue;
    const w = weights[ad.key] || 1;
    // 両方吉ならボーナス、両方凶ならペナルティ
    const as_ = gokakuKikkyoScore(ad);
    const bs = gokakuKikkyoScore(bd);
    const avg = (as_ + bs) / 2;
    // 同じ方向性ならボーナス
    const diff = Math.abs(as_ - bs);
    const harmony = avg - diff * 0.15;
    totalScore += harmony * w;
    totalWeight += w;
  }

  return Math.round(totalWeight > 0 ? totalScore / totalWeight : 50);
}

// --- テキスト生成 ---

const GOGYO_RELATION_TEXT: Record<GogyoRelation, { type: string; desc: (aG: Gogyo, bG: Gogyo) => string }> = {
  '比和': {
    type: '同気の相性',
    desc: (a, b) => `お二人の人格はともに「${a}」の五行。価値観や考え方が似ており、自然と理解し合える関係です。`,
  },
  '相生': {
    type: '育む相性',
    desc: (a, b) => `あなたの「${a}」が相手の「${b}」を生じる相生の関係。あなたが相手を自然と支え、良い影響を与えます。`,
  },
  '被生': {
    type: '育まれる相性',
    desc: (a, b) => `相手の「${b}」があなたの「${a}」を生じる関係。相手から良い刺激と支えを受けられます。`,
  },
  '相剋': {
    type: '刺激の相性',
    desc: (a, b) => `あなたの「${a}」が相手の「${b}」を剋する関係。リードする形になりやすく、相手への配慮が大切です。`,
  },
  '被剋': {
    type: '試練の相性',
    desc: (a, b) => `相手の「${b}」があなたの「${a}」を剋する関係。成長の機会が多い反面、互いの個性を尊重しましょう。`,
  },
};

function generateLoveText(aGogyo: Gogyo, bGogyo: Gogyo, rel: GogyoRelation, score: number): string {
  if (score >= 75) {
    return `名前の五行が調和しており、恋愛面でも自然体で居心地の良い関係です。${rel === '相生' || rel === '被生' ? '支え合う力が強く、安定した愛情を育めます。' : '共通の価値観が二人の絆を深めてくれるでしょう。'}`;
  }
  if (score >= 55) {
    return `恋愛相性はまずまずです。${aGogyo}と${bGogyo}の組み合わせは、お互いの違いが良い刺激になります。相手の長所に目を向けることで、より深い関係になれるでしょう。`;
  }
  return `${aGogyo}と${bGogyo}は異なる性質を持つ組み合わせ。恋愛面では意見の相違が生まれやすいですが、それは二人の世界を広げるチャンスでもあります。対話を大切にしましょう。`;
}

function generateWorkText(aGogyo: Gogyo, bGogyo: Gogyo, rel: GogyoRelation, score: number): string {
  if (score >= 75) {
    return `仕事の相性は良好です。${rel === '相生' || rel === '被生' ? `${aGogyo}と${bGogyo}の力が自然に噛み合い、お互いの弱点を補い合える関係です。` : `同じ${aGogyo}の気質を共有し、方向性が一致しやすいです。`}共同作業でも高い成果が期待できます。`;
  }
  if (score >= 55) {
    return `仕事面では標準的な相性です。役割分担を明確にし、お互いの得意分野を活かすことで良いチームワークが生まれます。`;
  }
  return `仕事面ではやや摩擦が生じやすい組み合わせです。アプローチの違いを「多角的な視点」と捉え、お互いの意見に耳を傾ける姿勢が成功の鍵です。`;
}

function generateSansaiText(a: SeimeiResult, b: SeimeiResult): string {
  const aKikkyo = a.sansai.kikkyo;
  const bKikkyo = b.sansai.kikkyo;
  const aGood = aKikkyo === '大吉' || aKikkyo === '吉';
  const bGood = bKikkyo === '大吉' || bKikkyo === '吉';

  if (aGood && bGood) {
    return `お二人とも三才配置が吉。安定した運気の中で、お互いの良さを引き出し合える恵まれた組み合わせです。`;
  }
  if (aGood || bGood) {
    return `${aGood ? 'あなた' : '相手'}の三才配置が吉で、${aGood ? '相手' : 'あなた'}を支える力があります。良い運気を分かち合うことで、二人の関係全体が底上げされます。`;
  }
  return `お二人の三才配置にはそれぞれ課題がありますが、協力し合うことで互いの弱点を補い合えます。二人で乗り越える経験が絆を深めるでしょう。`;
}

function generateMarriageText(aGogyo: Gogyo, bGogyo: Gogyo, rel: GogyoRelation, score: number, a: SeimeiResult, b: SeimeiResult): string {
  const aGood = a.sansai.kikkyo === '大吉' || a.sansai.kikkyo === '吉';
  const bGood = b.sansai.kikkyo === '大吉' || b.sansai.kikkyo === '吉';

  if (score >= 75) {
    return `結婚相性は非常に良好です。${rel === '相生' || rel === '被生' ? `「${aGogyo}」と「${bGogyo}」の相生関係が家庭に安定と温かさをもたらします。` : `同じ「${aGogyo}」の気質が価値観の一致を生みます。`}${aGood && bGood ? 'お二人とも三才配置が吉で、家庭運にも恵まれています。' : ''}末長く支え合える夫婦の縁です。`;
  }
  if (score >= 55) {
    return `結婚相性はまずまずです。お互いの名前の持つ力が補い合い、生活の中で自然とバランスが取れていきます。結婚生活では小さな感謝を言葉にすることが幸せの秘訣。${aGood || bGood ? '三才配置の良い方が家庭の支えとなるでしょう。' : ''}`;
  }
  return `結婚に関しては、互いの違いを理解し受け入れることが大切です。名前の五行が異なるからこそ、多様な視点で家庭を運営できるメリットがあります。事前のコミュニケーションを丁寧に重ね、共通のルール作りを心がけましょう。`;
}

function generateChildrenText(aGogyo: Gogyo, bGogyo: Gogyo, rel: GogyoRelation, score: number): string {
  const isGenerative = rel === '相生' || rel === '被生';
  const hasEarth = aGogyo === '土' || bGogyo === '土';
  const hasWater = aGogyo === '水' || bGogyo === '水';

  if (score >= 75) {
    return `子宝運は大変恵まれています。${isGenerative ? `「${aGogyo}」と「${bGogyo}」の相生の流れが、新しい命を育む力を高めています。` : ''}${hasEarth ? '「土」の持つ大地の力が、温かく子供を包み込みます。' : hasWater ? '「水」の流れる力が、命の循環を促してくれます。' : ''}子供にも良い名前の運気が受け継がれるでしょう。`;
  }
  if (score >= 55) {
    return `子宝運は良好です。二人の名前が持つ異なる五行が子供に多彩な才能を授けるでしょう。子育てでは、お互いの得意分野を活かした役割分担がうまくいきます。子供を通じて夫婦の絆も一層深まります。`;
  }
  return `子宝に関しては焦らず、まず二人の関係をしっかり築くことが先決です。名前の五行の違いは、子供にとって多様な価値観に触れる恵みとなります。教育方針を話し合い、温かい家庭の土台を整えることが子宝運を高める鍵です。`;
}

function generateAdvice(aGogyo: Gogyo, bGogyo: Gogyo, overall: number): string {
  if (overall >= 75) {
    return `「${aGogyo}」と「${bGogyo}」のお二人は名前の力が調和した好相性。この縁を大切にし、感謝の気持ちを言葉にすることでさらに運気が上昇します。`;
  }
  if (overall >= 55) {
    return `まずまずの相性です。お互いの名前に込められた力を理解し、相手の個性を尊重しましょう。小さな気遣いの積み重ねが、大きな信頼関係を育てます。`;
  }
  return `異なる要素を持つ組み合わせだからこそ、学び合える関係です。相手の名前が持つ力を「自分にないもの」として尊重し、取り入れる姿勢が開運のポイントです。`;
}

// --- メイン計算関数 ---

export function calculateSeimeiCompatibility(
  a: SeimeiResult,
  b: SeimeiResult
): SeimeiCompatibility {
  // 人格の五行
  const aJinkaku = a.gokakuDetails.find(d => d.key === 'jinkaku')!;
  const bJinkaku = b.gokakuDetails.find(d => d.key === 'jinkaku')!;
  const aGogyo = kakuToGogyo(aJinkaku.kaku);
  const bGogyo = kakuToGogyo(bJinkaku.kaku);
  const gogyoRel = getGogyoRelation(aGogyo, bGogyo);

  // 外格の五行（対人運）
  const aGaikaku = a.gokakuDetails.find(d => d.key === 'gaikaku')!;
  const bGaikaku = b.gokakuDetails.find(d => d.key === 'gaikaku')!;
  const aGaiGogyo = kakuToGogyo(aGaikaku.kaku);
  const bGaiGogyo = kakuToGogyo(bGaikaku.kaku);
  const gaikakuRel = getGogyoRelation(aGaiGogyo, bGaiGogyo);

  // 地格の五行（内面）
  const aChikaku = a.gokakuDetails.find(d => d.key === 'chikaku')!;
  const bChikaku = b.gokakuDetails.find(d => d.key === 'chikaku')!;
  const aChiGogyo = kakuToGogyo(aChikaku.kaku);
  const bChiGogyo = kakuToGogyo(bChikaku.kaku);
  const chikakuRel = getGogyoRelation(aChiGogyo, bChiGogyo);

  // 基礎スコア
  const jinkakuScore = gogyoRelationScore(gogyoRel);
  const gaikakuScore = gogyoRelationScore(gaikakuRel);
  const chikakuScore = gogyoRelationScore(chikakuRel);
  const harmonyScore = gokakuHarmonyScore(a.gokakuDetails, b.gokakuDetails);

  // 三才の吉凶一致ボーナス
  let sansaiBonus = 0;
  const aGood = a.sansai.kikkyo === '大吉' || a.sansai.kikkyo === '吉';
  const bGood = b.sansai.kikkyo === '大吉' || b.sansai.kikkyo === '吉';
  if (aGood && bGood) sansaiBonus = 10;
  else if (aGood || bGood) sansaiBonus = 5;

  // カテゴリ別スコア
  const overallRaw = jinkakuScore * 0.35 + gaikakuScore * 0.20 + harmonyScore * 0.25 + chikakuScore * 0.20 + sansaiBonus * 0.5;
  const overallScore = Math.round(Math.min(100, overallRaw));
  const loveScore = Math.round(Math.min(100, jinkakuScore * 0.35 + chikakuScore * 0.35 + harmonyScore * 0.15 + sansaiBonus * 0.5 + gaikakuScore * 0.15));
  const workScore = Math.round(Math.min(100, gaikakuScore * 0.35 + jinkakuScore * 0.30 + harmonyScore * 0.20 + sansaiBonus * 0.5 + chikakuScore * 0.15));
  // 結婚運: 人格（性格の一致）+ 地格（内面）+ 三才ボーナス重視
  const marriageScore = Math.round(Math.min(100, jinkakuScore * 0.30 + chikakuScore * 0.30 + harmonyScore * 0.15 + sansaiBonus * 1.0 + gaikakuScore * 0.25));
  // 子宝運: 地格（若年期・潜在力）+ 人格（相生=生む力）+ 三才
  const childrenScore = Math.round(Math.min(100, chikakuScore * 0.35 + jinkakuScore * 0.30 + harmonyScore * 0.15 + sansaiBonus * 0.8 + gaikakuScore * 0.20));

  // テキスト
  const relText = GOGYO_RELATION_TEXT[gogyoRel];

  const makeCategory = (score: number, desc: string): CompatibilityCategory => ({
    score,
    level: scoreToLevel(score),
    stars: scoreToStars(score),
    description: desc,
  });

  return {
    overall: makeCategory(overallScore,
      overallScore >= 75
        ? 'お二人の名前は五行が調和し、互いの運勢を高め合う好相性です。'
        : overallScore >= 55
          ? 'バランスの取れた相性です。お互いの個性を認め合うことでさらに良い関係に。'
          : '異なる要素を持つ組み合わせ。違いを活かし合うことで成長できる関係です。'
    ),
    love: makeCategory(loveScore, generateLoveText(aGogyo, bGogyo, gogyoRel, loveScore)),
    work: makeCategory(workScore, generateWorkText(aGogyo, bGogyo, gogyoRel, workScore)),
    marriage: makeCategory(marriageScore, generateMarriageText(aGogyo, bGogyo, gogyoRel, marriageScore, a, b)),
    children: makeCategory(childrenScore, generateChildrenText(aGogyo, bGogyo, gogyoRel, childrenScore)),
    jinkakuRelation: {
      type: relText.type,
      description: relText.desc(aGogyo, bGogyo),
    },
    sansaiRelation: { description: generateSansaiText(a, b) },
    gogyoRelation: {
      type: `${aGogyo} × ${bGogyo}`,
      description: relText.desc(aGogyo, bGogyo),
    },
    advice: generateAdvice(aGogyo, bGogyo, overallScore),
  };
}
