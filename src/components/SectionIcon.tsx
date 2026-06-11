"use client";

type IconType = 'essence' | 'love' | 'work' | 'yearly' | 'gogyo' | 'decade' | 'complete' | 'health' | 'kuubou' | 'shinsatsu' | 'lucky' | 'strength' | 'chishi' | 'daiun';

interface SectionIconProps {
  type: IconType;
  size?: number;
}

const COLORS: Record<IconType, { primary: string; glow: string }> = {
  essence: { primary: '#B39DDB', glow: 'rgba(179,157,219,0.25)' },
  love: { primary: '#F48FB1', glow: 'rgba(244,143,177,0.25)' },
  work: { primary: '#FFB74D', glow: 'rgba(255,183,77,0.25)' },
  yearly: { primary: '#81C784', glow: 'rgba(129,199,132,0.25)' },
  gogyo: { primary: '#CE93D8', glow: 'rgba(206,147,216,0.25)' },
  decade: { primary: '#4FC3F7', glow: 'rgba(79,195,247,0.25)' },
  complete: { primary: '#d4a017', glow: 'rgba(212,160,23,0.25)' },
  health: { primary: '#22d3ee', glow: 'rgba(34,211,238,0.25)' },
  kuubou: { primary: '#a78bfa', glow: 'rgba(167,139,250,0.25)' },
  shinsatsu: { primary: '#fbbf24', glow: 'rgba(251,191,36,0.25)' },
  lucky: { primary: '#f472b6', glow: 'rgba(244,114,182,0.25)' },
  strength: { primary: '#fb923c', glow: 'rgba(251,146,60,0.25)' },
  chishi: { primary: '#94a3b8', glow: 'rgba(148,163,184,0.25)' },
  daiun: { primary: '#a3e635', glow: 'rgba(163,230,53,0.25)' },
};

export function SectionIcon({ type, size = 80 }: SectionIconProps) {
  const { primary, glow } = COLORS[type];
  const c = size / 2;
  const r = size * 0.35;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 静的な軽いグロー */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
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
        {type === 'gogyo' && (
          // 五行 - 五角形
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.8">
            {(() => {
              const pts = Array.from({ length: 5 }, (_, i) => {
                const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
                return `${Math.cos(a) * 13},${Math.sin(a) * 13}`;
              }).join(' ');
              return <polygon points={pts} strokeWidth="1.2" />;
            })()}
            {Array.from({ length: 5 }, (_, i) => {
              const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
              return <circle key={i} cx={Math.cos(a) * 13} cy={Math.sin(a) * 13} r="2" fill={primary} opacity="0.5" />;
            })}
            <circle cx="0" cy="0" r="3" fill={primary} opacity="0.3" />
          </g>
        )}
        {type === 'decade' && (
          // 10年運勢 - 時計のような円弧と矢印
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.8">
            <path d="M0,-13 A13,13 0 1,1 -9,9" strokeWidth="1.2" />
            <polyline points="-13,6 -9,9 -5,6" fill="none" strokeWidth="1.2" />
            <text x="0" y="5" textAnchor="middle" fill={primary} fontSize="10" fontFamily="serif" strokeWidth="0" opacity="0.7">10</text>
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
        {type === 'health' && (
          // 健康 - 十字と心臓のイメージ
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.8">
            <rect x="-3" y="-12" width="6" height="24" rx="2" fill={primary} opacity="0.15" />
            <rect x="-12" y="-3" width="24" height="6" rx="2" fill={primary} opacity="0.15" />
            <line x1="0" y1="-12" x2="0" y2="12" />
            <line x1="-12" y1="0" x2="12" y2="0" />
            <circle cx="0" cy="0" r="3" fill={primary} opacity="0.4" />
          </g>
        )}
        {type === 'kuubou' && (
          // 空亡 - 欠けた円（虚空のイメージ）
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.8">
            <path d="M11,-7 A13,13 0 1,0 11,7" />
            <line x1="11" y1="-7" x2="11" y2="7" strokeDasharray="2 2" opacity="0.4" />
            <circle cx="-2" cy="0" r="5" fill={primary} opacity="0.1" />
            <circle cx="-2" cy="0" r="1.5" fill={primary} opacity="0.5" />
          </g>
        )}
        {type === 'shinsatsu' && (
          // 神殺 - 星と光線
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.8">
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i * Math.PI * 2) / 6 - Math.PI / 2;
              return <line key={i} x1={Math.cos(a) * 5} y1={Math.sin(a) * 5} x2={Math.cos(a) * 13} y2={Math.sin(a) * 13} strokeWidth="0.8" opacity="0.5" />;
            })}
            {(() => {
              const pts = Array.from({ length: 6 }, (_, i) => {
                const a = (i * Math.PI * 2) / 6 - Math.PI / 2;
                const rr = i % 2 === 0 ? 12 : 6;
                return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
              }).join(' ');
              return <polygon points={pts} fill={primary} fillOpacity="0.15" strokeWidth="1.2" />;
            })()}
            <circle cx="0" cy="0" r="3" fill={primary} opacity="0.5" />
          </g>
        )}
        {type === 'lucky' && (
          // 開運 - 四つ葉のクローバー風
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.8">
            <circle cx="0" cy="-7" r="6" fill={primary} fillOpacity="0.1" />
            <circle cx="0" cy="7" r="6" fill={primary} fillOpacity="0.1" />
            <circle cx="-7" cy="0" r="6" fill={primary} fillOpacity="0.1" />
            <circle cx="7" cy="0" r="6" fill={primary} fillOpacity="0.1" />
            <circle cx="0" cy="0" r="2" fill={primary} opacity="0.6" />
          </g>
        )}
        {type === 'strength' && (
          // 身強身弱 - 天秤（バランス）
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.8">
            <line x1="0" y1="-12" x2="0" y2="4" />
            <line x1="-12" y1="-4" x2="12" y2="-4" />
            <path d="M-12,-4 L-10,4 L-8,-4" fill={primary} fillOpacity="0.15" />
            <path d="M8,-4 L10,4 L12,-4" fill={primary} fillOpacity="0.15" />
            <circle cx="0" cy="-12" r="2" fill={primary} opacity="0.5" />
            <line x1="-4" y1="4" x2="4" y2="4" strokeWidth="1.5" />
          </g>
        )}
        {type === 'chishi' && (
          // 地支関係 - 二つの矢印が交差
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1.2" opacity="0.8">
            <circle cx="-7" cy="0" r="7" />
            <circle cx="7" cy="0" r="7" />
            <line x1="-3" y1="-8" x2="3" y2="8" strokeDasharray="2 3" opacity="0.5" />
            <line x1="3" y1="-8" x2="-3" y2="8" strokeDasharray="2 3" opacity="0.5" />
            <circle cx="0" cy="0" r="2" fill={primary} opacity="0.5" />
          </g>
        )}
        {type === 'daiun' && (
          // 大運 - 長い道のり
          <g transform={`translate(${c},${c})`} stroke={primary} fill="none" strokeWidth="1" opacity="0.8">
            <path d="M-12,6 Q-6,-6 0,2 Q6,10 12,-6" strokeWidth="1.5" />
            {[-10, -4, 2, 8].map((x, i) => (
              <circle key={i} cx={x} cy={i % 2 === 0 ? 4 : -2} r="1.5" fill={primary} opacity={0.3 + i * 0.15} />
            ))}
            <text x="0" y="-10" textAnchor="middle" fill={primary} fontSize="8" fontFamily="serif" strokeWidth="0" opacity="0.6">大運</text>
          </g>
        )}
      </svg>
    </div>
  );
}

export { COLORS as SECTION_COLORS };
