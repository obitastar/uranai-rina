import { JIKKAN, TSUHENSEI, JUNIUNSEI, type Jikkan, type Junishi, type Tsuhensei, type Juniunsei } from './types';
import { kanGogyo, kanInyo, zokanHonki } from './gogyo';

/**
 * 通変星を求める
 * 日主(nicchu)から見た他の天干(target)の関係
 */
export function getTsuhensei(nicchu: Jikkan, target: Jikkan): Tsuhensei {
  const nichuIdx = JIKKAN.indexOf(nicchu);
  const targetIdx = JIKKAN.indexOf(target);
  // 日主からの相対位置で通変星が決まる
  const diff = ((targetIdx - nichuIdx) % 10 + 10) % 10;
  return TSUHENSEI[diff];
}

/**
 * 蔵干通変星（地支の本気から通変星を求める）
 */
export function getZokanTsuhensei(nicchu: Jikkan, shi: Junishi): Tsuhensei {
  const honki = zokanHonki(shi);
  return getTsuhensei(nicchu, honki);
}

/**
 * 十二運を求める
 * 日主の天干が各地支でどの段階にあるか
 */
const JUNIUNSEI_TABLE: Record<Jikkan, Juniunsei[]> = {
  // 各天干の十二運（子から亥の順）
  '甲': ['沐浴', '冠帯', '建禄', '帝旺', '衰', '病', '死', '墓', '絶', '胎', '養', '長生'],
  '乙': ['病', '衰', '帝旺', '建禄', '冠帯', '沐浴', '長生', '養', '胎', '絶', '墓', '死'],
  '丙': ['胎', '養', '長生', '沐浴', '冠帯', '建禄', '帝旺', '衰', '病', '死', '墓', '絶'],
  '丁': ['絶', '墓', '死', '病', '衰', '帝旺', '建禄', '冠帯', '沐浴', '長生', '養', '胎'],
  '戊': ['胎', '養', '長生', '沐浴', '冠帯', '建禄', '帝旺', '衰', '病', '死', '墓', '絶'],
  '己': ['絶', '墓', '死', '病', '衰', '帝旺', '建禄', '冠帯', '沐浴', '長生', '養', '胎'],
  '庚': ['死', '墓', '絶', '胎', '養', '長生', '沐浴', '冠帯', '建禄', '帝旺', '衰', '病'],
  '辛': ['長生', '養', '胎', '絶', '墓', '死', '病', '衰', '帝旺', '建禄', '冠帯', '沐浴'],
  '壬': ['帝旺', '衰', '病', '死', '墓', '絶', '胎', '養', '長生', '沐浴', '冠帯', '建禄'],
  '癸': ['建禄', '冠帯', '沐浴', '長生', '養', '胎', '絶', '墓', '死', '病', '衰', '帝旺'],
};

const JUNISHI_ORDER: Junishi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export function getJuniunsei(nicchu: Jikkan, shi: Junishi): Juniunsei {
  const shiIdx = JUNISHI_ORDER.indexOf(shi);
  return JUNIUNSEI_TABLE[nicchu][shiIdx];
}
