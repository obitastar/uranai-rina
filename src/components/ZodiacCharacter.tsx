"use client";

import type { Junishi } from "@/lib/shichusuimei";

interface ZodiacTheme {
  animal: string;
  kanji: string;
  element: string;
  trait: string;
  // Gradient colors for 3D look
  highlight: string;
  primary: string;
  dark: string;
  accent: string;
  glow: string;
}

const ZODIAC_MAP: Record<Junishi, ZodiacTheme> = {
  '子': { animal: '鼠', kanji: '子', element: '水', trait: '知恵と機敏さの守護', highlight: '#BAE6FD', primary: '#38BDF8', dark: '#0C4A6E', accent: '#67E8F9', glow: 'rgba(56,189,248,0.5)' },
  '丑': { animal: '牛', kanji: '丑', element: '土', trait: '忍耐と誠実さの守護', highlight: '#F5E6D3', primary: '#C8956B', dark: '#5C3310', accent: '#FFD700', glow: 'rgba(200,149,107,0.5)' },
  '寅': { animal: '虎', kanji: '寅', element: '木', trait: '勇気と威厳の守護', highlight: '#FED7AA', primary: '#F97316', dark: '#7C2D12', accent: '#FDE047', glow: 'rgba(249,115,22,0.5)' },
  '卯': { animal: '兎', kanji: '卯', element: '木', trait: '優美と幸運の守護', highlight: '#FECDD3', primary: '#F472B6', dark: '#9D174D', accent: '#FDF2F8', glow: 'rgba(244,114,182,0.5)' },
  '辰': { animal: '龍', kanji: '辰', element: '土', trait: '権威と繁栄の守護', highlight: '#FEF3C7', primary: '#F59E0B', dark: '#78350F', accent: '#FDE047', glow: 'rgba(245,158,11,0.6)' },
  '巳': { animal: '蛇', kanji: '巳', element: '火', trait: '知恵と神秘の守護', highlight: '#E9D5FF', primary: '#A855F7', dark: '#581C87', accent: '#E879F9', glow: 'rgba(168,85,247,0.5)' },
  '午': { animal: '馬', kanji: '午', element: '火', trait: '情熱と行動力の守護', highlight: '#FECACA', primary: '#EF4444', dark: '#7F1D1D', accent: '#FB923C', glow: 'rgba(239,68,68,0.5)' },
  '未': { animal: '羊', kanji: '未', element: '土', trait: '温和と芸術性の守護', highlight: '#D1FAE5', primary: '#34D399', dark: '#064E3B', accent: '#A7F3D0', glow: 'rgba(52,211,153,0.5)' },
  '申': { animal: '猿', kanji: '申', element: '金', trait: '才知と器用さの守護', highlight: '#FEF9C3', primary: '#EAB308', dark: '#713F12', accent: '#FDE68A', glow: 'rgba(234,179,8,0.5)' },
  '酉': { animal: '鶏', kanji: '酉', element: '金', trait: '誠実と先見性の守護', highlight: '#F1F5F9', primary: '#94A3B8', dark: '#1E293B', accent: '#E2E8F0', glow: 'rgba(148,163,184,0.5)' },
  '戌': { animal: '犬', kanji: '戌', element: '土', trait: '忠誠と正義の守護', highlight: '#F5DEB3', primary: '#B8860B', dark: '#4A2C17', accent: '#DAA520', glow: 'rgba(184,134,11,0.5)' },
  '亥': { animal: '猪', kanji: '亥', element: '水', trait: '勇猛と直進の守護', highlight: '#BFDBFE', primary: '#3B82F6', dark: '#1E3A5F', accent: '#60A5FA', glow: 'rgba(59,130,246,0.5)' },
};

function SvgDefs({ id, t }: { id: string; t: ZodiacTheme }) {
  return (
    <defs>
      <radialGradient id={`b-${id}`} cx="38%" cy="32%" r="65%" fx="32%" fy="28%">
        <stop offset="0%" stopColor={t.highlight} />
        <stop offset="45%" stopColor={t.primary} />
        <stop offset="100%" stopColor={t.dark} />
      </radialGradient>
      <radialGradient id={`b2-${id}`} cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor={t.highlight} stopOpacity="0.8" />
        <stop offset="50%" stopColor={t.primary} stopOpacity="0.6" />
        <stop offset="100%" stopColor={t.dark} />
      </radialGradient>
      <linearGradient id={`m-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={t.dark} />
        <stop offset="35%" stopColor={t.highlight} />
        <stop offset="50%" stopColor="white" stopOpacity="0.85" />
        <stop offset="65%" stopColor={t.highlight} />
        <stop offset="100%" stopColor={t.dark} />
      </linearGradient>
      <radialGradient id={`a-${id}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={t.primary} stopOpacity="0.35" />
        <stop offset="55%" stopColor={t.primary} stopOpacity="0.12" />
        <stop offset="100%" stopColor={t.primary} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`eye-${id}`} cx="40%" cy="35%" r="55%">
        <stop offset="0%" stopColor="white" stopOpacity="0.95" />
        <stop offset="40%" stopColor={t.accent} />
        <stop offset="100%" stopColor={t.dark} />
      </radialGradient>
      <filter id={`gl-${id}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`sh-${id}`} x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={t.dark} floodOpacity="0.5" />
      </filter>
    </defs>
  );
}

// 3D highlight ellipse
function HL({ cx, cy, rx, ry }: { cx: number | string; cy: number | string; rx: number | string; ry: number | string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="white" opacity="0.18" />;
}

// Glowing eye
function Eye({ cx, cy, r, id }: { cx: number; cy: number; r: number; id: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#eye-${id})`} />
      <circle cx={cx - r * 0.2} cy={cy - r * 0.25} r={r * 0.3} fill="white" opacity="0.9" />
    </g>
  );
}

