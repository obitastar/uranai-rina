"use client";

import type { Junishi } from "@/lib/shichusuimei";

interface ZodiacTheme {
  animal: string;
  kanji: string;
  element: string;
  trait: string;
  highlight: string;
  primary: string;
  dark: string;
  accent: string;
}

const ZODIAC_MAP: Record<Junishi, ZodiacTheme> = {
  '子': { animal: '鼠', kanji: '子', element: '水', trait: '知恵と機敏さの守護', highlight: '#BAE6FD', primary: '#38BDF8', dark: '#0C4A6E', accent: '#67E8F9' },
  '丑': { animal: '牛', kanji: '丑', element: '土', trait: '忍耐と誠実さの守護', highlight: '#F5E6D3', primary: '#C8956B', dark: '#5C3310', accent: '#FFD700' },
  '寅': { animal: '虎', kanji: '寅', element: '木', trait: '勇気と威厳の守護', highlight: '#FED7AA', primary: '#F97316', dark: '#7C2D12', accent: '#FDE047' },
  '卯': { animal: '兎', kanji: '卯', element: '木', trait: '優美と幸運の守護', highlight: '#FECDD3', primary: '#F472B6', dark: '#9D174D', accent: '#FDF2F8' },
  '辰': { animal: '龍', kanji: '辰', element: '土', trait: '権威と繁栄の守護', highlight: '#FEF3C7', primary: '#F59E0B', dark: '#78350F', accent: '#FDE047' },
  '巳': { animal: '蛇', kanji: '巳', element: '火', trait: '知恵と神秘の守護', highlight: '#E9D5FF', primary: '#A855F7', dark: '#581C87', accent: '#E879F9' },
  '午': { animal: '馬', kanji: '午', element: '火', trait: '情熱と行動力の守護', highlight: '#FECACA', primary: '#EF4444', dark: '#7F1D1D', accent: '#FB923C' },
  '未': { animal: '羊', kanji: '未', element: '土', trait: '温和と芸術性の守護', highlight: '#D1FAE5', primary: '#34D399', dark: '#064E3B', accent: '#A7F3D0' },
  '申': { animal: '猿', kanji: '申', element: '金', trait: '才知と器用さの守護', highlight: '#FEF9C3', primary: '#EAB308', dark: '#713F12', accent: '#FDE68A' },
  '酉': { animal: '鶏', kanji: '酉', element: '金', trait: '誠実と先見性の守護', highlight: '#F1F5F9', primary: '#94A3B8', dark: '#1E293B', accent: '#E2E8F0' },
  '戌': { animal: '犬', kanji: '戌', element: '土', trait: '忠誠と正義の守護', highlight: '#F5DEB3', primary: '#B8860B', dark: '#4A2C17', accent: '#DAA520' },
  '亥': { animal: '猪', kanji: '亥', element: '水', trait: '勇猛と直進の守護', highlight: '#BFDBFE', primary: '#3B82F6', dark: '#1E3A5F', accent: '#60A5FA' },
};

