import React from 'react';
import { AttendanceRecord } from '../types';
import { CheckCircle2, ShieldCheck, MapPin, Clock, Camera, Download, X, Copy, Check, FileCheck } from 'lucide-react';

interface VerificationReceiptModalProps {
  record: AttendanceRecord | null;
  onClose: () => void;
}

export const VerificationReceiptModal: React.FC<VerificationReceiptModalProps> = ({
  record,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!record) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(record.verificationHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isPositive = record.status === 'ON_TIME' || record.status === 'VERIFIED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 text-slate-900">
        {/* Header Ribbon */}
        <div className={`px-6 py-4.5 flex items-center justify-between border-b ${isPositive ? 'bg-emerald-50/70 border-emerald-100 text-emerald-900' : 'bg-amber-50/70 border-amber-100 text-amber-900'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide text-slate-900">Biometric Attendance Verified</h3>
              <p className="text-xs text-slate-500">Cryptographically Signed & Timestamped Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Employee & Punch Status Banner */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-mono text-blue-600 font-bold">{record.employeeCode}</span>
              <h4 className="text-lg font-bold text-slate-900">{record.employeeName}</h4>
              <p className="text-xs text-slate-500 font-medium">{record.department} • {record.shiftName}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                record.status === 'ON_TIME' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                record.status === 'LATE' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {record.status.replace('_', ' ')}
              </span>
              <p className="text-xs font-mono text-slate-700 mt-1.5 font-bold">
                {record.punchType.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Biometric Verification Visuals */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                Facial Biometric & Liveness Verification
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">
                Match: {record.biometric.matchScore.toFixed(1)}% | Liveness: {record.biometric.livenessScore.toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Captured Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] group shadow-inner">
                <img
                  src={record.biometric.snapshotUrl}
                  alt="Biometric Live Snapshot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-emerald-500/40 pointer-events-none rounded-2xl" />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-white px-2 py-0.5 rounded-md font-medium">
                  Live Snapshot Frame
                </span>
              </div>

              {/* Biometric Analysis Matrix */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between text-xs space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">Liveness Assessment</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${record.biometric.livenessScore}%` }}
                      />
                    </div>
                    <span className="font-mono text-emerald-700 text-xs font-bold">
                      {record.biometric.livenessScore}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-700 border-t border-slate-200 pt-2 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Anti-Spoof Check:</span>
                    <span className="text-emerald-700 font-bold">Passed (3D Depth)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confidence:</span>
                    <span className="text-blue-700 font-bold">{record.biometric.confidenceLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Authentication:</span>
                    <span className="text-slate-800 font-medium">Gemini Biometric AI</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
              "{record.biometric.auditNotes}"
            </p>
          </div>

          {/* Time & Geolocation Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Timestamp Box */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Timestamp</span>
              </div>
              <p className="text-base font-bold font-mono text-slate-900">
                {record.timeFormatted}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {record.dateFormatted}
              </p>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                <ShieldCheck className="w-3 h-3" />
                Server-Synced Anti-Tamper Clock
              </div>
            </div>

            {/* Geofence Box */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Geofence Verification</span>
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">
                {record.location.workLocationName}
              </p>
              <p className="text-[11px] font-mono text-slate-500 font-medium">
                {record.location.latitude.toFixed(4)}°, {record.location.longitude.toFixed(4)}°
              </p>
              <div className="text-[10px] flex items-center justify-between pt-1">
                <span className={record.location.isWithinGeofence ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                  {record.location.isWithinGeofence ? '● Inside Perimeter' : '▲ Outside Perimeter'}
                </span>
                <span className="font-mono text-slate-500">Dist: {record.location.distanceMeters}m</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Verification Seal */}
          <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Cryptographic Verification Hash Seal
              </span>
              <span className="text-xs font-mono text-blue-700 font-semibold block truncate">
                {record.verificationHash}
              </span>
            </div>
            <button
              onClick={copyHash}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 border border-slate-200 shadow-xs"
              title="Copy verification hash"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
            Audit ID: {record.id}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Slip
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
