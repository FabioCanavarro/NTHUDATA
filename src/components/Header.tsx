'use client';

import React, { useState } from 'react';
import { Search, Star, Sparkles, Menu, X } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { useFavorites } from '@/context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { favorites, removeStar } = useFavorites();
  const [showStarDrawer, setShowStarDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-theme-bg/80 border-b border-theme-border backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-4">
      {/* Search Bar Trigger */}
      <button
        onClick={onOpenSearch}
        className="flex-1 max-w-md bg-theme-card/90 border border-theme-border hover:border-theme-primary px-3.5 py-2 rounded-2xl flex items-center justify-between text-sm text-theme-muted transition-all duration-200 group shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-theme-muted group-hover:text-theme-primary transition-colors" />
          <span className="hidden sm:inline">Search courses, YouBike, buses, food, apps...</span>
          <span className="sm:hidden">Search NTHU Hub...</span>
        </div>
        <kbd className="hidden md:inline-flex items-center gap-1 bg-theme-bg px-2 py-0.5 rounded-lg border border-theme-border text-[11px] font-mono text-theme-muted">
          ⌘K
        </kbd>
      </button>

      {/* Right Action Icons */}
      <div className="flex items-center gap-3">
        <ThemeSelector />

        {/* Starred Favorites Drawer Button */}
        <div className="relative">
          <button
            onClick={() => setShowStarDrawer(!showStarDrawer)}
            className="p-2.5 rounded-2xl bg-theme-card border border-theme-border hover:border-amber-500/50 text-amber-400 relative transition-all flex items-center justify-center shadow-sm"
            title="Starred Dashboard Items"
          >
            <Star className="w-4 h-4 fill-amber-400" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Favorites Dropdown Drawer */}
          <AnimatePresence>
            {showStarDrawer && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-theme-card border border-theme-border rounded-2xl p-4 shadow-2xl z-50 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-3 border-b border-theme-border pb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-theme-text">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Starred Items ({favorites.length})</span>
                  </div>
                  <Link
                    href="/"
                    onClick={() => setShowStarDrawer(false)}
                    className="text-xs text-theme-primary font-medium hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {favorites.length === 0 ? (
                  <p className="text-xs text-theme-muted text-center py-6">
                    No starred items yet. Click the ★ icon anywhere in the app to pin items to your dashboard!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {favorites.map((fav) => (
                      <div
                        key={fav.id}
                        className="p-2.5 rounded-xl bg-theme-bg/60 border border-theme-border/60 flex items-center justify-between gap-2 group hover:border-theme-primary/40 transition-colors"
                      >
                        <div className="truncate">
                          <p className="text-xs font-semibold text-theme-text truncate">
                            {fav.title}
                          </p>
                          {fav.subtitle && (
                            <p className="text-[11px] text-theme-muted truncate">{fav.subtitle}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeStar(fav.id)}
                          className="text-theme-muted hover:text-red-400 text-xs px-1.5 py-1 rounded"
                          title="Remove star"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
