"use client";

import type { Junishi } from "@/lib/shichusuimei";

interface ZodiacTheme {
  animal: string;
  element: string;
  trait: string;
  color1: string; // グラデーション開始色
  color2: string; // グラデーション終了色
  accent: string; // 星座ポイントの色
  bg: string;     // 背景リング色
}

const ZODIAC_MAP: Record<Junishi, ZodiacTheme> = {
  '子': { animal: '鼠', element: '水', trait: '知恵と機敏さの守護', color1: '#93C5FD', color2: '#3B82F6', accent: '#BFDBFE', bg: '#1E3A5F' },
  '丑': { animal: '牛', element: '土', trait: '忍耐と誠実さの守護', color1: '#DEB887', color2: '#8B6914', accent: '#F5DEB3', bg: '#5C3310' },
  '寅': { animal: '虎', element: '木', trait: '勇気と威厳の守護', color1: '#FDBA74', color2: '#EA580C', accent: '#FDE047', bg: '#7C2D12' },
  '卯': { animal: '兎', element: '木', trait: '優美と幸運の守護', color1: '#F9A8D4', color2: '#DB2777', accent: '#FBCFE8', bg: '#831843' },
  '辰': { animal: '龍', element: '土', trait: '権威と繁栄の守護', color1: '#FDE68A', color2: '#D97706', accent: '#FEF3C7', bg: '#78350F' },
  '巳': { animal: '蛇', element: '火', trait: '知恵と神秘の守護', color1: '#D8B4FE', color2: '#9333EA', accent: '#E9D5FF', bg: '#581C87' },
  '午': { animal: '馬', element: '火', trait: '情熱と行動力の守護', color1: '#FCA5A5', color2: '#DC2626', accent: '#FECACA', bg: '#7F1D1D' },
  '未': { animal: '羊', element: '土', trait: '温和と芸術性の守護', color1: '#A7F3D0', color2: '#059669', accent: '#D1FAE5', bg: '#064E3B' },
  '申': { animal: '猿', element: '金', trait: '才知と器用さの守護', color1: '#FDE68A', color2: '#CA8A04', accent: '#FEF9C3', bg: '#713F12' },
  '酉': { animal: '鶏', element: '金', trait: '誠実と先見性の守護', color1: '#FDBA74', color2: '#C2410C', accent: '#FED7AA', bg: '#431407' },
  '戌': { animal: '犬', element: '土', trait: '忠誠と正義の守護', color1: '#E2C28E', color2: '#92400E', accent: '#F5DEB3', bg: '#4A2C17' },
  '亥': { animal: '猪', element: '水', trait: '勇猛と直進の守護', color1: '#A5B4FC', color2: '#4F46E5', accent: '#C7D2FE', bg: '#312E81' },
};

// 星座風の光る点
function Star({ x, y, r, color, delay }: { x: number; y: number; r: number; color: string; delay?: number }) {
  return (
    <circle cx={x} cy={y} r={r} fill={color} opacity="0.9"
      style={delay !== undefined ? { animation: `constellationPulse 3s ease-in-out ${delay}s infinite` } : undefined}
    />
  );
}

