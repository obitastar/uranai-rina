// ============================================================
// 地支の関係（冲・支合・三合・刑・害・破）データ
// 四柱推命における地支同士の相互作用を分析する
// ============================================================

import type { Junishi, FourPillars } from './types';

// --- インターフェース ---

export interface ChishiRelation {
  type: '冲' | '支合' | '三合' | '刑' | '害' | '破';
  branches: string[];       // 関係する地支
  positions: string[];      // 関係する柱（年・月・日・時）
  result?: string;          // 合の場合の化五行
  description: string;      // 鑑定テキスト（50-80字）
  pillarDesc?: string;      // 柱の組み合わせ別の説明
}

export interface ChishiRelationResult {
  relations: ChishiRelation[];
  summary: string;          // 総合鑑定文（100-150字）
}

// --- 柱名定数 ---

const PILLAR_NAMES = ['年', '月', '日', '時'] as const;
type PillarName = (typeof PILLAR_NAMES)[number];

// ============================================================
// 六冲（ろくちゅう）
// ============================================================

const ROKU_CHU: [Junishi, Junishi][] = [
  ['子', '午'],
  ['丑', '未'],
  ['寅', '申'],
  ['卯', '酉'],
  ['辰', '戌'],
  ['巳', '亥'],
];

const CHU_DESCRIPTIONS: Record<string, string> = {
  '子午': '子午の冲 ── 感情と理性の葛藤が生じやすい組み合わせ。変化を恐れず、両面のバランスを取ることで成長できます。',
  '丑未': '丑未の冲 ── 蓄えと分配の間で揺れ動く運勢。信念を持ち、自分の価値観を大切にすることが安定への鍵となります。',
  '寅申': '寅申の冲 ── 行動力と慎重さの衝突が起こりやすい配置。大胆さと計画性を併せ持てば、大きな飛躍につながります。',
  '卯酉': '卯酉の冲 ── 人間関係に波乱が生まれやすい配置。対立を恐れず、誠実な対話を重ねることで信頼を築けます。',
  '辰戌': '辰戌の冲 ── 理想と現実の狭間で悩みやすい配置。地に足をつけながらも夢を追い続けることで道が拓けます。',
  '巳亥': '巳亥の冲 ── 知恵と情熱がぶつかり合う配置。内なる矛盾を創造のエネルギーに変えることで才能が開花します。',
};

