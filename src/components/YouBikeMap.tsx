'use client';

import React, { useEffect, useRef } from 'react';
import { getPinyinAndEnglish } from '@/utils/pinyin';

interface YouBikeStation {
  uid: string;
  name: string;
  englishName?: string;
  address: string;
  lat: number;
  lng: number;
  availableBikes: number;
  generalBikes?: number;
  electricBikes?: number;
  emptyDocks: number;
  isServicing: boolean;
  distance?: number;
}

interface YouBikeMapProps {
  stations: YouBikeStation[];
  userLat?: number | null;
  userLng?: number | null;
  selectedStationUid?: string | null;
  onSelectStation?: (uid: string) => void;
}

export default function YouBikeMap({
  stations,
  userLat,
  userLng,
  selectedStationUid,
  onSelectStation,
}: YouBikeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    // Dynamically inject Leaflet CSS and JS if not already loaded
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const centerLat = userLat || 24.7961;
        const centerLng = userLng || 120.9967;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 15,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      // Add user location marker if available
      if (userLat && userLng) {
        const userIcon = L.divIcon({
          className: 'user-location-pin',
          html: `<div class="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white shadow-lg animate-pulse flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-white"></div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup('📍 Your Current Location');
      }

      // Add station markers
      stations.forEach((st) => {
        if (!st.lat || !st.lng) return;

        const { original, pinyin, english } = getPinyinAndEnglish(st.name);
        const color = st.availableBikes > 5 ? '#10b981' : st.availableBikes > 0 ? '#f59e0b' : '#ef4444';
        const hasElectric = (st.electricBikes || 0) > 0;

        const customIcon = L.divIcon({
          className: 'custom-youbike-pin',
          html: `<div style="background-color: ${color}; color: white; border: 2px solid white;" 
                      class="px-2 py-1 rounded-full font-bold text-[11px] shadow-md flex items-center gap-1 hover:scale-110 transition-transform">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5.5 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M18.5 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M15 6h2l1.5 7h-7l-2.5-6h-3.5"/></svg>
                  <span>${st.availableBikes}</span>
                  ${hasElectric ? `<span style="background: #f59e0b; color: #78350f; padding: 0 4px; border-radius: 4px; font-size: 9px; font-weight: 900;">⚡${st.electricBikes}</span>` : ''}
                 </div>`,
          iconSize: [hasElectric ? 62 : 46, 26],
          iconAnchor: [hasElectric ? 31 : 23, 13],
        });

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 210px;">
            <div style="font-size: 14px; font-weight: 800; color: #1e293b;">${original}</div>
            <div style="font-size: 11px; font-weight: 600; color: #6366f1;">${pinyin}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${english}</div>
            
            <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 6px; font-size: 11px; font-weight: 700;">
              <div style="display: flex; justify-content: space-between; background: #ecfdf5; color: #059669; padding: 4px 8px; border-radius: 6px;">
                <span>🚴 YouBike 2.0 (一般單車)</span>
                <span>${st.generalBikes ?? st.availableBikes}</span>
              </div>
              <div style="display: flex; justify-content: space-between; background: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 6px;">
                <span>⚡ YouBike 2.0E (電輔車)</span>
                <span>${st.electricBikes ?? 0}</span>
              </div>
              <div style="display: flex; justify-content: space-between; background: #f3e8ff; color: #7e22ce; padding: 4px 8px; border-radius: 6px;">
                <span>🅿️ Empty Docks (可還空位)</span>
                <span>${st.emptyDocks}</span>
              </div>
            </div>
            ${st.distance ? `<div style="font-size: 10px; color: #0284c7; margin-top: 6px; text-align: right;">📍 ${(st.distance * 1000).toFixed(0)} meters away</div>` : ''}
          </div>
        `;

        const marker = L.marker([st.lat, st.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectStation) onSelectStation(st.uid);
        });

        markersRef.current[st.uid] = marker;
      });
    };

    if (typeof window !== 'undefined' && !(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [stations, userLat, userLng, selectedStationUid]);

  return (
    <div className="w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-3xl overflow-hidden border border-theme-border shadow-lg relative bg-theme-card">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}