// 簡略化されたアート（フィルターなし）
function ZodiacArt({ shi, t }: { shi: Junishi; t: ZodiacTheme }) {
  const id = shi;
  const bf = `url(#b-${id})`;
  const dk = t.dark;
  const sw = 1.5;

  // 共通defs
  const defs = (
    <defs>
      <radialGradient id={`b-${id}`} cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor={t.highlight} />
        <stop offset="45%" stopColor={t.primary} />
        <stop offset="100%" stopColor={t.dark} />
      </radialGradient>
      <radialGradient id={`eye-${id}`} cx="40%" cy="35%" r="55%">
        <stop offset="0%" stopColor="white" stopOpacity="0.95" />
        <stop offset="40%" stopColor={t.accent} />
        <stop offset="100%" stopColor={t.dark} />
      </radialGradient>
    </defs>
  );

  // 簡略化：各動物の主要シルエットのみ
  const arts: Record<Junishi, React.ReactNode> = {
    '子': (
      <g>
        <ellipse cx="100" cy="115" rx="28" ry="34" fill={bf} stroke={dk} strokeWidth={sw} />
        <circle cx="100" cy="70" r="26" fill={bf} stroke={dk} strokeWidth={sw} />
        <ellipse cx="76" cy="48" rx="13" ry="16" fill={bf} stroke={dk} strokeWidth={sw} />
        <ellipse cx="124" cy="48" rx="13" ry="16" fill={bf} stroke={dk} strokeWidth={sw} />
        <circle cx={90} cy={66} r={5} fill={`url(#eye-${id})`} />
        <circle cx={110} cy={66} r={5} fill={`url(#eye-${id})`} />
        <ellipse cx="100" cy="78" rx="4" ry="3" fill={dk} />
      </g>
    ),
    '丑': (
      <g>
        <path d="M68,55 C58,32 48,18 42,20 C36,22 42,38 52,48 L68,58" fill={t.accent} stroke={dk} strokeWidth={sw} />
        <path d="M132,55 C142,32 152,18 158,20 C164,22 158,38 148,48 L132,58" fill={t.accent} stroke={dk} strokeWidth={sw} />
        <path d="M66,55 C72,42 86,34 100,34 C114,34 128,42 134,55 C140,68 140,82 134,92 C128,102 116,108 100,110 C84,108 72,102 66,92 C60,82 60,68 66,55Z" fill={bf} stroke={dk} strokeWidth="2" />
        <circle cx={84} cy={66} r={5} fill={`url(#eye-${id})`} />
        <circle cx={116} cy={66} r={5} fill={`url(#eye-${id})`} />
        <ellipse cx="100" cy="86" rx="16" ry="10" fill={t.primary} opacity="0.4" stroke={dk} strokeWidth="1" />
      </g>
    ),
    '寅': (
      <g>
        <path d="M68,48 C74,36 86,28 100,28 C114,28 126,36 132,48 C138,60 140,74 134,84 C128,92 118,98 100,100 C82,98 72,92 66,84 C60,74 62,60 68,48Z" fill={bf} stroke={dk} strokeWidth="2" />
        <rect x="91" y="38" width="18" height="2.5" rx="1" fill={t.accent} opacity="0.8" />
        <rect x="93" y="44" width="14" height="2" rx="1" fill={t.accent} opacity="0.7" />
        <rect x="95" y="50" width="10" height="1.8" rx="1" fill={t.accent} opacity="0.6" />
        <circle cx="86" cy="62" r="3.5" fill={`url(#eye-${id})`} />
        <circle cx="114" cy="62" r="3.5" fill={`url(#eye-${id})`} />
        <path d="M96,74 L100,78 L104,74Z" fill={dk} />
        <path d="M80,96 C76,108 74,124 78,140 C82,152 92,160 100,162 C108,160 118,152 122,140 C126,124 124,108 120,96" fill={bf} stroke={dk} strokeWidth={sw} />
      </g>
    ),
    '卯': (
      <g>
        <path d="M86,50 C84,28 80,4 86,0 C92,-2 94,18 93,40Z" fill={bf} stroke={dk} strokeWidth={sw} />
        <path d="M114,50 C116,28 120,4 114,0 C108,-2 106,18 107,40Z" fill={bf} stroke={dk} strokeWidth={sw} />
        <ellipse cx="100" cy="68" rx="28" ry="26" fill={bf} stroke={dk} strokeWidth="2" />
        <ellipse cx="88" cy="64" rx="7" ry="8" fill={`url(#eye-${id})`} />
        <ellipse cx="112" cy="64" rx="7" ry="8" fill={`url(#eye-${id})`} />
        <path d="M97,76 L100,80 L103,76Z" fill={t.accent} opacity="0.7" />
        <ellipse cx="100" cy="118" rx="26" ry="32" fill={bf} stroke={dk} strokeWidth={sw} />
        <circle cx="122" cy="138" r="10" fill={bf} stroke={dk} strokeWidth="1" />
      </g>
    ),
    '辰': (
      <g>
        <path d="M72,42 C62,22 52,10 46,12 C40,14 48,28 56,36 L70,46" fill={t.accent} stroke={dk} strokeWidth="2" />
        <path d="M128,42 C138,22 148,10 154,12 C160,14 152,28 144,36 L130,46" fill={t.accent} stroke={dk} strokeWidth="2" />
        <path d="M66,46 C74,34 86,26 100,26 C114,26 126,34 134,46 C142,58 144,72 138,82 C132,90 120,96 100,98 C80,96 68,90 62,82 C56,72 58,58 66,46Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <circle cx="80" cy="64" r="4.5" fill={`url(#eye-${id})`} />
        <circle cx="120" cy="64" r="4.5" fill={`url(#eye-${id})`} />
        <path d="M90,80 L100,86 L110,80" fill="none" stroke={dk} strokeWidth="2" />
        <path d="M100,96 C112,106 126,112 134,126 C142,140 134,156 120,160 C106,164 90,156 84,144 C78,132 84,120 96,114 C104,110 108,104 100,96Z" fill={bf} stroke={dk} strokeWidth="2" />
      </g>
    ),
    '巳': (
      <g>
        <path d="M100,30 C122,28 142,40 146,58 C150,76 136,88 120,90 C108,92 104,100 108,114 C114,128 130,132 138,144 C146,156 138,170 122,172 C106,174 88,164 82,150 C76,136 82,122 96,116 C108,110 112,98 104,88 C96,80 80,76 70,68 C60,58 58,42 68,34 C76,28 88,28 100,30Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <path d="M78,40 C82,30 92,24 100,24 C108,24 118,28 122,36 C126,44 122,54 114,58 C106,62 94,62 86,58 C78,54 74,48 78,40Z" fill={bf} stroke={dk} strokeWidth="2" />
        <ellipse cx="90" cy="42" rx="4" ry="5" fill={`url(#eye-${id})`} />
        <ellipse cx="110" cy="42" rx="4" ry="5" fill={`url(#eye-${id})`} />
        <circle cx="100" cy="20" r="5" fill={t.accent} opacity="0.6" />
      </g>
    ),
    '午': (
      <g>
        <path d="M88,30 C84,14 82,0 86,-2 C92,-2 92,10 94,24Z" fill={bf} stroke={dk} strokeWidth="1" />
        <path d="M96,26 C94,8 96,-4 102,-4 C104,0 104,10 102,22Z" fill={bf} stroke={dk} strokeWidth="1" />
        <path d="M72,50 C78,36 88,26 100,26 C112,26 122,36 128,50 C134,64 130,78 124,86 C118,94 110,98 100,98 C90,98 82,94 76,86 C70,78 66,64 72,50Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <circle cx={86} cy={58} r={5} fill={`url(#eye-${id})`} />
        <circle cx={114} cy={58} r={5} fill={`url(#eye-${id})`} />
        <ellipse cx="92" cy="78" rx="3.5" ry="2.5" fill={dk} opacity="0.5" />
        <ellipse cx="108" cy="78" rx="3.5" ry="2.5" fill={dk} opacity="0.5" />
        <path d="M80,96 C76,106 74,120 76,136 C78,148 88,156 100,158 C112,156 122,148 124,136 C126,120 124,106 120,96" fill={bf} stroke={dk} strokeWidth="2" />
      </g>
    ),
    '未': (
      <g>
        <path d="M74,50 C66,36 54,30 48,34 C42,38 48,50 58,52 L72,52" fill={t.accent} stroke={dk} strokeWidth="1.5" />
        <path d="M126,50 C134,36 146,30 152,34 C158,38 152,50 142,52 L128,52" fill={t.accent} stroke={dk} strokeWidth="1.5" />
        <ellipse cx="100" cy="68" rx="30" ry="28" fill={bf} stroke={dk} strokeWidth="2" />
        <ellipse cx="86" cy="66" rx="5" ry="4.5" fill={`url(#eye-${id})`} />
        <ellipse cx="114" cy="66" rx="5" ry="4.5" fill={`url(#eye-${id})`} />
        <ellipse cx="100" cy="78" rx="4" ry="3" fill={dk} opacity="0.4" />
        <ellipse cx="100" cy="122" rx="30" ry="34" fill={bf} stroke={dk} strokeWidth="1.5" />
      </g>
    ),
    '申': (
      <g>
        <circle cx="68" cy="58" r="12" fill={bf} stroke={dk} strokeWidth={sw} />
        <circle cx="132" cy="58" r="12" fill={bf} stroke={dk} strokeWidth={sw} />
        <ellipse cx="100" cy="62" rx="28" ry="30" fill={bf} stroke={dk} strokeWidth="2" />
        <circle cx={88} cy={60} r={4.5} fill={`url(#eye-${id})`} />
        <circle cx={112} cy={60} r={4.5} fill={`url(#eye-${id})`} />
        <ellipse cx="100" cy="72" rx="5" ry="3.5" fill={dk} opacity="0.5" />
        <path d="M90,80 Q100,88 110,80" fill="none" stroke={dk} strokeWidth="1.5" />
        <ellipse cx="100" cy="118" rx="24" ry="30" fill={bf} stroke={dk} strokeWidth={sw} />
      </g>
    ),
    '酉': (
      <g>
        <path d="M90,30 C86,14 82,2 86,0 C90,-2 94,12 94,26Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
        <path d="M98,26 C98,8 100,-2 104,0 C108,2 106,16 104,24Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
        <path d="M108,30 C112,16 116,6 114,2 C112,0 108,12 108,24Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
        <ellipse cx="100" cy="58" rx="26" ry="28" fill={bf} stroke={dk} strokeWidth="2" />
        <circle cx={88} cy={54} r={4} fill={`url(#eye-${id})`} />
        <circle cx={112} cy={54} r={4} fill={`url(#eye-${id})`} />
        <path d="M94,66 L100,58 L106,66 L100,72Z" fill={t.accent} stroke={dk} strokeWidth="1" />
        <ellipse cx="100" cy="112" rx="26" ry="32" fill={bf} stroke={dk} strokeWidth="2" />
      </g>
    ),
    '戌': (
      <g>
        <path d="M72,48 C66,24 62,10 68,8 C74,6 78,22 80,40Z" fill={bf} stroke={dk} strokeWidth="2" />
        <path d="M128,48 C134,24 138,10 132,8 C126,6 122,22 120,40Z" fill={bf} stroke={dk} strokeWidth="2" />
        <path d="M72,48 C76,38 86,30 100,30 C114,30 124,38 128,48 C134,62 134,78 128,88 C122,96 112,102 100,104 C88,102 78,96 72,88 C66,78 66,62 72,48Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <ellipse cx="86" cy="62" rx="6" ry="6.5" fill={`url(#eye-${id})`} />
        <ellipse cx="114" cy="62" rx="6" ry="6.5" fill={`url(#eye-${id})`} />
        <ellipse cx="100" cy="76" rx="7" ry="5" fill={dk} />
        <path d="M80,100 C76,110 74,126 76,140 C78,152 90,160 100,162 C110,160 122,152 124,140 C126,126 124,110 120,100" fill={bf} stroke={dk} strokeWidth="2" />
        <path d="M78,100 C86,96 96,94 100,94 C104,94 114,96 122,100" fill="none" stroke={t.accent} strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
    '亥': (
      <g>
        <path d="M74,42 C70,28 74,18 80,20 C84,22 82,34 80,42Z" fill={bf} stroke={dk} strokeWidth={sw} />
        <path d="M126,42 C130,28 126,18 120,20 C116,22 118,34 120,42Z" fill={bf} stroke={dk} strokeWidth={sw} />
        <path d="M68,46 C74,34 86,26 100,26 C114,26 126,34 132,46 C138,60 140,76 136,90 C132,100 120,108 100,110 C80,108 68,100 64,90 C60,76 62,60 68,46Z" fill={bf} stroke={dk} strokeWidth="2.5" />
        <circle cx="82" cy="66" r="4" fill={`url(#eye-${id})`} />
        <circle cx="118" cy="66" r="4" fill={`url(#eye-${id})`} />
        <ellipse cx="100" cy="84" rx="14" ry="10" fill={t.primary} opacity="0.4" stroke={dk} strokeWidth="1.5" />
        <path d="M84,94 C82,100 80,106 82,110" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M116,94 C118,100 120,106 118,110" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M76,108 C70,120 68,136 72,150 C76,160 88,168 100,168 C112,168 124,160 128,150 C132,136 130,120 124,108" fill={bf} stroke={dk} strokeWidth="2" />
      </g>
    ),
  };

  return (
    <>
      {defs}
      {arts[shi]}
    </>
  );
}

interface ZodiacCharacterProps {
  shi: Junishi;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ZodiacCharacter({ shi, size = 'md' }: ZodiacCharacterProps) {
  const t = ZODIAC_MAP[shi];
  const sizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
    xl: 'w-32 h-32 sm:w-40 sm:h-40',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* シンプルなリング（静的） */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
          <circle cx="100" cy="100" r="97" fill="none" stroke={t.primary} strokeWidth="0.8" />
        </svg>

        {/* メインアート（フィルターなし） */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          <ZodiacArt shi={shi} t={t} />
        </svg>
      </div>

      {/* ラベル */}
      <div className="text-center space-y-0.5">
        <p className="text-sm sm:text-base font-black tracking-[0.2em]" style={{ color: t.primary }}>
          {shi} ─ {t.animal}
        </p>
        <p className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.15em]" style={{ color: `${t.primary}70` }}>
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