// 星座の線
function Line({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.8" opacity="0.3" />;
}

function ZodiacSilhouette({ shi, t }: { shi: Junishi; t: ZodiacTheme }) {
  const id = `zs-${shi}`;
  const a = t.accent;

  const gradDef = (
    <defs>
      <linearGradient id={`g-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={t.color1} stopOpacity="0.9" />
        <stop offset="100%" stopColor={t.color2} stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id={`gs-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={t.color1} stopOpacity="0.15" />
        <stop offset="100%" stopColor={t.color2} stopOpacity="0.05" />
      </linearGradient>
    </defs>
  );
  const fill = `url(#g-${id})`;
  const fillShadow = `url(#gs-${id})`;
  const stroke = t.color1;

  switch (shi) {
    case '子': // 鼠 — 軽やかに跳ねるシルエット
      return (
        <g>
          {gradDef}
          {/* 影 */}
          <ellipse cx="100" cy="162" rx="22" ry="4" fill={fillShadow} />
          {/* 体 */}
          <path d="M80,120 C70,110 65,95 72,82 C78,70 90,65 100,68 C110,65 122,70 128,82 C135,95 130,110 120,120 C115,126 110,135 108,145 C106,152 94,152 92,145 C90,135 85,126 80,120Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* 大きな耳 */}
          <path d="M78,82 C70,65 62,48 68,42 C74,38 82,48 85,65 C86,72 82,78 78,82Z" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.8" />
          <path d="M122,82 C130,65 138,48 132,42 C126,38 118,48 115,65 C114,72 118,78 122,82Z" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.8" />
          {/* 目 */}
          <ellipse cx="90" cy="86" rx="3" ry="3.5" fill="white" opacity="0.9" />
          <ellipse cx="110" cy="86" rx="3" ry="3.5" fill="white" opacity="0.9" />
          <circle cx="91" cy="86" r="1.8" fill={t.bg} />
          <circle cx="111" cy="86" r="1.8" fill={t.bg} />
          {/* 鼻 */}
          <circle cx="100" cy="96" r="2" fill={a} />
          {/* しっぽ */}
          <path d="M108,145 C118,140 132,130 140,118 C146,108 148,100 144,96" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {/* ひげ */}
          <line x1="90" y1="94" x2="72" y2="90" stroke={a} strokeWidth="0.7" opacity="0.5" />
          <line x1="90" y1="97" x2="72" y2="96" stroke={a} strokeWidth="0.7" opacity="0.5" />
          <line x1="110" y1="94" x2="128" y2="90" stroke={a} strokeWidth="0.7" opacity="0.5" />
          <line x1="110" y1="97" x2="128" y2="96" stroke={a} strokeWidth="0.7" opacity="0.5" />
          {/* 星座ポイント */}
          <Star x={100} y={68} r={2.5} color={a} delay={0} />
          <Star x={72} y={82} r={2} color={a} delay={0.3} />
          <Star x={128} y={82} r={2} color={a} delay={0.6} />
          <Star x={68} y={42} r={1.8} color={a} delay={0.9} />
          <Star x={132} y={42} r={1.8} color={a} delay={1.2} />
          <Star x={144} y={96} r={1.5} color={a} delay={1.5} />
          <Line x1={100} y1={68} x2={72} y2={82} color={a} />
          <Line x1={100} y1={68} x2={128} y2={82} color={a} />
          <Line x1={72} y1={82} x2={68} y2={42} color={a} />
          <Line x1={128} y1={82} x2={132} y2={42} color={a} />
        </g>
      );
    case '丑': // 牛 — 力強く佇むシルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="100" cy="162" rx="28" ry="4" fill={fillShadow} />
          {/* 角 */}
          <path d="M72,62 C62,42 52,26 48,28 C44,30 52,46 60,56 L72,62Z" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.8" />
          <path d="M128,62 C138,42 148,26 152,28 C156,30 148,46 140,56 L128,62Z" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.8" />
          {/* 体 */}
          <path d="M68,62 C58,72 52,88 55,105 C58,120 65,130 72,140 L72,155 L82,155 L84,140 C90,145 110,145 116,140 L118,155 L128,155 L128,140 C135,130 142,120 145,105 C148,88 142,72 132,62 C124,54 114,48 100,48 C86,48 76,54 68,62Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* 頭のディテール */}
          <circle cx="86" cy="78" r="3.5" fill="white" opacity="0.9" />
          <circle cx="114" cy="78" r="3.5" fill="white" opacity="0.9" />
          <circle cx="87" cy="78" r="2" fill={t.bg} />
          <circle cx="115" cy="78" r="2" fill={t.bg} />
          {/* 鼻 */}
          <ellipse cx="100" cy="92" rx="8" ry="5" fill={t.color2} opacity="0.4" />
          <circle cx="96" cy="92" r="2" fill={t.bg} opacity="0.4" />
          <circle cx="104" cy="92" r="2" fill={t.bg} opacity="0.4" />
          {/* 星座ポイント */}
          <Star x={48} y={28} r={2.5} color={a} delay={0} />
          <Star x={152} y={28} r={2.5} color={a} delay={0.3} />
          <Star x={100} y={48} r={2} color={a} delay={0.6} />
          <Star x={55} y={105} r={1.8} color={a} delay={0.9} />
          <Star x={145} y={105} r={1.8} color={a} delay={1.2} />
          <Line x1={48} y1={28} x2={100} y2={48} color={a} />
          <Line x1={152} y1={28} x2={100} y2={48} color={a} />
          <Line x1={48} y1={28} x2={55} y2={105} color={a} />
          <Line x1={152} y1={28} x2={145} y2={105} color={a} />
        </g>
      );
    case '寅': // 虎 — 威風堂々と歩くシルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="100" cy="162" rx="32" ry="4" fill={fillShadow} />
          {/* 体（横向き歩行ポーズ） */}
          <path d="M50,95 C45,82 48,68 58,60 C65,54 75,50 82,48 L90,42 C92,38 96,36 100,38 C104,36 108,38 110,42 L118,48 C125,50 135,54 142,60 C152,68 155,82 150,95 C148,100 144,108 140,115 L142,145 L148,155 L136,155 L132,145 L128,130 C120,135 80,135 72,130 L68,145 L64,155 L52,155 L58,145 L60,115 C56,108 52,100 50,95Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* 縞模様 */}
          <path d="M72,80 C80,75 85,78 88,82" fill="none" stroke={t.color2} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <path d="M95,72 C98,68 102,68 105,72" fill="none" stroke={t.color2} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <path d="M112,80 C120,75 125,78 128,82" fill="none" stroke={t.color2} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
          <path d="M78,100 C88,96 96,98 100,102" fill="none" stroke={t.color2} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          <path d="M122,100 C112,96 104,98 100,102" fill="none" stroke={t.color2} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          {/* 目 */}
          <ellipse cx="88" cy="62" rx="4" ry="3" fill="#FDE047" opacity="0.9" />
          <ellipse cx="112" cy="62" rx="4" ry="3" fill="#FDE047" opacity="0.9" />
          <ellipse cx="89" cy="62" rx="2" ry="2.5" fill={t.bg} />
          <ellipse cx="113" cy="62" rx="2" ry="2.5" fill={t.bg} />
          {/* しっぽ */}
          <path d="M150,95 C158,88 164,78 162,68 C160,60 154,58 152,64" fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" />
          {/* 星座ポイント */}
          <Star x={100} y={38} r={2.5} color={a} delay={0} />
          <Star x={58} y={60} r={2} color={a} delay={0.4} />
          <Star x={142} y={60} r={2} color={a} delay={0.8} />
          <Star x={162} y={68} r={2} color={a} delay={1.2} />
          <Line x1={100} y1={38} x2={58} y2={60} color={a} />
          <Line x1={100} y1={38} x2={142} y2={60} color={a} />
          <Line x1={142} y1={60} x2={162} y2={68} color={a} />
        </g>
      );
    case '卯': // 兎 — 月を見上げるシルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="100" cy="162" rx="20" ry="4" fill={fillShadow} />
          {/* 長い耳 */}
          <path d="M86,60 C82,35 78,8 84,4 C90,0 94,20 94,45 L92,60Z" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.85" />
          <path d="M88,42 C86,24 84,10 86,6" fill="none" stroke={a} strokeWidth="2" opacity="0.2" />
          <path d="M114,60 C118,35 122,8 116,4 C110,0 106,20 106,45 L108,60Z" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.85" />
          <path d="M112,42 C114,24 116,10 114,6" fill="none" stroke={a} strokeWidth="2" opacity="0.2" />
          {/* 体 */}
          <path d="M75,85 C65,78 60,65 68,58 C76,52 88,55 94,60 L100,58 L106,60 C112,55 124,52 132,58 C140,65 135,78 125,85 C120,90 118,100 118,110 C118,128 115,142 112,155 L88,155 C85,142 82,128 82,110 C82,100 80,90 75,85Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* 目 */}
          <ellipse cx="88" cy="74" rx="4.5" ry="5" fill="white" opacity="0.9" />
          <ellipse cx="112" cy="74" rx="4.5" ry="5" fill="white" opacity="0.9" />
          <circle cx="89" cy="74" r="2.5" fill={t.bg} />
          <circle cx="113" cy="74" r="2.5" fill={t.bg} />
          <circle cx="88" cy="72" r="1" fill="white" opacity="0.8" />
          <circle cx="112" cy="72" r="1" fill="white" opacity="0.8" />
          {/* 鼻 */}
          <path d="M97,84 L100,87 L103,84Z" fill={a} opacity="0.7" />
          {/* しっぽ */}
          <ellipse cx="118" cy="148" rx="8" ry="7" fill={t.color1} opacity="0.5" />
          {/* 月 */}
          <circle cx="155" cy="25" r="12" fill={a} opacity="0.15" />
          <path d="M152,16 A9,9 0 0,1 152,34 A7,7 0 0,0 152,16Z" fill={a} opacity="0.25" />
          {/* 星座ポイント */}
          <Star x={84} y={4} r={2.5} color={a} delay={0} />
          <Star x={116} y={4} r={2.5} color={a} delay={0.3} />
          <Star x={100} y={58} r={2} color={a} delay={0.6} />
          <Star x={155} y={25} r={2} color={a} delay={0.9} />
          <Line x1={84} y1={4} x2={100} y2={58} color={a} />
          <Line x1={116} y1={4} x2={100} y2={58} color={a} />
          <Line x1={116} y1={4} x2={155} y2={25} color={a} />
        </g>
      );
    case '辰': // 龍 — 天を舞う龍のシルエット
      return (
        <g>
          {gradDef}
          {/* うねる体 */}
          <path d="M56,45 C68,38 78,35 86,40 C94,45 96,55 92,65 C88,75 78,80 74,90 C70,100 72,112 82,118 C92,124 105,120 115,112 C125,104 130,92 138,84 C146,76 156,74 162,80 C168,86 165,96 158,102" fill="none" stroke={fill} strokeWidth="8" strokeLinecap="round" opacity="0.85" />
          <path d="M56,45 C68,38 78,35 86,40 C94,45 96,55 92,65 C88,75 78,80 74,90 C70,100 72,112 82,118 C92,124 105,120 115,112 C125,104 130,92 138,84 C146,76 156,74 162,80 C168,86 165,96 158,102" fill="none" stroke={stroke} strokeWidth="1" opacity="0.5" />
          {/* 頭 */}
          <path d="M42,55 C38,48 36,38 40,32 C44,26 52,28 56,34 C58,38 58,44 56,48 L56,45 C50,40 44,42 42,48 L42,55Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.9" />
          {/* 角 */}
          <path d="M44,32 C38,20 34,10 38,8 C42,6 46,14 48,24" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M52,28 C52,16 54,6 58,8 C62,10 58,18 56,26" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {/* 目 */}
          <circle cx="46" cy="42" r="3" fill="#FDE047" opacity="0.9" />
          <circle cx="47" cy="42" r="1.5" fill={t.bg} />
          {/* ひげ */}
          <path d="M42,55 C32,52 22,48 16,42" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M42,50 C34,44 26,40 20,36" fill="none" stroke={a} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          {/* 背びれ */}
          <path d="M86,36 L82,28 L90,38" fill={a} opacity="0.3" />
          <path d="M92,58 L88,50 L96,60" fill={a} opacity="0.25" />
          <path d="M78,85 L74,76 L82,86" fill={a} opacity="0.2" />
          {/* しっぽの炎 */}
          <path d="M158,102 C162,108 168,110 170,106 C172,102 168,98 164,100" fill={a} opacity="0.4" />
          {/* 星座ポイント */}
          <Star x={38} y={8} r={2.5} color={a} delay={0} />
          <Star x={56} y={45} r={2} color={a} delay={0.3} />
          <Star x={92} y={65} r={2} color={a} delay={0.6} />
          <Star x={82} y={118} r={2} color={a} delay={0.9} />
          <Star x={162} y={80} r={2} color={a} delay={1.2} />
          <Star x={16} y={42} r={1.5} color={a} delay={1.5} />
          <Line x1={38} y1={8} x2={56} y2={45} color={a} />
          <Line x1={56} y1={45} x2={92} y2={65} color={a} />
          <Line x1={92} y1={65} x2={82} y2={118} color={a} />
          <Line x1={82} y1={118} x2={162} y2={80} color={a} />
        </g>
      );
    case '巳': // 蛇 — 優雅にとぐろを巻くシルエット
      return (
        <g>
          {gradDef}
          {/* とぐろ */}
          <path d="M100,35 C120,30 142,38 148,55 C154,72 142,88 128,92 C118,95 112,102 115,115 C118,128 130,135 140,142 C150,150 148,164 136,168 C124,172 110,166 104,156 C98,146 100,134 112,126 C120,120 122,112 116,104 C110,96 98,94 88,98 C78,102 70,96 68,86 C66,76 72,66 82,60 C88,56 92,48 88,42 C84,36 78,38 76,44" fill="none" stroke={fill} strokeWidth="7" strokeLinecap="round" opacity="0.85" />
          <path d="M100,35 C120,30 142,38 148,55 C154,72 142,88 128,92 C118,95 112,102 115,115 C118,128 130,135 140,142 C150,150 148,164 136,168 C124,172 110,166 104,156 C98,146 100,134 112,126 C120,120 122,112 116,104 C110,96 98,94 88,98 C78,102 70,96 68,86 C66,76 72,66 82,60 C88,56 92,48 88,42 C84,36 78,38 76,44" fill="none" stroke={stroke} strokeWidth="1" opacity="0.4" />
          {/* 頭 */}
          <path d="M96,35 C94,28 96,22 102,20 C108,18 114,22 114,30 C114,36 108,40 102,40 L100,35Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.9" />
          {/* 目 */}
          <ellipse cx="104" cy="28" rx="3" ry="2.5" fill="#FDE047" opacity="0.9" />
          <ellipse cx="104" cy="28" rx="1" ry="2" fill={t.bg} />
          {/* 舌 */}
          <path d="M98,35 L92,40 M98,35 L96,42" stroke={t.color1} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          {/* 冠 */}
          <circle cx="106" cy="16" r="4" fill={a} opacity="0.4" />
          {/* 鱗模様 */}
          <circle cx="140" cy="52" r="1.5" fill={a} opacity="0.15" />
          <circle cx="145" cy="68" r="1.5" fill={a} opacity="0.15" />
          <circle cx="135" cy="85" r="1.5" fill={a} opacity="0.15" />
          <circle cx="118" cy="110" r="1.5" fill={a} opacity="0.15" />
          <circle cx="130" cy="130" r="1.5" fill={a} opacity="0.15" />
          {/* 星座ポイント */}
          <Star x={102} y={20} r={2.5} color={a} delay={0} />
          <Star x={148} y={55} r={2} color={a} delay={0.4} />
          <Star x={68} y={86} r={2} color={a} delay={0.8} />
          <Star x={136} y={168} r={2} color={a} delay={1.2} />
          <Line x1={102} y1={20} x2={148} y2={55} color={a} />
          <Line x1={148} y1={55} x2={68} y2={86} color={a} />
          <Line x1={68} y1={86} x2={136} y2={168} color={a} />
        </g>
      );
    case '午': // 馬 — 躍動する駆けるシルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="95" cy="162" rx="30" ry="4" fill={fillShadow} />
          {/* 体 */}
          <path d="M55,72 C48,60 50,46 58,38 C66,30 78,28 85,30 L92,22 C94,18 98,16 102,18 L108,30 C115,28 125,30 132,38 C140,48 140,62 136,75 C134,82 130,90 128,100 L132,130 L138,155 L126,155 L120,130 L116,115 C110,120 80,120 74,115 L70,130 L64,155 L52,155 L58,130 L62,100 C60,90 56,82 55,72Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* たてがみ */}
          <path d="M80,30 C76,18 80,8 86,12 L85,26Z" fill={a} opacity="0.3" />
          <path d="M90,24 C88,10 92,2 98,6 L96,20Z" fill={a} opacity="0.35" />
          <path d="M100,26 C102,12 106,6 110,10 L108,24Z" fill={a} opacity="0.3" />
          {/* 目 */}
          <circle cx="82" cy="48" r="3.5" fill="white" opacity="0.9" />
          <circle cx="83" cy="48" r="2" fill={t.bg} />
          <circle cx="108" cy="48" r="3.5" fill="white" opacity="0.9" />
          <circle cx="109" cy="48" r="2" fill={t.bg} />
          {/* しっぽ */}
          <path d="M136,75 C148,68 158,58 162,46 C164,38 160,34 156,40 C152,46 156,54 158,48" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          {/* 星座ポイント */}
          <Star x={98} y={6} r={2.5} color={a} delay={0} />
          <Star x={58} y={38} r={2} color={a} delay={0.3} />
          <Star x={132} y={38} r={2} color={a} delay={0.6} />
          <Star x={162} y={46} r={2} color={a} delay={0.9} />
          <Line x1={98} y1={6} x2={58} y2={38} color={a} />
          <Line x1={98} y1={6} x2={132} y2={38} color={a} />
          <Line x1={132} y1={38} x2={162} y2={46} color={a} />
        </g>
      );
    case '未': // 羊 — もこもこ雲のようなシルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="100" cy="162" rx="24" ry="4" fill={fillShadow} />
          {/* 角 */}
          <path d="M78,52 C68,44 58,40 54,44 C50,48 56,56 64,58 L76,58" fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          <path d="M122,52 C132,44 142,40 146,44 C150,48 144,56 136,58 L124,58" fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          {/* もこもこ体 */}
          <circle cx="72" cy="105" r="18" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.7" />
          <circle cx="100" cy="108" r="20" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.75" />
          <circle cx="128" cy="105" r="18" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.7" />
          <circle cx="85" cy="92" r="16" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.72" />
          <circle cx="115" cy="92" r="16" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.72" />
          {/* もこもこ頭 */}
          <circle cx="78" cy="56" r="12" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.7" />
          <circle cx="100" cy="50" r="14" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.75" />
          <circle cx="122" cy="56" r="12" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.7" />
          {/* 顔 */}
          <circle cx="100" cy="72" r="20" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.9" />
          {/* 目 */}
          <circle cx="92" cy="70" r="3" fill="white" opacity="0.9" />
          <circle cx="108" cy="70" r="3" fill="white" opacity="0.9" />
          <circle cx="93" cy="70" r="1.8" fill={t.bg} />
          <circle cx="109" cy="70" r="1.8" fill={t.bg} />
          {/* 鼻 */}
          <ellipse cx="100" cy="80" rx="2.5" ry="2" fill={a} opacity="0.5" />
          {/* 脚 */}
          <rect x="82" y="122" width="5" height="35" rx="2.5" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.7" />
          <rect x="113" y="122" width="5" height="35" rx="2.5" fill={fill} stroke={stroke} strokeWidth="0.8" opacity="0.7" />
          {/* 星座ポイント */}
          <Star x={54} y={44} r={2} color={a} delay={0} />
          <Star x={146} y={44} r={2} color={a} delay={0.3} />
          <Star x={100} y={50} r={2.5} color={a} delay={0.6} />
          <Star x={72} y={105} r={1.8} color={a} delay={0.9} />
          <Star x={128} y={105} r={1.8} color={a} delay={1.2} />
          <Line x1={54} y1={44} x2={100} y2={50} color={a} />
          <Line x1={146} y1={44} x2={100} y2={50} color={a} />
          <Line x1={100} y1={50} x2={72} y2={105} color={a} />
          <Line x1={100} y1={50} x2={128} y2={105} color={a} />
        </g>
      );
    case '申': // 猿 — 知的に座る猿のシルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="100" cy="162" rx="22" ry="4" fill={fillShadow} />
          {/* 体 */}
          <path d="M78,85 C70,78 66,68 70,58 C74,48 84,42 95,42 L100,38 L105,42 C116,42 126,48 130,58 C134,68 130,78 122,85 C118,90 116,98 116,108 C116,122 114,136 112,152 L88,152 C86,136 84,122 84,108 C84,98 82,90 78,85Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* 耳 */}
          <circle cx="68" cy="58" r="10" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.8" />
          <circle cx="68" cy="58" r="5" fill={a} opacity="0.15" />
          <circle cx="132" cy="58" r="10" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.8" />
          <circle cx="132" cy="58" r="5" fill={a} opacity="0.15" />
          {/* 顔パッチ */}
          <ellipse cx="100" cy="72" rx="16" ry="14" fill={a} opacity="0.1" />
          {/* 目 */}
          <circle cx="90" cy="66" r="4" fill="white" opacity="0.9" />
          <circle cx="110" cy="66" r="4" fill="white" opacity="0.9" />
          <circle cx="91" cy="66" r="2.2" fill={t.bg} />
          <circle cx="111" cy="66" r="2.2" fill={t.bg} />
          {/* 鼻 */}
          <ellipse cx="100" cy="76" rx="3" ry="2" fill={t.color2} opacity="0.5" />
          {/* 口 */}
          <path d="M94,82 Q100,87 106,82" fill="none" stroke={t.color2} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          {/* 腕 */}
          <path d="M78,85 C66,92 54,102 48,112 C44,118 48,122 54,118" fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" opacity="0.75" />
          <path d="M122,85 C134,92 146,102 152,112 C156,118 152,122 146,118" fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" opacity="0.75" />
          {/* しっぽ */}
          <path d="M112,148 C124,146 136,138 140,128 C142,120 138,116 134,122" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          {/* 星座ポイント */}
          <Star x={100} y={38} r={2.5} color={a} delay={0} />
          <Star x={68} y={58} r={2} color={a} delay={0.3} />
          <Star x={132} y={58} r={2} color={a} delay={0.6} />
          <Star x={48} y={112} r={1.8} color={a} delay={0.9} />
          <Star x={152} y={112} r={1.8} color={a} delay={1.2} />
          <Line x1={100} y1={38} x2={68} y2={58} color={a} />
          <Line x1={100} y1={38} x2={132} y2={58} color={a} />
          <Line x1={68} y1={58} x2={48} y2={112} color={a} />
          <Line x1={132} y1={58} x2={152} y2={112} color={a} />
        </g>
      );
    case '酉': // 鶏 — 凛々しく立つ鳳凰風シルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="100" cy="162" rx="20" ry="4" fill={fillShadow} />
          {/* 尾羽（華麗に広がる） */}
          <path d="M90,130 C78,140 62,155 55,165 C50,170 48,175 54,175" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <path d="M100,132 L100,175" stroke={fill} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          <path d="M110,130 C122,140 138,155 145,165 C150,170 152,175 146,175" fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          {/* 体 */}
          <path d="M78,95 C68,85 65,72 70,62 C76,52 88,48 100,50 C112,48 124,52 130,62 C135,72 132,85 122,95 C118,100 116,108 116,118 C116,125 114,132 110,138 L90,138 C86,132 84,125 84,118 C84,108 82,100 78,95Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* トサカ */}
          <path d="M90,50 C86,38 82,26 86,22 C90,18 94,28 96,40" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.7" />
          <path d="M100,48 C100,34 102,22 106,20 C110,18 110,30 108,42" fill="#EF4444" stroke="#DC2626" strokeWidth="1" opacity="0.8" />
          <path d="M108,50 C112,38 116,28 114,24 C112,20 108,28 106,40" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.7" />
          {/* 目 */}
          <circle cx="90" cy="64" r="3.5" fill="white" opacity="0.9" />
          <circle cx="110" cy="64" r="3.5" fill="white" opacity="0.9" />
          <circle cx="91" cy="64" r="2" fill={t.bg} />
          <circle cx="111" cy="64" r="2" fill={t.bg} />
          {/* くちばし */}
          <path d="M96,76 L100,68 L104,76 L100,82Z" fill={a} stroke={t.color2} strokeWidth="0.8" opacity="0.8" />
          {/* 脚 */}
          <rect x="92" y="138" width="4" height="22" rx="2" fill={a} opacity="0.5" />
          <rect x="104" y="138" width="4" height="22" rx="2" fill={a} opacity="0.5" />
          {/* 星座ポイント */}
          <Star x={106} y={20} r={2.5} color={a} delay={0} />
          <Star x={70} y={62} r={2} color={a} delay={0.3} />
          <Star x={130} y={62} r={2} color={a} delay={0.6} />
          <Star x={55} y={165} r={1.8} color={a} delay={0.9} />
          <Star x={145} y={165} r={1.8} color={a} delay={1.2} />
          <Line x1={106} y1={20} x2={70} y2={62} color={a} />
          <Line x1={106} y1={20} x2={130} y2={62} color={a} />
          <Line x1={70} y1={62} x2={55} y2={165} color={a} />
          <Line x1={130} y1={62} x2={145} y2={165} color={a} />
        </g>
      );
    case '戌': // 犬 — 忠実に座る犬のシルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="100" cy="162" rx="24" ry="4" fill={fillShadow} />
          {/* 体 */}
          <path d="M75,80 C68,72 64,60 68,50 C72,40 82,35 92,35 L100,30 L108,35 C118,35 128,40 132,50 C136,60 132,72 125,80 C120,86 118,95 118,105 C118,120 116,138 114,155 L86,155 C84,138 82,120 82,105 C82,95 80,86 75,80Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* たれ耳 */}
          <path d="M72,50 C62,42 54,36 50,40 C46,44 50,54 58,60 L68,58" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.8" />
          <path d="M128,50 C138,42 146,36 150,40 C154,44 150,54 142,60 L132,58" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.8" />
          {/* 目 */}
          <circle cx="88" cy="58" r="4" fill="white" opacity="0.9" />
          <circle cx="112" cy="58" r="4" fill="white" opacity="0.9" />
          <circle cx="89" cy="58" r="2.2" fill={t.bg} />
          <circle cx="113" cy="58" r="2.2" fill={t.bg} />
          <circle cx="88" cy="56" r="1" fill="white" opacity="0.7" />
          <circle cx="112" cy="56" r="1" fill="white" opacity="0.7" />
          {/* 鼻 */}
          <ellipse cx="100" cy="70" rx="4" ry="3" fill={t.color2} opacity="0.6" />
          {/* 首輪 */}
          <path d="M80,80 Q100,86 120,80" fill="none" stroke={a} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          <circle cx="100" cy="84" r="3" fill={a} opacity="0.6" />
          {/* しっぽ */}
          <path d="M114,148 C128,144 140,134 144,122 C146,114 142,110 138,116 C134,122 138,128 142,124" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          {/* 星座ポイント */}
          <Star x={100} y={30} r={2.5} color={a} delay={0} />
          <Star x={50} y={40} r={2} color={a} delay={0.3} />
          <Star x={150} y={40} r={2} color={a} delay={0.6} />
          <Star x={144} y={122} r={1.8} color={a} delay={0.9} />
          <Star x={100} y={84} r={2} color={a} delay={1.2} />
          <Line x1={100} y1={30} x2={50} y2={40} color={a} />
          <Line x1={100} y1={30} x2={150} y2={40} color={a} />
          <Line x1={150} y1={40} x2={144} y2={122} color={a} />
          <Line x1={100} y1={30} x2={100} y2={84} color={a} />
        </g>
      );
    case '亥': // 猪 — 力強く突進するシルエット
      return (
        <g>
          {gradDef}
          <ellipse cx="100" cy="162" rx="28" ry="4" fill={fillShadow} />
          {/* 体（やや前傾の突進姿勢） */}
          <path d="M52,72 C46,60 48,46 56,38 C64,30 76,28 86,30 L92,26 C96,22 100,20 104,22 L108,30 C118,28 130,30 138,38 C146,46 148,62 142,75 C140,80 136,88 134,98 L138,125 L144,155 L132,155 L126,125 L122,112 C114,116 86,116 78,112 L74,125 L68,155 L56,155 L62,125 L66,98 C64,88 60,80 58,75 L52,72Z" fill={fill} stroke={stroke} strokeWidth="1.2" opacity="0.85" />
          {/* 耳 */}
          <path d="M76,30 C72,18 76,10 82,12 C86,14 84,24 82,30Z" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.7" />
          <path d="M118,30 C122,18 118,10 112,12 C108,14 110,24 112,30Z" fill={fill} stroke={stroke} strokeWidth="1" opacity="0.7" />
          {/* 額の縞 */}
          <path d="M88,34 L86,44" stroke={a} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <path d="M97,32 L96,44" stroke={a} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <path d="M106,34 L108,44" stroke={a} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          {/* 目 */}
          <circle cx="84" cy="52" r="3" fill="white" opacity="0.9" />
          <circle cx="110" cy="52" r="3" fill="white" opacity="0.9" />
          <circle cx="85" cy="52" r="1.8" fill={t.bg} />
          <circle cx="111" cy="52" r="1.8" fill={t.bg} />
          {/* 鼻 */}
          <ellipse cx="97" cy="66" rx="8" ry="6" fill={t.color2} opacity="0.4" />
          <circle cx="93" cy="66" r="2" fill={t.bg} opacity="0.3" />
          <circle cx="101" cy="66" r="2" fill={t.bg} opacity="0.3" />
          {/* 牙 */}
          <path d="M86,74 C84,80 82,86 84,90" fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <path d="M108,74 C110,80 112,86 110,90" fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          {/* スピード線 */}
          <line x1="30" y1="58" x2="46" y2="56" stroke={a} strokeWidth="1.5" opacity="0.2" />
          <line x1="28" y1="68" x2="42" y2="66" stroke={a} strokeWidth="1" opacity="0.15" />
          <line x1="32" y1="78" x2="44" y2="76" stroke={a} strokeWidth="0.8" opacity="0.1" />
          {/* 星座ポイント */}
          <Star x={100} y={20} r={2.5} color={a} delay={0} />
          <Star x={56} y={38} r={2} color={a} delay={0.3} />
          <Star x={138} y={38} r={2} color={a} delay={0.6} />
          <Star x={84} y={90} r={1.8} color={a} delay={0.9} />
          <Star x={110} y={90} r={1.8} color={a} delay={1.2} />
          <Line x1={100} y1={20} x2={56} y2={38} color={a} />
          <Line x1={100} y1={20} x2={138} y2={38} color={a} />
          <Line x1={56} y1={38} x2={84} y2={90} color={a} />
          <Line x1={138} y1={38} x2={110} y2={90} color={a} />
        </g>
      );
    default:
      return null;
  }
}

