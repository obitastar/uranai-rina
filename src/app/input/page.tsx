"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StarField } from "@/components/StarField";

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

export default function InputPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [hour, setHour] = useState<number | "unknown">("unknown");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = () => {
    if (year === "" || month === "" || day === "" || gender === "") {
      setError("必須項目を入力してください");
      return;
    }

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      setError("存在しない日付です");
      return;
    }

    setSubmitting(true);
    const params = new URLSearchParams({
      y: String(year),
      m: String(month),
      d: String(day),
      h: hour === "unknown" ? "" : String(hour),
      g: gender,
    });

    // 画面フェードアウト後に遷移
    setTimeout(() => {
      router.push(`/result?${params.toString()}`);
    }, 600);
  };

  const selectClass =
    "w-full rounded-xl bg-navy-800/60 border border-gold-500/20 text-navy-50 px-4 py-4 text-lg focus:outline-none focus:border-gold-500/60 focus:bg-navy-800/80 focus:shadow-[0_0_20px_rgba(212,160,23,0.1)] transition-all duration-300 appearance-none backdrop-blur-sm";

  return (
    <main
      className={`relative flex flex-1 flex-col items-center justify-center px-6 py-8 bg-mystical min-h-screen transition-opacity duration-500 ${
        submitting ? "opacity-0 scale-95" : "opacity-100"
      }`}
    >
      <StarField />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* ヘッダー */}
        <div className={`text-center space-y-3 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div className="text-gold-500/60 text-3xl mb-2">☰</div>
          <h1 className="text-3xl font-bold tracking-[0.3em] text-gold-gradient-animated">
            生年月日入力
          </h1>
          <div className="w-20 h-px mx-auto animate-glow-line" />
          <p className="text-xs text-navy-400 tracking-widest">
            あなたの運命を読み解くための情報を入力してください
          </p>
        </div>

        {/* フォーム */}
        <div
          className={`ornament-border rounded-2xl bg-navy-900/40 p-8 space-y-7 backdrop-blur-md animate-breathe ${
            mounted ? 'animate-fade-in-up stagger-1 opacity-0' : 'opacity-0'
          }`}
        >
          {/* 生年月日 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gold-400/80 tracking-widest font-medium">
              <span className="w-1 h-4 bg-gold-500/60 rounded-full" />
              生年月日 <span className="text-red-400/80 text-xs">必須</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => { setYear(e.target.value ? Number(e.target.value) : ""); setError(""); }}
                  className={selectClass}
                >
                  <option value="">年</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={month}
                  onChange={(e) => { setMonth(e.target.value ? Number(e.target.value) : ""); setError(""); }}
                  className={selectClass}
                >
                  <option value="">月</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={day}
                  onChange={(e) => { setDay(e.target.value ? Number(e.target.value) : ""); setError(""); }}
                  className={selectClass}
                >
                  <option value="">日</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 出生時刻 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gold-400/80 tracking-widest font-medium">
              <span className="w-1 h-4 bg-gold-500/30 rounded-full" />
              出生時刻
              <span className="text-navy-500 text-xs ml-1">（任意）</span>
            </label>
            <select
              value={hour}
              onChange={(e) =>
                setHour(e.target.value === "unknown" ? "unknown" : Number(e.target.value))
              }
              className={selectClass}
            >
              <option value="unknown">不明</option>
              {HOURS.map((h) => (
                <option key={h} value={h}>{hourLabel(h)}</option>
              ))}
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
                  className={`relative py-5 rounded-xl text-lg font-medium transition-all duration-500 overflow-hidden ${
                    gender === value
                      ? "bg-gold-500/15 border-2 border-gold-500/60 text-gold-300 shadow-[0_0_30px_rgba(212,160,23,0.15)]"
                      : "bg-navy-800/40 border border-gold-500/10 text-navy-400 hover:border-gold-500/30 hover:text-navy-300"
                  }`}
                >
                  {gender === value && (
                    <div className="absolute inset-0 bg-gradient-to-t from-gold-500/10 to-transparent" />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    <span className={`text-xl transition-transform duration-300 ${gender === value ? 'scale-125' : ''}`}>{icon}</span>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* エラー */}
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400/90 text-sm animate-fade-in-up">
              <span>※</span>{error}
            </div>
          )}

          {/* 鑑定ボタン */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="group relative w-full py-5 rounded-xl overflow-hidden text-xl font-bold tracking-[0.25em] transition-all duration-500 active:scale-[0.97] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-700 via-gold-500 to-gold-700 group-hover:from-gold-600 group-hover:via-gold-400 group-hover:to-gold-600 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-navy-950 drop-shadow-sm">
              鑑定する
            </span>
          </button>
        </div>

        {/* 戻るリンク */}
        <div className={`text-center ${mounted ? 'animate-fade-in stagger-4 opacity-0' : 'opacity-0'}`}>
          <button
            onClick={() => router.push("/")}
            className="text-navy-500 hover:text-gold-500/60 text-sm tracking-widest transition-colors duration-300"
          >
            ← トップに戻る
          </button>
        </div>
      </div>
    </main>
  );
}
