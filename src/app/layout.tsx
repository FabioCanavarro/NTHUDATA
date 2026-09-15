'use client';

import React, { useState } from 'react';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { QuickSearchModal } from '@/components/QuickSearchModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>NTHU Hub - Unified Campus OS & API Platform</title>
        <meta
          name="description"
          content="Unified real-time NTHU campus dashboard: YouBike 2.0, Laundry MQTT, Bus schedules, Library space, Dining, Courses, Energy & API endpoints."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          <FavoritesProvider>
            <div className="flex min-h-screen bg-theme-bg text-theme-text selection:bg-theme-primary selection:text-white">
              {/* Sidebar */}
              <Sidebar />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0">
                <Header onOpenSearch={() => setIsSearchOpen(true)} />
                <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                  {children}
                </main>
              </div>

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
