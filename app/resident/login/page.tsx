'use client';

import React, { useState, useEffect, useRef } from 'react';
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
      // emailRedirectTo ensures the magic link goes to /auth/callback
      // so the token is exchanged server-side and the user is logged in
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
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
      // Focus first OTP field after state updates
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
    // Only accept numeric input
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto-advance cursor
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
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

      // Ensure profile exists in Supabase database
      // (The DB trigger handle_new_user auto-creates on first signup;
      //  this is a safety net for edge cases)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!existingProfile) {
        const namePart = normalizedEmail.split('@')[0].replace(/[0-9_.]+/g, ' ').trim();
        const formattedName = namePart
          ? namePart.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
          : 'Resident Member';

        // Note: society_id is a UUID FK — do not pass string IDs
        // The DB trigger already handles this on user creation
        await supabase.from('profiles').upsert({
          id: authUser.id,
          email: authUser.email || normalizedEmail,
          full_name: authUser.user_metadata?.full_name || formattedName,
          role: 'resident',
          eco_points: 50,
          current_streak: 0,
          consistency_score: 80.0,
          total_verifications: 0,
          tier_level: 1,
          is_active: true,
        }, { onConflict: 'id' });
      }

      setStatus('verified');

      // Refresh server session and navigate to resident dashboard
      router.refresh();
      setTimeout(() => {
        router.push(redirectedFrom);
      }, 400);
    } catch (err) {
      if (err instanceof TypeError || (err instanceof Error && err.message.toLowerCase().includes('fetch'))) {
        setErrorMessage("We couldn't connect to EcoLoop authentication. Please check your internet connection and try again.");
      } else {
        setErrorMessage('Verification failed. Please try again.');
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
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (error.status === 429 || msg.includes('rate limit')) {
          setErrorMessage('Too many verification requests. Please wait a moment and try again.');
        } else {
          setErrorMessage(error.message || 'Failed to resend verification code.');
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
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] flex flex-col justify-center items-center px-4 py-12 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#10b981]/15 dark:bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <Logo />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/10 text-[#006c49] dark:text-[#10b981] text-xs font-bold mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            <span>Resident Access</span>
          </div>
          <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white tracking-tight">
            EcoLoop Resident
          </h1>
          <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] max-w-xs">
            Manage your waste habits, earn rewards and improve your Eco Score.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#ffdad6]/60 dark:bg-[#93000a]/20 border border-[#ba1a1a]/30 text-[#ba1a1a] dark:text-[#ffb4ab] text-xs flex items-start gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="resident-email"
                className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1.5"
              >
                Apartment Household Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#3c4a42] dark:text-[#94a3b8]">
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
                  className="w-full pl-10 pr-4 py-3 bg-[#f8f9ff] dark:bg-[#1a263e] border border-[#e2e8f0] dark:border-[#27354f] rounded-xl text-sm text-[#0b1c30] dark:text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
              <p className="text-[11px] text-[#64748b] dark:text-[#94a3b8] mt-1.5">
                We will send a secure 6-digit one-time code to verify your identity.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 px-4 bg-[#10b981] hover:bg-[#006c49] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#10b981]/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {status === 'sending' ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter 6-Digit OTP */}
        {step === 'otp' && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                Code sent to <span className="font-bold text-[#0b1c30] dark:text-white">{email}</span>
              </div>
              <button
                type="button"
                onClick={handleChangeEmail}
                className="text-[11px] text-[#10b981] hover:underline font-semibold mt-0.5 inline-block"
              >
                Change email address
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
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#f8f9ff] dark:bg-[#1a263e] border border-[#e2e8f0] dark:border-[#27354f] rounded-xl text-[#0b1c30] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all disabled:opacity-50"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={status === 'verifying' || status === 'verified' || otp.join('').length !== 6}
              className="w-full py-3 px-4 bg-[#10b981] hover:bg-[#006c49] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#10b981]/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {status === 'verifying' ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Verifying Code...</span>
                </>
              ) : status === 'verified' ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Verified! Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Verify & Enter Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </>
              )}
            </button>

            {/* Resend Cooldown Section */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#e2e8f0] dark:border-[#1e293b]">
              <span className="text-[#3c4a42] dark:text-[#94a3b8]">Didn&apos;t receive code?</span>
              {countdown > 0 ? (
                <span className="text-[#94a3b8] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>Resend in {countdown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#10b981] hover:underline font-bold"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        )}

        {/* Security Assurance Footer */}
        <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-center gap-1.5 text-[11px] text-[#64748b] dark:text-[#94a3b8]">
          <span className="material-symbols-outlined text-[14px] text-[#10b981]">
            verified_user
          </span>
          <span>Passwordless Supabase Auth • End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
}
