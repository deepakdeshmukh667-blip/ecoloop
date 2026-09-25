'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useApp } from '@/lib/state/store';
import Landing3DScene from '@/components/Landing3DScene';

// ─── Inline SVG Icons (Zero-delay, 100% reliable rendering) ────
const Icons = {
  Leaf: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  EcoBadge: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Sun: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Moon: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  ArrowRight: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Cube3D: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Verified: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Bolt: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Sync: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  TouchApp: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11m0-5.5a1.5 1.5 0 013 0v4.5" />
    </svg>
  ),
  Hub: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-4H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  ),
  Sensors: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Speed: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Location: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Token: ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Building: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6" />
    </svg>
  ),
  Calendar: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  User: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Lock: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Mail: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Close: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Google: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
      />
    </svg>
  ),
};

// ─── Real-time Greeting Hook ──────────────────────────────────
function useGreeting() {
  const [greeting, setGreeting] = useState('');
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
        setEmoji('🌅');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon');
        setEmoji('☀️');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening');
        setEmoji('🌇');
      } else {
        setGreeting('Good Night');
        setEmoji('🌙');
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return { greeting, emoji };
}

// ─── Live Clock Component ─────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}

export default function HomePage() {
  const { theme, setTheme } = useApp();
  const router = useRouter();
  const { greeting, emoji } = useGreeting();
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auth modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [redirectedFrom, setRedirectedFrom] = useState('/resident/dashboard');

  // Sign up OTP states
  const [signUpStep, setSignUpStep] = useState<'form' | 'otp'>('form');
  const [signUpOtp, setSignUpOtp] = useState(['', '', '', '', '', '']);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const from = params.get('redirectedFrom');
      const err = params.get('error') || params.get('error_description');
      if (err) {
        const decoded = decodeURIComponent(err);
        if (decoded.includes('provider is not enabled') || decoded.includes('validation_failed')) {
          setAuthError('Google Sign-In is not yet enabled. Please use Email & Password login or the 1-Click Demo.');
        } else if (decoded.includes('google_signin_failed') || decoded.includes('link_expired') || decoded.includes('invalid_auth')) {
          setAuthError('Google Sign-In failed or the link expired. Please try again or use Email & Password.');
        } else if (decoded.includes('provider') || decoded.includes('oauth')) {
          setAuthError('OAuth provider error. Please use Email & Password login instead.');
        } else {
          setAuthError(decoded);
        }
        setShowAuthModal(true);
      } else if (from) {
        setRedirectedFrom(from);
        setShowAuthModal(true);
      }
    }

    const timer = setTimeout(() => {
      setChecking(false);
    }, 1500);

    const checkAuth = async () => {
      // If we came back from an OAuth error, don't auto-redirect — show the error
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('error') || params.get('error_description')) {
          clearTimeout(timer);
          setChecking(false);
          return;
        }
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
          const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase().trim() || '');
          if (!isAdmin) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();
            if (
              profile?.role === 'admin' ||
              profile?.role === 'society_admin' ||
              profile?.role === 'municipal_admin'
            ) {
              clearTimeout(timer);
              router.replace('/admin/dashboard');
              return;
            }
          } else {
            clearTimeout(timer);
            router.replace('/admin/dashboard');
            return;
          }
          clearTimeout(timer);
          router.replace('/resident/dashboard');
          return;
        }
      } catch {
        /* not logged in */
      }
      clearTimeout(timer);
      setChecking(false);
    };
    checkAuth();

    return () => clearTimeout(timer);
  }, [router]);


  const isDark =
    mounted &&
    (theme === 'dark' ||
      (theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches));

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter your email and password.');
      return;
    }
    setSigningIn(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const supabase = createClient();
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('invalid login credentials')) {
          setAuthError('Invalid email or password. If you are a new user, click "Create Account" to sign up!');
        } else {
          setAuthError(error.message);
        }
        setSigningIn(false);
        return;
      }
      if (data.user) {
        if (typeof document !== 'undefined') {
          document.cookie = 'ecoloop_session=true; path=/; max-age=604800; SameSite=Lax';
        }
        const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
        const userEmail = data.user.email?.toLowerCase().trim() || '';
        const isAdmin = ADMIN_EMAILS.includes(userEmail);
        let adminRole = isAdmin;
        if (!adminRole) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
          adminRole =
            profile?.role === 'admin' ||
            profile?.role === 'society_admin' ||
            profile?.role === 'municipal_admin';
        }
        router.push(adminRole ? '/admin/dashboard' : redirectedFrom);
      }
    } catch {
      setAuthError('Something went wrong. Please check your connection and try again.');
      setSigningIn(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setAuthError('Please enter your full name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    setSigningIn(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const supabase = createClient();
      const siteUrl = (typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL) || 'https://ecoloop-deepakdeshmukh667-7678.vercel.app';
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        setAuthError(error.message);
        setSigningIn(false);
        return;
      }

      if (data.session) {
        if (typeof document !== 'undefined') {
          document.cookie = 'ecoloop_session=true; path=/; max-age=604800; SameSite=Lax';
        }
        router.push(redirectedFrom);
      } else {
        // Switch to OTP verification step
        setSignUpStep('otp');
        setOtpCountdown(60);
        setAuthSuccess(`A 6-digit OTP verification code has been sent to ${email}. Please check your inbox.`);
        setSigningIn(false);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      }
    } catch {
      setAuthError('Failed to create account. Please check your connection and try again.');
      setSigningIn(false);
    }
  };

  const handleVerifySignUpOtp = async (tokenToVerify?: string) => {
    const token = tokenToVerify || signUpOtp.join('');
    if (token.length !== 6) {
      setAuthError('Please enter the complete 6-digit OTP code.');
      return;
    }
    setOtpVerifying(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const supabase = createClient();
      const normalizedEmail = email.trim().toLowerCase();

      let { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: token.trim(),
        type: 'signup',
      });

      if (error) {
        const fallback = await supabase.auth.verifyOtp({
          email: normalizedEmail,
          token: token.trim(),
          type: 'email',
        });
        data = fallback.data;
        error = fallback.error;
      }

      if (error) {
        setAuthError(error.message || 'Verification failed. Please check the code and try again.');
        setOtpVerifying(false);
        return;
      }

      if (typeof document !== 'undefined') {
        document.cookie = 'ecoloop_session=true; path=/; max-age=604800; SameSite=Lax';
      }

      if (data.user) {
        await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            auth_user_id: data.user.id,
            email: normalizedEmail,
            full_name: fullName.trim() || 'Eco Resident',
            role: 'resident',
            eco_points: 50,
            current_streak: 0,
            consistency_score: 80,
          },
          { onConflict: 'id' }
        );
      }

      router.push(redirectedFrom);
    } catch {
      setAuthError('OTP verification error. Please try again.');
      setOtpVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...signUpOtp];
    newOtp[index] = cleanVal;
    setSignUpOtp(newOtp);

    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (newOtp.join('').length === 6) {
      handleVerifySignUpOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !signUpOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...signUpOtp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setSignUpOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerifySignUpOtp(pastedData);
    }
  };

  const handleResendSignUpOtp = async () => {
    if (otpCountdown > 0) return;
    setAuthError('');
    setAuthSuccess('');
    try {
      const supabase = createClient();
      const siteUrl = (typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL) || 'https://ecoloop-deepakdeshmukh667-7678.vercel.app';
      await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      setAuthSuccess(`Verification OTP code resent to ${email}. Check your inbox.`);
      setOtpCountdown(60);
      setSignUpOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch {
      setAuthError('Failed to resend OTP code.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const supabase = createClient();
      const siteUrl = (typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL) || 'https://ecoloop-deepakdeshmukh667-7678.vercel.app';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });
      if (error) {
        setAuthError(error.message);
        setIsGoogleSigningIn(false);
      }
    } catch {
      setAuthError('Google sign-in failed. Please try again.');
      setIsGoogleSigningIn(false);
    }
  };

  const handleDemoResidentLogin = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'ecoloop_session=true; path=/; max-age=604800; SameSite=Lax';
      document.cookie = 'ecoloop_demo=true; path=/; max-age=604800; SameSite=Lax';
    }
    router.push('/resident/dashboard');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f131b]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading EcoLoop…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f131b] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300 relative overflow-hidden flex flex-col">

        {/* ── ATMOSPHERIC AMBIENT GLOWS ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-gradient-to-tr from-emerald-500/15 via-teal-400/20 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-[750px] right-0 w-[600px] h-[500px] bg-gradient-to-bl from-teal-400/10 via-emerald-500/15 to-transparent blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-[1600px] left-0 w-[550px] h-[450px] bg-gradient-to-tr from-cyan-400/15 via-teal-400/10 to-transparent blur-[110px] rounded-full pointer-events-none -z-10"></div>

        {/* ── TOP HEADER / NAVBAR (PIXEL-PERFECT DESKTOP LAYOUT) ── */}
        <header className="fixed top-0 left-0 w-full z-50 bg-white/85 dark:bg-[#0f131b]/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5 shadow-xs">
          <div className="h-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-[0_0_24px_-4px_rgba(13,148,136,0.35)] shrink-0">
                <Icons.Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-tight">
                  EcoLoop
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">
                  Circular Tech
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                How It Works
              </a>
              <a href="#impact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Impact
              </a>
            </nav>

            {/* Right Tools & Auth Controls */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Real-time greeting pill */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shrink-0">
                <span>{emoji}</span>
                <span>{greeting}</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <LiveClock />
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label="Toggle theme"
                className="w-9 h-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
              >
                {mounted && isDark ? <Icons.Sun className="w-4 h-4 text-amber-400" /> : <Icons.Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Sign In Button */}
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                Sign In
              </button>

              {/* Get Started Button */}
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-[0_0_24px_-4px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
              >
                <span>Get Started</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>

              {/* Resident Profile Quick Access Avatar */}
              <button
                type="button"
                onClick={handleDemoResidentLogin}
                title="1-Click Resident Demo Login"
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs transition-colors"
              >
                <Icons.User className="w-4 h-4" />
              </button>
            </div>

          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="w-full pt-28 pb-16 flex-1 flex flex-col items-center">

          {/* ── HERO SECTION ── */}
          <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14 flex flex-col items-center text-center relative">
            {/* Eyebrow Pill */}
            <div
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 shadow-xs mb-6 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 tracking-wide">
                Next-Gen AI Recycling • Powered by Computer Vision →
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6">
              Recycle Smarter.
              <br />
              <span className="bg-gradient-to-r from-[#10b981] via-[#14b8a6] to-[#0ea5e9] bg-clip-text text-transparent">
                Live Greener. Close the Loop.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              AI-powered recycling that helps you identify waste, build better habits, and make every sustainable action count.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0D9488] to-[#10B981] text-white text-sm font-bold hover:shadow-[0_0_28px_-2px_rgba(16,185,129,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Start Recycling</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-emerald-300 transition-all duration-200 shadow-xs"
              >
                <Icons.Cube3D className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Explore EcoLoop</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-12">
              <div className="flex items-center gap-2">
                <Icons.Verified className="w-4 h-4 text-[#10b981]" />
                <span className="font-medium text-slate-700 dark:text-slate-300">99.4% Recognition Accuracy</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-2">
                <Icons.Bolt className="w-4 h-4 text-[#0ea5e9]" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Real-time Sorting Guides</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-2">
                <Icons.Sync className="w-4 h-4 text-[#14b8a6]" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Verified Material Traceability</span>
              </div>
            </div>

            {/* ── 3D INTERACTIVE CONTAINER ── */}
            <div className="w-full relative rounded-2xl p-2 bg-gradient-to-b from-white/90 via-white/50 to-white/95 dark:from-slate-900/90 dark:via-slate-900/50 dark:to-slate-900/95 border border-emerald-100/80 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.12)] backdrop-blur-md">
              <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-b from-emerald-50/60 via-teal-50/30 to-white dark:from-[#0d1625] dark:via-[#09101b] dark:to-[#0f131b] border border-emerald-100/60 dark:border-white/5 min-h-[460px] sm:min-h-[520px]">

                {/* Soft Radial Background Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400/20 via-teal-300/10 to-transparent pointer-events-none"></div>

                {/* Live HUD Overlays */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-emerald-200/60 dark:border-emerald-700/60 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
                  <span className="font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold tracking-tight">
                    360° Interactive Eco-Mesh
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 shadow-xs">
                  <Icons.TouchApp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Drag to Orbit • Mouse Parallax Active
                  </span>
                </div>

                {/* Embedded Three.js 3D Scene */}
                <div className="w-full h-[460px] sm:h-[520px] bg-transparent block relative z-0">
                  <Landing3DScene />
                </div>

                {/* Ambient Bottom Scrim for seamless blend */}
                <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-[#0f131b] dark:via-[#0f131b]/70 dark:to-transparent pointer-events-none z-10"></div>
              </div>

              {/* ── ECOLOOP INTELLIGENCE MATRIX CARD (Floating Overlap) ── */}
              <div className="relative -mt-10 sm:-mt-14 mx-auto max-w-4xl z-30 p-4 sm:p-6 rounded-2xl bg-white/95 dark:bg-[#151c28]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-[0_16px_36px_-8px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Icons.Hub className="w-5 h-5 text-[#0D9488] dark:text-teal-400" />
                      <span className="text-base font-bold text-slate-900 dark:text-white">EcoLoop Intelligence Matrix</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#005236] dark:text-emerald-300 font-mono text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                      STREAM ACTIVE
                    </div>
                  </div>

                  {/* Real-Time Metrics Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Metric 1 */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Eco Habit Index</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">92%</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                          ↑ +4% this week
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Tier: Sovereign</span>
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recycling Points</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">1,240</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/70 px-2 py-0.5 rounded-full">
                          +180 pts today
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">32.4 kg CO₂ saved</span>
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Scans</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          86 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">items</span>
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center text-xs font-semibold text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/70 px-2 py-0.5 rounded-full">
                          Zero Error Rate
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">100% compliant</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Feed Ticker */}
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-800/40 text-left">
                    <Icons.Sensors className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="flex-1 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap">
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">FEED:</span> PET Bottle Sorted •{' '}
                      <span className="text-teal-700 dark:text-teal-300 font-medium">+15 pts credited</span> • 2.4s classification • Hub #402 •{' '}
                      <span className="text-slate-500 dark:text-slate-400">Just now</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">Sync 12ms</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── FEATURES SECTION ── */}
          <section id="features" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative scroll-mt-24">
            {/* Section Header */}
            <div className="max-w-3xl mb-12 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
                <Icons.Speed className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>High-Precision Infrastructure</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 leading-tight">
                Engineered for Zero Waste Ecosystems
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Hardware-agnostic computer vision algorithms trained on over 2.4 million material samples for instantaneous sorting guidance.
              </p>
            </div>

            {/* 3 Clean Grid Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Feature Card 1 */}
              <div className="group flex flex-col p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#151c28] border border-slate-200 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-[0_16px_32px_-6px_rgba(16,185,129,0.12)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                  <Icons.Speed className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50/80 dark:bg-emerald-950/40 px-2 py-0.5 rounded w-fit">
                  <span>&lt;85ms LATENCY</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Sub-Second Classification
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 flex-1">
                  Deep neural vision isolates mixed polymers, bioplastics, non-rigid films, and composite multilayer packaging under variable natural lighting conditions.
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Accuracy rate: 99.4%</span>
                  <Icons.ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="group flex flex-col p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#151c28] border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-[0_16px_32px_-6px_rgba(20,184,166,0.12)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                  <Icons.Location className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs text-teal-700 dark:text-teal-400 font-semibold bg-teal-50/80 dark:bg-teal-950/40 px-2 py-0.5 rounded w-fit">
                  <span>1,400+ ACTIVE HUBS</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Local Facility Dispatch
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 flex-1">
                  Dynamic municipal routing rules synced continuously with regional MRFs, specialized electronics recyclers, and chemical downcycling plants.
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Geo-mesh verified</span>
                  <Icons.ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group flex flex-col p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#151c28] border border-slate-200 dark:border-white/10 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-[0_16px_32px_-6px_rgba(14,165,233,0.12)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                  <Icons.Token className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-2 mb-2 font-mono text-xs text-cyan-700 dark:text-cyan-400 font-semibold bg-cyan-50/80 dark:bg-cyan-950/40 px-2 py-0.5 rounded w-fit">
                  <span>100% ON-CHAIN</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  EcoCredit Liquidity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 flex-1">
                  Instantly convert validated waste deposits into utility credits for public transit vouchers, grocery micro-rebates, and verified Gold Standard carbon offsets.
                </p>
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Instant ledger settlement</span>
                  <Icons.ArrowRight className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </section>

          {/* ── IMPACT SECTION ── */}
          <section id="impact" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative scroll-mt-24">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/20 via-teal-500/20 to-transparent blur-3xl pointer-events-none"></div>
              <div className="flex flex-col text-left z-10 max-w-xl">
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                  Automated Environmental Ledger
                </span>
                <h4 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                  Over 38,400 Metric Tons of Ocean-Bound Plastics Diverted in 2024
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Deployed across 42 smart cities and university campuses across North America &amp; Europe with certified chain-of-custody.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-8 sm:gap-12 z-10">
                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">4.2M+</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Monthly Scans</span>
                </div>
                <div className="w-px h-14 bg-slate-800 hidden sm:block"></div>
                <div className="flex flex-col">
                  <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight">95.8%</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Campus Diversion Avg</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS / INSTITUTIONAL CTA SECTION ── */}
          <section id="how-it-works" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative scroll-mt-24">
            <div className="w-full rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-cyan-50 dark:from-[#0d1625] dark:via-[#111b2b] dark:to-[#0c1421] border border-emerald-200/80 dark:border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-sm">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-950/60 text-[#005236] dark:text-emerald-300 text-xs font-semibold mb-3">
                  <Icons.Building className="w-4 h-4 text-[#005236] dark:text-emerald-300" />
                  Institutional Partnership Program
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                  Empower your campus or city to reach 95%+ diversion rates
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Integrate EcoLoop&apos;s turnkey optical sorting APIs into municipal bins, reverse vending machines, or resident mobile suites within 48 hours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-semibold transition-all duration-200 shadow-md active:scale-95"
                >
                  <span>Book Live Demo</span>
                  <Icons.Calendar className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDemoResidentLogin}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 active:scale-95"
                >
                  <span>Instant Resident Demo</span>
                </button>
              </div>
            </div>
          </section>

        </main>

        {/* ── FOOTER ── */}
        <footer className="w-full border-t border-slate-200/80 dark:border-white/5 py-10 bg-white/40 dark:bg-[#0a0e15]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Icons.Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} EcoLoop Circular Tech Systems. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <Link href="/resident/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Features
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link href="/admin/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </footer>

        {/* ── AUTH MODAL OVERLAY ── */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-fadeIn">
            <div
              className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-white/10 shadow-2xl animate-scaleUp"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setSignUpStep('form');
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <Icons.Close className="w-4 h-4" />
              </button>

              {/* Mode Tabs (Sign In vs Create Account) */}
              <div className="flex p-1 mb-5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setSignUpStep('form');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-[#1e293b] text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setSignUpStep('form');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-[#1e293b] text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 mb-3">
                  <Icons.Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {authMode === 'signin'
                    ? 'Sign in to EcoLoop'
                    : signUpStep === 'otp'
                    ? 'Verify Email OTP'
                    : 'Create Your EcoLoop Account'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {authMode === 'signin'
                    ? 'Access your AI waste classification workspace'
                    : signUpStep === 'otp'
                    ? `Enter 6-digit code sent to ${email}`
                    : 'Join your society in circular zero-waste initiative'}
                </p>
              </div>

              {/* STEP: SIGN UP OTP VERIFICATION */}
              {authMode === 'signup' && signUpStep === 'otp' ? (
                <div className="flex flex-col gap-4">
                  {authSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                      {authSuccess}
                    </div>
                  )}

                  {authError && (
                    <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-medium">
                      {authError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 text-center mb-2">
                      Enter 6-Digit Email OTP Code
                    </label>
                    <div className="flex justify-between gap-2 sm:gap-2.5">
                      {signUpOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          disabled={otpVerifying}
                          className="w-10 h-12 text-center text-lg font-bold bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-50"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerifySignUpOtp()}
                    disabled={otpVerifying || signUpOtp.join('').length !== 6}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {otpVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying Code…
                      </>
                    ) : (
                      <>
                        Verify OTP & Create Account
                        <Icons.ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => setSignUpStep('form')}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      ← Edit details
                    </button>
                    {otpCountdown > 0 ? (
                      <span className="text-slate-400 font-medium">Resend in {otpCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendSignUpOtp}
                        className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Resend OTP Code
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* STEP: NORMAL SIGN IN OR SIGN UP FORM */
                <>
                  {/* OAuth & 1-Click Resident Demo */}
                  <div className="flex flex-col gap-2 mb-3">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleSigningIn}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      {isGoogleSigningIn ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-emerald-500 rounded-full animate-spin"></div>
                      ) : (
                        <Icons.Google className="w-4 h-4" />
                      )}
                      <span>{authMode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDemoResidentLogin}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-500/40 dark:border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Icons.Bolt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      1-Click Resident Demo Login
                    </button>
                  </div>

                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                    <span className="text-xs text-slate-400 font-medium">or email & password</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp}
                    className="flex flex-col gap-3"
                  >
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icons.User className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            placeholder="Deepak Deshmukh"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icons.Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          placeholder="name@society.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icons.Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        >
                          {showPass ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {authError && (
                      <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-medium">
                        {authError}
                      </div>
                    )}

                    {authSuccess && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                        {authSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={signingIn}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 active:scale-95 disabled:opacity-60 transition-all mt-1 cursor-pointer"
                    >
                      {signingIn ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          {authMode === 'signin' ? 'Signing in…' : 'Sending OTP Code…'}
                        </>
                      ) : (
                        <>
                          {authMode === 'signin' ? 'Sign In to Dashboard' : 'Send Verification OTP'}
                          <Icons.ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2 text-xs">
                    {authMode === 'signin' ? (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">New to EcoLoop?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('signup');
                            setSignUpStep('form');
                            setAuthError('');
                            setAuthSuccess('');
                          }}
                          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Create Account →
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Already have an account?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('signin');
                            setSignUpStep('form');
                            setAuthError('');
                            setAuthSuccess('');
                          }}
                          className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Sign In →
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100/60 dark:border-white/5">
                      <span className="text-slate-400 dark:text-slate-500">Society Administrator?</span>
                      <Link
                        href="/admin/login"
                        className="font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        Admin Portal →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
