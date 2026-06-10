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

// 十二支ごとの中国神獣風SVGパス
// viewBox="0 0 200 200" 前提
function ZodiacArt({ shi, color }: { shi: Junishi; color: string }) {
  const c1 = color;
  const c2 = `${color}80`;
  const c3 = `${color}40`;

  const arts: Record<Junishi, React.ReactNode> = {
    // 子(鼠) - 敏捷で賢い小さな神獣
    '子': (
      <g>
        <path d="M100,55 C115,50 130,55 135,65 C140,75 135,80 130,78 C125,76 128,70 125,65 C122,60 115,58 110,60" fill="none" stroke={c1} strokeWidth="1.8"/>
        <path d="M100,55 C85,50 70,55 65,65 C60,75 65,80 70,78 C75,76 72,70 75,65 C78,60 85,58 90,60" fill="none" stroke={c1} strokeWidth="1.8"/>
        <path d="M80,72 C85,80 90,90 88,105 C86,115 80,125 85,135 C90,145 100,148 110,145 C120,142 125,130 120,120 C115,110 108,100 110,90 C112,80 115,75 120,72" fill="none" stroke={c1} strokeWidth="2"/>
        <circle cx="88" cy="65" r="2" fill={c1} opacity="0.8"/>
        <circle cx="112" cy="65" r="2" fill={c1} opacity="0.8"/>
        <path d="M115,140 C125,145 140,140 145,130" fill="none" stroke={c2} strokeWidth="1.2" strokeDasharray="3 2"/>
        <path d="M60,85 Q55,80 50,82 Q45,84 50,88" fill="none" stroke={c3} strokeWidth="1"/>
        <path d="M140,85 Q145,80 150,82 Q155,84 150,88" fill="none" stroke={c3} strokeWidth="1"/>
      </g>
    ),
    // 丑(牛) - 威厳ある神牛
    '丑': (
      <g>
        <path d="M65,70 C55,55 50,45 55,40 C60,35 65,42 68,50" fill="none" stroke={c1} strokeWidth="2"/>
        <path d="M135,70 C145,55 150,45 145,40 C140,35 135,42 132,50" fill="none" stroke={c1} strokeWidth="2"/>
        <path d="M70,65 C75,60 85,55 100,55 C115,55 125,60 130,65 C135,70 138,80 135,95 C132,110 125,125 120,135 C115,145 105,150 100,150 C95,150 85,145 80,135 C75,125 68,110 65,95 C62,80 65,70 70,65Z" fill="none" stroke={c1} strokeWidth="2.2"/>
        <circle cx="85" cy="72" r="3" fill={c1} opacity="0.7"/>
        <circle cx="115" cy="72" r="3" fill={c1} opacity="0.7"/>
        <path d="M90,90 C95,95 105,95 110,90" fill="none" stroke={c2} strokeWidth="1.5"/>
        <path d="M75,100 L70,105 M125,100 L130,105" stroke={c3} strokeWidth="1"/>
        <path d="M85,130 Q100,140 115,130" fill="none" stroke={c3} strokeWidth="1" strokeDasharray="2 2"/>
      </g>
    ),
    // 寅(虎) - 猛々しい神虎
    '寅': (
      <g>
        <path d="M65,60 C60,45 65,35 75,38 C80,40 78,50 75,55" fill="none" stroke={c1} strokeWidth="2"/>
        <path d="M135,60 C140,45 135,35 125,38 C120,40 122,50 125,55" fill="none" stroke={c1} strokeWidth="2"/>
        <path d="M72,55 C80,48 90,45 100,45 C110,45 120,48 128,55 C135,62 140,75 138,90 C136,105 128,120 118,132 C110,142 105,150 100,152 C95,150 90,142 82,132 C72,120 64,105 62,90 C60,75 65,62 72,55Z" fill="none" stroke={c1} strokeWidth="2.5"/>
        <path d="M100,48 L100,65 M90,52 L95,62 M110,52 L105,62" stroke={c2} strokeWidth="1.2"/>
        <path d="M82,68 L78,72 L85,72 M118,68 L122,72 L115,72" fill="none" stroke={c1} strokeWidth="1.8"/>
        <circle cx="87" cy="75" r="2.5" fill={c1} opacity="0.8"/>
        <circle cx="113" cy="75" r="2.5" fill={c1} opacity="0.8"/>
        <path d="M95,88 L100,92 L105,88" fill="none" stroke={c2} strokeWidth="1.5"/>
        <path d="M85,95 Q100,105 115,95" fill="none" stroke={c1} strokeWidth="1.5"/>
        <path d="M70,110 Q65,120 68,130" fill="none" stroke={c3} strokeWidth="1" strokeDasharray="3 2"/>
        <path d="M130,110 Q135,120 132,130" fill="none" stroke={c3} strokeWidth="1" strokeDasharray="3 2"/>
      </g>
    ),
    // 卯(兎) - 優美な玉兎
    '卯': (
      <g>
        <path d="M85,65 C82,40 78,20 82,15 C86,10 92,18 90,35 C89,45 88,55 88,62" fill="none" stroke={c1} strokeWidth="1.8"/>
        <path d="M115,65 C118,40 122,20 118,15 C114,10 108,18 110,35 C111,45 112,55 112,62" fill="none" stroke={c1} strokeWidth="1.8"/>
        <path d="M78,68 C82,60 90,55 100,55 C110,55 118,60 122,68 C126,76 128,88 125,100 C122,112 115,125 110,133 C106,140 103,148 100,150 C97,148 94,140 90,133 C85,125 78,112 75,100 C72,88 74,76 78,68Z" fill="none" stroke={c1} strokeWidth="2"/>
        <circle cx="90" cy="73" r="3" fill={c1} opacity="0.6"/>
        <circle cx="110" cy="73" r="3" fill={c1} opacity="0.6"/>
        <path d="M97,82 C99,84 101,84 103,82" fill="none" stroke={c2} strokeWidth="1.2"/>
        <path d="M85,92 Q100,100 115,92" fill="none" stroke={c3} strokeWidth="1"/>
        <path d="M55,75 Q50,70 48,75 Q46,80 52,78" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M145,75 Q150,70 152,75 Q154,80 148,78" fill="none" stroke={c3} strokeWidth="0.8"/>
      </g>
    ),
    // 辰(龍) - 至高の神龍
    '辰': (
      <g>
        <path d="M60,55 C55,40 60,30 70,28 C75,27 72,38 70,45" fill="none" stroke={c1} strokeWidth="2"/>
        <path d="M140,55 C145,40 140,30 130,28 C125,27 128,38 130,45" fill="none" stroke={c1} strokeWidth="2"/>
        <path d="M68,50 C78,42 88,38 100,38 C112,38 122,42 132,50 C140,58 142,68 138,78 C134,88 126,92 120,88 C118,82 125,78 122,72 C119,66 110,62 100,62 C90,62 81,66 78,72 C75,78 82,82 80,88 C74,92 66,88 62,78 C58,68 60,58 68,50Z" fill="none" stroke={c1} strokeWidth="2.5"/>
        <circle cx="88" cy="58" r="3" fill={c1} opacity="0.9"/>
        <circle cx="112" cy="58" r="3" fill={c1} opacity="0.9"/>
        <path d="M95,68 L100,72 L105,68" fill="none" stroke={c2} strokeWidth="1.5"/>
        <path d="M100,82 C105,95 115,105 120,118 C125,130 118,145 105,148 C100,149 95,148 90,145" fill="none" stroke={c1} strokeWidth="2" strokeDasharray="5 3"/>
        <path d="M90,145 C80,140 75,130 80,118 C85,105 95,95 100,82" fill="none" stroke={c2} strokeWidth="1.5" strokeDasharray="5 3"/>
        <path d="M50,48 Q45,42 42,46 Q40,52 46,50" fill="none" stroke={c3} strokeWidth="1"/>
        <path d="M150,48 Q155,42 158,46 Q160,52 154,50" fill="none" stroke={c3} strokeWidth="1"/>
        <path d="M45,90 Q40,85 38,90 Q36,95 42,93" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M155,90 Q160,85 162,90 Q164,95 158,93" fill="none" stroke={c3} strokeWidth="0.8"/>
      </g>
    ),
    // 巳(蛇) - 神秘の霊蛇
    '巳': (
      <g>
        <path d="M100,40 C115,38 125,42 130,50 C135,58 132,68 125,72 C118,76 110,74 108,80 C106,88 115,92 118,100 C122,110 118,125 108,135 C98,145 85,148 78,140 C72,132 75,120 82,112 C88,105 92,98 88,90 C84,82 75,80 72,72 C68,62 72,50 82,44 C88,40 95,39 100,40Z" fill="none" stroke={c1} strokeWidth="2.2"/>
        <circle cx="95" cy="50" r="2.5" fill={c1} opacity="0.8"/>
        <circle cx="108" cy="50" r="2.5" fill={c1} opacity="0.8"/>
        <path d="M98,55 L100,58 L102,55" fill="none" stroke={c2} strokeWidth="1"/>
        <path d="M55,65 Q50,58 47,62 Q44,68 50,66" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M148,68 Q153,62 155,66 Q157,72 151,70" fill="none" stroke={c3} strokeWidth="0.8"/>
      </g>
    ),
    // 午(馬) - 天駆ける神馬
    '午': (
      <g>
        <path d="M95,35 C90,25 85,18 88,15 C92,12 98,22 100,30 M105,35 C110,25 115,18 112,15 C108,12 102,22 100,30" fill="none" stroke={c1} strokeWidth="1.5"/>
        <path d="M78,55 C82,45 90,38 100,38 C110,38 118,45 122,55 C126,65 125,75 120,82 C115,88 108,90 100,90 C92,90 85,88 80,82 C75,75 74,65 78,55Z" fill="none" stroke={c1} strokeWidth="2.2"/>
        <circle cx="90" cy="60" r="2.5" fill={c1} opacity="0.8"/>
        <circle cx="110" cy="60" r="2.5" fill={c1} opacity="0.8"/>
        <path d="M95,72 Q100,76 105,72" fill="none" stroke={c2} strokeWidth="1.5"/>
        <path d="M100,90 C100,100 95,110 90,120 C85,130 82,140 85,148 M100,90 C100,100 105,110 110,120 C115,130 118,140 115,148" fill="none" stroke={c1} strokeWidth="1.8"/>
        <path d="M85,148 C80,155 82,160 88,158 M115,148 C120,155 118,160 112,158" fill="none" stroke={c2} strokeWidth="1.2"/>
        <path d="M55,50 Q48,45 46,50 Q44,56 50,54" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M145,50 Q152,45 154,50 Q156,56 150,54" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M60,90 Q55,85 53,90" fill="none" stroke={c3} strokeWidth="0.6"/>
        <path d="M140,90 Q145,85 147,90" fill="none" stroke={c3} strokeWidth="0.6"/>
      </g>
    ),
    // 未(羊) - 温雅な瑞羊
    '未': (
      <g>
        <path d="M80,55 C75,42 78,32 85,30 C90,28 88,38 86,45" fill="none" stroke={c1} strokeWidth="1.8"/>
        <path d="M120,55 C125,42 122,32 115,30 C110,28 112,38 114,45" fill="none" stroke={c1} strokeWidth="1.8"/>
        <path d="M72,60 C65,55 60,60 62,68 C64,75 70,72 72,68" fill="none" stroke={c2} strokeWidth="1.2"/>
        <path d="M128,60 C135,55 140,60 138,68 C136,75 130,72 128,68" fill="none" stroke={c2} strokeWidth="1.2"/>
        <path d="M75,58 C80,50 90,45 100,45 C110,45 120,50 125,58 C130,66 132,78 130,92 C128,106 122,120 115,132 C110,140 105,148 100,150 C95,148 90,140 85,132 C78,120 72,106 70,92 C68,78 70,66 75,58Z" fill="none" stroke={c1} strokeWidth="2"/>
        <circle cx="90" cy="68" r="2.5" fill={c1} opacity="0.6"/>
        <circle cx="110" cy="68" r="2.5" fill={c1} opacity="0.6"/>
        <path d="M95,78 Q100,82 105,78" fill="none" stroke={c2} strokeWidth="1.2"/>
        <path d="M80,95 Q75,100 78,108 M120,95 Q125,100 122,108" fill="none" stroke={c3} strokeWidth="1" strokeDasharray="2 2"/>
      </g>
    ),
    // 申(猿) - 機知の神猿
    '申': (
      <g>
        <path d="M72,65 C65,60 58,62 58,70 C58,78 65,80 72,76" fill="none" stroke={c1} strokeWidth="1.5"/>
        <path d="M128,65 C135,60 142,62 142,70 C142,78 135,80 128,76" fill="none" stroke={c1} strokeWidth="1.5"/>
        <path d="M75,55 C80,45 90,40 100,40 C110,40 120,45 125,55 C130,65 130,78 126,90 C122,102 115,112 108,120 C104,126 102,135 100,140 C98,135 96,126 92,120 C85,112 78,102 74,90 C70,78 70,65 75,55Z" fill="none" stroke={c1} strokeWidth="2.2"/>
        <circle cx="90" cy="62" r="3" fill={c1} opacity="0.7"/>
        <circle cx="110" cy="62" r="3" fill={c1} opacity="0.7"/>
        <path d="M95,75 Q100,78 105,75" fill="none" stroke={c2} strokeWidth="1.2"/>
        <path d="M100,140 C95,148 92,155 95,158 M100,140 C105,148 108,155 105,158" fill="none" stroke={c2} strokeWidth="1.2"/>
        <path d="M55,55 Q50,50 48,55 Q46,60 52,58" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M145,55 Q150,50 152,55 Q154,60 148,58" fill="none" stroke={c3} strokeWidth="0.8"/>
      </g>
    ),
    // 酉(鶏) - 鳳凰の如き神鶏
    '酉': (
      <g>
        <path d="M90,38 C85,28 88,18 95,15 C100,13 102,20 100,28 C98,35 95,38 95,42" fill="none" stroke={c1} strokeWidth="1.5"/>
        <path d="M110,38 C115,28 118,20 115,15 C112,12 108,18 108,28" fill="none" stroke={c2} strokeWidth="1.2"/>
        <path d="M105,38 C112,25 120,22 118,18" fill="none" stroke={c3} strokeWidth="1"/>
        <path d="M78,58 C82,48 90,42 100,42 C110,42 118,48 122,58 C126,68 125,80 120,88 C115,96 108,100 100,100 C92,100 85,96 80,88 C75,80 74,68 78,58Z" fill="none" stroke={c1} strokeWidth="2.2"/>
        <circle cx="90" cy="62" r="2.5" fill={c1} opacity="0.8"/>
        <circle cx="110" cy="62" r="2.5" fill={c1} opacity="0.8"/>
        <path d="M100,72 L103,68 L106,72" fill="none" stroke={c2} strokeWidth="1.5"/>
        <path d="M100,100 C98,110 92,120 88,130 C84,140 86,150 92,155 C98,160 106,155 108,148 M100,100 C102,110 108,120 112,130 C116,140 114,150 108,148" fill="none" stroke={c1} strokeWidth="1.8"/>
        <path d="M82,130 Q75,135 72,145 M118,130 Q125,135 128,145" fill="none" stroke={c3} strokeWidth="1" strokeDasharray="3 2"/>
      </g>
    ),
    // 戌(犬) - 忠義の神犬
    '戌': (
      <g>
        <path d="M75,60 C68,45 62,38 65,32 C68,28 75,35 78,45" fill="none" stroke={c1} strokeWidth="2"/>
        <path d="M125,60 C132,45 138,38 135,32 C132,28 125,35 122,45" fill="none" stroke={c1} strokeWidth="2"/>
        <path d="M78,55 C82,48 90,42 100,42 C110,42 118,48 122,55 C128,65 130,78 128,92 C126,106 120,118 112,128 C106,136 103,145 100,150 C97,145 94,136 88,128 C80,118 74,106 72,92 C70,78 72,65 78,55Z" fill="none" stroke={c1} strokeWidth="2.2"/>
        <circle cx="90" cy="65" r="3" fill={c1} opacity="0.7"/>
        <circle cx="110" cy="65" r="3" fill={c1} opacity="0.7"/>
        <path d="M95,78 Q100,82 105,78" fill="none" stroke={c2} strokeWidth="1.5"/>
        <path d="M92,85 Q100,92 108,85" fill="none" stroke={c1} strokeWidth="1.2"/>
        <path d="M55,70 Q48,65 46,70 Q44,76 50,74" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M145,70 Q152,65 154,70 Q156,76 150,74" fill="none" stroke={c3} strokeWidth="0.8"/>
      </g>
    ),
    // 亥(猪) - 突進する神猪
    '亥': (
      <g>
        <path d="M70,62 C62,58 55,60 55,68 C55,75 62,76 68,72" fill="none" stroke={c1} strokeWidth="1.5"/>
        <path d="M130,62 C138,58 145,60 145,68 C145,75 138,76 132,72" fill="none" stroke={c1} strokeWidth="1.5"/>
        <path d="M72,55 C78,45 88,40 100,40 C112,40 122,45 128,55 C134,65 136,78 134,92 C132,106 126,120 118,132 C112,142 106,150 100,152 C94,150 88,142 82,132 C74,120 68,106 66,92 C64,78 66,65 72,55Z" fill="none" stroke={c1} strokeWidth="2.5"/>
        <circle cx="88" cy="65" r="3" fill={c1} opacity="0.8"/>
        <circle cx="112" cy="65" r="3" fill={c1} opacity="0.8"/>
        <path d="M95,78 L98,82 M105,78 L102,82" stroke={c2} strokeWidth="1.5"/>
        <path d="M90,88 Q100,95 110,88" fill="none" stroke={c1} strokeWidth="1.5"/>
        <path d="M55,50 Q48,44 45,50 Q42,56 48,54" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M145,50 Q152,44 155,50 Q158,56 152,54" fill="none" stroke={c3} strokeWidth="0.8"/>
        <path d="M50,85 Q45,80 43,85" fill="none" stroke={c3} strokeWidth="0.6"/>
        <path d="M150,85 Q155,80 157,85" fill="none" stroke={c3} strokeWidth="0.6"/>
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
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-slow-spin" style={{ opacity: 0.3 }}>
          <defs>
            <linearGradient id={`zg-${shi}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={info.color} stopOpacity="0.8" />
              <stop offset="50%" stopColor={info.color} stopOpacity="0.1" />
              <stop offset="100%" stopColor={info.color} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="none" stroke={`url(#zg-${shi})`} strokeWidth="0.5" strokeDasharray="4 3" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const x1 = 100 + Math.cos(a) * 92;
            const y1 = 100 + Math.sin(a) * 92;
            const x2 = 100 + Math.cos(a) * 96;
            const y2 = 100 + Math.sin(a) * 96;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={info.color} strokeWidth="0.8" opacity="0.4" />;
          })}
        </svg>

        {/* メインSVGアート */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ filter: `drop-shadow(0 0 8px ${info.glow})` }}>
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
