"use client";

import React, { useState, useTransition } from 'react';
import {
  AttendanceRecord,
  Employee,
  WorkLocation,
  WorkShift,
} from '../types';
import { Header } from '../components/Header';
import { PunchTerminal } from '../components/PunchTerminal';
import { AttendanceHistory } from '../components/AttendanceHistory';
import { AdminDashboard } from '../components/AdminDashboard';
import { VerificationReceiptModal } from '../components/VerificationReceiptModal';
import { FaceEnrollmentModal } from '../components/FaceEnrollmentModal';
import {
  createAttendanceRecord,
  enrollEmployeeFace,
  addWorkLocationAction,
  updateWorkLocationAction,
  deleteWorkLocationAction,
  addEmployeeAction,
} from './actions';

interface ClientAppProps {
  initialEmployees: Employee[];
  initialLocations: WorkLocation[];
  initialShifts: WorkShift[];
  initialRecords: AttendanceRecord[];
}

export function ClientApp({
  initialEmployees,
  initialLocations,
  initialShifts,
  initialRecords,
}: ClientAppProps) {
  const [isPending, startTransition] = useTransition();

  // Active view state
  const [activeView, setActiveView] = useState<'TERMINAL' | 'HISTORY' | 'ADMIN'>('TERMINAL');

  // Selected Employee for active testing
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>(initialEmployees[0]?.id || '');
  const currentEmployee = initialEmployees.find((e) => e.id === currentEmployeeId) || initialEmployees[0];

  // Modals state
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState<AttendanceRecord | null>(null);
  const [enrollmentEmployee, setEnrollmentEmployee] = useState<Employee | null>(null);

  // Handlers
  const handleAttendanceSuccess = (record: AttendanceRecord) => {
    setSelectedReceiptRecord(record);
    startTransition(async () => {
      await createAttendanceRecord(record);
    });
  };

  const handleOpenEnrollment = (emp: Employee) => {
    setEnrollmentEmployee(emp);
  };

  const handleEnrollmentComplete = (employeeId: string, photoUrl: string) => {
    startTransition(async () => {
      await enrollEmployeeFace(employeeId, photoUrl);
    });
  };

  const handleAddLocation = (newLoc: WorkLocation) => {
    startTransition(async () => {
      await addWorkLocationAction(newLoc);
    });
  };

  const handleUpdateLocation = (updatedLoc: WorkLocation) => {
    startTransition(async () => {
      await updateWorkLocationAction(updatedLoc);
    });
  };

  const handleDeleteLocation = (id: string) => {
    startTransition(async () => {
      await deleteWorkLocationAction(id);
    });
  };

  const handleAddEmployee = (newEmp: Employee) => {
    setCurrentEmployeeId(newEmp.id);
    startTransition(async () => {
      await addEmployeeAction(newEmp);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Loading Overlay for Server Actions */}
      {isPending && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-slate-700">Syncing to Database...</span>
          </div>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        employees={initialEmployees}
        currentEmployee={currentEmployee}
        onSelectEmployee={(emp) => setCurrentEmployeeId(emp.id)}
        onOpenEnrollment={handleOpenEnrollment}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'TERMINAL' && currentEmployee && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* View Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Active Presence Station
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <span>Biometric Verification Terminal</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Position face within the reticle for 3D anti-spoof biometric authentication & GPS geofence stamping.
                </p>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <span className="text-slate-500 font-medium">Logged in Personnel:</span>
                <span className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm text-blue-700 font-bold">
                  {currentEmployee.name} • {currentEmployee.department}
                </span>
              </div>
            </div>

            {/* Punch Terminal Main Component */}
            <PunchTerminal
              currentEmployee={currentEmployee}
              locations={initialLocations}
              shifts={initialShifts}
              onAttendanceSuccess={handleAttendanceSuccess}
              onOpenEnrollment={handleOpenEnrollment}
            />
          </div>
        )}

        {activeView === 'HISTORY' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Cryptographic Audit Trail
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Attendance Audit & Digital Slips
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Cryptographically signed attendance records with biometric match confidence and GPS perimeter verification.
              </p>
            </div>

            <AttendanceHistory
              records={initialRecords}
              employees={initialEmployees}
              onSelectRecord={(rec) => setSelectedReceiptRecord(rec)}
            />
          </div>
        )}

        {activeView === 'ADMIN' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                System Parameters & Sites
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Workplace Geofences & Biometric Control Center
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Configure workplace geofence perimeters, register employee facial profiles, and set work shift policies.
              </p>
            </div>

            <AdminDashboard
              locations={initialLocations}
              shifts={initialShifts}
              employees={initialEmployees}
              onAddLocation={handleAddLocation}
              onUpdateLocation={handleUpdateLocation}
              onDeleteLocation={handleDeleteLocation}
              onAddEmployee={handleAddEmployee}
              onOpenEnrollment={handleOpenEnrollment}
            />
          </div>
        )}
      </main>

      {/* Verification Receipt Slip Modal */}
      <VerificationReceiptModal
        record={selectedReceiptRecord}
        onClose={() => setSelectedReceiptRecord(null)}
      />

      {/* Facial Biometric Enrollment Wizard Modal */}
      {enrollmentEmployee && (
        <FaceEnrollmentModal
          employee={enrollmentEmployee}
          isOpen={!!enrollmentEmployee}
          onClose={() => setEnrollmentEmployee(null)}
          onEnrollmentComplete={handleEnrollmentComplete}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 border border-white rounded-[1px]"></div>
            </div>
            <span className="font-semibold text-slate-700">BioClock Flow • Geometric Balanced Attendance Engine</span>
          </div>
          <span className="font-mono text-xs text-slate-500">
            SHA-256 Tamper Evident Verification • Gemini AI Biometrics
          </span>
        </div>
      </footer>
    </div>
  );
}
