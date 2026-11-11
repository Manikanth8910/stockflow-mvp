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
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { ProductItem } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [defaultThreshold, setDefaultThreshold] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low-stock' | 'in-stock'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductItem | null>(null);
  const [adjustProduct, setAdjustProduct] = useState<ProductItem | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<ProductItem | null>(null);

  // Form states
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add / Edit form fields
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantityOnHand: '0',
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: '',
  });

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

  const openAddModal = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      quantityOnHand: '0',
      costPrice: '',
      sellingPrice: '',
      lowStockThreshold: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setEditProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      description: p.description || '',
      quantityOnHand: p.quantityOnHand.toString(),
      costPrice: p.costPrice !== null ? p.costPrice.toString() : '',
      sellingPrice: p.sellingPrice !== null ? p.sellingPrice.toString() : '',
      lowStockThreshold: p.lowStockThreshold !== null ? p.lowStockThreshold.toString() : '',
    });
    setFormError('');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const isEdit = !!editProduct;
    const url = isEdit ? `/api/products/${editProduct.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save product');
      }

      setIsAddModalOpen(false);
      setEditProduct(null);
      await fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Page Title & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products & Inventory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your catalog, stock quantities, pricing, and reorder levels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {products.length === 0 && !loading && (
            <button
              onClick={handleSeedDemo}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Load Sample Products
            </button>
          )}
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setStatusFilter('low-stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'low-stock'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Low Stock ({products.filter((p) => p.isLowStock).length})
          </button>
          <button
            onClick={() => setStatusFilter('in-stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'in-stock'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Healthy ({products.filter((p) => !p.isLowStock).length})
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
            <p className="text-sm">Loading inventory catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No products found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchTerm
                ? `No products matching "${searchTerm}". Try a different term or clear filters.`
                : 'Your inventory catalog is currently empty.'}
            </p>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" /> Add Product Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-5">Product Name</th>
                  <th className="py-3 px-5">SKU</th>
                  <th className="py-3 px-5 text-center">Quantity on Hand</th>
                  <th className="py-3 px-5 text-center">Stock Status</th>
                  <th className="py-3 px-5 text-right">Cost Price</th>
                  <th className="py-3 px-5 text-right">Selling Price</th>
                  <th className="py-3 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Name & Description */}
                    <td className="py-3.5 px-5 font-medium text-white max-w-xs">
                      <Link
                        href={`/products/${p.id}`}
                        className="font-semibold text-white hover:text-emerald-400 transition-colors inline-block"
                      >
                        {p.name}
                      </Link>
                      {p.description && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {p.description}
                        </p>
                      )}
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-5 font-mono text-xs text-emerald-400">
                      {p.sku}
                    </td>

                    {/* Quantity on Hand */}
                    <td className="py-3.5 px-5 text-center">
                      <span className="font-bold text-white font-mono text-sm">
                        {p.quantityOnHand}
                      </span>
                    </td>

                    {/* Low Stock Indicator Pill (FR-4) */}
                    <td className="py-3.5 px-5 text-center">
                      {p.isLowStock ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            p.quantityOnHand === 0
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          <TrendingDown className="w-3 h-3" />
                          {p.quantityOnHand === 0
                            ? 'Out of Stock'
                            : `Low Stock (Threshold: ${p.effectiveThreshold})`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> In Stock (Limit: {p.effectiveThreshold})
                        </span>
                      )}
                    </td>

                    {/* Cost Price */}
                    <td className="py-3.5 px-5 text-right font-mono text-xs text-slate-400">
                      {p.costPrice !== null ? `$${p.costPrice.toFixed(2)}` : '—'}
                    </td>

                    {/* Selling Price */}
                    <td className="py-3.5 px-5 text-right font-mono text-xs text-emerald-400 font-semibold">
                      {p.sellingPrice !== null ? `$${p.sellingPrice.toFixed(2)}` : '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Inline Adjust Stock Button (FR-5) */}
                        <button
                          onClick={() => {
                            setAdjustProduct(p);
                            setAdjustQty('+1');
                            setAdjustNote('');
                            setFormError('');
                          }}
                          title="Adjust Stock (+/- units)"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit Product"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteProduct(p)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-colors"
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
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editProduct ? `Edit Product: ${editProduct.sku}` : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditProduct(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Product Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ergonomic Office Chair"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    SKU Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. CHR-ERG-01"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Unique within your organization</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Quantity on Hand <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantityOnHand}
                    onChange={(e) => setFormData({ ...formData, quantityOnHand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                    placeholder={`Defaults to org setting (${defaultThreshold}) if empty`}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Triggers low-stock warning when Quantity &le; Threshold.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product notes, dimensions, or specifications..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditProduct(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal (FR-5) */}
      {adjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Inline Stock Adjustment
              </h3>
              <button
                onClick={() => setAdjustProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-400">
              Product: <span className="text-white font-medium">{adjustProduct.name}</span>
              <br />
              SKU: <span className="font-mono text-emerald-400">{adjustProduct.sku}</span> | Current
              Stock: <span className="text-white font-bold">{adjustProduct.quantityOnHand} units</span>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Change Units (+/- N)
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
                  placeholder="e.g. Restocked batch, damaged return"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (FR-4) */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Product</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="text-white font-semibold">{deleteProduct.name}</span> (SKU:{' '}
              <span className="font-mono text-emerald-400">{deleteProduct.sku}</span>)? This action
              cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
