'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Landing3DScene from '@/components/Landing3DScene';
import { useApp } from '@/lib/state/store';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const { theme, setTheme } = useApp();
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Check auth state and redirect if authenticated
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
          const userEmail = user.email?.toLowerCase().trim() || '';
          const isSuperAdminEmail = ADMIN_EMAILS.includes(userEmail);
          let isAdmin = isSuperAdminEmail;

          if (!isAdmin) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();
            isAdmin =
              profile?.role === 'admin' ||
              profile?.role === 'society_admin' ||
              profile?.role === 'municipal_admin';
          }
          router.replace(isAdmin ? '/admin/dashboard' : '/resident/dashboard');
          return;
        }
      } catch {
        // ignore — user not logged in, show landing page
      }
      setChecking(false);
    };

    checkAuth();
  }, [router]);

  const isDarkMode =
    mounted &&
    (theme === 'dark' ||
      (theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches));

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  // While checking auth, show minimal transparent spinner
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1120]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading EcoLoop…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300 flex flex-col relative overflow-x-hidden">
      {/* Ambient Specular Glow Underlays */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-400/20 dark:bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-64 -left-24 w-80 h-80 bg-emerald-400/20 dark:bg-teal-500/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-96 -right-24 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-30 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">recycling</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Eco<span className="text-emerald-500">Loop</span>
            </span>
          </Link>

          {/* Vision Engine Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm border border-slate-200/70 dark:border-white/10 transition-colors ml-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold">
              Vision Engine v4.2
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/70 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mounted && isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <Link
            href="/admin/login"
            className="hidden md:inline-flex items-center text-xs font-semibold px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Admin Portal
          </Link>

          <Link
            href="/resident/login"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <span>Resident Portal</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-16 flex flex-col items-center z-10">
        {/* Shimmering Top Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200/80 dark:border-white/10 mb-5 transition-colors">
          <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px]">recycling</span>
          <span className="text-xs sm:text-sm text-teal-700 dark:text-teal-300 tracking-wide font-medium">
            Next-Gen AI Recycling • Powered by Computer Vision
          </span>
        </div>

        {/* Impact Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-center text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-5 transition-colors max-w-3xl">
          Recycle Smarter.<br />
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
            Live Greener.
          </span><br />
          <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Close the Loop.
          </span>
        </h1>

        {/* Value Statement */}
        <p className="text-base sm:text-lg text-center text-slate-600 dark:text-slate-300 max-w-lg mb-7 sm:mb-8 transition-colors">
          AI-powered recycling that helps you identify waste, build better habits, and make every sustainable action count.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm mb-8 sm:mb-10">
          <Link
            href="/resident/login"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-95 transition-all text-center"
          >
            <span>Start Recycling</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
          <Link
            href="/resident/login"
            className="w-full sm:w-auto flex-1 flex items-center justify-center px-6 py-3.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/10 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-sm active:scale-95 transition-all text-center"
          >
            Resident Sign In
          </Link>
        </div>

        {/* 3D Interactive Centerpiece */}
        <section className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center mb-8">
          {/* Radial Ambient Backlight */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/30 via-teal-400/25 to-cyan-400/30 blur-3xl"></div>
          </div>

          {/* Three.js Interactive 3D Scene */}
          <Landing3DScene />

          {/* Floating Micro-Pill */}
          <div className="relative mt-3 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md border border-slate-200/70 dark:border-white/10 pointer-events-none transition-colors">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[16px]">view_in_ar</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
              360° Live Waste Classifier • Drag to Rotate
            </span>
          </div>
        </section>

        {/* EcoLoop Intelligence Matrix Card */}
        <section className="w-full max-w-md mx-auto mb-14 z-20">
          <div className="w-full rounded-2xl p-5 bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl border border-slate-200/70 dark:border-white/10 flex flex-col gap-3.5 transition-colors">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  EcoLoop Intelligence Matrix
                </span>
              </div>
              <span className="font-mono text-[11px] text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200/50 dark:border-teal-800 font-semibold tracking-wide">
                REALTIME
              </span>
            </div>

            {/* Telemetry Columns */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="flex items-center gap-1 mb-1 text-teal-600 dark:text-teal-400">
                  <span className="material-symbols-outlined text-[16px]">eco</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Habit</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">92%</span>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="flex items-center gap-1 mb-1 text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-[16px]">toll</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Points</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">1,240</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5 font-semibold">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>+180
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="flex items-center gap-1 mb-1 text-cyan-600 dark:text-cyan-400">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">86</span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-1">items scan</span>
              </div>
            </div>

            {/* Live ticker */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 text-xs border border-slate-200/50 dark:border-slate-800">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[16px] text-teal-600 dark:text-teal-400">filter_center_focus</span>
                <span>Latest: PET Bottle Sorted</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">+15 pts</span>
            </div>
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/60 dark:border-white/5 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[22px]">center_focus_strong</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Instant AI Scan</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Snap a picture or point your camera. Our vision model categorizes items into wet, dry, plastic, and e-waste instantly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/60 dark:border-white/5 hover:border-teal-500/30 hover:-translate-y-1 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[22px]">leaderboard</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Society Habit Index</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Track building-wide segregation hygiene, unlock monthly maintenance discounts, and compete on zero-landfill tiers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/60 dark:border-white/5 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">QR Proof of Drop</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Verify sorting at smart bin drop stations with QR logs, earn green points, and redeem rewards with neighborhood partners.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/70 dark:border-white/10 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} EcoLoop — Next-Gen 3D Sustainability Platform</p>
          <div className="flex items-center gap-4">
            <Link href="/resident/login" className="hover:text-emerald-500 transition-colors">Resident Portal</Link>
            <Link href="/admin/login" className="hover:text-emerald-500 transition-colors">Admin Portal</Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
