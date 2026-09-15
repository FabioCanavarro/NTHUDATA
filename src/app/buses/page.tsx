'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, ArrowRight, Star } from 'lucide-react';
import { StarButton } from '@/components/StarButton';
import { getPinyinAndEnglish } from '@/utils/pinyin';

export default function BusesPage() {
  const [busType, setBusType] = useState<'main' | 'nanda'>('main');
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/buses?bus_type=${busType}&direction=${direction}`);
        if (res.ok) {
          const data = await res.json();
          setRouteData(data.route || null);
        }
      } catch (e) {
        console.error('Failed to load bus route', e);
      } finally {
        setLoading(false);
      }
    }
    loadBusData();
  }, [busType, direction]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Bus className="w-3.5 h-3.5" />
            NTHU Shuttle Bus Operations • 校園公車
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            Campus Shuttle Bus Timetables
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Main Campus loops & inter-campus shuttle lines (校本部與南大校區校園公車時刻表) with Pinyin & English bus stops.
          </p>
        </div>

        {routeData && (
          <StarButton
            id={`bus:${busType}-${direction}`}
            type="bus"
            title={routeData.name}
            subtitle={routeData.description}
            data={{ bus_type: busType, direction }}
          />
        )}
      </div>

      {/* Control Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-theme-card p-2 rounded-2xl border border-theme-border">
        {/* Bus Type Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBusType('main')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              busType === 'main'
                ? 'bg-purple-500 text-white shadow-glow'
                : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            🚌 校本部 Main Campus Loop
          </button>
          <button
            onClick={() => setBusType('nanda')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              busType === 'nanda'
                ? 'bg-purple-500 text-white shadow-glow'
                : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            🚐 南大校區 Nanda Shuttle
          </button>
        </div>

        {/* Direction Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection('up')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              direction === 'up'
                ? 'bg-theme-primary/20 text-theme-primary border-theme-primary/40'
                : 'bg-theme-bg border-theme-border text-theme-muted'
            }`}
          >
            {busType === 'main' ? '⬆️ 上山 (Upwards • Shàngshān)' : '➡️ 去程 (Outbound • Qùchéng)'}
          </button>
          <button
            onClick={() => setDirection('down')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              direction === 'down'
                ? 'bg-theme-primary/20 text-theme-primary border-theme-primary/40'
                : 'bg-theme-bg border-theme-border text-theme-muted'
            }`}
          >
            {busType === 'main' ? '⬇️ 下山 (Downwards • Xiàshān)' : '⬅️ 回程 (Inbound • Huíchéng)'}
          </button>
        </div>
      </div>

      {/* Route Diagram & Stops */}
      {loading ? (
        <div className="text-center py-16 text-theme-muted">Loading shuttle timetable...</div>
      ) : routeData ? (
        <div className="space-y-6">
          {/* Stops Line */}
          <div className="p-6 rounded-3xl bg-theme-card border border-theme-border space-y-4">
            <h3 className="text-base font-bold text-theme-text flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Route Stops ({routeData.stops.length} Stations)
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {routeData.stops.map((stop: string, idx: number) => {
                const stopInfo = getPinyinAndEnglish(stop);
                return (
                  <React.Fragment key={stop}>
                    <div className="px-3.5 py-2.5 rounded-2xl bg-theme-bg border border-theme-border text-xs font-semibold text-theme-text shrink-0 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold">{stopInfo.original}</span>
                      </div>
                      <span className="text-[10px] text-purple-300 font-semibold pl-7">
                        {stopInfo.pinyin} • {stopInfo.english}
                      </span>
                    </div>
                    {idx < routeData.stops.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-theme-muted shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Timetable Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekday Timetable */}
            <div className="p-6 rounded-3xl bg-theme-card border border-theme-border space-y-4">
              <h3 className="text-base font-bold text-theme-text flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Weekday Departure Times (平日時刻 • Píngrì Shíkè)
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {routeData.weekday_schedule.map((t: string) => (
                  <div
                    key={t}
                    className="p-2.5 rounded-xl bg-theme-bg/80 border border-theme-border text-center text-xs font-extrabold text-theme-text hover:border-purple-400/50 transition-colors"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Weekend Timetable */}
            <div className="p-6 rounded-3xl bg-theme-card border border-theme-border space-y-4">
              <h3 className="text-base font-bold text-theme-text flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Weekend Departure Times (假日時刻 • Jiàrì Shíkè)
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {routeData.weekend_schedule.map((t: string) => (
                  <div
                    key={t}
                    className="p-2.5 rounded-xl bg-theme-bg/80 border border-theme-border text-center text-xs font-extrabold text-theme-text hover:border-amber-400/50 transition-colors"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
