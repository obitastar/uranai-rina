"use client";

import { useState, useEffect } from "react";

let cached: boolean | null = null;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => cached ?? false);

  useEffect(() => {
    const result = window.innerWidth < 768;
    cached = result;
    setIsMobile(result);
  }, []);

  return isMobile;
}
