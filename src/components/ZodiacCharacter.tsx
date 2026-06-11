"use client";

import type { Junishi } from "@/lib/shichusuimei";

interface ZodiacTheme {
  animal: string;
  kanji: string;
  element: string;
  trait: string;
  primary: string;
  secondary: string;
  bg: string;
  cheek: string;
}

const ZODIAC_MAP: Record<Junishi, ZodiacTheme> = {
  '子': { animal: '鼠', kanji: '子', element: '水', trait: '知恵と機敏さの守護', primary: '#60A5FA', secondary: '#DBEAFE', bg: '#1E3A5F', cheek: '#FCA5A5' },
  '丑': { animal: '牛', kanji: '丑', element: '土', trait: '忍耐と誠実さの守護', primary: '#C8956B', secondary: '#F5E6D3', bg: '#5C3310', cheek: '#FDBA74' },
  '寅': { animal: '虎', kanji: '寅', element: '木', trait: '勇気と威厳の守護', primary: '#FB923C', secondary: '#FED7AA', bg: '#7C2D12', cheek: '#FDE047' },
  '卯': { animal: '兎', kanji: '卯', element: '木', trait: '優美と幸運の守護', primary: '#F9A8D4', secondary: '#FCE7F3', bg: '#831843', cheek: '#FCA5A5' },
  '辰': { animal: '龍', kanji: '辰', element: '土', trait: '権威と繁栄の守護', primary: '#FBBF24', secondary: '#FEF3C7', bg: '#78350F', cheek: '#FDE68A' },
  '巳': { animal: '蛇', kanji: '巳', element: '火', trait: '知恵と神秘の守護', primary: '#C084FC', secondary: '#EDE9FE', bg: '#581C87', cheek: '#F0ABFC' },
  '午': { animal: '馬', kanji: '午', element: '火', trait: '情熱と行動力の守護', primary: '#F87171', secondary: '#FEE2E2', bg: '#7F1D1D', cheek: '#FDBA74' },
  '未': { animal: '羊', kanji: '未', element: '土', trait: '温和と芸術性の守護', primary: '#6EE7B7', secondary: '#D1FAE5', bg: '#064E3B', cheek: '#FCA5A5' },
  '申': { animal: '猿', kanji: '申', element: '金', trait: '才知と器用さの守護', primary: '#FCD34D', secondary: '#FEF9C3', bg: '#713F12', cheek: '#FCA5A5' },
  '酉': { animal: '鶏', kanji: '酉', element: '金', trait: '誠実と先見性の守護', primary: '#F97316', secondary: '#FED7AA', bg: '#431407', cheek: '#FDE047' },
  '戌': { animal: '犬', kanji: '戌', element: '土', trait: '忠誠と正義の守護', primary: '#D97706', secondary: '#F5DEB3', bg: '#4A2C17', cheek: '#FCA5A5' },
  '亥': { animal: '猪', kanji: '亥', element: '水', trait: '勇猛と直進の守護', primary: '#818CF8', secondary: '#E0E7FF', bg: '#312E81', cheek: '#FCA5A5' },
};

// キラキラパーティクル（SVGアニメーション）
function Sparkles({ color }: { color: string }) {
  const sparkles = [
    { cx: 25, cy: 30, delay: '0s', size: 2.5 },
    { cx: 170, cy: 25, delay: '0.6s', size: 2 },
    { cx: 15, cy: 120, delay: '1.2s', size: 1.8 },
    { cx: 180, cy: 110, delay: '0.3s', size: 2.2 },
    { cx: 40, cy: 165, delay: '0.9s', size: 1.5 },
    { cx: 160, cy: 160, delay: '1.5s', size: 2 },
    { cx: 55, cy: 15, delay: '1.8s', size: 1.8 },
    { cx: 145, cy: 170, delay: '0.4s', size: 1.6 },
  ];

  return (
    <g>
      {sparkles.map((s, i) => (
        <g key={i}>
          <line
            x1={s.cx - s.size * 2} y1={s.cy}
            x2={s.cx + s.size * 2} y2={s.cy}
            stroke={color} strokeWidth={s.size * 0.6} strokeLinecap="round"
            opacity="0"
          >
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin={s.delay} repeatCount="indefinite" />
          </line>
          <line
            x1={s.cx} y1={s.cy - s.size * 2}
            x2={s.cx} y2={s.cy + s.size * 2}
            stroke={color} strokeWidth={s.size * 0.6} strokeLinecap="round"
            opacity="0"
          >
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin={s.delay} repeatCount="indefinite" />
          </line>
          <line
            x1={s.cx - s.size} y1={s.cy - s.size}
            x2={s.cx + s.size} y2={s.cy + s.size}
            stroke="white" strokeWidth={s.size * 0.4} strokeLinecap="round"
            opacity="0"
          >
            <animate attributeName="opacity" values="0;0.7;0" dur="2s" begin={s.delay} repeatCount="indefinite" />
          </line>
          <line
            x1={s.cx + s.size} y1={s.cy - s.size}
            x2={s.cx - s.size} y2={s.cy + s.size}
            stroke="white" strokeWidth={s.size * 0.4} strokeLinecap="round"
            opacity="0"
          >
            <animate attributeName="opacity" values="0;0.7;0" dur="2s" begin={s.delay} repeatCount="indefinite" />
          </line>
        </g>
      ))}
    </g>
  );
}

