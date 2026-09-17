'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Search, MapPin, Building, Clock, Phone, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { StarButton } from '@/components/StarButton';
import { getPinyinAndEnglish } from '@/utils/pinyin';

interface Schedule {
  weekday?: string;
  saturday?: string;
  sunday?: string;
}

interface Restaurant {
  name: string;
  area: string;
  note?: string;
  phone?: string;
  schedule?: Schedule;
  image?: string;
}

interface BuildingGroup {
  building: string;
  restaurants: Restaurant[];
}

function parseScheduleStatus(schedule?: Schedule) {
  if (!schedule) {
    return {
      status: 'OPEN',
      label: 'Open Now • 營業中',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      badgeColor: 'green',
      pinyin: 'Yíng Yè Zhōng',
      english: 'Open Now',
      hoursText: 'Check vendor notes',
    };
  }

  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 6 = Sat
  let todaySchedule = schedule.weekday || '';
  if (day === 0) todaySchedule = schedule.sunday || schedule.weekday || '';
  if (day === 6) todaySchedule = schedule.saturday || schedule.weekday || '';

  if (!todaySchedule || todaySchedule.includes('暫停營業') || todaySchedule.includes('公休')) {
    return {
      status: 'CLOSED',
      label: 'Closed Today • 已關閉',
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      badgeColor: 'red',
      pinyin: 'Yǐ Guān Bì',
      english: 'Closed Today',
      hoursText: todaySchedule || 'Closed',
    };
  }

  if (todaySchedule.includes('24小時')) {
    return {
      status: 'OPEN',
      label: 'Open 24 Hours • 營業中',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      badgeColor: 'green',
      pinyin: '24 Xiǎoshí Yíngyè',
      english: 'Open 24/7',
      hoursText: 'Open 24 Hours (24小時營業)',
    };
  }

  // Parse time format e.g. "7:00-24:00", "11:00-20:00"
  const timeMatch = todaySchedule.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const startHour = parseInt(timeMatch[1], 10);
    const startMin = parseInt(timeMatch[2], 10);
    const endHour = parseInt(timeMatch[3], 10);
    const endMin = parseInt(timeMatch[4], 10);

    const currentMins = now.getHours() * 60 + now.getMinutes();
    const startMins = startHour * 60 + startMin;
    const endMins = (endHour === 24 ? 24 : endHour) * 60 + endMin;

    const hoursText = `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

    if (currentMins >= startMins && currentMins <= endMins) {
      // Check if closing within 45 minutes
      if (endMins - currentMins <= 45 && endMins - currentMins > 0) {
        return {
          status: 'CLOSING_SOON',
          label: 'Closing Soon • 即將關門',
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          badgeColor: 'yellow',
          pinyin: 'Jí Jiāng Guān Mén',
          english: 'Closing Soon',
          hoursText,
        };
      }
      return {
        status: 'OPEN',
        label: 'Open Now • 營業中',
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        badgeColor: 'green',
        pinyin: 'Yíng Yè Zhōng',
        english: 'Open Now',
        hoursText,
      };
    } else if (startMins - currentMins <= 60 && startMins - currentMins > 0) {
      return {
        status: 'OPENING_SOON',
        label: 'Opening Soon • 即將開門',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
        badgeColor: 'blue',
        pinyin: 'Jí Jiāng Kāi Mén',
        english: 'Opening Soon',
        hoursText,
      };
    } else {
      return {
        status: 'CLOSED',
        label: 'Closed • 已關閉',
        color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        badgeColor: 'red',
        pinyin: 'Yǐ Guān Bì',
        english: 'Closed',
        hoursText,
      };
    }
  }

  return {
    status: 'OPEN',
    label: 'Open • 營業中',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    badgeColor: 'green',
    pinyin: 'Yíng Yè Zhōng',
    english: 'Open',
    hoursText: todaySchedule,
  };
}

export default function DiningPage() {
  const [diningData, setDiningData] = useState<BuildingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'SOON' | 'CLOSED'>('ALL');

  useEffect(() => {
    async function loadDiningData() {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/dining');
        if (res.ok) {
          const data = await res.json();
          setDiningData(data.buildings || []);
        }
      } catch (e) {
        console.error('Failed to load dining data', e);
      } finally {
        setLoading(false);
      }
    }
    loadDiningData();
    const interval = setInterval(loadDiningData, 3000);
    return () => clearInterval(interval);
  }, []);

  const buildings = Array.from(new Set(diningData.map((b) => b.building)));

  const filteredBuildings = diningData
    .filter((b) => selectedBuilding === 'ALL' || b.building === selectedBuilding)
    .map((b) => {
      const filteredStalls = b.restaurants.filter((r) => {
        const pinyinEng = getPinyinAndEnglish(r.name);
        const matchesSearch =
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          pinyinEng.pinyin.toLowerCase().includes(search.toLowerCase()) ||
          pinyinEng.english.toLowerCase().includes(search.toLowerCase()) ||
          (r.note && r.note.toLowerCase().includes(search.toLowerCase()));

        if (!matchesSearch) return false;

        const schedStatus = parseScheduleStatus(r.schedule);
        if (statusFilter === 'OPEN' && schedStatus.status !== 'OPEN') return false;
        if (statusFilter === 'SOON' && schedStatus.status !== 'CLOSING_SOON' && schedStatus.status !== 'OPENING_SOON') return false;
        if (statusFilter === 'CLOSED' && schedStatus.status !== 'CLOSED') return false;

        return true;
      });

      return {
        ...b,
        restaurants: filteredStalls,
      };
    })
    .filter((b) => b.restaurants.length > 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Campus Dining Directory • 校園美食
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            Food & Dining Venues
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Real-time open/close status, opening hours, building locations, and English & Pinyin translations.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendor in English / Pinyin / 中文 (e.g. McDonald's, 麥當勞, 全家)..."
              className="w-full bg-theme-card border border-theme-border hover:border-rose-500/50 focus:border-rose-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
            />
          </div>

          {/* Red, Green, Blue Status Filter Badges */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-glow'
                  : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setStatusFilter('OPEN')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                statusFilter === 'OPEN'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-glow'
                  : 'bg-theme-card border-theme-border text-emerald-400/70 hover:text-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open Now (綠色)
            </button>
            <button
              onClick={() => setStatusFilter('SOON')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                statusFilter === 'SOON'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-glow'
                  : 'bg-theme-card border-theme-border text-blue-400/70 hover:text-blue-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Soon (藍/黃色)
            </button>
            <button
              onClick={() => setStatusFilter('CLOSED')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                statusFilter === 'CLOSED'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-glow'
                  : 'bg-theme-card border-theme-border text-rose-400/70 hover:text-rose-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Closed (紅色)
            </button>
          </div>
        </div>

        {/* Building Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedBuilding('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border shrink-0 transition-all ${
              selectedBuilding === 'ALL'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-glow'
                : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
            }`}
          >
            All Buildings ({buildings.length})
          </button>
          {buildings.map((b) => {
            const bInfo = getPinyinAndEnglish(b);
            return (
              <button
                key={b}
                onClick={() => setSelectedBuilding(b)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border shrink-0 transition-all ${
                  selectedBuilding === b
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-glow'
                    : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                {bInfo.original} ({bInfo.english})
              </button>
            );
          })}
        </div>
      </div>

      {/* Building & Restaurant Listings */}
      {loading ? (
        <div className="text-center py-16 text-theme-muted">Loading dining vendors...</div>
      ) : filteredBuildings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
          No food vendors match your selected filter.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredBuildings.map((b) => {
            const bInfo = getPinyinAndEnglish(b.building);
            return (
              <div key={b.building} className="space-y-4">
                <div className="flex items-center justify-between border-b border-theme-border pb-2">
                  <h2 className="text-xl font-bold text-theme-text flex items-center gap-2">
                    <Building className="w-5 h-5 text-rose-400" />
                    <span>{bInfo.original}</span>
                    <span className="text-xs text-indigo-400 font-semibold">
                      ({bInfo.pinyin} • {bInfo.english})
                    </span>
                  </h2>
                  <span className="text-xs text-theme-muted font-medium">
                    {b.restaurants.length} Vendors
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {b.restaurants.map((r, idx) => {
                    const rInfo = getPinyinAndEnglish(r.name);
                    const schedStatus = parseScheduleStatus(r.schedule);

                    return (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-rose-500/40 transition-all space-y-4 relative group shadow-sm flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              {/* Red, Green, Blue Status Badge */}
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border inline-flex items-center gap-1.5 ${schedStatus.color}`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    schedStatus.badgeColor === 'green'
                                      ? 'bg-emerald-400 animate-pulse'
                                      : schedStatus.badgeColor === 'yellow'
                                      ? 'bg-amber-400 animate-pulse'
                                      : schedStatus.badgeColor === 'blue'
                                      ? 'bg-blue-400'
                                      : 'bg-rose-400'
                                  }`}
                                />
                                {schedStatus.label}
                              </span>

                              <h3 className="text-lg font-bold text-theme-text group-hover:text-rose-400 transition-colors pt-1">
                                {rInfo.original}
                              </h3>

                              {/* Pinyin and English subtitle */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold">
                                  {rInfo.pinyin}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-medium">
                                  {rInfo.english}
                                </span>
                              </div>
                            </div>

                            <StarButton
                              id={`dining:${b.building}-${r.name}`}
                              type="dining"
                              title={r.name}
                              subtitle={`${rInfo.pinyin} • ${rInfo.english}`}
                              data={r}
                            />
                          </div>

                          {/* Operating Hours */}
                          <div className="p-3 rounded-2xl bg-theme-bg/60 border border-theme-border space-y-1 text-xs">
                            <div className="flex items-center justify-between text-theme-muted font-medium">
                              <span className="flex items-center gap-1 text-rose-400 font-bold">
                                <Clock className="w-3.5 h-3.5" /> Opening Hours
                              </span>
                              <span className="text-[11px] font-bold text-theme-text">
                                {schedStatus.hoursText}
                              </span>
                            </div>
                            {r.schedule?.weekday && (
                              <p className="text-[11px] text-theme-muted">
                                Weekday: {r.schedule.weekday}
                              </p>
                            )}
                          </div>

                          {r.phone && (
                            <p className="text-xs text-theme-muted flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>{r.phone}</span>
                            </p>
                          )}

                          {r.note && (
                            <p className="text-xs text-theme-muted bg-theme-bg/40 p-2.5 rounded-xl border border-theme-border/60">
                              <Info className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
                              {r.note}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
