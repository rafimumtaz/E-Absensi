import React from 'react';
import { WorkLocation } from '../types';

interface GPSRadarMapProps {
  userLat: number | null;
  userLng: number | null;
  location: WorkLocation;
  distanceMeters: number;
  isWithin: boolean;
  accuracyMeters?: number;
}

export const GPSRadarMap: React.FC<GPSRadarMapProps> = ({
  userLat,
  userLng,
  location,
  distanceMeters,
  isWithin,
  accuracyMeters = 15,
}) => {
  // Calculate relative offset for radar rendering
  const maxViewDistance = Math.max(location.radiusMeters * 2, distanceMeters * 1.3, 400);
  const radarRadius = 85; // SVG coordinate center is (100, 100), radius 85

  // Calculate pixel position of user relative to center
  // If no GPS, put at center
  let userOffsetRatio = Math.min(1.1, distanceMeters / maxViewDistance);
  // Give an angle based on coordinates
  const angle = userLat && userLng
    ? Math.atan2(userLat - location.latitude, userLng - location.longitude)
    : 0;

  const userSvgX = 100 + Math.cos(angle) * (userOffsetRatio * radarRadius);
  const userSvgY = 100 + Math.sin(angle) * (userOffsetRatio * radarRadius);

  // Geofence radius in SVG units
  const geofenceSvgRadius = (location.radiusMeters / maxViewDistance) * radarRadius;

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isWithin ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isWithin ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Geofence Radar</span>
        </div>
        <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${isWithin ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
          {isWithin ? 'IN PERIMETER' : `${distanceMeters}m OUTSIDE`}
        </span>
      </div>

      <div className="relative w-52 h-52 flex items-center justify-center my-1">
        {/* SVG Radar */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Radar Background grid rings */}
          <circle cx="100" cy="100" r="85" fill="#0b1329" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#1e293b" strokeWidth="1" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="#1e293b" strokeWidth="1" />

          {/* Crosshairs */}
          <line x1="100" y1="15" x2="100" y2="185" stroke="#1e293b" strokeWidth="1" />
          <line x1="15" y1="100" x2="185" y2="100" stroke="#1e293b" strokeWidth="1" />

          {/* Geofence Perimeter Circle */}
          <circle
            cx="100"
            cy="100"
            r={Math.max(10, Math.min(80, geofenceSvgRadius))}
            fill={isWithin ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.1)'}
            stroke={isWithin ? '#10b981' : '#f59e0b'}
            strokeWidth="1.8"
            strokeDasharray={isWithin ? 'none' : '4 2'}
          />

          {/* Office Marker (Center) */}
          <circle cx="100" cy="100" r="5.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
          <text x="100" y="116" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
            HQ Center
          </text>

          {/* User Marker */}
          {userLat !== null && userLng !== null && (
            <g>
              {/* Accuracy pulse */}
              <circle
                cx={userSvgX}
                cy={userSvgY}
                r="10"
                fill={isWithin ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
                className="animate-pulse"
              />
              <circle
                cx={userSvgX}
                cy={userSvgY}
                r="4.5"
                fill={isWithin ? '#10b981' : '#ef4444'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Connecting line */}
              <line
                x1="100"
                y1="100"
                x2={userSvgX}
                y2={userSvgY}
                stroke={isWithin ? '#10b981' : '#ef4444'}
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.6"
              />
            </g>
          )}

          {/* Distance Text */}
          <text x="100" y="24" textAnchor="middle" fill="#64748b" fontSize="8">
            Perimeter: {location.radiusMeters}m
          </text>
        </svg>

        {/* Dynamic Sweep Line Animation */}
        <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden opacity-35">
          <div className="w-full h-full origin-center animate-spin bg-gradient-to-tr from-transparent via-blue-500/25 to-transparent" style={{ animationDuration: '3.5s' }} />
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 gap-2.5 w-full pt-3 mt-1 border-t border-slate-800 text-center">
        <div className="bg-slate-800/80 py-1.5 px-2 rounded-xl">
          <span className="text-[10px] text-slate-400 block font-medium">Distance to Site</span>
          <span className={`text-xs font-mono font-bold ${isWithin ? 'text-emerald-400' : 'text-amber-400'}`}>
            {distanceMeters} meters
          </span>
        </div>
        <div className="bg-slate-800/80 py-1.5 px-2 rounded-xl">
          <span className="text-[10px] text-slate-400 block font-medium">GPS Precision</span>
          <span className="text-xs font-mono font-bold text-blue-400">
            ±{Math.round(accuracyMeters)}m
          </span>
        </div>
      </div>
    </div>
  );
};
