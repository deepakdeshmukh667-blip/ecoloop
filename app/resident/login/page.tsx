'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import ThreeDCanvas from '@/components/ThreeDCanvas';
import { createClient } from '@/lib/supabase/client';
import { formatNameFromEmail } from '@/lib/state/store';

export default function ResidentLoginPage() {
  const router = useRouter();
  const [redirectedFrom, setRedirectedFrom] = useState('/resident/dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const from = params.get('redirectedFrom');
      if (from) setRedirectedFrom(from);
    }
  }, []);

  // Form states matching StockFlow Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Status & error states
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'sent' | 'verifying' | 'verified' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const postLoginSuccess = async (authUser: { id: string; email?: string; user_metadata?: { full_name?: string } }, emailStr: string) => {
    const supabase = createClient();
    const isDeepak = emailStr.toLowerCase().includes('deepak');
    const calculatedName = formatNameFromEmail(emailStr);

    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!existingProfile || (!isDeepak && existingProfile.full_name?.toLowerCase().includes('deepak'))) {
        await supabase.from('profiles').upsert({
          id: authUser.id,
          email: authUser.email || emailStr,
          full_name: authUser.user_metadata?.full_name || calculatedName,
          role: 'resident',
          eco_points: 0,
          current_streak: 0,
          consistency_score: 0,
          total_verifications: 0,
          tier_level: 1,
          is_active: true,
        }, { onConflict: 'id' });
      }
    } catch (e) {
      console.warn('Profile sync note:', e);
    }

    if (typeof document !== 'undefined') {
      document.cookie = 'ecoloop_session=true; path=/; max-age=604800; SameSite=Lax';
    }

    setStatus('verified');
    router.refresh();
    setTimeout(() => {
      router.push(redirectedFrom);
    }, 250);
  };

  // Handle Sign In (StockFlow style)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const supabase = createClient();

      // 1. Password authentication
      if (authMode === 'password' && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: password,
        });

        if (!error && data?.user) {
          await postLoginSuccess(data.user, normalizedEmail);
          return;
        }

        if (error && (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('credentials'))) {
          setErrorMessage('Invalid password credentials. Try 1-Click Demo or sign in with OTP code.');
          setStatus('error');
          return;
        }
      }

      // 2. OTP Authentication mode
      const siteUrl = (typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL) || 'https://ecoloop-deepakdeshmukh667-7678.vercel.app';
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (otpError) {
        const msg = otpError.message.toLowerCase();
        if (otpError.status === 429 || msg.includes('rate limit')) {
          setErrorMessage('Too many requests. Please wait 60s or use 1-Click Demo.');
        } else {
          setErrorMessage(otpError.message || 'Unable to sign in. Please try 1-Click Demo.');
        }
        setStatus('error');
        return;
      }

      setStatus('sent');
      setStep('otp');
      setCountdown(60);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch {
      setErrorMessage("Couldn't connect to authentication. Please try 1-Click Demo.");
      setStatus('error');
    }
  };

  // Handle single digit OTP input
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    const fullOtp = newOtp.join('');
    if (fullOtp.length === 6) {
      handleVerifyOtp(fullOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (tokenToVerify?: string) => {
    const token = tokenToVerify || otp.join('');
    if (token.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setStatus('verifying');
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: token.trim(),
        type: 'email',
      });

      if (error) {
        setErrorMessage('Verification code is incorrect or expired.');
        setStatus('error');
        return;
      }

      if (data?.user) {
        await postLoginSuccess(data.user, normalizedEmail);
      }
    } catch {
      setErrorMessage('Verification failed. Please try again.');
      setStatus('error');
    }
  };

  // Instant 1-Click Resident Demo
  const handleDemoLogin = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'ecoloop_session=true; path=/; max-age=604800; SameSite=Lax';
      document.cookie = 'ecoloop_demo=true; path=/; max-age=604800; SameSite=Lax';
    }
    setStatus('verified');
    router.push('/resident/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080f1a] text-slate-900 dark:text-white flex flex-col relative overflow-hidden">

      {/* ── TOP NAVBAR (STOCKFLOW STYLE) ────────────────────── */}
      <header className="w-full border-b border-slate-200/80 dark:border-[#1e2d45] bg-white/80 dark:bg-[#0d1625]/80 backdrop-blur-xl z-30 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-600 dark:text-slate-400">
              <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Features</span>
              <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">AI Verification</span>
              <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Habit Hub</span>
              <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Rewards</span>
              <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Civic Charter</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#162236] transition-colors"
            >
              Admin Portal
            </Link>
            <button
              onClick={handleDemoLogin}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
              type="button"
            >
              <span>Instant Demo</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT: 3D ANIMATED HERO + SIDE LOGIN ───────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 relative z-10">

        {/* ── LEFT: 3D ANIMATED ECOLOOP HERO (MATCHING STOCKFLOW 3D) ── */}
        <div className="flex-1 max-w-2xl w-full flex flex-col gap-6 relative">

          {/* 3D INTERACTIVE THREE.JS CANVAS (BEHIND HEADLINE) */}
          <ThreeDCanvas />

          <div className="relative z-10 flex flex-col gap-5 animate-fadeInUp">
            {/* Pulsing Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#111f35]/80 backdrop-blur-md border border-emerald-300/60 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🌱 3D AI-Powered Civic Waste Platform</span>
            </div>

            {/* Main Headline (StockFlow Style with 3D Cluster Backdrop) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-headline text-slate-950 dark:text-white select-none">
              Know your waste.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Verify with AI.
              </span>{' '}
              Grow with confidence.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl bg-white/40 dark:bg-[#080f1a]/40 backdrop-blur-xs rounded-xl p-2 -ml-2">
              EcoLoop empowers modern housing societies, residential towers, and civic communities with instant camera AI waste auditing, habit consistency tracking, real-world vouchers, and zero-surveillance transparency.
            </p>

            {/* Floating 3D Micro-Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="card p-3.5 flex items-center gap-3 bg-white/85 dark:bg-[#111f35]/85 backdrop-blur-md border-slate-200/90 dark:border-[#1e2d45] hover:border-emerald-300 transition-all shadow-xs animate-floatSlow">
                <div className="icon-box-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">98% Habit Score</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Top 5% in Green Valley Tower</span>
                </div>
              </div>

              <div className="card p-3.5 flex items-center gap-3 bg-white/85 dark:bg-[#111f35]/85 backdrop-blur-md border-slate-200/90 dark:border-[#1e2d45] hover:border-emerald-300 transition-all shadow-xs animate-floatSlow" style={{ animationDelay: '1.2s' }}>
                <div className="icon-box-sm bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Instant AI Verification</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Wet & Dry waste audited in 1s</span>
                </div>
              </div>

              <div className="card p-3.5 flex items-center gap-3 bg-white/85 dark:bg-[#111f35]/85 backdrop-blur-md border-slate-200/90 dark:border-[#1e2d45] hover:border-emerald-300 transition-all shadow-xs animate-floatSlow" style={{ animationDelay: '2.4s' }}>
                <div className="icon-box-sm bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">redeem</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Eco Rewards & Vouchers</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Redeem grocery & café discounts</span>
                </div>
              </div>

              <div className="card p-3.5 flex items-center gap-3 bg-white/85 dark:bg-[#111f35]/85 backdrop-blur-md border-slate-200/90 dark:border-[#1e2d45] hover:border-emerald-300 transition-all shadow-xs animate-floatSlow" style={{ animationDelay: '3.6s' }}>
                <div className="icon-box-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Zero Surveillance</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Democratic civic privacy charter</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: EXACT STOCKFLOW LOGIN FACE ("SIDE MEI LOGIN") ──── */}
        <div className="w-full max-w-[440px] shrink-0 animate-fadeInUp stagger-1 relative z-20">
          <div className="card p-6 sm:p-8 flex flex-col gap-5 shadow-2xl border-slate-200/90 dark:border-[#1e2d45] relative bg-white/95 dark:bg-[#111f35]/95 backdrop-blur-xl">

            {/* Top Security Banner (Enterprise Civic Security | Encrypted) */}
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                <span className="material-symbols-outlined text-[17px] text-emerald-600 dark:text-emerald-400">
                  shield
                </span>
                <span className="font-semibold text-xs">Enterprise Civic Security</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                Encrypted
              </span>
            </div>

            {/* Card Heading */}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold font-headline text-slate-900 dark:text-white tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your email and credentials to access your dashboard
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs flex items-start gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                <span className="flex-1 font-medium">{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: CREDENTIALS */}
            {step === 'credentials' && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="resident-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                      mail
                    </span>
                    <input
                      id="resident-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      autoFocus
                      disabled={status === 'submitting'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#162236] border border-slate-200 dark:border-[#1e2d45] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="resident-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === 'password' ? 'otp' : 'password')}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {authMode === 'password' ? 'Sign in with OTP code' : 'Sign in with password'}
                    </button>
                  </div>

                  {authMode === 'password' ? (
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                        lock
                      </span>
                      <input
                        id="resident-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={status === 'submitting'}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-[#162236] border border-slate-200 dark:border-[#1e2d45] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 py-0.5">
                      Click below to receive a secure 6-digit one-time code to your email.
                    </p>
                  )}
                </div>

                {/* Primary Button (StockFlow Style) */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Signing In…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-0.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-[#1e2d45]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-[#111f35] px-2 text-slate-400 dark:text-slate-500 font-medium">
                      Or instant access
                    </span>
                  </div>
                </div>

                {/* 1-Click Resident Demo Login */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-[#162236] dark:hover:bg-[#1e2d45] text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-[#1e2d45]"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">bolt</span>
                  <span>1-Click Resident Demo Login</span>
                </button>
              </form>
            )}

            {/* STEP 2: 6-DIGIT OTP */}
            {step === 'otp' && (
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Code sent to <span className="font-bold text-slate-900 dark:text-white">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep('credentials'); setStatus('idle'); setErrorMessage(null); }}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold mt-0.5"
                  >
                    Change email address
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex justify-center gap-2 my-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      disabled={status === 'verifying'}
                      className="w-10 sm:w-11 h-12 text-center text-lg font-bold bg-slate-50 dark:bg-[#162236] border border-slate-200 dark:border-[#1e2d45] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={status === 'verifying' || otp.join('').length !== 6}
                  className="w-full py-3 px-4 btn-primary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {status === 'verifying' ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Verifying…</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Access Dashboard</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Card Footer Link */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#1e2d45] flex flex-col items-center gap-1.5 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Create free account
                </button>
              </p>
              <Link
                href="/admin/login"
                className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Society Administrator? <span className="underline font-semibold">Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-[#1e2d45]/60 z-20">
        EcoLoop v2.10.4 · Built for high-trust sustainable residential communities
      </footer>
    </div>
  );
}
