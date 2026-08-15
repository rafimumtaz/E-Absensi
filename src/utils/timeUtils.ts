import { AttendanceStatus, PunchType, WorkShift } from '../types';

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Compares punch timestamp against shift start/end times and calculates punctuality status.
 */
export function evaluateShiftStatus(
  punchType: PunchType,
  punchDate: Date,
  shift: WorkShift,
  isWithinGeofence: boolean
): {
  status: AttendanceStatus;
  statusLabel: string;
  diffMinutes: number;
  notes: string;
} {
  if (!isWithinGeofence) {
    return {
      status: 'GEOFENCE_BREACH',
      statusLabel: 'Geofence Breach',
      diffMinutes: 0,
      notes: 'Punch recorded outside approved workplace radius',
    };
  }

  const [startHour, startMin] = shift.startTime.split(':').map(Number);
  const [endHour, endMin] = shift.endTime.split(':').map(Number);

  const punchHours = punchDate.getHours();
  const punchMinutes = punchDate.getMinutes();
  const punchTotalMinutes = punchHours * 60 + punchMinutes;

  const shiftStartTotalMinutes = startHour * 60 + startMin;
  const shiftEndTotalMinutes = endHour * 60 + endMin;

  if (punchType === 'CLOCK_IN') {
    const diff = punchTotalMinutes - shiftStartTotalMinutes;
    if (diff <= shift.graceMinutes) {
      return {
        status: 'ON_TIME',
        statusLabel: 'On Time',
        diffMinutes: diff,
        notes: diff > 0 ? `Within ${shift.graceMinutes}m grace period` : 'Prompt arrival',
      };
    } else {
      return {
        status: 'LATE',
        statusLabel: `Late (+${diff}m)`,
        diffMinutes: diff,
        notes: `Arrived ${diff} minutes past ${shift.startTime} shift start`,
      };
    }
  }

  if (punchType === 'CLOCK_OUT') {
    const diff = punchTotalMinutes - shiftEndTotalMinutes;
    if (diff < -15) {
      return {
        status: 'EARLY_DEPARTURE',
        statusLabel: `Early Departure (${Math.abs(diff)}m early)`,
        diffMinutes: diff,
        notes: `Left prior to ${shift.endTime} scheduled finish`,
      };
    } else {
      return {
        status: 'VERIFIED',
        statusLabel: 'Standard Checkout',
        diffMinutes: diff,
        notes: diff > 30 ? `Completed +${diff}m overtime` : 'Completed full shift',
      };
    }
  }

  return {
    status: 'VERIFIED',
    statusLabel: punchType === 'BREAK_START' ? 'Break Started' : 'Break Ended',
    diffMinutes: 0,
    notes: 'Standard activity log',
  };
}

/**
 * Creates a deterministic SHA-like hexadecimal verification seal
 */
export function generateVerificationHash(
  employeeId: string,
  timestamp: string,
  lat: number,
  lng: number,
  matchScore: number
): string {
  const seed = `${employeeId}-${timestamp}-${lat.toFixed(5)}-${lng.toFixed(5)}-${matchScore}-BIOSEAL`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hex2 = Math.abs((hash * 31) | 0).toString(16).padStart(8, '0');
  const hex3 = Math.abs((hash * 67) | 0).toString(16).padStart(8, '0');
  const hex4 = Math.abs((hash * 97) | 0).toString(16).padStart(8, '0');
  return `BIO-${hex1.toUpperCase()}-${hex2.toUpperCase()}-${hex3.toUpperCase()}-${hex4.toUpperCase()}`;
}
