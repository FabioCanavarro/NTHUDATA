'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type FavoriteType = 
  | 'youbike'
  | 'washer'
  | 'bus'
  | 'library'
  | 'dining'
  | 'course'
  | 'announcement'
  | 'location'
  | 'lost_and_found'
  | 'module';

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  subtitle?: string;
  data: any;
  addedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isStarred: (id: string) => boolean;
  toggleStar: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeStar: (id: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isStarred: () => false,
  toggleStar: () => {},
  removeStar: () => {},
  clearFavorites: () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nthu_hub_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      } else {
        // Pre-populate defaults so home page looks super cool out of the box!
        const defaultFavorites: FavoriteItem[] = [
          {
            id: 'youbike:HSZ500401004',
            type: 'youbike',
            title: 'YouBike2.0_清華大學(小吃部)',
            subtitle: '光復路二段101號',
            data: { uid: 'HSZ500401004', name: 'YouBike2.0_清華大學(小吃部)' },
            addedAt: Date.now(),
          },
          {
            id: 'washer:義齋',
            type: 'washer',
            title: '義齋 洗衣機看板',
            subtitle: '義齋 宿舍樓區',
            data: { area: '義齋' },
            addedAt: Date.now() - 1000,
          },
          {
            id: 'bus:main-up',
            type: 'bus',
            title: '校本部 - 上山公車',
            subtitle: '綜航站 ➔ 北校門',
            data: { bus_type: 'main', direction: 'up' },
            addedAt: Date.now() - 2000,
          },
          {
            id: 'dining:水木生活中心',
            type: 'dining',
            title: '水木生活中心',
            subtitle: '美食街與廠商',
            data: { building: '水木生活中心' },
            addedAt: Date.now() - 3000,
          }
        ];
        setFavorites(defaultFavorites);
        localStorage.setItem('nthu_hub_favorites', JSON.stringify(defaultFavorites));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  }, []);

  const isStarred = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  const toggleStar = (item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      let updated: FavoriteItem[];
      if (exists) {
        updated = prev.filter(f => f.id !== item.id);
      } else {
        updated = [{ ...item, addedAt: Date.now() }, ...prev];
      }
      localStorage.setItem('nthu_hub_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const removeStar = (id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id);
      localStorage.setItem('nthu_hub_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('nthu_hub_favorites');
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isStarred, toggleStar, removeStar, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
