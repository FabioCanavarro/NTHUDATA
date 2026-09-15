'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Bike,
  WashingMachine,
  Bus,
  Library,
  UtensilsCrossed,
  BookOpen,
  Newspaper,
  Zap,
  MapPin,
  Code,
  Sparkles,
  SearchCheck,
  Dumbbell,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home Dashboard', icon: LayoutDashboard },
  { href: '/youbike', label: 'YouBike 2.0', icon: Bike, badge: 'Live' },
  { href: '/laundry', label: 'Laundry Hub', icon: WashingMachine, badge: 'MQTT' },
  { href: '/buses', label: 'Campus Buses', icon: Bus },
  { href: '/library', label: 'Library & Space', icon: Library },
  { href: '/dining', label: 'Food & Dining', icon: UtensilsCrossed },
  { href: '/gym', label: 'Gym & Sports', icon: Dumbbell, badge: 'Live' },
  { href: '/lost-and-found', label: 'Lost & Found', icon: SearchCheck, badge: 'New' },
  { href: '/courses', label: 'Course Search', icon: BookOpen },
  { href: '/announcements', label: 'News Feed', icon: Newspaper },
  { href: '/energy', label: 'Power Usage', icon: Zap },
  { href: '/locations', label: 'Campus Map', icon: MapPin },
  { href: '/docs', label: 'Developer API', icon: Code, badge: 'v1' },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-theme-card/90 border-r border-theme-border flex flex-col h-screen sticky top-0 z-30 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-theme-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-theme-primary to-theme-accent flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-theme-text tracking-wide group-hover:text-theme-primary transition-colors">
              NTHU <span className="text-theme-primary">HUB</span>
            </h1>
            <p className="text-xs text-theme-muted">Unified Campus OS</p>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`relative px-3.5 py-2.5 rounded-xl flex items-center justify-between font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-theme-primary/15 text-theme-primary border border-theme-primary/40 shadow-glow font-semibold'
                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-card-hover/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-theme-primary rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-theme-primary' : 'text-theme-muted'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full border ${
                      isActive
                        ? 'bg-theme-primary text-white border-theme-primary'
                        : 'bg-theme-bg text-theme-primary border-theme-primary/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-theme-border text-xs text-theme-muted flex items-center justify-between bg-theme-bg/40">
        <span className="font-semibold text-theme-text">NTHU Hub System</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </div>
    </aside>
  );
};
