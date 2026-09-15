'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Building } from 'lucide-react';
import { StarButton } from '@/components/StarButton';

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('台積館');

  const searchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/locations?q=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setLocations(data.locations || []);
      }
    } catch (e) {
      console.error('Failed to load locations', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchLocations();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            NTHU Campus Buildings & Map Finder
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            Campus Buildings & Locations
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Search building names, codes, and campus facilities across Main and Nanda campus.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchLocations()}
            placeholder="Search building (e.g. 台積館, 旺宏館, 人社, 理學)..."
            className="w-full bg-theme-card border border-theme-border focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
          />
        </div>
        <button
          onClick={searchLocations}
          disabled={loading}
          className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all shadow-glow"
        >
          Search
        </button>
      </div>

      {/* Locations Grid */}
      {loading ? (
        <div className="text-center py-16 text-theme-muted">Searching NTHU campus map...</div>
      ) : locations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
          No buildings or locations match your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc: any, idx: number) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-cyan-500/40 transition-all space-y-3 relative group shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  {loc.code && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-theme-bg border border-theme-border text-cyan-400 inline-block mb-1">
                      {loc.code}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-theme-text group-hover:text-cyan-400 transition-colors">
                    {loc.name || loc.title}
                  </h3>
                </div>

                <StarButton
                  id={`location:${loc.name || idx}`}
                  type="location"
                  title={loc.name || 'Building'}
                  subtitle={loc.code || 'Campus Facility'}
                  data={loc}
                />
              </div>

              {loc.description && (
                <p className="text-xs text-theme-muted">{loc.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
