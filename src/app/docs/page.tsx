'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, CheckCircle2, Copy, Sparkles } from 'lucide-react';

const API_ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/v1/youbike',
    title: 'YouBike 2.0 Live Stations',
    description: 'Fetch real-time YouBike 2.0 station bike & empty dock availability around NTHU campus.',
    sampleQuery: '',
  },
  {
    method: 'GET',
    path: '/api/v1/washers',
    title: 'Laundry Machine Statuses',
    description: 'Fetch WipePay MQTT machine listings, active cycle statuses, and countdown timers.',
    sampleQuery: '?dorm=義齋',
  },
  {
    method: 'GET',
    path: '/api/v1/buses',
    title: 'Shuttle Bus Timetables',
    description: 'Fetch NTHU campus shuttle bus routes, departure schedules, and stops.',
    sampleQuery: '?bus_type=main&direction=up',
  },
  {
    method: 'GET',
    path: '/api/v1/courses',
    title: 'Search NTHU Courses',
    description: 'Search NTHU curriculum database by course title, teacher, or course code.',
    sampleQuery: '?q=微積分&limit=5',
  },
  {
    method: 'GET',
    path: '/api/v1/library',
    title: 'Library Space & Hours',
    description: 'Fetch real-time seat availability, library status, and news RSS feeds.',
    sampleQuery: '',
  },
  {
    method: 'GET',
    path: '/api/v1/dining',
    title: 'Food & Dining Directory',
    description: 'Fetch campus restaurants, food vendors, and building locations.',
    sampleQuery: '?search=全家',
  },
  {
    method: 'GET',
    path: '/api/v1/announcements',
    title: 'Department Announcements',
    description: 'Fetch aggregated official department news bulletins and announcements.',
    sampleQuery: '?limit=5',
  },
  {
    method: 'GET',
    path: '/api/v1/energy',
    title: 'Realtime Campus Power Usage',
    description: 'Fetch campus electricity wattage consumption and grid load metrics.',
    sampleQuery: '',
  },
  {
    method: 'GET',
    path: '/api/v1/locations',
    title: 'Campus Map Locations',
    description: 'Search campus building codes, names, and facility details.',
    sampleQuery: '?q=台積館',
  },
];

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [queryInput, setQueryInput] = useState(API_ENDPOINTS[0].sampleQuery);
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelect = (ep: typeof API_ENDPOINTS[0]) => {
    setSelectedEndpoint(ep);
    setQueryInput(ep.sampleQuery);
    setResponseJson(null);
  };

  const handleRunTest = async () => {
    try {
      setLoading(true);
      const url = `${selectedEndpoint.path}${queryInput}`;
      const res = await fetch(url);
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResponseJson(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    const fullUrl = `${window.location.origin}${selectedEndpoint.path}${queryInput}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-primary/20 text-theme-primary border border-theme-primary/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Code className="w-3.5 h-3.5" />
            Vercel Serverless REST API Engine
          </div>
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight">
            Developer API Playground
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Test and integrate NTHU Hub’s unified REST API endpoints directly into your own apps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints Sidebar List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted px-2">
            API Endpoints ({API_ENDPOINTS.length})
          </h3>
          <div className="space-y-1.5">
            {API_ENDPOINTS.map((ep) => {
              const active = selectedEndpoint.path === ep.path;
              return (
                <button
                  key={ep.path}
                  onClick={() => handleSelect(ep)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                    active
                      ? 'bg-theme-primary/20 border-theme-primary text-theme-text shadow-glow font-bold'
                      : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-text hover:bg-theme-card-hover'
                  }`}
                >
                  <div className="space-y-0.5 truncate">
                    <span className="text-xs font-semibold text-theme-text truncate block">
                      {ep.title}
                    </span>
                    <span className="text-[11px] font-mono text-theme-muted truncate block">
                      {ep.path}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    GET
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Testing Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-theme-card border border-theme-border space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block mb-1">
                  GET
                </span>
                <h2 className="text-lg font-bold text-theme-text">{selectedEndpoint.title}</h2>
              </div>

              <button
                onClick={copyUrl}
                className="px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border hover:border-theme-primary text-xs font-semibold text-theme-muted hover:text-theme-text flex items-center gap-1.5 transition-all"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied URL!' : 'Copy Full URL'}</span>
              </button>
            </div>

            <p className="text-xs text-theme-muted">{selectedEndpoint.description}</p>

            {/* Request URL Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-muted">Request Path & Query Parameters</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-theme-bg border border-theme-border rounded-2xl px-4 py-2.5 font-mono text-xs text-theme-text flex items-center">
                  <span className="text-theme-primary font-bold">{selectedEndpoint.path}</span>
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="flex-1 bg-transparent text-theme-text focus:outline-none ml-0.5 font-mono"
                    placeholder="?query=..."
                  />
                </div>

                <button
                  onClick={handleRunTest}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Execute Request</span>
                </button>
              </div>
            </div>

            {/* Response Viewer */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-theme-muted">
                <span className="font-semibold">JSON Response Payload</span>
                {responseJson && <span className="text-emerald-400 font-bold">200 OK</span>}
              </div>

              <div className="bg-theme-bg border border-theme-border rounded-2xl p-4 font-mono text-xs max-h-96 overflow-auto text-emerald-300">
                {loading ? (
                  <span className="text-theme-muted animate-pulse">Executing GET request...</span>
                ) : responseJson ? (
                  <pre>{responseJson}</pre>
                ) : (
                  <span className="text-theme-muted">Click 'Execute Request' to test live endpoint response.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
