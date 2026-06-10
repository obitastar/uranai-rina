"use client";

import type { Junishi } from "@/lib/shichusuimei";

interface ZodiacInfo {
  animal: string;
  kanji: string;
  color: string;
  glow: string;
  element: string;
  elementColor: string;
  trait: string;
}

const ZODIAC_MAP: Record<Junishi, ZodiacInfo> = {
  '子': { animal: '鼠', kanji: '子', color: '#4FC3F7', glow: 'rgba(79,195,247,0.25)', element: '水', elementColor: '#4FC3F7', trait: '知恵と機敏さの守護' },
  '丑': { animal: '牛', kanji: '丑', color: '#BCAAA4', glow: 'rgba(188,170,164,0.25)', element: '土', elementColor: '#FFD54F', trait: '忍耐と誠実さの守護' },
  '寅': { animal: '虎', kanji: '寅', color: '#FF8A65', glow: 'rgba(255,138,101,0.25)', element: '木', elementColor: '#81C784', trait: '勇気と威厳の守護' },
  '卯': { animal: '兎', kanji: '卯', color: '#F48FB1', glow: 'rgba(244,143,177,0.25)', element: '木', elementColor: '#81C784', trait: '優美と幸運の守護' },
  '辰': { animal: '龍', kanji: '辰', color: '#FFD54F', glow: 'rgba(255,213,79,0.3)', element: '土', elementColor: '#FFD54F', trait: '権威と繁栄の守護' },
  '巳': { animal: '蛇', kanji: '巳', color: '#CE93D8', glow: 'rgba(206,147,216,0.25)', element: '火', elementColor: '#EF5350', trait: '知恵と神秘の守護' },
  '午': { animal: '馬', kanji: '午', color: '#EF5350', glow: 'rgba(239,83,80,0.25)', element: '火', elementColor: '#EF5350', trait: '情熱と行動力の守護' },
  '未': { animal: '羊', kanji: '未', color: '#AED581', glow: 'rgba(174,213,129,0.25)', element: '土', elementColor: '#FFD54F', trait: '温和と芸術性の守護' },
  '申': { animal: '猿', kanji: '申', color: '#FFB74D', glow: 'rgba(255,183,77,0.25)', element: '金', elementColor: '#E0E0E0', trait: '才知と器用さの守護' },
  '酉': { animal: '鶏', kanji: '酉', color: '#E0E0E0', glow: 'rgba(224,224,224,0.25)', element: '金', elementColor: '#E0E0E0', trait: '誠実と先見性の守護' },
  '戌': { animal: '犬', kanji: '戌', color: '#A1887F', glow: 'rgba(161,136,127,0.25)', element: '土', elementColor: '#FFD54F', trait: '忠誠と正義の守護' },
  '亥': { animal: '猪', kanji: '亥', color: '#90CAF9', glow: 'rgba(144,202,249,0.25)', element: '水', elementColor: '#4FC3F7', trait: '勇猛と直進の守護' },
};

// 瑞雲のSVGパス
function CloudWisp({ x, y, scale = 1, color, opacity = 0.3 }: { x: number; y: number; scale?: number; color: string; opacity?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <path d="M0,0 Q-5,-8 -12,-5 Q-18,-2 -15,4 Q-12,10 -5,8 Q0,6 5,8 Q12,10 15,4 Q18,-2 12,-5 Q5,-8 0,0Z" fill="none" stroke={color} strokeWidth="0.8" />
    </g>
  );
}

// 火焔パターン
function FlameAura({ cx, cy, r, color, count = 8 }: { cx: number; cy: number; r: number; color: string; count?: number }) {
  return (
    <g opacity="0.2">
      {Array.from({ length: count }).map((_, i) => {
        const a = (i * Math.PI * 2) / count;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        const dx = Math.cos(a) * 8;
        const dy = Math.sin(a) * 8;
        return (
          <path
            key={i}
            d={`M${x},${y} Q${x + dx * 0.5 + dy * 0.3},${y + dy * 0.5 - dx * 0.3} ${x + dx},${y + dy}`}
            fill="none" stroke={color} strokeWidth="0.6"
          />
        );
      })}
    </g>
  );
}

// 鱗パターン（龍・蛇用）
function ScalePattern({ path, color, count = 5 }: { path: Array<[number, number]>; color: string; count?: number }) {
  return (
    <g opacity="0.25">
      {path.slice(0, count).map(([x, y], i) => (
        <path key={i} d={`M${x - 3},${y} Q${x},${y - 3} ${x + 3},${y} Q${x},${y + 1} ${x - 3},${y}`} fill="none" stroke={color} strokeWidth="0.5" />
      ))}
    </g>
  );
}

