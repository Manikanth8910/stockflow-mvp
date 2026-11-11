'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Clock,
  User,
  Loader2,
  AlertCircle,
  X,
  ArrowUpRight,
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
      <div className="flex flex-col items-center justify-center py-28 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2.5" />
        <p className="text-xs font-mono text-zinc-500">Loading product record...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-zinc-100 mb-1">Product Not Found</h2>
        <p className="text-xs text-zinc-400 mb-6">{error || 'This item does not exist in your organization.'}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">{product.name}</h1>
              {product.isLowStock ? (
                product.quantityOnHand === 0 ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Low Stock
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Healthy
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 font-mono">
              SKU: <span className="text-zinc-300 font-semibold">{product.sku}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            Adjust Stock
          </button>
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
            Edit
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Quantity on Hand */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
          <span className="text-xs font-medium text-zinc-400">Quantity on Hand</span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-zinc-100 font-mono tabular-nums">
              {product.quantityOnHand}
            </span>
            <span className="text-xs text-zinc-500">units</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-mono">
            Reorder point: {product.lowStockThreshold !== null ? product.lowStockThreshold : `${product.effectiveThreshold} (default)`}
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
          <span className="text-xs font-medium text-zinc-400">Pricing & Margins</span>
          <div className="mt-2.5 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Cost:</span>
              <span className="text-zinc-300 font-mono tabular-nums">
                {product.costPrice !== null ? `$${product.costPrice.toFixed(2)}` : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Retail:</span>
              <span className="text-zinc-100 font-mono font-medium tabular-nums">
                {product.sellingPrice !== null ? `$${product.sellingPrice.toFixed(2)}` : '—'}
              </span>
            </div>
            {margin && (
              <div className="flex justify-between pt-1 border-t border-zinc-800">
                <span className="text-zinc-500">Gross Margin:</span>
                <span className="text-emerald-400 font-mono font-medium">{margin}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Valuation */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
          <span className="text-xs font-medium text-zinc-400">Holding Valuation</span>
          <div className="mt-2.5 text-2xl font-bold text-zinc-100 font-mono tabular-nums">
            $
            {product.sellingPrice
              ? (product.quantityOnHand * product.sellingPrice).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })
              : '0.00'}
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Current stock &times; selling price</p>
        </div>
      </div>

      {/* Description & Audit Metadata */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
          Notes & Description
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {product.description || 'No description recorded for this product.'}
        </p>

        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-6 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-600" />
            <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-600" />
            <span>Updated: {new Date(product.updatedAt).toLocaleTimeString()}</span>
          </div>
          {product.lastUpdatedBy && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-600" />
              <span>By: {product.lastUpdatedBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-zinc-100">Adjust Stock</h3>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">
              Current stock: <span className="text-zinc-100 font-bold">{product.quantityOnHand} units</span>
            </p>

            {adjustError && (
              <div className="mt-3 p-2.5 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {adjustError}
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
                  className="w-full px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Note
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="e.g. Supplier receipt, customer return"
                  className="w-full px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-colors"
                >
                  {isAdjusting ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-zinc-100">Delete Product</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="text-zinc-200 font-semibold">{product.name}</span> (SKU:{' '}
              <span className="font-mono text-zinc-300">{product.sku}</span>)?
            </p>
            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
