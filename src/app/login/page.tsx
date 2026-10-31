'use client';

import { useState, Suspense } from 'react';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Store, Lock, Phone, AlertCircle, Loader2, KeyRound } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        phone: phone.trim(),
        password,
        redirect: false,
      });

      if (res?.error || !res?.ok) {
        setError('Invalid phone or password');
      } else {
        router.push(redirectTo as Route);
        router.refresh();
      }
    } catch {
      setError('Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-md">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Shop Management ERP
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">Sign in to your retail staff account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="phoneInput"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="phoneInput"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+8801700000000"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Use E.164 country code format (e.g. +88017...)
          </p>
        </div>

        <div>
          <label
            htmlFor="passwordInput"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="passwordInput"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>

      {/* Demo Credentials Box */}
      <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/60 p-3.5">
        <div className="flex items-start gap-2.5">
          <KeyRound className="h-4 w-4 shrink-0 text-teal-700 mt-0.5" />
          <div className="text-xs text-teal-900 leading-relaxed">
            <span className="font-semibold">Demo credentials:</span>
            <div className="mt-0.5 font-mono text-teal-800">
              Demo admin: +8801700000000 / admin1234
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex w-full max-w-md items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
