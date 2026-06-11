"use client";

import { useState, useEffect } from "react";
import type { FortuneInput } from "@/lib/shichusuimei";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

function hourLabel(h: number): string {
  const period = h < 12 ? "午前" : "午後";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${period} ${h12}時`;
}

interface Props {
  myBirthLabel: string;
  onSubmit: (input: FortuneInput) => void;
  onBack: () => void;
}

export function ShichusuimeiAishoInputScreen({ myBirthLabel, onSubmit, onBack }: Props) {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [hour, setHour] = useState<number | "unknown">("unknown");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [error, setError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = () => {
    if (year === "" || month === "" || day === "" || gender === "") {
      setError("必須項目を入力してください");
      return;
    }
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      setError("存在しない日付です");
      return;
    }
    onSubmit({
      year,
      month,
      day,
      hour: hour === "unknown" ? null : hour,
      gender,
    });
  };

  const selectClass =
    "w-full rounded-xl bg-navy-800/60 border border-gold-500/20 text-navy-50 px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg focus:outline-none focus:border-gold-500/60 focus:bg-navy-800/80 focus:shadow-[0_0_20px_rgba(212,160,23,0.1)] transition-all duration-300 appearance-none";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-6 sm:py-8">
      <div className="relative z-10 w-full max-w-md space-y-5 sm:space-y-8">
        <div className={`text-center space-y-2 sm:space-y-3 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div className="text-gold-500/60 text-2xl sm:text-3xl mb-1 sm:mb-2">☯</div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] sm:tracking-[0.3em] text-gold-gradient">
            相性診断
          </h1>
          <div className="w-16 sm:w-20 h-px mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <p className="text-[0.65rem] sm:text-xs text-navy-400 tracking-widest">
            相手の生年月日を入力してください
          </p>
        </div>

        {/* 自分の情報表示 */}
        <div className={`ornament-border rounded-xl bg-navy-900/30 p-3 sm:p-4 text-center ${mounted ? 'animate-fade-in stagger-1 opacity-0' : 'opacity-0'}`}>
          <p className="text-xs text-navy-400/60 tracking-widest mb-1">あなた</p>
          <p className="text-sm text-gold-300/80 tracking-wider">{myBirthLabel}</p>
        </div>

        <div className={`ornament-border rounded-2xl bg-navy-900/40 p-5 sm:p-8 space-y-5 sm:space-y-7 ${mounted ? 'animate-fade-in-up stagger-2 opacity-0' : 'opacity-0'}`}>
          <div className="text-center">
            <p className="text-sm text-pink-300/70 tracking-widest font-medium">相手の情報</p>
          </div>

          {/* 生年月日 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gold-400/80 tracking-widest font-medium">
              <span className="w-1 h-4 bg-gold-500/60 rounded-full" />
              生年月日 <span className="text-red-400/80 text-xs">必須</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <select value={year} onChange={(e) => { setYear(e.target.value ? Number(e.target.value) : ""); setError(""); }} className={selectClass}>
                <option value="">年</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={month} onChange={(e) => { setMonth(e.target.value ? Number(e.target.value) : ""); setError(""); }} className={selectClass}>
                <option value="">月</option>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={day} onChange={(e) => { setDay(e.target.value ? Number(e.target.value) : ""); setError(""); }} className={selectClass}>
                <option value="">日</option>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* 出生時刻 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gold-400/80 tracking-widest font-medium">
              <span className="w-1 h-4 bg-gold-500/30 rounded-full" />
              出生時刻 <span className="text-navy-500 text-xs ml-1">（任意）</span>
            </label>
            <select value={hour} onChange={(e) => setHour(e.target.value === "unknown" ? "unknown" : Number(e.target.value))} className={selectClass}>
              <option value="unknown">不明</option>
              {HOURS.map((h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
            </select>
          </div>

          {/* 性別 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gold-400/80 tracking-widest font-medium">
              <span className="w-1 h-4 bg-gold-500/60 rounded-full" />
              性別 <span className="text-red-400/80 text-xs">必須</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {([
                { value: "male" as const, label: "男性", icon: "♂" },
                { value: "female" as const, label: "女性", icon: "♀" },
              ]).map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setGender(value); setError(""); }}
                  className={`relative py-4 sm:py-5 rounded-xl text-base sm:text-lg font-medium transition-colors duration-150 overflow-hidden ${
                    gender === value
                      ? "bg-gold-500/15 border-2 border-gold-500/60 text-gold-300 shadow-[0_0_30px_rgba(212,160,23,0.15)]"
                      : "bg-navy-800/40 border border-gold-500/10 text-navy-400 hover:border-gold-500/30 hover:text-navy-300"
                  }`}
                >
                  {gender === value && <div className="absolute inset-0 bg-gradient-to-t from-gold-500/10 to-transparent" />}
                  <span className="relative flex items-center justify-center gap-2">
                    <span className={`text-xl transition-transform duration-300 ${gender === value ? 'scale-125' : ''}`}>{icon}</span>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400/90 text-sm animate-fade-in-up">
              <span>※</span>{error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="group relative w-full py-4 sm:py-5 rounded-xl overflow-hidden text-lg sm:text-xl font-bold tracking-[0.2em] sm:tracking-[0.25em] transition-colors duration-150 active:scale-[0.97]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-700/80 via-pink-500/80 to-pink-700/80 group-hover:from-pink-600/80 group-hover:via-pink-400/80 group-hover:to-pink-600/80 transition-colors duration-150" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-white drop-shadow-sm">相性を鑑定する</span>
          </button>
        </div>

        <div className={`text-center ${mounted ? 'animate-fade-in stagger-4 opacity-0' : 'opacity-0'}`}>
          <button onClick={onBack} className="text-navy-500 hover:text-gold-500/60 text-sm tracking-widest transition-colors duration-300">
            ← 鑑定結果に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
