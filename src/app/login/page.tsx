'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fillDemo = () => {
    setEmail('demo@stockflow.io');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-zinc-100">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="sm:mx-auto sm:w-full sm:max-w-sm"
      >
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-sm">
            <Layers className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-semibold text-base tracking-tight text-zinc-100">StockFlow</span>
        </Link>
        <h2 className="text-center text-xl font-semibold tracking-tight text-zinc-100">
          Sign in to your organization
        </h2>
        <p className="mt-1 text-center text-xs text-zinc-400">
          Enter your email and password to access the inventory workspace
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm"
      >
        {/* Evaluator Callout Banner */}
        <div className="mb-4 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs flex items-center justify-between text-zinc-300">
          <div>
            <span className="font-medium text-zinc-200">Evaluation Demo</span>
            <span className="block text-[11px] text-zinc-500 font-mono">demo@stockflow.io / password123</span>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="px-2.5 py-1 text-xs font-medium rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            Autofill
          </button>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 py-6 px-6 shadow-sm rounded-xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@example.com"
                className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-white focus:outline-none disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-zinc-400 pt-4 border-t border-zinc-800/80">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-zinc-200 hover:text-white underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
