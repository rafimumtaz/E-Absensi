"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import { login } from '../actions/auth';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError('');
    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#13201a] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-[#13201a] rounded-2xl flex items-center justify-center shadow-lg shadow-[#13201a]/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#13201a] tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-[#6b6e68]">
          E-Presence Access Terminal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-[#f0eee4]">
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#3b3e38]">Email address</label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-[#d4d2c7] rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3b3e38]">Password</label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-[#d4d2c7] rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#2a4536] sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#13201a] hover:bg-[#13201a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all items-center gap-2"
              >
                {isPending ? 'Authenticating...' : 'Sign In'}
                {!isPending && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#6b6e68]">Don't have an account? </span>
            <Link href="/register" className="font-bold text-[#2a4536] hover:text-[#2a4536] transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
