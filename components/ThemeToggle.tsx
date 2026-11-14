"use client";

import { useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  const toggle = () => {
    const now = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const next = now === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setDark(next === "dark");
  };

  const isDark =
    dark ?? (typeof document === "undefined" || document.documentElement.dataset.theme !== "light");
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="切换深色模式">
      {isDark ? "☀️ 浅色" : "🌙 深色"}
    </button>
  );
}
