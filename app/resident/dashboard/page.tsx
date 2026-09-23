'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function ResidentDashboardPage() {
  const router = useRouter();
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsUnauthorized(params.get('error') === 'unauthorized_admin');
    }
  }, []);
  const {
    profile,
    verifications,
    leaderboardResidents,
    setIsSpotCheckModalOpen,
    setIsRewardModalOpen,
  } = useApp();

  const [isInlineScannerOpen, setIsInlineScannerOpen] = useState(false);

  // Check today's verification counts
  const wetDone = verifications.some((v) => v.category_slug === 'wet');
  const dryDone = verifications.some((v) => v.category_slug === 'dry');
  const specialDone = verifications.some((v) => v.category_slug === 'special');
  const completedToday = (wetDone ? 1 : 0) + (dryDone ? 1 : 0) + (specialDone ? 1 : 0);

  // Compute live ranking and overtake competitor
  const userRankIndex = leaderboardResidents.findIndex(
    (r) => r.id === profile.id || (profile.email ? r.email === profile.email : false)
  );
  const userRank = userRankIndex !== -1 ? leaderboardResidents[userRankIndex].rank : leaderboardResidents.length;
  const competitorAbove = userRankIndex > 0 ? leaderboardResidents[userRankIndex - 1] : null;
  const ptsToOvertake = competitorAbove ? Math.max(1, competitorAbove.eco_points - profile.eco_points) : 0;

  // Top 3 residents or Top 2 + current user if user is below rank 3
  const displayResidents =
    userRankIndex <= 2
      ? leaderboardResidents.slice(0, 3)
      : [
          ...leaderboardResidents.slice(0, 2),
          leaderboardResidents[userRankIndex],
        ];

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 pb-24 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-6 md:gap-8">
            {isUnauthorized && (
              <div className="p-4 rounded-2xl bg-[#fee2e2] dark:bg-[#7f1d1d]/30 border border-[#ef4444]/40 text-[#991b1b] dark:text-[#fca5a5] text-xs flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] shrink-0">lock</span>
                  <span className="font-semibold">
                    Access Restricted: Your account does not have administrator authorization. To access the Society Admin Portal, please sign in with an authorized admin account.
                  </span>
                </div>
                <Link
                  href="/admin/login"
                  className="px-3 py-1 bg-[#b91c1c] text-white rounded-lg font-bold hover:bg-[#991b1b] transition-colors shrink-0"
                >
                  Admin Login
                </Link>
              </div>
            )}

            {/* Top Greeting Section with Quick Action Mini-Pills */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#dce9ff] dark:bg-[#1e293b] text-[#3c4a42] dark:text-[#94a3b8] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-[#006c49] dark:text-[#10b981]">
                    verified
                  </span>
                  <span>Verified Habit Routine</span>
                  <span className="text-[#bbcabf]">•</span>
                  <span>Green Valley Residency, {profile.flat_number || 'Apt 402B'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b1c30] dark:text-white font-headline mt-1">
                  Good morning, {profile.full_name?.split(' ')[0] || 'Deepak'}{' '}
                  <span className="inline-block animate-pulse">👋</span>
                </h1>
                <p className="text-sm md:text-base text-[#3c4a42] dark:text-[#94a3b8] max-w-2xl">
                  Your daily segregation turns community waste into verified clean resources. Zero
                  landfill pledge is live for Tower B.
                </p>
              </div>

              {/* Quick Action Mini-Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsSpotCheckModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e5eeff] dark:bg-[#1e293b] text-[#0b1c30] dark:text-white hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-xs font-semibold transition-all shadow-sm active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#e29100] text-[18px]">
                    casino
                  </span>
                  <span>Simulate Spot Check</span>
                </button>
                <button
                  onClick={() => setIsRewardModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#dae2fd] dark:bg-[#1a263e] text-[#131b2e] dark:text-[#dae2fd] hover:bg-[#bec6e0] dark:hover:bg-[#27354f] text-xs font-semibold transition-all shadow-sm active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">redeem</span>
                  <span>Redeem Café Voucher ({profile.eco_points}/500 pts)</span>
                </button>
              </div>
            </section>

            {/* Bento Grid Section: Action Deck & Habit Score Engine */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Primary Waste Verification Hub (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-[#131d31] rounded-2xl p-6 md:p-8 shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] relative overflow-hidden">
                {/* Ambient Decorative Glow */}
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#6ffbbe]/20 dark:bg-[#10b981]/10 blur-3xl pointer-events-none"></div>

                <div className="flex flex-col gap-4 z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
                      ACTIVE VERIFICATION WINDOW
                    </span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] font-medium">
                      Daily Cutoff: 8:00 PM
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight font-headline">
                        Today&apos;s Segregation
                      </span>
                      <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                        Step {completedToday + 1} of 3: Wet, Dry or Hazardous verification
                      </span>
                    </div>
                    {/* Status Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5eeff] dark:bg-[#1e293b] text-xs font-semibold text-[#006c49] dark:text-[#10b981]">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>{completedToday} of 3 Completed</span>
                    </div>
                  </div>

                  {/* Segregation Stream Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
                    {/* Wet Waste Item */}
                    <div className="flex flex-col p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] transition-transform hover:-translate-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">compost</span>
                        </span>
                        {wetDone ? (
                          <span className="material-symbols-outlined text-[#10b981] text-[20px]">
                            check_circle
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[#3c4a42] dark:text-[#94a3b8] text-[20px]">
                            pending
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-col">
                        <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                          Wet Waste
                        </span>
                        <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                          {wetDone ? '08:15 AM • AI Validated' : 'Pending verification'}
                        </span>
                      </div>
                      <div className="mt-3 pt-1 flex items-center justify-between text-xs">
                        <span className="text-[#006c49] dark:text-[#10b981] font-bold">
                          +10 pts earned
                        </span>
                        <span className="text-[#3c4a42] dark:text-[#94a3b8]">Organic</span>
                      </div>
                    </div>

                    {/* Dry Waste Item */}
                    <div className="flex flex-col p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] transition-transform hover:-translate-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-full bg-[#dae2fd] dark:bg-[#1e293b] text-[#131b2e] dark:text-[#dae2fd] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">recycling</span>
                        </span>
                        {dryDone ? (
                          <span className="material-symbols-outlined text-[#10b981] text-[20px]">
                            check_circle
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[#3c4a42] dark:text-[#94a3b8] text-[20px]">
                            pending
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-col">
                        <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                          Dry Waste
                        </span>
                        <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                          {dryDone ? '12:30 PM • AI Validated' : 'Pending verification'}
                        </span>
                      </div>
                      <div className="mt-3 pt-1 flex items-center justify-between text-xs">
                        <span className="text-[#006c49] dark:text-[#10b981] font-bold">
                          +10 pts earned
                        </span>
                        <span className="text-[#3c4a42] dark:text-[#94a3b8]">Clean Paper</span>
                      </div>
                    </div>

                    {/* Special Waste Item */}
                    <div className={`flex flex-col p-4 rounded-xl transition-transform hover:-translate-y-0.5 relative ${
                      specialDone
                        ? 'bg-[#e5eeff] dark:bg-[#27354f] border border-[#dce9ff] dark:border-[#334155]'
                        : 'bg-[#fffbeb] dark:bg-[#271f11] border border-dashed border-[#e29100]/60 dark:border-[#e29100]/50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-full bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">
                            battery_alert
                          </span>
                        </span>
                        {specialDone ? (
                          <span className="material-symbols-outlined text-[#10b981] text-[20px]">
                            check_circle
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[#e29100] text-[20px] animate-pulse">
                            hourglass_empty
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-col">
                        <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                          Special Waste
                        </span>
                        <span className="text-xs text-[#855300] dark:text-[#ffb95f] font-medium">
                          {specialDone ? 'Verified' : 'Pending verification'}
                        </span>
                      </div>
                      <div className="mt-3 pt-1 flex items-center justify-between text-xs">
                        <span className="text-[#855300] dark:text-[#ffb95f] font-semibold">
                          +15 pts eligible
                        </span>
                        <span className="text-[#3c4a42] dark:text-[#94a3b8]">E-waste/Med</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Primary CTA Trigger */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 z-10">
                  <button
                    onClick={() => router.push('/resident/verify')}
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#10b981] text-white font-headline font-bold text-base shadow-[0_10px_20px_-5px_rgba(16,185,129,0.35)] hover:bg-[#006c49] transition-all active:scale-[0.98]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                    <span>📷 Verify Today&apos;s Waste</span>
                  </button>
                  <Link
                    href="/resident/learn"
                    className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#0b1c30] dark:text-white hover:bg-[#e5eeff] dark:hover:bg-[#27354f] text-xs font-semibold transition-colors text-center"
                  >
                    Sorting Rules Guide
                  </Link>
                </div>
              </div>

              {/* Habit Vitality Arc & Quick Stats (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white dark:bg-[#131d31] rounded-2xl p-6 md:p-8 shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                        Aggregate Metric
                      </span>
                      <span className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                        Eco Habit Index
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-xs font-bold tracking-tight">
                      Super Segregator
                    </span>
                  </div>

                  {/* Circular Arc Visualization */}
                  <div className="py-4 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                          className="text-[#e5eeff] dark:text-[#1e293b]"
                          cx="60"
                          cy="60"
                          fill="transparent"
                          r="50"
                          stroke="currentColor"
                          strokeWidth="12"
                        />
                        <circle
                          className="text-[#10b981] transition-all duration-1000"
                          cx="60"
                          cy="60"
                          fill="transparent"
                          r="50"
                          stroke="currentColor"
                          strokeDasharray="314.16"
                          strokeDashoffset={314.16 - (314.16 * profile.consistency_score) / 100}
                          strokeLinecap="round"
                          strokeWidth="12"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-extrabold text-[#0b1c30] dark:text-white leading-none font-headline">
                          {Math.round(profile.consistency_score)}
                        </span>
                        <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] font-semibold">
                          / 100 PTS
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-[#006c49] dark:text-[#10b981] font-bold text-sm font-headline">
                        <span className="material-symbols-outlined text-[20px]">
                          workspace_premium
                        </span>
                        <span>Top 5% in Tower</span>
                      </div>
                      <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
                        Your verification consistency places you above 95% of community households
                        this month.
                      </p>
                      <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#eff4ff] dark:bg-[#1a263e] text-[11px] text-[#0b1c30] dark:text-white font-medium">
                          90% Verified
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#eff4ff] dark:bg-[#1a263e] text-[11px] text-[#0b1c30] dark:text-white font-medium">
                          Zero Contamination
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Metric Dual Strip */}
                  <div className="grid grid-cols-2 gap-2 pt-3 bg-[#eff4ff] dark:bg-[#1a263e] rounded-xl p-4 border border-[#dce9ff] dark:border-[#27354f]">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] font-medium">
                        Accumulated Balance
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-extrabold text-[#0b1c30] dark:text-white font-headline">
                          {profile.eco_points}
                        </span>
                        <span className="text-xs text-[#006c49] dark:text-[#10b981] font-bold">
                          pts
                        </span>
                      </div>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                        {Math.max(0, 500 - profile.eco_points)} pts until voucher
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] font-medium">
                        Daily Streak
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xl font-extrabold text-[#0b1c30] dark:text-white font-headline">
                          {profile.current_streak} Days
                        </span>
                        <span className="material-symbols-outlined text-[#e29100] text-[20px]">
                          local_fire_department
                        </span>
                      </div>
                      <span className="text-[10px] text-[#006c49] dark:text-[#10b981] font-bold mt-1">
                        {profile.current_streak > 0
                          ? 'Streak multiplier 1.2x active'
                          : 'Build a streak for 1.2x bonus'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Weekly Segregation Journey Section */}
            <section className="flex flex-col gap-4 bg-white dark:bg-[#131d31] rounded-2xl p-6 md:p-8 shadow-sm border border-[#e2e8f0] dark:border-[#1e293b]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                    Weekly Segregation Journey
                  </h2>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Audited habit verification based on 28-day routine consistency, not discarded
                    volume.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#006c49] dark:text-[#10b981] px-3.5 py-1 rounded-full bg-[#6ffbbe] dark:bg-[#006c49]">
                  <span className="material-symbols-outlined text-[16px]">format_image_left</span>
                  <span>90% 4-Week Habit Index</span>
                </div>
              </div>

              {/* 7-Day Interactive Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
                {[
                  { day: 'Mon, Oct 21', status: 'verified', pts: '+20 pts', icon: 'done_all' },
                  { day: 'Tue, Oct 22', status: 'verified', pts: '+20 pts', icon: 'done_all' },
                  {
                    day: 'Wed, Oct 23',
                    status: 'spot_passed',
                    pts: '+40 pts (2x)',
                    icon: 'casino',
                    special: true,
                  },
                  { day: 'Thu, Oct 24', status: 'verified', pts: '+20 pts', icon: 'done_all' },
                  { day: 'Fri, Oct 25', status: 'verified', pts: '+20 pts', icon: 'done_all' },
                  { day: 'Sat, Oct 26', status: 'verified', pts: '+20 pts', icon: 'done_all' },
                  {
                    day: 'Sun, Oct 27',
                    status: 'pending',
                    pts: '+15 pts left',
                    icon: 'hourglass_top',
                    isToday: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-between p-4 rounded-xl min-h-[140px] text-center transition-all ${
                      item.special
                        ? 'bg-[#dae2fd] dark:bg-[#1a263e] border-2 border-[#10b981]'
                        : item.isToday
                        ? 'bg-[#e5eeff] dark:bg-[#27354f] border border-[#10b981]/50'
                        : 'bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f]'
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        item.special
                          ? 'text-[#131b2e] dark:text-white font-bold'
                          : 'text-[#3c4a42] dark:text-[#94a3b8]'
                      }`}
                    >
                      {item.day}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center my-2 ${
                        item.special
                          ? 'bg-[#10b981] text-white shadow-md'
                          : item.isToday
                          ? 'bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8]'
                          : 'bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-bold ${
                          item.special
                            ? 'text-[#006c49] dark:text-[#10b981]'
                            : item.isToday
                            ? 'text-[#855300] dark:text-[#ffb95f]'
                            : 'text-[#006c49] dark:text-[#10b981]'
                        }`}
                      >
                        {item.special
                          ? 'Spot Passed'
                          : item.isToday
                          ? '1 Pending'
                          : 'Verified'}
                      </span>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        {item.pts}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Privacy-First Commitment Banner */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f]">
                <span className="material-symbols-outlined text-[#006c49] dark:text-[#10b981] text-[22px] mt-0.5">
                  verified_user
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                    Privacy-First Habit Verification System
                  </span>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed mt-0.5">
                    🎲 Spot checks are occasional and privacy-safe to verify genuine segregation
                    habits, never continuous surveillance. Visual data stays securely ephemeral.
                  </p>
                </div>
              </div>
            </section>

            {/* Split Community Grid: Tower Leaderboard & Inter-Tower Challenge */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Society Leaderboard Preview (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4 bg-white dark:bg-[#131d31] rounded-2xl p-6 md:p-8 shadow-sm border border-[#e2e8f0] dark:border-[#1e293b]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                      Friendly Competition
                    </span>
                    <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                      Tower B Resident Leaderboard
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">Your Rank</span>
                    <div className="text-xl font-extrabold text-[#006c49] dark:text-[#10b981] font-headline">
                      #{userRank} of {leaderboardResidents.length}
                    </div>
                  </div>
                </div>

                {competitorAbove ? (
                  <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006c49] dark:text-[#10b981] text-[18px]">
                        trending_up
                      </span>
                      <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                        You are only {ptsToOvertake} pts behind #{competitorAbove.rank} {competitorAbove.full_name} to advance!
                      </span>
                    </div>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] hidden sm:inline">
                      Live Verified
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#6ffbbe]/20 dark:bg-[#006c49]/30 border border-[#10b981] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#10b981] text-[18px]">
                        emoji_events
                      </span>
                      <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                        You are currently leading Tower B with {profile.eco_points} pts! Keep it up!
                      </span>
                    </div>
                    <span className="text-[11px] text-[#006c49] dark:text-[#10b981] font-bold hidden sm:inline">
                      #1 Rank
                    </span>
                  </div>
                )}

                {/* Leaderboard Rows */}
                <div className="flex flex-col gap-2">
                  {displayResidents.map((res) => {
                    const isMe = res.id === profile.id || (profile.email ? res.email === profile.email : false);
                    return (
                      <div
                        key={res.id}
                        className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                          isMe
                            ? 'bg-[#6ffbbe]/20 dark:bg-[#006c49]/30 border border-[#10b981]'
                            : 'hover:bg-[#eff4ff] dark:hover:bg-[#1a263e]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 text-center font-headline text-lg font-black ${
                              res.rank === 1
                                ? 'text-[#e29100]'
                                : res.rank === 2
                                ? 'text-[#565e74] dark:text-[#bec6e0]'
                                : res.rank === 3
                                ? 'text-[#855300] dark:text-[#ffb95f]'
                                : 'text-[#3c4a42] dark:text-[#94a3b8]'
                            }`}
                          >
                            {res.rank}
                          </span>
                          <img
                            src={res.avatar_url || '/deepak-avatar.png'}
                            alt={res.full_name}
                            className={`w-10 h-10 rounded-full object-cover ${
                              isMe ? 'ring-2 ring-[#10b981]' : ''
                            }`}
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                                {res.full_name}
                              </span>
                              {isMe && (
                                <span className="px-1.5 py-0.2 rounded bg-[#10b981] text-white text-[10px] font-bold">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                              {res.flat_number || 'Tower B'} • {res.current_streak}-day streak
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-extrabold ${
                              isMe
                                ? 'text-[#006c49] dark:text-[#10b981]'
                                : 'text-[#0b1c30] dark:text-white'
                            }`}
                          >
                            {res.eco_points} pts
                          </span>
                          <span
                            className={`material-symbols-outlined text-[20px] ${
                              res.rank === 1
                                ? 'text-[#e29100]'
                                : res.rank === 2
                                ? 'text-[#565e74] dark:text-[#bec6e0]'
                                : res.rank === 3
                                ? 'text-[#855300] dark:text-[#ffb95f]'
                                : 'text-[#3c4a42] dark:text-[#94a3b8]'
                            }`}
                          >
                            military_tech
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/resident/leaderboard"
                  className="mt-1 w-full py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white text-xs font-semibold text-center transition-colors"
                >
                  View Complete Tower Standings
                </Link>
              </div>

              {/* Inter-Tower Accuracy Battle (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-[#131d31] rounded-2xl p-6 md:p-8 shadow-sm border border-[#e2e8f0] dark:border-[#1e293b]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                      Bi-Weekly Society Derby
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#006c49] dark:text-[#10b981] font-bold">
                      <span className="material-symbols-outlined text-[16px]">timer</span> 4 Days Left
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                    Tower B vs Tower A
                  </h3>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Winning tower members receive 15% discount on quarterly society maintenance fees.
                  </p>

                  {/* Accuracy Comparative Visualizer */}
                  <div className="mt-4 flex flex-col gap-4">
                    {/* Tower B (Leading) */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#0b1c30] dark:text-white flex items-center gap-1.5">
                          <span>🏢 Tower B (Your Tower)</span>
                          <span className="text-[#006c49] dark:text-[#10b981] font-bold">Leader</span>
                        </span>
                        <span className="text-sm font-extrabold text-[#006c49] dark:text-[#10b981]">
                          94%
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                        <div className="h-full rounded-full bg-[#10b981] w-[94%] transition-all duration-1000"></div>
                      </div>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        520 kg verified segregated • 0.8% contamination
                      </span>
                    </div>

                    {/* Tower A (Challenger) */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#3c4a42] dark:text-[#94a3b8]">
                          🏢 Tower A
                        </span>
                        <span className="text-sm font-bold text-[#3c4a42] dark:text-[#94a3b8]">
                          89%
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                        <div className="h-full rounded-full bg-[#bec6e0] dark:bg-[#565e74] w-[89%] transition-all duration-1000"></div>
                      </div>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        498 kg verified segregated • 3.2% contamination
                      </span>
                    </div>
                  </div>
                </div>

                {/* Society Eco Impact Metric Callout */}
                <div className="mt-6 p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center gap-3 border border-[#dce9ff] dark:border-[#27354f]">
                  <div className="w-12 h-12 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">forest</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                      Community Compost Generated
                    </span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-tight mt-0.5">
                      320 kg organic compost donated to society botanical garden this month!
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Navigation Workflow Switchers */}
            <section className="bg-[#eff4ff] dark:bg-[#1a263e] rounded-2xl p-6 md:p-8 border border-[#dce9ff] dark:border-[#27354f]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-lg font-bold text-[#0b1c30] dark:text-white font-headline">
                    Experience Flows
                  </h4>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Seamlessly transition across resident modules
                  </p>
                </div>
                <span className="text-[11px] font-medium text-[#3c4a42] dark:text-[#94a3b8]">
                  EcoLoop v2.4 Modular Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Flow 1 */}
                <Link
                  href="/resident/verify"
                  className="flex flex-col text-left p-4 rounded-xl bg-white dark:bg-[#131d31] hover:shadow-md transition-all border border-[#e2e8f0] dark:border-[#1e293b] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                  </div>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                    AI Scan Waste
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1 leading-tight">
                    Instant camera classification with confidence indicator.
                  </span>
                </Link>

                {/* Flow 2 */}
                <button
                  onClick={() => setIsSpotCheckModalOpen(true)}
                  className="flex flex-col text-left p-4 rounded-xl bg-white dark:bg-[#131d31] hover:shadow-md transition-all border border-[#e2e8f0] dark:border-[#1e293b] group"
                  type="button"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#dae2fd] dark:bg-[#1e293b] text-[#131b2e] dark:text-[#dae2fd] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">casino</span>
                  </div>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                    Spot Check Alert
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1 leading-tight">
                    Test verification audit prompts with 2x point bonus.
                  </span>
                </button>

                {/* Flow 3 */}
                <Link
                  href="/resident/history"
                  className="flex flex-col text-left p-4 rounded-xl bg-white dark:bg-[#131d31] hover:shadow-md transition-all border border-[#e2e8f0] dark:border-[#1e293b] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#dce9ff] dark:bg-[#27354f] text-[#0b1c30] dark:text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                  </div>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                    Habit History
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1 leading-tight">
                    Transparent immutable audit log of prior waste batches.
                  </span>
                </Link>

                {/* Flow 4 */}
                <Link
                  href="/resident/rewards"
                  className="flex flex-col text-left p-4 rounded-xl bg-white dark:bg-[#131d31] hover:shadow-md transition-all border border-[#e2e8f0] dark:border-[#1e293b] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">card_giftcard</span>
                  </div>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                    Eco Rewards Hub
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1 leading-tight">
                    Redeem points for zero-waste grocery & coffee vouchers.
                  </span>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
