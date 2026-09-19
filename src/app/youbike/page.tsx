'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bike, RefreshCw, MapPin, Search, Navigation, Map as MapIcon, Grid, Zap } from 'lucide-react';
import { StarButton } from '@/components/StarButton';
import { getPinyinAndEnglish } from '@/utils/pinyin';
import YouBikeMap from '@/components/YouBikeMap';
import { DataExporter } from '@/components/DataExporter';

// Haversine distance formula in KM
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function YouBikePage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'electric' | 'standard' | 'docks' | 'nearest'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Geolocation state
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [selectedStationUid, setSelectedStationUid] = useState<string | null>(null);

  const fetchYouBikeData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/youbike');
      if (res.ok) {
        const data = await res.json();
        setStations(data.stations || []);
      }
    } catch (e) {
      console.error('Failed to load YouBike data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYouBikeData();
    const interval = setInterval(fetchYouBikeData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle Find Nearest Station
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Using NTHU Main Gate as default.');
      setUserLoc({ lat: 24.7961, lng: 120.9967 });
      setFilterType('nearest');
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        setLocLoading(false);
        setFilterType('nearest');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setUserLoc({ lat: 24.7961, lng: 120.9967 });
        setLocLoading(false);
        setFilterType('nearest');
      },
      { timeout: 8000 }
    );
  };

  // Calculate distance & map properties
  const processedStations = stations.map((st) => {
    const { original, pinyin, english } = getPinyinAndEnglish(st.name);
    let dist = undefined;
    if (userLoc && st.lat && st.lng) {
      dist = getDistanceKm(userLoc.lat, userLoc.lng, st.lat, st.lng);
    }
    return {
      ...st,
      displayName: original,
      pinyin,
      english,
      distance: dist,
    };
  });

  let filtered = processedStations.filter((s) => {
    const matchesSearch =
      s.displayName.toLowerCase().includes(search.toLowerCase()) ||
      s.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      s.english.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'electric') return (s.electricBikes || 0) > 0;
    if (filterType === 'standard') return (s.generalBikes || 0) > 0;
    if (filterType === 'docks') return s.emptyDocks > 0;
    return true;
  });

  if (filterType === 'nearest') {
    filtered = [...filtered].sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }

  const totalElectricCount = stations.reduce((acc, s) => acc + (s.electricBikes || 0), 0);
  const totalStandardCount = stations.reduce((acc, s) => acc + (s.generalBikes || s.availableBikes || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Bike className="w-3.5 h-3.5" />
            YouBike 2.0 & 2.0E Electric • 腳踏車與電輔車即時動態
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            YouBike 2.0 & 2.0E Electric Live Tracker
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Real-time breakdown of standard YouBike 2.0 (一般單車) & YouBike 2.0E (電輔車), interactive map, and nearest station locator.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Data Export Button */}
          <DataExporter
            data={processedStations.map((s) => ({
              station: s.displayName,
              pinyin: s.pinyin,
              english: s.english,
              available_bikes: s.availableBikes,
              general_bikes: s.generalBikes,
              electric_bikes: s.electricBikes,
              empty_docks: s.emptyDocks,
              address: s.address,
              lat: s.lat,
              lng: s.lng,
            }))}
            filename="nthu_youbike_stations"
            title="YouBike Stations"
          />

          {/* View Toggle Button */}
          <div className="flex items-center bg-theme-card p-1 rounded-2xl border border-theme-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Map View
            </button>
          </div>

          <button
            onClick={fetchYouBikeData}
            disabled={loading}
            className="px-3.5 py-2 rounded-2xl bg-theme-card border border-theme-border hover:border-cyan-500/50 text-cyan-400 flex items-center gap-2 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Controls & Geolocation */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search station or address in English / Pinyin / 中文 (e.g. Snack Bar, 台達館)..."
            className="w-full bg-theme-card border border-theme-border hover:border-cyan-500/50 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {/* Nearest Me Button */}
          <button
            onClick={handleGetLocation}
            disabled={locLoading}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 shrink-0 transition-all ${
              filterType === 'nearest'
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-glow'
                : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${locLoading ? 'animate-spin' : ''}`} />
            {locLoading ? 'Locating...' : 'Nearest Station'}
          </button>

          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-glow'
                : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
            }`}
          >
            All ({stations.length})
          </button>

          {/* Electric 2.0E Filter */}
          <button
            onClick={() => setFilterType('electric')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 border flex items-center gap-1 transition-all ${
              filterType === 'electric'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-glow'
                : 'bg-theme-card border-theme-border text-amber-400/80 hover:text-amber-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Electric 2.0E ({totalElectricCount})
          </button>

          {/* Standard 2.0 Filter */}
          <button
            onClick={() => setFilterType('standard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
              filterType === 'standard'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-glow'
                : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
            }`}
          >
            Standard 2.0 ({totalStandardCount})
          </button>

          <button
            onClick={() => setFilterType('docks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
              filterType === 'docks'
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-glow'
                : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
            }`}
          >
            Has Docks
          </button>
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-theme-muted">
            <span>Showing interactive map with live bike markers</span>
            <span>Click pins to view 🚴 Standard 2.0 vs ⚡ Electric 2.0E breakdown</span>
          </div>
          <YouBikeMap
            stations={filtered}
            userLat={userLoc?.lat}
            userLng={userLoc?.lng}
            selectedStationUid={selectedStationUid}
            onSelectStation={(uid) => setSelectedStationUid(uid)}
          />
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'grid' && (
        <>
          {loading && stations.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-sm text-theme-muted">Loading live YouBike 2.0 stations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
              No YouBike stations match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((st) => (
                <motion.div
                  key={st.uid}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-cyan-500/40 transition-all space-y-4 relative group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              st.isServicing ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                            }`}
                          />
                          <h3 className="text-base font-bold text-theme-text group-hover:text-cyan-400 transition-colors">
                            {st.displayName}
                          </h3>
                        </div>

                        {/* Pinyin and English Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-bold">
                            {st.pinyin}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-medium">
                            {st.english}
                          </span>
                        </div>
                      </div>

                      <StarButton
                        id={`youbike:${st.uid}`}
                        type="youbike"
                        title={st.displayName}
                        subtitle={`${st.pinyin} • ${st.english}`}
                        data={st}
                      />
                    </div>

                    <p className="text-xs text-theme-muted flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{st.address}</span>
                    </p>

                    {st.distance !== undefined && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                        <Navigation className="w-3 h-3" />
                        <span>
                          {st.distance < 1
                            ? `${Math.round(st.distance * 1000)} meters away`
                            : `${st.distance.toFixed(1)} km away`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3 Detailed Bike & Dock Counters: Standard 2.0 vs Electric 2.0E vs Docks */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-theme-border/50">
                    {/* Standard 2.0 */}
                    <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-0.5">
                      <p className="text-[9px] text-cyan-300 font-bold uppercase truncate">
                        🚴 Standard 2.0
                      </p>
                      <p className="text-xl font-extrabold text-cyan-400">
                        {st.generalBikes ?? st.availableBikes}
                      </p>
                    </div>

                    {/* Electric 2.0E */}
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-0.5">
                      <p className="text-[9px] text-amber-300 font-bold uppercase truncate">
                        ⚡ Electric 2.0E
                      </p>
                      <p className="text-xl font-extrabold text-amber-400">
                        {st.electricBikes ?? 0}
                      </p>
                    </div>

                    {/* Empty Docks */}
                    <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center space-y-0.5">
                      <p className="text-[9px] text-purple-300 font-bold uppercase truncate">
                        🅿️ Empty Docks
                      </p>
                      <p className="text-xl font-extrabold text-purple-400">
                        {st.emptyDocks}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
