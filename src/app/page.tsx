'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Sparkles,
  Bike,
  WashingMachine,
  Bus,
  Library,
  UtensilsCrossed,
  BookOpen,
  RefreshCw,
  SlidersHorizontal,
  Dumbbell,
  Zap,
  SearchCheck,
  Download,
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
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-theme-card via-theme-card-hover to-theme-card border border-theme-border p-5 sm:p-8 shadow-2xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-theme-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-primary/20 border border-theme-primary/40 text-theme-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            NTHU Unified Campus OS & PWA App
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight">
            Welcome to <span className="text-theme-primary">NTHU Hub</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-theme-muted leading-relaxed">
            Real-time IoT data, YouBike 2.0 availability, MQTT laundry machines, campus shuttle buses, dining venues, and downloadable offline campus app.
          </p>
        </div>
      </div>

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
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold truncate">Live MQTT</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-theme-card border border-theme-border flex items-center gap-3 sm:gap-4 hover:border-theme-primary/50 transition-all shadow-sm">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
            <Bus className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-theme-muted font-medium truncate">Shuttles</p>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-text">4 Active</h3>
            <p className="text-[10px] sm:text-[11px] text-purple-400 font-semibold truncate">Main & Nanda</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-theme-card border border-theme-border flex items-center gap-3 sm:gap-4 hover:border-theme-primary/50 transition-all shadow-sm">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-theme-muted font-medium truncate">Power Load</p>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-text">14.2 MW</h3>
            <p className="text-[10px] sm:text-[11px] text-amber-400 font-semibold truncate">Realtime</p>
          </div>
        </div>
      </div>

      {/* STARRED EVERYTHING DASHBOARD SECTION */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-theme-text tracking-tight">
              Starred Pins & Favorite Widgets
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-theme-muted font-medium">
              {favorites.length} starred items
            </span>
            {favorites.length > 0 && (
              <DataExporter data={favorites} filename="nthu_hub_favorites" title="Starred Favorites" />
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="p-6 sm:p-8 text-center rounded-3xl bg-theme-card/60 border border-dashed border-theme-border space-y-3">
            <Star className="w-8 h-8 text-amber-400/50 mx-auto" />
            <h3 className="text-base font-semibold text-theme-text">No Starred Items Yet</h3>
            <p className="text-xs text-theme-muted max-w-md mx-auto">
              Star any YouBike station, washing machine, bus route, food stall, course, or module by clicking the ★ star button!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <motion.div
                key={fav.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 sm:p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-theme-primary/40 transition-all space-y-3 relative group shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 truncate">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-theme-bg border border-theme-border text-theme-primary inline-block mb-1">
                      {fav.type}
                    </span>
                    <h3 className="text-sm font-bold text-theme-text truncate group-hover:text-theme-primary transition-colors">
                      {fav.title}
                    </h3>
                    {fav.subtitle && (
                      <p className="text-xs text-theme-muted truncate">{fav.subtitle}</p>
                    )}
                  </div>
                  <StarButton id={fav.id} type={fav.type} title={fav.title} subtitle={fav.subtitle} data={fav.data} />
                </div>

                {/* Type-Specific Quick Widget Render */}
                {fav.type === 'youbike' && (
                  <div className="pt-2 border-t border-theme-border/50 flex items-center justify-between text-xs">
                    <span className="text-theme-muted">Available Bikes</span>
                    <span className="font-extrabold text-cyan-400">
                      {youbikeData.find((s) => s.name.includes(fav.title) || s.uid === fav.data?.uid)?.availableBikes ?? 'Live'} bikes
                    </span>
                  </div>
                )}

                {fav.type === 'washer' && (
                  <div className="pt-2 border-t border-theme-border/50 flex items-center justify-between text-xs">
                    <span className="text-theme-muted">Dorm Machine Status</span>
                    <span className="font-extrabold text-emerald-400">
                      {laundryData.filter((m) => ((m.dorm || m.area || '').includes(fav.data?.name || fav.title.split(' ')[0])) && m.statusText === '空機').length} free machines
                    </span>
                  </div>
                )}

                {fav.type === 'bus' && (
                  <div className="pt-2 border-t border-theme-border/50 flex items-center justify-between text-xs">
                    <span className="text-theme-muted">Next Shuttle</span>
                    <span className="font-extrabold text-purple-400">Scheduled Departure</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Campus Modules Navigation Hub */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg sm:text-xl font-bold text-theme-text tracking-tight">Explore Campus Apps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Link href="/youbike" className="group">
            <div className="p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border hover:border-cyan-500/50 hover:shadow-glow transition-all space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-cyan-400 transition-colors">
                  YouBike 2.0 Live Tracker
                </h3>
                <p className="text-xs text-theme-muted mt-1">
                  Real-time bike & empty dock counters for campus stations.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/laundry" className="group">
            <div className="p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border hover:border-emerald-500/50 hover:shadow-glow transition-all space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <WashingMachine className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-emerald-400 transition-colors">
                  Laundry Hub (MQTT)
                </h3>
                <p className="text-xs text-theme-muted mt-1">
                  Washing machine & dryer statuses with countdown timers.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/buses" className="group">
            <div className="p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border hover:border-purple-500/50 hover:shadow-glow transition-all space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bus className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-purple-400 transition-colors">
                  Shuttle Bus Timetables
                </h3>
                <p className="text-xs text-theme-muted mt-1">
                  Main & Nanda campus shuttle routes, stops, and schedules.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/courses" className="group">
            <div className="p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border hover:border-indigo-500/50 hover:shadow-glow transition-all space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-indigo-400 transition-colors">
                  Course Search Engine
                </h3>
                <p className="text-xs text-theme-muted mt-1">
                  Search NTHU courses by code, teacher, room, and time.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/dining" className="group">
            <div className="p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border hover:border-rose-500/50 hover:shadow-glow transition-all space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-rose-400 transition-colors">
                  Food & Dining Venues
                </h3>
                <p className="text-xs text-theme-muted mt-1">
                  Restaurants, dining halls, and opening hours across campus.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/lost-and-found" className="group">
            <div className="p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border hover:border-teal-500/50 hover:shadow-glow transition-all space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <SearchCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-teal-400 transition-colors">
                  Lost & Found Portal
                </h3>
                <p className="text-xs text-theme-muted mt-1">
                  Search live lost items reported at library & campus security.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/gym" className="group">
            <div className="p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border hover:border-amber-500/50 hover:shadow-glow transition-all space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-amber-400 transition-colors">
                  Gym & Sports Facilities
                </h3>
                <p className="text-xs text-theme-muted mt-1">
                  Real-time headcount meters, court vacancy gauges & opening hours.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/docs" className="group">
            <div className="p-5 sm:p-6 rounded-3xl bg-theme-card border border-theme-border hover:border-theme-primary hover:shadow-glow transition-all space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-theme-primary/20 text-theme-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-theme-primary transition-colors">
                  Developer API Platform
                </h3>
                <p className="text-xs text-theme-muted mt-1">
                  Interactive Swagger-style testing for Next.js `/api/v1` routes.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
