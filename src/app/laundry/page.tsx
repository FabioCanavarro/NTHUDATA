'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WashingMachine, RefreshCw, Radio, ArrowLeft, ExternalLink } from 'lucide-react';
import { StarButton } from '@/components/StarButton';
import mqtt from 'mqtt';

interface MachineItem {
  mac: string;
  macShort: string;
  dorm: string;
  area: string;
  gender: string;
  type: string;
  number: number;
  displayName: string;
  statusBadge: '運轉' | '空機' | '待取' | '待按啟動';
  statusText: string;
  wipepayUrl: string;
  brokerEndpoint: string;
  mqttTopic: string;
}

interface DormSummary {
  name: string;
  pinyin: string;
  fastestWasherText: string;
  fastestDryerText: string;
  washerStatusColor: string;
  dryerStatusColor: string;
  totalWashers: number;
  totalDryers: number;
  freeWashers: number;
  freeDryers: number;
  washers: MachineItem[];
  dryers: MachineItem[];
  machines: MachineItem[];
}

interface LiveMachineState {
  rawStatus: number;
  timeLeft: number; // in seconds
  lastUpdated: number;
}

export default function LaundryPage() {
  const [dorms, setDorms] = useState<DormSummary[]>([]);
  const [selectedDormFilter, setSelectedDormFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedDormModal, setSelectedDormModal] = useState<DormSummary | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Live real-time MQTT state per machine MAC
  const [liveStates, setLiveStates] = useState<Record<string, LiveMachineState>>({});

  const clientRef = useRef<mqtt.MqttClient | null>(null);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/washers');
      if (res.ok) {
        const data = await res.json();
        setDorms(data.dormSummaries || []);
      }
    } catch (e) {
      console.error('Failed to load washers data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // Connect to live WipePay MQTT Broker in browser
  useEffect(() => {
    let client: mqtt.MqttClient | null = null;
    try {
      client = mqtt.connect('wss://wipepay.com.tw:443/mqtt/', {
        connectTimeout: 5000,
        reconnectPeriod: 3000,
      });

      clientRef.current = client;

      client.on('connect', () => {
        setIsConnected(true);
        client?.subscribe('machine/+/status/#');
      });

      client.on('message', (topic, message) => {
        try {
          const parts = topic.split('/');
          const mac = parts[1];
          if (!mac) return;
          const payload = JSON.parse(message.toString());
          if (payload.type === 'status' && typeof payload.status === 'number') {
            const rawStatus = payload.status;
            const main = rawStatus >= 256 ? rawStatus >> 8 : rawStatus;
            let seconds = 0;

            if (main === 8 && typeof payload.timeLeft === 'number') {
              const ts = payload.ts ? payload.ts : Date.now() / 1000;
              const elapsed = Math.max(0, Date.now() / 1000 - ts);
              seconds = Math.max(0, Math.floor(payload.timeLeft - elapsed));
            }

            setLiveStates((prev) => ({
              ...prev,
              [mac]: {
                rawStatus,
                timeLeft: seconds,
                lastUpdated: Date.now(),
              },
            }));
          }
        } catch (err) {
          // ignore malformed mqtt payloads
        }
      });

      client.on('offline', () => setIsConnected(false));
      client.on('error', () => setIsConnected(false));
    } catch (err) {
      console.error('MQTT Connection Error:', err);
    }

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  // 1-second countdown interval for live ticking seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStates((prev) => {
        let changed = false;
        const nextState = { ...prev };
        for (const mac in nextState) {
          const st = nextState[mac];
          const main = st.rawStatus >= 256 ? st.rawStatus >> 8 : st.rawStatus;
          if (main === 8 && st.timeLeft > 0) {
            nextState[mac] = {
              ...st,
              timeLeft: st.timeLeft - 1,
            };
            changed = true;
          }
        }
        return changed ? nextState : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getMachineDisplay = (m: MachineItem) => {
    const live = liveStates[m.mac];
    if (!live) {
      return {
        badge: m.statusBadge,
        text: m.statusText,
        color:
          m.statusBadge === '運轉'
            ? 'text-amber-400'
            : m.statusBadge === '空機'
            ? 'text-emerald-400'
            : m.statusBadge === '待按啟動'
            ? 'text-rose-400'
            : 'text-cyan-400',
      };
    }

    const main = live.rawStatus >= 256 ? live.rawStatus >> 8 : live.rawStatus;
    if (main === 0 || main === 1) {
      return { badge: '空機' as const, text: '空機', color: 'text-emerald-400' };
    }
    if (main === 12) {
      return { badge: '待取' as const, text: '待取', color: 'text-cyan-400' };
    }
    if (main === 4 || main === 5) {
      return { badge: '待按啟動' as const, text: '待按啟動', color: 'text-rose-400' };
    }
    if (main === 8) {
      if (live.timeLeft <= 0) {
        return { badge: '待取' as const, text: '待取', color: 'text-cyan-400' };
      }
      const mins = Math.floor(live.timeLeft / 60);
      const secs = live.timeLeft % 60;
      return {
        badge: '運轉' as const,
        text: `${mins}分${secs.toString().padStart(2, '0')}秒`,
        color: 'text-amber-400',
      };
    }
    return { badge: '空機' as const, text: '空機', color: 'text-emerald-400' };
  };

  const filteredDorms = dorms.filter((d) => {
    if (selectedDormFilter === 'ALL') return true;
    return d.name.includes(selectedDormFilter) || d.pinyin.toLowerCase().includes(selectedDormFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            WipePay Live MQTT • Real-Time Second Counter
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            NTHU Laundry Availability & Live WipePay Ticker
          </h1>
          <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'
              } inline-block`}
            />
            {isConnected ? 'Connected Live to WipePay WebSocket Broker' : 'Connecting to WipePay WebSocket...'} • 16 Dormitories Monitor
          </p>
        </div>

        <button
          onClick={fetchMachines}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-theme-card border border-theme-border hover:border-emerald-500/50 text-emerald-400 flex items-center gap-2 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Machines
        </button>
      </div>

      {/* Dorm Filter Pills with PINYIN ONLY */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
        <button
          onClick={() => setSelectedDormFilter('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all ${
            selectedDormFilter === 'ALL'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-glow'
              : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
          }`}
        >
          All Dorms ({dorms.length})
        </button>
        {dorms.map((d) => (
          <button
            key={d.name}
            onClick={() => setSelectedDormFilter(d.name)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
              selectedDormFilter === d.name
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-glow'
                : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text'
            }`}
          >
            {d.pinyin}
          </button>
        ))}
      </div>

      {/* 16 Dorm Grid Overview */}
      {loading && dorms.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm text-theme-muted">Connecting to WipePay WebSocket broker...</p>
        </div>
      ) : filteredDorms.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted">
          No dormitory matches your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDorms.map((dorm) => (
            <motion.div
              key={dorm.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedDormModal(dorm)}
              className="p-5 rounded-3xl bg-theme-card border border-theme-border hover:border-emerald-500/50 transition-all space-y-4 relative group shadow-sm cursor-pointer hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Dorm Title & Star Button - PINYIN ONLY Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold text-theme-text group-hover:text-emerald-400 transition-colors">
                      {dorm.pinyin}
                    </h3>
                    <p className="text-[11px] text-indigo-400 font-semibold">
                      {dorm.name} • {dorm.totalWashers} Washers, {dorm.totalDryers} Dryers
                    </p>
                  </div>
                  <StarButton
                    id={`dorm:${dorm.name}`}
                    type="washer"
                    title={`${dorm.pinyin} (${dorm.name})`}
                    subtitle={`Washer: ${dorm.fastestWasherText}, Dryer: ${dorm.fastestDryerText}`}
                    data={dorm}
                  />
                </div>

                {/* Sub-panel displaying fastest washing and drying time */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-theme-bg/80 border border-theme-border/60">
                  {/* Washing Machine Status */}
                  <div className="space-y-1 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-theme-muted uppercase">
                      <span>🧺 Washing</span>
                    </div>
                    <p className={`text-base font-black ${dorm.washerStatusColor}`}>
                      {dorm.fastestWasherText}
                    </p>
                  </div>

                  {/* Dryer Status */}
                  <div className="space-y-1 text-center border-l border-theme-border/60">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-theme-muted uppercase">
                      <span>💨 Dryer</span>
                    </div>
                    <p className={`text-base font-black ${dorm.dryerStatusColor}`}>
                      {dorm.fastestDryerText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Console Details Button Footer */}
              <div className="pt-2 text-center border-t border-theme-border/40">
                <span className="text-[11px] font-bold text-theme-muted group-hover:text-emerald-400 transition-colors flex items-center justify-center gap-1">
                  <WashingMachine className="w-3.5 h-3.5" /> 即時監控看板 ↗
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Real-time Monitor Modal (Matching marskung.github.io reference UI) */}
      <AnimatePresence>
        {selectedDormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="w-full max-w-4xl bg-[#171e2e] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-slate-100"
            >
              {/* Modal Top Header Bar */}
              <div className="px-5 py-4 bg-[#111724] border-b border-slate-700/50 flex items-center justify-between">
                <button
                  onClick={() => setSelectedDormModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-600/60 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> 回看板
                </button>

                <h2 className="text-base font-extrabold text-slate-100 tracking-wide flex items-center gap-2">
                  <span>{selectedDormModal.name} ({selectedDormModal.pinyin}) 即時監控</span>
                </h2>

                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isConnected ? '已連線伺服器 (Live WebSocket)' : '連線中...'}</span>
                </div>
              </div>

              {/* Main Dorm Body */}
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-100">{selectedDormModal.name} ({selectedDormModal.pinyin})</h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Broker: wss://wipepay.com.tw:443/mqtt/
                  </div>
                </div>

                {/* 2-Column Split Layout for Washers vs Dryers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: 洗衣機 (Washers) */}
                  <div className="p-5 rounded-2xl bg-[#111724]/90 border border-slate-800/80 space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
                      <span>洗衣機 ({selectedDormModal.washers.length})</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedDormModal.washers.map((m) => {
                        const info = getMachineDisplay(m);
                        return (
                          <div
                            key={m.mac}
                            className="p-4 rounded-xl bg-[#1a2334] border border-slate-700/60 flex flex-col justify-between space-y-3 relative group hover:border-emerald-500/50 transition-all shadow-sm"
                          >
                            {/* Card Top: Name & Status Badge */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-extrabold text-slate-100">{m.displayName}</span>
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                                  info.badge === '運轉'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                    : info.badge === '空機'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : info.badge === '待按啟動'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                }`}
                              >
                                {info.badge}
                              </span>
                            </div>

                            {/* Card Center: Time text with MM分SS秒 */}
                            <div className="text-center py-2">
                              <p className={`text-xl font-black font-mono tracking-tight ${info.color}`}>
                                {info.text}
                              </p>
                            </div>

                            {/* Card Bottom: MAC short code & WipePay Redirect Link */}
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/40">
                              <span className="font-mono text-slate-400 text-[11px]">{m.macShort}</span>
                              <a
                                href={m.wipepayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 font-bold transition-colors text-[11px]"
                              >
                                操作 <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: 烘衣機 (Dryers) */}
                  <div className="p-5 rounded-2xl bg-[#111724]/90 border border-slate-800/80 space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
                      <span>烘衣機 ({selectedDormModal.dryers.length})</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedDormModal.dryers.map((m) => {
                        const info = getMachineDisplay(m);
                        return (
                          <div
                            key={m.mac}
                            className="p-4 rounded-xl bg-[#1a2334] border border-slate-700/60 flex flex-col justify-between space-y-3 relative group hover:border-emerald-500/50 transition-all shadow-sm"
                          >
                            {/* Card Top: Name & Status Badge */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-extrabold text-slate-100">{m.displayName}</span>
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                                  info.badge === '運轉'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                    : info.badge === '空機'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : info.badge === '待按啟動'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                }`}
                              >
                                {info.badge}
                              </span>
                            </div>

                            {/* Card Center: Time text with MM分SS秒 */}
                            <div className="text-center py-2">
                              <p className={`text-xl font-black font-mono tracking-tight ${info.color}`}>
                                {info.text}
                              </p>
                            </div>

                            {/* Card Bottom: MAC short code & WipePay Redirect Link */}
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/40">
                              <span className="font-mono text-slate-400 text-[11px]">{m.macShort}</span>
                              <a
                                href={m.wipepayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 font-bold transition-colors text-[11px]"
                              >
                                操作 <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
