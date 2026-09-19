'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, themesList } = useTheme();
  const [mobilePopoverOpen, setMobilePopoverOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMobilePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentThemeObj = themesList.find((t) => t.id === theme) || themesList[0];

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Desktop Inline Theme Swatches */}
      <div className="hidden sm:flex items-center gap-1.5 bg-theme-card/80 p-1.5 rounded-2xl border border-theme-border shadow-sm">
        <div className="px-2 py-1 text-xs text-theme-muted font-medium flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-theme-primary" />
          <span>Theme</span>
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
                className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
                  active
                    ? 'border-white scale-110 shadow-glow ring-2 ring-offset-1 ring-offset-theme-bg ring-theme-primary'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: t.color }}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile Compact Single Button Theme Trigger */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobilePopoverOpen(!mobilePopoverOpen)}
          className="p-2 rounded-2xl bg-theme-card border border-theme-border text-theme-muted hover:text-theme-text flex items-center gap-1.5 transition-all shadow-sm"
          title="Change Theme Color"
        >
          <div
            className="w-4 h-4 rounded-full border border-white/60 shadow-sm shrink-0"
            style={{ backgroundColor: currentThemeObj.color }}
          />
          <Palette className="w-3.5 h-3.5 text-theme-primary" />
        </button>

        {/* Mobile Theme Popover Dropdown */}
        <AnimatePresence>
          {mobilePopoverOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-theme-card border border-theme-border rounded-2xl p-3 shadow-2xl z-50 backdrop-blur-2xl space-y-1.5"
            >
              <div className="text-[11px] font-bold text-theme-muted uppercase tracking-wider px-2 pb-1 border-b border-theme-border">
                Select App Theme
              </div>
              <div className="space-y-1">
                {themesList.map((t) => {
                  const active = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setMobilePopoverOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-theme-primary/20 text-theme-primary border border-theme-primary/30 font-bold'
                          : 'hover:bg-theme-bg text-theme-text'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0"
                          style={{ backgroundColor: t.color }}
                        />
                        <span>{t.name}</span>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 text-theme-primary" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
