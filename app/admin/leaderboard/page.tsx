'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useApp } from '@/lib/state/store';

export default function AdminLeaderboardPage() {
  const { residents } = useApp();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] text-[#0b1c30] dark:text-white">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 min-h-[calc(100vh-4rem)] pb-24">
          <div className="w-full px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">leaderboard</span>
                  <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Tower Derby & Gamification Management
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                  Inter-tower competition standings, monthly municipal prize pool, and resident podiums
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Tower compliance metrics recalculated and published')}
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                  Recalculate Standings
                </button>
              </div>
            </div>

            {/* Towers Derby Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tower A */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border-2 border-[#10b981] shadow-md flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#10b981] text-white text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">
                  Rank 1 • Current Leader
                </div>

                <div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="w-9 h-9 rounded-full bg-[#10b981] text-white font-bold flex items-center justify-center text-sm">
                      1
                    </span>
                    <div>
                      <h3 className="font-bold text-base font-headline text-[#0b1c30] dark:text-white">
                        Tower A (Magnolia)
                      </h3>
                      <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">280 Units</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#10b981]">94%</span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">accuracy</span>
                  </div>

                  <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#10b981] h-full rounded-full w-[94%]"></div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white flex flex-col gap-1">
                    <span className="font-bold text-[#10b981] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">emoji_events</span>
                      Prize: 10% Society Maintenance Rebate
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Sponsored by MCGM Green Ward Award
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Dispatched congratulatory announcement to Tower A residents')}
                  className="w-full mt-6 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors"
                  type="button"
                >
                  Send Tower Praise
                </button>
              </div>

              {/* Tower B */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#565e74] text-white font-bold flex items-center justify-center text-sm">
                      2
                    </span>
                    <div>
                      <h3 className="font-bold text-base font-headline text-[#0b1c30] dark:text-white">
                        Tower B (Orchid)
                      </h3>
                      <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">310 Units</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#0b1c30] dark:text-white">89%</span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">accuracy</span>
                  </div>

                  <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#565e74] h-full rounded-full w-[89%]"></div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white flex flex-col gap-1">
                    <span className="font-bold text-[#565e74] dark:text-[#bec6e0] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">military_tech</span>
                      Silver Standard Tier
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Only 5% away from qualifying for Tier 1 rebate
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Dispatched sprint nudge to Tower B residents')}
                  className="w-full mt-6 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors"
                  type="button"
                >
                  Send Sprint Nudge
                </button>
              </div>

              {/* Tower C */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#e29100] text-white font-bold flex items-center justify-center text-sm">
                      3
                    </span>
                    <div>
                      <h3 className="font-bold text-base font-headline text-[#0b1c30] dark:text-white">
                        Tower C (Palms)
                      </h3>
                      <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">252 Units</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#e29100]">85%</span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">accuracy</span>
                  </div>

                  <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#e29100] h-full rounded-full w-[85%]"></div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white flex flex-col gap-1">
                    <span className="font-bold text-[#e29100] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">support_agent</span>
                      Priority Coaching Focus
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Dry paper segregation needs volunteer workshops
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Scheduled volunteer segregation workshop for Tower C lobby')}
                  className="w-full mt-6 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors"
                  type="button"
                >
                  Schedule Workshop
                </button>
              </div>
            </div>

            {/* Top Residents Honor Roll */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
              <h3 className="text-base font-bold font-headline text-[#0b1c30] dark:text-white">
                Individual Society Champions (Top 5)
              </h3>

              <div className="flex flex-col divide-y divide-[#f1f5f9] dark:divide-[#1e293b]">
                {residents.slice(0, 5).map((r, i) => (
                  <div key={r.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#10b981] font-bold text-xs flex items-center justify-center">
                        #{i + 1}
                      </span>
                      <img
                        src={r.avatar_url || '/deepak-avatar.png'}
                        alt={r.full_name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-[#10b981]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#0b1c30] dark:text-white block">
                          {r.full_name}
                        </span>
                        <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                          Apt {r.flat_number} • {r.tower}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="text-[#10b981]">{r.accuracy_rate}% accuracy</span>
                      <span className="text-[#0b1c30] dark:text-white">{r.eco_points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-slate-700">
          <span className="material-symbols-outlined text-[#10b981] text-[20px]">check_circle</span>
          <span className="text-xs font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}
