"use client";

import React, { useState, useEffect } from 'react';
import {
  AttendanceRecord,
  Employee,
  WorkLocation,
  WorkShift,
} from '../types';
import {
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_EMPLOYEES,
  INITIAL_LOCATIONS,
  INITIAL_SHIFTS,
} from '../data/mockData';
import { Header } from '../components/Header';
import { PunchTerminal } from '../components/PunchTerminal';
import { AttendanceHistory } from '../components/AttendanceHistory';
import { AdminDashboard } from '../components/AdminDashboard';
import { VerificationReceiptModal } from '../components/VerificationReceiptModal';
import { FaceEnrollmentModal } from '../components/FaceEnrollmentModal';

export default function App() {
  // Persistence state
  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bioclock_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    }
    return INITIAL_EMPLOYEES;
  });

  const [locations, setLocations] = useState<WorkLocation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bioclock_locations');
      return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
    }
    return INITIAL_LOCATIONS;
  });

  const [shifts, setShifts] = useState<WorkShift[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bioclock_shifts');
      return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
    }
    return INITIAL_SHIFTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bioclock_records');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
    }
    return INITIAL_ATTENDANCE_RECORDS;
  });

  // Active view state
  const [activeView, setActiveView] = useState<'TERMINAL' | 'HISTORY' | 'ADMIN'>('TERMINAL');

  // Selected Employee for active testing
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>(employees[0]?.id || 'emp_01');
  const currentEmployee = employees.find((e) => e.id === currentEmployeeId) || employees[0];

  // Modals state
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState<AttendanceRecord | null>(null);
  const [enrollmentEmployee, setEnrollmentEmployee] = useState<Employee | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bioclock_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('bioclock_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('bioclock_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('bioclock_records', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Handlers
  const handleAttendanceSuccess = (record: AttendanceRecord) => {
    setAttendanceRecords((prev) => [record, ...prev]);
    setSelectedReceiptRecord(record);
  };

  const handleOpenEnrollment = (emp: Employee) => {
    setEnrollmentEmployee(emp);
  };

  const handleEnrollmentComplete = (employeeId: string, photoUrl: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              faceEnrolled: true,
              enrolledPhotoUrl: photoUrl,
              enrolledAt: new Date().toISOString(),
              biometricConfidence: 98.7,
            }
          : emp
      )
    );
  };

  const handleAddLocation = (newLoc: WorkLocation) => {
    setLocations((prev) => [...prev, newLoc]);
  };

  const handleUpdateLocation = (updatedLoc: WorkLocation) => {
    setLocations((prev) => prev.map((l) => (l.id === updatedLoc.id ? updatedLoc : l)));
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [...prev, newEmp]);
    setCurrentEmployeeId(newEmp.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        employees={employees}
        currentEmployee={currentEmployee}
        onSelectEmployee={(emp) => setCurrentEmployeeId(emp.id)}
        onOpenEnrollment={handleOpenEnrollment}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'TERMINAL' && (
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
              locations={locations}
              shifts={shifts}
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
              records={attendanceRecords}
              employees={employees}
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
              locations={locations}
              shifts={shifts}
              employees={employees}
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
