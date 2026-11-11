'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  DollarSign,
  ArrowRight,
  Plus,
  Loader2,
  CheckCircle2,
  SlidersHorizontal,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardMetrics, ProductItem } from '@/lib/types';

// Fast in-memory SWR cache for instant dashboard transitions
let cachedDashboard: DashboardMetrics | null = null;

export default function DashboardPage() {
  const [data, setData] = useState<DashboardMetrics | null>(() => cachedDashboard);
  const [loading, setLoading] = useState(() => !cachedDashboard);
  const [seeding, setSeeding] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick adjust modal state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<string>('');
  const [adjustNote, setAdjustNote] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string>('');

  const fetchDashboardData = async (isBackground = false) => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        cachedDashboard = json;
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (cachedDashboard) {
      fetchDashboardData(true);
    } else {
      fetchDashboardData(false);
    }
  }, []);

  const handleSeedDemo = async () => {
    setSeeding(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message || 'Sample catalog loaded.' });
        await fetchDashboardData();
      } else {
        setFeedback({ type: 'error', message: json.error || 'Failed to load catalog.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error seeding catalog.' });
    } finally {
      setSeeding(false);
    }
  };

  const handleQuickAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setAdjustError('');
    setIsAdjusting(true);

    const delta = parseInt(adjustQty, 10);
    if (isNaN(delta) || delta === 0) {
      setAdjustError('Enter a valid non-zero adjustment (e.g. +5 or -2)');
      setIsAdjusting(false);
      return;
    }

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}/adjust-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment: delta, note: adjustNote }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Failed to adjust stock');
      }

      setSelectedProduct(null);
      setAdjustQty('');
      setAdjustNote('');
      await fetchDashboardData();
    } catch (err: any) {
      setAdjustError(err.message || 'Error adjusting stock');
    } finally {
      setIsAdjusting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2.5" />
        <p className="text-xs font-mono text-zinc-500">Calculating inventory metrics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalProducts: 0,
    totalQuantityOnHand: 0,
    totalLowStockItems: 0,
    totalInventoryValuation: 0,
  };

  const lowStock = data?.lowStockProducts || [];
  const org = data?.organization;
  const healthRatio = metrics.totalProducts > 0
    ? Math.round(((metrics.totalProducts - metrics.totalLowStockItems) / metrics.totalProducts) * 100)
    : 100;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-zinc-100 tracking-tight">Overview</h1>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50 truncate max-w-[160px] sm:max-w-none">
              {org?.name}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time stock levels, catalog metrics, and inventory alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {metrics.totalProducts === 0 && (
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition-colors disabled:opacity-50"
            >
              {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5 text-zinc-400" />}
              <span className="hidden xs:inline">Import</span> Demo
            </button>
          )}
          <Link
            href="/products/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New Product
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
              : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-[11px] underline ml-4 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards Grid (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total SKUs */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-zinc-400">Total Products</span>
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-100 tabular-nums">
              {metrics.totalProducts}
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">Active catalog SKUs</p>
          </div>
        </div>

        {/* Card 2: Units on Hand */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-zinc-400">Total Units</span>
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-100 tabular-nums">
              {metrics.totalQuantityOnHand}
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">
              {metrics.totalProducts > 0 ? Math.round(metrics.totalQuantityOnHand / metrics.totalProducts) : 0} avg / SKU
            </p>
          </div>
        </div>

        {/* Card 3: Low Stock Alerts */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-zinc-400">Low Stock</span>
            <div
              className={`w-2 h-2 rounded-full ${
                metrics.totalLowStockItems > 0 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
            />
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div
              className={`text-xl sm:text-2xl font-bold font-mono tracking-tight tabular-nums ${
                metrics.totalLowStockItems > 0 ? 'text-amber-400' : 'text-zinc-100'
              }`}
            >
              {metrics.totalLowStockItems}
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">
              {healthRatio}% catalog healthy
            </p>
          </div>
        </div>

        {/* Card 4: Inventory Valuation */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-zinc-400">Valuation</span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-100 tabular-nums truncate">
              ${metrics.totalInventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">Gross retail value</p>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Section */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-tight">
                Attention Required: Low Stock Items
              </h2>
              {lowStock.length > 0 && (
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {lowStock.length}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              Items with quantity on hand &le; threshold (Default: {org?.defaultLowStockThreshold} units).
            </p>
          </div>

          <Link
            href="/products?filter=low-stock"
            className="text-xs text-zinc-400 hover:text-zinc-100 inline-flex items-center gap-1 transition-colors shrink-0"
          >
            <span className="hidden sm:inline">All products</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lowStock.length === 0 ? (
          <div className="py-12 text-center px-4">
            <div className="w-9 h-9 rounded-full bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 mx-auto mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs font-medium text-zinc-200">Zero active inventory alerts</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              All catalog products meet or exceed configured stock thresholds.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-800/30 text-zinc-400 uppercase tracking-wider text-[10px] font-mono border-b border-zinc-800/80">
                  <tr>
                    <th className="py-2.5 px-5">Product Name</th>
                    <th className="py-2.5 px-5">SKU</th>
                    <th className="py-2.5 px-5 text-right">On Hand</th>
                    <th className="py-2.5 px-5 text-right">Threshold</th>
                    <th className="py-2.5 px-5 text-center">Status</th>
                    <th className="py-2.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {lowStock.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-5 font-medium text-zinc-100">
                        <Link
                          href={`/products/${item.id}`}
                          className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
                        >
                          <span>{item.name}</span>
                          <ArrowUpRight className="w-3 h-3 text-zinc-500 opacity-60" />
                        </Link>
                      </td>

                      <td className="py-3 px-5 font-mono text-[11px] text-zinc-400">
                        <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700/40">
                          {item.sku}
                        </span>
                      </td>

                      <td className="py-3 px-5 text-right font-mono font-semibold tabular-nums text-zinc-100">
                        {item.quantityOnHand}
                      </td>

                      <td className="py-3 px-5 text-right font-mono text-zinc-400 tabular-nums">
                        {item.lowStockThreshold !== null
                          ? item.lowStockThreshold
                          : `${item.effectiveThreshold} (default)`}
                      </td>

                      <td className="py-3 px-5 text-center">
                        {item.quantityOnHand === 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Low Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-5 text-right">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setAdjustQty('+10');
                            setAdjustNote('Restock order');
                            setAdjustError('');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] font-medium transition-colors"
                        >
                          <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
                          Adjust
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (No horizontal scrolling!) */}
            <div className="md:hidden divide-y divide-zinc-800/80">
              {lowStock.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.id}`}
                        className="font-medium text-xs text-zinc-100 hover:text-zinc-300 inline-flex items-center gap-1"
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700/60 text-zinc-400">
                          {item.sku}
                        </span>
                        {item.quantityOnHand === 0 ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Out of stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Low stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-sm text-zinc-100">
                        {item.quantityOnHand} <span className="text-[10px] text-zinc-500 font-normal">units</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Limit: {item.lowStockThreshold ?? item.effectiveThreshold}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        setSelectedProduct(item);
                        setAdjustQty('+10');
                        setAdjustNote('Restock order');
                        setAdjustError('');
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-zinc-400" /> Adjust Stock Units
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Adjust Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-zinc-100">
              Adjust Stock: {selectedProduct.name}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">
              SKU: <span className="text-zinc-200">{selectedProduct.sku}</span> · Current:{' '}
              <span className="text-zinc-100 font-bold">{selectedProduct.quantityOnHand} units</span>
            </p>

            {adjustError && (
              <div className="mt-3 p-2.5 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleQuickAdjust} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Adjustment Delta (+/- units)
                </label>
                <input
                  type="text"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="e.g. +10 or -3"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 font-mono text-sm sm:text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="e.g. Restock shipment, damaged return"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm sm:text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  {isAdjusting ? 'Saving...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
