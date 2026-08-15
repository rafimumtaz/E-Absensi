import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, Employee } from '../types';
import {
  Search,
  Filter,
  Download,
  ShieldCheck,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ChevronRight,
  User,
} from 'lucide-react';

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  employees: Employee[];
  onSelectRecord: (record: AttendanceRecord) => void;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  records,
  employees,
  onSelectRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.verificationHash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || rec.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Calculate Metrics
  const total = records.length;
  const onTimeCount = records.filter((r) => r.status === 'ON_TIME' || r.status === 'VERIFIED').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const geofenceBreachCount = records.filter((r) => r.status === 'GEOFENCE_BREACH' || !r.location.isWithinGeofence).length;
  const punctualityRate = total > 0 ? Math.round((onTimeCount / total) * 100) : 100;
  const avgBiometricScore =
    total > 0
      ? (records.reduce((acc, r) => acc + r.biometric.matchScore, 0) / total).toFixed(1)
      : '98.5';

  const exportCsv = () => {
    const headers = [
      'Record ID',
      'Employee Code',
      'Employee Name',
      'Department',
      'Punch Type',
      'Date',
      'Time',
      'Status',
      'Biometric Match %',
      'Liveness %',
      'Work Location',
      'Geofence Compliant',
      'Distance (m)',
      'Verification Hash',
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.employeeCode,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.punchType,
      r.dateFormatted,
      r.timeFormatted,
      r.status,
      r.biometric.matchScore,
      r.biometric.livenessScore,
      `"${r.location.workLocationName}"`,
      r.location.isWithinGeofence ? 'YES' : 'NO',
      r.location.distanceMeters,
      r.verificationHash,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bioclock_attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-slate-900">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Records</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-light font-mono text-blue-600">{total}</span>
            <span className="text-xs text-slate-500 font-medium">punches</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-slate-900">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Punctuality Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-light font-mono text-emerald-600">{punctualityRate}%</span>
            <span className="text-xs text-slate-500 font-medium">on schedule</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-slate-900">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Avg Biometric Match</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-light font-mono text-slate-900">{avgBiometricScore}%</span>
            <span className="text-xs text-slate-500 font-medium">accuracy</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-slate-900">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Geofence Flagged</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-light font-mono ${geofenceBreachCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {geofenceBreachCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">exceptions</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
        {/* Filter Controls Bar */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50/70">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee, code, or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-xs transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600 shadow-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ON_TIME">On Time</option>
              <option value="LATE">Late Arrival</option>
              <option value="GEOFENCE_BREACH">Geofence Breach</option>
              <option value="VERIFIED">Verified Standard</option>
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600 shadow-xs"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Export CSV Button */}
            <button
              onClick={exportCsv}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-colors shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Action & Shift</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Biometric Verification</th>
                <th className="py-3.5 px-4">Geofence Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No attendance records found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  return (
                    <tr
                      key={record.id}
                      onClick={() => onSelectRecord(record)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Employee Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={record.biometric.snapshotUrl}
                            alt={record.employeeName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover:border-blue-500 transition-colors"
                          />
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                              {record.employeeName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-medium">
                              {record.employeeCode} • {record.department}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Punch Type */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {record.punchType.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">{record.shiftName}</span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-slate-900 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {record.timeFormatted}
                        </div>
                        <span className="text-[11px] text-slate-500">{record.dateFormatted}</span>
                      </td>

                      {/* Biometric Match */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${record.biometric.matchScore}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-emerald-700">
                            {record.biometric.matchScore.toFixed(1)}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Liveness: {record.biometric.livenessScore.toFixed(1)}% • 3D OK
                        </span>
                      </td>

                      {/* Location & Geofence */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-slate-800 truncate max-w-[180px]">
                          <MapPin className={`w-3.5 h-3.5 shrink-0 ${record.location.isWithinGeofence ? 'text-blue-600' : 'text-amber-600'}`} />
                          <span className="truncate">{record.location.workLocationName}</span>
                        </div>
                        <span className={`text-[10px] font-mono ${record.location.isWithinGeofence ? 'text-slate-500' : 'text-amber-700 font-bold'}`}>
                          {record.location.isWithinGeofence ? `In perimeter (${record.location.distanceMeters}m)` : `Outside (${record.location.distanceMeters}m)`}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          record.status === 'ON_TIME' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          record.status === 'LATE' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          record.status === 'GEOFENCE_BREACH' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {record.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-slate-400 group-hover:text-blue-600 font-mono text-[11px] font-medium inline-flex items-center gap-1">
                          View Slip
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
