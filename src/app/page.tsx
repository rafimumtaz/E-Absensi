import prisma from '../lib/prisma';
import { ClientApp } from './ClientApp';
import {
  INITIAL_LOCATIONS,
  INITIAL_SHIFTS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE_RECORDS,
} from '../data/mockData';

export const dynamic = 'force-dynamic';

async function seedDatabase() {
  console.log('Seeding database with initial data...');
  
  // Seed Locations
  for (const loc of INITIAL_LOCATIONS) {
    await prisma.workLocation.create({
      data: {
        id: loc.id,
        name: loc.name,
        code: loc.code,
        address: loc.address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        radiusMeters: loc.radiusMeters,
        isApprovedRemote: loc.isApprovedRemote ?? false,
        color: loc.color,
      },
    });
  }

  // Seed Shifts
  for (const shift of INITIAL_SHIFTS) {
    await prisma.workShift.create({
      data: {
        id: shift.id,
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        graceMinutes: shift.graceMinutes,
        breakDurationMinutes: shift.breakDurationMinutes,
        days: shift.days,
      },
    });
  }

  // Seed Employees
  for (const emp of INITIAL_EMPLOYEES) {
    await prisma.employee.create({
      data: {
        id: emp.id,
        employeeCode: emp.employeeCode,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        department: emp.department,
        avatar: emp.avatar,
        phone: emp.phone,
        shiftId: emp.shiftId,
        assignedLocationId: emp.assignedLocationId,
        faceEnrolled: emp.faceEnrolled,
        enrolledPhotoUrl: emp.enrolledPhotoUrl,
        enrolledAt: emp.enrolledAt ? new Date(emp.enrolledAt) : null,
        biometricConfidence: emp.biometricConfidence,
        status: emp.status,
      },
    });
  }

  // Seed Records
  for (const record of INITIAL_ATTENDANCE_RECORDS) {
    await prisma.attendanceRecord.create({
      data: {
        id: record.id,
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        employeeCode: record.employeeCode,
        department: record.department,
        shiftName: record.shiftName,
        punchType: record.punchType,
        timestamp: new Date(record.timestamp),
        serverTimestamp: new Date(record.serverTimestamp),
        timeVerified: record.timeVerified,
        timeFormatted: record.timeFormatted,
        dateFormatted: record.dateFormatted,
        location: record.location as any,
        biometric: record.biometric as any,
        status: record.status,
        verificationHash: record.verificationHash,
        deviceInfo: record.deviceInfo,
        notes: record.notes,
      },
    });
  }
}

export default async function Page() {
  let locationCount = await prisma.workLocation.count();
  
  if (locationCount === 0) {
    await seedDatabase();
  }

  // Fetch all data
  const dbLocations = await prisma.workLocation.findMany();
  const dbShifts = await prisma.workShift.findMany();
  const dbEmployees = await prisma.employee.findMany();
  const dbRecords = await prisma.attendanceRecord.findMany({
    orderBy: { timestamp: 'desc' },
  });

  // Map to frontend types
  const initialLocations = dbLocations.map(loc => ({
    ...loc,
    isApprovedRemote: loc.isApprovedRemote ?? undefined,
    color: loc.color ?? undefined,
  }));

  const initialShifts = dbShifts.map(shift => ({
    ...shift,
  }));

  const initialEmployees = dbEmployees.map(emp => ({
    ...emp,
    avatar: emp.avatar ?? '',
    phone: emp.phone ?? '',
    enrolledPhotoUrl: emp.enrolledPhotoUrl ?? undefined,
    enrolledAt: emp.enrolledAt ? emp.enrolledAt.toISOString() : undefined,
    biometricConfidence: emp.biometricConfidence ?? undefined,
  }));

  const initialRecords = dbRecords.map(record => ({
    ...record,
    timestamp: record.timestamp.toISOString(),
    serverTimestamp: record.serverTimestamp.toISOString(),
    notes: record.notes ?? undefined,
    location: record.location as any,
    biometric: record.biometric as any,
  }));

  return (
    <ClientApp 
      initialLocations={initialLocations as any}
      initialShifts={initialShifts as any}
      initialEmployees={initialEmployees as any}
      initialRecords={initialRecords as any}
    />
  );
}
