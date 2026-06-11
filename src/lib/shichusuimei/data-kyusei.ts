// ============================================================
// 九星気学データ
// 生年月日から本命星を算出し、九星の属性データを返す
// ============================================================

export interface KyuseiData {
  number: number;          // 1-9
  name: string;            // 例: "一白水星"
  gogyo: string;           // 五行
  colors: string[];        // ラッキーカラー
  luckyNumbers: number[];  // ラッキーナンバー
  luckyDirections: string[]; // 吉方位
  personality: string;     // 基本性格（30-50字）
}

const KYUSEI_TABLE: KyuseiData[] = [
  {
    number: 1,
    name: '一白水星',
    gogyo: '水',
    colors: ['白', '黒', '青'],
    luckyNumbers: [1, 6],
    luckyDirections: ['南東', '東'],
    personality: '柔軟で適応力が高く、人当たりの穏やかな知恵者。内に秘めた芯の強さで静かに道を切り拓きます。',
  },
  {
    number: 2,
    name: '二黒土星',
    gogyo: '土',
    colors: ['黄', '茶', '黒'],
    luckyNumbers: [5, 0],
    luckyDirections: ['北東', '南西'],
    personality: '堅実で忍耐強く、縁の下の力持ち。地道な努力を積み重ねて信頼を築き、晩年に大きく花開くタイプです。',
  },
  {
    number: 3,
    name: '三碧木星',
    gogyo: '木',
    colors: ['青', '緑', '碧'],
    luckyNumbers: [3, 8],
    luckyDirections: ['南', '南東'],
    personality: '明るく行動力に溢れるパイオニア。新しい挑戦が大好きで、持ち前の発信力で周囲を巻き込む力があります。',
  },
  {
    number: 4,
    name: '四緑木星',
    gogyo: '木',
    colors: ['緑', '青', '橙'],
    luckyNumbers: [3, 8],
    luckyDirections: ['南', '北'],
    personality: '穏やかな人柄で調和を重んじる外交家。人との縁に恵まれ、信頼関係を軸に幸運を引き寄せます。',
  },
  {
    number: 5,
    name: '五黄土星',
    gogyo: '土',
    colors: ['黄', '金', '茶'],
    luckyNumbers: [5, 0],
    luckyDirections: ['西', '北西'],
    personality: '強い意志と圧倒的な存在感を持つ帝王の星。逆境に強く、困難を乗り越えるほどに器が大きくなります。',
  },
  {
    number: 6,
    name: '六白金星',
    gogyo: '金',
    colors: ['白', '銀', '金'],
    luckyNumbers: [4, 9],
    luckyDirections: ['南東', '東'],
    personality: '気品と責任感に溢れるリーダー気質。完璧主義で高い理想を掲げ、それを実現する行動力も備えています。',
  },
  {
    number: 7,
    name: '七赤金星',
    gogyo: '金',
    colors: ['ピンク', '白', '金'],
    luckyNumbers: [4, 9],
    luckyDirections: ['北東', '南'],
    personality: '社交的で話術に長けた愛されキャラ。楽しいことが大好きで、場を明るくする天性の魅力を持っています。',
  },
  {
    number: 8,
    name: '八白土星',
    gogyo: '土',
    colors: ['白', '黄', '赤'],
    luckyNumbers: [5, 0],
    luckyDirections: ['南西', '北西'],
    personality: '山のような安定感と粘り強さを持つ実力者。変化を恐れず改革を推し進め、着実に成果を積み上げます。',
  },
  {
    number: 9,
    name: '九紫火星',
    gogyo: '火',
    colors: ['赤', '紫', '橙'],
    luckyNumbers: [2, 7],
    luckyDirections: ['東', '南東'],
    personality: '華やかで知的好奇心旺盛な情熱家。美意識が高く、芸術やファッションなど美の分野で才能を発揮します。',
  },
];

/**
 * 生年月日から本命星を算出して九星データを返す
 * 立春（通常2月4日）前は前年で計算
 * ※立春は年によって2/3〜2/4で変動するが、簡易的に2/4を基準とする
 */
export function getKyusei(year: number, month: number, day: number): KyuseiData {
  // 立春前は前年扱い
  let effectiveYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }

  // 本命星番号 = ((11 - (年 % 9)) % 9) || 9
  const remainder = effectiveYear % 9;
  let starNumber = (11 - remainder) % 9;
  if (starNumber === 0) starNumber = 9;

  return KYUSEI_TABLE[starNumber - 1];
}
