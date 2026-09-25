'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Building2,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          requiredRole: 'ADMIN', // STRICT ROLE ENFORCEMENT: ONLY ADMINS CAN LOG IN!
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Administrator authentication failed.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('A secure connection failure occurred. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminFill = () => {
    setEmail('admin@campusiq.edu');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans select-none overflow-x-hidden">
      {/* Campus Background Image with dark executive vignette overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/campus_background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-slate-950/90 backdrop-blur-[2px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 w-full h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-700 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-md">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">
              CampusIQ <span className="text-rose-400 font-mono">ADMIN COMMAND</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Restricted University Governance Gateway
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/60 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student/Faculty Portal</span>
        </Link>
      </header>

      {/* Center Admin Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[460px] bg-slate-900/90 rounded-[28px] shadow-2xl border border-slate-700/80 p-6 sm:p-8 backdrop-blur-xl text-white animate-in fade-in zoom-in-95 duration-200">
          {/* Header Badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-3 shadow-lg shadow-rose-950/50">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 text-[10px] font-bold tracking-widest uppercase mb-1.5">
              Authorized Administrators Only
            </span>

            <h1 className="text-xl font-bold tracking-tight text-white">
              University Administrator Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
              Restricted to Deans, Campus Directors, and Department Controllers. Access is monitored and logged in the immutable security audit trail.
            </p>
          </div>

          {/* Security Alert Error Box */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Administrator Email ID
              </label>
              <input
                type="email"
                required
                placeholder="admin@campusiq.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Master Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Master Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-indigo-700 hover:from-rose-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition duration-150 flex items-center justify-center space-x-1.5 disabled:opacity-60 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{loading ? 'Verifying Authorization...' : 'Verify Administrator Access'}</span>
            </button>
          </form>

          {/* Quick Demo Pre-fill for Hackathon Presentations */}
          <div className="mt-5 pt-4 border-t border-slate-800/90 text-center">
            <button
              type="button"
              onClick={handleDemoAdminFill}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>1-Click Demo Fill: Prof. Rajesh Verma (Dean)</span>
            </button>
          </div>

          {/* Security Features Footnote */}
          <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>256-bit TLS Encryption</span>
            </span>
            <span>Zero-Trust RBAC Active</span>
          </div>
        </div>
      </main>
    </div>
  );
}
