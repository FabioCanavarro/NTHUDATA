'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bike,
  WashingMachine,
  Library,
  UtensilsCrossed,
  Newspaper,
  Zap,
  MapPin,
  Code,
  SearchCheck,
  Dumbbell,
  X,
  ExternalLink,
} from 'lucide-react';
import { PwaInstallPrompt } from './PwaInstallPrompt';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  external?: boolean;
  tooltip?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home Dashboard', icon: LayoutDashboard },
  { href: '/youbike', label: 'YouBike 2.0', icon: Bike },
  { href: '/laundry', label: 'Laundry Hub', icon: WashingMachine },
  {
    href: 'https://nthumod.com',
    label: 'NTHUMOD',
    icon: ExternalLink,
    external: true,
    badge: 'Peaks ⚡',
    tooltip: 'Just use nthu mod for planning and courses, peaks of peaks',
  },
  { href: '/library', label: 'Library & Space', icon: Library },
  { href: '/dining', label: 'Food & Dining', icon: UtensilsCrossed },
  { href: '/gym', label: 'Gym & Sports', icon: Dumbbell },
  { href: '/lost-and-found', label: 'Lost & Found', icon: SearchCheck },
  { href: '/announcements', label: 'News Feed', icon: Newspaper },
  { href: '/energy', label: 'Power Usage', icon: Zap },
  { href: '/locations', label: 'Campus Map', icon: MapPin },
  { href: '/docs', label: 'Developer API', icon: Code, badge: 'v1' },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header — NO LOGO, CLEAN TEXT ONLY */}
      <div className="p-5 border-b border-theme-border flex items-center justify-between">
        <Link href="/" onClick={handleNavClick} className="group">
          <div>
            <h1 className="font-extrabold text-xl text-theme-text tracking-tight group-hover:text-theme-primary transition-colors">
              NTHU <span className="text-theme-primary">HUB</span>
            </h1>
            <p className="text-xs text-theme-muted font-medium">Unified Campus OS</p>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-bg/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = !item.external && pathname === item.href;
          const Icon = item.icon;

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
                title={item.tooltip}
                className="px-3.5 py-2.5 rounded-xl flex items-center justify-between font-medium text-sm text-theme-muted hover:text-theme-text hover:bg-theme-card-hover/80 border border-theme-border/50 hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-bold text-theme-text group-hover:text-indigo-400 transition-colors">
                      {item.label} ↗
                    </span>
                    {item.tooltip && (
                      <span className="text-[10px] text-theme-muted line-clamp-1 font-normal">
                        {item.tooltip}
                      </span>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} onClick={handleNavClick}>
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

      {/* Footer System Status & PWA Install */}
      <div className="p-4 border-t border-theme-border space-y-3 bg-theme-card/30">
        <PwaInstallPrompt variant="button" />

        <div className="p-3 rounded-2xl bg-theme-bg/60 border border-theme-border/60 text-[11px] space-y-1">
          <p className="font-bold text-theme-text">NTHU Hub System</p>
          <p className="text-theme-muted font-medium">Unified Campus OS Platform</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-theme-card border-r border-theme-border h-screen sticky top-0 shrink-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-xs bg-theme-card border-r border-theme-border h-full shadow-2xl z-50"
            >
              {navContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
