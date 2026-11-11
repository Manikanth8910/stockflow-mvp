'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Layers,
  LayoutGrid,
  Package,
  Settings as SettingsIcon,
  LogOut,
  Building2,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { SessionUser } from '@/lib/types';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2.5" />
        <p className="text-zinc-500 text-xs font-mono tracking-tight">Loading workspace...</p>
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'SF';

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row text-zinc-100 antialiased selection:bg-zinc-800">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900/60 border-r border-zinc-800/80 shrink-0 select-none backdrop-blur-xl">
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-zinc-800/60">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-sm group-hover:bg-white transition-colors">
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">StockFlow</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-700/40">
                v0.1
              </span>
            </div>
          </Link>
        </div>

        {/* Tenant Organization Indicator */}
        <div className="p-3 border-b border-zinc-800/60">
          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/40 border border-zinc-700/40 hover:bg-zinc-800/70 transition-colors cursor-default">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded bg-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-zinc-200 truncate leading-tight">
                  {user?.organizationName || 'Default Org'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[10px] font-mono text-zinc-400">Production</span>
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === '/products' && pathname.startsWith('/products'));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Sign Out */}
        <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/40">
          <div className="flex items-center justify-between p-1.5 rounded-lg">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-[11px] font-mono font-medium text-zinc-300 shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-zinc-200 truncate leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-zinc-500 truncate font-mono mt-0.5">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Sign out"
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top App Bar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-zinc-950/90 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="font-semibold text-xs text-zinc-100 tracking-tight">StockFlow</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="truncate max-w-[100px]">{user?.organizationName}</span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Sign out"
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100"
          >
            {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Body with mobile bottom padding */}
      <main className="flex-1 min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-zinc-950 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation Bar (App-style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 border-t border-zinc-800/80 px-4 py-2 backdrop-blur-lg flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === '/products' && pathname.startsWith('/products'));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
