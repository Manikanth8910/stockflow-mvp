'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  SlidersHorizontal,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  Clock,
  User,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { ProductItem } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick adjust stock modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustQty, setAdjustQty] = useState('+1');
  const [adjustNote, setAdjustNote] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState('');

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Product not found');
      }
      setProduct(data.product);
    } catch (err: any) {
      setError(err.message || 'Error fetching product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdjustError('');
    setIsAdjusting(true);

    const delta = parseInt(adjustQty, 10);
    if (isNaN(delta) || delta === 0) {
      setAdjustError('Please enter a valid stock delta (e.g. +5 or -2)');
      setIsAdjusting(false);
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}/adjust-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment: delta, note: adjustNote }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to adjust stock');
      }

      setIsAdjustModalOpen(false);
      setAdjustQty('+1');
      setAdjustNote('');
      await fetchProduct();
    } catch (err: any) {
      setAdjustError(err.message || 'Error adjusting stock');
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/products');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-sm">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'This product does not exist or belongs to another organization.'}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const margin =
    product.sellingPrice && product.costPrice && product.costPrice > 0
      ? (((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(1)
      : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{product.name}</h1>
              {product.isLowStock ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    product.quantityOnHand === 0
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  {product.quantityOnHand === 0 ? 'Out of Stock' : 'Low Stock Alert'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Stock Healthy
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              SKU: <span className="text-emerald-400 font-semibold">{product.sku}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            Adjust Stock
          </button>
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
            Edit
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Quantity on Hand */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quantity on Hand
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white font-mono">
              {product.quantityOnHand}
            </span>
            <span className="text-xs text-slate-500">units</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
            <span>Reorder Threshold:</span>
            <span className="font-mono text-white font-semibold">
              {product.lowStockThreshold !== null
                ? product.lowStockThreshold
                : `${product.effectiveThreshold} (org default)`}
            </span>
          </div>
        </div>

        {/* Pricing & Valuation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pricing & Margins
          </span>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Cost Price:</span>
              <span className="text-white font-mono font-medium">
                {product.costPrice !== null ? `$${product.costPrice.toFixed(2)}` : '—'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Selling Price:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {product.sellingPrice !== null ? `$${product.sellingPrice.toFixed(2)}` : '—'}
              </span>
            </div>
            {margin && (
              <div className="flex justify-between text-xs pt-1.5 border-t border-slate-800">
                <span className="text-slate-400">Gross Margin:</span>
                <span className="text-teal-400 font-mono font-semibold">{margin}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Holding Valuation
          </span>
          <div className="mt-3 text-3xl font-extrabold text-white font-mono">
            $
            {product.sellingPrice
              ? (product.quantityOnHand * product.sellingPrice).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })
              : '0.00'}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Based on current stock &times; selling price
          </p>
        </div>
      </div>

      {/* Description & Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-2">Description & Notes</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {product.description || 'No description provided for this product.'}
        </p>

        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Last Updated: {new Date(product.updatedAt).toLocaleTimeString()}</span>
          </div>
          {product.lastUpdatedBy && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>By: {product.lastUpdatedBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Adjust Stock: {product.name}</h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-400 font-mono">
              Current Quantity: <span className="text-white font-bold">{product.quantityOnHand}</span>
            </div>

            {adjustError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Adjustment (+/- N Units)
                </label>
                <input
                  type="text"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="e.g. +10 or -3"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reason / Note
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="e.g. Restocked shipment, damaged return"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isAdjusting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Delete Product</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="text-white font-semibold">{product.name}</span> (SKU:{' '}
              <span className="font-mono text-emerald-400">{product.sku}</span>)?
            </p>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
