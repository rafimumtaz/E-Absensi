"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react';
import { register } from '../actions/auth';
import { WorkLocation, WorkShift } from '../../types';

interface RegisterFormProps {
  locations: WorkLocation[];
  shifts: WorkShift[];
}

export default function RegisterForm({ locations, shifts }: RegisterFormProps) {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError('');
    startTransition(async () => {
      const res = await register(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#13201a] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#13201a] tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-[#6b6e68]">
          Join E-Presence Flow
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-[#f0eee4]">
          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3b3e38]">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="mt-1 appearance-none block w-full px-4 py-3 border border-[#d4d2c7] rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3b3e38]">Employee Code</label>
                <input
                  name="employeeCode"
                  type="text"
                  required
                  className="mt-1 appearance-none block w-full px-4 py-3 border border-[#d4d2c7] rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm"
                  placeholder="EMP-1001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3b3e38]">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 appearance-none block w-full px-4 py-3 border border-[#d4d2c7] rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3b3e38]">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="mt-1 appearance-none block w-full px-4 py-3 border border-[#d4d2c7] rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 pt-1 flex items-center text-[#6b6e68] hover:text-[#3b3e38] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3b3e38]">Department</label>
                <select
                  name="department"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white border border-[#d4d2c7] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3b3e38]">Role</label>
                <select
                  name="role"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white border border-[#d4d2c7] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3b3e38]">Assigned Location</label>
              <select
                name="assignedLocationId"
                required
                className="mt-1 block w-full px-4 py-3 bg-white border border-[#d4d2c7] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3b3e38]">Work Shift</label>
              <select
                name="shiftId"
                required
                className="mt-1 block w-full px-4 py-3 bg-white border border-[#d4d2c7] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm"
              >
                {shifts.map(shift => (
                  <option key={shift.id} value={shift.id}>{shift.name} ({shift.startTime} - {shift.endTime})</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all items-center gap-2"
              >
                {isPending ? 'Creating account...' : 'Register'}
                {!isPending && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#6b6e68]">Already have an account? </span>
            <Link href="/login" className="font-bold text-[#2a4536] hover:text-[#2a4536] transition-colors">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
