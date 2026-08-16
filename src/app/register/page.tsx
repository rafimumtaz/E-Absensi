import React from 'react';
import prisma from '../../lib/prisma';
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
  const locations = await prisma.workLocation.findMany();
  const shifts = await prisma.workShift.findMany();

  return <RegisterForm locations={locations} shifts={shifts} />;
}