function ZodiacArt({ shi, t }: { shi: Junishi; t: ZodiacTheme }) {
  const id = shi;
  const bf = `url(#b-${id})`;
  const b2 = `url(#b2-${id})`;
  const mf = `url(#m-${id})`;
  const dk = t.dark;
  const sw = 1.5;

  const arts: Record<Junishi, React.ReactNode> = {
    '子': (
      <g filter={`url(#sh-${id})`}>
        {/* Body */}
        <ellipse cx="100" cy="115" rx="28" ry="34" fill={bf} stroke={dk} strokeWidth={sw} />
        {/* Head */}
        <circle cx="100" cy="70" r="26" fill={bf} stroke={dk} strokeWidth={sw} />
        <HL cx="90" cy="58" rx="12" ry="6" />
        {/* Ears */}
        <ellipse cx="76" cy="48" rx="13" ry="16" fill={bf} stroke={dk} strokeWidth={sw} />
        <ellipse cx="76" cy="49" rx="7" ry="10" fill={mf} opacity="0.4" />
        <ellipse cx="124" cy="48" rx="13" ry="16" fill={bf} stroke={dk} strokeWidth={sw} />
        <ellipse cx="124" cy="49" rx="7" ry="10" fill={mf} opacity="0.4" />
        {/* Eyes */}
        <Eye cx={90} cy={66} r={5} id={id} />
        <Eye cx={110} cy={66} r={5} id={id} />
        {/* Nose */}
        <ellipse cx="100" cy="78" rx="4" ry="3" fill={dk} />
        <circle cx="99" cy="77" r="1" fill="white" opacity="0.4" />
        {/* Whiskers */}
        <line x1="72" y1="72" x2="88" y2="75" stroke={t.accent} strokeWidth="1" opacity="0.6" />
        <line x1="72" y1="78" x2="88" y2="78" stroke={t.accent} strokeWidth="1" opacity="0.6" />
        <line x1="128" y1="72" x2="112" y2="75" stroke={t.accent} strokeWidth="1" opacity="0.6" />
        <line x1="128" y1="78" x2="112" y2="78" stroke={t.accent} strokeWidth="1" opacity="0.6" />
        {/* Paws */}
        <ellipse cx="82" cy="138" rx="8" ry="5" fill={bf} stroke={dk} strokeWidth="1" />
        <ellipse cx="118" cy="138" rx="8" ry="5" fill={bf} stroke={dk} strokeWidth="1" />
        {/* Tail */}
        <path d="M124,132 C140,126 150,112 144,96 C142,90 136,92 138,100" fill="none" stroke={bf} strokeWidth="5" strokeLinecap="round" />
        <path d="M124,132 C140,126 150,112 144,96 C142,90 136,92 138,100" fill="none" stroke={dk} strokeWidth="5" strokeLinecap="round" opacity="0.15" />
      </g>
    ),

    '丑': (
      <g filter={`url(#sh-${id})`}>
        {/* Horns */}
        <path d="M68,55 C58,32 48,18 42,20 C36,22 42,38 52,48 L68,58" fill={mf} stroke={dk} strokeWidth={sw} />
        <path d="M132,55 C142,32 152,18 158,20 C164,22 158,38 148,48 L132,58" fill={mf} stroke={dk} strokeWidth={sw} />
        {/* Head */}
        <path d="M66,55 C72,42 86,34 100,34 C114,34 128,42 134,55 C140,68 140,82 134,92 C128,102 116,108 100,110 C84,108 72,102 66,92 C60,82 60,68 66,55Z" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="88" cy="50" rx="16" ry="8" />
        {/* Forehead mark */}
        <path d="M90,46 L100,40 L110,46 L100,52Z" fill={mf} opacity="0.4" />
        {/* Eyes */}
        <Eye cx={84} cy={66} r={5} id={id} />
        <Eye cx={116} cy={66} r={5} id={id} />
        {/* Muzzle */}
        <ellipse cx="100" cy="86" rx="16" ry="10" fill={b2} stroke={dk} strokeWidth="1" />
        <HL cx="96" cy="82" rx="6" ry="3" />
        {/* Nostrils */}
        <ellipse cx="93" cy="86" rx="3" ry="2.5" fill={dk} opacity="0.6" />
        <ellipse cx="107" cy="86" rx="3" ry="2.5" fill={dk} opacity="0.6" />
        {/* Nose ring */}
        <path d="M94,92 Q100,100 106,92" fill="none" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round" />
        {/* Neck */}
        <path d="M76,108 C72,118 70,132 74,146 Q88,160 100,160 Q112,160 126,146 C130,132 128,118 124,108" fill={bf} stroke={dk} strokeWidth={sw} />
        <HL cx="92" cy="120" rx="12" ry="6" />
      </g>
    ),

    '寅': (
      <g filter={`url(#sh-${id})`}>
        {/* Ears */}
        <path d="M70,48 C64,28 68,16 76,18 C84,20 80,36 78,46Z" fill={bf} stroke={dk} strokeWidth={sw} />
        <path d="M130,48 C136,28 132,16 124,18 C116,20 120,36 122,46Z" fill={bf} stroke={dk} strokeWidth={sw} />
        {/* Head */}
        <path d="M68,48 C74,36 86,28 100,28 C114,28 126,36 132,48 C138,60 140,74 134,84 C128,92 118,98 100,100 C82,98 72,92 66,84 C60,74 62,60 68,48Z" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="88" cy="42" rx="18" ry="8" />
        {/* 王 mark */}
        <rect x="91" y="38" width="18" height="2.5" rx="1" fill={t.accent} opacity="0.8" />
        <rect x="93" y="44" width="14" height="2" rx="1" fill={t.accent} opacity="0.7" />
        <rect x="95" y="50" width="10" height="1.8" rx="1" fill={t.accent} opacity="0.6" />
        <rect x="99" y="37" width="2" height="16" rx="1" fill={t.accent} opacity="0.7" />
        {/* Eyes - fierce */}
        <path d="M78,64 C82,58 90,58 94,64" fill={dk} stroke={dk} strokeWidth="1" />
        <circle cx="86" cy="62" r="3.5" fill={`url(#eye-${id})`} />
        <circle cx="85" cy="61" r="1.2" fill="white" opacity="0.9" />
        <path d="M122,64 C118,58 110,58 106,64" fill={dk} stroke={dk} strokeWidth="1" />
        <circle cx="114" cy="62" r="3.5" fill={`url(#eye-${id})`} />
        <circle cx="113" cy="61" r="1.2" fill="white" opacity="0.9" />
        {/* Nose + mouth */}
        <path d="M96,74 L100,78 L104,74Z" fill={dk} />
        <path d="M88,82 C94,88 106,88 112,82" fill="none" stroke={dk} strokeWidth="1.8" />
        {/* Fangs */}
        <path d="M90,82 L88,89" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <path d="M110,82 L112,89" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        {/* Body with stripes */}
        <path d="M80,96 C76,108 74,124 78,140 C82,152 92,160 100,162 C108,160 118,152 122,140 C126,124 124,108 120,96" fill={bf} stroke={dk} strokeWidth={sw} />
        <HL cx="92" cy="108" rx="10" ry="5" />
        {/* Stripes */}
        <path d="M80,112 C90,116 110,116 120,112" fill="none" stroke={dk} strokeWidth="3" opacity="0.3" />
        <path d="M78,124 C90,128 110,128 122,124" fill="none" stroke={dk} strokeWidth="3" opacity="0.25" />
        <path d="M80,136 C90,140 110,140 120,136" fill="none" stroke={dk} strokeWidth="3" opacity="0.2" />
        {/* Tail */}
        <path d="M115,158 C128,156 140,148 146,136 C150,126 144,120 138,126" fill="none" stroke={bf} strokeWidth="6" strokeLinecap="round" />
      </g>
    ),

    '卯': (
      <g filter={`url(#sh-${id})`}>
        {/* Moon bg */}
        <circle cx="100" cy="85" r="65" fill={t.dark} opacity="0.08" />
        {/* Long ears */}
        <path d="M86,50 C84,28 80,4 86,0 C92,-2 94,18 93,40Z" fill={bf} stroke={dk} strokeWidth={sw} />
        <path d="M87,38 C86,22 84,8 86,4" fill="none" stroke={mf} strokeWidth="4" opacity="0.3" />
        <path d="M114,50 C116,28 120,4 114,0 C108,-2 106,18 107,40Z" fill={bf} stroke={dk} strokeWidth={sw} />
        <path d="M113,38 C114,22 116,8 114,4" fill="none" stroke={mf} strokeWidth="4" opacity="0.3" />
        {/* Head */}
        <ellipse cx="100" cy="68" rx="28" ry="26" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="90" cy="56" rx="14" ry="7" />
        {/* Eyes - big & cute */}
        <ellipse cx="88" cy="64" rx="7" ry="8" fill={`url(#eye-${id})`} />
        <circle cx="86" cy="62" r="2.5" fill="white" opacity="0.9" />
        <circle cx="89" cy="67" r="1" fill={dk} opacity="0.3" />
        <ellipse cx="112" cy="64" rx="7" ry="8" fill={`url(#eye-${id})`} />
        <circle cx="110" cy="62" r="2.5" fill="white" opacity="0.9" />
        <circle cx="113" cy="67" r="1" fill={dk} opacity="0.3" />
        {/* Nose */}
        <path d="M97,76 L100,80 L103,76Z" fill={t.accent} opacity="0.7" />
        {/* Mouth */}
        <path d="M96,82 Q100,86 104,82" fill="none" stroke={dk} strokeWidth="1" opacity="0.5" />
        {/* Body */}
        <ellipse cx="100" cy="118" rx="26" ry="32" fill={bf} stroke={dk} strokeWidth={sw} />
        <HL cx="92" cy="102" rx="12" ry="6" />
        {/* Fluffy tail */}
        <circle cx="122" cy="138" r="10" fill={bf} stroke={dk} strokeWidth="1" />
        <circle cx="126" cy="134" r="6" fill={mf} opacity="0.3" />
        {/* Paws */}
        <ellipse cx="82" cy="142" rx="8" ry="5" fill={bf} stroke={dk} strokeWidth="1" />
        <ellipse cx="118" cy="142" rx="8" ry="5" fill={bf} stroke={dk} strokeWidth="1" />
      </g>
    ),

    '辰': (
      <g filter={`url(#sh-${id})`}>
        {/* Horns - branching antler style */}
        <path d="M72,42 C62,22 52,10 46,12 C40,14 48,28 56,36 L70,46" fill={mf} stroke={dk} strokeWidth="2" />
        <path d="M56,20 C52,16 48,18 52,24" fill={mf} stroke={dk} strokeWidth="1" />
        <path d="M128,42 C138,22 148,10 154,12 C160,14 152,28 144,36 L130,46" fill={mf} stroke={dk} strokeWidth="2" />
        <path d="M144,20 C148,16 152,18 148,24" fill={mf} stroke={dk} strokeWidth="1" />
        {/* Mane/whiskers behind head */}
        <path d="M64,50 C54,46 44,52 50,60" fill={bf} stroke={dk} strokeWidth="1" opacity="0.6" />
        <path d="M136,50 C146,46 156,52 150,60" fill={bf} stroke={dk} strokeWidth="1" opacity="0.6" />
        {/* Head */}
        <path d="M66,46 C74,34 86,26 100,26 C114,26 126,34 134,46 C142,58 144,72 138,82 C132,90 120,96 100,98 C80,96 68,90 62,82 C56,72 58,58 66,46Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <HL cx="86" cy="40" rx="18" ry="8" />
        {/* Eyes - imperial */}
        <path d="M76,60 L72,64 L80,68 L86,62Z" fill={dk} opacity="0.3" />
        <circle cx="80" cy="64" r="4.5" fill={`url(#eye-${id})`} />
        <circle cx="78" cy="62" r="1.5" fill="white" opacity="0.9" />
        <path d="M124,60 L128,64 L120,68 L114,62Z" fill={dk} opacity="0.3" />
        <circle cx="120" cy="64" r="4.5" fill={`url(#eye-${id})`} />
        <circle cx="118" cy="62" r="1.5" fill="white" opacity="0.9" />
        {/* Dragon whiskers */}
        <path d="M70,76 C58,74 46,68 38,62" fill="none" stroke={mf} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68,82 C56,82 44,78 36,74" fill="none" stroke={mf} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M130,76 C142,74 154,68 162,62" fill="none" stroke={mf} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M132,82 C144,82 156,78 164,74" fill="none" stroke={mf} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Mouth */}
        <path d="M90,80 L100,86 L110,80" fill="none" stroke={dk} strokeWidth="2" />
        {/* Serpentine body */}
        <path d="M100,96 C112,106 126,112 134,126 C142,140 134,156 120,160 C106,164 90,156 84,144 C78,132 84,120 96,114 C104,110 108,104 100,96Z" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="118" cy="125" rx="8" ry="5" />
        {/* Scale pattern on body */}
        {[[112,110],[128,120],[136,134],[128,148],[116,156],[100,156],[88,148],[82,136],[88,124],[100,116]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill={mf} opacity={0.2 + i * 0.02} />
        ))}
        {/* Lightning sparks */}
        <path d="M48,18 L52,30 L46,30 L52,42" fill="none" stroke={t.accent} strokeWidth="1.5" opacity="0.5" />
        <path d="M152,22 L148,34 L154,34 L148,46" fill="none" stroke={t.accent} strokeWidth="1.5" opacity="0.5" />
      </g>
    ),

    '巳': (
      <g filter={`url(#sh-${id})`}>
        {/* Coiled body - large S curve */}
        <path d="M100,30 C122,28 142,40 146,58 C150,76 136,88 120,90 C108,92 104,100 108,114 C114,128 130,132 138,144 C146,156 138,170 122,172 C106,174 88,164 82,150 C76,136 82,122 96,116 C108,110 112,98 104,88 C96,80 80,76 70,68 C60,58 58,42 68,34 C76,28 88,28 100,30Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <HL cx="120" cy="50" rx="10" ry="6" />
        <HL cx="92" cy="130" rx="6" ry="4" />
        {/* Scale shimmer on body */}
        {[[130,48],[142,64],[132,82],[112,92],[108,108],[118,124],[132,138],[134,154],[120,166],[100,166]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill={mf} opacity={0.15 + i * 0.02} />
        ))}
        {/* Head */}
        <path d="M78,40 C82,30 92,24 100,24 C108,24 118,28 122,36 C126,44 122,54 114,58 C106,62 94,62 86,58 C78,54 74,48 78,40Z" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="94" cy="34" rx="10" ry="5" />
        {/* Crown jewel */}
        <circle cx="100" cy="20" r="6" fill={mf} stroke={dk} strokeWidth="1" />
        <circle cx="100" cy="20" r="3" fill={t.accent} opacity="0.7" />
        <circle cx="98" cy="18" r="1.2" fill="white" opacity="0.8" />
        {/* Eyes - slit pupils */}
        <ellipse cx="90" cy="42" rx="4" ry="5" fill={`url(#eye-${id})`} />
        <ellipse cx="90" cy="42" rx="1.2" ry="4" fill={dk} opacity="0.7" />
        <ellipse cx="110" cy="42" rx="4" ry="5" fill={`url(#eye-${id})`} />
        <ellipse cx="110" cy="42" rx="1.2" ry="4" fill={dk} opacity="0.7" />
        {/* Forked tongue */}
        <path d="M100,56 L98,66 M100,56 L102,66" stroke={t.accent} strokeWidth="1.2" strokeLinecap="round" />
      </g>
    ),

    '午': (
      <g filter={`url(#sh-${id})`}>
        {/* Flowing mane - flame-like filled shapes */}
        <path d="M88,30 C84,14 78,4 82,0 C86,-2 92,10 94,24Z" fill={bf} stroke={dk} strokeWidth="1" />
        <path d="M96,26 C94,8 90,-2 96,-4 C102,-4 104,10 102,22Z" fill={bf} stroke={dk} strokeWidth="1" />
        <path d="M106,28 C110,12 116,4 114,0 C110,-2 106,14 106,24Z" fill={bf} stroke={dk} strokeWidth="1" opacity="0.8" />
        {/* Head */}
        <path d="M72,50 C78,36 88,26 100,26 C112,26 122,36 128,50 C134,64 130,78 124,86 C118,94 110,98 100,98 C90,98 82,94 76,86 C70,78 66,64 72,50Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <HL cx="88" cy="40" rx="16" ry="8" />
        {/* Forehead diamond */}
        <path d="M96,38 L100,32 L104,38 L100,44Z" fill={mf} opacity="0.5" />
        {/* Eyes */}
        <Eye cx={86} cy={58} r={5} id={id} />
        <Eye cx={114} cy={58} r={5} id={id} />
        {/* Nostrils */}
        <ellipse cx="92" cy="78" rx="3.5" ry="2.5" fill={dk} opacity="0.5" />
        <ellipse cx="108" cy="78" rx="3.5" ry="2.5" fill={dk} opacity="0.5" />
        {/* Mouth */}
        <path d="M88,86 Q100,92 112,86" fill="none" stroke={dk} strokeWidth="1.5" />
        {/* Neck + body */}
        <path d="M80,96 C76,106 74,120 76,136 C78,148 88,156 100,158 C112,156 122,148 124,136 C126,120 124,106 120,96" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="92" cy="108" rx="10" ry="6" />
        {/* Legs */}
        <path d="M82,148 L78,172 L86,174" fill={bf} stroke={dk} strokeWidth="2" strokeLinejoin="round" />
        <path d="M118,148 L122,172 L114,174" fill={bf} stroke={dk} strokeWidth="2" strokeLinejoin="round" />
        {/* Hoof sparks */}
        <circle cx="82" cy="174" r="3" fill={t.accent} opacity="0.4" />
        <circle cx="118" cy="174" r="3" fill={t.accent} opacity="0.4" />
        {/* Tail - flowing fire */}
        <path d="M118,154 C132,152 144,142 148,128 C150,118 144,114 140,120 C136,126 138,134 142,128" fill="none" stroke={bf} strokeWidth="6" strokeLinecap="round" />
      </g>
    ),

    '未': (
      <g filter={`url(#sh-${id})`}>
        {/* Spiral horns */}
        <path d="M74,50 C66,36 54,30 48,34 C42,38 48,50 58,52 L72,52" fill={mf} stroke={dk} strokeWidth="1.5" />
        <path d="M126,50 C134,36 146,30 152,34 C158,38 152,50 142,52 L128,52" fill={mf} stroke={dk} strokeWidth="1.5" />
        {/* Head */}
        <ellipse cx="100" cy="68" rx="30" ry="28" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="88" cy="54" rx="14" ry="7" />
        {/* Wool texture around head */}
        {[[66,56],[60,68],[64,80],[134,56],[140,68],[136,80]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="8" fill={bf} stroke={dk} strokeWidth="0.8" opacity="0.7" />
        ))}
        {/* Eyes - gentle */}
        <ellipse cx="86" cy="66" rx="5" ry="4.5" fill={`url(#eye-${id})`} />
        <circle cx="85" cy="65" r="1.5" fill="white" opacity="0.8" />
        <ellipse cx="114" cy="66" rx="5" ry="4.5" fill={`url(#eye-${id})`} />
        <circle cx="113" cy="65" r="1.5" fill="white" opacity="0.8" />
        {/* Nose + mouth */}
        <ellipse cx="100" cy="78" rx="4" ry="3" fill={dk} opacity="0.4" />
        <path d="M95,84 Q100,88 105,84" fill="none" stroke={dk} strokeWidth="1" opacity="0.5" />
        {/* Woolly body - cluster of circles */}
        <ellipse cx="100" cy="122" rx="30" ry="34" fill={bf} stroke={dk} strokeWidth="1.5" />
        <HL cx="90" cy="106" rx="12" ry="6" />
        {[[76,108],[72,122],[76,136],[124,108],[128,122],[124,136]].map(([x, y], i) => (
          <circle key={`w${i}`} cx={x} cy={y} r="9" fill={bf} stroke={dk} strokeWidth="0.6" opacity="0.5" />
        ))}
        {/* Legs */}
        <rect x="84" y="150" width="6" height="18" rx="3" fill={bf} stroke={dk} strokeWidth="1" />
        <rect x="110" y="150" width="6" height="18" rx="3" fill={bf} stroke={dk} strokeWidth="1" />
      </g>
    ),

    '申': (
      <g filter={`url(#sh-${id})`}>
        {/* Head tuft */}
        <path d="M92,30 C90,18 94,12 98,16 L96,28Z" fill={bf} stroke={dk} strokeWidth="1" />
        <path d="M102,28 C102,14 106,10 110,14 L106,28Z" fill={bf} stroke={dk} strokeWidth="1" />
        {/* Ears */}
        <circle cx="68" cy="58" r="12" fill={bf} stroke={dk} strokeWidth={sw} />
        <circle cx="68" cy="58" r="7" fill={mf} opacity="0.35" />
        <circle cx="132" cy="58" r="12" fill={bf} stroke={dk} strokeWidth={sw} />
        <circle cx="132" cy="58" r="7" fill={mf} opacity="0.35" />
        {/* Head */}
        <ellipse cx="100" cy="62" rx="28" ry="30" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="88" cy="46" rx="14" ry="7" />
        {/* Face patch - lighter area */}
        <ellipse cx="100" cy="68" rx="18" ry="16" fill={mf} opacity="0.2" />
        {/* Eyes */}
        <Eye cx={88} cy={60} r={4.5} id={id} />
        <Eye cx={112} cy={60} r={4.5} id={id} />
        {/* Nose */}
        <ellipse cx="100" cy="72" rx="5" ry="3.5" fill={dk} opacity="0.5" />
        <circle cx="99" cy="71" r="1" fill="white" opacity="0.3" />
        {/* Mouth - playful grin */}
        <path d="M90,80 Q100,88 110,80" fill="none" stroke={dk} strokeWidth="1.5" />
        {/* Body */}
        <ellipse cx="100" cy="118" rx="24" ry="30" fill={bf} stroke={dk} strokeWidth={sw} />
        <HL cx="92" cy="104" rx="10" ry="5" />
        {/* Long arms */}
        <path d="M76,100 C62,108 50,120 46,132 C44,138 48,142 54,138" fill="none" stroke={bf} strokeWidth="6" strokeLinecap="round" />
        <path d="M124,100 C138,108 150,120 154,132 C156,138 152,142 146,138" fill="none" stroke={bf} strokeWidth="6" strokeLinecap="round" />
        {/* Peach/jewel in hand */}
        <circle cx="52" cy="136" r="7" fill={mf} stroke={dk} strokeWidth="1" />
        <circle cx="50" cy="134" r="2" fill="white" opacity="0.5" />
        {/* Tail */}
        <path d="M120,142 C134,146 144,140 146,130 C148,122 142,118 138,124" fill="none" stroke={bf} strokeWidth="5" strokeLinecap="round" />
      </g>
    ),

    '酉': (
      <g filter={`url(#sh-${id})`}>
        {/* Crest feathers */}
        <path d="M90,30 C86,14 82,2 86,0 C90,-2 94,12 94,26Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
        <path d="M98,26 C98,8 100,-2 104,0 C108,2 106,16 104,24Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
        <path d="M108,30 C112,16 116,6 114,2 C112,0 108,12 108,24Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
        {/* Head */}
        <ellipse cx="100" cy="58" rx="26" ry="28" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="90" cy="44" rx="12" ry="6" />
        {/* Eyes */}
        <Eye cx={88} cy={54} r={4} id={id} />
        <Eye cx={112} cy={54} r={4} id={id} />
        {/* Beak */}
        <path d="M94,66 L100,58 L106,66 L100,72Z" fill={t.accent} stroke={dk} strokeWidth="1" />
        <HL cx="98" cy="62" rx="3" ry="2" />
        {/* Wattle */}
        <path d="M98,72 C96,80 94,84 96,86 C98,88 100,82 100,76" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
        {/* Body */}
        <ellipse cx="100" cy="112" rx="26" ry="32" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="90" cy="96" rx="12" ry="6" />
        {/* Wings */}
        <path d="M74,100 C60,96 44,94 38,100 C32,108 40,114 52,110 C62,108 72,106 78,108" fill={bf} stroke={dk} strokeWidth="1.5" />
        <HL cx="52" cy="102" rx="6" ry="3" />
        <path d="M126,100 C140,96 156,94 162,100 C168,108 160,114 148,110 C138,108 128,106 122,108" fill={bf} stroke={dk} strokeWidth="1.5" />
        <HL cx="148" cy="102" rx="6" ry="3" />
        {/* Tail feathers */}
        <path d="M92,140 C84,150 72,162 64,168 C58,172 56,178 62,180" fill={bf} stroke={dk} strokeWidth="2" />
        <path d="M100,142 C100,154 98,168 96,178" fill="none" stroke={bf} strokeWidth="3" strokeLinecap="round" />
        <path d="M108,140 C116,150 128,162 136,168 C142,172 144,178 138,180" fill={bf} stroke={dk} strokeWidth="2" />
        {/* Legs */}
        <rect x="90" y="138" width="4" height="20" rx="2" fill={t.accent} stroke={dk} strokeWidth="0.8" />
        <rect x="106" y="138" width="4" height="20" rx="2" fill={t.accent} stroke={dk} strokeWidth="0.8" />
      </g>
    ),

    '戌': (
      <g filter={`url(#sh-${id})`}>
        {/* Pointed ears */}
        <path d="M72,48 C66,24 62,10 68,8 C74,6 78,22 80,40Z" fill={bf} stroke={dk} strokeWidth="2" />
        <path d="M73,28 C72,18 74,12 76,18" fill={mf} opacity="0.3" stroke="none" />
        <path d="M128,48 C134,24 138,10 132,8 C126,6 122,22 120,40Z" fill={bf} stroke={dk} strokeWidth="2" />
        <path d="M127,28 C128,18 126,12 124,18" fill={mf} opacity="0.3" stroke="none" />
        {/* Head */}
        <path d="M72,48 C76,38 86,30 100,30 C114,30 124,38 128,48 C134,62 134,78 128,88 C122,96 112,102 100,104 C88,102 78,96 72,88 C66,78 66,62 72,48Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <HL cx="88" cy="42" rx="16" ry="8" />
        {/* Eyes - loyal round eyes */}
        <ellipse cx="86" cy="62" rx="6" ry="6.5" fill={`url(#eye-${id})`} />
        <circle cx="84" cy="60" r="2" fill="white" opacity="0.85" />
        <ellipse cx="114" cy="62" rx="6" ry="6.5" fill={`url(#eye-${id})`} />
        <circle cx="112" cy="60" r="2" fill="white" opacity="0.85" />
        {/* Nose */}
        <ellipse cx="100" cy="76" rx="7" ry="5" fill={dk} />
        <circle cx="98" cy="74" r="2" fill="white" opacity="0.2" />
        {/* Mouth */}
        <path d="M100,81 L100,86 M94,88 Q100,94 106,88" fill="none" stroke={dk} strokeWidth="1.2" opacity="0.5" />
        {/* Body */}
        <path d="M80,100 C76,110 74,126 76,140 C78,152 90,160 100,162 C110,160 122,152 124,140 C126,126 124,110 120,100" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="90" cy="112" rx="12" ry="6" />
        {/* Collar */}
        <path d="M78,100 C86,96 96,94 100,94 C104,94 114,96 122,100" fill="none" stroke={t.accent} strokeWidth="3" strokeLinecap="round" />
        {/* Front paws */}
        <ellipse cx="80" cy="156" rx="8" ry="5" fill={bf} stroke={dk} strokeWidth="1" />
        <ellipse cx="120" cy="156" rx="8" ry="5" fill={bf} stroke={dk} strokeWidth="1" />
        {/* Curled tail */}
        <path d="M118,158 C132,156 142,148 144,136 C146,126 140,122 136,128 C132,134 136,140 140,136" fill="none" stroke={bf} strokeWidth="5" strokeLinecap="round" />
      </g>
    ),

    '亥': (
      <g filter={`url(#sh-${id})`}>
        {/* Speed lines */}
        <line x1="36" y1="70" x2="54" y2="68" stroke={t.accent} strokeWidth="2" opacity="0.3" />
        <line x1="34" y1="82" x2="50" y2="80" stroke={t.accent} strokeWidth="1.5" opacity="0.25" />
        <line x1="38" y1="94" x2="52" y2="92" stroke={t.accent} strokeWidth="1" opacity="0.2" />
        {/* Small ears */}
        <path d="M74,42 C70,28 74,18 80,20 C84,22 82,34 80,42Z" fill={bf} stroke={dk} strokeWidth={sw} />
        <path d="M126,42 C130,28 126,18 120,20 C116,22 118,34 120,42Z" fill={bf} stroke={dk} strokeWidth={sw} />
        {/* Head - powerful */}
        <path d="M68,46 C74,34 86,26 100,26 C114,26 126,34 132,46 C138,60 140,76 136,90 C132,100 120,108 100,110 C80,108 68,100 64,90 C60,76 62,60 68,46Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <HL cx="86" cy="40" rx="18" ry="8" />
        {/* Forehead stripes */}
        <rect x="88" y="38" width="3" height="18" rx="1.5" fill={dk} opacity="0.3" />
        <rect x="99" y="36" width="3" height="20" rx="1.5" fill={dk} opacity="0.3" />
        <rect x="110" y="38" width="3" height="18" rx="1.5" fill={dk} opacity="0.3" />
        {/* Eyes - fierce small */}
        <path d="M80,62 L76,66 L86,68" fill={dk} opacity="0.2" />
        <circle cx="82" cy="66" r="4" fill={`url(#eye-${id})`} />
        <circle cx="81" cy="65" r="1.2" fill="white" opacity="0.8" />
        <path d="M120,62 L124,66 L114,68" fill={dk} opacity="0.2" />
        <circle cx="118" cy="66" r="4" fill={`url(#eye-${id})`} />
        <circle cx="117" cy="65" r="1.2" fill="white" opacity="0.8" />
        {/* Large snout */}
        <ellipse cx="100" cy="84" rx="14" ry="10" fill={b2} stroke={dk} strokeWidth="1.5" />
        <HL cx="96" cy="80" rx="6" ry="3" />
        <circle cx="93" cy="84" r="3" fill={dk} opacity="0.4" />
        <circle cx="107" cy="84" r="3" fill={dk} opacity="0.4" />
        {/* Tusks */}
        <path d="M84,94 C82,100 80,106 82,110" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M116,94 C118,100 120,106 118,110" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        {/* Body */}
        <path d="M76,108 C70,120 68,136 72,150 C76,160 88,168 100,168 C112,168 124,160 128,150 C132,136 130,120 124,108" fill={bf} stroke={dk} strokeWidth="2" />
        <HL cx="90" cy="120" rx="12" ry="6" />
        {/* Bristle texture */}
        {[[80,118],[78,130],[80,142],[120,118],[122,130],[120,142]].map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2={x + (i < 3 ? -5 : 5)} y2={y - 3} stroke={dk} strokeWidth="1.5" opacity="0.2" />
        ))}
        {/* Hooves */}
        <rect x="82" y="162" width="8" height="10" rx="3" fill={bf} stroke={dk} strokeWidth="1" />
        <rect x="110" y="162" width="8" height="10" rx="3" fill={bf} stroke={dk} strokeWidth="1" />
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
  const t = ZODIAC_MAP[shi];
  // レスポンシブサイズ: CSSクラスで制御
  const sizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px]',
    md: 'w-24 h-24 sm:w-28 sm:h-28 md:w-[140px] md:h-[140px]',
    lg: 'w-32 h-32 sm:w-40 sm:h-40 md:w-[200px] md:h-[200px]',
    xl: 'w-40 h-40 sm:w-52 sm:h-52 md:w-[280px] md:h-[280px]',
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4">
      <div className={`relative ${sizeClasses[size]} animate-zodiac-float`}>
        {/* Outer glow pulse */}
        <div
          className="absolute inset-0 rounded-full blur-3xl scale-[1.6] animate-zodiac-glow"
          style={{ backgroundColor: t.glow }}
        />

        {/* Energy ring */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-slow-spin" style={{ opacity: 0.3 }}>
          <defs>
            <linearGradient id={`ring-${shi}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={t.primary} stopOpacity="0.9" />
              <stop offset="50%" stopColor={t.primary} stopOpacity="0.1" />
              <stop offset="100%" stopColor={t.primary} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="97" fill="none" stroke={`url(#ring-${shi})`} strokeWidth="0.8" />
          <circle cx="100" cy="100" r="93" fill="none" stroke={t.primary} strokeWidth="0.3" strokeDasharray="4 6" opacity="0.4" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const x1 = 100 + Math.cos(a) * 92;
            const y1 = 100 + Math.sin(a) * 92;
            const x2 = 100 + Math.cos(a) * 98;
            const y2 = 100 + Math.sin(a) * 98;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={t.primary} strokeWidth="1" opacity="0.5" />;
          })}
        </svg>

        {/* Main art with breathing animation */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-zodiac-breath" style={{ filter: `drop-shadow(0 0 15px ${t.glow})` }}>
          <SvgDefs id={shi} t={t} />
          {/* Background aura */}
          <circle cx="100" cy="100" r="85" fill={`url(#a-${shi})`} />
          <ZodiacArt shi={shi} t={t} />
        </svg>
      </div>

      {/* Label */}
      <div className="text-center space-y-0.5 sm:space-y-1">
        <p className="text-base sm:text-lg md:text-xl font-black tracking-[0.2em]" style={{ color: t.primary, textShadow: `0 0 15px ${t.glow}` }}>
          {shi} ─ {t.animal}
        </p>
        <p className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.2em] sm:tracking-[0.25em]" style={{ color: `${t.primary}70` }}>
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
        color: t.primary,
        borderColor: `${t.primary}30`,
        backgroundColor: `${t.primary}08`,
        boxShadow: `0 0 15px ${t.glow}`,
      }}
    >
      <span className="font-bold">{shi}</span>
      <span className="text-xs opacity-70">{t.animal}</span>
      <span className="w-px h-3 opacity-30" style={{ backgroundColor: t.primary }} />
      <span className="text-xs opacity-50">{t.element}行</span>
    </span>
  );
}

export { ZODIAC_MAP };