interface ZodiacCharacterProps {
  shi: Junishi;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ZodiacCharacter({ shi, size = 'md' }: ZodiacCharacterProps) {
  const t = ZODIAC_MAP[shi];
  const sizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
    xl: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]} animate-zodiac-float`}>
        <svg viewBox="0 0 200 180" className="absolute inset-0 w-full h-full">
          {/* 背景リング */}
          <circle cx="100" cy="90" r="88" fill="none" stroke={t.color1} strokeWidth="0.5" opacity="0.15" />
          <circle cx="100" cy="90" r="82" fill="none" stroke={t.color1} strokeWidth="0.3" strokeDasharray="3 8" opacity="0.1" />
          <ZodiacSilhouette shi={shi} t={t} />
        </svg>
      </div>

      <div className="text-center space-y-0.5">
        <p className="text-sm sm:text-base font-black tracking-[0.2em]" style={{ color: t.color1 }}>
          {shi} ─ {t.animal}
        </p>
        <p className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.15em]" style={{ color: `${t.color1}80` }}>
          {t.element}行 / {t.trait}
        </p>
      </div>
    </div>
  );
}

export function ZodiacBadge({ shi }: { shi: Junishi }) {
  const t = ZODIAC_MAP[shi];
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
      style={{
        color: t.color1,
        borderColor: `${t.color1}40`,
        backgroundColor: `${t.color1}10`,
      }}
    >
      <span className="font-bold">{shi}</span>
      <span className="text-xs opacity-70">{t.animal}</span>
      <span className="w-px h-3 opacity-30" style={{ backgroundColor: t.color1 }} />
      <span className="text-xs opacity-50">{t.element}行</span>
    </span>
  );
}

export { ZODIAC_MAP };
