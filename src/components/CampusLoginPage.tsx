'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export function CampusLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoRoleNotice, setDemoRoleNotice] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both your registered email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setDemoRoleNotice(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      // Route by role
      if (data.user.role === 'STUDENT') {
        router.push('/student');
      } else if (data.user.role === 'FACULTY') {
        router.push('/faculty');
      } else {
        router.push('/admin');
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (role: 'STUDENT' | 'FACULTY') => {
    setError(null);
    if (role === 'STUDENT') {
      setEmail('student@campusiq.edu');
      setPassword('student123');
      setDemoRoleNotice('Loaded Student: Aarav Sharma (Semester 4 B.Tech CSE)');
    } else {
      setEmail('faculty@campusiq.edu');
      setPassword('faculty123');
      setDemoRoleNotice('Loaded Faculty: Dr. Sunita Rao (Associate Professor & HoD)');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    // Convenience for demo / hackathon simulation
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'STUDENT' }),
      });
      if (res.ok) {
        router.push('/student');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans select-none overflow-x-hidden">
      {/* Background Image with slight natural overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: "url('/campus_background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/10 backdrop-brightness-[0.98]" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        {/* Brand / Logo on Left (matching reference) */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center space-x-1.5 text-[#0284c7] font-black text-2xl tracking-tighter">
              <span className="text-slate-800 text-xl font-normal lowercase">my</span>
              <span className="text-[#0284c7] font-bold text-2xl">Camu</span>
            </div>
            <div className="hidden sm:flex flex-col border-l border-slate-300 pl-2.5 ml-1">
              <span className="text-[11px] font-bold text-slate-800 leading-tight">CampusIQ</span>
              <span className="text-[9px] text-slate-500 font-medium">Digital Campus OS</span>
            </div>
          </Link>
        </div>

        {/* Top Right Corner - USER SPECIFIED: "there will be an login option for admin page from where onli admin can log in" */}
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/login"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md shadow-slate-900/15 border border-slate-700 hover:border-indigo-400 transition group"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
            <span>Admin Login</span>
            <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-semibold bg-indigo-500/30 text-indigo-200 rounded uppercase tracking-wider">
              Staff Only
            </span>
          </Link>
        </div>
      </header>

      {/* Center Floating Login Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[440px] bg-white/98 rounded-[28px] shadow-2xl border border-white/60 p-6 sm:p-8 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          {/* University Emblem & Crest */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-700 via-rose-600 to-indigo-700 flex items-center justify-center text-white font-serif font-black text-sm shadow-xs tracking-tight">
                DBS
              </div>
              <div className="text-left">
                <div className="text-sm font-extrabold text-[#7e22ce] tracking-tight leading-tight uppercase font-serif">
                  DBS GLOBAL
                </div>
                <div className="text-[10px] font-semibold text-slate-600 tracking-widest uppercase font-serif -mt-0.5">
                  UNIVERSITY
                </div>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-800 mt-1">
              DBS Global University
            </div>

            <button
              type="button"
              onClick={() => alert('DBS Global University is configured as the active primary campus node.')}
              className="text-[11px] text-[#0284c7] hover:underline font-medium mt-0.5"
            >
              Not from DBS Global University?
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-center text-lg font-bold text-slate-800 mb-5">
            Login
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Demo Pre-fill notice */}
          {demoRoleNotice && (
            <div className="mb-4 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-700 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-medium">{demoRoleNotice}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* User name input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                User name
              </label>
              <input
                type="email"
                required
                placeholder="Registered email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5097ea] focus:ring-1 focus:ring-[#5097ea] transition bg-white"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#5097ea] focus:ring-1 focus:ring-[#5097ea] transition pr-10 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered academic email.')}
                  className="text-[11px] text-[#0284c7] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Login button (matching reference styling #5097ea) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#5097ea] hover:bg-[#3b82f6] text-white text-xs font-semibold shadow-xs transition duration-150 flex items-center justify-center space-x-1.5 disabled:opacity-60 cursor-pointer"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials Pill Bar for presentation ease */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider text-center mb-2">
              Quick 1-Click Demo Fill:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('STUDENT')}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold border border-indigo-200 transition text-center"
              >
                Student (Aarav)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('FACULTY')}
                className="px-2.5 py-1.5 rounded-lg bg-purple-50/70 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200 transition text-center"
              >
                Faculty (Dr. Sunita)
              </button>
            </div>
          </div>

          {/* OR Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                OR
              </span>
            </div>
          </div>

          {/* Social Sign-in Buttons (matching screenshot) */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full py-2 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center justify-center space-x-2.5 shadow-2xs transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('microsoft')}
              className="w-full py-2 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center justify-center space-x-2.5 shadow-2xs transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              <span>Continue with Microsoft</span>
            </button>
          </div>

          {/* App Store Downloads Section (matching screenshot) */}
          <div className="mt-5 text-center">
            <div className="text-[11px] font-semibold text-slate-700 mb-2">
              Get MyCamu app
            </div>
            <div className="flex items-center justify-center space-x-2">
              {/* Google Play Badge */}
              <div className="h-8 px-2.5 py-1 rounded-md bg-black text-white flex items-center space-x-1.5 cursor-pointer hover:opacity-90">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 20.5v-17c0-.86.95-1.37 1.66-.9l14.28 8.5c.74.44.74 1.5 0 1.94L4.66 21.4c-.71.47-1.66-.04-1.66-.9z" />
                </svg>
                <div className="text-left leading-none">
                  <div className="text-[7px] uppercase tracking-wider text-slate-300">GET IT ON</div>
                  <div className="text-[9px] font-bold">Google Play</div>
                </div>
              </div>

              {/* Apple Store Badge */}
              <div className="h-8 px-2.5 py-1 rounded-md bg-black text-white flex items-center space-x-1.5 cursor-pointer hover:opacity-90">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2.02.61-2.66 1.36-.56.65-1.05 1.72-.92 2.74 1.02.08 2.05-.51 2.66-1.25z" />
                </svg>
                <div className="text-left leading-none">
                  <div className="text-[7px] uppercase tracking-wider text-slate-300">Download on the</div>
                  <div className="text-[9px] font-bold">App Store</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Policy Disclaimer */}
          <div className="mt-5 text-center text-[10px] text-slate-500 leading-tight space-y-1">
            <p>
              By logging in, you agree to our{' '}
              <a href="#" className="text-[#0284c7] hover:underline">Terms of Use</a> and to receive CAMU emails & updates and acknowledge that you read our{' '}
              <a href="#" className="text-[#0284c7] hover:underline">Privacy Policy</a>.
            </p>
            <p className="text-slate-400 pt-1">
              2025 &copy; Octoze Technologies / CampusIQ. All Rights Reserved. (Version 1)
            </p>
            <p className="text-[#0284c7] font-medium">www.camudigitalcampus.com</p>
          </div>
        </div>
      </main>
    </div>
  );
}
