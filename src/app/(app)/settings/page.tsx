'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  Shield,
  Layers,
} from 'lucide-react';

export default function SettingsPage() {
  const [orgId, setOrgId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [defaultThreshold, setDefaultThreshold] = useState<string>('5');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sample data seed state
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.organization) {
          setOrgId(data.organization.id || '');
          setOrgName(data.organization.name || '');
          setDefaultThreshold(data.organization.defaultLowStockThreshold?.toString() || '5');
        }
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    const parsedThreshold = parseInt(defaultThreshold, 10);
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      setErrorMessage('Threshold must be a non-negative integer (e.g. 5)');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName,
          defaultLowStockThreshold: parsedThreshold,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSuccessMessage('Organization policy settings saved successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedResult('');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSeedResult(data.message || 'Sample catalog populated.');
      } else {
        setSeedResult('Failed to populate sample data.');
      }
    } catch {
      setSeedResult('Network error populating sample data.');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2.5" />
        <p className="text-xs font-mono text-zinc-500">Loading organization configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Title Header */}
      <div className="pb-6 border-b border-zinc-800/80">
        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Organization Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure tenant profile details and global inventory threshold policies.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-[11px] underline ml-4 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-[11px] underline ml-4 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-800/80">
          <h2 className="text-sm font-semibold text-zinc-100">General Information</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Details identifying this tenant in the StockFlow cluster.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Tenant Identifier
              </label>
              <div className="px-3 py-2 bg-zinc-800/50 border border-zinc-700/60 rounded-lg text-xs text-zinc-400 font-mono flex items-center justify-between">
                <span className="truncate">{orgId}</span>
                <Shield className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-2" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/80">
            <div className="max-w-md">
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Default Low Stock Reorder Threshold
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  required
                  value={defaultThreshold}
                  onChange={(e) => setDefaultThreshold(e.target.value)}
                  className="w-32 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <span className="text-xs text-zinc-400">units</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                Applies to all products where an explicit per-item threshold has not been set. When quantity on hand drops to or below <span className="text-zinc-200 font-mono font-medium">{defaultThreshold || '5'}</span>, an alert will be triggered on the dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-zinc-800/80">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Developer & Evaluator Tools */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Evaluation Sandbox Catalog</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md">
              Populates realistic inventory items (electronics, hardware accessories, healthy and low-stock SKUs) scoped exclusively to your organization.
            </p>
          </div>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors disabled:opacity-50 shrink-0"
          >
            {seeding ? 'Populating...' : 'Seed Sample Catalog'}
          </button>
        </div>

        {seedResult && (
          <div className="mt-3.5 p-2.5 rounded bg-zinc-800/70 border border-zinc-700/60 text-xs text-zinc-300 font-mono">
            {seedResult}
          </div>
        )}
      </div>
    </div>
  );
}
