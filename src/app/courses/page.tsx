'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

export default function CoursesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
      <div className="p-4 rounded-3xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
        <Sparkles className="w-10 h-10 animate-pulse mx-auto" />
      </div>

      <div className="space-y-3 max-w-lg">
        <h1 className="text-3xl font-black text-theme-text tracking-tight">
          Course Planning & Search
        </h1>
        <p className="text-lg font-bold text-indigo-400">
          "Just use nthu mod for planning and courses, peaks of peaks"
        </p>
        <p className="text-xs text-theme-muted">
          NTHUMOD is the ultimate community-built timetable planner, course review hub, and schedule builder for NTHU students.
        </p>
      </div>

      <a
        href="https://nthumod.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-4 rounded-2xl bg-indigo-500 text-white font-extrabold text-sm hover:bg-indigo-400 transition-all flex items-center gap-2.5 shadow-glow"
      >
        <span>Open NTHUMOD (nthumod.com)</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
