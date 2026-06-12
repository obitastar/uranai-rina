"use client";

import { useState, useCallback } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

const CREDENTIALS = { id: "0313", password: "0313" };

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (userId === CREDENTIALS.id && password === CREDENTIALS.password) {
      sessionStorage.setItem("uranai-auth", "1");
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }, [userId, password, onLogin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-xs space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-black tracking-[0.3em] text-gold-gradient">
            運命鑑定
          </h1>
          <div className="w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <p className="text-sm text-navy-300/60 tracking-widest">ログイン</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-navy-300/70 tracking-widest">ID</label>
            <input
              type="text"
              inputMode="numeric"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-navy-900/60 border border-gold-500/20 text-navy-50 text-center text-lg tracking-[0.3em] focus:outline-none focus:border-gold-500/50 placeholder:text-navy-500/40"
              placeholder="----"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-navy-300/70 tracking-widest">パスワード</label>
            <input
              type="password"
              inputMode="numeric"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-navy-900/60 border border-gold-500/20 text-navy-50 text-center text-lg tracking-[0.3em] focus:outline-none focus:border-gold-500/50 placeholder:text-navy-500/40"
              placeholder="----"
              autoComplete="off"
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-400/80 tracking-wider">
              IDまたはパスワードが違います
            </p>
          )}

          <button
            type="submit"
            className="w-full ornament-border rounded-xl px-6 py-4 bg-gold-500/10 border border-gold-500/30 active:bg-gold-500/20"
          >
            <span className="text-base tracking-[0.2em] text-gold-gradient font-bold">
              ログイン
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
