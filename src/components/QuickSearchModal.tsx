'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Bike, WashingMachine, Bus, Library, UtensilsCrossed, BookOpen, Newspaper, Zap, MapPin, Code, Dumbbell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODULE_SEARCH_ITEMS = [
  { href: '/youbike', title: 'YouBike 2.0 Live Stations', type: 'YouBike', icon: Bike, desc: 'Check bikes & empty docks around campus' },
  { href: '/laundry', title: 'Laundry Hub (Washing & Drying)', type: 'Laundry', icon: WashingMachine, desc: 'Real-time MQTT washer availability by dorm' },
  { href: '/buses', title: 'Campus Shuttle Bus Timetables', type: 'Bus', icon: Bus, desc: 'Main & Nanda campus shuttle schedules' },
  { href: '/library', title: 'Library Space & Study Seats', type: 'Library', icon: Library, desc: 'Real-time seat occupancy & opening hours' },
  { href: '/dining', title: 'Food & Dining Venues', type: 'Dining', icon: UtensilsCrossed, desc: 'Shops in Waterwood, Student Activity Center, etc.' },
  { href: '/gym', title: 'Gym & Sports Facilities Availability', type: 'Gym', icon: Dumbbell, desc: 'Live weight room headcount & court availability' },
  { href: '/courses', title: 'Course Search Engine', type: 'Courses', icon: BookOpen, desc: 'Search NTHU courses by code, teacher, title' },
  { href: '/announcements', title: 'Department News & Announcements', type: 'News', icon: Newspaper, desc: 'Announcements feed across NTHU departments' },
  { href: '/energy', title: 'Realtime Campus Power Usage', type: 'Energy', icon: Zap, desc: 'Live electricity usage & peak gauges' },
  { href: '/locations', title: 'Campus Map & Buildings', type: 'Location', icon: MapPin, desc: 'Building code & facility finder' },
  { href: '/docs', title: 'Developer API Documentation', type: 'API', icon: Code, desc: 'Explore and test /api/v1/ endpoints' },
];

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
          const trigger = document.querySelector('button[title="Search NTHU Hub..."]');
          if (trigger) (trigger as HTMLElement).click();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = MODULE_SEARCH_ITEMS.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-theme-card border border-theme-border rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Search Header Input */}
          <div className="p-4 border-b border-theme-border flex items-center gap-3">
            <Search className="w-5 h-5 text-theme-primary" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search NTHU modules, YouBike, buses, courses, dining..."
              className="w-full bg-transparent text-theme-text placeholder-theme-muted focus:outline-none text-base font-medium"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-theme-card-hover text-theme-muted hover:text-theme-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results Listing */}
          <div className="p-3 max-h-96 overflow-y-auto space-y-1.5">
            {filtered.length === 0 ? (
              <p className="text-center text-theme-muted py-8 text-sm">
                No matching results found for "{query}". Try searching for 'YouBike', 'Bus', 'Course', or 'Washer'.
              </p>
            ) : (
              filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="w-full text-left p-3 rounded-2xl hover:bg-theme-card-hover border border-transparent hover:border-theme-primary/30 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-theme-bg/80 border border-theme-border text-theme-primary group-hover:bg-theme-primary group-hover:text-white transition-all shadow-sm">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-theme-text group-hover:text-theme-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-theme-muted">{item.desc}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-theme-bg border border-theme-border text-theme-muted group-hover:text-theme-primary group-hover:border-theme-primary/40">
                      {item.type}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-theme-border bg-theme-bg/40 text-xs text-theme-muted flex items-center justify-between">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-theme-card border border-theme-border font-mono text-[10px]">ESC</kbd> to exit</span>
            <span className="text-theme-primary font-medium">NTHU Hub Global Command Menu</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
