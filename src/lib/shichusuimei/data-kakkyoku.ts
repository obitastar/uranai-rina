import type { Jikkan, Junishi, FourPillars, Tsuhensei, Gogyo } from './types';
import { kanGogyo, kanInyo, zokanHonki } from './gogyo';
import { getTsuhensei } from './stars';

// ============================================================
// 格局（kakkyoku）判定
// ============================================================

export interface KakkyokuResult {
  name: string;           // 格局名 e.g. '正官格'
  category: '内格' | '外格';
  description: string;    // 説明（30-50字）
  reading: string;        // 鑑定文（80-120字）
  strength: string;       // 強み（30-50字）
  weakness: string;       // 弱み（30-50字）
}

// --- 建禄・羊刃テーブル ---

/** 日主 → 建禄となる月支 */
const KENROKU_MAP: Record<Jikkan, Junishi> = {
  '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳',
  '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子',
};

/** 日主（陽干のみ） → 羊刃となる月支 */
const YOUJIN_MAP: Partial<Record<Jikkan, Junishi>> = {
  '甲': '卯', '丙': '午', '戊': '午', '庚': '酉', '壬': '子',
};

// --- 格局データ ---

interface KakkyokuData {
  description: string;
  reading: string;
  strength: string;
  weakness: string;
}

const NAIKAKU_DATA: Record<string, KakkyokuData> = {
  '建禄格': {
    description: '日主と同じ気が月支に根を持ち、自立心に溢れる命式です。',
    reading: '生まれながらに自分の力で道を切り拓く星の下にあります。独立独歩の精神が強く、他人に頼らずとも着実に成果を積み上げることができる方です。信念を持って進む姿が周囲の信頼を集めます。',
    strength: '自立心が強く、困難に負けない粘り強さを持っています。',
    weakness: '頑固になりやすく、人の助言を受け入れにくい面があります。',
  },
  '羊刃格': {
    description: '日主の勢いが極まる月支を持ち、強烈な個性と行動力の命式です。',
    reading: '内に秘めたエネルギーが人一倍強く、決断力と実行力に優れた星回りです。困難な局面でこそ真価を発揮し、リーダーとして周囲を引っ張る力があります。その激しさを良い方向に使うことが開運の鍵です。',
    strength: '圧倒的な行動力と決断力で、周囲を牽引する力を持ちます。',
    weakness: '感情の起伏が激しく、衝動的な判断をしやすい傾向があります。',
  },
  '食神格': {
    description: '食神が月令を得ており、温和で才能豊かな表現者の命式です。',
    reading: '穏やかな人柄の中に確かな才能が宿る星回りです。食を通じた楽しみや、芸術・表現の分野で力を発揮します。人を和ませる天性の魅力があり、自然体でいることが最も大きな財産となります。',
    strength: '創造性と表現力に富み、人を楽しませる天性の才があります。',
    weakness: '安逸に流れやすく、厳しい環境では力を発揮しにくい面があります。',
  },
  '傷官格': {
    description: '傷官が月令を得ており、鋭い感性と知性が際立つ命式です。',
    reading: '鋭い洞察力と繊細な感性を併せ持つ星回りです。既存の枠組みに収まらない発想力があり、専門分野で卓越した成果を上げる力があります。その才能を社会に活かす道を見つけたとき、大きく花開きます。',
    strength: '分析力と発想力に優れ、専門分野で突出した才能を発揮します。',
    weakness: 'プライドが高く、対人関係で摩擦を生みやすい傾向があります。',
  },
  '偏財格': {
    description: '偏財が月令を得ており、社交的で商才に恵まれた命式です。',
    reading: '人との縁を財に変える才覚を持つ星回りです。広い人脈と柔軟な発想で、流動的な財を巧みに扱います。固定観念にとらわれない自由な金銭感覚が、事業や投資で大きなチャンスを引き寄せます。',
    strength: '社交性と商才に恵まれ、人脈を活かした活動が得意です。',
    weakness: '金銭の出入りが激しく、浪費や投機に走りやすい面があります。',
  },
  '正財格': {
    description: '正財が月令を得ており、堅実で信頼される誠実な命式です。',
    reading: '着実に財を築く堅実さと誠実さを兼ね備えた星回りです。コツコツと努力を重ね、信用を積み上げていく姿勢が最大の武器となります。地道な歩みがやがて大きな実りとなって返ってくるでしょう。',
    strength: '堅実で計画的な行動力があり、周囲から厚い信頼を得ます。',
    weakness: '慎重すぎて好機を逃したり、変化を恐れる傾向があります。',
  },
  '偏官格': {
    description: '偏官が月令を得ており、行動力と統率力に秀でた命式です。',
    reading: '強い意志と行動力で道を切り拓く武将のような星回りです。権威や権力に臆せず立ち向かう胆力があり、組織の中でも実力で地位を勝ち取ります。その力を正しい方向に向けることで、大きな功績を残せます。',
    strength: '統率力と実行力に優れ、困難な状況でも突破する力があります。',
    weakness: '強引になりがちで、周囲との衝突を招くことがあります。',
  },
  '正官格': {
    description: '正官が月令を得ており、品格と責任感を備えた王道の命式です。',
    reading: '正道を歩む品格と責任感を備えた、最も正統な星回りの一つです。社会的な信用を得やすく、組織の中で着実に昇進していく力があります。規律と秩序を重んじる姿勢が、自然と人望を集めます。',
    strength: '品格と責任感があり、社会的な信用と地位を得やすい星です。',
    weakness: '型にはまりやすく、柔軟な対応や冒険が苦手な面があります。',
  },
  '偏印格': {
    description: '偏印が月令を得ており、独創的な知性と探究心の命式です。',
    reading: '常識にとらわれない独自の視点と探究心を持つ星回りです。学問・研究・技術など、専門的な分野で独創的な成果を上げる力があります。他の人が気づかない本質を見抜く洞察力が、唯一無二の存在感を生みます。',
    strength: '独創的な発想力と深い探究心で、専門分野に強みを発揮します。',
    weakness: '考えすぎて行動が遅れたり、孤立しやすい面があります。',
  },
  '印綬格': {
    description: '印綬が月令を得ており、知性と学識に恵まれた命式です。',
    reading: '深い知性と学識を備え、物事の道理を自然に理解できる星回りです。教育・学問・文化の分野で才能を発揮しやすく、目上の引き立てにも恵まれます。知識を社会に還元することで、さらに運が開けていきます。',
    strength: '知性と学識に恵まれ、目上からの引き立てを受けやすい星です。',
    weakness: '理論に偏りすぎて実践が伴わない場合があります。',
  },
};

