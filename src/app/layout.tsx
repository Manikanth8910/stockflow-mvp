import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StockFlow - SaaS Inventory Management System',
  description: 'Fast, minimal, multi-tenant inventory management system for modern sellers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
