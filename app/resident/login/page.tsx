'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

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

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');

  // Status & error states
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error'
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

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('sending');
    setErrorMessage(null);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('YOUR_PROJECT') || key.includes('YOUR_SUPABASE')) {
      setErrorMessage('Authentication service not configured. Please contact the EcoLoop administrator.');
      setStatus('error');
      return;
    }

    try {
      const supabase = createClient();
      const siteUrl = (typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL) || 'https://ecoloop-deepakdeshmukh667-7678.vercel.app';
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        const statusNum = error.status;
        if (statusNum === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
          setCountdown(60);
          setErrorMessage('Too many verification requests. Please wait 60 seconds before trying again.');
        } else if (msg.includes('invalid') && msg.includes('email')) {
          setErrorMessage('Please enter a valid email address.');
        } else if ((statusNum && statusNum >= 500) || msg.includes('smtp') || msg.includes('provider') || msg.includes('disabled')) {
          setErrorMessage('Email verification is currently unavailable. Please try again later.');
        } else {
          setErrorMessage(error.message || 'Unable to send verification code.');
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
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : '';
      if (msg.includes('supabase configuration') || msg.includes('environment variable')) {
        setErrorMessage('Authentication service not configured. Please contact the EcoLoop administrator.');
      } else if (err instanceof TypeError || msg.includes('fetch')) {
        setErrorMessage("We couldn't connect to EcoLoop authentication. Please check your internet connection and try again.");
      } else {
        setErrorMessage(`Authentication error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
      setStatus('error');
    }
  };

  // Handle single digit input
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

  // Handle backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (tokenToVerify?: string) => {
    const token = tokenToVerify || otp.join('');
    if (token.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
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
        const msg = error.message.toLowerCase();
        if (msg.includes('expired')) {
          setErrorMessage('This verification code has expired. Please request a new one.');
        } else if (msg.includes('invalid') || msg.includes('token') || msg.includes('incorrect') || msg.includes('code')) {
          setErrorMessage('The verification code is incorrect. Please check your email and try again.');
        } else {
          setErrorMessage(error.message || 'Verification failed. Please try again.');
        }
        setStatus('error');
        return;
      }

      const authUser = data.user;
      if (!authUser) {
        setErrorMessage('Authentication session could not be established.');
        setStatus('error');
        return;
      }

      const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
      const userEmail = (authUser.email || normalizedEmail).toLowerCase().trim();
      const isSuperAdmin = ADMIN_EMAILS.includes(userEmail);

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', authUser.id)
        .maybeSingle();

      if (isSuperAdmin) {
        await supabase.from('profiles').upsert({
          id: authUser.id,
          email: authUser.email || normalizedEmail,
          full_name: 'Deepak Deshmukh (Admin)',
          role: 'admin',
          is_active: true,
        }, { onConflict: 'id' });
      } else if (!existingProfile) {
        const namePart = normalizedEmail.split('@')[0].replace(/[0-9_.-]+/g, ' ').trim();
        const formattedName = namePart
          ? namePart.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
          : 'Resident Member';

        await supabase.from('profiles').upsert({
          id: authUser.id,
          email: authUser.email || normalizedEmail,
          full_name: authUser.user_metadata?.full_name || formattedName,
          role: 'resident',
          eco_points: 0,
          current_streak: 0,
          consistency_score: 0,
          total_verifications: 0,
          tier_level: 1,
          is_active: true,
        }, { onConflict: 'id' });
      }

      if (typeof document !== 'undefined') {
        document.cookie = 'ecoloop_session=true; path=/; max-age=604800; SameSite=Lax';
      }

      setStatus('verified');
      router.refresh();
      const targetDestination = isSuperAdmin ? '/admin/dashboard' : redirectedFrom;
      setTimeout(() => {
        router.push(targetDestination);
      }, 300);
    } catch (err) {
      if (err instanceof TypeError || (err instanceof Error && err.message.toLowerCase().includes('fetch'))) {
        setErrorMessage("We couldn't connect to EcoLoop authentication. Please check your internet connection and try again.");
      } else {
        setErrorMessage('Verification failed. Please try again.');
      }
      setStatus('error');
    }
  };

  // 1-Click Resident Demo
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

      {/* ── AMBIENT PARTICLES & GLOW BACKDROP ────────────────── */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-emerald-400/10 to-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulseGlow" style={{ animationDelay: '3s' }} />

      {/* ── MAIN CONTENT: ANIMATED HERO + SIDE LOGIN ────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">

        {/* ── LEFT COLUMN: ANIMATED ECOLOOP SHOWCASE (STOCKFLOW HERO) ── */}
        <div className="flex-1 max-w-2xl flex flex-col gap-6 animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold w-fit shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Smart Civic Waste Segregation & Gamification</span>
          </div>

          {/* Headline matching StockFlow reference */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-headline text-slate-950 dark:text-white">
            Know your waste.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
              Verify with AI.
            </span>{' '}
            Grow with confidence.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            EcoLoop empowers housing societies, residential towers, and civic communities with camera AI waste verification, habit consistency tracking, real-world vouchers, and zero-surveillance transparency.
          </p>

          {/* Animated Interactive Feature Cards (Float slow) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="card p-4 flex items-center gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all animate-floatSlow">
              <div className="icon-box bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">insights</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white">98% Habit Score</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Top 5% in Green Valley Tower</span>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all animate-floatSlow" style={{ animationDelay: '1.5s' }}>
              <div className="icon-box bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Instant AI Verification</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Wet & Dry waste audited in 1s</span>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all animate-floatSlow" style={{ animationDelay: '2.5s' }}>
              <div className="icon-box bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">redeem</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Eco Rewards & Vouchers</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Redeem grocery & café discounts</span>
              </div>
            </div>

            <div className="card p-4 flex items-center gap-3.5 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all animate-floatSlow" style={{ animationDelay: '3.5s' }}>
              <div className="icon-box bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Zero Surveillance</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Strict civic privacy bylaws</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: SIDE LOGIN CARD ("SIDE MEI LOGIN") ── */}
        <div className="w-full max-w-md shrink-0 animate-fadeInUp stagger-1">
          <div className="card p-6 sm:p-8 flex flex-col gap-5 shadow-xl border-slate-200/90 dark:border-[#1e2d45] relative bg-white/95 dark:bg-[#111f35]/95 backdrop-blur-xl">

            {/* Login Card Header */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Resident Portal</span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Green Valley Residency</span>
              </div>
              <h2 className="text-xl font-bold font-headline text-slate-900 dark:text-white tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track habits, verify daily waste, and earn community points.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs flex items-start gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                <span className="flex-1 font-medium">{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Email Form */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="resident-email" className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
                    Apartment / Household Email
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
                      placeholder="resident@society.org"
                      required
                      autoFocus
                      disabled={status === 'sending'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#162236] border border-slate-200 dark:border-[#1e2d45] rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                    We will send a 6-digit one-time code to your email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending' || countdown > 0}
                  className="w-full py-2.5 px-4 btn-primary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Sending Code…</span>
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                      <span>Retry in {countdown}s</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-[#1e2d45]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-[#111f35] px-2 text-slate-400 dark:text-slate-500 font-medium">
                      Or quick access
                    </span>
                  </div>
                </div>

                {/* 1-Click Demo Login */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">bolt</span>
                  <span>1-Click Resident Demo Login</span>
                </button>

                <div className="text-center pt-1">
                  <Link
                    href="/admin/login"
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                  >
                    Society Administrator? <span className="underline font-bold">Admin Login</span>
                  </Link>
                </div>
              </form>
            )}

            {/* STEP 2: OTP Verification Form */}
            {step === 'otp' && (
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Code sent to <span className="font-bold text-slate-900 dark:text-white">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setStatus('idle'); setErrorMessage(null); }}
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
                  className="w-full py-2.5 px-4 btn-primary text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
          </div>
        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-[#1e2d45]/60">
        EcoLoop v2.10.4 · Built for zero-contamination sustainable residential communities
      </footer>
    </div>
  );
}
