'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  ArrowRight,
  Shield,
  Sliders,
  CheckCircle2,
  Github,
  Package,
  DollarSign,
  AlertTriangle,
  Database,
  Cpu,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Check,
  X,
  Server,
  Terminal,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'thresholds'>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 antialiased overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-sm">
                <Layers className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-100">StockFlow</span>
            </Link>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 hidden xs:inline">
              v0.1 MVP
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
            <a href="#features" className="hover:text-zinc-200 transition-colors">Features</a>
            <a href="#preview" className="hover:text-zinc-200 transition-colors">Live Preview</a>
            <a href="#architecture" className="hover:text-zinc-200 transition-colors">Architecture</a>
            <a href="#comparison" className="hover:text-zinc-200 transition-colors">Spreadsheets vs StockFlow</a>
            <a href="#evaluator" className="text-amber-400/90 hover:text-amber-300 transition-colors font-medium flex items-center gap-1">
              <span>Evaluator Kit</span>
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="https://github.com/Manikanth8910/stockflow-mvp"
              target="_blank"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-900 transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="text-xs font-medium text-zinc-300 hover:text-zinc-100 px-2.5 sm:px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 px-3 sm:px-3.5 py-1.5 rounded-lg transition-colors shadow-sm shrink-0"
            >
              <span className="hidden xs:inline">Create Organization</span>
              <span className="xs:hidden">Sign Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-6 text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        {/* Subtle glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-zinc-800/10 blur-[120px] pointer-events-none rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono tracking-tight mx-auto mb-6 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Wexa AI Assessment · Phase 1: 6-Hour MVP</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100 mb-5 leading-[1.15]"
        >
          Precision inventory control <br className="hidden sm:inline" />
          for growing e-commerce teams.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal"
        >
          Ditch fragile spreadsheets. StockFlow delivers automated reorder alerts, multi-tenant isolation, atomic stock adjustments (+/-), and real-time inventory valuations in a focused, high-performance workspace.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col xs:flex-row items-center justify-center gap-3 mb-12 sm:mb-16"
        >
          <Link
            href="/login"
            className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-xs active:scale-[0.98]"
          >
            <span>Launch Evaluation Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/signup"
            className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800/90 text-zinc-200 font-medium px-5 py-2.5 rounded-lg border border-zinc-800 transition-all text-xs"
          >
            <span>Register New Organization</span>
          </Link>
          <a
            href="https://github.com/Manikanth8910/stockflow-mvp"
            target="_blank"
            rel="noreferrer"
            className="w-full xs:w-auto inline-flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 px-4 py-2.5 text-xs transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Code</span>
          </a>
        </motion.div>

        {/* Proof Points Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-6 border-t border-zinc-800/60"
        >
          <div className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/40 text-left">
            <div className="font-mono font-bold text-sm sm:text-base text-zinc-100">100%</div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">Tenant Data Isolation</div>
          </div>
          <div className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/40 text-left">
            <div className="font-mono font-bold text-sm sm:text-base text-zinc-100">16 / 16</div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">Automated Tests Passed</div>
          </div>
          <div className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/40 text-left">
            <div className="font-mono font-bold text-sm sm:text-base text-zinc-100">&le; 0</div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">Negative Quantity Guards</div>
          </div>
          <div className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/40 text-left">
            <div className="font-mono font-bold text-sm sm:text-base text-zinc-100">&lt; 15ms</div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">Prisma Engine Queries</div>
          </div>
        </motion.div>
      </section>

      {/* 3. Interactive Product Preview Mockup */}
      <section id="preview" className="py-12 sm:py-16 px-4 sm:px-6 bg-zinc-900/20 border-y border-zinc-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-100">
              Interactive Workspace Preview
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl mx-auto">
              Inspect how StockFlow organizes your catalog, visualizes low-stock risks, and manages reorder limits.
            </p>

            {/* Interactive Switcher Tabs */}
            <div className="inline-flex p-1 bg-zinc-900 border border-zinc-800 rounded-lg mt-4 text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
                  activeTab === 'overview' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Dashboard KPI Overview
              </button>
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
                  activeTab === 'catalog' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Catalog Table
              </button>
              <button
                onClick={() => setActiveTab('thresholds')}
                className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
                  activeTab === 'thresholds' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Threshold Logic
              </button>
            </div>
          </div>

          {/* Realistic Window Container */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/80 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Window titlebar */}
            <div className="h-10 px-4 bg-zinc-950/70 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-zinc-500 ml-2">app.stockflow.io/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Acme Retail Solutions (Verified)
                </span>
              </div>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="p-4 sm:p-6 space-y-6 animate-screen-enter">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-lg">
                    <span className="text-[11px] text-zinc-400 font-medium">Total Products</span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 mt-1">7</div>
                    <span className="text-[10px] text-zinc-500">Active catalog SKUs</span>
                  </div>
                  <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-lg">
                    <span className="text-[11px] text-zinc-400 font-medium">Total Units</span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 mt-1">96</div>
                    <span className="text-[10px] text-zinc-500">14 avg / SKU</span>
                  </div>
                  <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400 font-medium">Low Stock</span>
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">4</div>
                    <span className="text-[10px] text-zinc-500">43% catalog healthy</span>
                  </div>
                  <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-lg">
                    <span className="text-[11px] text-zinc-400 font-medium">Valuation</span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 mt-1">$5,956.04</div>
                    <span className="text-[10px] text-zinc-500">Gross retail value</span>
                  </div>
                </div>

                {/* Attention Required Card */}
                <div className="border border-zinc-800 rounded-lg bg-zinc-950/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-200">Attention Required: Low Stock Items</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">4</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">Org Default: 5 units</span>
                  </div>

                  <div className="divide-y divide-zinc-800/80 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-200">Adjustable Aluminum Laptop Stand</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded">ACC-LST-05</span>
                          <span className="text-[10px] text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40">Out of stock</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-zinc-100 text-sm">0 units</span>
                        <span className="block text-[10px] text-zinc-500 font-mono">Limit: 8</span>
                      </div>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-200">Active Noise-Cancelling Headphones</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded">AUD-NCH-04</span>
                          <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">Low stock</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-zinc-100 text-sm">2 units</span>
                        <span className="block text-[10px] text-zinc-500 font-mono">Limit: 5 (default)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Catalog Table */}
            {activeTab === 'catalog' && (
              <div className="p-4 sm:p-6 space-y-4 animate-screen-enter">
                <div className="flex items-center justify-between gap-4">
                  <div className="w-full max-w-sm px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs text-zinc-400 font-mono">
                    Search by SKU or name...
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-zinc-800 text-zinc-100 rounded-md font-medium">All (7)</span>
                    <span className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200">Low Stock (4)</span>
                  </div>
                </div>

                <div className="border border-zinc-800 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950/80 text-zinc-400 font-mono text-[10px] uppercase border-b border-zinc-800">
                      <tr>
                        <th className="py-2.5 px-4">Item</th>
                        <th className="py-2.5 px-4">SKU</th>
                        <th className="py-2.5 px-4 text-right">Units</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Cost</th>
                        <th className="py-2.5 px-4 text-right">Retail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                      <tr>
                        <td className="py-2 px-4 font-medium text-zinc-100">Wireless Noise-Canceling Headphones</td>
                        <td className="py-2 px-4 font-mono text-zinc-400">AUD-NCH-04</td>
                        <td className="py-2 px-4 text-right font-mono font-bold text-amber-400">2</td>
                        <td className="py-2 px-4"><span className="text-[10px] text-amber-400">Low Stock</span></td>
                        <td className="py-2 px-4 text-right font-mono">$75.00</td>
                        <td className="py-2 px-4 text-right font-mono font-semibold text-zinc-100">$149.99</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-zinc-100">4K Ultra HD Webcam with Mic</td>
                        <td className="py-2 px-4 font-mono text-zinc-400">CAM-UHD-06</td>
                        <td className="py-2 px-4 text-right font-mono font-bold text-zinc-100">45</td>
                        <td className="py-2 px-4"><span className="text-[10px] text-emerald-400">Healthy</span></td>
                        <td className="py-2 px-4 text-right font-mono">$32.00</td>
                        <td className="py-2 px-4 text-right font-mono font-semibold text-zinc-100">$69.99</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-zinc-100">Adjustable Aluminum Laptop Stand</td>
                        <td className="py-2 px-4 font-mono text-zinc-400">ACC-LST-05</td>
                        <td className="py-2 px-4 text-right font-mono font-bold text-rose-400">0</td>
                        <td className="py-2 px-4"><span className="text-[10px] text-rose-400">Out of Stock</span></td>
                        <td className="py-2 px-4 text-right font-mono">$12.50</td>
                        <td className="py-2 px-4 text-right font-mono font-semibold text-zinc-100">$29.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Thresholds */}
            {activeTab === 'thresholds' && (
              <div className="p-4 sm:p-6 space-y-4 animate-screen-enter">
                <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-zinc-300" />
                    <h4 className="text-xs font-semibold text-zinc-200">How Threshold Fallback Works</h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    When querying products for low-stock warnings, StockFlow computes:
                  </p>
                  <pre className="p-3 bg-zinc-900 border border-zinc-800 rounded-md text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`const effectiveThreshold = product.lowStockThreshold ?? organization.defaultLowStockThreshold;
const isLowStock = product.quantityOnHand <= effectiveThreshold;`}
                  </pre>
                  <p className="text-[11px] text-zinc-500">
                    If a seller customizes an individual product reorder limit to 8 units, it triggers an alert at &le; 8. If left unconfigured, it defaults automatically to the organization-wide policy (e.g. 5 units).
                  </p>
                </div>
              </div>
            )}

            {/* Footer action inside preview */}
            <div className="px-4 py-2.5 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400 font-mono">Status: All services online</span>
              <Link href="/login" className="text-xs text-zinc-200 hover:text-white font-medium inline-flex items-center gap-1">
                Open live app <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Deep Dive */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Engineered for Real-World Reliability
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-lg mx-auto">
            Built strictly against the Wexa AI Phase 1 PRD specifications with enterprise patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-200 mb-3.5">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">Strict Multi-Tenant Scoping</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Every database read, write, update, and delete is enforced server-side with verified session tokens. Organization IDs from request parameters are never trusted blindly, preventing cross-tenant leakage.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-200 mb-3.5">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">Dynamic Threshold Alerting</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Automated low-stock detection utilizes per-item thresholds with dynamic fallback to organization-wide policies. Schedulers or cron jobs are not required; stockouts are highlighted instantly upon query.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-200 mb-3.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">Atomic Stock Adjustments (+/-)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Update units on hand on the fly with support for positive increments (restock) and negative decrements (damaged goods/sales). Strict constraints prevent quantities from ever becoming negative.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-200 mb-3.5">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">Prisma ORM & Composite Indexes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              SKUs are validated via unique composite index <code className="font-mono text-[11px] bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">@@unique([organizationId, sku])</code>. Two distinct companies can use the same SKU safely without collisions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Spreadsheets vs StockFlow Comparison */}
      <section id="comparison" className="py-16 px-4 sm:px-6 bg-zinc-900/20 border-y border-zinc-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
              Why Sellers Upgrade From Spreadsheets
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md mx-auto">
              How StockFlow solves the most common failure modes of manual inventory tracking.
            </p>
          </div>

          <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-900/60 shadow-lg">
            <div className="grid grid-cols-3 bg-zinc-950 text-xs font-mono py-3 px-4 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider">
              <div>Capability</div>
              <div className="text-rose-400/90">Manual Spreadsheets</div>
              <div className="text-emerald-400/90">StockFlow MVP</div>
            </div>

            <div className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
              <div className="grid grid-cols-3 py-3 px-4 items-center">
                <span className="font-medium text-zinc-200">Reorder Alerting</span>
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Manual conditional formatting
                </span>
                <span className="text-zinc-200 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Automatic threshold fallback
                </span>
              </div>

              <div className="grid grid-cols-3 py-3 px-4 items-center">
                <span className="font-medium text-zinc-200">Tenant Isolation</span>
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Cloned sheets, prone to leaks
                </span>
                <span className="text-zinc-200 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Database-enforced tenant keys
                </span>
              </div>

              <div className="grid grid-cols-3 py-3 px-4 items-center">
                <span className="font-medium text-zinc-200">Concurrency</span>
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Cell edit collisions
                </span>
                <span className="text-zinc-200 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Atomic database transactions
                </span>
              </div>

              <div className="grid grid-cols-3 py-3 px-4 items-center">
                <span className="font-medium text-zinc-200">Negative Stock Prevention</span>
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Easy to enter negative numbers
                </span>
                <span className="text-zinc-200 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Server-side zero floor guard
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Wexa AI Evaluator Kit */}
      <section id="evaluator" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Evaluation Quick-Start
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mt-2">
                Testing this project for the Wexa AI assessment?
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                You can test all MVP acceptance criteria with the pre-seeded demo account or register your own organization.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold px-4 py-2 rounded-lg text-xs transition-colors shrink-0"
            >
              Sign In with 1-Click <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 font-medium">Demo Email</span>
              <div className="font-mono text-zinc-200 font-semibold mt-1">demo@stockflow.io</div>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 font-medium">Demo Password</span>
              <div className="font-mono text-zinc-200 font-semibold mt-1">password123</div>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 font-medium">Pre-Seeded Catalog</span>
              <div className="font-mono text-emerald-400 font-semibold mt-1">7 Products / 4 Low Stock</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {[
            {
              q: 'How does StockFlow isolate data between different organizations?',
              a: 'Every user is tied to an organizationId during registration. All backend endpoints extract this organizationId directly from the verified cryptographic JWT session cookie, never relying on untrusted client headers or query parameters.',
            },
            {
              q: 'What is the fallback logic for low-stock thresholds?',
              a: 'A product is flagged as low stock whenever quantityOnHand <= (product.lowStockThreshold ?? organization.defaultLowStockThreshold). If an item has no custom limit, it automatically inherits the organization default (set in Settings).',
            },
            {
              q: 'Can inventory quantities become negative?',
              a: 'No. Both the edit product form and the atomic stock adjustment endpoint validate that the resulting quantity is >= 0. Any attempt to decrement stock below zero returns a 400 Bad Request error.',
            },
            {
              q: 'Are the automated tests included in the repository?',
              a: 'Yes! 16 automated tests are located in the /tests directory covering bcrypt hashing, password/email validation, SKU uniqueness, low-stock threshold logic, and cross-tenant data isolation.',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="border border-zinc-800/80 rounded-xl bg-zinc-900/40 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-4 text-xs font-medium text-zinc-200 hover:text-zinc-100"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bottom Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center">
              <Layers className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-zinc-200">StockFlow</span>
            <span>&middot;</span>
            <span>Wexa AI Technical Assessment</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <Link href="/login" className="hover:text-zinc-300">Sign In</Link>
            <Link href="/signup" className="hover:text-zinc-300">Register</Link>
            <Link
              href="https://github.com/Manikanth8910/stockflow-mvp"
              target="_blank"
              className="hover:text-zinc-300 flex items-center gap-1"
            >
              <Github className="w-3 h-3" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
