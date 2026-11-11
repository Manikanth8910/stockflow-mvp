'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [defaultThreshold, setDefaultThreshold] = useState(5);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantityOnHand: '0',
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: '',
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${productId}`).then((res) => res.json()),
      fetch('/api/settings').then((res) => res.json()),
    ])
      .then(([productData, settingsData]) => {
        if (productData.product) {
          const p = productData.product;
          setFormData({
            name: p.name,
            sku: p.sku,
            description: p.description || '',
            quantityOnHand: p.quantityOnHand.toString(),
            costPrice: p.costPrice !== null ? p.costPrice.toString() : '',
            sellingPrice: p.sellingPrice !== null ? p.sellingPrice.toString() : '',
            lowStockThreshold: p.lowStockThreshold !== null ? p.lowStockThreshold.toString() : '',
          });
        }
        if (settingsData.organization?.defaultLowStockThreshold) {
          setDefaultThreshold(settingsData.organization.defaultLowStockThreshold);
        }
      })
      .catch((err) => {
        setError('Failed to load product data');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      router.push(`/products/${productId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating');
      setIsSubmitting(false);
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-6 border-b border-zinc-800/80">
        <Link
          href={`/products/${productId}`}
          className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Edit Product</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Modify SKU, quantities, pricing, or thresholds
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Product name <span className="text-zinc-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                SKU <span className="text-zinc-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Quantity on hand <span className="text-zinc-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.quantityOnHand}
                onChange={(e) => setFormData({ ...formData, quantityOnHand: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Cost price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Selling price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Low stock reorder threshold
            </label>
            <input
              type="number"
              min="0"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              placeholder={`Defaults to org setting (${defaultThreshold} units)`}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800/80">
            <Link
              href={`/products/${productId}`}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
