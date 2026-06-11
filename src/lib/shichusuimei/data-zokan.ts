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

// 蔵干優勢日数（余気→中気→本気の順で月内を進行）
export interface ZokanDayRange {
  kan: Jikkan;
  days: number;  // この蔵干が優勢な日数
  label: '余気' | '中気' | '本気';
}

// 節入りからの経過日数に応じて優勢な蔵干が切り替わる
// 順序: 余気（月初）→ 中気 → 本気（月末）
// 卯・酉・子は中気なし（余気→本気の2段階）
// 各地支の合計日数は30日
export const ZOKAN_DAY_RANGES: Record<Junishi, ZokanDayRange[]> = {
  '子': [
    { kan: '壬', days: 10, label: '余気' },
    { kan: '癸', days: 20, label: '本気' },
  ],
  '丑': [
    { kan: '癸', days: 9,  label: '余気' },
    { kan: '辛', days: 3,  label: '中気' },
    { kan: '己', days: 18, label: '本気' },
  ],
  '寅': [
    { kan: '戊', days: 7,  label: '余気' },
    { kan: '丙', days: 7,  label: '中気' },
    { kan: '甲', days: 16, label: '本気' },
  ],
  '卯': [
    { kan: '甲', days: 10, label: '余気' },
    { kan: '乙', days: 20, label: '本気' },
  ],
  '辰': [
    { kan: '乙', days: 9,  label: '余気' },
    { kan: '癸', days: 3,  label: '中気' },
    { kan: '戊', days: 18, label: '本気' },
  ],
  '巳': [
    { kan: '戊', days: 7,  label: '余気' },
    { kan: '庚', days: 7,  label: '中気' },
    { kan: '丙', days: 16, label: '本気' },
  ],
  '午': [
    { kan: '丙', days: 10, label: '余気' },
    { kan: '己', days: 9,  label: '中気' },  // ※流派差あり
    { kan: '丁', days: 11, label: '本気' },
  ],
  '未': [
    { kan: '丁', days: 9,  label: '余気' },
    { kan: '乙', days: 3,  label: '中気' },
    { kan: '己', days: 18, label: '本気' },
  ],
  '申': [
    { kan: '戊', days: 7,  label: '余気' },
    { kan: '壬', days: 7,  label: '中気' },
    { kan: '庚', days: 16, label: '本気' },
  ],
  '酉': [
    { kan: '庚', days: 10, label: '余気' },
    { kan: '辛', days: 20, label: '本気' },
  ],
  '戌': [
    { kan: '辛', days: 9,  label: '余気' },
    { kan: '丁', days: 3,  label: '中気' },
    { kan: '戊', days: 18, label: '本気' },
  ],
  '亥': [
    { kan: '戊', days: 7,  label: '余気' },
    { kan: '甲', days: 5,  label: '中気' },
    { kan: '壬', days: 18, label: '本気' },
  ],
};

/**
 * 月内の日数から優勢な蔵干を取得
 * @param shi 地支
 * @param dayInMonth 節入りからの日数（1-30）
 * @returns 優勢な蔵干の天干
 */
export function getDominantZokan(shi: Junishi, dayInMonth: number): Jikkan {
  const ranges = ZOKAN_DAY_RANGES[shi];
  let accumulated = 0;
  for (const range of ranges) {
    accumulated += range.days;
    if (dayInMonth <= accumulated) {
      return range.kan;
    }
  }
  // 範囲外の場合は本気（最後のエントリ）を返す
  return ranges[ranges.length - 1].kan;
}
