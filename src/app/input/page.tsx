"use client";

import { useState } from "react";
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
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [hour, setHour] = useState<number | "unknown">("unknown");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (year === "" || month === "" || day === "" || gender === "") {
      setError("必須項目を入力してください");
      return;
    }

    // 日付の妥当性チェック
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      setError("存在しない日付です");
      return;
    }

    const params = new URLSearchParams({
      y: String(year),
      m: String(month),
      d: String(day),
      h: hour === "unknown" ? "" : String(hour),
      g: gender,
    });

    router.push(`/result?${params.toString()}`);
  };

  const selectClass =
    "w-full rounded-lg bg-navy-800/80 border border-gold-500/30 text-navy-50 px-4 py-4 text-lg focus:outline-none focus:border-gold-500 transition-colors appearance-none";

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-8">
      <StarField />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-[0.2em] text-gold-gradient">
            生年月日入力
          </h1>
          <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>

        {/* フォーム */}
        <div className="ornament-border rounded-2xl bg-navy-900/60 p-8 space-y-6 backdrop-blur-sm">
          {/* 生年月日 */}
          <div className="space-y-3">
            <label className="block text-sm text-gold-400 tracking-wider">
              生年月日 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
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
                  onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : "")}
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
                  onChange={(e) => setDay(e.target.value ? Number(e.target.value) : "")}
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
            <label className="block text-sm text-gold-400 tracking-wider">
              出生時刻
              <span className="text-navy-400 ml-2 text-xs">（わからない場合は「不明」のまま）</span>
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
            <label className="block text-sm text-gold-400 tracking-wider">
              性別 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {([
                { value: "male", label: "男性" },
                { value: "female", label: "女性" },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGender(value)}
                  className={`py-4 rounded-lg text-lg font-medium transition-all ${
                    gender === value
                      ? "bg-gold-500/20 border-2 border-gold-500 text-gold-300"
                      : "bg-navy-800/60 border border-gold-500/20 text-navy-300 hover:border-gold-500/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* エラー */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* 鑑定ボタン */}
          <button
            onClick={handleSubmit}
            className="w-full py-5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950 text-xl font-bold tracking-[0.2em] hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 transition-all active:scale-[0.98]"
          >
            鑑定する
          </button>
        </div>

        {/* 戻るリンク */}
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="text-navy-400 hover:text-navy-200 text-sm tracking-wider transition-colors"
          >
            ← 戻る
          </button>
        </div>
      </div>
    </main>
  );
}
