// ============================================================
// 姓名判断 陰陽配列
// 姓名の各文字の画数の奇偶（陽=奇数、陰=偶数）から
// 陰陽バランスの吉凶を判定する。
// ============================================================

export type Inyo = '陽' | '陰';

export interface InyoResult {
  pattern: Inyo[];    // 各文字の陰陽
  kikkyo: '吉' | '半吉' | '凶';
  description: string; // 説明（40-60字）
}

// ルール:
// - 全て同じ（全陽/全陰）→ 凶
// - 陰陽が交互 → 吉（最良）
// - 姓の末尾と名の先頭が異なる → 吉
// - 姓の末尾と名の先頭が同じ → やや注意
// - バランスよく混ざっている → 吉

/**
 * 画数を陰陽に変換する。奇数=陽、偶数=陰。
 */
function toInyo(stroke: number): Inyo {
  return stroke % 2 === 1 ? '陽' : '陰';
}

/**
 * すべて同じ陰陽かどうかを判定
 */
function isAllSame(pattern: Inyo[]): boolean {
  return pattern.every((p) => p === pattern[0]);
}

/**
 * 陰陽が完全に交互に並んでいるかどうかを判定
 */
function isAlternating(pattern: Inyo[]): boolean {
  for (let i = 1; i < pattern.length; i++) {
    if (pattern[i] === pattern[i - 1]) return false;
  }
  return true;
}

/**
 * 姓名の陰陽配列を分析する。
 *
 * @param seiStrokes 姓の各文字の画数
 * @param meiStrokes 名の各文字の画数
 */
export function analyzeInyoHairetu(
  seiStrokes: number[],
  meiStrokes: number[],
): InyoResult {
  const seiInyo = seiStrokes.map(toInyo);
  const meiInyo = meiStrokes.map(toInyo);
  const fullPattern: Inyo[] = [...seiInyo, ...meiInyo];

  // 文字数が1文字しかない場合は判定が限定的
  if (fullPattern.length < 2) {
    return {
      pattern: fullPattern,
      kikkyo: '半吉',
      description:
        '文字数が少なく陰陽配列の判定が限定的です。他の要素を重視して総合的に判断してください。',
    };
  }

  // 全て同じ → 凶
  if (isAllSame(fullPattern)) {
    if (fullPattern[0] === '陽') {
      return {
        pattern: fullPattern,
        kikkyo: '凶',
        description:
          'すべて陽に偏り、気が強くなりすぎます。対人関係で衝突しやすく、孤立を招きやすい配列です。',
      };
    }
    return {
      pattern: fullPattern,
      kikkyo: '凶',
      description:
        'すべて陰に偏り、消極的になりがちです。意志の弱さから物事が停滞しやすい配列です。',
    };
  }

  // 完全交互 → 吉（最良）
  if (isAlternating(fullPattern)) {
    return {
      pattern: fullPattern,
      kikkyo: '吉',
      description:
        '陰陽の調和が取れた理想的な配列です。人間関係も円滑で、バランスの良い運気を保てます。',
    };
  }

  // 姓の末尾と名の先頭の陰陽を比較
  const seiLast = seiInyo[seiInyo.length - 1];
  const meiFirst = meiInyo[0];

  // 陰陽の偏りを計算
  const yoCount = fullPattern.filter((p) => p === '陽').length;
  const inCount = fullPattern.filter((p) => p === '陰').length;
  const ratio = Math.min(yoCount, inCount) / fullPattern.length;

  // 姓末尾と名先頭が異なり、バランスが良い → 吉
  if (seiLast !== meiFirst && ratio >= 0.3) {
    return {
      pattern: fullPattern,
      kikkyo: '吉',
      description:
        '姓と名の境目で陰陽が切り替わり、良い流れを生みます。バランスが取れた安定感のある配列です。',
    };
  }

  // 姓末尾と名先頭が異なるが、偏りがある → 半吉
  if (seiLast !== meiFirst) {
    return {
      pattern: fullPattern,
      kikkyo: '半吉',
      description:
        '姓名の境で陰陽が切り替わるものの、全体にやや偏りがあります。意識的にバランスを取ると吉に転じます。',
    };
  }

  // 姓末尾と名先頭が同じだが、全体のバランスは良い → 半吉
  if (ratio >= 0.3) {
    return {
      pattern: fullPattern,
      kikkyo: '半吉',
      description:
        '姓と名の境で陰陽が重なり、やや流れが滞ります。全体のバランスは悪くないので大きな心配は不要です。',
    };
  }

  // 姓末尾と名先頭が同じで、偏りも大きい → 凶寄りの半吉
  return {
    pattern: fullPattern,
    kikkyo: '半吉',
    description:
      '陰陽の偏りがやや目立つ配列です。意識的に反対の気質を取り入れることで、運気のバランスが整います。',
  };
}
