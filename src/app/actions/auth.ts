"use server";

import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '../../lib/session';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const employee = await prisma.employee.findUnique({
    where: { email },
  });

  if (!employee || !employee.password) {
    return { success: false, error: 'Invalid email or password' };
  }

  const isPasswordValid = await bcrypt.compare(password, employee.password);

  if (!isPasswordValid) {
    return { success: false, error: 'Invalid email or password' };
  }

  await createSession(employee.id, employee.role);
  redirect('/');
}

export async function register(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const employeeCode = formData.get('employeeCode') as string;
  const role = formData.get('role') as string || 'employee';
  const department = formData.get('department') as string;
  const shiftId = formData.get('shiftId') as string;
  const assignedLocationId = formData.get('assignedLocationId') as string;

  if (!email || !password || !name || !employeeCode || !department || !shiftId || !assignedLocationId) {
    return { success: false, error: 'All fields are required' };
  }

  try {
    const existingEmployee = await prisma.employee.findFirst({
      where: { OR: [{ email }, { employeeCode }] },
    });

    if (existingEmployee) {
      return { success: false, error: 'Employee with this email or code already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        employeeCode,
        role,
        department,
        shiftId,
        assignedLocationId,
        status: 'active',
        faceEnrolled: false,
      },
    });

    await createSession(newEmployee.id, newEmployee.role);
  } catch (error) {
    console.error('Registration failed', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
  
  redirect('/');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
