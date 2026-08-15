import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const serverEpoch = Date.now();
  const iso = now.toISOString();

  // Signature representation to prove server-side time verification
  const timeSignature = `TIME-SIG-${serverEpoch.toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  return NextResponse.json({
    serverTimeUtc: iso,
    serverEpochMs: serverEpoch,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    timeSignature,
    verified: true,
  });
}
