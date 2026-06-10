"use client";

type IconType = 'essence' | 'love' | 'work' | 'yearly' | 'complete';

interface SectionIconProps {
  type: IconType;
  size?: number;
}

const COLORS: Record<IconType, { primary: string; glow: string }> = {
  essence: { primary: '#B39DDB', glow: 'rgba(179,157,219,0.25)' },
  love: { primary: '#F48FB1', glow: 'rgba(244,143,177,0.25)' },
  work: { primary: '#FFB74D', glow: 'rgba(255,183,77,0.25)' },
  yearly: { primary: '#81C784', glow: 'rgba(129,199,132,0.25)' },
  complete: { primary: '#d4a017', glow: 'rgba(212,160,23,0.25)' },
};

export function SectionIcon({ type, size = 80 }: SectionIconProps) {
  const { primary, glow } = COLORS[type];
  const c = size / 2;
  const r = size * 0.35;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* グロー */}
      <div
        className="absolute inset-0 rounded-full blur-2xl scale-[2] animate-gentle-pulse"
        style={{ backgroundColor: glow }}
      />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
        <defs>
          <linearGradient id={`icon-grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={primary} stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* 外周 */}
        <circle cx={c} cy={c} r={r + 6} fill="none" stroke={primary} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
        <circle cx={c} cy={c} r={r + 2} fill="none" stroke={primary} strokeWidth="0.3" opacity="0.2" />

        {/* 内側の背景 */}
        <circle cx={c} cy={c} r={r} fill={`${primary}08`} stroke={primary} strokeWidth="0.8" opacity="0.5" />

        {/* アイコン本体 */}
        {type === 'essence' && (
          // 魂・本質 - 菱形の中に点
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.8">
            <path d="M0,-14 L10,0 L0,14 L-10,0 Z" />
            <path d="M0,-8 L6,0 L0,8 L-6,0 Z" strokeWidth="0.6" opacity="0.5" />
            <circle cx="0" cy="0" r="2" fill={primary} opacity="0.7" />
          </g>
        )}
        {type === 'love' && (
          // 恋愛 - 二つの重なる円
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.8">
            <circle cx="-5" cy="-2" r="9" />
            <circle cx="5" cy="-2" r="9" />
            <circle cx="0" cy="6" r="1.5" fill={primary} opacity="0.5" />
          </g>
        )}
        {type === 'work' && (
          // 仕事 - 上昇する矢印と横線
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.8">
            <line x1="-12" y1="10" x2="12" y2="10" />
            <line x1="-8" y1="4" x2="8" y2="4" strokeWidth="0.8" opacity="0.6" />
            <line x1="0" y1="4" x2="0" y2="-12" />
            <polyline points="-5,-7 0,-12 5,-7" fill="none" />
          </g>
        )}
        {type === 'yearly' && (
          // 今年の運 - 太陽と月
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.8">
            <circle cx="-3" cy="0" r="8" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 8;
              const x1 = -3 + Math.cos(a) * 11;
              const y1 = Math.sin(a) * 11;
              const x2 = -3 + Math.cos(a) * 14;
              const y2 = Math.sin(a) * 14;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.8" opacity="0.4" />;
            })}
            <path d="M5,-8 A7,7 0 0,1 5,6 A5,5 0 0,0 5,-8" fill={primary} opacity="0.2" />
          </g>
        )}
        {type === 'complete' && (
          // 完了 - 円の中の三角
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.8">
            <circle cx="0" cy="0" r="12" />
            <circle cx="0" cy="0" r="8" strokeWidth="0.5" opacity="0.4" />
            <path d="M0,-6 L5.2,3 L-5.2,3 Z" fill={primary} opacity="0.3" />
          </g>
        )}
      </svg>
    </div>
  );
}

export { COLORS as SECTION_COLORS };
