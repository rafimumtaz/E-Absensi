"use client";

import React, { useState, useTransition, useEffect } from 'react';
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
  updateEmployeeAction,
  deleteEmployeeAction,
} from './actions';

interface ClientAppProps {
  sessionUser: Employee;
  initialEmployees: Employee[];
  initialLocations: WorkLocation[];
  initialShifts: WorkShift[];
  initialRecords: AttendanceRecord[];
}

export function ClientApp({
  sessionUser,
  initialEmployees,
  initialLocations,
  initialShifts,
  initialRecords,
}: ClientAppProps) {
  const [isPending, startTransition] = useTransition();

  // Active view state
  const [activeView, setActiveView] = useState<'TERMINAL' | 'HISTORY' | 'ADMIN'>('TERMINAL');

  // Modals state
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState<AttendanceRecord | null>(null);
  const [enrollmentEmployee, setEnrollmentEmployee] = useState<Employee | null>(null);

  // Automatically open face enrollment if not enrolled
  useEffect(() => {
    if (!sessionUser.faceEnrolled) {
      setEnrollmentEmployee(sessionUser);
    }
  }, [sessionUser.faceEnrolled, sessionUser]);

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
    startTransition(async () => {
      await addEmployeeAction(newEmp);
    });
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    startTransition(async () => {
      await updateEmployeeAction(updatedEmp);
    });
  };

  const handleDeleteEmployee = (id: string) => {
    startTransition(async () => {
      await deleteEmployeeAction(id);
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#13201a] flex flex-col font-sans selection:bg-[#13201a] selection:text-white relative">
      {/* Loading Overlay for Server Actions */}
      {isPending && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#13201a] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-[#3b3e38]">Syncing to Database...</span>
          </div>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        sessionUser={sessionUser}
        onOpenEnrollment={handleOpenEnrollment}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'TERMINAL' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* View Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e4e2d7] pb-4">
              <div>
                <p className="text-xs font-bold text-[#8b8e88] uppercase tracking-widest mb-1">
                  ACTIVE STATION CHECKPOINT
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#13201a] flex items-center gap-2">
                  <span>Biometric Verification Terminal</span>
                </h1>
                <p className="text-sm text-[#6b6e68] mt-1">
                  Real-time facial geometry matching with cadastral geofence verification and timestamp certification.
                </p>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <span className="text-[#6b6e68] font-medium">Active Operator:</span>
                <span className="bg-white px-3.5 py-1.5 rounded-xl border border-[#e4e2d7] shadow-sm text-[#13201a] font-bold">
                  {sessionUser.name} • {sessionUser.department}
                </span>
              </div>
            </div>

            {/* Punch Terminal Main Component */}
            <PunchTerminal
              currentEmployee={sessionUser}
              locations={initialLocations}
              shifts={initialShifts}
              onAttendanceSuccess={handleAttendanceSuccess}
              onOpenEnrollment={handleOpenEnrollment}
            />
          </div>
        )}

        {activeView === 'HISTORY' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-[#e4e2d7] pb-4">
              <p className="text-xs font-bold text-[#8b8e88] uppercase tracking-widest mb-1">
                Cryptographic Audit Trail
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#13201a]">
                Audit Trail
              </h1>
              <p className="text-sm text-[#6b6e68] mt-1">
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

        {activeView === 'ADMIN' && sessionUser.role === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-[#e4e2d7] pb-4">
              <p className="text-xs font-bold text-[#8b8e88] uppercase tracking-widest mb-1">
                System Parameters & Sites
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#13201a]">
                Management
              </h1>
              <p className="text-sm text-[#6b6e68] mt-1">
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
              onUpdateEmployee={handleUpdateEmployee}
              onDeleteEmployee={handleDeleteEmployee}
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
      <footer className="border-t border-[#e4e2d7] bg-white py-5 text-center text-xs text-[#6b6e68] mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#13201a] rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 border border-white rounded-[1px]"></div>
            </div>
            <span className="font-semibold text-[#3b3e38]">CHRONOS.PRESENCE STATION v2.4</span>
          </div>
          <span className="font-mono text-xs text-[#6b6e68]">
            Face Biometrics & Cadastral Geofence Verification
          </span>
        </div>
      </footer>
    </div>
  );
}
