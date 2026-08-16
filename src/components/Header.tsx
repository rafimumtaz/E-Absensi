import React from 'react';
import { Employee } from '../types';
import {
  ShieldCheck,
  ScanFace,
  ClipboardList,
  Settings,
  LogOut,
  Fingerprint,
} from 'lucide-react';
import { logout } from '../app/actions/auth';

interface HeaderProps {
  activeView: 'TERMINAL' | 'HISTORY' | 'ADMIN';
  setActiveView: (view: 'TERMINAL' | 'HISTORY' | 'ADMIN') => void;
  sessionUser: Employee;
  onOpenEnrollment: (employee: Employee) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  sessionUser,
  onOpenEnrollment,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e4e2d7] text-[#13201a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Geometric Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#13201a]">
                E-<span className="text-[#6b6e68]">PRESENCE</span>
              </span>
              {sessionUser.role === 'admin' && (
                <span className="text-[10px] font-mono font-bold bg-[#f0eee4] text-[#13201a] px-2 py-0.5 rounded-md border border-[#e4e2d7] uppercase tracking-wide">
                  ADMIN
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Geometric Balanced Pill */}
        <nav className="flex items-center gap-1.5 bg-[#f3f2eb]/90 p-1.5 rounded-2xl border border-[#e4e2d7]">
          <button
            onClick={() => setActiveView('TERMINAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeView === 'TERMINAL'
                ? 'bg-[#13201a] text-white shadow-md shadow-[#13201a]/20'
                : 'text-[#4b4e48] hover:text-[#13201a] hover:bg-white/80'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span className="hidden sm:inline">Terminal</span>
          </button>

          <button
            onClick={() => setActiveView('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeView === 'HISTORY'
                ? 'bg-[#13201a] text-white shadow-md shadow-[#13201a]/20'
                : 'text-[#4b4e48] hover:text-[#13201a] hover:bg-white/80'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Audit Trail
          </button>

          {sessionUser.role === 'admin' && (
            <button
              onClick={() => setActiveView('ADMIN')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'ADMIN'
                  ? 'bg-[#13201a] text-white shadow-md shadow-[#13201a]/20'
                  : 'text-[#4b4e48] hover:text-[#13201a] hover:bg-white/80'
              }`}
            >
              <Settings className="w-4 h-4" />
              Management
            </button>
          )}
        </nav>

        {/* Current Employee Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white hover:bg-[#fafaf8] border border-[#e4e2d7] rounded-2xl pl-2 pr-4 py-1.5 shadow-sm transition-colors cursor-default">
            <img
              src={sessionUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
              alt={sessionUser.name}
              className="w-7 h-7 rounded-full object-cover border border-[#e4e2d7] shadow-sm"
            />
            <span className="text-xs font-bold text-[#2b2e28]">
              {sessionUser.name}
            </span>
          </div>

          {!sessionUser.faceEnrolled && (
            <button
              onClick={() => onOpenEnrollment(sessionUser)}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm animate-pulse"
              title="Click to register facial biometric template"
            >
              <Fingerprint className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Enroll Face</span>
            </button>
          )}
          
          <button
            onClick={async () => { await logout() }}
            className="p-2 rounded-xl bg-[#f3f2eb] hover:bg-red-50 hover:text-red-600 text-[#6b6e68] transition-colors shadow-sm"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
