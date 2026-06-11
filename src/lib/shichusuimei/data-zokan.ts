import type { Junishi, Jikkan } from './types';

// 蔵干完全版（本気・中気・余気）
export interface ZokanEntry {
  honki: Jikkan;          // 本気（主気）
  chuki: Jikkan | null;   // 中気
  yoki: Jikkan | null;    // 余気
}

// リサーチ検証済み（starcrawler.net / 複数文献照合）
// 順序: 本気（最も強い主気）→ 中気 → 余気（最も弱い）
// 卯・酉・子は旺支のため中気なし（本気と余気のみ、または本気のみ）
// 午の己、亥の戊は流派差あり（ここでは採用）
export const ZOKAN_FULL: Record<Junishi, ZokanEntry> = {
  '子': { honki: '癸', chuki: null,  yoki: '壬' },
  '丑': { honki: '己', chuki: '辛', yoki: '癸' },
  '寅': { honki: '甲', chuki: '丙', yoki: '戊' },
  '卯': { honki: '乙', chuki: null,  yoki: '甲' },
  '辰': { honki: '戊', chuki: '癸', yoki: '乙' },
  '巳': { honki: '丙', chuki: '庚', yoki: '戊' },
  '午': { honki: '丁', chuki: '己', yoki: '丙' },
  '未': { honki: '己', chuki: '乙', yoki: '丁' },
  '申': { honki: '庚', chuki: '壬', yoki: '戊' },
  '酉': { honki: '辛', chuki: null,  yoki: '庚' },
  '戌': { honki: '戊', chuki: '丁', yoki: '辛' },
  '亥': { honki: '壬', chuki: '甲', yoki: '戊' },
};

// 蔵干を配列で取得（null除外済み）
export function getZokanList(shi: Junishi): Jikkan[] {
  const entry = ZOKAN_FULL[shi];
  const result: Jikkan[] = [entry.honki];
  if (entry.chuki) result.push(entry.chuki);
  if (entry.yoki) result.push(entry.yoki);
  return result;
}
