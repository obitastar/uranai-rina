"use client";

import type { Junishi } from "@/lib/shichusuimei";

interface ZodiacInfo {
  animal: string;
  emoji: string;
  color: string;
  glow: string;
  element: string;
  trait: string;
}

const ZODIAC_MAP: Record<Junishi, ZodiacInfo> = {
  '子': { animal: '鼠', emoji: '🐀', color: '#4FC3F7', glow: 'rgba(79,195,247,0.3)', element: '水', trait: '知恵と機敏さの象徴' },
  '丑': { animal: '牛', emoji: '🐂', color: '#A1887F', glow: 'rgba(161,136,127,0.3)', element: '土', trait: '忍耐と誠実さの象徴' },
  '寅': { animal: '虎', emoji: '🐅', color: '#FF8A65', glow: 'rgba(255,138,101,0.3)', element: '木', trait: '勇気と威厳の象徴' },
  '卯': { animal: '兎', emoji: '🐇', color: '#F48FB1', glow: 'rgba(244,143,177,0.3)', element: '木', trait: '優美と幸運の象徴' },
  '辰': { animal: '龍', emoji: '🐉', color: '#FFD54F', glow: 'rgba(255,213,79,0.4)', element: '土', trait: '権威と繁栄の象徴' },
  '巳': { animal: '蛇', emoji: '🐍', color: '#CE93D8', glow: 'rgba(206,147,216,0.3)', element: '火', trait: '知恵と神秘の象徴' },
  '午': { animal: '馬', emoji: '🐎', color: '#EF5350', glow: 'rgba(239,83,80,0.3)', element: '火', trait: '情熱と行動力の象徴' },
  '未': { animal: '羊', emoji: '🐏', color: '#C5E1A5', glow: 'rgba(197,225,165,0.3)', element: '土', trait: '温和と芸術性の象徴' },
  '申': { animal: '猿', emoji: '🐒', color: '#FFB74D', glow: 'rgba(255,183,77,0.3)', element: '金', trait: '才知と器用さの象徴' },
  '酉': { animal: '鶏', emoji: '🐓', color: '#E0E0E0', glow: 'rgba(224,224,224,0.3)', element: '金', trait: '誠実と先見性の象徴' },
  '戌': { animal: '犬', emoji: '🐕', color: '#BCAAA4', glow: 'rgba(188,170,164,0.3)', element: '土', trait: '忠誠と正義の象徴' },
  '亥': { animal: '猪', emoji: '🐗', color: '#90CAF9', glow: 'rgba(144,202,249,0.3)', element: '水', trait: '勇猛と直進の象徴' },
};

interface ZodiacCharacterProps {
  shi: Junishi;
  size?: 'sm' | 'md' | 'lg';
}

export function ZodiacCharacter({ shi, size = 'md' }: ZodiacCharacterProps) {
  const info = ZODIAC_MAP[shi];
  const sizeClasses = {
    sm: 'w-16 h-16 text-3xl',
    md: 'w-24 h-24 text-5xl',
    lg: 'w-36 h-36 text-7xl',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* 外周グロー */}
        <div
          className="absolute inset-0 rounded-full blur-2xl scale-150 animate-gentle-pulse"
          style={{ backgroundColor: info.glow }}
        />
        {/* 装飾リング */}
        <svg
          viewBox="0 0 100 100"
          className={`absolute inset-0 ${sizeClasses[size].split(' ').slice(0, 2).join(' ')} animate-slow-spin`}
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke={info.color} strokeWidth="0.5" strokeDasharray="3 5" opacity="0.5" />
        </svg>
        {/* メイン */}
        <div
          className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center`}
          style={{
            background: `radial-gradient(circle, ${info.glow} 0%, rgba(10,13,28,0.8) 70%)`,
            boxShadow: `0 0 30px ${info.glow}, inset 0 0 20px ${info.glow}`,
            border: `1px solid ${info.color}40`,
          }}
        >
          <span className="relative z-10 drop-shadow-lg" role="img" aria-label={info.animal}>
            {info.emoji}
          </span>
        </div>
      </div>
      {/* ラベル */}
      <div className="text-center">
        <p className="text-lg font-bold" style={{ color: info.color }}>
          {shi}{info.animal}
        </p>
        <p className="text-[0.65rem] text-navy-400 tracking-wider">{info.trait}</p>
      </div>
    </div>
  );
}

export function ZodiacBadge({ shi }: { shi: Junishi }) {
  const info = ZODIAC_MAP[shi];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border"
      style={{
        color: info.color,
        borderColor: `${info.color}40`,
        backgroundColor: `${info.color}10`,
      }}
    >
      <span>{info.emoji}</span>
      <span>{shi}{info.animal}</span>
    </span>
  );
}

export { ZODIAC_MAP };