// 柱の組み合わせ別の追加説明
const PILLAR_PAIR_DESC: Record<string, Record<string, string>> = {
  '冲': {
    '年月': '年柱（家庭・先祖）と月柱（社会・仕事）の冲。幼少期の環境と社会生活の間にギャップがあり、自力で道を切り拓く力が養われます。',
    '年日': '年柱（家庭・先祖）と日柱（自分自身）の冲。家族との価値観の違いを経験しやすいが、独自の人生観を築く力となります。',
    '年時': '年柱（家庭・先祖）と時柱（晩年・子供）の冲。世代間のギャップを感じやすいが、新しい時代への橋渡し役になれます。',
    '月日': '月柱（社会・仕事）と日柱（自分自身）の冲。社会での自分と本来の自分にギャップを感じやすいが、その葛藤が自己成長の糧に。',
    '月時': '月柱（社会・仕事）と時柱（晩年・子供）の冲。キャリアと家庭の両立に悩みやすいが、バランスを取る知恵が身につきます。',
    '日時': '日柱（自分自身）と時柱（晩年・子供）の冲。自分の理想と将来の方向性にズレを感じやすいが、柔軟に軌道修正する力があります。',
  },
  '支合': {
    '年月': '年柱（家庭・先祖）と月柱（社会・仕事）の合。家庭と仕事が調和し、安定した環境で実力を伸ばせる好配置です。',
    '年日': '年柱（家庭・先祖）と日柱（自分自身）の合。家族との絆が深く、先祖からの恩恵を受けやすい幸運な配置です。',
    '年時': '年柱（家庭・先祖）と時柱（晩年・子供）の合。家系の良い流れが晩年や子供にも引き継がれ、長期的な安定をもたらします。',
    '月日': '月柱（社会・仕事）と日柱（自分自身）の合。仕事と自分の本質がマッチし、天職に出会いやすい好配置です。',
    '月時': '月柱（社会・仕事）と時柱（晩年・子供）の合。仕事で築いた成果が晩年の安定や子供の発展につながります。',
    '日時': '日柱（自分自身）と時柱（晩年・子供）の合。自分らしく生きることが晩年の充実に直結する好配置です。',
  },
  '刑': {
    '年月': '年柱（家庭・先祖）と月柱（社会・仕事）の刑。家庭環境が社会での振る舞いに影響しやすく、意識的に礼節を心がけると吉。',
    '年日': '年柱（家庭・先祖）と日柱（自分自身）の刑。家族との間に試練が生じやすいが、乗り越えるたびに人間力が磨かれます。',
    '年時': '年柱（家庭・先祖）と時柱（晩年・子供）の刑。世代間の摩擦を感じやすいが、互いを尊重する姿勢が関係を良くします。',
    '月日': '月柱（社会・仕事）と日柱（自分自身）の刑。職場での人間関係に課題が出やすいが、自制心を持てば信頼を得られます。',
    '月時': '月柱（社会・仕事）と時柱（晩年・子供）の刑。仕事のストレスが家庭に影響しやすい。オンオフの切り替えが大切です。',
    '日時': '日柱（自分自身）と時柱（晩年・子供）の刑。自分の理想を子供に押しつけないよう注意。個性を尊重することが鍵。',
  },
  '害': {
    '年月': '年柱（家庭・先祖）と月柱（社会・仕事）の害。家庭と仕事の間ですれ違いが起きやすいが、優先順位を明確にすると安定します。',
    '年日': '年柱（家庭・先祖）と日柱（自分自身）の害。親や家族との関係に微妙な緊張感が生じやすいが、距離感の調整で改善できます。',
    '年時': '年柱（家庭・先祖）と時柱（晩年・子供）の害。家系と子供の方向性にズレが出やすいが、新しい価値観を受け入れる柔軟さが大切。',
    '月日': '月柱（社会・仕事）と日柱（自分自身）の害。社会的な期待と自分の本音の間にストレスが生まれやすいが、自己表現を大切にして。',
    '月時': '月柱（社会・仕事）と時柱（晩年・子供）の害。キャリアの成果が必ずしも晩年の安定に直結しない配置。計画的な備えが重要。',
    '日時': '日柱（自分自身）と時柱（晩年・子供）の害。自分と子供の価値観がずれやすいが、対話を重ねることで互いの理解が深まります。',
  },
  '破': {
    '年月': '年柱（家庭・先祖）と月柱（社会・仕事）の破。家庭基盤が揺らぐと仕事にも影響が出やすい。安定した生活環境づくりが先決。',
    '年日': '年柱（家庭・先祖）と日柱（自分自身）の破。家族からの期待が重荷になりやすいが、自分の道を選ぶ覚悟が運を開きます。',
    '年時': '年柱（家庭・先祖）と時柱（晩年・子供）の破。伝統と革新の間で揺れやすいが、時代に合わせた進化が発展につながります。',
    '月日': '月柱（社会・仕事）と日柱（自分自身）の破。仕事上の信頼関係が崩れやすい局面がある。誠実な行動の積み重ねが最大の防御。',
    '月時': '月柱（社会・仕事）と時柱（晩年・子供）の破。仕事の成果が予想外に崩れることがある。複数の収入源やスキルを持つと安心。',
    '日時': '日柱（自分自身）と時柱（晩年・子供）の破。晩年に向けた計画が変更を余儀なくされやすい。柔軟に対応する姿勢が鍵。',
  },
};

// ============================================================
// 支合（六合）
// ============================================================

interface ShigouEntry {
  pair: [Junishi, Junishi];
  result: string; // 化五行
}

const SHIGOU: ShigouEntry[] = [
  { pair: ['子', '丑'], result: '土' },
  { pair: ['寅', '亥'], result: '木' },
  { pair: ['卯', '戌'], result: '火' },
  { pair: ['辰', '酉'], result: '金' },
  { pair: ['巳', '申'], result: '水' },
  { pair: ['午', '未'], result: '土(火)' },
];

