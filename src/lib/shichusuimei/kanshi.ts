import { JIKKAN, JUNISHI, type Kanshi } from './types';
export type { Kanshi } from './types';

// 六十干支テーブル生成
export function getKanshi(index: number): Kanshi {
  const i = ((index % 60) + 60) % 60;
  return {
    kan: JIKKAN[i % 10],
    shi: JUNISHI[i % 12],
    index: i,
  };
}

// 六十干支の名前から検索
export function kanshiFromName(kan: string, shi: string): Kanshi {
  const kanIdx = JIKKAN.indexOf(kan as any);
  const shiIdx = JUNISHI.indexOf(shi as any);
  if (kanIdx === -1 || shiIdx === -1) {
    throw new Error(`無効な干支: ${kan}${shi}`);
  }
  // 六十干支のインデックスを求める
  // kanIdx % 2 === shiIdx % 2 でなければ無効な組み合わせ
  for (let i = 0; i < 60; i++) {
    if (i % 10 === kanIdx && i % 12 === shiIdx) {
      return { kan: JIKKAN[kanIdx], shi: JUNISHI[shiIdx], index: i };
    }
  }
  throw new Error(`無効な干支の組み合わせ: ${kan}${shi}`);
}

// 干支の表示名
export function kanshiName(k: Kanshi | null): string {
  if (!k) return '---';
  return `${k.kan}${k.shi}`;
}

// 全六十干支
export const ALL_KANSHI: Kanshi[] = Array.from({ length: 60 }, (_, i) => getKanshi(i));
