'use client';

import React from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function ConsistencyScorePage() {
  const { profile } = useApp();

  const score = Math.round(profile.consistency_score);

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Header: Score Overview */}
            <section className="bg-white dark:bg-[#131d31] p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <span className="text-xs uppercase tracking-wider text-[#006c49] dark:text-[#10b981] font-bold">
                  Certified Telemetry
                </span>
                <h1 className="text-2xl font-bold text-[#0b1c30] dark:text-white font-headline">
                  Eco Habit Consistency Index
                </h1>
                <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] max-w-sm">
                  Evaluated over a rolling 28-day window based on actual sorting reliability rather
                  than discarded volume.
                </p>
              </div>

              {/* Circular Gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    className="text-[#eff4ff] dark:text-[#1a263e]"
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                  <circle
                    className="text-[#10b981] transition-all duration-1000"
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeDasharray="314.16"
                    strokeDashoffset={314.16 - (314.16 * score) / 100}
                    strokeLinecap="round"
                    strokeWidth="10"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-[#0b1c30] dark:text-white font-headline leading-none">
                    {score}
                  </span>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">/ 100</span>
                </div>
              </div>
            </section>

            {/* Score Breakdown (Requirement 19: 40% + 30% + 20% + 10%) */}
            <section className="bg-white dark:bg-[#131d31] p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-bold text-[#0b1c30] dark:text-white font-headline">
                Score Weighting Breakdown
              </h2>

              <div className="flex flex-col gap-4">
                {/* 1. Correct Verifications (40%) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#0b1c30] dark:text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                      Correct Verifications (40% Weight)
                    </span>
                    <span className="text-[#006c49] dark:text-[#10b981] font-bold">38 / 40 pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                    <div className="h-full rounded-full bg-[#10b981] w-[95%]"></div>
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                    18 verified clean batches with 0% contamination alerts.
                  </span>
                </div>

                {/* 2. Spot Checks (30%) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#0b1c30] dark:text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
                      Randomized Spot Checks (30% Weight)
                    </span>
                    <span className="text-[#0284C7] font-bold">28 / 30 pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                    <div className="h-full rounded-full bg-[#0284C7] w-[93%]"></div>
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                    Passed 3 random spot checks with 100% precision.
                  </span>
                </div>

                {/* 3. Daily Streak (20%) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#0b1c30] dark:text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#e29100]"></span>
                      Active Sorting Streak (20% Weight)
                    </span>
                    <span className="text-[#e29100] font-bold">18 / 20 pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                    <div className="h-full rounded-full bg-[#e29100] w-[90%]"></div>
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                    7 consecutive active verification days (1.2x multiplier).
                  </span>
                </div>

                {/* 4. Community Participation (10%) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#0b1c30] dark:text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#565e74]"></span>
                      Community Participation (10% Weight)
                    </span>
                    <span className="text-[#565e74] dark:text-[#bec6e0] font-bold">8 / 10 pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                    <div className="h-full rounded-full bg-[#565e74] w-[80%]"></div>
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                    Active participant in Tower B vs Tower A bi-weekly derby.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