const GAIKAKU_DATA: Record<string, KakkyokuData> = {
  '従旺格': {
    description: '日主の五行が命式を圧倒的に支配する、極めて強い自我の命式です。',
    reading: '命式全体が日主の力で満たされた、稀有な星回りです。自分自身の力を信じ、独自の道を突き進むことで大きな成功を掴みます。他者と競わず、自分の世界を極めることが天命です。比劫・印星の力が味方となります。',
    strength: '圧倒的な自信と自立心で、独自の世界を築く力があります。',
    weakness: '協調性に欠け、自分の考えに固執しすぎる傾向があります。',
  },
  '従児格': {
    description: '食傷の気が命式を支配し、表現と創造に生きる命式です。',
    reading: '表現と創造の星に全身を委ねた、芸術家肌の星回りです。自分の才能を惜しみなく発揮し、世の中に新しい価値を届けることが使命です。食傷の流れに逆らわず、自由に表現することで運が大きく開けます。',
    strength: '卓越した表現力と創造性で、芸術や技術の分野で輝きます。',
    weakness: '現実的な判断が苦手で、生活面で不安定になりやすい面があります。',
  },
  '従財格': {
    description: '財の気が命式を支配し、財運と人脈に恵まれた命式です。',
    reading: '財の星に身を委ねた、商売や事業に適性のある星回りです。大きな財の流れの中で自然と富を引き寄せる力があります。欲張らず、財の流れに逆らわないことが成功の秘訣です。人との縁が財を運んできます。',
    strength: '財運に恵まれ、事業や商売で大きな成果を上げる力があります。',
    weakness: '自分の軸を見失いやすく、金銭に振り回される恐れがあります。',
  },
  '従殺格': {
    description: '官殺の気が命式を支配し、権力と地位に縁のある命式です。',
    reading: '官殺の力に身を委ねた、権威ある地位に就きやすい星回りです。組織の中で力を発揮し、与えられた役割を全うすることで大きく出世します。権力に逆らわず、実力で認められる道を歩むことが開運の道です。',
    strength: '権力構造の中で力を発揮し、高い地位を得る運を持ちます。',
    weakness: '主体性を失いやすく、権力者に依存する傾向があります。',
  },
  '従勢格': {
    description: '食傷・財・官殺が組み合わさり、時流に乗る力を持つ命式です。',
    reading: '時代の流れを読み、その勢いに乗ることで成功を掴む星回りです。固定的な生き方よりも、変化する環境に柔軟に適応する力が最大の武器です。世の中の動きに敏感であり続けることが開運の鍵となります。',
    strength: '時流を読む力と適応力に優れ、変化をチャンスに変えられます。',
    weakness: '自分の信念が定まりにくく、流されやすい面があります。',
  },
};

// --- 通変星の分類 ---

type TsuhenseiCategory = '比劫' | '食傷' | '財' | '官殺' | '印';

