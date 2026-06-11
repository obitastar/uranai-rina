import type { Jikkan, Gogyo } from './types';
import { kanGogyo } from './gogyo';

export interface LuckyData {
  colors: string[];        // ラッキーカラー（2-3色）
  items: string[];         // ラッキーアイテム（2-3個）
  numbers: number[];       // ラッキーナンバー（2個）
  direction: string;       // ラッキー方位
  season: string;          // ラッキーシーズン
  description: string;     // ラッキーポイント説明
}

// 五行 → ラッキーカラー対応
const GOGYO_COLORS: Record<Gogyo, string[]> = {
  '木': ['緑', '青緑'],
  '火': ['赤', 'オレンジ', 'ピンク'],
  '土': ['黄', 'ベージュ', '茶'],
  '金': ['白', 'シルバー', 'ゴールド'],
  '水': ['黒', 'ネイビー', '紺'],
};

// 五行 → 方位
const GOGYO_DIRECTION: Record<Gogyo, string> = {
  '木': '東',
  '火': '南',
  '土': '中央（南西・北東）',
  '金': '西',
  '水': '北',
};

// 五行 → 季節
const GOGYO_SEASON: Record<Gogyo, string> = {
  '木': '春（3〜5月）',
  '火': '夏（6〜8月）',
  '土': '季節の変わり目（土用）',
  '金': '秋（9〜11月）',
  '水': '冬（12〜2月）',
};

// 日主を助ける五行（印星の五行）
// 木←水、火←木、土←火、金←土、水←金
const INSEI_GOGYO: Record<Gogyo, Gogyo> = {
  '木': '水',
  '火': '木',
  '土': '火',
  '金': '土',
  '水': '金',
};

// 十干ごとの詳細データ
const LUCKY_BY_JIKKAN: Record<Jikkan, { items: string[]; numbers: number[]; description: string }> = {
  '甲': {
    items: ['観葉植物', '木製アクセサリー', '手帳'],
    numbers: [1, 6],
    description: '大樹のように堂々と。水の気を持つ深い色合いのアイテムがあなたの成長を後押しします',
  },
  '乙': {
    items: ['花束', 'ハーブティー', 'シルクのスカーフ'],
    numbers: [2, 6],
    description: '草花のようにしなやかに。水の気を持つ流れるようなデザインのアイテムが幸運を呼びます',
  },
  '丙': {
    items: ['キャンドル', '観葉植物', 'リネンのハンカチ'],
    numbers: [3, 8],
    description: '太陽のように明るく。木の気を持つ自然素材のアイテムがあなたのエネルギーを高めます',
  },
  '丁': {
    items: ['アロマオイル', '竹製の小物', '読書灯'],
    numbers: [4, 8],
    description: '灯火のように温かく。木の気を持つナチュラルなアイテムが心を穏やかに保ちます',
  },
  '戊': {
    items: ['陶器のカップ', 'キャンドルホルダー', '赤い小物入れ'],
    numbers: [5, 7],
    description: '山のようにどっしりと。火の気を持つ温かみのあるアイテムがあなたの安定感を強めます',
  },
  '己': {
    items: ['テラコッタの鉢', 'お香セット', 'ピンクの花'],
    numbers: [0, 7],
    description: '大地のように包容力を。火の気を持つ華やかなアイテムがあなたの魅力を引き出します',
  },
  '庚': {
    items: ['天然石のブレスレット', '陶磁器', 'レザーの名刺入れ'],
    numbers: [5, 9],
    description: '鉄のように強く。土の気を持つ重厚感のあるアイテムがあなたの決断力を支えます',
  },
  '辛': {
    items: ['パールのアクセサリー', '砂時計', 'クリスタルグラス'],
    numbers: [0, 9],
    description: '宝石のように繊細に。土の気を持つ落ち着いたアイテムがあなたの品格を高めます',
  },
  '壬': {
    items: ['シルバーリング', '金属製のペン', '白い磁器'],
    numbers: [1, 4],
    description: '大河のように悠々と。金の気を持つ上品なアイテムがあなたの知恵を冴えさせます',
  },
  '癸': {
    items: ['ガラスの小瓶', 'プラチナの小物', '白いハンカチ'],
    numbers: [2, 4],
    description: '雨露のように潤いを。金の気を持つ清らかなアイテムがあなたの感性を磨きます',
  },
};

// 日主からラッキーデータを取得
export function getLuckyData(nicchu: Jikkan): LuckyData {
  const myGogyo = kanGogyo(nicchu);
  const helpGogyo = INSEI_GOGYO[myGogyo];
  const jikkanData = LUCKY_BY_JIKKAN[nicchu];

  return {
    colors: GOGYO_COLORS[helpGogyo],
    items: jikkanData.items,
    numbers: jikkanData.numbers,
    direction: GOGYO_DIRECTION[helpGogyo],
    season: GOGYO_SEASON[helpGogyo],
    description: jikkanData.description,
  };
}