function ZodiacArt({ shi, color }: { shi: Junishi; color: string }) {
  const c1 = color;
  const c2 = `${color}90`;
  const c3 = `${color}50`;
  const c4 = `${color}25`;

  const arts: Record<Junishi, React.ReactNode> = {
    // 子(鼠) - 水を纏う霊鼠
    '子': (
      <g>
        {/* 水の波紋（背景） */}
        <circle cx="100" cy="140" r="35" fill="none" stroke={c4} strokeWidth="0.5" />
        <circle cx="100" cy="140" r="28" fill="none" stroke={c4} strokeWidth="0.4" />
        {/* 大きな丸耳 */}
        <ellipse cx="78" cy="48" rx="14" ry="16" fill="none" stroke={c1} strokeWidth="1.8" />
        <ellipse cx="78" cy="48" rx="9" ry="11" fill="none" stroke={c2} strokeWidth="0.8" />
        <ellipse cx="122" cy="48" rx="14" ry="16" fill="none" stroke={c1} strokeWidth="1.8" />
        <ellipse cx="122" cy="48" rx="9" ry="11" fill="none" stroke={c2} strokeWidth="0.8" />
        {/* 頭部 */}
        <path d="M72,62 C72,50 80,42 100,42 C120,42 128,50 128,62 C128,74 120,85 100,85 C80,85 72,74 72,62Z" fill="none" stroke={c1} strokeWidth="2" />
        {/* 目 */}
        <ellipse cx="88" cy="60" rx="4" ry="5" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="89" cy="59" r="2" fill={c1} opacity="0.8" />
        <ellipse cx="112" cy="60" rx="4" ry="5" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="113" cy="59" r="2" fill={c1} opacity="0.8" />
        {/* 鼻・ヒゲ */}
        <circle cx="100" cy="70" r="3" fill="none" stroke={c2} strokeWidth="1" />
        <line x1="76" y1="66" x2="88" y2="68" stroke={c3} strokeWidth="0.7" />
        <line x1="76" y1="70" x2="88" y2="70" stroke={c3} strokeWidth="0.7" />
        <line x1="76" y1="74" x2="88" y2="72" stroke={c3} strokeWidth="0.7" />
        <line x1="124" y1="66" x2="112" y2="68" stroke={c3} strokeWidth="0.7" />
        <line x1="124" y1="70" x2="112" y2="70" stroke={c3} strokeWidth="0.7" />
        <line x1="124" y1="74" x2="112" y2="72" stroke={c3} strokeWidth="0.7" />
        {/* 胴体 */}
        <path d="M85,82 C82,92 80,105 82,118 C84,130 90,140 100,143 C110,140 116,130 118,118 C120,105 118,92 115,82" fill="none" stroke={c1} strokeWidth="1.8" />
        {/* 前足 */}
        <path d="M82,108 C75,112 70,118 72,124 C74,128 78,126 80,122" fill="none" stroke={c2} strokeWidth="1.2" />
        <path d="M118,108 C125,112 130,118 128,124 C126,128 122,126 120,122" fill="none" stroke={c2} strokeWidth="1.2" />
        {/* 長い尻尾（S字カーブ） */}
        <path d="M108,140 C118,142 130,138 138,128 C146,118 148,108 142,100 C136,92 128,96 132,104" fill="none" stroke={c1} strokeWidth="1.5" />
        {/* 瑞雲 */}
        <CloudWisp x={50} y={45} color={c1} opacity={0.2} />
        <CloudWisp x={150} y={55} color={c1} opacity={0.15} scale={0.8} />
        <CloudWisp x={45} y={100} color={c1} opacity={0.12} scale={0.6} />
      </g>
    ),

    // 丑(牛) - 大地を守る神牛
    '丑': (
      <g>
        {/* 角（立派な弧） */}
        <path d="M70,55 C62,38 52,28 48,25 C44,22 42,28 48,35 C54,42 62,48 68,52" fill="none" stroke={c1} strokeWidth="2.5" />
        <path d="M130,55 C138,38 148,28 152,25 C156,22 158,28 152,35 C146,42 138,48 132,52" fill="none" stroke={c1} strokeWidth="2.5" />
        {/* 角の装飾線 */}
        <path d="M55,32 C58,36 62,40 65,48" fill="none" stroke={c3} strokeWidth="0.6" />
        <path d="M145,32 C142,36 138,40 135,48" fill="none" stroke={c3} strokeWidth="0.6" />
        {/* 頭部（大きく角ばった形） */}
        <path d="M68,52 C74,44 86,38 100,38 C114,38 126,44 132,52 C138,62 140,75 136,88 C132,98 124,105 100,108 C76,105 68,98 64,88 C60,75 62,62 68,52Z" fill="none" stroke={c1} strokeWidth="2.5" />
        {/* 額の模様 */}
        <path d="M88,48 L100,42 L112,48" fill="none" stroke={c2} strokeWidth="1" />
        <line x1="100" y1="42" x2="100" y2="55" stroke={c3} strokeWidth="0.8" />
        {/* 目（力強い） */}
        <path d="M82,62 L78,66 L86,66Z" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="82" cy="65" r="2" fill={c1} opacity="0.8" />
        <path d="M118,62 L122,66 L114,66Z" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="118" cy="65" r="2" fill={c1} opacity="0.8" />
        {/* 鼻輪 */}
        <ellipse cx="100" cy="82" rx="10" ry="7" fill="none" stroke={c2} strokeWidth="1.2" />
        <path d="M94,88 Q100,95 106,88" fill="none" stroke={c1} strokeWidth="1.5" />
        {/* 胴体 */}
        <path d="M78,105 C74,115 72,130 76,142 C80,152 90,158 100,158 C110,158 120,152 124,142 C128,130 126,115 122,105" fill="none" stroke={c1} strokeWidth="2" />
        {/* 脚 */}
        <path d="M82,148 L80,165 L86,165" fill="none" stroke={c2} strokeWidth="1.5" />
        <path d="M118,148 L120,165 L114,165" fill="none" stroke={c2} strokeWidth="1.5" />
        {/* 瑞雲 */}
        <CloudWisp x={42} y={65} color={c1} opacity={0.2} />
        <CloudWisp x={158} y={70} color={c1} opacity={0.15} scale={0.7} />
      </g>
    ),

    // 寅(虎) - 風林火山の神虎
    '寅': (
      <g>
        {/* オーラ炎 */}
        <FlameAura cx={100} cy={80} r={75} color={c1} count={10} />
        {/* 耳 */}
        <path d="M68,48 C62,32 66,22 75,24 C82,26 80,38 76,46" fill="none" stroke={c1} strokeWidth="2" />
        <path d="M132,48 C138,32 134,22 125,24 C118,26 120,38 124,46" fill="none" stroke={c1} strokeWidth="2" />
        {/* 頭部 */}
        <path d="M70,48 C76,38 88,32 100,32 C112,32 124,38 130,48 C136,58 138,72 134,82 C130,90 122,95 100,98 C78,95 70,90 66,82 C62,72 64,58 70,48Z" fill="none" stroke={c1} strokeWidth="2.8" />
        {/* 額の「王」の字 */}
        <line x1="90" y1="42" x2="110" y2="42" stroke={c1} strokeWidth="1.5" />
        <line x1="92" y1="48" x2="108" y2="48" stroke={c1} strokeWidth="1.2" />
        <line x1="94" y1="54" x2="106" y2="54" stroke={c1} strokeWidth="1" />
        <line x1="100" y1="40" x2="100" y2="56" stroke={c1} strokeWidth="1" />
        {/* 目（鋭い吊り目） */}
        <path d="M78,65 C82,60 90,60 92,65" fill="none" stroke={c1} strokeWidth="1.8" />
        <circle cx="86" cy="64" r="2.5" fill={c1} opacity="0.9" />
        <path d="M122,65 C118,60 110,60 108,65" fill="none" stroke={c1} strokeWidth="1.8" />
        <circle cx="114" cy="64" r="2.5" fill={c1} opacity="0.9" />
        {/* 鼻・口 */}
        <path d="M97,74 L100,78 L103,74" fill="none" stroke={c2} strokeWidth="1.5" />
        <path d="M88,82 C92,86 95,88 100,88 C105,88 108,86 112,82" fill="none" stroke={c1} strokeWidth="1.8" />
        {/* 牙 */}
        <path d="M90,82 L88,88" stroke={c2} strokeWidth="1.2" />
        <path d="M110,82 L112,88" stroke={c2} strokeWidth="1.2" />
        {/* 胴体（縞模様付き） */}
        <path d="M80,95 C76,108 74,125 78,140 C82,152 92,160 100,162 C108,160 118,152 122,140 C126,125 124,108 120,95" fill="none" stroke={c1} strokeWidth="2.2" />
        {/* 縞模様 */}
        <path d="M82,108 C90,112 110,112 118,108" fill="none" stroke={c3} strokeWidth="0.8" />
        <path d="M80,118 C90,122 110,122 120,118" fill="none" stroke={c3} strokeWidth="0.8" />
        <path d="M78,128 C88,132 112,132 122,128" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 前脚 */}
        <path d="M78,120 C68,126 62,135 65,142 C68,148 74,146 76,140 L78,135" fill="none" stroke={c2} strokeWidth="1.5" />
        <path d="M122,120 C132,126 138,135 135,142 C132,148 126,146 124,140 L122,135" fill="none" stroke={c2} strokeWidth="1.5" />
        {/* 尻尾 */}
        <path d="M110,158 C120,160 132,155 140,145 C148,135 145,125 138,128" fill="none" stroke={c1} strokeWidth="1.8" />
        {/* 瑞雲 */}
        <CloudWisp x={40} y={50} color={c1} opacity={0.2} />
        <CloudWisp x={155} y={42} color={c1} opacity={0.18} scale={0.9} />
        <CloudWisp x={48} y={130} color={c1} opacity={0.1} scale={0.6} />
      </g>
    ),

    // 卯(兎) - 月に宿る玉兎
    '卯': (
      <g>
        {/* 月（背景） */}
        <circle cx="100" cy="80" r="55" fill="none" stroke={c4} strokeWidth="0.5" />
        <path d="M85,30 A50,50 0 0,1 85,130" fill="none" stroke={c4} strokeWidth="0.3" />
        {/* 長い耳（優美に） */}
        <path d="M88,50 C86,30 82,8 86,4 C90,0 95,10 94,28 C93,40 92,48 90,52" fill="none" stroke={c1} strokeWidth="1.8" />
        <path d="M88,38 C87,25 85,14 87,10" fill="none" stroke={c2} strokeWidth="0.7" />
        <path d="M112,50 C114,30 118,8 114,4 C110,0 105,10 106,28 C107,40 108,48 110,52" fill="none" stroke={c1} strokeWidth="1.8" />
        <path d="M112,38 C113,25 115,14 113,10" fill="none" stroke={c2} strokeWidth="0.7" />
        {/* 頭部（丸みを帯びた） */}
        <path d="M74,62 C74,50 84,42 100,42 C116,42 126,50 126,62 C126,78 118,90 100,92 C82,90 74,78 74,62Z" fill="none" stroke={c1} strokeWidth="2" />
        {/* 目（大きく丸い） */}
        <ellipse cx="88" cy="62" rx="6" ry="7" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="90" cy="61" r="3" fill={c1} opacity="0.6" />
        <circle cx="91" cy="60" r="1" fill="white" opacity="0.5" />
        <ellipse cx="112" cy="62" rx="6" ry="7" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="114" cy="61" r="3" fill={c1} opacity="0.6" />
        <circle cx="115" cy="60" r="1" fill="white" opacity="0.5" />
        {/* 鼻・口 */}
        <path d="M98,73 L100,76 L102,73" fill={c2} stroke="none" />
        <path d="M100,76 C98,78 96,80 94,80 M100,76 C102,78 104,80 106,80" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 胴体（丸い） */}
        <path d="M84,88 C78,98 76,112 80,126 C84,138 92,146 100,148 C108,146 116,138 120,126 C124,112 122,98 116,88" fill="none" stroke={c1} strokeWidth="1.8" />
        {/* ふわふわの尻尾 */}
        <circle cx="105" cy="145" r="8" fill="none" stroke={c2} strokeWidth="1.2" />
        <circle cx="108" cy="142" r="5" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 前脚 */}
        <path d="M84,118 C78,124 76,132 80,136 M116,118 C122,124 124,132 120,136" fill="none" stroke={c2} strokeWidth="1.2" />
        {/* 瑞雲 */}
        <CloudWisp x={45} y={55} color={c1} opacity={0.18} />
        <CloudWisp x={150} y={48} color={c1} opacity={0.15} scale={0.7} />
        <CloudWisp x={155} y={110} color={c1} opacity={0.1} scale={0.5} />
      </g>
    ),

    // 辰(龍) - 天を統べる神龍
    '辰': (
      <g>
        {/* 稲光 */}
        <path d="M50,20 L55,35 L48,35 L55,50" fill="none" stroke={c4} strokeWidth="0.6" />
        <path d="M150,25 L145,40 L152,40 L145,55" fill="none" stroke={c4} strokeWidth="0.6" />
        {/* 角（鹿角状） */}
        <path d="M72,42 C65,25 58,15 52,12 C48,10 50,18 55,25 C58,30 60,35 62,38" fill="none" stroke={c1} strokeWidth="2" />
        <path d="M60,22 C56,18 52,20 56,26" fill="none" stroke={c2} strokeWidth="1" />
        <path d="M128,42 C135,25 142,15 148,12 C152,10 150,18 145,25 C142,30 140,35 138,38" fill="none" stroke={c1} strokeWidth="2" />
        <path d="M140,22 C144,18 148,20 144,26" fill="none" stroke={c2} strokeWidth="1" />
        {/* 鬣（たてがみ） */}
        <path d="M72,45 C65,40 58,45 62,52" fill="none" stroke={c2} strokeWidth="1.2" />
        <path d="M68,50 C60,48 55,55 60,60" fill="none" stroke={c3} strokeWidth="1" />
        <path d="M128,45 C135,40 142,45 138,52" fill="none" stroke={c2} strokeWidth="1.2" />
        <path d="M132,50 C140,48 145,55 140,60" fill="none" stroke={c3} strokeWidth="1" />
        {/* 頭部 */}
        <path d="M68,45 C76,36 88,30 100,30 C112,30 124,36 132,45 C140,55 142,68 136,78 C130,86 120,90 100,92 C80,90 70,86 64,78 C58,68 60,55 68,45Z" fill="none" stroke={c1} strokeWidth="2.8" />
        {/* 目（威厳ある） */}
        <path d="M78,58 L74,62 L82,65 L86,60Z" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="80" cy="61" r="2.5" fill={c1} opacity="0.9" />
        <path d="M122,58 L126,62 L118,65 L114,60Z" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="120" cy="61" r="2.5" fill={c1} opacity="0.9" />
        {/* 龍髯 */}
        <path d="M74,72 C65,75 55,72 48,68" fill="none" stroke={c2} strokeWidth="1" />
        <path d="M72,78 C62,82 52,80 45,78" fill="none" stroke={c3} strokeWidth="0.8" />
        <path d="M126,72 C135,75 145,72 152,68" fill="none" stroke={c2} strokeWidth="1" />
        <path d="M128,78 C138,82 148,80 155,78" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 口 */}
        <path d="M90,75 L100,80 L110,75" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M95,80 L100,85 L105,80" fill="none" stroke={c2} strokeWidth="1" />
        {/* 蛇行する胴体 */}
        <path d="M100,90 C108,100 120,108 128,120 C136,132 130,148 118,155 C106,162 92,158 85,148 C78,138 82,125 92,118 C102,111 108,105 100,95" fill="none" stroke={c1} strokeWidth="2.2" />
        {/* 鱗模様 */}
        <ScalePattern path={[[110,108],[122,118],[130,130],[125,142],[115,150],[98,152],[88,145],[82,132],[88,122],[98,115]]} color={c1} count={8} />
        {/* 瑞雲 */}
        <CloudWisp x={38} y={38} color={c1} opacity={0.22} />
        <CloudWisp x={160} y={35} color={c1} opacity={0.18} scale={0.9} />
        <CloudWisp x={35} y={100} color={c1} opacity={0.12} scale={0.7} />
        <CloudWisp x={160} y={120} color={c1} opacity={0.1} scale={0.6} />
      </g>
    ),

    // 巳(蛇) - 智慧の白蛇
    '巳': (
      <g>
        {/* 神秘のオーラ */}
        <FlameAura cx={100} cy={85} r={68} color={c1} count={6} />
        {/* 蛇身（大きなS字） */}
        <path d="M100,35 C118,32 135,40 140,55 C145,70 135,82 122,85 C110,88 105,95 108,108 C112,120 125,125 132,135 C138,145 132,158 118,162 C104,166 88,158 82,145 C76,132 80,118 92,112 C104,106 108,95 102,85 C96,78 82,75 72,68 C62,60 60,45 70,38 C78,32 90,33 100,35Z" fill="none" stroke={c1} strokeWidth="2.5" />
        {/* 鱗の模様 */}
        <ScalePattern path={[[125,50],[138,62],[132,78],[115,88],[108,100],[112,115],[125,128],[130,142],[120,155],[105,160]]} color={c1} count={10} />
        {/* 頭部 */}
        <path d="M80,42 C84,35 92,30 100,30 C108,30 115,34 118,40 C121,46 118,52 112,55 C106,58 94,58 88,55 C82,52 78,48 80,42Z" fill="none" stroke={c1} strokeWidth="2" />
        {/* 目 */}
        <path d="M90,40 L88,44 L94,44Z" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="91" cy="43" r="1.5" fill={c1} opacity="0.9" />
        <path d="M108,40 L110,44 L104,44Z" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="107" cy="43" r="1.5" fill={c1} opacity="0.9" />
        {/* 舌 */}
        <path d="M100,52 L98,60 M100,52 L102,60" stroke={c2} strokeWidth="0.8" />
        {/* 冠（宝珠） */}
        <circle cx="100" cy="26" r="4" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="100" cy="26" r="1.5" fill={c1} opacity="0.5" />
        {/* 瑞雲 */}
        <CloudWisp x={45} y={50} color={c1} opacity={0.2} />
        <CloudWisp x={155} y={60} color={c1} opacity={0.15} scale={0.8} />
        <CloudWisp x={50} y={140} color={c1} opacity={0.1} scale={0.6} />
      </g>
    ),

    // 午(馬) - 天駆ける火焔馬
    '午': (
      <g>
        {/* 炎オーラ */}
        <FlameAura cx={100} cy={80} r={72} color={c1} count={12} />
        {/* たてがみ（炎のような） */}
        <path d="M92,28 C88,15 82,8 85,5 C88,2 95,12 96,22" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M98,25 C96,12 92,2 96,0 C100,-2 104,10 102,20" fill="none" stroke={c2} strokeWidth="1.2" />
        <path d="M106,28 C110,18 115,12 112,8 C109,5 105,15 104,24" fill="none" stroke={c3} strokeWidth="1" />
        {/* 頭部（精悍な） */}
        <path d="M75,50 C80,38 90,30 100,30 C110,30 120,38 125,50 C130,62 128,75 122,82 C116,88 108,90 100,90 C92,90 84,88 78,82 C72,75 70,62 75,50Z" fill="none" stroke={c1} strokeWidth="2.5" />
        {/* 額の印 */}
        <path d="M96,38 L100,34 L104,38 L100,42Z" fill={c2} stroke="none" opacity="0.5" />
        {/* 目（燃えるような） */}
        <path d="M82,58 C86,54 92,55 93,60" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="88" cy="58" r="2.5" fill={c1} opacity="0.8" />
        <path d="M118,58 C114,54 108,55 107,60" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="112" cy="58" r="2.5" fill={c1} opacity="0.8" />
        {/* 鼻 */}
        <ellipse cx="92" cy="74" rx="3" ry="2" fill="none" stroke={c2} strokeWidth="1" />
        <ellipse cx="108" cy="74" rx="3" ry="2" fill="none" stroke={c2} strokeWidth="1" />
        {/* 口 */}
        <path d="M90,80 Q100,86 110,80" fill="none" stroke={c1} strokeWidth="1.2" />
        {/* 首・胴体 */}
        <path d="M82,88 C78,98 75,110 78,125 C80,135 86,142 92,145 M118,88 C122,98 125,110 122,125 C120,135 114,142 108,145" fill="none" stroke={c1} strokeWidth="2" />
        {/* 脚 */}
        <path d="M82,138 L78,162 L84,164 M92,142 L90,164 L96,166" fill="none" stroke={c2} strokeWidth="1.5" />
        <path d="M118,138 L122,162 L116,164 M108,142 L110,164 L104,166" fill="none" stroke={c2} strokeWidth="1.5" />
        {/* 蹄の火花 */}
        <circle cx="82" cy="164" r="2" fill="none" stroke={c3} strokeWidth="0.5" />
        <circle cx="118" cy="164" r="2" fill="none" stroke={c3} strokeWidth="0.5" />
        {/* 尻尾（炎） */}
        <path d="M115,140 C125,142 135,138 142,128 C148,118 152,108 148,100 C144,95 140,100 142,108" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M142,108 C145,102 150,98 148,92" fill="none" stroke={c3} strokeWidth="1" />
        {/* 瑞雲 */}
        <CloudWisp x={38} y={42} color={c1} opacity={0.2} />
        <CloudWisp x={158} y={50} color={c1} opacity={0.15} scale={0.8} />
      </g>
    ),

    // 未(羊) - 瑞祥の神羊
    '未': (
      <g>
        {/* 角（巻き角） */}
        <path d="M75,50 C68,38 58,32 52,35 C46,38 50,48 58,50 C65,52 72,48 75,52" fill="none" stroke={c1} strokeWidth="2" />
        <path d="M125,50 C132,38 142,32 148,35 C154,38 150,48 142,50 C135,52 128,48 125,52" fill="none" stroke={c1} strokeWidth="2" />
        {/* 毛並み（ふわふわ雲状） */}
        <path d="M70,48 C62,42 56,46 58,54 C60,60 65,58 68,55" fill="none" stroke={c2} strokeWidth="1" />
        <path d="M130,48 C138,42 144,46 142,54 C140,60 135,58 132,55" fill="none" stroke={c2} strokeWidth="1" />
        <path d="M68,62 C60,58 54,62 56,70 C58,76 64,74 66,70" fill="none" stroke={c3} strokeWidth="0.8" />
        <path d="M132,62 C140,58 146,62 144,70 C142,76 136,74 134,70" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 頭部 */}
        <path d="M72,52 C78,42 88,36 100,36 C112,36 122,42 128,52 C134,62 136,76 132,88 C128,98 118,105 100,108 C82,105 72,98 68,88 C64,76 66,62 72,52Z" fill="none" stroke={c1} strokeWidth="2.2" />
        {/* 目（穏やかな） */}
        <ellipse cx="86" cy="64" rx="5" ry="4" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="87" cy="63" r="2" fill={c1} opacity="0.6" />
        <ellipse cx="114" cy="64" rx="5" ry="4" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="115" cy="63" r="2" fill={c1} opacity="0.6" />
        {/* 口 */}
        <path d="M95,78 Q100,83 105,78" fill="none" stroke={c2} strokeWidth="1.2" />
        {/* 胴体（もこもこ） */}
        <path d="M78,105 C74,115 72,128 76,140 C80,150 90,156 100,158 C110,156 120,150 124,140 C128,128 126,115 122,105" fill="none" stroke={c1} strokeWidth="2" />
        {/* もこもこの質感 */}
        <path d="M76,115 C72,118 70,122 72,126" fill="none" stroke={c3} strokeWidth="0.8" />
        <path d="M124,115 C128,118 130,122 128,126" fill="none" stroke={c3} strokeWidth="0.8" />
        <path d="M78,130 C74,134 74,138 78,140" fill="none" stroke={c3} strokeWidth="0.8" />
        <path d="M122,130 C126,134 126,138 122,140" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 脚 */}
        <path d="M86,152 L84,168 M114,152 L116,168" fill="none" stroke={c2} strokeWidth="1.5" />
        {/* 瑞雲 */}
        <CloudWisp x={40} y={50} color={c1} opacity={0.2} />
        <CloudWisp x={155} y={45} color={c1} opacity={0.15} scale={0.8} />
        <CloudWisp x={48} y={140} color={c1} opacity={0.1} scale={0.5} />
      </g>
    ),

    // 申(猿) - 霊峰の金猿
    '申': (
      <g>
        {/* 頭の冠毛 */}
        <path d="M90,32 C88,22 92,15 96,18 C99,20 97,28 96,34" fill="none" stroke={c2} strokeWidth="1.2" />
        <path d="M100,30 C100,18 104,12 108,16 C111,19 106,28 104,32" fill="none" stroke={c2} strokeWidth="1" />
        <path d="M110,34 C114,25 118,22 116,18 C114,15 110,22 108,30" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 耳 */}
        <ellipse cx="68" cy="58" rx="10" ry="12" fill="none" stroke={c1} strokeWidth="1.5" />
        <ellipse cx="68" cy="58" rx="6" ry="8" fill="none" stroke={c2} strokeWidth="0.7" />
        <ellipse cx="132" cy="58" rx="10" ry="12" fill="none" stroke={c1} strokeWidth="1.5" />
        <ellipse cx="132" cy="58" rx="6" ry="8" fill="none" stroke={c2} strokeWidth="0.7" />
        {/* 頭部 */}
        <path d="M74,50 C80,38 90,32 100,32 C110,32 120,38 126,50 C132,62 132,76 126,86 C120,94 112,98 100,98 C88,98 80,94 74,86 C68,76 68,62 74,50Z" fill="none" stroke={c1} strokeWidth="2.2" />
        {/* 顔の模様 */}
        <path d="M80,52 C85,48 95,45 100,45 C105,45 115,48 120,52 C115,55 105,56 100,56 C95,56 85,55 80,52Z" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 目（鋭く知的） */}
        <path d="M84,62 C86,58 92,58 94,62" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="89" cy="61" r="2.5" fill={c1} opacity="0.8" />
        <path d="M116,62 C114,58 108,58 106,62" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="111" cy="61" r="2.5" fill={c1} opacity="0.8" />
        {/* 鼻・口 */}
        <ellipse cx="100" cy="72" rx="5" ry="3" fill="none" stroke={c2} strokeWidth="1" />
        <path d="M92,80 Q100,85 108,80" fill="none" stroke={c1} strokeWidth="1.2" />
        {/* 胴体 */}
        <path d="M84,96 C80,106 78,118 80,132 C82,142 90,150 100,152 C110,150 118,142 120,132 C122,118 120,106 116,96" fill="none" stroke={c1} strokeWidth="2" />
        {/* 腕（長い） */}
        <path d="M78,105 C68,110 58,118 52,128 C48,136 52,140 58,138 C62,136 60,130 64,124" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M122,105 C132,110 142,118 148,128 C152,136 148,140 142,138 C138,136 140,130 136,124" fill="none" stroke={c1} strokeWidth="1.5" />
        {/* 宝珠を持つ手 */}
        <circle cx="55" cy="135" r="5" fill="none" stroke={c2} strokeWidth="1" />
        <circle cx="55" cy="135" r="2" fill={c1} opacity="0.4" />
        {/* 尻尾（巻き尻尾） */}
        <path d="M108,148 C118,152 128,148 132,140 C136,132 132,126 126,128 C122,130 125,136 128,132" fill="none" stroke={c1} strokeWidth="1.5" />
        {/* 瑞雲 */}
        <CloudWisp x={38} y={45} color={c1} opacity={0.2} />
        <CloudWisp x={158} y={50} color={c1} opacity={0.15} scale={0.8} />
      </g>
    ),

    // 酉(鶏) - 暁を告げる鳳鶏
    '酉': (
      <g>
        {/* 光の放射 */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i * Math.PI) / 3 - Math.PI / 2;
          const x1 = 100 + Math.cos(a) * 68;
          const y1 = 70 + Math.sin(a) * 68;
          const x2 = 100 + Math.cos(a) * 80;
          const y2 = 70 + Math.sin(a) * 80;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c4} strokeWidth="0.5" />;
        })}
        {/* 冠羽（豪華な3本） */}
        <path d="M92,32 C88,18 84,5 88,2 C92,0 96,14 96,26" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M100,28 C100,12 102,0 106,0 C110,0 108,15 106,25" fill="none" stroke={c1} strokeWidth="1.8" />
        <path d="M108,32 C114,20 120,10 118,5 C116,2 110,12 108,24" fill="none" stroke={c2} strokeWidth="1.2" />
        {/* 冠（とさか）の装飾 */}
        <path d="M88,8 C90,12 94,14 96,18" fill="none" stroke={c3} strokeWidth="0.6" />
        {/* 頭部 */}
        <path d="M76,48 C82,38 90,32 100,32 C110,32 118,38 124,48 C130,58 130,72 124,80 C118,88 110,92 100,92 C90,92 82,88 76,80 C70,72 70,58 76,48Z" fill="none" stroke={c1} strokeWidth="2.2" />
        {/* 目 */}
        <path d="M84,58 C86,54 92,54 94,58" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="89" cy="57" r="2" fill={c1} opacity="0.8" />
        <path d="M116,58 C114,54 108,54 106,58" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="111" cy="57" r="2" fill={c1} opacity="0.8" />
        {/* 嘴 */}
        <path d="M96,68 L100,62 L104,68 L100,72Z" fill="none" stroke={c1} strokeWidth="1.5" />
        <line x1="100" y1="62" x2="100" y2="72" stroke={c2} strokeWidth="0.5" />
        {/* 肉垂 */}
        <path d="M98,72 C96,78 94,82 96,84 C98,86 100,82 100,78" fill="none" stroke={c2} strokeWidth="1" />
        {/* 胴体 */}
        <path d="M82,90 C78,100 76,115 80,130 C84,142 92,150 100,152 C108,150 116,142 120,130 C124,115 122,100 118,90" fill="none" stroke={c1} strokeWidth="2" />
        {/* 翼（広げた） */}
        <path d="M78,100 C65,95 50,92 42,98 C36,104 42,110 52,108 C60,106 70,105 78,108" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M46,100 C44,105 48,108 52,106" fill="none" stroke={c3} strokeWidth="0.7" />
        <path d="M122,100 C135,95 150,92 158,98 C164,104 158,110 148,108 C140,106 130,105 122,108" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M154,100 C156,105 152,108 148,106" fill="none" stroke={c3} strokeWidth="0.7" />
        {/* 尾羽（豪華） */}
        <path d="M95,148 C88,155 78,162 68,165 C60,168 58,172 62,174" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M100,150 C100,160 98,170 95,178" fill="none" stroke={c2} strokeWidth="1.2" />
        <path d="M105,148 C112,155 122,162 132,165 C140,168 142,172 138,174" fill="none" stroke={c1} strokeWidth="1.5" />
        {/* 脚 */}
        <path d="M92,148 L90,165 M108,148 L110,165" fill="none" stroke={c2} strokeWidth="1.2" />
        {/* 瑞雲 */}
        <CloudWisp x={35} y={55} color={c1} opacity={0.18} />
        <CloudWisp x={162} y={55} color={c1} opacity={0.15} scale={0.7} />
      </g>
    ),

    // 戌(犬) - 忠義を貫く神犬
    '戌': (
      <g>
        {/* 耳（立ち耳） */}
        <path d="M72,50 C65,30 60,18 65,14 C70,10 78,22 80,38 C81,44 80,48 78,52" fill="none" stroke={c1} strokeWidth="2.2" />
        <path d="M72,28 C70,22 72,18 74,22" fill="none" stroke={c2} strokeWidth="0.8" />
        <path d="M128,50 C135,30 140,18 135,14 C130,10 122,22 120,38 C119,44 120,48 122,52" fill="none" stroke={c1} strokeWidth="2.2" />
        <path d="M128,28 C130,22 128,18 126,22" fill="none" stroke={c2} strokeWidth="0.8" />
        {/* 頭部 */}
        <path d="M74,52 C78,42 88,36 100,36 C112,36 122,42 126,52 C132,65 132,78 126,88 C120,96 112,100 100,102 C88,100 80,96 74,88 C68,78 68,65 74,52Z" fill="none" stroke={c1} strokeWidth="2.5" />
        {/* 額の模様 */}
        <path d="M92,45 L100,40 L108,45" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 目（忠実な目） */}
        <ellipse cx="86" cy="62" rx="5" ry="5" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="87" cy="61" r="2.5" fill={c1} opacity="0.7" />
        <circle cx="88" cy="60" r="0.8" fill="white" opacity="0.4" />
        <ellipse cx="114" cy="62" rx="5" ry="5" fill="none" stroke={c1} strokeWidth="1.2" />
        <circle cx="115" cy="61" r="2.5" fill={c1} opacity="0.7" />
        <circle cx="116" cy="60" r="0.8" fill="white" opacity="0.4" />
        {/* 鼻 */}
        <ellipse cx="100" cy="74" rx="6" ry="4" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="100" cy="73" r="2" fill={c1} opacity="0.4" />
        {/* 口 */}
        <path d="M94,82 Q100,88 106,82" fill="none" stroke={c2} strokeWidth="1.2" />
        <path d="M100,78 L100,82" stroke={c2} strokeWidth="0.8" />
        {/* 胴体 */}
        <path d="M82,98 C78,108 76,122 78,136 C80,148 90,155 100,156 C110,155 120,148 122,136 C124,122 122,108 118,98" fill="none" stroke={c1} strokeWidth="2" />
        {/* 前脚 */}
        <path d="M82,130 C74,136 70,144 72,150 L78,150" fill="none" stroke={c2} strokeWidth="1.5" />
        <path d="M118,130 C126,136 130,144 128,150 L122,150" fill="none" stroke={c2} strokeWidth="1.5" />
        {/* 尻尾（巻き上がる） */}
        <path d="M112,152 C122,155 132,150 136,140 C140,130 136,122 130,125 C126,128 130,135 134,132" fill="none" stroke={c1} strokeWidth="1.8" />
        {/* 首の装飾 */}
        <path d="M78,95 C85,92 95,90 100,90 C105,90 115,92 122,95" fill="none" stroke={c3} strokeWidth="0.8" />
        {/* 瑞雲 */}
        <CloudWisp x={42} y={42} color={c1} opacity={0.2} />
        <CloudWisp x={155} y={48} color={c1} opacity={0.15} scale={0.8} />
        <CloudWisp x={40} y={130} color={c1} opacity={0.1} scale={0.5} />
      </g>
    ),

    // 亥(猪) - 山を駆ける猛猪
    '亥': (
      <g>
        {/* 疾走感のライン */}
        <path d="M40,80 L55,78" stroke={c4} strokeWidth="0.5" />
        <path d="M38,90 L52,88" stroke={c4} strokeWidth="0.4" />
        <path d="M42,100 L55,98" stroke={c4} strokeWidth="0.3" />
        {/* 耳（小さく立った） */}
        <path d="M72,42 C68,30 72,22 78,24 C82,26 80,35 78,42" fill="none" stroke={c1} strokeWidth="1.8" />
        <path d="M128,42 C132,30 128,22 122,24 C118,26 120,35 122,42" fill="none" stroke={c1} strokeWidth="1.8" />
        {/* 頭部（力強い） */}
        <path d="M70,48 C76,38 88,32 100,32 C112,32 124,38 130,48 C136,60 138,75 134,88 C130,98 120,105 100,108 C80,105 70,98 66,88 C62,75 64,60 70,48Z" fill="none" stroke={c1} strokeWidth="2.8" />
        {/* 額の模様（三本線） */}
        <line x1="88" y1="42" x2="92" y2="55" stroke={c2} strokeWidth="1.2" />
        <line x1="100" y1="40" x2="100" y2="54" stroke={c2} strokeWidth="1.2" />
        <line x1="112" y1="42" x2="108" y2="55" stroke={c2} strokeWidth="1.2" />
        {/* 目（鋭い小さな目） */}
        <path d="M82,62 L78,66 L86,66" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="82" cy="65" r="2" fill={c1} opacity="0.8" />
        <path d="M118,62 L122,66 L114,66" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="118" cy="65" r="2" fill={c1} opacity="0.8" />
        {/* 鼻（大きい） */}
        <ellipse cx="100" cy="80" rx="10" ry="7" fill="none" stroke={c1} strokeWidth="1.5" />
        <circle cx="95" cy="79" r="2" fill="none" stroke={c2} strokeWidth="0.8" />
        <circle cx="105" cy="79" r="2" fill="none" stroke={c2} strokeWidth="0.8" />
        {/* 牙 */}
        <path d="M86,88 C84,94 82,98 84,100" fill="none" stroke={c1} strokeWidth="1.5" />
        <path d="M114,88 C116,94 118,98 116,100" fill="none" stroke={c1} strokeWidth="1.5" />
        {/* 胴体（がっしり） */}
        <path d="M78,105 C72,118 70,132 74,145 C78,155 90,162 100,162 C110,162 122,155 126,145 C130,132 128,118 122,105" fill="none" stroke={c1} strokeWidth="2.2" />
        {/* 剛毛の表現 */}
        <path d="M82,115 L78,112 M86,125 L82,122 M90,135 L86,132" stroke={c3} strokeWidth="0.8" />
        <path d="M118,115 L122,112 M114,125 L118,122 M110,135 L114,132" stroke={c3} strokeWidth="0.8" />
        {/* 蹄 */}
        <path d="M84,158 L82,172 L88,172 M116,158 L118,172 L112,172" fill="none" stroke={c2} strokeWidth="1.5" />
        {/* 瑞雲 */}
        <CloudWisp x={42} y={38} color={c1} opacity={0.2} />
        <CloudWisp x={155} y={45} color={c1} opacity={0.18} scale={0.9} />
        <CloudWisp x={155} y={130} color={c1} opacity={0.1} scale={0.5} />
      </g>
    ),
  };

  return <>{arts[shi]}</>;
}

