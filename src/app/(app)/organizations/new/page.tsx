'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Database,
  Layers,
} from 'lucide-react';
import { SessionUser } from '@/lib/types';

export default function NewOrganizationPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [orgName, setOrgName] = useState('');
  const [threshold, setThreshold] = useState('5');
  const [seedSample, setSeedSample] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoadingUser(false);
      })
      .catch(() => {
        router.push('/login?redirect=/organizations/new');
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = orgName.trim();
    if (trimmed.length < 2) {
      setError('Organization name must be at least 2 characters long.');
      return;
    }

    const parsedThreshold = parseInt(threshold, 10);
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      setError('Threshold must be a non-negative integer (e.g. 5).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Organization (Requires signed-in user)
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          defaultLowStockThreshold: parsedThreshold,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create organization.');
      }

      // 2. Optionally seed demo products
      if (seedSample) {
        try {
          await fetch('/api/seed', { method: 'POST' });
        } catch (seedErr) {
          console.warn('Optional seed failed, proceeding anyway:', seedErr);
        }
      }

      // 3. Navigate into newly created workspace dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating organization.');
      setIsSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2.5" />
        <p className="text-xs font-mono text-zinc-500">Checking authenticated session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Top Banner */}
      <div className="text-center sm:text-left pb-6 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 mb-3">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Signed in as: <strong className="text-zinc-200">{user?.email}</strong></span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          Create an Organization Workspace
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Every organization has an isolated inventory database, SKU namespace, and configurable reorder thresholds.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Organization Name <span className="text-zinc-500">*</span>
            </label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Apex Retail Goods, Horizon Logistics"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Your company, brand, or subsidiary name. Must be at least 2 characters.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Default Low Stock Reorder Threshold
            </label>
            <input
              type="number"
              min="0"
              required
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="5"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Products without a custom threshold will automatically trigger low-stock alerts at this level.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <input
                type="checkbox"
                checked={seedSample}
                onChange={(e) => setSeedSample(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-medium text-zinc-200 block">Pre-load sample inventory catalog</span>
                <span className="text-[11px] text-zinc-400">
                  Seeds 7 initial electronics and accessory items with varying stock levels for immediate testing.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            {user?.organizationId ? (
              <Link
                href="/dashboard"
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel and return
              </Link>
            ) : (
              <span className="text-[11px] text-zinc-500">Step 2 of 2: Workspace Setup</span>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Organization...</span>
                </>
              ) : (
                <>
                  <span>Create Organization & Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Multi-tenant note */}
      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/60 text-xs text-zinc-400 flex items-start gap-2.5">
        <Building2 className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed text-[11px]">
          <strong className="text-zinc-300">Database Tenant Scoping:</strong> Organization IDs are uniquely generated CUIDs. All queries and inventory modifications are strictly verified through your cryptographic session token.
        </div>
      </div>
    </div>
  );
}
