import React from 'react';
import { Employee } from '../types';
import {
  ShieldCheck,
  ScanFace,
  ClipboardList,
  Settings,
  ChevronDown,
  Sparkles,
  Fingerprint,
  Radio,
} from 'lucide-react';

interface HeaderProps {
  activeView: 'TERMINAL' | 'HISTORY' | 'ADMIN';
  setActiveView: (view: 'TERMINAL' | 'HISTORY' | 'ADMIN') => void;
  employees: Employee[];
  currentEmployee: Employee;
  onSelectEmployee: (employee: Employee) => void;
  onOpenEnrollment: (employee: Employee) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  employees,
  currentEmployee,
  onSelectEmployee,
  onOpenEnrollment,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Geometric Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <div className="w-5 h-5 border-2 border-white rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                BIOCLOCK<span className="text-blue-600">FLOW</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200 uppercase tracking-wide">
                ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Face Biometrics • GPS Geofence • Anti-Tamper Time
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Geometric Balanced Pill */}
        <nav className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveView('TERMINAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeView === 'TERMINAL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span className="hidden sm:inline">Biometric</span> Terminal
          </button>

          <button
            onClick={() => setActiveView('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeView === 'HISTORY'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Attendance Logs
          </button>

          <button
            onClick={() => setActiveView('ADMIN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeView === 'ADMIN'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Settings className="w-4 h-4" />
            Admin <span className="hidden md:inline">& Geofences</span>
          </button>
        </nav>

        {/* Current Employee Profile / Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select
              value={currentEmployee.id}
              onChange={(e) => {
                const found = employees.find((emp) => emp.id === e.target.value);
                if (found) onSelectEmployee(found);
              }}
              className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-9 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-600 cursor-pointer shadow-sm transition-colors"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeCode})
                </option>
              ))}
            </select>

            <img
              src={currentEmployee.avatar}
              alt={currentEmployee.name}
              className="w-7 h-7 rounded-full object-cover absolute left-2.5 top-1/2 -translate-y-1/2 border-2 border-white shadow-sm pointer-events-none"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {!currentEmployee.faceEnrolled && (
            <button
              onClick={() => onOpenEnrollment(currentEmployee)}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm animate-pulse"
              title="Click to register facial biometric template"
            >
              <Fingerprint className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Enroll Face</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