const SHIGOU_DESCRIPTIONS: Record<string, string> = {
  '子丑': '子丑の合 ── 人との絆に恵まれ、協力関係から大きな成果を生みます。土の安定感が基盤を固めてくれるでしょう。',
  '寅亥': '寅亥の合 ── 木の生命力が宿り、成長と発展に恵まれます。新しい挑戦が実を結びやすい好配置です。',
  '卯戌': '卯戌の合 ── 火の情熱が生まれ、温かい人間関係を築けます。周囲を照らす存在として信頼を集めるでしょう。',
  '辰酉': '辰酉の合 ── 金の輝きが加わり、知性と美意識が高まります。洗練された判断力で物事を成功へ導きます。',
  '巳申': '巳申の合 ── 水の知恵が流れ込み、柔軟な思考力に恵まれます。機転を利かせて困難を乗り越える力があります。',
  '午未': '午未の合 ── 土と火のエネルギーが融合し、情熱と安定を併せ持ちます。周囲を温かく包む包容力の持ち主です。',
};

// ============================================================
// 三合局
// ============================================================

interface SangouEntry {
  members: [Junishi, Junishi, Junishi];
  result: string; // 局名（化五行）
}

const SANGOU: SangouEntry[] = [
  { members: ['寅', '午', '戌'], result: '火局' },
  { members: ['巳', '酉', '丑'], result: '金局' },
  { members: ['申', '子', '辰'], result: '水局' },
  { members: ['亥', '卯', '未'], result: '木局' },
];

const SANGOU_DESCRIPTIONS: Record<string, string> = {
  '火局': '寅午戌の三合火局 ── 情熱とリーダーシップに溢れる配置。強い意志で周囲を牽引し、大きな成果を生み出す力があります。',
  '金局': '巳酉丑の三合金局 ── 決断力と実行力に恵まれた配置。物事を形にする力が強く、確実に結果を残せる命式です。',
  '水局': '申子辰の三合水局 ── 知恵と適応力に富む配置。流れを読む力に長け、時流に乗って大きく発展する可能性を秘めます。',
  '木局': '亥卯未の三合木局 ── 成長と仁愛の力が満ちる配置。人を育て、自らも成長し続ける豊かな人生を歩みます。',
};

// ============================================================
// 刑（けい）
// ============================================================

type KeiType = '無礼刑' | '勢刑' | '恩刑' | '自刑';

interface KeiEntry {
  pair: [Junishi, Junishi];
  keiType: KeiType;
}

const KEI: KeiEntry[] = [
  // 無礼刑
  { pair: ['子', '卯'], keiType: '無礼刑' },
  // 勢刑（三刑）
  { pair: ['寅', '巳'], keiType: '勢刑' },
  { pair: ['巳', '申'], keiType: '勢刑' },
  { pair: ['申', '寅'], keiType: '勢刑' },
  // 恩刑
  { pair: ['丑', '戌'], keiType: '恩刑' },
  { pair: ['戌', '未'], keiType: '恩刑' },
  { pair: ['未', '丑'], keiType: '恩刑' },
];

const JIKEI_BRANCHES: Junishi[] = ['辰', '午', '酉', '亥'];

const KEI_DESCRIPTIONS: Record<string, string> = {
  '子卯_無礼刑': '子卯の無礼刑 ── 礼節を欠くとトラブルを招きやすい配置。謙虚さと感謝の心を忘れなければ、人間関係は円滑に保てます。',
  '寅巳_勢刑': '寅巳の勢刑 ── 勢いが先走りがちな配置。行動力を制御し、周囲との協調を意識することで力を正しく活かせます。',
  '巳申_勢刑': '巳申の勢刑 ── 競争心が強まりやすい配置。争いを避け、互いの強みを認め合うことで関係が好転します。',
  '申寅_勢刑': '申寅の勢刑 ── 意志の衝突が起こりやすい配置。自制心を持ち、相手の立場を考えることで協力関係が生まれます。',
  '丑戌_恩刑': '丑戌の恩刑 ── 恩義を巡る葛藤が生じやすい配置。見返りを求めず与える姿勢が、結果的に大きな信頼を呼びます。',
  '戌未_恩刑': '戌未の恩刑 ── 義理と人情の板挟みになりやすい配置。自分の信念を軸に判断すれば、周囲も納得する道が見つかります。',
  '未丑_恩刑': '未丑の恩刑 ── 人間関係で悩みやすい配置。過去の恩義に縛られすぎず、前を向くことで新しい関係が開けます。',
  '辰辰_自刑': '辰の自刑 ── 自分自身を追い込みやすい傾向があります。完璧を求めすぎず、適度に力を抜くことが大切です。',
  '午午_自刑': '午の自刑 ── 情熱が空回りしやすい傾向があります。焦らず一つずつ着実に進めることで成果が積み上がります。',
  '酉酉_自刑': '酉の自刑 ── 自己批判が強まりやすい傾向があります。自分の良さを認め、長所を活かす方向に意識を向けましょう。',
  '亥亥_自刑': '亥の自刑 ── 考えすぎて動けなくなる傾向があります。思い切って一歩を踏み出すことで運気の流れが変わります。',
};

