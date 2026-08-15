export interface WorkLocation {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isApprovedRemote?: boolean;
  color?: string;
}

export interface WorkShift {
  id: string;
  name: string;
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  graceMinutes: number; // 15
  breakDurationMinutes: number;
  days: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri"]
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  phone: string;
  shiftId: string;
  assignedLocationId: string;
  faceEnrolled: boolean;
  enrolledPhotoUrl?: string;
  enrolledAt?: string;
  biometricConfidence?: number;
  status: 'active' | 'on_leave' | 'inactive';
}

export interface BiometricVerificationResult {
  matchScore: number;          // 0 - 100
  isMatch: boolean;
  livenessScore: number;       // 0 - 100
  isLive: boolean;
  spoofCheckPassed: boolean;
  faceDetected: boolean;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'REJECTED';
  detectedAttributes?: {
    expression?: string;
    eyesOpen?: boolean;
    lightingQuality?: 'GOOD' | 'POOR' | 'MODERATE';
    glasses?: boolean;
    maskDetected?: boolean;
    headPoseAlignment?: 'CENTERED' | 'ANGLED' | 'OFF_CENTER';
  };
  auditNotes: string;
  antiSpoofSignals?: string[];
  rawAnalysis?: string;
}

export type PunchType = 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';

export type AttendanceStatus =
  | 'ON_TIME'
  | 'LATE'
  | 'EARLY_DEPARTURE'
  | 'GEOFENCE_BREACH'
  | 'FLAGGED_REVIEW'
  | 'VERIFIED';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  punchType: PunchType;
  timestamp: string; // ISO string
  serverTimestamp: string;
  timeVerified: boolean;
  timeFormatted: string;
  dateFormatted: string;
  shiftName: string;
  
  // Geolocation Verification
  location: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    address: string;
    workLocationId: string;
    workLocationName: string;
    distanceMeters: number;
    isWithinGeofence: boolean;
    overrideReason?: string;
  };

  // Biometric Verification
  biometric: {
    matchScore: number;
    isMatch: boolean;
    livenessScore: number;
    isLive: boolean;
    method: 'AI_FACIAL_BIOMETRIC';
    snapshotUrl: string;
    enrolledPhotoRef?: string;
    auditNotes: string;
    confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'REJECTED';
  };

  status: AttendanceStatus;
  verificationHash: string;
  deviceInfo: string;
  notes?: string;
}

export interface GeolocationPositionState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  loading: boolean;
}
