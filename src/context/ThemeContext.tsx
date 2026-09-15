'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName = 'violet' | 'emerald' | 'amber' | 'cyan' | 'rose';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themesList: { id: ThemeName; name: string; color: string }[];
}

const THEMES: { id: ThemeName; name: string; color: string }[] = [
  { id: 'violet', name: 'Cyber Violet', color: '#8b5cf6' },
  { id: 'emerald', name: 'Midnight Emerald', color: '#10b981' },
  { id: 'amber', name: 'Solar Gold', color: '#f59e0b' },
  { id: 'cyan', name: 'Neon Cyan', color: '#06b6d4' },
  { id: 'rose', name: 'Deep Velvet', color: '#f43f5e' },
];

const ThemeContext = createContext<ThemeContextType>({
  theme: 'violet',
  setTheme: () => {},
  themesList: THEMES,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('violet');

  useEffect(() => {
    const saved = localStorage.getItem('nthu_hub_theme') as ThemeName;
    if (saved && THEMES.some(t => t.id === saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('nthu_hub_theme', newTheme);
    if (newTheme === 'violet') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themesList: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