interface ZodiacCharacterProps {
  shi: Junishi;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ZodiacCharacter({ shi, size = 'md' }: ZodiacCharacterProps) {
  const info = ZODIAC_MAP[shi];
  const dims = { sm: 100, md: 140, lg: 200, xl: 280 };
  const d = dims[size];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: d, height: d }}>
        {/* 外周グロー */}
        <div
          className="absolute inset-0 rounded-full blur-3xl scale-[1.5] animate-gentle-pulse"
          style={{ backgroundColor: info.glow }}
        />

        {/* 外側装飾リング */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-slow-spin" style={{ opacity: 0.25 }}>
          <defs>
            <linearGradient id={`zg-${shi}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={info.color} stopOpacity="0.8" />
              <stop offset="50%" stopColor={info.color} stopOpacity="0.1" />
              <stop offset="100%" stopColor={info.color} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#zg-${shi})`} strokeWidth="0.4" />
          <circle cx="100" cy="100" r="93" fill="none" stroke={info.color} strokeWidth="0.2" strokeDasharray="3 5" opacity="0.3" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const x1 = 100 + Math.cos(a) * 93;
            const y1 = 100 + Math.sin(a) * 93;
            const x2 = 100 + Math.cos(a) * 97;
            const y2 = 100 + Math.sin(a) * 97;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={info.color} strokeWidth="0.6" opacity="0.4" />;
          })}
        </svg>

        {/* メインSVGアート */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ filter: `drop-shadow(0 0 12px ${info.glow})` }}>
          <ZodiacArt shi={shi} color={info.color} />
        </svg>
      </div>

      {/* ラベル */}
      <div className="text-center space-y-1">
        <p className="text-xl font-black tracking-[0.2em]" style={{ color: info.color, textShadow: `0 0 15px ${info.glow}` }}>
          {info.kanji} ─ {info.animal}
        </p>
        <p className="text-[0.65rem] tracking-[0.25em]" style={{ color: `${info.color}70` }}>
          {info.element}行 / {info.trait}
        </p>
      </div>
    </div>
  );
}

export function ZodiacBadge({ shi }: { shi: Junishi }) {
  const info = ZODIAC_MAP[shi];
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm"
      style={{
        color: info.color,
        borderColor: `${info.color}30`,
        backgroundColor: `${info.color}08`,
        boxShadow: `0 0 15px ${info.glow}`,
      }}
    >
      <span className="font-bold">{info.kanji}</span>
      <span className="text-xs opacity-70">{info.animal}</span>
      <span className="w-px h-3 opacity-30" style={{ backgroundColor: info.color }} />
      <span className="text-xs opacity-50">{info.element}行</span>
    </span>
  );
}

export { ZODIAC_MAP };
