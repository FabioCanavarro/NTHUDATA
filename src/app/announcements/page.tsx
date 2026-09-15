'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, Building2, ExternalLink, Star } from 'lucide-react';
import { StarButton } from '@/components/StarButton';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/announcements');
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.announcements || []);
          setDepartments(data.departments || []);
        }
      } catch (e) {
        console.error('Failed to load announcements', e);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const filtered = announcements.filter((a) => {
    if (selectedDept !== 'ALL' && a.department !== selectedDept) return false;
    if (search) {
      const lower = search.toLowerCase();
      return (
        a.title?.toLowerCase().includes(lower) ||
        a.department?.toLowerCase().includes(lower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Newspaper className="w-3.5 h-3.5" />
            NTHU Multi-Department Bulletin
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            Department News Feed
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Aggregated official announcements across NTHU administrative and academic departments.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news titles or departments (e.g. 教務處, 住宿組, 獎學金)..."
            className="w-full bg-theme-card border border-theme-border hover:border-blue-500/50 focus:border-blue-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
          />
        </div>

        {/* Department Dropdown / Selector */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-64 bg-theme-card border border-theme-border text-xs font-semibold text-theme-text rounded-2xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Departments ({departments.length})</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* News Cards */}
      {loading ? (
        <div className="text-center py-16 text-theme-muted">Loading department announcements...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
          No announcements match your search filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item: any, idx: number) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-blue-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group shadow-sm"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {item.department}
                  </span>
                  {item.language && (
                    <span className="text-[10px] text-theme-muted uppercase">{item.language}</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-theme-text group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StarButton
                  id={`announcement:${item.department}-${idx}`}
                  type="announcement"
                  title={item.title}
                  subtitle={item.department}
                  data={item}
                />

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-2xl bg-theme-bg border border-theme-border hover:border-blue-400 text-theme-muted hover:text-blue-400 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
