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
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 antialiased overflow-x-hidden">
      {/* 1. Minimal Clean Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-sm">
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-100">StockFlow</span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-700/40 hidden xs:inline">
              v0.1
            </span>
          </Link>

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
              <span className="xs:hidden">Get Started</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono tracking-tight mx-auto mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Multi-Tenant Inventory Management System</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100 mb-5 leading-tight"
        >
          Precision inventory control <br className="hidden sm:inline" />
          built for growing sellers.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Manage product catalogs, track live unit quantities, calculate holding valuations, and catch low-stock items before stockouts happen.
        </motion.p>

        {/* Hero Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-xs active:scale-[0.98]"
          >
            <span>Launch Demo Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium px-5 py-2.5 rounded-lg border border-zinc-800 transition-all text-xs"
          >
            <span>Register New Organization</span>
          </Link>
        </motion.div>

        {/* 3. Core Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-16">
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
              Fast unit adjustments (+/-) with validation, notes, and negative-stock prevention.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <CheckCircle2 className="w-4 h-4 text-zinc-400 mb-2.5" />
            <h3 className="text-xs font-semibold text-zinc-200 mb-1">Dynamic Alerts</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Automatic reorder detection using per-product limits with fallback to organization policies.
            </p>
          </div>
        </div>

        {/* 4. Evaluator Quick-Start Card */}
        <div className="p-5 sm:p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-left mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-800/80">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Evaluation Demo
              </span>
              <h3 className="text-sm font-semibold text-zinc-100 mt-1.5">
                Ready for testing the Wexa assessment?
              </h3>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            >
              Sign In to Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase block">Email</span>
              <span className="text-zinc-300">demo@stockflow.io</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] uppercase block">Password</span>
              <span className="text-zinc-300">password123</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] uppercase block">Sample Data</span>
              <span className="text-emerald-400">7 Products Pre-loaded</span>
            </div>
          </div>
        </div>

        {/* 5. Minimal FAQ */}
        <div className="text-left max-w-2xl mx-auto w-full">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4 text-center">
            Common Questions
          </h2>

          <div className="space-y-2.5">
            {[
              {
                q: 'How does StockFlow isolate data between different organizations?',
                a: 'Every user is tied to an organization during registration. All backend endpoints extract this organization ID directly from the verified cryptographic JWT session cookie, never relying on untrusted client parameters.',
              },
              {
                q: 'What is the fallback logic for low-stock thresholds?',
                a: 'A product is flagged as low stock whenever quantity on hand is less than or equal to its threshold. If an item has no custom limit, it automatically inherits the organization default threshold.',
              },
              {
                q: 'Can inventory quantities become negative?',
                a: 'No. Both the edit product form and the atomic stock adjustment endpoint enforce that the resulting quantity is greater than or equal to 0.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-zinc-800/80 rounded-lg bg-zinc-900/30 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-3 px-4 text-left flex items-center justify-between gap-3 text-xs font-medium text-zinc-300 hover:text-zinc-100"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-3.5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 6. Clean Minimal Footer */}
      <footer className="border-t border-zinc-800/80 py-6 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center">
              <Layers className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-zinc-200">StockFlow</span>
            <span>&middot;</span>
            <span className="text-[11px] font-mono">Wexa AI Technical Assessment</span>
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