// ============================================================
// 六害
// ============================================================

const ROKU_GAI: [Junishi, Junishi][] = [
  ['子', '未'],
  ['丑', '午'],
  ['寅', '巳'],
  ['卯', '辰'],
  ['申', '亥'],
  ['酉', '戌'],
];

const GAI_DESCRIPTIONS: Record<string, string> = {
  '子未': '子未の害 ── 信頼関係に亀裂が入りやすい配置。相手への期待を適度に保ち、自立心を育てることで安定を得られます。',
  '丑午': '丑午の害 ── 努力が報われにくいと感じやすい配置。焦らず地道に続ければ、やがて実力が正当に評価される時が来ます。',
  '寅巳': '寅巳の害 ── 思わぬ障害に遭遇しやすい配置。柔軟に対応策を考え、一つの道に固執しない姿勢が成功の鍵です。',
  '卯辰': '卯辰の害 ── 周囲との調和が乱れやすい配置。自分の意見を押し通すより、耳を傾ける姿勢が状況を好転させます。',
  '申亥': '申亥の害 ── 計画が思い通りに進みにくい配置。小さな修正を重ねながら柔軟に進めることで目標に到達できます。',
  '酉戌': '酉戌の害 ── 近しい人との摩擦が生じやすい配置。感情的にならず冷静に対話することで、絆はむしろ深まります。',
};

// ============================================================
// 破
// ============================================================

const HA: [Junishi, Junishi][] = [
  ['子', '酉'],
  ['丑', '辰'],
  ['寅', '亥'],
  ['卯', '午'],
  ['巳', '申'],
  ['未', '戌'],
];

const HA_DESCRIPTIONS: Record<string, string> = {
  '子酉': '子酉の破 ── 順調に見えて足元が揺らぎやすい配置。慢心を避け、基礎を固める意識が安定した発展をもたらします。',
  '丑辰': '丑辰の破 ── 蓄積したものが崩れやすい配置。守りに入りすぎず、変化に適応する柔軟さが財産を守る力になります。',
  '寅亥': '寅亥の破 ── 味方だと思った相手との関係に注意が必要な配置。見極める目を養い、信頼は行動で判断しましょう。',
  '卯午': '卯午の破 ── 感情に振り回されやすい配置。冷静な判断を心がけ、大切な決断は一晩置いてから下すのが吉です。',
  '巳申': '巳申の破 ── 契約や約束にまつわる注意が必要な配置。細部まで確認する慎重さが、大きなトラブルを未然に防ぎます。',
  '未戌': '未戌の破 ── 信念が揺らぎやすい配置。自分の軸をしっかり持ち、周囲の意見に流されなければ道は自ずと開けます。',
};

// ============================================================
// ユーティリティ
// ============================================================

/** 四柱から全地支を柱名とともに取得 */
function extractBranches(fourPillars: FourPillars): { branch: Junishi; position: PillarName }[] {
  const result: { branch: Junishi; position: PillarName }[] = [
    { branch: fourPillars.year.shi, position: '年' },
    { branch: fourPillars.month.shi, position: '月' },
    { branch: fourPillars.day.shi, position: '日' },
  ];
  if (fourPillars.hour) {
    result.push({ branch: fourPillars.hour.shi, position: '時' });
  }
  return result;
}

