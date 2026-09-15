'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, Activity, ShieldCheck } from 'lucide-react';
import { StarButton } from '@/components/StarButton';

export default function EnergyPage() {
  const [energyData, setEnergyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchEnergy = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/energy');
      if (res.ok) {
        const data = await res.json();
        setEnergyData(data);
      }
    } catch (e) {
      console.error('Failed to load energy data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnergy();
    const interval = setInterval(fetchEnergy, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            NTHU Campus Power System (140.114.188.86)
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            Realtime Power & Electricity Usage
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Real-time wattage consumption & peak load monitoring across campus electrical sub-stations.
          </p>
        </div>

        <button
          onClick={fetchEnergy}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-theme-card border border-theme-border hover:border-amber-500/50 text-amber-400 flex items-center gap-2 text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Power Load
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-theme-muted">Fetching electricity metrics...</div>
      ) : energyData ? (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-theme-card border border-theme-border flex items-center justify-between text-xs text-theme-muted">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Source: {energyData.source}
            </span>
            <span>Updated: {new Date(energyData.timestamp).toLocaleTimeString()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {energyData.data?.map((item: any, idx: number) => {
              const kw = item.kw || 0;
              const ratio = item.peakRatio || 60;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-3xl bg-theme-card border border-theme-border space-y-4 shadow-sm hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {item.status || 'Active'}
                      </span>
                      <h3 className="text-base font-bold text-theme-text mt-1">{item.name}</h3>
                    </div>

                    <StarButton
                      id={`energy:${item.name}`}
                      type="module"
                      title={item.name}
                      subtitle={`${kw} kW load`}
                      data={item}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-theme-muted">Current Load</span>
                      <span className="text-2xl font-extrabold text-amber-400 font-mono">
                        {kw.toLocaleString()} <span className="text-xs font-normal text-theme-muted">kW</span>
                      </span>
                    </div>

                    {/* Peak load progress meter */}
                    <div className="w-full bg-theme-bg rounded-full h-3 overflow-hidden border border-theme-border">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 rounded-full transition-all duration-500"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-theme-muted font-medium">
                      <span>Grid Capacity Load</span>
                      <span>{ratio}% of peak</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
