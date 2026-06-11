// ============================================================
// 空亡（天中殺）データ
// 六十干支を6つの旬に分け、各旬で配置されない2つの地支が空亡
// ============================================================

import type { Junishi } from './types';

export interface KuubouData {
  pair: [Junishi, Junishi]; // 空亡の地支ペア
  junName: string;          // 旬の名前
  meaning: string;          // 空亡の意味（鑑定文）
  advice: string;           // 空亡期間の過ごし方
}

// 旬ごとの空亡データ（index 0=甲子旬 ... 5=甲寅旬）
const KUUBOU_TABLE: KuubouData[] = [
  {
    pair: ['戌', '亥'],
    junName: '甲子旬',
    meaning: '精神世界への感性が鋭く、目に見えないものを感じ取る力があります。家庭よりも社会の舞台で才能を発揮し、直感を活かした活躍が期待できるタイプです。',
    advice: '内面を見つめる時間を大切に。瞑想や芸術に触れると心が整います。',
  },
  {
    pair: ['申', '酉'],
    junName: '甲戌旬',
    meaning: '行動力に独自性があり、型破りな発想で新しい道を切り拓きます。伝統にとらわれず革新を好み、既成概念を壊すことで大きな成果を生み出す力を持っています。',
    advice: '自分だけのやり方を信じて進んで。周囲と違うことが強みになります。',
  },
  {
    pair: ['午', '未'],
    junName: '甲申旬',
    meaning: '人間関係に独特の距離感を持ち、群れずに実力で勝負する一匹狼タイプです。孤高でありながらも確かな実力を備え、いざという時に頼られる存在になります。',
    advice: '一人の時間で力を蓄え、必要な場面で発揮する緩急が鍵です。',
  },
  {
    pair: ['辰', '巳'],
    junName: '甲午旬',
    meaning: '現実を動かす力は強いものの、精神的な支えや理想を求め続ける傾向があります。理想と現実の間で葛藤しやすいですが、その葛藤こそが深みのある人生を作ります。',
    advice: '理想を手放さず、小さな一歩を積み重ねることで現実が追いつきます。',
  },
  {
    pair: ['寅', '卯'],
    junName: '甲辰旬',
    meaning: '柔軟な適応力と的確な決断力を兼ね備えています。慎重に見極めてから動くため失敗が少なく、どんな環境でもしなやかに力を発揮できる安定感があります。',
    advice: '変化を恐れず柔軟に対応を。新しい環境が成長のチャンスになります。',
  },
  {
    pair: ['子', '丑'],
    junName: '甲寅旬',
    meaning: '目上の引き立てに恵まれにくい分、自力で道を切り開く強さを持っています。苦労を糧にする底力があり、遅咲きでも着実に実力を積み上げて大成するタイプです。',
    advice: '焦らず自分のペースで。地道な努力が大きな花を咲かせます。',
  },
];

/**
 * 日柱の干支index(0-59)から空亡データを返す
 */
export function getKuubou(dayPillarIndex: number): KuubouData {
  const normalized = ((dayPillarIndex % 60) + 60) % 60;
  const junIndex = Math.floor(normalized / 10);
  return KUUBOU_TABLE[junIndex];
}

/**
 * 指定された地支が空亡ペアに該当するかを判定
 * @param kuubouPair 空亡の地支ペア
 * @param yearShi 判定対象の地支（年支など）
 */
export function isKuubouYear(kuubouPair: [Junishi, Junishi], yearShi: string): boolean {
  return kuubouPair[0] === yearShi || kuubouPair[1] === yearShi;
}
