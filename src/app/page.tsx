import Link from 'next/link';
import { ArrowRight, Boxes, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Boxes className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">StockFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mx-auto mb-8">
          <Zap className="w-3.5 h-3.5" /> Next-Gen SaaS Inventory Management
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
          Real-time stock control <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            without the bloat.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage products, monitor SKU quantities, track low-stock thresholds, and streamline organization-level inventory with zero learning curve.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-base"
          >
            Create Free Organization <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition-all text-base"
          >
            Sign In with Demo Account
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-800/80">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Multi-Tenant Isolation</h3>
            <p className="text-sm text-slate-400">Strict organization boundaries ensuring zero cross-tenant data leakage.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-800/80">
            <Boxes className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Instant SKU & Stock CRUD</h3>
            <p className="text-sm text-slate-400">Add, edit, adjust +/- units inline, and search inventory by SKU or product name.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-800/80">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Smart Low Stock Alerts</h3>
            <p className="text-sm text-slate-400">Automatic detection of critical inventory using product thresholds & org defaults.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        StockFlow SaaS Inventory MVP • Wexa AI Technical Assessment
      </footer>
    </div>
  );
}
