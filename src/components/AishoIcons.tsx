"use client";

type AishoIconType = 'overall' | 'love' | 'marriage' | 'children' | 'work' | 'money' | 'nisshu' | 'junishi' | 'gogyo' | 'jinkaku' | 'sansai';

interface AishoIconProps {
  type: AishoIconType;
  size?: number;
}

const ICON_COLORS: Record<AishoIconType, { primary: string; glow: string }> = {
  overall:  { primary: '#d4a017', glow: 'rgba(212,160,23,0.20)' },
  love:     { primary: '#F472B6', glow: 'rgba(244,114,182,0.20)' },
  marriage: { primary: '#FB923C', glow: 'rgba(251,146,60,0.20)' },
  children: { primary: '#4ADE80', glow: 'rgba(74,222,128,0.20)' },
  work:     { primary: '#60A5FA', glow: 'rgba(96,165,250,0.20)' },
  money:    { primary: '#FBBF24', glow: 'rgba(251,191,36,0.20)' },
  nisshu:   { primary: '#C084FC', glow: 'rgba(192,132,252,0.20)' },
  junishi:  { primary: '#F0ABFC', glow: 'rgba(240,171,252,0.20)' },
  gogyo:    { primary: '#CE93D8', glow: 'rgba(206,147,216,0.20)' },
  jinkaku:  { primary: '#C084FC', glow: 'rgba(192,132,252,0.20)' },
  sansai:   { primary: '#67E8F9', glow: 'rgba(103,232,249,0.20)' },
};

export function AishoIcon({ type, size = 56 }: AishoIconProps) {
  const { primary, glow } = ICON_COLORS[type];
  const c = size / 2;
  const r = size * 0.35;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full opacity-40" style={{ backgroundColor: glow }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
        <defs>
          <linearGradient id={`aisho-grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={primary} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx={c} cy={c} r={r + 4} fill="none" stroke={primary} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
        <circle cx={c} cy={c} r={r} fill={`${primary}08`} stroke={primary} strokeWidth="0.8" opacity="0.5" />

        {type === 'overall' && (
          // 総合 - 陰陽（二つの半円）
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.85">
            <circle cx="0" cy="0" r="12" strokeWidth="1.2" />
            <path d="M0,-12 A6,6 0 0,1 0,0 A6,6 0 0,0 0,12 A12,12 0 0,1 0,-12" fill={primary} opacity="0.25" />
            <circle cx="0" cy="-6" r="2" fill={primary} opacity="0.6" />
            <circle cx="0" cy="6" r="2" fill="none" strokeWidth="1" />
          </g>
        )}
        {type === 'love' && (
          // 恋愛 - 二つの重なる円弧（絆）
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.85">
            <circle cx="-5" cy="-1" r="8" />
            <circle cx="5" cy="-1" r="8" />
            <circle cx="0" cy="5" r="1.5" fill={primary} opacity="0.5" />
          </g>
        )}
        {type === 'marriage' && (
          // 結婚 - 二つの輪が繋がる
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.85">
            <circle cx="-5" cy="0" r="7" />
            <circle cx="5" cy="0" r="7" />
            <line x1="-1" y1="-10" x2="1" y2="-10" strokeWidth="2" opacity="0.6" />
            <path d="M-1,-10 L0,-13 L1,-10" fill={primary} opacity="0.4" />
          </g>
        )}
        {type === 'children' && (
          // 妊娠・出産 - 大きい円と小さい円（母子）
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.1" opacity="0.85">
            <circle cx="-3" cy="0" r="10" />
            <circle cx="7" cy="5" r="5" />
            <circle cx="-3" cy="0" r="2" fill={primary} opacity="0.3" />
            <circle cx="7" cy="5" r="1.2" fill={primary} opacity="0.3" />
          </g>
        )}
        {type === 'work' && (
          // 仕事 - 上昇矢印
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.85">
            <line x1="-11" y1="10" x2="11" y2="10" />
            <line x1="-7" y1="4" x2="7" y2="4" strokeWidth="0.8" opacity="0.5" />
            <line x1="0" y1="4" x2="0" y2="-11" />
            <polyline points="-4,-7 0,-11 4,-7" />
          </g>
        )}
        {type === 'money' && (
          // 金運 - コインのシンボル
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.1" opacity="0.85">
            <circle cx="0" cy="0" r="11" />
            <circle cx="0" cy="0" r="7" strokeWidth="0.7" opacity="0.5" />
            <text x="0" y="4" textAnchor="middle" fill={primary} fontSize="12" fontFamily="serif" strokeWidth="0" opacity="0.7">¥</text>
          </g>
        )}
        {type === 'nisshu' && (
          // 日主 - 菱形（本質）
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.85">
            <path d="M0,-13 L9,0 L0,13 L-9,0 Z" />
            <path d="M0,-7 L5,0 L0,7 L-5,0 Z" strokeWidth="0.6" opacity="0.5" />
            <circle cx="0" cy="0" r="2" fill={primary} opacity="0.6" />
          </g>
        )}
        {type === 'junishi' && (
          // 十二支 - 十二角形風の星
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.85">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * Math.PI * 2) / 12 - Math.PI / 2;
              const outer = i % 3 === 0 ? 13 : 10;
              return <line key={i} x1="0" y1="0" x2={Math.cos(a) * outer} y2={Math.sin(a) * outer} strokeWidth="0.6" opacity="0.4" />;
            })}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i * Math.PI * 2) / 12 - Math.PI / 2;
              return <circle key={`d${i}`} cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r={i % 3 === 0 ? 1.8 : 1} fill={primary} opacity={i % 3 === 0 ? 0.7 : 0.3} />;
            })}
          </g>
        )}
        {type === 'gogyo' && (
          // 五行 - 五角形
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.85">
            {(() => {
              const pts = Array.from({ length: 5 }, (_, i) => {
                const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
                return `${Math.cos(a) * 12},${Math.sin(a) * 12}`;
              }).join(' ');
              return <polygon points={pts} strokeWidth="1.2" />;
            })()}
            {Array.from({ length: 5 }, (_, i) => {
              const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
              return <circle key={i} cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r="2" fill={primary} opacity="0.5" />;
            })}
          </g>
        )}
        {type === 'jinkaku' && (
          // 人格 - 菱形（日主と同系）
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.85">
            <path d="M0,-13 L9,0 L0,13 L-9,0 Z" />
            <path d="M0,-7 L5,0 L0,7 L-5,0 Z" strokeWidth="0.6" opacity="0.5" />
            <circle cx="0" cy="0" r="2" fill={primary} opacity="0.6" />
          </g>
        )}
        {type === 'sansai' && (
          // 三才 - 天人地の三つの円
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.85">
            <circle cx="0" cy="-10" r="4" />
            <circle cx="0" cy="0" r="4" fill={primary} opacity="0.15" />
            <circle cx="0" cy="10" r="4" />
            <line x1="0" y1="-6" x2="0" y2="-4" strokeWidth="0.8" opacity="0.5" />
            <line x1="0" y1="4" x2="0" y2="6" strokeWidth="0.8" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
}

export { ICON_COLORS as AISHO_ICON_COLORS };
