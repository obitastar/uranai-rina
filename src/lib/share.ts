// 診断結果の共有URL生成・パース

const BASE_URL = "https://obitastar.github.io/uranai-rina/";

// LINE公式アカウントの友だち追加URL（取得後に差し替え）
export const LINE_ADD_FRIEND_URL = "https://lin.ee/XXXXXXXXX";

export type ShareType = "shichusuimei" | "seimei" | "shichusuimei-aisho" | "seimei-aisho";

// --- エンコード ---

export function encodeShichusuimei(year: number, month: number, day: number, hour: number | null, gender: string, full = false): string {
  const h = hour !== null ? String(hour) : "x";
  return `${BASE_URL}#s=${year}.${month}.${day}.${h}.${gender === "male" ? "m" : "f"}${full ? "&f" : ""}`;
}

export function encodeSeimei(sei: string, mei: string, full = false): string {
  return `${BASE_URL}#n=${encodeURIComponent(sei)}.${encodeURIComponent(mei)}${full ? "&f" : ""}`;
}

export function encodeShichusuimeiAisho(
  y1: number, m1: number, d1: number, h1: number | null, g1: string,
  y2: number, m2: number, d2: number, h2: number | null, g2: string,
  full = false,
): string {
  const h1s = h1 !== null ? String(h1) : "x";
  const h2s = h2 !== null ? String(h2) : "x";
  return `${BASE_URL}#sa=${y1}.${m1}.${d1}.${h1s}.${g1 === "male" ? "m" : "f"}_${y2}.${m2}.${d2}.${h2s}.${g2 === "male" ? "m" : "f"}${full ? "&f" : ""}`;
}

export function encodeSeimeiAisho(sei1: string, mei1: string, sei2: string, mei2: string, full = false): string {
  return `${BASE_URL}#na=${encodeURIComponent(sei1)}.${encodeURIComponent(mei1)}_${encodeURIComponent(sei2)}.${encodeURIComponent(mei2)}${full ? "&f" : ""}`;
}

// --- デコード ---

interface ShichusuimeiParams {
  type: "shichusuimei";
  year: number; month: number; day: number; hour: number | null; gender: "male" | "female";
}

interface SeimeiParams {
  type: "seimei";
  sei: string; mei: string;
}

interface ShichusuimeiAishoParams {
  type: "shichusuimei-aisho";
  person1: { year: number; month: number; day: number; hour: number | null; gender: "male" | "female" };
  person2: { year: number; month: number; day: number; hour: number | null; gender: "male" | "female" };
}

interface SeimeiAishoParams {
  type: "seimei-aisho";
  person1: { sei: string; mei: string };
  person2: { sei: string; mei: string };
}

export type ShareParams = (ShichusuimeiParams | SeimeiParams | ShichusuimeiAishoParams | SeimeiAishoParams) & { full: boolean };

function parseShichuPart(part: string): { year: number; month: number; day: number; hour: number | null; gender: "male" | "female" } | null {
  const segments = part.split(".");
  if (segments.length !== 5) return null;
  const year = parseInt(segments[0], 10);
  const month = parseInt(segments[1], 10);
  const day = parseInt(segments[2], 10);
  const hour = segments[3] === "x" ? null : parseInt(segments[3], 10);
  const gender = segments[4] === "m" ? "male" as const : "female" as const;
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (hour !== null && isNaN(hour)) return null;
  return { year, month, day, hour, gender };
}

function parseSeimeiPart(part: string): { sei: string; mei: string } | null {
  const dotIdx = part.indexOf(".");
  if (dotIdx === -1) return null;
  const sei = decodeURIComponent(part.slice(0, dotIdx));
  const mei = decodeURIComponent(part.slice(dotIdx + 1));
  if (!sei || !mei) return null;
  return { sei, mei };
}

export function parseHash(hash: string): ShareParams | null {
  if (!hash || !hash.startsWith("#")) return null;

  // &f フラグの検出と除去
  const full = hash.includes("&f");
  const body = hash.slice(1).replace("&f", "");

  // 四柱推命
  if (body.startsWith("s=")) {
    const p = parseShichuPart(body.slice(2));
    if (!p) return null;
    return { type: "shichusuimei", ...p, full };
  }

  // 姓名判断
  if (body.startsWith("n=")) {
    const p = parseSeimeiPart(body.slice(2));
    if (!p) return null;
    return { type: "seimei", ...p, full };
  }

  // 四柱推命相性
  if (body.startsWith("sa=")) {
    const parts = body.slice(3).split("_");
    if (parts.length !== 2) return null;
    const p1 = parseShichuPart(parts[0]);
    const p2 = parseShichuPart(parts[1]);
    if (!p1 || !p2) return null;
    return { type: "shichusuimei-aisho", person1: p1, person2: p2, full };
  }

  // 姓名判断相性
  if (body.startsWith("na=")) {
    const parts = body.slice(3).split("_");
    if (parts.length !== 2) return null;
    const p1 = parseSeimeiPart(parts[0]);
    const p2 = parseSeimeiPart(parts[1]);
    if (!p1 || !p2) return null;
    return { type: "seimei-aisho", person1: p1, person2: p2, full };
  }

  return null;
}
