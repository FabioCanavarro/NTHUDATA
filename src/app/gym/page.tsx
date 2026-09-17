'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Search, MapPin, Clock, Users, RefreshCw, HelpCircle, X } from 'lucide-react';
import { StarButton } from '@/components/StarButton';

interface SportsVenue {
  id: string;
  name: string;
  pinyin: string;
  english: string;
  category: string;
  location: string;
  hours: string;
  status: 'OPEN' | 'CLOSING_SOON' | 'CLOSED';
  currentOccupancy?: number;
  maxCapacity?: number;
  totalCourts?: number;
  freeCourts?: number;
  feeInfo: string;
  bookingInfo: string;
}

export default function GymPage() {
  const [venues, setVenues] = useState<SportsVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showGuideModal, setShowGuideModal] = useState(false);

  const fetchGymData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/gym');
      if (res.ok) {
        const data = await res.json();
        setVenues(data.venues || []);
      }
    } catch (e) {
      console.error('Failed to load gym data', e);
    } finally {
      setLoading(false);
    }
  };

  // 3-second auto refresh interval
  useEffect(() => {
    fetchGymData();
    const interval = setInterval(fetchGymData, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['ALL', 'Gym & Fitness', 'Aquatic Pool', 'Racket Sports', 'Outdoor Courts'];

  const filtered = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      v.english.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory !== 'ALL' && v.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Dumbbell className="w-3.5 h-3.5" />
            NTHU Athletics & PE Department • 體育館與場館即時動態
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            Gym & Sports Facilities Availability
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Real-time headcount meters, court vacancy gauges, opening hours, and Pinyin & English facility titles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuideModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-2 text-xs font-bold transition-all shadow-glow"
          >
            <HelpCircle className="w-4 h-4" /> Entry Guide (入場須知)
          </button>
          <button
            onClick={fetchGymData}
            disabled={loading}
            className="px-4 py-2.5 rounded-2xl bg-theme-card border border-theme-border hover:border-amber-500/50 text-amber-400 flex items-center gap-2 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sports venues in English / Pinyin / 中文 (e.g. Weight Room, Swimming Pool, 羽球, 網球)..."
              className="w-full bg-theme-card border border-theme-border hover:border-amber-500/50 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-glow font-bold'
                  : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
              }`}
            >
              {cat === 'ALL' ? `All Venues (${venues.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Venue Cards Grid */}
      {loading && venues.length === 0 ? (
        <div className="text-center py-16 text-theme-muted">Fetching NTHU sports facility data...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
          No sports venues match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => {
            const isClosed = v.status === 'CLOSED';
            const isHeadcount = v.currentOccupancy !== undefined && v.maxCapacity !== undefined;
            const pct = isHeadcount ? (isClosed ? 0 : Math.round((v.currentOccupancy! / v.maxCapacity!) * 100)) : 0;

            return (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-amber-500/40 transition-all space-y-4 relative group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block">
                          {v.category}
                        </span>
                        {isClosed && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            CLOSED (已閉館)
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-theme-text group-hover:text-amber-400 transition-colors pt-1">
                        {v.name}
                      </h3>
                      <p className="text-[11px] text-indigo-400 font-semibold">
                        {v.pinyin} • {v.english}
                      </p>
                    </div>

                    <StarButton
                      id={`gym:${v.id}`}
                      type="module"
                      title={v.name}
                      subtitle={`${v.pinyin} • ${v.hours}`}
                      data={v}
                    />
                  </div>

                  {/* Occupancy or Court Meters */}
                  {isHeadcount ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-theme-muted flex items-center gap-1 font-medium">
                          <Users className="w-3.5 h-3.5 text-amber-400" /> Live Headcount
                        </span>
                        <span className={`font-extrabold ${isClosed ? 'text-rose-400' : 'text-amber-400'}`}>
                          {isClosed ? `0 / ${v.maxCapacity} occupied (Closed 已閉館)` : `${v.currentOccupancy} / ${v.maxCapacity} occupied (${pct}%)`}
                        </span>
                      </div>
                      <div className="w-full bg-theme-bg rounded-full h-3 overflow-hidden border border-theme-border">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isClosed ? 'bg-gray-600/40' : pct > 80 ? 'bg-rose-400' : pct > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${isClosed ? 0 : pct}%` }}
                        />
                      </div>
                    </div>
                  ) : v.totalCourts !== undefined ? (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                      <span className="text-theme-muted font-medium">Available Courts</span>
                      <span className={`font-extrabold text-sm ${isClosed ? 'text-rose-400' : 'text-amber-400'}`}>
                        {isClosed ? `Closed (已閉館)` : `${v.freeCourts} of ${v.totalCourts} Courts Free`}
                      </span>
                    </div>
                  ) : null}

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-theme-muted pt-1 border-t border-theme-border/50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Hours: {v.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{v.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="p-3 rounded-2xl bg-theme-bg/60 border border-theme-border text-[11px] space-y-1">
                  <p className="text-amber-400/90 font-medium">💳 {v.feeInfo}</p>
                  <p className="text-theme-muted">ℹ️ {v.bookingInfo}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* PE Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-theme-card border border-theme-border rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-theme-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-theme-text">NTHU PE Facilities Guide (入場須知)</h3>
                    <p className="text-xs text-theme-muted">Physical Education & Sports Facilities Policy</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="p-2 rounded-xl hover:bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-theme-text max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border space-y-1">
                  <p className="font-bold text-amber-400">🏋️ Gym & Weight Room (體育館重訓室)</p>
                  <p className="text-theme-muted">
                    - Entry Fee: TWD $20 per entry or Semester Gym Pass.<br />
                    - Scan valid NTHU Student ID or Faculty Card at turnstile.<br />
                    - Proper athletic shoes and workout clothes required. Towel is mandatory.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border space-y-1">
                  <p className="font-bold text-amber-400">🏊 Aquatic Center (水木游泳池)</p>
                  <p className="text-theme-muted">
                    - Student Ticket: TWD $50 / entry.<br />
                    - Swim cap and proper swimming attire strictly mandatory.<br />
                    - Lockers available on 1F (TWD $10 coin return).
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border space-y-1">
                  <p className="font-bold text-amber-400">🏸 Indoor Racket Sports (羽球館 & 桌球室)</p>
                  <p className="text-theme-muted">
                    - Non-marking indoor court shoes required.<br />
                    - Free for NTHU students during standard open hours.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:brightness-110 transition-all"
                >
                  Got It (了解)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
