'use client';

import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Sliders,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Database,
} from 'lucide-react';

export default function SettingsPage() {
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

      setSuccessMessage('Organization settings successfully saved!');
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
        setSeedResult(data.message || 'Demo products successfully populated!');
      } else {
        setSeedResult('Failed to load demo data');
      }
    } catch {
      setSeedResult('An error occurred while loading demo data');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-sm">Loading organization settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure default inventory thresholds and organization preferences.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Settings Form (FR-7) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Stock Threshold Configuration</h2>
            <p className="text-xs text-slate-400">
              PRD FR-7: Global fallback value for products without an explicit threshold.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Organization Name
            </label>
            <div className="relative rounded-xl max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Default Low Stock Threshold (Units)
            </label>
            <div className="max-w-xs">
              <input
                type="number"
                min="0"
                required
                value={defaultThreshold}
                onChange={(e) => setDefaultThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              When a product does not specify its own threshold, StockFlow flags it as{' '}
              <span className="text-amber-400 font-semibold">Low Stock</span> whenever Quantity on
              Hand &le; <span className="font-mono text-white font-bold">{defaultThreshold || '5'}</span>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Developer / Demo Utilities Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Sample Data Loader</h2>
            <p className="text-xs text-slate-400">
              Quickly populate your organization with demo products (Electronics, Accessories, Hardware).
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Clicking this will insert realistic sample products (including healthy and low-stock SKUs)
            scoped strictly to your organization. Existing items will not be overwritten.
          </p>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
          >
            {seeding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            Populate Demo Catalog
          </button>
        </div>

        {seedResult && (
          <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-emerald-400">
            {seedResult}
          </div>
        )}
      </div>
    </div>
  );
}
