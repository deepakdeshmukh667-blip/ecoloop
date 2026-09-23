'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function LeaderboardPage() {
  const { leaderboardResidents, profile } = useApp();
  const [tab, setTab] = useState<'residents' | 'societies'>('residents');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const userRankIndex = leaderboardResidents.findIndex(
    (r) => r.id === profile.id || (profile.email ? r.email === profile.email : false)
  );
  const userRank = userRankIndex !== -1 ? leaderboardResidents[userRankIndex].rank : leaderboardResidents.length;
  const competitorAbove = userRankIndex > 0 ? leaderboardResidents[userRankIndex - 1] : null;
  const ptsToOvertake = competitorAbove ? Math.max(1, competitorAbove.eco_points - profile.eco_points) : 0;

  const top1 = leaderboardResidents[0];
  const top2 = leaderboardResidents[1];
  const top3 = leaderboardResidents[2];

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Header: Segmented Toggle: Residents vs Societies */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f]">
              <button
                onClick={() => setTab('residents')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tab === 'residents'
                    ? 'bg-white dark:bg-[#131d31] text-[#006c49] dark:text-[#10b981] shadow-sm'
                    : 'text-[#3c4a42] dark:text-[#94a3b8]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>Residents</span>
              </button>
              <button
                onClick={() => setTab('societies')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tab === 'societies'
                    ? 'bg-white dark:bg-[#131d31] text-[#006c49] dark:text-[#10b981] shadow-sm'
                    : 'text-[#3c4a42] dark:text-[#94a3b8]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">apartment</span>
                <span>Societies • Derby</span>
              </button>
            </div>

            {/* Time Range Filters */}
            <div className="flex items-center gap-2">
              {[
                { key: 'week', label: 'This Week', icon: 'calendar_today' },
                { key: 'month', label: 'This Month' },
                { key: 'all', label: 'All Time' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTimeRange(t.key as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    timeRange === t.key
                      ? 'bg-[#10b981] text-white shadow-sm'
                      : 'bg-white dark:bg-[#131d31] text-[#3c4a42] dark:text-[#94a3b8] border border-[#e2e8f0] dark:border-[#1e293b]'
                  }`}
                  type="button"
                >
                  {t.icon && <span className="material-symbols-outlined text-[15px]">{t.icon}</span>}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {tab === 'residents' ? (
              <>
                {/* User Standing Banner */}
                <div className="p-5 rounded-2xl bg-[#006c49] text-white shadow-md flex flex-col gap-3 relative overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={profile.avatar_url || '/deepak-avatar.png'}
                          alt={profile.full_name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                        />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ffb95f] text-[#2a1700] text-[10px] font-black flex items-center justify-center shadow">
                          #{userRank}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold font-headline">{profile.full_name}</span>
                        <span className="text-xs text-white/80">
                          {profile.flat_number || 'Apt 402B'} • {profile.eco_points} pts • 🔥{' '}
                          {profile.current_streak}d streak
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-white/75">
                        {userRank <= 3 ? 'Top Tier' : `Rank ${userRank}`}
                      </span>
                      <div className="text-2xl font-black font-headline">#{userRank}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/20 z-10 text-xs">
                    {competitorAbove ? (
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-[#ffddb8]">bolt</span>
                        {ptsToOvertake} pts to overtake {competitorAbove.full_name} for #{competitorAbove.rank}!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-[#ffddb8]">emoji_events</span>
                        You are #1 on the leaderboard!
                      </span>
                    )}
                    <Link
                      href="/resident/verify"
                      className="px-3 py-1 rounded-full bg-white text-[#006c49] font-bold text-xs shadow-sm hover:scale-105 transition-transform"
                    >
                      Log Scan
                    </Link>
                  </div>
                </div>

                {/* Weekly Podium */}
                <section className="bg-white dark:bg-[#131d31] p-5 md:p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#0b1c30] dark:text-white font-headline">
                      Weekly Podium
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs text-[#006c49] dark:text-[#10b981] font-semibold">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Live Verified
                    </span>
                  </div>

                  {/* 3 Pedestals */}
                  <div className="flex items-end justify-center gap-2 sm:gap-4 pt-4 pb-2">
                    {/* Rank 2 */}
                    {top2 && (
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="relative">
                          <img
                            src={top2.avatar_url || '/deepak-avatar.png'}
                            alt={top2.full_name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#bec6e0]"
                          />
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#bec6e0] text-[#131b2e] text-[9px] font-bold flex items-center justify-center">
                            2
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-bold text-[#0b1c30] dark:text-white block truncate">
                            {top2.id === profile.id ? `${top2.full_name} (You)` : top2.full_name}
                          </span>
                          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                            {top2.eco_points} pts
                          </span>
                        </div>
                        <div className="w-full h-20 bg-[#eff4ff] dark:bg-[#1a263e] rounded-t-xl flex items-center justify-center font-headline font-black text-xl text-[#565e74] dark:text-[#bec6e0]">
                          2
                        </div>
                      </div>
                    )}

                    {/* Rank 1 */}
                    {top1 && (
                      <div className="flex flex-col items-center gap-2 flex-1 -mt-4">
                        <span className="text-xl">👑</span>
                        <div className="relative -mt-2">
                          <img
                            src={top1.avatar_url || '/deepak-avatar.png'}
                            alt={top1.full_name}
                            className="w-14 h-14 rounded-full object-cover ring-4 ring-[#ffb95f]"
                          />
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ffb95f] text-[#2a1700] text-[10px] font-black flex items-center justify-center shadow">
                            1
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-bold text-[#0b1c30] dark:text-white block truncate">
                            {top1.id === profile.id ? `${top1.full_name} (You)` : top1.full_name}
                          </span>
                          <span className="text-[11px] text-[#006c49] dark:text-[#10b981] font-bold">
                            {top1.eco_points} pts
                          </span>
                        </div>
                        <div className="w-full h-28 bg-[#10b981] rounded-t-xl flex flex-col items-center justify-center text-white font-headline font-black text-2xl shadow-md">
                          <span className="material-symbols-outlined text-[20px] mb-1">
                            military_tech
                          </span>
                          1
                        </div>
                      </div>
                    )}

                    {/* Rank 3 */}
                    {top3 && (
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="relative">
                          <img
                            src={top3.avatar_url || '/deepak-avatar.png'}
                            alt={top3.full_name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#ffddb8]"
                          />
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ffddb8] text-[#855300] text-[9px] font-bold flex items-center justify-center">
                            3
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-bold text-[#0b1c30] dark:text-white block truncate">
                            {top3.id === profile.id ? `${top3.full_name} (You)` : top3.full_name}
                          </span>
                          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                            {top3.eco_points} pts
                          </span>
                        </div>
                        <div className="w-full h-16 bg-[#eff4ff] dark:bg-[#1a263e] rounded-t-xl flex items-center justify-center font-headline font-black text-xl text-[#855300] dark:text-[#ffb95f]">
                          3
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Resident Standings List */}
                <section className="bg-white dark:bg-[#131d31] p-5 md:p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]/60 dark:border-[#1e293b]/60">
                    <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                      Resident Standings
                    </span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">64 Active Units</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {leaderboardResidents.map((res) => {
                      const isMe = res.id === profile.id;

                      return (
                        <div
                          key={res.id}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                            isMe
                              ? 'bg-[#6ffbbe]/25 dark:bg-[#006c49]/30 border border-[#10b981]'
                              : 'hover:bg-[#eff4ff] dark:hover:bg-[#1a263e]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 text-center font-headline font-extrabold text-sm text-[#3c4a42] dark:text-[#94a3b8]">
                              {res.rank}
                            </span>
                            <img
                              src={res.avatar_url || '/deepak-avatar.png'}
                              alt={res.full_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                                  {res.full_name}
                                </span>
                                {isMe && (
                                  <span className="px-1.5 py-0.2 rounded bg-[#10b981] text-white text-[9px] font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                                  {res.flat_number}
                                </span>
                                <span className="text-[10px] text-[#e29100] font-semibold flex items-center gap-0.5">
                                  <span className="material-symbols-outlined text-[12px]">
                                    local_fire_department
                                  </span>
                                  {res.current_streak}d streak
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-[#0b1c30] dark:text-white block font-headline">
                              {res.eco_points}
                            </span>
                            <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">pts</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            ) : (
              /* SOCIETIES / DERBY TAB */
              <section className="flex flex-col gap-4">
                <div className="bg-white dark:bg-[#131d31] p-5 md:p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#10b981] text-[24px]">
                        apartment
                      </span>
                      <h2 className="text-lg font-bold text-[#0b1c30] dark:text-white font-headline">
                        MCGM Society Derby
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-xs font-bold text-[#006c49] dark:text-[#10b981]">
                      Round 4 of 6
                    </span>
                  </div>

                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Ward 88B Municipal Division: Societies compete on aggregate verified segregation
                    accuracy and landfill diversion.
                  </p>

                  <div className="flex flex-col gap-4 pt-2">
                    {/* Society 1 */}
                    <div className="p-4 rounded-xl bg-[#6ffbbe]/20 dark:bg-[#006c49]/30 border border-[#10b981] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#10b981] text-white text-[10px] font-bold flex items-center justify-center">
                            1
                          </span>
                          <span className="font-bold text-[#0b1c30] dark:text-white">
                            Green Valley Residency (Your Society)
                          </span>
                        </div>
                        <span className="font-extrabold text-sm text-[#006c49] dark:text-[#10b981]">
                          94%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white dark:bg-[#1a263e] overflow-hidden">
                        <div className="h-full rounded-full bg-[#10b981] w-[94%]"></div>
                      </div>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        9.4 tons diverted this cycle • 0.8% contamination rate
                      </span>
                    </div>

                    {/* Society 2 */}
                    <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#bec6e0] text-[#131b2e] text-[10px] font-bold flex items-center justify-center">
                            2
                          </span>
                          <span className="font-semibold text-[#0b1c30] dark:text-white">
                            Sunrise Heights
                          </span>
                        </div>
                        <span className="font-bold text-sm text-[#3c4a42] dark:text-[#94a3b8]">
                          91%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#dce9ff] dark:bg-[#27354f] overflow-hidden">
                        <div className="h-full rounded-full bg-[#565e74] w-[91%]"></div>
                      </div>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        8.9 tons diverted • 1.9% contamination rate
                      </span>
                    </div>

                    {/* Society 3 */}
                    <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#ffddb8] text-[#855300] text-[10px] font-bold flex items-center justify-center">
                            3
                          </span>
                          <span className="font-semibold text-[#0b1c30] dark:text-white">
                            Palm Grove Heights
                          </span>
                        </div>
                        <span className="font-bold text-sm text-[#3c4a42] dark:text-[#94a3b8]">
                          88%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#dce9ff] dark:bg-[#27354f] overflow-hidden">
                        <div className="h-full rounded-full bg-[#e29100] w-[88%]"></div>
                      </div>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        8.1 tons diverted • 3.1% contamination rate
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ward Rebate Unlock Banner */}
                <div className="p-4 rounded-2xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#10b981] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#006c49] dark:text-[#10b981] uppercase tracking-wider">
                      Ward Rebate Unlock
                    </span>
                    <p className="text-xs text-[#0b1c30] dark:text-white leading-tight mt-0.5">
                      Green Valley is leading the MCGM Ward 88B green rebate standings! Keep this pace
                      for a <strong>5% property tax rebate</strong> next quarter.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ₹10,000 Green Pool Banner */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">card_giftcard</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                    ₹10,000 Green Pool
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Weekly resets in 2d 14h • Top 10 split rewards
                  </span>
                </div>
              </div>
              <button
                onClick={() => alert('Green Pool Rules: Top 10 residents with the highest verified segregation streaks split ₹10,000 in society zero-waste shopping credits at week end.')}
                className="text-xs font-bold text-[#006c49] dark:text-[#10b981] hover:underline"
                type="button"
              >
                Rules &gt;
              </button>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
