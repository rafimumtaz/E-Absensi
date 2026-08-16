"use server";

import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { AttendanceRecord, Employee, WorkLocation } from '../types';

export async function createAttendanceRecord(record: AttendanceRecord) {
  try {
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
        serverTimestamp: new Date(),
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
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create attendance record:', error);
    return { success: false, error: 'Failed to create record' };
  }
}

export async function enrollEmployeeFace(employeeId: string, photoUrl: string) {
  try {
    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        faceEnrolled: true,
        enrolledPhotoUrl: photoUrl,
        enrolledAt: new Date(),
        biometricConfidence: 98.7, // As per mock data logic
      },
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to enroll face:', error);
    return { success: false, error: 'Failed to enroll face' };
  }
}

export async function addWorkLocationAction(location: WorkLocation) {
  try {
    await prisma.workLocation.create({
      data: {
        id: location.id,
        name: location.name,
        code: location.code,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        radiusMeters: location.radiusMeters,
        isApprovedRemote: location.isApprovedRemote ?? false,
        color: location.color,
      },
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add location:', error);
    return { success: false, error: 'Failed to add location' };
  }
}

export async function updateWorkLocationAction(location: WorkLocation) {
  try {
    await prisma.workLocation.update({
      where: { id: location.id },
      data: {
        name: location.name,
        code: location.code,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        radiusMeters: location.radiusMeters,
        isApprovedRemote: location.isApprovedRemote ?? false,
        color: location.color,
      },
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update location:', error);
    return { success: false, error: 'Failed to update location' };
  }
}

export async function deleteWorkLocationAction(id: string) {
  try {
    await prisma.workLocation.delete({
      where: { id },
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete location:', error);
    return { success: false, error: 'Failed to delete location' };
  }
}

export async function addEmployeeAction(employee: Employee) {
  try {
    await prisma.employee.create({
      data: {
        id: employee.id,
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        avatar: employee.avatar,
        phone: employee.phone,
        shiftId: employee.shiftId,
        assignedLocationId: employee.assignedLocationId,
        faceEnrolled: employee.faceEnrolled,
        enrolledPhotoUrl: employee.enrolledPhotoUrl,
        enrolledAt: employee.enrolledAt ? new Date(employee.enrolledAt) : null,
        biometricConfidence: employee.biometricConfidence,
        status: employee.status,
      },
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add employee:', error);
    return { success: false, error: 'Failed to add employee' };
  }
}
