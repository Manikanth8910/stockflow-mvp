'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  X,
  Loader2,
  Database,
  ArrowUpRight,
} from 'lucide-react';
import { ProductItem } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [defaultThreshold, setDefaultThreshold] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low-stock' | 'in-stock'>('all');

  // Modals state
  const [adjustProduct, setAdjustProduct] = useState<ProductItem | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<ProductItem | null>(null);

  // Form states
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Adjust stock state
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustNote, setAdjustNote] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const json = await res.json();
        setProducts(json.products || []);
        setDefaultThreshold(json.defaultLowStockThreshold || 5);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProduct) return;
    setFormError('');
    setIsSubmitting(true);

    const delta = parseInt(adjustQty, 10);
    if (isNaN(delta) || delta === 0) {
      setFormError('Please enter a non-zero adjustment (e.g. +5 or -2)');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/products/${adjustProduct.id}/adjust-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment: delta, note: adjustNote }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to adjust stock');
      }

      setAdjustProduct(null);
      setAdjustQty('');
      setAdjustNote('');
      await fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Error adjusting stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${deleteProduct.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteProduct(null);
        await fetchProducts();
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeedDemo = async () => {
    setLoading(true);
    try {
      await fetch('/api/seed', { method: 'POST' });
      await fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side search and filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'low-stock') return p.isLowStock;
      if (statusFilter === 'in-stock') return !p.isLowStock;
      return true;
    });
  }, [products, searchTerm, statusFilter]);

  const lowStockCount = products.filter((p) => p.isLowStock).length;
  const healthyCount = products.filter((p) => !p.isLowStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-zinc-800/80">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-zinc-100 tracking-tight">Products</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Maintain item catalog, pricing, SKU codes, and reorder levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {products.length === 0 && !loading && (
            <button
              onClick={handleSeedDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden xs:inline">Import</span> Demo
            </button>
          )}
          <Link
            href="/products/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 sm:py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm sm:text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center overflow-x-auto p-0.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All <span className="font-mono text-[10px] ml-1 opacity-70">({products.length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('low-stock')}
            className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'low-stock'
                ? 'bg-zinc-800 text-amber-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Low Stock <span className="font-mono text-[10px] ml-1 opacity-70">({lowStockCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('in-stock')}
            className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'in-stock'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Healthy <span className="font-mono text-[10px] ml-1 opacity-70">({healthyCount})</span>
          </button>
        </div>
      </div>

      {/* Catalog Container */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-500 font-mono">Loading product records...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Package className="w-8 h-8 text-zinc-600 mx-auto mb-2.5" />
            <p className="text-xs font-medium text-zinc-300">No products matching filter</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {searchTerm ? `No results for "${searchTerm}"` : 'Your organization catalog is currently empty.'}
            </p>
            {!searchTerm && (
              <Link
                href="/products/new"
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Create First Product
              </Link>
            )}
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
                    <th className="py-2.5 px-5 text-center">Status</th>
                    <th className="py-2.5 px-5 text-right">Cost Price</th>
                    <th className="py-2.5 px-5 text-right">Selling Price</th>
                    <th className="py-2.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-5 font-medium text-zinc-100 max-w-xs">
                        <Link
                          href={`/products/${p.id}`}
                          className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1 font-medium"
                        >
                          <span>{p.name}</span>
                          <ArrowUpRight className="w-3 h-3 text-zinc-500 opacity-60" />
                        </Link>
                        {p.description && (
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-normal">
                            {p.description}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-5 font-mono text-[11px] text-zinc-400">
                        <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700/40">
                          {p.sku}
                        </span>
                      </td>

                      <td className="py-3 px-5 text-right font-mono font-semibold tabular-nums text-zinc-100">
                        {p.quantityOnHand}
                      </td>

                      <td className="py-3 px-5 text-center">
                        {p.isLowStock ? (
                          p.quantityOnHand === 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Out of Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Low Stock (≤{p.effectiveThreshold})
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Healthy
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-5 text-right font-mono tabular-nums text-zinc-400">
                        {p.costPrice !== null ? `$${p.costPrice.toFixed(2)}` : '—'}
                      </td>

                      <td className="py-3 px-5 text-right font-mono tabular-nums font-semibold text-zinc-200">
                        {p.sellingPrice !== null ? `$${p.sellingPrice.toFixed(2)}` : '—'}
                      </td>

                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAdjustProduct(p);
                              setAdjustQty('+1');
                              setAdjustNote('');
                              setFormError('');
                            }}
                            title="Adjust stock units"
                            className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                          </button>

                          <Link
                            href={`/products/${p.id}/edit`}
                            title="Edit product"
                            className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                          </Link>

                          <button
                            onClick={() => setDeleteProduct(p)}
                            title="Delete product"
                            className="p-1 rounded bg-zinc-800/80 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700/60 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-zinc-800/80">
              {filteredProducts.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${p.id}`}
                        className="font-medium text-xs text-zinc-100 hover:text-zinc-300 inline-flex items-center gap-1"
                      >
                        <span>{p.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700/60 text-zinc-400">
                          {p.sku}
                        </span>
                        {p.isLowStock ? (
                          p.quantityOnHand === 0 ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Out of stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Low stock
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Healthy
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-sm text-zinc-100">
                        {p.quantityOnHand} <span className="text-[10px] text-zinc-500 font-normal">units</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono font-medium">
                        {p.sellingPrice !== null ? `$${p.sellingPrice.toFixed(2)}` : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Actions on Mobile */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                    <button
                      onClick={() => {
                        setAdjustProduct(p);
                        setAdjustQty('+1');
                        setAdjustNote('');
                        setFormError('');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" /> Adjust
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${p.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-zinc-400" /> Edit
                      </Link>
                      <button
                        onClick={() => setDeleteProduct(p)}
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {adjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-zinc-100">
              Adjust Stock: {adjustProduct.name}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">
              SKU: <span className="text-zinc-200">{adjustProduct.sku}</span> · Current:{' '}
              <span className="text-zinc-100 font-bold">{adjustProduct.quantityOnHand} units</span>
            </p>

            {formError && (
              <div className="mt-3 p-2.5 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="mt-4 space-y-3.5">
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
                  Reason / Note
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="e.g. Restock shipment, damaged write-off"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm sm:text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAdjustProduct(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-zinc-100">Delete Product</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="text-zinc-200 font-semibold">{deleteProduct.name}</span> (SKU:{' '}
              <span className="font-mono text-zinc-300">{deleteProduct.sku}</span>)?
            </p>
            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isSubmitting}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