function categorizeTsuhensei(ts: Tsuhensei): TsuhenseiCategory {
  switch (ts) {
    case '比肩': case '劫財': return '比劫';
    case '食神': case '傷官': return '食傷';
    case '偏財': case '正財': return '財';
    case '偏官': case '正官': return '官殺';
    case '偏印': case '印綬': return '印';
  }
}

// --- 外格判定 ---

/**
 * 命式中の全要素（天干3つ + 地支蔵干本気4つ、日主除く）の通変星カテゴリを集計し、
 * 外格に該当するか判定する。
 */
function checkGaikaku(
  nicchu: Jikkan,
  fourPillars: FourPillars,
): string | null {
  // 天干: 年干・月干・時干（日干は日主なので除外）
  const kans: Jikkan[] = [
    fourPillars.year.kan,
    fourPillars.month.kan,
  ];
  if (fourPillars.hour) {
    kans.push(fourPillars.hour.kan);
  }

  // 地支蔵干本気: 年支・月支・日支・時支
  const shiHonkis: Jikkan[] = [
    zokanHonki(fourPillars.year.shi),
    zokanHonki(fourPillars.month.shi),
    zokanHonki(fourPillars.day.shi),
  ];
  if (fourPillars.hour) {
    shiHonkis.push(zokanHonki(fourPillars.hour.shi));
  }

  // 全要素の通変星カテゴリを集計
  const allElements = [...kans, ...shiHonkis];
  const categories = allElements.map(k => categorizeTsuhensei(getTsuhensei(nicchu, k)));

  const total = categories.length; // 時柱ありなら7、なしなら5
  const counts: Record<TsuhenseiCategory, number> = {
    '比劫': 0, '食傷': 0, '財': 0, '官殺': 0, '印': 0,
  };
  for (const cat of categories) {
    counts[cat]++;
  }

  // 従旺格: 比劫+印 が圧倒的（時柱なしでも比率で判定）
  const hijouIn = counts['比劫'] + counts['印'];
  if (total >= 7 && hijouIn >= 6) return '従旺格';
  if (total < 7 && hijouIn >= 4) return '従旺格';

  // 従児格: 食傷が圧倒的
  const shokushouThreshold = total >= 7 ? 5 : 4;
  if (counts['食傷'] >= shokushouThreshold) return '従児格';

  // 従財格: 財が圧倒的
  const zaiThreshold = total >= 7 ? 5 : 4;
  if (counts['財'] >= zaiThreshold) return '従財格';

  // 従殺格: 官殺が圧倒的
  const kansatsuThreshold = total >= 7 ? 5 : 4;
  if (counts['官殺'] >= kansatsuThreshold) return '従殺格';

  // 従勢格: 食傷+財+官殺の合計が圧倒的
  const juuseiTotal = counts['食傷'] + counts['財'] + counts['官殺'];
  const juseiThreshold = total >= 7 ? 6 : 4;
  if (juuseiTotal >= juseiThreshold) return '従勢格';

  return null;
}

// --- 内格判定 ---

function determineNaikaku(nicchu: Jikkan, monthShi: Junishi): string {
  const monthZokanHonki = zokanHonki(monthShi);
  const tsuhensei = getTsuhensei(nicchu, monthZokanHonki);

  // 比肩・劫財の場合は建禄格か羊刃格か判定
  if (tsuhensei === '比肩' || tsuhensei === '劫財') {
    // 羊刃格チェック（陽干のみ）
    if (kanInyo(nicchu) === '陽') {
      const youjinShi = YOUJIN_MAP[nicchu];
      if (youjinShi && monthShi === youjinShi) {
        return '羊刃格';
      }
    }
    // 建禄格チェック
    if (monthShi === KENROKU_MAP[nicchu]) {
      return '建禄格';
    }
    // 陰干で劫財の場合など、建禄でも羊刃でもないケースは建禄格として扱う
    return '建禄格';
  }

  // それ以外は通変星がそのまま格局名
  return `${tsuhensei}格`;
}

// --- メインの判定関数 ---

/**
 * 格局を判定する。
 * 1. まず外格（従格）の条件をチェック
 * 2. 外格でなければ、月支蔵干本気から内格を判定
 */
export function analyzeKakkyoku(
  nicchu: Jikkan,
  fourPillars: FourPillars,
): KakkyokuResult {
  // 1. 外格チェック
  const gaikakuName = checkGaikaku(nicchu, fourPillars);
  if (gaikakuName) {
    const data = GAIKAKU_DATA[gaikakuName];
    return {
      name: gaikakuName,
      category: '外格',
      description: data.description,
      reading: data.reading,
      strength: data.strength,
      weakness: data.weakness,
    };
  }

  // 2. 内格判定
  const naikakuName = determineNaikaku(nicchu, fourPillars.month.shi);
  const data = NAIKAKU_DATA[naikakuName];
  return {
    name: naikakuName,
    category: '内格',
    description: data.description,
    reading: data.reading,
    strength: data.strength,
    weakness: data.weakness,
  };
}
