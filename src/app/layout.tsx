'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { QuickSearchModal } from '@/components/QuickSearchModal';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Register Service Worker for PWA & Offline Support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[NTHU Hub] Service Worker registered successfully with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[NTHU Hub] Service Worker registration failed:', err);
          });
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>NTHU Hub - Unified Campus OS & API Platform</title>
        <meta
          name="description"
          content="Unified real-time NTHU campus dashboard: YouBike 2.0, Laundry MQTT, Bus schedules, Library space, Dining, Courses, Energy & API endpoints."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        <meta name="theme-color" content="#6366f1" />
        <meta name="application-name" content="NTHU Hub" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NTHU Hub" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body>
        <ThemeProvider>
          <FavoritesProvider>
            <div className="flex min-h-screen bg-theme-bg text-theme-text selection:bg-theme-primary selection:text-white">
              {/* Responsive Sidebar (Desktop sticky & Mobile off-canvas drawer) */}
              <Sidebar
                mobileOpen={mobileMenuOpen}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
                <Header
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onOpenMobileMenu={() => setMobileMenuOpen(true)}
                />
                <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
                  {children}
                </main>
              </div>

              {/* Mobile Quick 1-Thumb Bottom Navigation */}
              <MobileBottomNav
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenMobileMenu={() => setMobileMenuOpen(true)}
              />

              {/* PWA Floating Install Prompt */}
              <PwaInstallPrompt variant="banner" />

              {/* Ctrl+K Search Modal */}
              <QuickSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
              />
            </div>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
