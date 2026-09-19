'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, User, MapPin, Clock, Award, Star } from 'lucide-react';
import { StarButton } from '@/components/StarButton';
import { DataExporter } from '@/components/DataExporter';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('微積分');
  const [teacher, setTeacher] = useState('');
  const [code, setCode] = useState('');

  const searchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (teacher) params.set('teacher', teacher);
      if (code) params.set('code', code);
      params.set('limit', '40');

      const res = await fetch(`/api/v1/courses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (e) {
      console.error('Failed to search courses', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCourses();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            NTHU Curriculum Database Search
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-text tracking-tight">
            Course Search Engine
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">
            Search NTHU courses by Chinese/English title, course code (科號), professor name, or classroom.
          </p>
        </div>

        {courses.length > 0 && (
          <DataExporter
            data={courses.map((c) => ({
              code: c.id,
              title_zh: c.titleZh,
              title_en: c.titleEn,
              teacher: c.teacher,
              credits: c.credits,
              time_room: c.timeAndRoom,
            }))}
            filename="nthu_courses_export"
            title="Course Results"
          />
        )}
      </div>

      {/* Search Input Controls */}
      <div className="p-4 sm:p-6 rounded-3xl bg-theme-card border border-theme-border space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Course title (e.g. 微積分, AI)..."
              className="w-full bg-theme-bg border border-theme-border focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <User className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Professor (e.g. 黃, 張)..."
              className="w-full bg-theme-bg border border-theme-border focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
            />
          </div>

          <div className="relative sm:col-span-2 md:col-span-1">
            <BookOpen className="w-4 h-4 text-theme-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Course Code (e.g. MATH1010)..."
              className="w-full bg-theme-bg border border-theme-border focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={searchCourses}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-glow flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Searching...' : 'Search NTHU Courses'}</span>
        </button>
      </div>

      {/* Course Cards */}
      {loading ? (
        <div className="text-center py-16 text-theme-muted">Searching NTHU curriculum database...</div>
      ) : courses.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
          No courses match your query criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 sm:p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-indigo-500/40 transition-all space-y-3 relative group shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-theme-bg border border-theme-border text-indigo-400 inline-block mb-1">
                    {c.id}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-theme-text group-hover:text-indigo-400 transition-colors truncate">
                    {c.titleZh}
                  </h3>
                  {c.titleEn && (
                    <p className="text-xs text-theme-muted truncate">{c.titleEn}</p>
                  )}
                </div>

                <StarButton
                  id={`course:${c.id}`}
                  type="course"
                  title={c.titleZh}
                  subtitle={`${c.id} • ${c.teacher || 'N/A'}`}
                  data={c}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme-border/50 text-xs text-theme-muted">
                <div className="flex items-center gap-1.5 min-w-0">
                  <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{c.teacher || 'TBA'}</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{c.credits} Credits</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 min-w-0">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{c.timeAndRoom || 'Time/Room TBA'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
