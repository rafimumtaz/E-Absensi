import React, { useState } from 'react';
import { Employee, WorkLocation, WorkShift } from '../types';
import {
  Building,
  Users,
  Clock,
  Shield,
  Plus,
  MapPin,
  Fingerprint,
  CheckCircle2,
  Sliders,
  Trash2,
  Edit2,
  Save,
  X,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  locations: WorkLocation[];
  shifts: WorkShift[];
  employees: Employee[];
  onAddLocation: (location: WorkLocation) => void;
  onUpdateLocation: (location: WorkLocation) => void;
  onDeleteLocation: (id: string) => void;
  onAddEmployee: (employee: Employee) => void;
  onUpdateEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onOpenEnrollment: (employee: Employee) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  locations,
  shifts,
  employees,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onOpenEnrollment,
}) => {
  const [activeTab, setActiveTab] = useState<'LOCATIONS' | 'EMPLOYEES' | 'SHIFTS'>('LOCATIONS');

  // New Location Form State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocCode, setNewLocCode] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocLat, setNewLocLat] = useState('37.4220');
  const [newLocLng, setNewLocLng] = useState('-122.0840');
  const [newLocRadius, setNewLocRadius] = useState('200');
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);

  // New Employee Form State
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Engineering');
  const [newEmpShift, setNewEmpShift] = useState(shifts[0]?.id || 'shift_morning');
  const [newEmpLocation, setNewEmpLocation] = useState(locations[0]?.id || 'loc_hq');
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName) return;

    if (editingLocationId) {
      const existingLoc = locations.find((l) => l.id === editingLocationId);
      if (!existingLoc) return;
      const updatedLoc: WorkLocation = {
        ...existingLoc,
        name: newLocName,
        code: newLocCode,
        address: newLocAddress,
        latitude: parseFloat(newLocLat) || 37.422,
        longitude: parseFloat(newLocLng) || -122.084,
        radiusMeters: parseInt(newLocRadius, 10) || 200,
      };
      onUpdateLocation(updatedLoc);
    } else {
      const newLoc: WorkLocation = {
        id: `loc_${Date.now()}`,
        name: newLocName,
        code: newLocCode || 'SITE-' + Math.floor(100 + Math.random() * 900),
        address: newLocAddress || 'Configured workplace perimeter',
        latitude: parseFloat(newLocLat) || 37.422,
        longitude: parseFloat(newLocLng) || -122.084,
        radiusMeters: parseInt(newLocRadius, 10) || 200,
        color: '#3b82f6',
      };
      onAddLocation(newLoc);
    }

    setShowLocationModal(false);
    setEditingLocationId(null);
    setNewLocName('');
    setNewLocCode('');
    setNewLocAddress('');
  };

  const openEditLocation = (loc: WorkLocation) => {
    setEditingLocationId(loc.id);
    setNewLocName(loc.name);
    setNewLocCode(loc.code);
    setNewLocAddress(loc.address);
    setNewLocLat(loc.latitude.toString());
    setNewLocLng(loc.longitude.toString());
    setNewLocRadius(loc.radiusMeters.toString());
    setShowLocationModal(true);
  };

  const openNewLocation = () => {
    setEditingLocationId(null);
    setNewLocName('');
    setNewLocCode('');
    setNewLocAddress('');
    setNewLocLat('37.4220');
    setNewLocLng('-122.0840');
    setNewLocRadius('200');
    setShowLocationModal(true);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName) return;

    if (editingEmployeeId) {
      const existingEmp = employees.find(e => e.id === editingEmployeeId);
      if (!existingEmp) return;
      
      const updatedEmp: Employee = {
        ...existingEmp,
        name: newEmpName,
        email: newEmpEmail,
        role: newEmpRole,
        department: newEmpDept,
        shiftId: newEmpShift,
        assignedLocationId: newEmpLocation,
      };
      
      onUpdateEmployee(updatedEmp);
    } else {
      const newEmp: Employee = {
        id: `emp_${Date.now()}`,
        employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: newEmpName,
        email: newEmpEmail || `${newEmpName.toLowerCase().replace(/\s+/g, '.')}@bioclock.io`,
        role: newEmpRole || 'Team Member',
        department: newEmpDept,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
        phone: '+1 (415) 555-0199',
        shiftId: newEmpShift,
        assignedLocationId: newEmpLocation,
        faceEnrolled: false,
        status: 'active',
      };

      onAddEmployee(newEmp);
      // Prompt biometric enrollment for the newly created employee
      setTimeout(() => {
        onOpenEnrollment(newEmp);
      }, 300);
    }

    setShowEmployeeModal(false);
    setEditingEmployeeId(null);
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpRole('');
  };

  const openEditEmployee = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setNewEmpName(emp.name);
    setNewEmpEmail(emp.email);
    setNewEmpRole(emp.role);
    setNewEmpDept(emp.department);
    setNewEmpShift(emp.shiftId);
    setNewEmpLocation(emp.assignedLocationId);
    setShowEmployeeModal(true);
  };

  const openNewEmployee = () => {
    setEditingEmployeeId(null);
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpRole('');
    setShowEmployeeModal(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#13201a]">
      {/* Navigation Tabs - Geometric Balance Pill */}
      <div className="flex items-center justify-between border-b border-[#e4e2d7] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('LOCATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'LOCATIONS'
                ? 'bg-[#13201a] text-white shadow-md shadow-[#13201a]/20'
                : 'bg-white text-[#4b4e48] hover:text-[#13201a] border border-[#e4e2d7] hover:bg-[#fafaf8]'
            }`}
          >
            <Building className="w-4 h-4" />
            Geofence Workplace Sites ({locations.length})
          </button>

          <button
            onClick={() => setActiveTab('EMPLOYEES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'EMPLOYEES'
                ? 'bg-[#13201a] text-white shadow-md shadow-[#13201a]/20'
                : 'bg-white text-[#4b4e48] hover:text-[#13201a] border border-[#e4e2d7] hover:bg-[#fafaf8]'
            }`}
          >
            <Users className="w-4 h-4" />
            Staff & Biometrics ({employees.length})
          </button>

          <button
            onClick={() => setActiveTab('SHIFTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'SHIFTS'
                ? 'bg-[#13201a] text-white shadow-md shadow-[#13201a]/20'
                : 'bg-white text-[#4b4e48] hover:text-[#13201a] border border-[#e4e2d7] hover:bg-[#fafaf8]'
            }`}
          >
            <Clock className="w-4 h-4" />
            Shift Schedules & Policies ({shifts.length})
          </button>
        </div>
      </div>

      {/* TAB 1: GEOFENCE WORKPLACES */}
      {activeTab === 'LOCATIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#13201a]">Authorized Geofence Perimeters</h3>
              <p className="text-xs text-[#6b6e68]">
                Define geographic radii where employees can verify attendance via GPS beacon.
              </p>
            </div>
            <button
              onClick={openNewLocation}
              className="px-4 py-2 rounded-xl bg-[#13201a] hover:bg-[#13201a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-[#13201a]/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Geofence Site
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white border border-[#e4e2d7] rounded-2xl p-5 space-y-3 relative hover:border-[#2a4536] transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#13201a] bg-[#f0eee4] px-2 py-0.5 rounded-md border border-[#e4e2d7]">
                      {loc.code}
                    </span>
                    <h4 className="text-base font-bold text-[#13201a] mt-1">{loc.name}</h4>
                  </div>
                  {loc.id !== 'loc_hq' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditLocation(loc)}
                        className="text-[#8b8e88] hover:text-[#13201a] p-1 transition-colors"
                        title="Edit location"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteLocation(loc.id)}
                        className="text-[#8b8e88] hover:text-rose-600 p-1 transition-colors"
                        title="Delete location"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#6b6e68]">{loc.address}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0eee4] text-xs">
                  <div className="bg-[#fafaf8] p-2.5 rounded-xl border border-[#f0eee4]">
                    <span className="text-[10px] text-[#8b8e88] font-medium block">Radius Perimeter</span>
                    <span className="font-mono font-bold text-emerald-700">{loc.radiusMeters} meters</span>
                  </div>
                  <div className="bg-[#fafaf8] p-2.5 rounded-xl border border-[#f0eee4]">
                    <span className="text-[10px] text-[#8b8e88] font-medium block">GPS Coordinates</span>
                    <span className="font-mono text-[11px] text-[#3b3e38] font-medium">
                      {loc.latitude.toFixed(3)}°, {loc.longitude.toFixed(3)}°
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EMPLOYEES & BIOMETRICS */}
      {activeTab === 'EMPLOYEES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#13201a]">Employee Biometric Directory</h3>
              <p className="text-xs text-[#6b6e68]">
                Manage registered personnel and their facial biometric authentication templates.
              </p>
            </div>
            <button
              onClick={openNewEmployee}
              className="px-4 py-2 rounded-xl bg-[#13201a] hover:bg-[#13201a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-[#13201a]/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>

          <div className="bg-white border border-[#e4e2d7] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f3f2eb]/70 text-[#6b6e68] font-bold uppercase tracking-wider text-[11px] border-b border-[#e4e2d7]">
                  <tr>
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Department & Role</th>
                    <th className="py-3.5 px-4">Shift & Assigned Site</th>
                    <th className="py-3.5 px-4">Biometric Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => {
                    const loc = locations.find((l) => l.id === emp.assignedLocationId);
                    const shift = shifts.find((s) => s.id === emp.shiftId);

                    return (
                      <tr key={emp.id} className="hover:bg-[#f0eee4]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#e4e2d7]"
                            />
                            <div>
                              <span className="font-bold text-[#13201a] block">{emp.name}</span>
                              <span className="text-[10px] font-mono text-[#6b6e68] font-medium">{emp.employeeCode}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[#13201a] block font-semibold">{emp.role}</span>
                          <span className="text-[#6b6e68] text-[11px]">{emp.department}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[#13201a] block font-semibold">{loc?.name || 'Default Site'}</span>
                          <span className="text-[#6b6e68] text-[11px]">{shift?.name}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          {emp.faceEnrolled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Face Enrolled ({emp.biometricConfidence || 98}%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Pending Enrollment
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditEmployee(emp)}
                              className="p-1.5 rounded-xl bg-[#f3f2eb] hover:bg-[#e4e2d7] text-[#4b4e48] transition-colors"
                              title="Edit Employee"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteEmployee(emp.id)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete Employee"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onOpenEnrollment(emp)}
                              className="px-3 py-1.5 rounded-xl bg-[#f3f2eb] hover:bg-[#e4e2d7] text-[#13201a] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-[#e4e2d7]"
                            >
                              <Fingerprint className="w-3.5 h-3.5" />
                              {emp.faceEnrolled ? 'Update Face' : 'Enroll Face'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHIFTS */}
      {activeTab === 'SHIFTS' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#13201a]">Work Shift Policies</h3>
            <p className="text-xs text-[#6b6e68]">
              Shift timing configurations and allowable grace period before tardiness is flagged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shifts.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-[#e4e2d7] rounded-2xl p-5 space-y-3 shadow-sm hover:border-[#2a4536] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#13201a]">{s.name}</h4>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="p-3.5 bg-[#fafaf8] rounded-xl border border-[#f0eee4] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6b6e68]">Scheduled Hours:</span>
                    <span className="font-mono text-[#13201a] font-bold">{s.startTime} - {s.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b6e68]">Grace Period:</span>
                    <span className="font-mono text-[#2a4536] font-bold">+{s.graceMinutes} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b6e68]">Meal Break:</span>
                    <span className="text-[#3b3e38] font-medium">{s.breakDurationMinutes} mins allocated</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {s.days.map((d) => (
                    <span
                      key={d}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f3f2eb] text-[#4b4e48]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE LOCATION MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#e4e2d7] rounded-2xl shadow-2xl p-6 space-y-4 text-[#13201a]">
            <div className="flex items-center justify-between border-b border-[#e4e2d7] pb-3">
              <h3 className="text-base font-bold text-[#13201a]">{editingLocationId ? 'Edit Geofence Workplace' : 'Add Geofence Workplace'}</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-[#8b8e88] hover:text-[#3b3e38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#4b4e48] block mb-1 font-medium">Site / Office Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Bay R&D Center"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[#4b4e48] block mb-1 font-medium">Site Code</label>
                  <input
                    type="text"
                    placeholder="e.g. S-BAY-02"
                    value={newLocCode}
                    onChange={(e) => setNewLocCode(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[#4b4e48] block mb-1 font-medium">Geofence Radius (m)</label>
                  <input
                    type="number"
                    required
                    value={newLocRadius}
                    onChange={(e) => setNewLocRadius(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#4b4e48] block mb-1 font-medium">Address</label>
                <input
                  type="text"
                  placeholder="Street Address, City, State"
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                  className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[#4b4e48] block mb-1 font-medium">Latitude</label>
                  <input
                    type="text"
                    required
                    value={newLocLat}
                    onChange={(e) => setNewLocLat(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] font-mono focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[#4b4e48] block mb-1 font-medium">Longitude</label>
                  <input
                    type="text"
                    required
                    value={newLocLng}
                    onChange={(e) => setNewLocLng(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] font-mono focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3f2eb] text-[#3b3e38] hover:bg-[#e4e2d7] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#13201a] hover:bg-[#13201a] text-white text-xs font-bold shadow-md shadow-[#13201a]/20"
                >
                  {editingLocationId ? 'Save Changes' : 'Save Workplace Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EMPLOYEE MODAL */}
      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#e4e2d7] rounded-2xl shadow-2xl p-6 space-y-4 text-[#13201a]">
            <div className="flex items-center justify-between border-b border-[#e4e2d7] pb-3">
              <h3 className="text-base font-bold text-[#13201a]">{editingEmployeeId ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="text-[#8b8e88] hover:text-[#3b3e38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#4b4e48] block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[#4b4e48] block mb-1 font-medium">Work Email</label>
                  <input
                    type="email"
                    placeholder="jordan@bioclock.io"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[#4b4e48] block mb-1 font-medium">Department</label>
                  <select
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & UX">Product & UX</option>
                    <option value="People & Culture">People & Culture</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#4b4e48] block mb-1 font-medium">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Security Specialist"
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[#4b4e48] block mb-1 font-medium">Shift</label>
                  <select
                    value={newEmpShift}
                    onChange={(e) => setNewEmpShift(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#4b4e48] block mb-1 font-medium">Primary Workplace</label>
                  <select
                    value={newEmpLocation}
                    onChange={(e) => setNewEmpLocation(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e2d7] rounded-xl px-3.5 py-2 text-[#13201a] focus:outline-none focus:border-[#13201a] focus:bg-white shadow-xs"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3f2eb] text-[#3b3e38] hover:bg-[#e4e2d7] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#13201a] hover:bg-[#13201a] text-white text-xs font-bold shadow-md shadow-[#13201a]/20"
                >
                  {editingEmployeeId ? 'Save Changes' : 'Create & Enroll Face'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
