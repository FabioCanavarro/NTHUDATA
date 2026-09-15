'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Clock, Users, BookOpen, ExternalLink, Search, Layers, HelpCircle, X, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { StarButton } from '@/components/StarButton';
import { getPinyinAndEnglish } from '@/utils/pinyin';

export default function LibraryPage() {
  const [libData, setLibData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    async function loadLibraryData() {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/library');
        if (res.ok) {
          const data = await res.json();
          setLibData(data);
        }
      } catch (e) {
        console.error('Failed to load library data', e);
      } finally {
        setLoading(false);
      }
    }
    loadLibraryData();
  }, []);

  const spaces = libData?.spaceAvailability || [];

  // Extract unique floor levels
  const floors = Array.from(new Set(spaces.map((s: any) => s.floor))).sort();

  // Filter spaces based on search and floor tab
  const filteredSpaces = spaces.filter((space: any) => {
    const spaceInfo = getPinyinAndEnglish(space.areaName);
    const typeInfo = getPinyinAndEnglish(space.spaceType);

    const matchesSearch =
      space.areaName.toLowerCase().includes(search.toLowerCase()) ||
      spaceInfo.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      spaceInfo.english.toLowerCase().includes(search.toLowerCase()) ||
      typeInfo.english.toLowerCase().includes(search.toLowerCase()) ||
      space.floor.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFloor !== 'ALL' && space.floor !== selectedFloor) return false;

    return true;
  });

  // Group filtered spaces by floor level
  const groupedByFloor: Record<string, any[]> = {};
  filteredSpaces.forEach((s: any) => {
    const f = s.floor || 'Other Area';
    if (!groupedByFloor[f]) groupedByFloor[f] = [];
    groupedByFloor[f].push(s);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Library className="w-3.5 h-3.5" />
            NTHU Library SMS Real-time API • 圖書館自修室
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            Library & Study Spaces
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Real-time seat vacancies, study room availability, and RSS bulletins organized by floor level with English & Pinyin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Reservation Help Guide Button */}
          <button
            onClick={() => setShowGuideModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/30 flex items-center gap-2 text-xs font-bold transition-all shadow-glow"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            Booking Guide (預約指南)
          </button>

          <StarButton
            id="library:main"
            type="library"
            title="清華大學總圖書館 (Main Library)"
            subtitle="Qīnghuá Dàxué Zǒngtúshūguǎn • Main Library & Branches"
            data={{ name: '總圖書館' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-theme-muted">Fetching library space data...</div>
      ) : libData ? (
        <div className="space-y-8">
          {/* Library Operating Hours Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {libData.libraries?.map((lib: any) => {
              const libInfo = getPinyinAndEnglish(lib.name);
              return (
                <div
                  key={lib.name}
                  className="p-5 rounded-3xl bg-theme-card border border-theme-border space-y-2 shadow-sm hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-theme-text">{libInfo.original}</h3>
                      <p className="text-[11px] text-indigo-400 font-semibold">
                        {libInfo.pinyin} • {libInfo.english}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                      {lib.status}
                    </span>
                  </div>
                  <p className="text-xs text-theme-muted flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lib.hours}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Filter Bar & Floor Level Tabs */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by area name, floor, or type in English / Pinyin / 中文 (e.g. 4F, 夜讀區, Discussion)..."
                  className="w-full bg-theme-card border border-theme-border hover:border-indigo-500/50 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Floor Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedFloor('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                  selectedFloor === 'ALL'
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-glow'
                    : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                All Floors ({spaces.length})
              </button>
              {floors.map((f: any) => {
                const fInfo = getPinyinAndEnglish(f);
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFloor(f)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
                      selectedFloor === f
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-glow'
                        : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seat & Space Vacancy Gauge Cards Sorted by Floor Level */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-theme-text flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Real-time Seat & Area Vacancies (即時座位數)
              </h2>
              <button
                onClick={() => setShowGuideModal(true)}
                className="text-xs text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                Need help reserving seats? 📖 Guide ↗
              </button>
            </div>

            {Object.keys(groupedByFloor).length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
                No study spaces match your filter.
              </div>
            ) : (
              Object.entries(groupedByFloor).map(([floorName, spaceList]) => {
                const floorInfo = getPinyinAndEnglish(floorName);
                return (
                  <div key={floorName} className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-theme-border pb-2 pt-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-base font-extrabold text-theme-text">{floorName}</h3>
                      <span className="text-xs text-indigo-400 font-semibold">
                        ({floorInfo.pinyin} • {floorInfo.english})
                      </span>
                      <span className="text-xs text-theme-muted ml-auto font-medium">
                        {spaceList.length} Zones
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {spaceList.map((space: any, idx: number) => {
                        const total = space.totalSeats || 50;
                        const free = space.freeSeats || 0;
                        const pct = Math.min(
                          100,
                          Math.max(0, Math.round(((total - free) / total) * 100))
                        );

                        const spaceInfo = getPinyinAndEnglish(space.areaName);
                        const typeInfo = getPinyinAndEnglish(space.spaceType);

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-indigo-500/40 transition-all space-y-4 shadow-sm flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block mb-1">
                                    {floorName}
                                  </span>
                                  <h4 className="text-base font-bold text-theme-text">
                                    {spaceInfo.original}
                                  </h4>
                                </div>
                                <span className="text-xs font-extrabold text-indigo-400 shrink-0 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                  {free} free seats
                                </span>
                              </div>

                              {/* Pinyin and English badges */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-theme-bg text-indigo-300 border border-theme-border text-[11px] font-bold">
                                  {spaceInfo.pinyin}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-theme-bg text-theme-muted border border-theme-border text-[11px] font-medium">
                                  {spaceInfo.english} ({typeInfo.english})
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar & Occupancy */}
                            <div className="space-y-1.5 pt-2">
                              <div className="w-full bg-theme-bg rounded-full h-3 overflow-hidden border border-theme-border">
                                <div
                                  className={`h-full transition-all duration-500 rounded-full ${
                                    pct > 80
                                      ? 'bg-rose-400'
                                      : pct > 50
                                      ? 'bg-amber-400'
                                      : 'bg-emerald-400'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-theme-muted font-medium">
                                <span>{pct}% Occupied (已使用)</span>
                                <span>Capacity: {total} Seats</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Library News & RSS Bulletins */}
          <div className="p-6 rounded-3xl bg-theme-card border border-theme-border space-y-4">
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Library News & RSS Bulletins (最新公告)
            </h2>
            <div className="space-y-2">
              {libData.rssFeeds?.map((rss: any, idx: number) => {
                const rssInfo = getPinyinAndEnglish(rss.title);
                return (
                  <a
                    key={idx}
                    href={rss.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-2xl bg-theme-bg/60 border border-theme-border hover:border-indigo-400/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-theme-text group transition-all"
                  >
                    <div className="space-y-1">
                      <span className="font-semibold text-sm group-hover:text-indigo-400 transition-colors block">
                        {rss.title}
                      </span>
                      <span className="text-[11px] text-theme-muted block">
                        {rssInfo.pinyin} • {rssInfo.english}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-theme-muted">
                      <span className="px-2.5 py-1 rounded-lg bg-theme-card border border-theme-border text-[11px]">
                        {rss.date}
                      </span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Reservation Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-theme-card border border-theme-border rounded-3xl shadow-2xl overflow-hidden space-y-4"
            >
              {/* Header */}
              <div className="p-5 border-b border-theme-border flex items-center justify-between bg-theme-bg/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Library className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-theme-text">
                      How to Book Library Seats & Discussion Rooms
                    </h3>
                    <p className="text-xs text-indigo-400 font-semibold">
                      Qīnghuá Dàxué Túshūguǎn Yùyuē Zhǐnán • Step-by-Step Guide
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="p-2 rounded-xl bg-theme-card hover:bg-theme-card-hover border border-theme-border text-theme-muted hover:text-theme-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Guide Steps */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs text-theme-text">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                  <span className="font-bold text-indigo-400 text-sm">Step 1: Open Official Booking Portal</span>
                  <p className="text-theme-muted">
                    Visit NTHU Library Space Management System at{' '}
                    <a
                      href="https://libsms.lib.nthu.edu.tw"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 underline font-bold"
                    >
                      libsms.lib.nthu.edu.tw
                    </a>{' '}
                    or{' '}
                    <a
                      href="https://space.lib.nthu.edu.tw"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 underline font-bold"
                    >
                      space.lib.nthu.edu.tw
                    </a>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                  <span className="font-bold text-indigo-400 text-sm">Step 2: Log in with NTHU Academic ID</span>
                  <p className="text-theme-muted">
                    Enter your Student ID (學號) or Faculty Employee ID and your NTHU Academic Information System password.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                  <span className="font-bold text-indigo-400 text-sm">Step 3: Select Library, Floor & Time Slot</span>
                  <p className="text-theme-muted">
                    Choose Main Library (旺宏館 2F/4F/6F), HSS Branch (人社分館), or CTM Building. Pick your preferred seat or group discussion room and reserve 1 to 4 hours per slot.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                  <span className="font-bold text-indigo-400 text-sm">Step 4: Check-in at Library Gate (Crucial!)</span>
                  <p className="text-theme-muted">
                    Swipe your NTHU Student ID Card at the gate sensor within <strong className="text-rose-400">15 minutes</strong> of your start time! Missing check-in will automatically cancel your reservation and add 1 penalty point to your account.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-theme-border bg-theme-bg/40 flex items-center justify-between">
                <a
                  href="https://libsms.lib.nthu.edu.tw"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-all flex items-center gap-1.5"
                >
                  Open libsms.lib.nthu.edu.tw <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 rounded-xl bg-theme-card border border-theme-border text-theme-muted text-xs font-bold hover:text-theme-text transition-all"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
