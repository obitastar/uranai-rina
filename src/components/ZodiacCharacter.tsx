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

// 五行のSVGシンボル
function ElementSymbol({ element, color, size }: { element: string; color: string; size: number }) {
  const s = size;
  const c = s / 2;

  const paths: Record<string, React.ReactNode> = {
    '木': (
      <>
        <line x1={c} y1={s * 0.15} x2={c} y2={s * 0.85} stroke={color} strokeWidth="1.5" opacity="0.6" />
        <line x1={c} y1={s * 0.35} x2={c - s * 0.2} y2={s * 0.2} stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1={c} y1={s * 0.35} x2={c + s * 0.2} y2={s * 0.2} stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1={c} y1={s * 0.55} x2={c - s * 0.15} y2={s * 0.4} stroke={color} strokeWidth="0.8" opacity="0.4" />
        <line x1={c} y1={s * 0.55} x2={c + s * 0.15} y2={s * 0.4} stroke={color} strokeWidth="0.8" opacity="0.4" />
      </>
    ),
    '火': (
      <>
        <path d={`M${c},${s * 0.15} Q${c + s * 0.25},${s * 0.4} ${c},${s * 0.85} Q${c - s * 0.25},${s * 0.4} ${c},${s * 0.15}`} fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
        <path d={`M${c},${s * 0.35} Q${c + s * 0.12},${s * 0.5} ${c},${s * 0.7} Q${c - s * 0.12},${s * 0.5} ${c},${s * 0.35}`} fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      </>
    ),
    '土': (
      <>
        <line x1={c - s * 0.3} y1={s * 0.7} x2={c + s * 0.3} y2={s * 0.7} stroke={color} strokeWidth="1.5" opacity="0.6" />
        <line x1={c - s * 0.15} y1={s * 0.45} x2={c + s * 0.15} y2={s * 0.45} stroke={color} strokeWidth="1.2" opacity="0.5" />
        <line x1={c} y1={s * 0.25} x2={c} y2={s * 0.45} stroke={color} strokeWidth="1.2" opacity="0.5" />
      </>
    ),
    '金': (
      <>
        <polygon points={`${c},${s * 0.15} ${c + s * 0.3},${s * 0.55} ${c + s * 0.18},${s * 0.85} ${c - s * 0.18},${s * 0.85} ${c - s * 0.3},${s * 0.55}`} fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <circle cx={c} cy={s * 0.52} r={s * 0.1} fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      </>
    ),
    '水': (
      <>
        <path d={`M${c - s * 0.25},${s * 0.35} Q${c},${s * 0.2} ${c + s * 0.25},${s * 0.35}`} fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <path d={`M${c - s * 0.3},${s * 0.5} Q${c},${s * 0.35} ${c + s * 0.3},${s * 0.5}`} fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
        <path d={`M${c - s * 0.25},${s * 0.65} Q${c},${s * 0.5} ${c + s * 0.25},${s * 0.65}`} fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      </>
    ),
  };

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      {paths[element]}
    </svg>
  );
}

interface ZodiacCharacterProps {
  shi: Junishi;
  size?: 'sm' | 'md' | 'lg';
}

export function ZodiacCharacter({ shi, size = 'md' }: ZodiacCharacterProps) {
  const info = ZODIAC_MAP[shi];
  const dims = { sm: 80, md: 110, lg: 160 };
  const fontSizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl' };
  const animalFontSizes = { sm: 'text-[0.55rem]', md: 'text-xs', lg: 'text-sm' };
  const d = dims[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: d, height: d }}>
        {/* 外周グロー */}
        <div
          className="absolute inset-0 rounded-full blur-2xl scale-[1.6] animate-gentle-pulse"
          style={{ backgroundColor: info.glow }}
        />

        {/* 外側の装飾リング - 六芒星的パターン */}
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full animate-slow-spin" style={{ opacity: 0.4 }}>
          <defs>
            <linearGradient id={`zodiac-grad-${shi}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={info.color} stopOpacity="0.8" />
              <stop offset="50%" stopColor={info.color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={info.color} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="none" stroke={`url(#zodiac-grad-${shi})`} strokeWidth="0.5" strokeDasharray="4 3" />
          {/* 八方位のティック */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 8;
            const x1 = 60 + Math.cos(a) * 52;
            const y1 = 60 + Math.sin(a) * 52;
            const x2 = 60 + Math.cos(a) * 56;
            const y2 = 60 + Math.sin(a) * 56;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={info.color} strokeWidth="1" opacity="0.5" />;
          })}
        </svg>

        {/* 内側リング - 逆回転 */}
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full animate-slow-spin-reverse" style={{ opacity: 0.3 }}>
          <circle cx="60" cy="60" r="42" fill="none" stroke={info.color} strokeWidth="0.3" strokeDasharray="2 6" />
        </svg>

        {/* メインの円 */}
        <div
          className="absolute inset-[12%] rounded-full flex flex-col items-center justify-center"
          style={{
            background: `radial-gradient(circle at 40% 35%, ${info.glow} 0%, rgba(10,13,28,0.95) 70%)`,
            boxShadow: `0 0 25px ${info.glow}, inset 0 0 15px ${info.glow}`,
            border: `1px solid ${info.color}30`,
          }}
        >
          {/* 干支の漢字 */}
          <span
            className={`${fontSizes[size]} font-black leading-none`}
            style={{
              color: info.color,
              textShadow: `0 0 20px ${info.glow}, 0 0 40px ${info.glow}`,
            }}
          >
            {info.kanji}
          </span>
          {/* 動物名 */}
          <span
            className={`${animalFontSizes[size]} font-medium tracking-[0.2em] mt-0.5`}
            style={{ color: `${info.color}90` }}
          >
            {info.animal}
          </span>
        </div>

        {/* 五行シンボル - 右上 */}
        <div className="absolute -top-1 -right-1" style={{ opacity: 0.7 }}>
          <ElementSymbol element={info.element} color={info.elementColor} size={size === 'lg' ? 28 : size === 'md' ? 22 : 16} />
        </div>
      </div>

      {/* ラベル */}
      <div className="text-center">
        <p className="text-[0.6rem] tracking-[0.3em] font-medium" style={{ color: `${info.color}80` }}>
          {info.element}行 ─ {info.trait}
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
