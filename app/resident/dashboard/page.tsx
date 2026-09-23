'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

// ─── Stat Card ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
  iconBg,
  trend,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  iconBg: string;
  trend?: { dir: 'up' | 'down'; text: string };
  delay?: number;
}) {
  return (
    <div
      className="card p-5 flex flex-col gap-3 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`icon-box ${iconBg}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              trend.dir === 'up'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {trend.dir === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {trend.text}
          </span>
        )}
      </div>
      <div>
        <div className="stat-number">{value}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
        {sub && <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Waste Stream Card ──────────────────────────────────────────
function WasteStreamCard({
  type,
  icon,
  done,
  time,
  pts,
  sub,
  iconBg,
  iconText,
  pendingClass,
}: {
  type: string;
  icon: string;
  done: boolean;
  time: string;
  pts: string;
  sub: string;
  iconBg: string;
  iconText: string;
  pendingClass?: string;
}) {
  return (
    <div
      className={`flex flex-col p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
        done
          ? 'bg-emerald-50/70 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800/40'
          : pendingClass || 'bg-white dark:bg-[#111f35] border-slate-200 dark:border-[#1e2d45]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`icon-box-sm ${iconBg}`}>
          <span className={`material-symbols-outlined text-[16px] ${iconText}`}>{icon}</span>
        </div>
        {done ? (
          <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
        ) : (
          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px]">radio_button_unchecked</span>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-[13px] font-bold text-slate-800 dark:text-white">{type}</span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{done ? time : 'Pending'}</span>
      </div>
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1e2d45] flex items-center justify-between">
        <span className={`text-[11px] font-bold ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
          {pts}
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">{sub}</span>
      </div>
    </div>
  );
}

export default function ResidentDashboardPage() {
  const router = useRouter();
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsUnauthorized(params.get('error') === 'unauthorized_admin');
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 17) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    }
  }, []);

  const {
    profile,
    verifications,
    leaderboardResidents,
    setIsSpotCheckModalOpen,
    setIsRewardModalOpen,
  } = useApp();

  const wetDone = verifications.some((v) => v.category_slug === 'wet');
  const dryDone = verifications.some((v) => v.category_slug === 'dry');
  const specialDone = verifications.some((v) => v.category_slug === 'special');
  const completedToday = (wetDone ? 1 : 0) + (dryDone ? 1 : 0) + (specialDone ? 1 : 0);
  const progressPct = Math.round((completedToday / 3) * 100);

  const userRankIndex = leaderboardResidents.findIndex(
    (r) => r.id === profile.id || (profile.email ? r.email === profile.email : false)
  );
  const userRank = userRankIndex !== -1 ? leaderboardResidents[userRankIndex].rank : leaderboardResidents.length;
  const competitorAbove = userRankIndex > 0 ? leaderboardResidents[userRankIndex - 1] : null;
  const ptsToOvertake = competitorAbove ? Math.max(1, competitorAbove.eco_points - profile.eco_points) : 0;

  const displayResidents =
    userRankIndex <= 2
      ? leaderboardResidents.slice(0, 3)
      : [...leaderboardResidents.slice(0, 2), leaderboardResidents[userRankIndex]];

  const weekDays = [
    { day: 'Mon', date: '21', status: 'verified', pts: '+20', icon: 'done_all', special: false },
    { day: 'Tue', date: '22', status: 'verified', pts: '+20', icon: 'done_all', special: false },
    { day: 'Wed', date: '23', status: 'spot', pts: '+40', icon: 'casino', special: true },
    { day: 'Thu', date: '24', status: 'verified', pts: '+20', icon: 'done_all', special: false },
    { day: 'Fri', date: '25', status: 'verified', pts: '+20', icon: 'done_all', special: false },
    { day: 'Sat', date: '26', status: 'verified', pts: '+20', icon: 'done_all', special: false },
    { day: 'Sun', date: '27', status: 'pending', pts: '+15', icon: 'hourglass_top', isToday: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080f1a]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-10 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-6">

            {/* Unauthorized Banner */}
            {isUnauthorized && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40
                text-red-700 dark:text-red-400 text-xs flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span className="font-medium">Access Restricted: Your account does not have administrator authorization.</span>
                </div>
                <Link
                  href="/admin/login"
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-xs hover:bg-red-700 transition-colors shrink-0"
                >
                  Admin Login
                </Link>
              </div>
            )}

            {/* ── PAGE HEADER ──────────────────────────────────── */}
            <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fadeInUp">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="pill-eco">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Verification Window
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">
                  {greeting}, {profile.full_name?.split(' ')[0] || 'Deepak'} 👋
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
                  {completedToday === 3
                    ? "All 3 waste streams verified today — excellent work! 🎉"
                    : `${3 - completedToday} waste stream${3 - completedToday !== 1 ? 's' : ''} remaining for today's verification.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => router.push('/resident/verify')}
                  className="btn-primary"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  Verify Waste
                </button>
                <button
                  onClick={() => setIsSpotCheckModalOpen(true)}
                  className="btn-secondary"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-500">casino</span>
                  Spot Check
                </button>
              </div>
            </section>

            {/* ── STAT CARDS ───────────────────────────────────── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Eco Points"
                value={profile.eco_points}
                sub={`${Math.max(0, 500 - profile.eco_points)} pts to voucher`}
                icon="eco"
                iconBg="bg-emerald-50 dark:bg-emerald-900/25 text-emerald-600 dark:text-emerald-400"
                trend={{ dir: 'up', text: '+35 today' }}
                delay={0}
              />
              <StatCard
                label="Day Streak"
                value={`${profile.current_streak}d`}
                sub={profile.current_streak > 0 ? '1.2x bonus active' : 'Start streak today'}
                icon="local_fire_department"
                iconBg="bg-orange-50 dark:bg-orange-900/25 text-orange-500"
                trend={{ dir: 'up', text: 'Active' }}
                delay={50}
              />
              <StatCard
                label="Habit Score"
                value={`${Math.round(profile.consistency_score)}%`}
                sub="Top 5% in Tower"
                icon="insights"
                iconBg="bg-blue-50 dark:bg-blue-900/25 text-blue-500"
                trend={{ dir: 'up', text: '+2%' }}
                delay={100}
              />
              <StatCard
                label="Tower Rank"
                value={`#${userRank}`}
                sub={`of ${leaderboardResidents.length} residents`}
                icon="leaderboard"
                iconBg="bg-violet-50 dark:bg-violet-900/25 text-violet-500"
                delay={150}
              />
            </section>

            {/* ── TODAY'S TASKS + ECO INDEX ─────────────────────── */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

              {/* Verification Hub — 7 cols */}
              <div className="lg:col-span-7 card p-6 flex flex-col gap-5 relative overflow-hidden animate-fadeInUp stagger-2">
                {/* Ambient glow */}
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-400/10 dark:bg-emerald-500/8 blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between z-10">
                  <div>
                    <p className="section-label">Today's Tasks</p>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-headline mt-0.5">
                      Waste Segregation
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                      {completedToday}/3
                    </span>
                    <div className="w-20 h-2 bg-slate-100 dark:bg-[#1a2840] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Waste Stream Cards */}
                <div className="grid grid-cols-3 gap-3 z-10">
                  <WasteStreamCard
                    type="Wet Waste"
                    icon="compost"
                    done={wetDone}
                    time="08:15 AM • AI Verified"
                    pts="+10 pts"
                    sub="Organic"
                    iconBg="bg-emerald-100 dark:bg-emerald-900/30"
                    iconText="text-emerald-600 dark:text-emerald-400"
                  />
                  <WasteStreamCard
                    type="Dry Waste"
                    icon="recycling"
                    done={dryDone}
                    time="12:30 PM • AI Verified"
                    pts="+10 pts"
                    sub="Paper/Plastic"
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                    iconText="text-blue-600 dark:text-blue-400"
                  />
                  <WasteStreamCard
                    type="Special Waste"
                    icon="battery_alert"
                    done={specialDone}
                    time="Verified"
                    pts="+15 pts"
                    sub="E-waste/Med"
                    iconBg="bg-amber-100 dark:bg-amber-900/30"
                    iconText="text-amber-600 dark:text-amber-400"
                    pendingClass="bg-amber-50/60 dark:bg-amber-900/10 border border-dashed border-amber-300 dark:border-amber-700/40"
                  />
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3 pt-1 z-10">
                  <button
                    onClick={() => router.push('/resident/verify')}
                    className="flex-1 btn-primary text-sm py-3"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                    <span>Verify Waste Now</span>
                  </button>
                  <Link
                    href="/resident/learn"
                    className="btn-secondary text-xs py-3 px-4"
                  >
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    Sorting Guide
                  </Link>
                </div>
              </div>

              {/* Eco Habit Index — 5 cols */}
              <div className="lg:col-span-5 card p-6 flex flex-col gap-4 animate-fadeInUp stagger-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="section-label">Aggregate Metric</p>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-headline mt-0.5">
                      Eco Habit Index
                    </h2>
                  </div>
                  <span className="badge-green">
                    <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                    Super Segregator
                  </span>
                </div>

                {/* Circular Score */}
                <div className="flex items-center gap-6">
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-slate-100 dark:text-[#1a2840]"
                      />
                      <circle
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke="url(#ecoGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * profile.consistency_score) / 100}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="ecoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white font-headline leading-none">
                        {Math.round(profile.consistency_score)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold tracking-wider mt-0.5">/ 100</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm">
                    <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">emoji_events</span>
                      Top 5% in Tower B
                    </p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Above 95% of households in verified segregation consistency this month.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="badge-green text-[10px]">90% Verified</span>
                      <span className="badge-blue text-[10px]">Zero Contamination</span>
                    </div>
                  </div>
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#111f35] border border-slate-100 dark:border-[#1e2d45]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Eco Balance</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-900 dark:text-white font-headline">{profile.eco_points}</span>
                      <span className="text-xs font-bold text-emerald-500">pts</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{Math.max(0, 500 - profile.eco_points)} to voucher</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Daily Streak</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-slate-900 dark:text-white font-headline">{profile.current_streak}d</span>
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">local_fire_department</span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-semibold">
                      {profile.current_streak > 0 ? '1.2x multiplier' : 'Start streak'}
                    </span>
                  </div>
                </div>

                {/* Voucher Progress */}
                <button
                  onClick={() => setIsRewardModalOpen(true)}
                  className="w-full p-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                    flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">redeem</span>
                  <div className="flex flex-col text-left flex-1">
                    <span className="text-xs font-bold">Redeem Café Voucher</span>
                    <div className="w-full h-1.5 bg-white/30 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${Math.min(100, (profile.eco_points / 500) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap">{profile.eco_points}/500</span>
                </button>
              </div>
            </section>

            {/* ── WEEKLY JOURNEY ───────────────────────────────── */}
            <section className="card p-6 flex flex-col gap-5 animate-fadeInUp stagger-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="section-label">This Week</p>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-headline mt-0.5">
                    Segregation Journey
                  </h2>
                </div>
                <span className="badge-green">
                  <span className="material-symbols-outlined text-[13px]">insights</span>
                  90% 4-Week Index
                </span>
              </div>

              {/* 7-Day Grid */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all
                      ${item.special
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700/50'
                        : item.isToday
                        ? 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-700/40'
                        : 'bg-white dark:bg-[#111f35] border-slate-100 dark:border-[#1e2d45]'
                      }`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{item.day}</span>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{item.date}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${item.special
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : item.isToday
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-900/25 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    </div>
                    <span className={`text-[10px] font-bold
                      ${item.special
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : item.isToday
                        ? 'text-amber-500'
                        : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {item.pts}
                    </span>
                  </div>
                ))}
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#111f35] border border-slate-100 dark:border-[#1e2d45]">
                <span className="material-symbols-outlined text-emerald-500 text-[20px] mt-0.5 shrink-0">verified_user</span>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Privacy-First Verification: </span>
                  Spot checks are occasional and privacy-safe — never continuous surveillance. Visual data stays securely ephemeral.
                </p>
              </div>
            </section>

            {/* ── LEADERBOARD + TOWER BATTLE ───────────────────── */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">

              {/* Leaderboard — 7 cols */}
              <div className="lg:col-span-7 card p-6 flex flex-col gap-4 animate-fadeInUp stagger-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="section-label">Friendly Competition</p>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-headline mt-0.5">
                      Tower B Leaderboard
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Your Rank</div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-headline leading-tight">
                      #{userRank}
                    </div>
                  </div>
                </div>

                {/* Overtake Banner */}
                {competitorAbove ? (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#111f35] border border-slate-200 dark:border-[#1e2d45]">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">trending_up</span>
                    <p className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-800 dark:text-white">{ptsToOvertake} pts</span> behind{' '}
                      <span className="font-bold">#{competitorAbove.rank} {competitorAbove.full_name}</span> — push today!
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">emoji_events</span>
                    <p className="text-[12px] font-medium text-emerald-700 dark:text-emerald-400">
                      🏆 You're leading Tower B with <span className="font-bold">{profile.eco_points} pts</span>!
                    </p>
                  </div>
                )}

                {/* Rows */}
                <div className="flex flex-col gap-1.5">
                  {displayResidents.map((res, idx) => {
                    const isMe = res.id === profile.id || (profile.email ? res.email === profile.email : false);
                    const rankColors: Record<number, string> = {
                      1: 'text-amber-500',
                      2: 'text-slate-400',
                      3: 'text-amber-700 dark:text-amber-600',
                    };
                    return (
                      <div
                        key={res.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isMe
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40'
                            : 'hover:bg-slate-50 dark:hover:bg-[#111f35]'
                        }`}
                      >
                        <span className={`w-6 text-center font-black text-lg font-headline ${rankColors[res.rank] || 'text-slate-400'}`}>
                          {res.rank === 1 ? '🥇' : res.rank === 2 ? '🥈' : res.rank === 3 ? '🥉' : res.rank}
                        </span>
                        <img
                          src={res.avatar_url || '/deepak-avatar.png'}
                          alt={res.full_name}
                          className={`w-9 h-9 rounded-full object-cover ${isMe ? 'ring-2 ring-emerald-400' : ''}`}
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-slate-800 dark:text-white truncate">
                              {res.full_name}
                            </span>
                            {isMe && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-bold shrink-0">YOU</span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {res.flat_number || 'Tower B'} · {res.current_streak}d streak
                          </span>
                        </div>
                        <span className={`text-[13px] font-black ${isMe ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {res.eco_points} <span className="text-[11px] font-semibold">pts</span>
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/resident/leaderboard"
                  className="w-full py-2.5 rounded-xl text-center text-[12px] font-semibold text-slate-500 dark:text-slate-400
                    hover:bg-slate-50 dark:hover:bg-[#111f35] hover:text-slate-800 dark:hover:text-white
                    border border-slate-100 dark:border-[#1e2d45] transition-colors"
                >
                  View Complete Tower Standings →
                </Link>
              </div>

              {/* Tower Battle — 5 cols */}
              <div className="lg:col-span-5 card p-6 flex flex-col gap-5 animate-fadeInUp stagger-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="section-label">Bi-Weekly Derby</p>
                    <span className="badge-amber">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      4 Days Left
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-headline">
                    Tower B vs Tower A
                  </h2>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                    Winners receive 15% off quarterly society maintenance fees.
                  </p>
                </div>

                {/* Bars */}
                <div className="flex flex-col gap-4">
                  {/* Tower B */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        🏢 Tower B (You)
                        <span className="badge-green text-[10px]">Leading</span>
                      </span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">94%</span>
                    </div>
                    <div className="progress-track h-3">
                      <div className="progress-fill" style={{ width: '94%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400">520 kg verified · 0.8% contamination</span>
                  </div>

                  {/* Tower A */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">🏢 Tower A</span>
                      <span className="font-bold text-slate-500 dark:text-slate-400">89%</span>
                    </div>
                    <div className="progress-track h-3">
                      <div className="h-full rounded-full bg-slate-300 dark:bg-slate-600 transition-all duration-700" style={{ width: '89%' }} />
                    </div>
                    <span className="text-[10px] text-slate-400">498 kg verified · 3.2% contamination</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-[#1e2d45]" />

                {/* Impact Callout */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200/60 dark:border-emerald-800/30">
                  <div className="icon-box bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">forest</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-800 dark:text-white">Community Compost Generated</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                      320 kg organic compost donated to society botanical garden this month!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK NAV ──────────────────────────────────────── */}
            <section className="animate-fadeInUp stagger-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="section-label">Navigate</p>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-headline mt-0.5">
                    Experience Flows
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">EcoLoop v2.4</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    href: '/resident/verify',
                    icon: 'photo_camera',
                    label: 'AI Scan Waste',
                    desc: 'Instant camera classification',
                    iconBg: 'bg-emerald-500 text-white',
                    isLink: true,
                  },
                  {
                    href: '#',
                    icon: 'casino',
                    label: 'Spot Check',
                    desc: '2x point bonus on audit',
                    iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                    isLink: false,
                    onClick: () => setIsSpotCheckModalOpen(true),
                  },
                  {
                    href: '/resident/history',
                    icon: 'receipt_long',
                    label: 'Audit History',
                    desc: 'Immutable verification log',
                    iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
                    isLink: true,
                  },
                  {
                    href: '/resident/rewards',
                    icon: 'redeem',
                    label: 'Eco Rewards',
                    desc: 'Redeem grocery & café vouchers',
                    iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                    isLink: true,
                  },
                ].map((item, idx) =>
                  item.isLink ? (
                    <Link
                      key={idx}
                      href={item.href}
                      className="card-hover flex flex-col text-left p-4 group"
                    >
                      <div className={`icon-box ${item.iconBg} mb-3 group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <span className="text-[13px] font-bold text-slate-800 dark:text-white">{item.label}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.desc}</span>
                    </Link>
                  ) : (
                    <button
                      key={idx}
                      type="button"
                      onClick={item.onClick}
                      className="card-hover flex flex-col text-left p-4 group cursor-pointer"
                    >
                      <div className={`icon-box ${item.iconBg} mb-3 group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <span className="text-[13px] font-bold text-slate-800 dark:text-white">{item.label}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{item.desc}</span>
                    </button>
                  )
                )}
              </div>
            </section>

          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
