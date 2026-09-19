'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bike,
  WashingMachine,
  Search,
  Menu,
  ExternalLink,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export function MobileBottomNav({
  onOpenSearch,
  onOpenMobileMenu,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: '/', label: 'Home', icon: LayoutDashboard },
    { href: '/youbike', label: 'YouBike', icon: Bike },
    { href: '/laundry', label: 'Laundry', icon: WashingMachine },
    { href: 'https://nthumod.com', label: 'NTHUMOD ↗', icon: ExternalLink, external: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-theme-bg/95 border-t border-theme-border backdrop-blur-xl md:hidden px-2 py-1.5 shadow-2xl flex items-center justify-around">
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
              className="flex-1"
            >
              <div className="flex flex-col items-center justify-center py-1 rounded-xl text-indigo-400 hover:text-indigo-300 font-bold">
                <Icon className="w-5 h-5 text-indigo-400" />
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </div>
            </a>
          );
        }

        return (
          <Link key={item.href} href={item.href} className="flex-1">
            <div
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-theme-primary font-bold bg-theme-primary/10'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-theme-primary' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </div>
          </Link>
        );
      })}

      {/* Quick Search */}
      <button
        onClick={onOpenSearch}
        className="flex-1 flex flex-col items-center justify-center py-1 text-theme-muted hover:text-theme-text"
        title="Search NTHU Hub"
      >
        <Search className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] mt-0.5 tracking-tight">Search</span>
      </button>

      {/* Mobile Drawer Menu Toggle */}
      <button
        onClick={onOpenMobileMenu}
        className="flex-1 flex flex-col items-center justify-center py-1 text-theme-muted hover:text-theme-text"
        title="Open Full Navigation Menu"
      >
        <Menu className="w-5 h-5 text-theme-primary" />
        <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
      </button>
    </div>
  );
}
