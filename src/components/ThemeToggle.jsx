import { useEffect, useState } from "react";
import { useLang, LangToggle } from "../context/LanguageContext";
function getInitialTheme() {
  const saved = localStorage.getItem("fixmate_theme");
  if (saved === "light" || saved === "dark") return saved;
  return "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fixmate_theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`themeSwitch ${isDark ? "isDark" : ""}`}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to Light" : "Switch to Dark"}
    >
      <span className="themeSwitch__track" aria-hidden="true">
        <span className="themeSwitch__thumb" />
      </span>
    </button>
  );
}
