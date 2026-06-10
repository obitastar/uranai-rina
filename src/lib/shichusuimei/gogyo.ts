import type { Jikkan, Junishi, Gogyo, Inyo } from './types';

// 天干 → 五行
const KAN_GOGYO: Record<Jikkan, Gogyo> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 天干 → 陰陽
const KAN_INYO: Record<Jikkan, Inyo> = {
  '甲': '陽', '乙': '陰',
  '丙': '陽', '丁': '陰',
  '戊': '陽', '己': '陰',
  '庚': '陽', '辛': '陰',
  '壬': '陽', '癸': '陰',
};

// 地支 → 五行
const SHI_GOGYO: Record<Junishi, Gogyo> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 地支 → 陰陽
const SHI_INYO: Record<Junishi, Inyo> = {
  '子': '陽', '丑': '陰', '寅': '陽', '卯': '陰',
  '辰': '陽', '巳': '陰', '午': '陽', '未': '陰',
  '申': '陽', '酉': '陰', '戌': '陽', '亥': '陰',
};

export function kanGogyo(kan: Jikkan): Gogyo {
  return KAN_GOGYO[kan];
}

export function kanInyo(kan: Jikkan): Inyo {
  return KAN_INYO[kan];
}

export function shiGogyo(shi: Junishi): Gogyo {
  return SHI_GOGYO[shi];
}

export function shiInyo(shi: Junishi): Inyo {
  return SHI_INYO[shi];
}

// 蔵干（地支に内蔵される天干）
// 各地支の本気（主気）のみ返す簡易版
const ZOKAN_HONKI: Record<Junishi, Jikkan> = {
  '子': '癸',
  '丑': '己',
  '寅': '甲',
  '卯': '乙',
  '辰': '戊',
  '巳': '丙',
  '午': '丁',
  '未': '己',
  '申': '庚',
  '酉': '辛',
  '戌': '戊',
  '亥': '壬',
};

export function zokanHonki(shi: Junishi): Jikkan {
  return ZOKAN_HONKI[shi];
}
