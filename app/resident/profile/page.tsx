'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, theme, setTheme, signOut } = useApp();

  const handleLogout = () => {
    signOut('resident');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Profile Summary Card */}
            <section className="bg-white dark:bg-[#131d31] p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profile.avatar_url || '/deepak-avatar.png'}
                    alt={profile.full_name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-[#10b981]"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                      {profile.full_name}
                    </h1>
                    <span className="px-2 py-0.2 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-[10px] font-bold">
                      LVL {profile.tier_level}
                    </span>
                  </div>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-0.5">
                    {profile.flat_number} • Green Valley Residency
                  </span>
                  <span className="text-[11px] text-[#006c49] dark:text-[#10b981] font-semibold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                    Resident Steward Charter Active
                  </span>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-0.5">
                    Ward 88B • Zone 4 West
                  </span>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#e2e8f0]/60 dark:border-[#1e293b]/60 text-center">
                <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-[#0b1c30] dark:text-white font-headline">
                    <span className="material-symbols-outlined text-[16px] text-[#e29100]">
                      bolt
                    </span>
                    <span>{profile.eco_points}</span>
                  </div>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">Eco Points</span>
                </div>

                <div className="flex flex-col border-x border-[#e2e8f0]/60 dark:border-[#1e293b]/60">
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-[#0b1c30] dark:text-white font-headline">
                    <span className="material-symbols-outlined text-[16px] text-[#10b981]">
                      eco
                    </span>
                    <span>{Math.round(profile.consistency_score)}/100</span>
                  </div>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">Habit Score</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-[#0b1c30] dark:text-white font-headline">
                    <span className="material-symbols-outlined text-[16px] text-[#e29100]">
                      local_fire_department
                    </span>
                    <span>{profile.current_streak}d</span>
                  </div>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">Active Streak</span>
                </div>
              </div>
            </section>

            {/* Municipal Ward Certification Status */}
            <section className="bg-white dark:bg-[#131d31] rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] overflow-hidden">
              {/* Header banner */}
              <div className="bg-gradient-to-r from-[#006c49] to-[#10b981] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-[20px]">verified</span>
                  <span className="text-white font-bold text-xs font-headline uppercase tracking-wider">
                    Municipal Ward Certification
                  </span>
                </div>
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-white text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse"></span>
                  APPROVED
                </span>
              </div>

              {/* Body */}
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                    Certification Grade
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-[#006c49] dark:text-[#10b981] font-headline leading-none">
                      AA
                    </span>
                    <span className="text-xs font-bold text-[#10b981] bg-[#6ffbbe]/20 dark:bg-[#006c49]/30 px-2 py-0.5 rounded-full">
                      Grade AA
                    </span>
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-0.5">
                    Ward 88B • Zone 4 West • MCGM
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="w-14 h-14 rounded-full bg-[#6ffbbe]/20 dark:bg-[#006c49]/30 border-2 border-[#10b981] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px] text-[#006c49] dark:text-[#10b981]">workspace_premium</span>
                  </div>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">Lic: GVR-2024-MCGM</span>
                </div>
              </div>

              {/* Footer strip */}
              <div className="border-t border-[#e2e8f0] dark:border-[#1e293b] px-5 py-2.5 bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-between">
                <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#10b981]">calendar_month</span>
                  Valid through FY 2024–25
                </span>
                <span className="text-[11px] font-bold text-[#006c49] dark:text-[#10b981]">
                  Municipal Ward Certification Status: APPROVED • GRADE AA
                </span>
              </div>
            </section>

            {/* Appearance Switcher */}
            <section className="bg-white dark:bg-[#131d31] p-5 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                  Appearance
                </span>
                <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">Auto-synced</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'light', label: 'Light', icon: 'light_mode' },
                  { key: 'dark', label: 'Dark', icon: 'dark_mode' },
                  { key: 'system', label: 'System', icon: 'settings_brightness' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTheme(item.key as any)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                      theme === item.key
                        ? 'bg-[#10b981] text-white border-[#10b981] shadow-sm'
                        : 'bg-[#eff4ff] dark:bg-[#1a263e] border-[#dce9ff] dark:border-[#27354f] text-[#0b1c30] dark:text-white'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Quick Links & Settings */}
            <section className="bg-white dark:bg-[#131d31] p-5 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-2">
              <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline mb-1">
                Settings & Support
              </span>

              <Link
                href="/resident/privacy"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#1a263e] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6ffbbe]/25 dark:bg-[#006c49]/30 text-[#006c49] dark:text-[#6ffbbe] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                      Zero-Surveillance Civic Privacy
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Democratic charter guarantees & data retention
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#3c4a42] dark:text-[#94a3b8]">
                  chevron_right
                </span>
              </Link>

              <Link
                href="/resident/consistency"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#1a263e] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-[#0284C7] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                      Habit Consistency Formula
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      View scientific 4-part habit score calculation
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#3c4a42] dark:text-[#94a3b8]">
                  chevron_right
                </span>
              </Link>

              <Link
                href="/resident/settings"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#1a263e] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                      Account & Notification Rules
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Streak alerts, spot checks, derby digests
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#3c4a42] dark:text-[#94a3b8]">
                  chevron_right
                </span>
              </Link>
            </section>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-2xl bg-[#ffdad6]/50 dark:bg-[#93000a]/20 text-[#ba1a1a] dark:text-[#ffdad6] border border-[#ffdad6] dark:border-[#93000a] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#ffdad6] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Log Out of Green Valley Residency</span>
            </button>

            <span className="text-center text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
              EcoLoop v2.10.4 • Crafted for high-trust sustainable communities
            </span>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
