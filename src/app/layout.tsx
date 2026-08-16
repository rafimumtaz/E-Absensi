import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'E-Presence - Geometric Balanced Attendance Engine',
  description: 'Biometric Verification Terminal for E-Absensi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
