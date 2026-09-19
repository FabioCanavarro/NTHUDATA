'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SearchCheck, Search, MapPin, Calendar, ShieldCheck, Tag, RefreshCw } from 'lucide-react';
import { StarButton } from '@/components/StarButton';
import { translateChineseText } from '@/utils/pinyin';
import { DataExporter } from '@/components/DataExporter';

interface LostItem {
  id: string;
  date: string;
  location: string;
  pinyinLocation: string;
  englishLocation: string;
  description: string;
  pinyinDesc: string;
  englishDesc: string;
  category: string;
  custody: string;
}

export default function LostAndFoundPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchLostItems = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch('/api/v1/lost-and-found');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error('Failed to fetch lost and found items', e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostItems(true);
  }, []);

  const categories = ['ALL', 'Electronics', 'ID Cards & Cards', 'Keys & Wallets', 'Stationery & Books', 'Personal Items'];

  const filtered = items.filter((item) => {
    const engDesc = item.englishDesc || translateChineseText(item.description);
    const engLoc = item.englishLocation || translateChineseText(item.location);

    const matchesSearch =
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      engDesc.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      engLoc.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <SearchCheck className="w-3.5 h-3.5" />
            NTHU Campus Lost & Found • 失物招領
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-text tracking-tight">
            Campus Lost & Found Portal
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">
            Browse live lost items reported across NTHU library & campus security with automatic English translation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <DataExporter
              data={items.map((i) => ({
                id: i.id,
                date: i.date,
                category: i.category,
                english_title: i.englishDesc || translateChineseText(i.description),
                original_title: i.description,
                location: i.englishLocation || i.location,
                custody: i.custody,
              }))}
              filename="nthu_lost_and_found"
              title="Lost Items"
            />
          )}

          <button
            onClick={() => fetchLostItems(true)}
            disabled={loading}
            className="px-4 py-2.5 rounded-2xl bg-theme-card border border-theme-border hover:border-teal-500/50 text-teal-400 flex items-center gap-2 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Registry
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in English or Chinese (e.g. AirPods, Student ID, Wallet, 鑰匙)..."
              className="w-full bg-theme-card border border-theme-border hover:border-teal-500/50 focus:border-teal-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-500/20 text-teal-400 border-teal-500/50 shadow-glow'
                    : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading && items.length === 0 ? (
        <div className="text-center py-16 text-theme-muted">Fetching NTHU Lost & Found registry...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
          No lost items match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const englishTitle = item.englishDesc || translateChineseText(item.description);
            const englishLoc = item.englishLocation || translateChineseText(item.location);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-teal-500/40 transition-all space-y-4 relative group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 inline-block">
                        {item.category}
                      </span>
                      {/* Prominent English Title */}
                      <h3 className="text-base font-extrabold text-theme-text group-hover:text-teal-400 transition-colors pt-1 leading-snug">
                        {englishTitle}
                      </h3>
                      <p className="text-xs text-theme-muted font-medium">
                        {item.description}
                      </p>
                    </div>

                    <StarButton
                      id={`lost:${item.id}`}
                      type="lost_and_found"
                      title={englishTitle}
                      subtitle={`Found at ${englishLoc} on ${item.date}`}
                      data={item}
                    />
                  </div>

                  {/* Pinyin and original details */}
                  {item.pinyinDesc && (
                    <div className="p-2.5 rounded-xl bg-theme-bg/60 border border-theme-border/60 text-xs">
                      <p className="text-indigo-400 font-semibold text-[11px]">{item.pinyinDesc}</p>
                    </div>
                  )}

                  {/* Location & Date */}
                  <div className="flex items-center justify-between text-xs text-theme-muted pt-1">
                    <span className="flex items-center gap-1 text-teal-400 font-bold truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" /> {englishLoc}
                    </span>
                    <span className="flex items-center gap-1 font-semibold shrink-0">
                      <Calendar className="w-3.5 h-3.5" /> {item.date}
                    </span>
                  </div>
                </div>

                {/* Custody Claim Info Footer */}
                <div className="pt-3 border-t border-theme-border/50 text-[11px] text-theme-muted flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Claim at: {item.custody}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