// 回転するオーラリング
function AuraRing({ color }: { color: string }) {
  return (
    <g>
      <circle cx="100" cy="100" r="96" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="6 12" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="12s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="92" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="3 8" opacity="0.25">
        <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="18s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

// パルスするグロー背景
function GlowPulse({ color, bg }: { color: string; bg: string }) {
  return (
    <g>
      <circle cx="100" cy="100" r="88" fill={`${bg}50`}>
        <animate attributeName="r" values="86;90;86" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3">
        <animate attributeName="r" values="78;82;78" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function CuteZodiacArt({ shi, t }: { shi: Junishi; t: ZodiacTheme }) {
  const p = t.primary;
  const s = t.secondary;
  const ch = t.cheek;

  switch (shi) {
    case '子':
      return (
        <g>
          <ellipse cx="100" cy="120" rx="30" ry="35" fill={p} />
          <circle cx="100" cy="78" r="32" fill={p} />
          <circle cx="70" cy="55" r="18" fill={p} stroke={s} strokeWidth="2" />
          <circle cx="70" cy="55" r="11" fill={s} opacity="0.5" />
          <circle cx="130" cy="55" r="18" fill={p} stroke={s} strokeWidth="2" />
          <circle cx="130" cy="55" r="11" fill={s} opacity="0.5" />
          <circle cx="100" cy="78" r="30" fill={s} />
          <circle cx="78" cy="88" r="7" fill={ch} opacity="0.5" />
          <circle cx="122" cy="88" r="7" fill={ch} opacity="0.5" />
          <circle cx="87" cy="74" r="8" fill="#1a1a2e" />
          <circle cx="113" cy="74" r="8" fill="#1a1a2e" />
          <circle cx="85" cy="71" r="3" fill="white" />
          <circle cx="111" cy="71" r="3" fill="white" />
          <circle cx="89" cy="76" r="1.5" fill="white" />
          <circle cx="115" cy="76" r="1.5" fill="white" />
          <ellipse cx="100" cy="86" rx="4" ry="3" fill="#F472B6" />
          <path d="M96,91 Q100,95 104,91" fill="none" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="68" y1="82" x2="84" y2="84" stroke={p} strokeWidth="1.2" opacity="0.6" />
          <line x1="68" y1="88" x2="84" y2="88" stroke={p} strokeWidth="1.2" opacity="0.6" />
          <line x1="132" y1="82" x2="116" y2="84" stroke={p} strokeWidth="1.2" opacity="0.6" />
          <line x1="132" y1="88" x2="116" y2="88" stroke={p} strokeWidth="1.2" opacity="0.6" />
        </g>
      );
    case '丑':
      return (
        <g>
          <ellipse cx="100" cy="125" rx="32" ry="30" fill={p} />
          <path d="M72,52 C65,35 60,25 65,22 C70,20 75,30 78,45" fill={s} stroke={p} strokeWidth="2" />
          <path d="M128,52 C135,35 140,25 135,22 C130,20 125,30 122,45" fill={s} stroke={p} strokeWidth="2" />
          <circle cx="100" cy="80" r="35" fill={s} />
          <ellipse cx="62" cy="72" rx="12" ry="8" fill={p} />
          <ellipse cx="138" cy="72" rx="12" ry="8" fill={p} />
          <circle cx="78" cy="92" r="7" fill={ch} opacity="0.4" />
          <circle cx="122" cy="92" r="7" fill={ch} opacity="0.4" />
          <circle cx="85" cy="76" r="7" fill="#1a1a2e" />
          <circle cx="115" cy="76" r="7" fill="#1a1a2e" />
          <circle cx="83" cy="73" r="2.5" fill="white" />
          <circle cx="113" cy="73" r="2.5" fill="white" />
          <ellipse cx="100" cy="92" rx="14" ry="10" fill={p} opacity="0.5" />
          <circle cx="94" cy="92" r="3" fill="#5C3310" opacity="0.5" />
          <circle cx="106" cy="92" r="3" fill="#5C3310" opacity="0.5" />
          <path d="M94,100 Q100,105 106,100" fill="none" stroke="#5C3310" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case '寅':
      return (
        <g>
          <ellipse cx="100" cy="125" rx="28" ry="30" fill={p} />
          <path d="M72,48 C68,32 72,22 80,24 C86,26 82,38 80,46Z" fill={p} stroke="#FDE047" strokeWidth="1.5" />
          <path d="M128,48 C132,32 128,22 120,24 C114,26 118,38 120,46Z" fill={p} stroke="#FDE047" strokeWidth="1.5" />
          <circle cx="100" cy="78" r="34" fill={s} />
          <path d="M80,55 C85,50 90,52 92,55" fill="none" stroke={p} strokeWidth="3" strokeLinecap="round" />
          <path d="M100,48 L100,56" stroke={p} strokeWidth="3" strokeLinecap="round" />
          <path d="M108,55 C115,50 120,52 120,55" fill="none" stroke={p} strokeWidth="3" strokeLinecap="round" />
          <circle cx="76" cy="88" r="7" fill={ch} opacity="0.5" />
          <circle cx="124" cy="88" r="7" fill={ch} opacity="0.5" />
          <ellipse cx="86" cy="74" rx="7" ry="8" fill="#1a1a2e" />
          <ellipse cx="114" cy="74" rx="7" ry="8" fill="#1a1a2e" />
          <circle cx="84" cy="71" r="3" fill="white" />
          <circle cx="112" cy="71" r="3" fill="white" />
          <path d="M96,86 L100,90 L104,86Z" fill="#F472B6" />
          <path d="M92,94 Q100,100 108,94" fill="none" stroke="#9D174D" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M93,94 L92,98" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M107,94 L108,98" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case '卯':
      return (
        <g>
          <ellipse cx="100" cy="130" rx="28" ry="30" fill={s} />
          <ellipse cx="82" cy="28" rx="10" ry="32" fill={s} stroke={p} strokeWidth="2" />
          <ellipse cx="82" cy="28" rx="5" ry="22" fill={p} opacity="0.3" />
          <ellipse cx="118" cy="28" rx="10" ry="32" fill={s} stroke={p} strokeWidth="2" />
          <ellipse cx="118" cy="28" rx="5" ry="22" fill={p} opacity="0.3" />
          <circle cx="100" cy="82" r="32" fill={s} />
          <circle cx="76" cy="90" r="8" fill={ch} opacity="0.5" />
          <circle cx="124" cy="90" r="8" fill={ch} opacity="0.5" />
          <ellipse cx="86" cy="78" rx="9" ry="10" fill="#1a1a2e" />
          <ellipse cx="114" cy="78" rx="9" ry="10" fill="#1a1a2e" />
          <circle cx="83" cy="74" r="4" fill="white" />
          <circle cx="111" cy="74" r="4" fill="white" />
          <circle cx="88" cy="80" r="2" fill="white" />
          <circle cx="116" cy="80" r="2" fill="white" />
          <ellipse cx="100" cy="90" rx="3" ry="2.5" fill="#F472B6" />
          <path d="M100,92 L100,96" stroke="#9D174D" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M96,99 Q100,96 104,99" fill="none" stroke="#9D174D" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="128" cy="140" r="9" fill="white" />
        </g>
      );
    case '辰':
      return (
        <g>
          <ellipse cx="100" cy="128" rx="26" ry="28" fill={p} />
          <path d="M76,48 C68,32 64,20 70,18 C76,16 78,28 80,40" fill="#FDE047" stroke={p} strokeWidth="1.5" />
          <path d="M124,48 C132,32 136,20 130,18 C124,16 122,28 120,40" fill="#FDE047" stroke={p} strokeWidth="1.5" />
          <circle cx="100" cy="78" r="35" fill={p} />
          <circle cx="100" cy="82" r="30" fill={s} />
          <circle cx="74" cy="90" r="7" fill={ch} opacity="0.5" />
          <circle cx="126" cy="90" r="7" fill={ch} opacity="0.5" />
          <ellipse cx="85" cy="76" rx="8" ry="9" fill="#1a1a2e" />
          <ellipse cx="115" cy="76" rx="8" ry="9" fill="#1a1a2e" />
          <circle cx="83" cy="73" r="3.5" fill="white" />
          <circle cx="113" cy="73" r="3.5" fill="white" />
          <circle cx="87" cy="78" r="1.5" fill="white" />
          <circle cx="117" cy="78" r="1.5" fill="white" />
          <circle cx="95" cy="90" r="2.5" fill={p} />
          <circle cx="105" cy="90" r="2.5" fill={p} />
          <path d="M92,96 Q100,102 108,96" fill="none" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M66,82 C72,78 78,80 82,82" fill="none" stroke={p} strokeWidth="2" strokeLinecap="round" />
          <path d="M134,82 C128,78 122,80 118,82" fill="none" stroke={p} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case '巳':
      return (
        <g>
          <path d="M70,130 C70,155 130,155 130,130 C130,110 110,105 100,110 C90,115 80,110 80,100 C80,90 90,85 100,88" fill={p} stroke={s} strokeWidth="2" />
          <path d="M75,135 C75,148 125,148 125,135" fill={s} opacity="0.3" />
          <circle cx="100" cy="68" r="30" fill={p} />
          <circle cx="100" cy="70" r="26" fill={s} />
          <circle cx="100" cy="40" r="7" fill="#FDE047" />
          <circle cx="100" cy="40" r="4" fill="#FBBF24" />
          <circle cx="78" cy="78" r="6" fill={ch} opacity="0.5" />
          <circle cx="122" cy="78" r="6" fill={ch} opacity="0.5" />
          <ellipse cx="87" cy="66" rx="7" ry="8" fill="#1a1a2e" />
          <ellipse cx="113" cy="66" rx="7" ry="8" fill="#1a1a2e" />
          <ellipse cx="87" cy="66" rx="2" ry="6" fill={p} opacity="0.3" />
          <ellipse cx="113" cy="66" rx="2" ry="6" fill={p} opacity="0.3" />
          <circle cx="85" cy="63" r="3" fill="white" />
          <circle cx="111" cy="63" r="3" fill="white" />
          <path d="M94,80 Q100,84 106,80" fill="none" stroke="#581C87" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M98,82 L96,90 M102,82 L104,90" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case '午':
      return (
        <g>
          <ellipse cx="100" cy="130" rx="28" ry="30" fill={p} />
          <path d="M85,38 C82,22 86,14 92,18 L90,34Z" fill="#FDE047" stroke={p} strokeWidth="1" />
          <path d="M95,34 C94,16 98,8 104,12 L100,30Z" fill="#FBBF24" stroke={p} strokeWidth="1" />
          <path d="M108,38 C112,24 108,16 104,18 L106,34Z" fill="#FDE047" stroke={p} strokeWidth="1" />
          <circle cx="100" cy="74" r="34" fill={s} />
          <path d="M68,52 C64,40 68,34 74,36 C78,38 76,46 74,52Z" fill={p} />
          <path d="M132,52 C136,40 132,34 126,36 C122,38 124,46 126,52Z" fill={p} />
          <circle cx="76" cy="84" r="7" fill={ch} opacity="0.5" />
          <circle cx="124" cy="84" r="7" fill={ch} opacity="0.5" />
          <circle cx="86" cy="70" r="8" fill="#1a1a2e" />
          <circle cx="114" cy="70" r="8" fill="#1a1a2e" />
          <circle cx="84" cy="67" r="3" fill="white" />
          <circle cx="112" cy="67" r="3" fill="white" />
          <ellipse cx="93" cy="88" rx="3" ry="2" fill="#7F1D1D" opacity="0.5" />
          <ellipse cx="107" cy="88" rx="3" ry="2" fill="#7F1D1D" opacity="0.5" />
          <path d="M94,94 Q100,99 106,94" fill="none" stroke="#7F1D1D" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case '未':
      return (
        <g>
          <circle cx="80" cy="130" r="16" fill="white" />
          <circle cx="100" cy="135" r="18" fill="white" />
          <circle cx="120" cy="130" r="16" fill="white" />
          <circle cx="88" cy="118" r="14" fill="white" />
          <circle cx="112" cy="118" r="14" fill="white" />
          <path d="M78,48 C68,42 62,36 66,32 C70,28 76,34 80,42" fill={p} strokeWidth="1.5" />
          <path d="M122,48 C132,42 138,36 134,32 C130,28 124,34 120,42" fill={p} strokeWidth="1.5" />
          <circle cx="76" cy="56" r="10" fill="white" />
          <circle cx="100" cy="50" r="12" fill="white" />
          <circle cx="124" cy="56" r="10" fill="white" />
          <circle cx="100" cy="76" r="28" fill={s} />
          <circle cx="78" cy="84" r="7" fill={ch} opacity="0.5" />
          <circle cx="122" cy="84" r="7" fill={ch} opacity="0.5" />
          <circle cx="88" cy="72" r="6" fill="#1a1a2e" />
          <circle cx="112" cy="72" r="6" fill="#1a1a2e" />
          <circle cx="86" cy="70" r="2.5" fill="white" />
          <circle cx="110" cy="70" r="2.5" fill="white" />
          <ellipse cx="100" cy="82" rx="3" ry="2.5" fill="#F472B6" />
          <path d="M96,87 Q100,91 104,87" fill="none" stroke="#064E3B" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    case '申':
      return (
        <g>
          <ellipse cx="100" cy="130" rx="26" ry="28" fill={p} />
          <circle cx="65" cy="70" r="14" fill={p} />
          <circle cx="65" cy="70" r="9" fill={s} />
          <circle cx="135" cy="70" r="14" fill={p} />
          <circle cx="135" cy="70" r="9" fill={s} />
          <circle cx="100" cy="72" r="32" fill={p} />
          <ellipse cx="100" cy="80" rx="22" ry="20" fill={s} />
          <circle cx="80" cy="86" r="6" fill={ch} opacity="0.5" />
          <circle cx="120" cy="86" r="6" fill={ch} opacity="0.5" />
          <circle cx="88" cy="72" r="7" fill="#1a1a2e" />
          <circle cx="112" cy="72" r="7" fill="#1a1a2e" />
          <circle cx="86" cy="69" r="3" fill="white" />
          <circle cx="110" cy="69" r="3" fill="white" />
          <ellipse cx="100" cy="82" rx="4" ry="3" fill="#713F12" opacity="0.6" />
          <path d="M90,90 Q100,98 110,90" fill="none" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
          <circle cx="56" cy="108" r="8" fill="#F9A8D4" />
          <path d="M55,100 C56,96 58,96 59,100" fill="#4ADE80" />
        </g>
      );
    case '酉':
      return (
        <g>
          <ellipse cx="100" cy="125" rx="28" ry="32" fill={s} />
          <ellipse cx="68" cy="120" rx="14" ry="8" fill={p} opacity="0.7" />
          <ellipse cx="132" cy="120" rx="14" ry="8" fill={p} opacity="0.7" />
          <circle cx="92" cy="36" r="7" fill="#EF4444" />
          <circle cx="100" cy="32" r="8" fill="#EF4444" />
          <circle cx="108" cy="36" r="7" fill="#EF4444" />
          <circle cx="100" cy="70" r="30" fill={s} />
          <circle cx="78" cy="78" r="6" fill={ch} opacity="0.5" />
          <circle cx="122" cy="78" r="6" fill={ch} opacity="0.5" />
          <circle cx="88" cy="66" r="7" fill="#1a1a2e" />
          <circle cx="112" cy="66" r="7" fill="#1a1a2e" />
          <circle cx="86" cy="63" r="3" fill="white" />
          <circle cx="110" cy="63" r="3" fill="white" />
          <path d="M94,78 L100,72 L106,78 L100,84Z" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
          <path d="M99,84 C97,90 98,93 100,92" fill="#EF4444" />
          <path d="M88,150 C80,160 75,170 80,172" fill={p} stroke={p} strokeWidth="2" />
          <path d="M100,152 L100,172" stroke={p} strokeWidth="3" strokeLinecap="round" />
          <path d="M112,150 C120,160 125,170 120,172" fill={p} stroke={p} strokeWidth="2" />
        </g>
      );
    case '戌':
      return (
        <g>
          <ellipse cx="100" cy="130" rx="28" ry="30" fill={p} />
          <ellipse cx="70" cy="72" rx="14" ry="22" fill={s} stroke={p} strokeWidth="2" transform="rotate(-10 70 72)" />
          <ellipse cx="130" cy="72" rx="14" ry="22" fill={s} stroke={p} strokeWidth="2" transform="rotate(10 130 72)" />
          <circle cx="100" cy="78" r="32" fill={s} />
          <path d="M74,105 Q100,112 126,105" fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="110" r="4" fill="#FDE047" />
          <circle cx="76" cy="88" r="7" fill={ch} opacity="0.5" />
          <circle cx="124" cy="88" r="7" fill={ch} opacity="0.5" />
          <circle cx="86" cy="74" r="8" fill="#1a1a2e" />
          <circle cx="114" cy="74" r="8" fill="#1a1a2e" />
          <circle cx="84" cy="71" r="3.5" fill="white" />
          <circle cx="112" cy="71" r="3.5" fill="white" />
          <circle cx="88" cy="76" r="1.5" fill="white" />
          <circle cx="116" cy="76" r="1.5" fill="white" />
          <ellipse cx="100" cy="86" rx="6" ry="4.5" fill="#1a1a2e" />
          <circle cx="98" cy="84" r="1.5" fill="white" opacity="0.4" />
          <path d="M100,90 L100,94" stroke="#4A2C17" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M93,97 Q100,102 107,97" fill="none" stroke="#4A2C17" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M130,130 C140,125 145,118 142,112" fill="none" stroke={p} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case '亥':
      return (
        <g>
          <ellipse cx="100" cy="128" rx="30" ry="32" fill={p} />
          <path d="M74,50 C70,38 74,30 80,32 C84,34 82,42 80,48Z" fill={p} stroke={s} strokeWidth="1.5" />
          <path d="M126,50 C130,38 126,30 120,32 C116,34 118,42 120,48Z" fill={p} stroke={s} strokeWidth="1.5" />
          <circle cx="100" cy="76" r="32" fill={s} />
          <rect x="90" y="50" width="3" height="14" rx="1.5" fill={p} opacity="0.5" />
          <rect x="99" y="48" width="3" height="16" rx="1.5" fill={p} opacity="0.5" />
          <rect x="108" y="50" width="3" height="14" rx="1.5" fill={p} opacity="0.5" />
          <circle cx="76" cy="84" r="7" fill={ch} opacity="0.5" />
          <circle cx="124" cy="84" r="7" fill={ch} opacity="0.5" />
          <circle cx="86" cy="72" r="6" fill="#1a1a2e" />
          <circle cx="114" cy="72" r="6" fill="#1a1a2e" />
          <circle cx="84" cy="70" r="2.5" fill="white" />
          <circle cx="112" cy="70" r="2.5" fill="white" />
          <ellipse cx="100" cy="88" rx="12" ry="9" fill={p} opacity="0.6" />
          <circle cx="95" cy="88" r="3" fill="#312E81" opacity="0.4" />
          <circle cx="105" cy="88" r="3" fill="#312E81" opacity="0.4" />
          <path d="M88,96 L86,102" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M112,96 L114,102" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M94,98 Q100,102 106,98" fill="none" stroke="#312E81" strokeWidth="1.2" strokeLinecap="round" />
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
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
    xl: 'w-32 h-32 sm:w-40 sm:h-40',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]} animate-zodiac-float`}>
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible">
          <GlowPulse color={t.primary} bg={t.bg} />
          <AuraRing color={t.primary} />
          <CuteZodiacArt shi={shi} t={t} />
          <Sparkles color={t.primary} />
        </svg>
      </div>

      <div className="text-center space-y-0.5">
        <p className="text-sm sm:text-base font-black tracking-[0.2em]" style={{ color: t.primary }}>
          {shi} ─ {t.animal}
        </p>
        <p className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.15em]" style={{ color: `${t.primary}90` }}>
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
        borderColor: `${t.primary}40`,
        backgroundColor: `${t.primary}10`,
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
