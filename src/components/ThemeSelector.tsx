'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, themesList } = useTheme();

  return (
    <div className="flex items-center gap-1.5 bg-theme-card/80 p-1.5 rounded-2xl border border-theme-border">
      <div className="px-2 py-1 text-xs text-theme-muted font-medium flex items-center gap-1">
        <Palette className="w-3.5 h-3.5 text-theme-primary" />
        <span className="hidden sm:inline">Theme</span>
      </div>
      <div className="flex items-center gap-1">
        {themesList.map((t) => {
          const active = theme === t.id;
          return (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(t.id)}
              title={t.name}
              className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                active
                  ? 'border-white scale-110 shadow-glow ring-2 ring-offset-2 ring-offset-theme-bg ring-theme-primary'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.color }}
            />
          );
        })}
      </div>
    </div>
  );
};
