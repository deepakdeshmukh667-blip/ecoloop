'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function SpotCheckPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            <section className="bg-white dark:bg-[#131d31] p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[#e29100]">
                <div className="w-12 h-12 rounded-2xl bg-[#ffddb8] dark:bg-[#523200] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">casino</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#e29100] tracking-wider">
                    Community Spot Audit
                  </span>
                  <h1 className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                    Random Habit Verification
                  </h1>
                </div>
              </div>

              <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
                Green Valley Tower B has selected your apartment unit for an occasional spot check!
                Upload or snap a quick photo of your kitchen bin before handover to claim a{' '}
                <strong className="text-[#006c49] dark:text-[#10b981]">double point bonus (+40 pts)</strong>.
              </p>

              {/* Charter Privacy Notice */}
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex flex-col gap-1 text-xs">
                <span className="font-bold text-[#006c49] dark:text-[#10b981] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  Privacy-First Charter Compliance
                </span>
                <p className="text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
                  Audits occur less than twice monthly per flat to prevent staging while strictly
                  avoiding continuous monitoring or home surveillance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Reward Bonus
                  </span>
                  <span className="text-sm font-extrabold text-[#006c49] dark:text-[#10b981]">
                    +40 Eco Points (2x)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Audit Window
                  </span>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-white">
                    Until 8:00 PM Today
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/resident/verify?spot=true')}
                className="w-full h-12 bg-[#10b981] hover:bg-[#006c49] text-white font-headline font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98] mt-2"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                <span>Open Camera for Spot Check</span>
              </button>
            </section>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
