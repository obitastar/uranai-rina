import type { Gogyo, GogyoBalance } from './types';

export interface HealthData {
  organs: string[];        // 関連臓器
  bodyParts: string[];     // 関連する体の部位
  strongWarning: string;   // その五行が過多の場合の注意
  weakWarning: string;     // その五行が不足の場合の注意
  advice: string;          // 健康アドバイス
}

export const HEALTH_GOGYO: Record<Gogyo, HealthData> = {
  '木': {
    organs: ['肝臓', '胆のう'],
    bodyParts: ['目', '筋肉', '爪'],
    strongWarning:
      '肝臓に負担がかかりやすく、目の疲れやイライラに注意。飲酒は控えめにし、深呼吸でリラックスを心がけましょう',
    weakWarning:
      '筋力の低下や目の不調が出やすい時期。緑の野菜を積極的に摂り、適度なストレッチや散歩を習慣にしましょう',
    advice: '酸味のある食材や青魚を取り入れ、朝の散歩で気を巡らせましょう',
  },
  '火': {
    organs: ['心臓', '小腸'],
    bodyParts: ['舌', '血管', '顔色'],
    strongWarning:
      '心臓や血圧に注意が必要です。興奮しやすく不眠になりがち。辛い食べ物を控え、穏やかな時間を意識しましょう',
    weakWarning:
      '血行不良や冷えが出やすい傾向。体を温める食事を心がけ、適度に日光を浴びてエネルギーを補いましょう',
    advice: '苦味のある食材で心をクールダウン。紅茶やゴーヤがおすすめです',
  },
  '土': {
    organs: ['脾臓', '胃'],
    bodyParts: ['口', '唇', '肌'],
    strongWarning:
      '胃腸の働きが過敏になりやすく、食べ過ぎや消化不良に注意。甘い物の摂りすぎを避け、規則正しい食事を',
    weakWarning:
      '消化機能が弱まりやすく、食欲不振やむくみに注意。温かい食事と腹八分目を心がけ、胃腸を労わりましょう',
    advice: '甘味のある根菜類やかぼちゃで脾胃を養い、よく噛んで食べましょう',
  },
  '金': {
    organs: ['肺', '大腸'],
    bodyParts: ['鼻', '皮膚', '気管'],
    strongWarning:
      '呼吸器系や肌荒れに注意が必要です。乾燥した環境を避け、加湿や保湿ケアを意識して過ごしましょう',
    weakWarning:
      '免疫力が下がりやすく風邪を引きやすい傾向。深呼吸の習慣と辛味のある薬味で肺の機能を高めましょう',
    advice: '辛味のある大根やネギで肺を強化。腹式呼吸を日課にしましょう',
  },
  '水': {
    organs: ['腎臓', '膀胱'],
    bodyParts: ['耳', '骨', '髪'],
    strongWarning:
      '腎臓やむくみに注意が必要です。水分の摂りすぎや冷たい飲み物を避け、下半身を冷やさないようにしましょう',
    weakWarning:
      '疲労感や腰痛、耳鳴りが出やすい傾向。黒い食材（黒ゴマ・海藻）を摂り、十分な睡眠で腎を養いましょう',
    advice: '塩味を適度に摂り、黒豆や昆布で腎を補いましょう。早寝が一番の薬です',
  },
};

// 五行バランスから健康運テキストを生成
export function generateHealthReading(gogyoBalance: GogyoBalance[]): string {
  const sorted = [...gogyoBalance].sort((a, b) => b.count - a.count);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const strongData = HEALTH_GOGYO[strongest.gogyo];
  const weakData = HEALTH_GOGYO[weakest.gogyo];

  const parts: string[] = [];

  // 最も多い五行への注意
  if (strongest.count >= 3) {
    parts.push(
      `${strongest.gogyo}の気が強く、${strongData.organs.join('・')}に関わる不調に注意が必要です。${strongData.strongWarning}。`
    );
  } else {
    parts.push(
      `五行のバランスは比較的整っています。${strongData.advice}。`
    );
  }

  // 最も少ない五行への注意（0の場合のみ）
  if (weakest.count === 0) {
    parts.push(
      `${weakest.gogyo}の気が不足しています。${weakData.weakWarning}。`
    );
  }

  // 総合アドバイス
  if (strongest.count < 3 && weakest.count > 0) {
    parts.push('全体的にバランスが取れた命式です。季節の変わり目に体調を崩しやすいので、旬の食材で五行を整えましょう。');
  } else {
    parts.push(`${weakData.advice}。`);
  }

  return parts.join('');
}
