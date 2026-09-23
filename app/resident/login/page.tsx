'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

      // 1. If password provided, attempt password authentication
      if (authMode === 'password' && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: password,
        });

        if (!error && data?.user) {
          await postLoginSuccess(data.user, normalizedEmail);
          return;
        }

        // If invalid password credentials
        if (error && (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('credentials'))) {
          // If password is not registered or incorrect, give option for OTP or instant demo
          setErrorMessage('Invalid email or password credentials. You can use 1-Click Demo or sign in with OTP.');
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
          setErrorMessage('Too many requests. Please wait a minute or use 1-Click Demo.');
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
      setErrorMessage("Couldn't reach EcoLoop authentication. Please try 1-Click Demo.");
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#080f1a] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">

      {/* ── AMBIENT STOCKFLOW GLOW (CENTERED SOFT GRADIENT) ── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[520px] bg-gradient-to-tr from-indigo-500/10 via-emerald-400/10 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── BRANDING & TITLE (EXACT STOCKFLOW STYLE) ────────── */}
      <div className="flex flex-col items-center text-center gap-2 mb-6 z-10 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <span className="material-symbols-outlined text-[24px]">eco</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-headline leading-tight">
              EcoLoop
            </span>
            <span className="text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              RESIDENT CIVIC WORKSPACE
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 dark:text-white tracking-tight mt-3">
          Sign in to your account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Enter your email and credentials to access your resident dashboard
        </p>
      </div>

      {/* ── CENTERED LOGIN CARD (EXACT STOCKFLOW SPECIFICATION) ── */}
      <div className="w-full max-w-[440px] bg-white dark:bg-[#111f35] rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06),0_0_0_1px_rgba(226,232,240,0.8)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4),0_0_0_1px_rgba(30,45,69,0.8)] flex flex-col gap-5 relative z-10 animate-fadeInUp stagger-1">

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

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs flex items-start gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
            <span className="flex-1 font-medium">{errorMessage}</span>
          </div>
        )}

        {/* CREDENTIALS FORM */}
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

            {/* Password Field (StockFlow Style) */}
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
                <p className="text-[11px] text-slate-400 dark:text-slate-500 py-1">
                  Click below to receive a secure 6-digit one-time code to your inbox.
                </p>
              )}
            </div>

            {/* Primary Action Button (StockFlow Indigo/Emerald Button) */}
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

        {/* 6-DIGIT OTP STEP */}
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

            {/* 6 Inputs */}
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

        {/* Footer Link (StockFlow: Don't have an account? Create free account) */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#1e2d45] flex flex-col items-center gap-1.5 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
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

      {/* ── FOOTER NOTE ────────────────────────────────────── */}
      <footer className="mt-8 text-center text-[11px] text-slate-400 dark:text-slate-500 z-10">
        EcoLoop v2.10.4 · High-trust civic waste segregation platform
      </footer>
    </div>
  );
}
