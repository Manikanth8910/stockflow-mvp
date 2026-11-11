'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Layers,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  TrendingDown,
  Plus,
  Sparkles,
  Loader2,
  CheckCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { DashboardMetrics, ProductItem } from '@/lib/types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');

  // Quick adjust stock modal state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<string>('');
  const [adjustNote, setAdjustNote] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string>('');

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeedDemo = async () => {
    setSeeding(true);
    setSeedSuccess('');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        setSeedSuccess(json.message || 'Sample products loaded!');
        await fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
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
      setAdjustError('Please enter a non-zero adjustment (e.g. +5 or -2)');
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
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-sm">Fetching organization metrics...</p>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time stock summary for <span className="text-emerald-400 font-medium">{org?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {metrics.totalProducts === 0 && (
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {seeding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
              Load Demo Products
            </button>
          )}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {seedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{seedSuccess}</span>
          </div>
          <button
            onClick={() => setSeedSuccess('')}
            className="text-xs text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">{metrics.totalProducts}</div>
            <p className="text-xs text-slate-400 mt-1">Unique SKUs cataloged</p>
          </div>
        </div>

        {/* Card 2: Total Quantity on Hand */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Stock Units
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">{metrics.totalQuantityOnHand}</div>
            <p className="text-xs text-slate-400 mt-1">Sum of Quantity on Hand</p>
          </div>
        </div>

        {/* Card 3: Low Stock Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Low Stock Items
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                metrics.totalLowStockItems > 0
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div
              className={`text-3xl font-extrabold ${
                metrics.totalLowStockItems > 0 ? 'text-amber-400' : 'text-white'
              }`}
            >
              {metrics.totalLowStockItems}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              At or below low threshold
            </p>
          </div>
        </div>

        {/* Card 4: Inventory Valuation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">
              ${metrics.totalInventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">Estimated selling value</p>
          </div>
        </div>
      </div>

      {/* Low Stock Items Section (FR-6) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Low Stock Items
              </h2>
              <p className="text-xs text-slate-400">
                Products where Quantity on Hand &le; Low Stock Threshold (Org Default:{' '}
                <span className="text-white font-medium">{org?.defaultLowStockThreshold}</span>)
              </p>
            </div>
          </div>
          <Link
            href="/products?filter=low-stock"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 transition-colors"
          >
            View in Products table <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lowStock.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">All Stock Levels Healthy</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No products are currently at or below their low stock threshold.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">SKU</th>
                  <th className="py-3 px-5 text-center">Quantity on Hand</th>
                  <th className="py-3 px-5 text-center">Low Stock Threshold</th>
                  <th className="py-3 px-5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {lowStock.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {item.quantityOnHand === 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            OUT OF STOCK
                          </span>
                        )}
                        <span>{item.name}</span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-emerald-400">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.quantityOnHand === 0
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.quantityOnHand} units
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono text-xs text-slate-400">
                      {item.lowStockThreshold !== null
                        ? item.lowStockThreshold
                        : `${item.effectiveThreshold} (org default)`}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setAdjustQty('+10');
                          setAdjustNote('Restock low inventory');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              Adjust Stock: {selectedProduct.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              SKU: <span className="text-emerald-400">{selectedProduct.sku}</span> | Current Stock:{' '}
              <span className="text-white font-bold">{selectedProduct.quantityOnHand}</span>
            </p>

            {adjustError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleQuickAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Stock Change (+/- N Units)
                </label>
                <input
                  type="text"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="e.g. +10 or -5"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Prefix with + to add stock, or - to deduct. Resulting quantity cannot be negative.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Adjustment Note (Optional)
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="e.g. Supplier delivery, damage write-off"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {isAdjusting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
