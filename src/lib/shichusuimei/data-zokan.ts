import type { Junishi, Jikkan } from './types';

// 蔵干完全版（本気・中気・余気）
export interface ZokanEntry {
  honki: Jikkan;          // 本気（主気）
  chuki: Jikkan | null;   // 中気
  yoki: Jikkan | null;    // 余気
}

export const ZOKAN_FULL: Record<Junishi, ZokanEntry> = {
  '子': { honki: '癸', chuki: null,  yoki: null },
  '丑': { honki: '己', chuki: '癸', yoki: '辛' },
  '寅': { honki: '甲', chuki: '丙', yoki: '戊' },
  '卯': { honki: '乙', chuki: null,  yoki: null },
  '辰': { honki: '戊', chuki: '乙', yoki: '癸' },
  '巳': { honki: '丙', chuki: '庚', yoki: '戊' },
  '午': { honki: '丁', chuki: '己', yoki: null },
  '未': { honki: '己', chuki: '丁', yoki: '乙' },
  '申': { honki: '庚', chuki: '壬', yoki: '戊' },
  '酉': { honki: '辛', chuki: null,  yoki: null },
  '戌': { honki: '戊', chuki: '辛', yoki: '丁' },
  '亥': { honki: '壬', chuki: '甲', yoki: null },
};

// 蔵干を配列で取得（null除外済み）
export function getZokanList(shi: Junishi): Jikkan[] {
  const entry = ZOKAN_FULL[shi];
  const result: Jikkan[] = [entry.honki];
  if (entry.chuki) result.push(entry.chuki);
  if (entry.yoki) result.push(entry.yoki);
  return result;
}
