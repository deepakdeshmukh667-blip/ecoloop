'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [redirectedFrom, setRedirectedFrom] = useState('/admin/dashboard');

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
    'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'unauthorized' | 'error'
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

  // Send Admin OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      setErrorMessage('Please enter a valid administrator email address.');
      return;
    }

    setStatus('sending');
    setErrorMessage(null);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setErrorMessage('Admin verification service is currently unavailable. Please check system configuration.');
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
          setErrorMessage('Too many verification requests. Please wait a moment and try again.');
        } else if (msg.includes('invalid') && msg.includes('email')) {
          setErrorMessage('Please enter a valid administrator email address.');
        } else if ((statusNum && statusNum >= 500) || msg.includes('smtp') || msg.includes('provider') || msg.includes('disabled')) {
          setErrorMessage('Email verification is currently unavailable. Please try again later.');
        } else {
          setErrorMessage(error.message || 'Unable to send admin verification code.');
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
      if (err instanceof TypeError || (err instanceof Error && err.message.toLowerCase().includes('fetch'))) {
        setErrorMessage("We couldn't connect to EcoLoop authentication. Please check your internet connection and try again.");
      } else {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setErrorMessage(`Authentication error: ${msg}`);
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

  // Handle pasting full OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerifyOtp(pastedData);
    }
  };

  // Handle OTP Verification & Strict Admin Authorization
  const handleVerifyOtp = async (tokenToVerify?: string) => {
    const token = tokenToVerify || otp.join('');
    if (token.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit authorization code.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setStatus('verifying');
    setErrorMessage(null);

    try {
      const supabase = createClient();

      // Step 1: Verify OTP with Supabase Auth
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
        setErrorMessage('Authentication failed: user session not found.');
        setStatus('error');
        return;
      }

      const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
      const userEmail = (authUser.email || normalizedEmail).toLowerCase().trim();
      const isSuperAdmin = ADMIN_EMAILS.includes(userEmail);

      if (isSuperAdmin) {
        // Auto-upgrade profile to admin role
        await supabase.from('profiles').upsert({
          id: authUser.id,
          email: authUser.email || normalizedEmail,
          role: 'admin',
          full_name: 'Deepak Deshmukh (Admin)',
          is_active: true,
        }, { onConflict: 'id' });
      }

      // Step 2: Query profile securely from Supabase database to verify role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, email, role, full_name')
        .eq('id', authUser.id)
        .maybeSingle();

      const userRole = profileData?.role;
      const isAuthorizedAdmin =
        isSuperAdmin ||
        userRole === 'admin' ||
        userRole === 'society_admin' ||
        userRole === 'municipal_admin';

      // Step 3: Check authorization - strictly deny non-admin users
      if (!isAuthorizedAdmin) {
        // Sign out unauthorized session immediately
        await supabase.auth.signOut();
        setStatus('unauthorized');
        setErrorMessage('This account is not authorized for admin access.');
        return;
      }

      // Step 4: User is authorized admin
      setStatus('verified');

      // Refresh server session and redirect to admin dashboard
      router.refresh();
      setTimeout(() => {
        router.push(redirectedFrom);
      }, 400);
    } catch (err) {
      if (err instanceof TypeError || (err instanceof Error && err.message.toLowerCase().includes('fetch'))) {
        setErrorMessage("We couldn't connect to EcoLoop authentication. Please check your internet connection and try again.");
      } else {
        setErrorMessage('Network error during admin verification. Please try again.');
      }
      setStatus('error');
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setStatus('sending');
    setErrorMessage(null);

    const normalizedEmail = email.trim().toLowerCase();

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
        if (error.status === 429 || msg.includes('rate limit')) {
          setErrorMessage('Too many verification requests. Please wait a moment and try again.');
        } else {
          setErrorMessage(error.message || 'Failed to resend admin verification code.');
        }
        setStatus('error');
        return;
      }

      setStatus('sent');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch {
      setErrorMessage("We couldn't connect to EcoLoop authentication. Please check your internet connection and try again.");
      setStatus('error');
    }
  };

  // Change Email Action
  const handleChangeEmail = () => {
    setStep('email');
    setStatus('idle');
    setErrorMessage(null);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#090e17] flex flex-col justify-center items-center px-4 py-12 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#006c49]/15 dark:bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-[#cbd5e1] dark:border-[#1f2937] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <Logo />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] dark:text-[#34d399] text-xs font-bold mt-2">
            <span className="material-symbols-outlined text-[14px]">shield_person</span>
            <span>Restricted Access</span>
          </div>
          <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white tracking-tight">
            EcoLoop Admin Portal
          </h1>
          <p className="text-xs text-[#475569] dark:text-[#94a3b8] max-w-xs">
            Manage society waste-management performance, residents, verification and rewards.
          </p>
        </div>

        {/* Error Alert / Unauthorized Alert */}
        {errorMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
              status === 'unauthorized'
                ? 'bg-[#fee2e2] dark:bg-[#7f1d1d]/30 border-[#ef4444]/40 text-[#991b1b] dark:text-[#fca5a5]'
                : 'bg-[#ffdad6]/60 dark:bg-[#93000a]/20 border-[#ba1a1a]/30 text-[#ba1a1a] dark:text-[#ffb4ab]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
              {status === 'unauthorized' ? 'lock' : 'error'}
            </span>
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* STEP 1: Enter Admin Email */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="admin-email"
                className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1.5"
              >
                Authorized Administrator Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#64748b]">
                  admin_panel_settings
                </span>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@society.org"
                  required
                  autoFocus
                  disabled={status === 'sending'}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-sm text-[#0b1c30] dark:text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#006c49] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
              <p className="text-[11px] text-[#64748b] dark:text-[#94a3b8] mt-1.5">
                Admin accounts are pre-authorized by the municipal or society administrator.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 px-4 bg-[#006c49] hover:bg-[#005137] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#006c49]/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {status === 'sending' ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Sending Admin Code...</span>
                </>
              ) : (
                <>
                  <span>Send Admin Code</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter 6-Digit Admin OTP */}
        {step === 'otp' && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="text-xs text-[#475569] dark:text-[#94a3b8]">
                Admin code sent to <span className="font-bold text-[#0b1c30] dark:text-white">{email}</span>
              </div>
              <button
                type="button"
                onClick={handleChangeEmail}
                className="text-[11px] text-[#006c49] dark:text-[#34d399] hover:underline font-semibold mt-0.5 inline-block"
              >
                Change admin email
              </button>
            </div>

            {/* 6 OTP Inputs */}
            <div>
              <div className="flex justify-between gap-2 sm:gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    disabled={status === 'verifying' || status === 'verified'}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#f8fafc] dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-[#0b1c30] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006c49] focus:border-transparent transition-all disabled:opacity-50"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={status === 'verifying' || status === 'verified' || otp.join('').length !== 6}
              className="w-full py-3 px-4 bg-[#006c49] hover:bg-[#005137] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#006c49]/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {status === 'verifying' ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Verifying Admin Rights...</span>
                </>
              ) : status === 'verified' ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Authorized! Opening Portal...</span>
                </>
              ) : (
                <>
                  <span>Verify Admin Authorization</span>
                  <span className="material-symbols-outlined text-[18px]">security</span>
                </>
              )}
            </button>

            {/* Resend Cooldown Section */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#cbd5e1] dark:border-[#1f2937]">
              <span className="text-[#475569] dark:text-[#94a3b8]">Didn&apos;t receive code?</span>
              {countdown > 0 ? (
                <span className="text-[#94a3b8] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>Resend in {countdown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#006c49] dark:text-[#34d399] hover:underline font-bold"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        )}

        {/* Strict Admin Security Notice */}
        <div className="pt-3 border-t border-[#cbd5e1] dark:border-[#1f2937] flex items-center justify-center gap-1.5 text-[11px] text-[#64748b] dark:text-[#94a3b8]">
          <span className="material-symbols-outlined text-[14px] text-[#006c49] dark:text-[#34d399]">
            lock
          </span>
          <span>Access strictly restricted to certified Municipal & Society Admins</span>
        </div>
      </div>
    </div>
  );
}
