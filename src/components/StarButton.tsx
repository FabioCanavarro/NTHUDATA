'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useFavorites, FavoriteType } from '@/context/FavoritesContext';

interface StarButtonProps {
  id: string;
  type: FavoriteType;
  title: string;
  subtitle?: string;
  data?: any;
  className?: string;
}

export const StarButton: React.FC<StarButtonProps> = ({
  id,
  type,
  title,
  subtitle,
  data = {},
  className = '',
}) => {
  const { isStarred, toggleStar } = useFavorites();
  const starred = isStarred(id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStar({ id, type, title, subtitle, data });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      title={starred ? 'Unstar from Dashboard' : 'Star to Home Dashboard'}
      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
        starred
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-glow'
          : 'bg-theme-bg/60 text-theme-muted hover:text-amber-300 border border-theme-border'
      } ${className}`}
    >
      <Star
        className={`w-4 h-4 transition-transform ${
          starred ? 'fill-amber-400 text-amber-400' : ''
        }`}
      />
    </motion.button>
  );
};
