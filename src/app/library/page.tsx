'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Clock, Users, BookOpen, ExternalLink, Search, Layers, HelpCircle, X, CheckCircle2, Moon, Sparkles, Filter } from 'lucide-react';
import { StarButton } from '@/components/StarButton';
import { getPinyinAndEnglish } from '@/utils/pinyin';

export default function LibraryPage() {
  const [libData, setLibData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [selectedLibModal, setSelectedLibModal] = useState<any>(null);

  const loadLibraryData = async () => {
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
  };

  // 3-second auto refresh interval
  useEffect(() => {
    loadLibraryData();
    const interval = setInterval(loadLibraryData, 3000);
    return () => clearInterval(interval);
  }, []);

  const spaces = libData?.spaceAvailability || [];

  // Extract unique floor levels with Moonlight Area prioritized
  const rawFloors = Array.from(new Set(spaces.map((s: any) => s.floor))).sort();
  const floors = rawFloors.filter((f: any) => f !== 'Moonlight Area (夜讀區)');
  if (rawFloors.includes('Moonlight Area (夜讀區)')) {
    floors.unshift('Moonlight Area (夜讀區)');
  }

  const spaceTypes = [
    { id: 'ALL', label: 'All Types (全部類型)' },
    { id: '討論室', label: 'Discussion Rooms (討論室)' },
    { id: '研究小間', label: 'Individual Study Carrels (研究小間)' },
    { id: '資訊島', label: 'PC Workstations (資訊島)' },
    { id: '夜讀區', label: 'Moonlight Area (夜讀區 24H)' },
    { id: '聆賞席', label: 'AV Listening Seats (聆賞席)' },
    { id: '團體室', label: 'Group Activity Rooms (團體室)' },
  ];

  // Filter spaces based on search, floor tab, and space type
  const filteredSpaces = spaces.filter((space: any) => {
    const spaceInfo = getPinyinAndEnglish(space.areaName);
    const typeInfo = getPinyinAndEnglish(space.spaceType);

    const matchesSearch =
      space.areaName.toLowerCase().includes(search.toLowerCase()) ||
      spaceInfo.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      spaceInfo.english.toLowerCase().includes(search.toLowerCase()) ||
      typeInfo.english.toLowerCase().includes(search.toLowerCase()) ||
      space.floor.toLowerCase().includes(search.toLowerCase()) ||
      (search.toLowerCase().includes('moonlight') && (space.isMoonlightArea || space.areaName.includes('夜讀')));

    if (!matchesSearch) return false;
    if (selectedFloor !== 'ALL' && space.floor !== selectedFloor) return false;
    if (selectedType !== 'ALL' && !space.spaceType.includes(selectedType) && !space.areaName.includes(selectedType)) return false;

    return true;
  });

  // Group filtered spaces by floor level
  const groupedByFloor: Record<string, any[]> = {};
  filteredSpaces.forEach((s: any) => {
    const f = s.floor || 'Other Area';
    if (!groupedByFloor[f]) groupedByFloor[f] = [];
    groupedByFloor[f].push(s);
  });

  // Helper rules and info generator for space types
  const getSpaceDetails = (space: any) => {
    const isMoonlight = space.isMoonlightArea || space.areaName.includes('夜讀');
    const type = space.spaceType || '';

    let rules = [
      'NTHU Active Student / Faculty Card required for access',
      'Maximum session duration: 4 hours (renewable at kiosk if available)',
      '15-minute check-in grace period after booking',
    ];
    let amenities = ['AC (空調)', 'High-speed Wi-Fi', 'Power Outlets (插座)'];

    if (isMoonlight) {
      rules = [
        'Open 24 Hours a day, 365 days a year',
        'Direct swipe entry using NTHU Student ID Card at entrance gate',
        'Quiet study zone — silence maintained at all times',
        'No advance online reservation required; kiosk or walk-in seating',
      ];
      amenities = ['24H Security Guard', 'Power Sockets per Desk', 'Hot/Cold Water Kiosk', 'High-Speed NTHU-WiFi'];
    } else if (type.includes('討論室') || type.includes('團體室')) {
      rules = [
        'Minimum group requirement: 3+ NTHU students/faculty',
        'Reserve up to 7 days in advance via libsms online portal',
        'All group members must scan student ID at room door within 15 minutes',
        'Whiteboard and screen projection equipment included',
      ];
      amenities = ['Private Soundproof Room', 'HDMI/Type-C Display Monitor', 'Whiteboard & Markers', 'Power Strip'];
    } else if (type.includes('研究小間')) {
      rules = [
        'Dedicated single-person study carrel for graduate & undergraduate research',
        'Reserve online up to 3 days in advance',
        'Keycard check-out at 1F Service Counter or smart lock entry',
      ];
      amenities = ['Private Enclosed Desk', 'Desk Lamp', 'Dual Power Sockets', 'Ergonomic Chair'];
    } else if (type.includes('資訊島') || type.includes('電腦')) {
      rules = [
        'Equipped with desktop PC and Windows/Linux environment',
        'Login using NTHU Student Portal credentials upon seating',
        'Direct printing access to library campus network printers',
      ];
      amenities = ['27" Monitor PC', 'NTHU Portal Login', 'Campus Cloud Printing', 'USB Ports'];
    } else if (type.includes('聆賞席')) {
      rules = [
        'Individual audiovisual viewing and listening workstation',
        'Borrow DVDs/CDs from 3F AV Desk prior to seating',
      ];
      amenities = ['HD Display Screen', 'Hi-Fi Headphones', 'DVD/Bluray Player', 'Reclining Seat'];
    }

    return { rules, amenities };
  };

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
            Click any space card for live details & direct booking links to libsms.lib.nthu.edu.tw.
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

      {loading && !libData ? (
        <div className="text-center py-16 text-theme-muted">Fetching library space data...</div>
      ) : libData ? (
        <div className="space-y-8">
          {/* Library Operating Hours Cards (Clickable) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {libData.libraries?.map((lib: any) => {
              const libInfo = getPinyinAndEnglish(lib.name);
              const isMoon = lib.name.includes('夜讀區');
              return (
                <div
                  key={lib.name}
                  onClick={() => setSelectedLibModal(lib)}
                  className={`p-5 rounded-3xl border space-y-2 shadow-sm transition-all cursor-pointer hover:scale-[1.02] ${
                    isMoon
                      ? 'bg-purple-950/30 border-purple-500/40 hover:border-purple-400/80 hover:shadow-purple-500/20'
                      : 'bg-theme-card border-theme-border hover:border-indigo-500/60 hover:shadow-indigo-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-theme-text flex items-center gap-1.5">
                        {isMoon && <Moon className="w-4 h-4 text-purple-400 fill-purple-400/20" />}
                        {libInfo.original}
                      </h3>
                      <p className="text-[11px] text-indigo-400 font-semibold">
                        {libInfo.pinyin} • {libInfo.english}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                        isMoon
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : lib.status === 'Open'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {lib.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-theme-muted pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {lib.hours}
                    </span>
                    <span className="text-[11px] text-indigo-400 font-bold hover:underline flex items-center gap-0.5">
                      Details <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search, Space Type & Floor Level Tabs */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by area name, Moonlight Area, floor, or type in English / Pinyin / 中文 (e.g. Moonlight, 夜讀區, 討論室, Discussion)..."
                  className="w-full bg-theme-card border border-theme-border hover:border-indigo-500/50 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Space Type Filter Pills */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-theme-muted flex items-center gap-1.5 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sort by Space Type (類型篩選):</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {spaceTypes.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedType(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
                      selectedType === st.id
                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-glow font-bold'
                        : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Filter Tabs */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-theme-muted flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sort by Floor Level (樓層篩選):</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setSelectedFloor('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                    selectedFloor === 'ALL'
                      ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-glow'
                      : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                  }`}
                >
                  All Floors ({spaces.length})
                </button>

                {/* Dedicated Moonlight Area Quick Filter */}
                <button
                  onClick={() => setSelectedFloor('Moonlight Area (夜讀區)')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
                    selectedFloor === 'Moonlight Area (夜讀區)'
                      ? 'bg-purple-500/30 text-purple-300 border-purple-400/60 shadow-glow'
                      : 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:border-purple-400/50'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-purple-300 fill-purple-300/20" />
                  <span>🌙 Moonlight Area (夜讀區 24H)</span>
                </button>

                {floors.map((f: any) => {
                  if (f === 'Moonlight Area (夜讀區)') return null;
                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFloor(f)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
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
          </div>

          {/* Seat & Space Vacancy Gauge Cards (Clickable) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-theme-text flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Real-time Seat & Area Vacancies (即時座位數)
              </h2>
              <a
                href="https://libsms.lib.nthu.edu.tw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                Go to libsms.lib.nthu.edu.tw 🔗 Booking Site ↗
              </a>
            </div>

            {Object.keys(groupedByFloor).length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
                No study spaces match your filter.
              </div>
            ) : (
              Object.entries(groupedByFloor).map(([floorName, spaceList]) => {
                const isMoonFloor = floorName.includes('Moonlight') || floorName.includes('夜讀');
                return (
                  <div key={floorName} className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-theme-border pb-2 pt-2">
                      {isMoonFloor ? (
                        <Moon className="w-4 h-4 text-purple-400 fill-purple-400/20" />
                      ) : (
                        <Layers className="w-4 h-4 text-indigo-400" />
                      )}
                      <h3 className={`text-base font-extrabold ${isMoonFloor ? 'text-purple-300' : 'text-theme-text'}`}>
                        {floorName}
                      </h3>
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

                        const isMoonlight = space.isMoonlightArea || space.areaName.includes('夜讀');
                        const spaceInfo = getPinyinAndEnglish(space.areaName);
                        const typeInfo = getPinyinAndEnglish(space.spaceType);

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSelectedSpace(space)}
                            className={`p-5 rounded-3xl border transition-all space-y-4 shadow-sm flex flex-col justify-between cursor-pointer hover:scale-[1.02] ${
                              isMoonlight
                                ? 'bg-purple-950/20 border-purple-500/40 hover:border-purple-400/80 hover:shadow-purple-500/20'
                                : 'bg-theme-card border-theme-border hover:border-indigo-500/60 hover:shadow-indigo-500/10'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                        isMoonlight
                                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                          : space.isClosed
                                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                      }`}
                                    >
                                      {isMoonlight ? '🌙 24H Moonlight Area (夜讀區)' : space.isClosed ? `${floorName} • CLOSED` : floorName}
                                    </span>
                                  </div>
                                  <h4 className="text-base font-bold text-theme-text">
                                    {spaceInfo.original}
                                  </h4>
                                </div>
                                <span
                                  className={`text-xs font-extrabold shrink-0 px-2.5 py-1 rounded-full border ${
                                    isMoonlight
                                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                      : space.isClosed
                                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                  }`}
                                >
                                  {space.isClosed ? '0 free (Closed 已閉館)' : `${free} free seats`}
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
                                    space.isClosed
                                      ? 'bg-gray-600/40'
                                      : isMoonlight
                                      ? 'bg-purple-400'
                                      : pct > 80
                                      ? 'bg-rose-400'
                                      : pct > 50
                                      ? 'bg-amber-400'
                                      : 'bg-emerald-400'
                                  }`}
                                  style={{ width: `${space.isClosed ? 0 : pct}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-theme-muted font-medium">
                                <span>{space.isClosed ? 'Closed (已閉館)' : `${pct}% Occupied (已使用)`}</span>
                                <span className="text-indigo-400 font-bold hover:underline flex items-center gap-0.5">
                                  Click for details & book ↗
                                </span>
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

          {/* Bottom Shortcut Banner to NTHU Official Booking Site */}
          <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-extrabold text-indigo-200 flex items-center justify-center md:justify-start gap-2">
                <span>NTHU Library Seat & Study Room Booking System</span>
              </h3>
              <p className="text-xs text-indigo-300/80">
                Official SMS portal for reserving discussion rooms, individual study carrels & overnight seats.
              </p>
            </div>
            <a
              href="https://libsms.lib.nthu.edu.tw"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-indigo-500 text-white font-extrabold text-xs hover:bg-indigo-400 transition-all flex items-center gap-2 shadow-glow shrink-0"
            >
              Go to libsms.lib.nthu.edu.tw 🔗 Booking Site ↗
            </a>
          </div>
        </div>
      ) : null}

      {/* SPACE DETAILS & DIRECT BOOKING MODAL */}
      <AnimatePresence>
        {selectedSpace && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-theme-card border border-theme-border rounded-3xl p-6 shadow-2xl space-y-5"
            >
              {/* Modal Header */}
              {(() => {
                const spaceInfo = getPinyinAndEnglish(selectedSpace.areaName);
                const typeInfo = getPinyinAndEnglish(selectedSpace.spaceType);
                const isMoonlight = selectedSpace.isMoonlightArea || selectedSpace.areaName.includes('夜讀');
                const total = selectedSpace.totalSeats || 50;
                const free = selectedSpace.freeSeats || 0;
                const pct = Math.min(100, Math.max(0, Math.round(((total - free) / total) * 100)));
                const { rules, amenities } = getSpaceDetails(selectedSpace);

                return (
                  <>
                    <div className="flex items-start justify-between border-b border-theme-border pb-4 gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              isMoonlight
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : selectedSpace.isClosed
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            }`}
                          >
                            {isMoonlight ? '🌙 24H Moonlight Area (夜讀區)' : selectedSpace.floor}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-theme-bg text-theme-muted border border-theme-border text-xs font-semibold">
                            {typeInfo.english}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-theme-text">
                          {spaceInfo.original}
                        </h3>
                        <p className="text-xs text-indigo-400 font-medium">
                          {spaceInfo.pinyin} • {spaceInfo.english}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedSpace(null)}
                        className="p-2 rounded-xl hover:bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-text shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Live Vacancy Box */}
                    <div
                      className={`p-4 rounded-2xl border space-y-2 ${
                        isMoonlight
                          ? 'bg-purple-950/40 border-purple-500/40'
                          : selectedSpace.isClosed
                          ? 'bg-rose-950/20 border-rose-500/30'
                          : 'bg-indigo-950/30 border-indigo-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
                          Real-time Seat Vacancy Status
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                            selectedSpace.isClosed
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {selectedSpace.isClosed ? 'CLOSED (已閉館)' : `${free} Free Seats`}
                        </span>
                      </div>

                      <div className="w-full bg-theme-bg rounded-full h-3.5 overflow-hidden border border-theme-border">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            selectedSpace.isClosed
                              ? 'bg-gray-600/40'
                              : isMoonlight
                              ? 'bg-purple-400'
                              : pct > 80
                              ? 'bg-rose-400'
                              : pct > 50
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${selectedSpace.isClosed ? 0 : pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-theme-muted pt-0.5">
                        <span>{selectedSpace.isClosed ? 'Closed for the night' : `${pct}% Capacity Occupied`}</span>
                        <span>Total Capacity: {total} Seats</span>
                      </div>
                    </div>

                    {/* Equipment & Facilities Badges */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
                        Available Amenities & Facilities:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((am, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text font-medium flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Booking Rules & Instructions */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
                        Space Booking Rules & Guidelines (預約與使用規則):
                      </span>
                      <div className="space-y-1.5 text-xs text-theme-muted bg-theme-bg p-3.5 rounded-2xl border border-theme-border">
                        {rules.map((r, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Direct Booking Link Action Button */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-theme-border">
                      <button
                        onClick={() => setSelectedSpace(null)}
                        className="px-4 py-2.5 rounded-2xl bg-theme-bg border border-theme-border text-xs font-bold text-theme-muted hover:text-theme-text hover:bg-theme-card transition-all"
                      >
                        Close
                      </button>
                      <a
                        href="https://libsms.lib.nthu.edu.tw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-xs text-center hover:brightness-110 transition-all shadow-glow flex items-center justify-center gap-2"
                      >
                        Book Now on libsms.lib.nthu.edu.tw 🔗 ↗
                      </a>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIBRARY BRANCH DETAILS MODAL */}
      <AnimatePresence>
        {selectedLibModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-theme-card border border-theme-border rounded-3xl p-6 shadow-2xl space-y-4"
            >
              {(() => {
                const libInfo = getPinyinAndEnglish(selectedLibModal.name);
                const isMoon = selectedLibModal.name.includes('夜讀區');

                return (
                  <>
                    <div className="flex items-center justify-between border-b border-theme-border pb-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold mb-1">
                          <Library className="w-3.5 h-3.5 text-indigo-400" />
                          NTHU Library Facility
                        </div>
                        <h3 className="text-xl font-extrabold text-theme-text">
                          {libInfo.original}
                        </h3>
                        <p className="text-xs text-indigo-400 font-medium">
                          {libInfo.pinyin} • {libInfo.english}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedLibModal(null)}
                        className="p-2 rounded-xl hover:bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-text"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs text-theme-text">
                      <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-theme-muted">Status (營運狀態):</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              isMoon
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : selectedLibModal.status === 'Open'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {selectedLibModal.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-theme-muted">Opening Hours (開放時間):</span>
                          <span className="font-extrabold text-indigo-400">{selectedLibModal.hours}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-1.5">
                        <p className="font-bold text-indigo-400">Library Services & Features:</p>
                        <p className="text-theme-muted leading-relaxed">
                          {isMoon
                            ? 'Open 24 hours daily on 4F & 1F Main Library. Requires NTHU student ID swipe at gate.'
                            : 'Access to general book stacks, study seats, group discussion rooms, computer islands, multi-function printers, and self-service borrowing kiosks.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-theme-border">
                      <button
                        onClick={() => setSelectedLibModal(null)}
                        className="px-4 py-2.5 rounded-2xl bg-theme-bg border border-theme-border text-xs font-bold text-theme-muted hover:text-theme-text"
                      >
                        Close
                      </button>
                      <a
                        href="https://libsms.lib.nthu.edu.tw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-2xl bg-indigo-500 text-white font-extrabold text-xs text-center hover:bg-indigo-400 transition-all shadow-glow flex items-center justify-center gap-1.5"
                      >
                        Book Seat / Room on libsms 🔗 ↗
                      </a>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reservation Guide Modal */}
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
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Library className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-theme-text">How to Book Seats & Study Rooms (預預指南)</h3>
                    <p className="text-xs text-theme-muted">Official NTHU Library Space Management System Guide</p>
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
                <div className="p-3.5 rounded-2xl bg-theme-bg border border-theme-border space-y-1.5">
                  <p className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    1. Login to NTHU Space Management System (自修室與座位預約系統)
                  </p>
                  <p className="text-theme-muted leading-relaxed">
                    Access <a href="https://libsms.lib.nthu.edu.tw" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-bold">libsms.lib.nthu.edu.tw ↗</a> and login using your NTHU Academic ID (學號/教職員號) and campus portal password.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-bg border border-theme-border space-y-1.5">
                  <p className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-purple-400" />
                    2. Moonlight Reading Area 24H (夜讀區 24小時自修室)
                  </p>
                  <p className="text-theme-muted leading-relaxed">
                    Located on 4F/1F of Main Library. Open 24/7 with NTHU Student ID card swipe at the entrance gate.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <a
                  href="https://libsms.lib.nthu.edu.tw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500/30 transition-all flex items-center gap-1"
                >
                  Go to libsms.lib.nthu.edu.tw <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:brightness-110 transition-all"
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
