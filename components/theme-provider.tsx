"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 👇 Helper to compute the initial theme safely (works with SSR)
function getInitialTheme(): Theme {
  // On the server: no window/localStorage → just match <html class="dark">
  if (typeof window === "undefined") {
    return "dark";
  }

  // On the client: try localStorage
  const saved = window.localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 👇 lazy initializer — runs getInitialTheme only once
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  // Sync <html> class + localStorage whenever theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
