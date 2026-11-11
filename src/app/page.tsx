import Link from 'next/link';
import { ArrowRight, Layers, Shield, Sliders, CheckCircle2, Github } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-zinc-800">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center">
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-100">StockFlow</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-700/40">
              MVP
            </span>
          </div>

          <div className="flex items-center gap-3">
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
              className="text-xs font-medium text-zinc-300 hover:text-zinc-100 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              Create Organization
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-24 text-center flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono tracking-tight mx-auto mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Multi-Tenant SaaS Inventory System</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 mb-5 leading-tight">
          Precision inventory control <br className="hidden sm:inline" />
          built for growing sellers.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Manage product catalogs, track live unit quantities, calculate holding valuations, and catch low-stock items before stockouts happen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors text-xs"
          >
            Launch Demo Workspace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium px-5 py-2.5 rounded-lg border border-zinc-800 transition-colors text-xs"
          >
            Register New Organization
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <Shield className="w-4 h-4 text-zinc-400 mb-2.5" />
            <h3 className="text-xs font-semibold text-zinc-200 mb-1">Tenant Isolation</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Every query is scoped by verified session organization IDs with zero cross-tenant leakage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <Sliders className="w-4 h-4 text-zinc-400 mb-2.5" />
            <h3 className="text-xs font-semibold text-zinc-200 mb-1">Inline Adjustments</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Fast unit adjustments (+/-) with audit logging, timestamping, and negative-stock prevention.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <CheckCircle2 className="w-4 h-4 text-zinc-400 mb-2.5" />
            <h3 className="text-xs font-semibold text-zinc-200 mb-1">Dynamic Thresholds</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Automatic alert detection using per-product limits with fallback to organization-level policies.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 text-center text-[11px] text-zinc-500 font-mono">
        StockFlow MVP · Wexa AI Technical Assessment
      </footer>
    </div>
  );
}