/** ペアのキーを正規化（テーブル検索用） */
function pairKey(a: Junishi, b: Junishi): string {
  return `${a}${b}`;
}

/** 柱の組み合わせキーを生成（年月/年日/年時/月日/月時/日時） */
function pillarPairKey(posA: PillarName, posB: PillarName): string {
  const order: PillarName[] = ['年', '月', '日', '時'];
  const [first, second] = order.indexOf(posA) < order.indexOf(posB) ? [posA, posB] : [posB, posA];
  return `${first}${second}`;
}

/** 柱の組み合わせ別説明を取得 */
function getPillarDesc(type: string, posA: PillarName, posB: PillarName): string | undefined {
  const key = pillarPairKey(posA, posB);
  return PILLAR_PAIR_DESC[type]?.[key];
}

// ============================================================
// 分析関数
// ============================================================

/** 六冲を検出 */
function findChu(
  entries: { branch: Junishi; position: PillarName }[],
): ChishiRelation[] {
  const results: ChishiRelation[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      for (const [x, y] of ROKU_CHU) {
        if ((a.branch === x && b.branch === y) || (a.branch === y && b.branch === x)) {
          const key = pairKey(x, y);
          results.push({
            type: '冲',
            branches: [a.branch, b.branch],
            positions: [a.position, b.position],
            description: CHU_DESCRIPTIONS[key] ?? `${a.branch}${b.branch}の冲が命式に存在します。`,
            pillarDesc: getPillarDesc('冲', a.position, b.position),
          });
        }
      }
    }
  }
  return results;
}

/** 支合を検出 */
function findShigou(
  entries: { branch: Junishi; position: PillarName }[],
): ChishiRelation[] {
  const results: ChishiRelation[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      for (const { pair, result } of SHIGOU) {
        if (
          (a.branch === pair[0] && b.branch === pair[1]) ||
          (a.branch === pair[1] && b.branch === pair[0])
        ) {
          const key = pairKey(pair[0], pair[1]);
          results.push({
            type: '支合',
            branches: [a.branch, b.branch],
            positions: [a.position, b.position],
            result,
            description: SHIGOU_DESCRIPTIONS[key] ?? `${a.branch}${b.branch}の支合が命式に存在します。`,
            pillarDesc: getPillarDesc('支合', a.position, b.position),
          });
        }
      }
    }
  }
  return results;
}

/** 三合局を検出 */
function findSangou(
  entries: { branch: Junishi; position: PillarName }[],
): ChishiRelation[] {
  const results: ChishiRelation[] = [];
  const branchSet = new Set(entries.map((e) => e.branch));

  for (const { members, result } of SANGOU) {
    const matched = members.filter((m) => branchSet.has(m));
    if (matched.length === 3) {
      // 3つ全て揃っている場合のみ三合局成立
      const positions = matched.map((m) => {
        const entry = entries.find((e) => e.branch === m);
        return entry!.position;
      });
      results.push({
        type: '三合',
        branches: [...matched],
        positions,
        result,
        description: SANGOU_DESCRIPTIONS[result] ?? `三合${result}が命式に成立しています。`,
      });
    }
  }
  return results;
}

/** 刑を検出 */
function findKei(
  entries: { branch: Junishi; position: PillarName }[],
): ChishiRelation[] {
  const results: ChishiRelation[] = [];

  // 無礼刑・勢刑・恩刑
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      for (const { pair, keiType } of KEI) {
        if (
          (a.branch === pair[0] && b.branch === pair[1]) ||
          (a.branch === pair[1] && b.branch === pair[0])
        ) {
          // 正規化: テーブル定義順でキーを生成
          const key = `${pair[0]}${pair[1]}_${keiType}`;
          results.push({
            type: '刑',
            branches: [a.branch, b.branch],
            positions: [a.position, b.position],
            description: KEI_DESCRIPTIONS[key] ?? `${a.branch}${b.branch}の${keiType}が命式に存在します。`,
            pillarDesc: getPillarDesc('刑', a.position, b.position),
          });
        }
      }
    }
  }

  // 自刑（同じ地支が2つ以上ある場合）
  for (const jikei of JIKEI_BRANCHES) {
    const matched = entries.filter((e) => e.branch === jikei);
    if (matched.length >= 2) {
      const key = `${jikei}${jikei}_自刑`;
      results.push({
        type: '刑',
        branches: [jikei, jikei],
        positions: matched.map((e) => e.position),
        description: KEI_DESCRIPTIONS[key] ?? `${jikei}の自刑が命式に存在します。`,
      });
    }
  }

  return results;
}

