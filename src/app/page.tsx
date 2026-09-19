'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Bike,
  WashingMachine,
  Library,
  UtensilsCrossed,
  RefreshCw,
  Dumbbell,
  Zap,
  SearchCheck,
  ExternalLink,
} from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { StarButton } from '@/components/StarButton';
import { DataExporter } from '@/components/DataExporter';
import Link from 'next/link';

export default function HomePage() {
  const { favorites, removeStar } = useFavorites();
  const [youbikeData, setYoubikeData] = useState<any[]>([]);
  const [laundryData, setLaundryData] = useState<any[]>([]);
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuickStats() {
      try {
        setLoading(true);
        const [ybRes, washRes, enRes] = await Promise.all([
          fetch('/api/v1/youbike'),
          fetch('/api/v1/washers'),
          fetch('/api/v1/energy'),
        ]);

        if (ybRes.ok) {
          const yb = await ybRes.json();
          setYoubikeData(yb.stations || []);
        }
        if (washRes.ok) {
          const wash = await washRes.json();
          setLaundryData(wash.machines || []);
        }
        if (enRes.ok) {
          const en = await enRes.json();
          setEnergyData(en.data || []);
        }
      } catch (e) {
        console.error('Error fetching dashboard stats', e);
      } finally {
        setLoading(false);
      }
    }
    loadQuickStats();
  }, []);

  const totalBikesNearCampus = youbikeData.reduce((acc, s) => acc + (s.availableBikes || 0), 0);
  const totalFreeDocksNearCampus = youbikeData.reduce((acc, s) => acc + (s.emptyDocks || 0), 0);
  const totalFreeWashers = laundryData.filter((m) => m.statusText === '空機').length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Hero Welcome Banner — NO LOGO, NO FLASHING GREEN DOT */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-theme-card via-theme-card-hover to-theme-card border border-theme-border p-5 sm:p-8 shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-primary/20 border border-theme-primary/40 text-theme-primary text-xs font-bold uppercase tracking-wider">
            NTHU Unified Campus OS Platform
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight">
            Welcome to <span className="text-theme-primary">NTHU Hub</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-theme-muted leading-relaxed">
            Real-time IoT data, YouBike 2.0 availability, WipePay laundry status, campus dining directory, gym availability, and library seat trackers.
          </p>
        </div>
      </div>

      {/* Featured NTHUMOD Shortcut Banner */}
      <a
        href="https://nthumod.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-indigo-950/80 border border-indigo-500/40 hover:border-indigo-400 shadow-xl transition-all group"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-extrabold uppercase">
              ⚡ Ultimate Course & Timetable Planner
            </div>
            <h3 className="text-xl font-black text-indigo-200 group-hover:text-white transition-colors">
              NTHUMOD (nthumod.com)
            </h3>
            <p className="text-sm font-bold text-indigo-300">
              "Just use nthu mod for planning and courses, peaks of peaks"
            </p>
          </div>
          <div className="px-5 py-2.5 rounded-2xl bg-indigo-500 text-white font-extrabold text-xs group-hover:bg-indigo-400 transition-all flex items-center gap-2 shadow-glow shrink-0">
            <span>Open NTHUMOD ↗</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </a>

      {/* Top Quick Overview Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-theme-card border border-theme-border flex items-center gap-3 sm:gap-4 hover:border-theme-primary/50 transition-all shadow-sm">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-theme-muted font-medium truncate">YouBikes</p>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-text">{loading ? '...' : totalBikesNearCampus}</h3>
            <p className="text-[10px] sm:text-[11px] text-cyan-400 font-semibold truncate">{totalFreeDocksNearCampus} empty docks</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-theme-card border border-theme-border flex items-center gap-3 sm:gap-4 hover:border-theme-primary/50 transition-all shadow-sm">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <WashingMachine className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-theme-muted font-medium truncate">Free Washers</p>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-text">{loading ? '...' : totalFreeWashers}</h3>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold truncate">16 Dormitories Monitor</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-theme-card border border-theme-border flex items-center gap-3 sm:gap-4 hover:border-theme-primary/50 transition-all shadow-sm">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Library className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-theme-muted font-medium truncate">Library 24H</p>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-text">Open</h3>
            <p className="text-[10px] sm:text-[11px] text-indigo-400 font-semibold truncate">🌙 Moonlight Area Active</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-theme-card border border-theme-border flex items-center gap-3 sm:gap-4 hover:border-theme-primary/50 transition-all shadow-sm">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-theme-muted font-medium truncate">Dining Halls</p>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-text">Directory</h3>
            <p className="text-[10px] sm:text-[11px] text-rose-400 font-semibold truncate">Live Status & Pinyin</p>
          </div>
        </div>
      </div>

      {/* Starred Favorites Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-theme-text">
              Your Starred Dashboard Items
            </h2>
          </div>
          {favorites.length > 0 && (
            <DataExporter
              filename="nthu_hub_starred_favorites"
              data={favorites}
              title="Starred Items"
            />
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-theme-card border border-theme-border space-y-3">
            <p className="text-sm font-semibold text-theme-text">No starred items saved yet.</p>
            <p className="text-xs text-theme-muted max-w-md mx-auto">
              Click the star icon ⭐ on any YouBike station, laundry dorm, food stall, or library space to pin it to your personal dashboard!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <motion.div
                key={fav.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-theme-primary/50 transition-all space-y-3 relative group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20 inline-block mb-1 uppercase">
                        {fav.type}
                      </span>
                      <h3 className="text-base font-bold text-theme-text group-hover:text-theme-primary transition-colors">
                        {fav.title}
                      </h3>
                    </div>
                    <StarButton id={fav.id} type={fav.type} title={fav.title} subtitle={fav.subtitle} data={fav.data} />
                  </div>
                  <p className="text-xs text-theme-muted">{fav.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