/** 六害を検出 */
function findGai(
  entries: { branch: Junishi; position: PillarName }[],
): ChishiRelation[] {
  const results: ChishiRelation[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      for (const [x, y] of ROKU_GAI) {
        if ((a.branch === x && b.branch === y) || (a.branch === y && b.branch === x)) {
          const key = pairKey(x, y);
          results.push({
            type: '害',
            branches: [a.branch, b.branch],
            positions: [a.position, b.position],
            description: GAI_DESCRIPTIONS[key] ?? `${a.branch}${b.branch}の害が命式に存在します。`,
            pillarDesc: getPillarDesc('害', a.position, b.position),
          });
        }
      }
    }
  }
  return results;
}

/** 破を検出 */
function findHa(
  entries: { branch: Junishi; position: PillarName }[],
): ChishiRelation[] {
  const results: ChishiRelation[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      for (const [x, y] of HA) {
        if ((a.branch === x && b.branch === y) || (a.branch === y && b.branch === x)) {
          const key = pairKey(x, y);
          results.push({
            type: '破',
            branches: [a.branch, b.branch],
            positions: [a.position, b.position],
            description: HA_DESCRIPTIONS[key] ?? `${a.branch}${b.branch}の破が命式に存在します。`,
            pillarDesc: getPillarDesc('破', a.position, b.position),
          });
        }
      }
    }
  }
  return results;
}

// ============================================================
// サマリー生成
// ============================================================

function buildSummary(relations: ChishiRelation[]): string {
  if (relations.length === 0) {
    return '地支の間に特別な衝突や結合の関係は見られず、穏やかで安定した命式です。自分のペースで着実に歩みを進めることで、自然と運気が高まっていくでしょう。';
  }

  const typeCounts: Record<string, number> = {};
  for (const r of relations) {
    typeCounts[r.type] = (typeCounts[r.type] ?? 0) + 1;
  }

  const parts: string[] = [];

  // 吉の要素
  const gouCount = (typeCounts['支合'] ?? 0) + (typeCounts['三合'] ?? 0);
  if (gouCount > 0) {
    parts.push('地支に合の力が働き、人間関係や協力運に恵まれています');
  }

  // 凶の要素
  const chuCount = typeCounts['冲'] ?? 0;
  if (chuCount > 0) {
    parts.push('冲による変動の気があり、変化の多い人生となりやすい傾向があります');
  }

  const keiCount = typeCounts['刑'] ?? 0;
  if (keiCount > 0) {
    parts.push('刑の影響で試練を通じた成長が促される命式です');
  }

  const gaiCount = typeCounts['害'] ?? 0;
  const haCount = typeCounts['破'] ?? 0;
  if (gaiCount + haCount > 0) {
    parts.push('害や破の配置から、慎重さと柔軟な対応力が求められます');
  }

  // 吉凶混合
  if (gouCount > 0 && (chuCount + keiCount + gaiCount + haCount) > 0) {
    parts.push('吉凶が入り混じる命式ですが、合の力を活かし困難を乗り越えられるでしょう');
  }

  // 文字数調整（100-150字に収める）
  let summary = parts.join('。') + '。';
  if (summary.length < 100) {
    summary += '全体として変化と成長の可能性を秘めた命式であり、自らの意志で運命を切り拓いていく力を持っています。';
  }

  return summary;
}

// ============================================================
// メイン分析関数
// ============================================================

/**
 * 四柱の全地支から冲・支合・三合・刑・害・破を分析する
 */
export function analyzeChishiRelations(fourPillars: FourPillars): ChishiRelationResult {
  const entries = extractBranches(fourPillars);

  const relations: ChishiRelation[] = [
    ...findChu(entries),
    ...findShigou(entries),
    ...findSangou(entries),
    ...findKei(entries),
    ...findGai(entries),
    ...findHa(entries),
  ];

  return {
    relations,
    summary: buildSummary(relations),
  };
}
