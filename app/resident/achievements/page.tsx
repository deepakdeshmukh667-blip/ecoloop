'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function AchievementsPage() {
  const { achievements, profile } = useApp();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [isBroadcasted, setIsBroadcasted] = useState(false);

  const unlocked = achievements.filter((a) => a.is_unlocked);
  const inProgress = achievements.filter((a) => !a.is_unlocked);
  const progressPct = achievements.length > 0 ? Math.round((unlocked.length / achievements.length) * 100) : 0;

  const filtered =
    filter === 'unlocked' ? unlocked : filter === 'in_progress' ? inProgress : achievements;

  const handleBroadcast = () => {
    setIsBroadcasted(true);
    alert('🎉 Success! Your Eco Achievement Trophy is now showcased on the Tower B ground floor community lobby screen.');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Milestone Journey Header Card */}
            <section className="bg-white dark:bg-[#131d31] p-5 md:p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                    Milestone Journey
                  </span>
                  <h1 className="text-2xl font-bold text-[#0b1c30] dark:text-white font-headline">
                    Tier {profile.tier_level || 1} {profile.tier_level && profile.tier_level >= 2 ? 'Eco-Champion' : 'Eco-Resident'}
                  </h1>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-xs font-bold text-[#e29100]">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  <span>{unlocked.length} / {achievements.length}</span>
                </div>
              </div>

              {/* Progress to Next Tier */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#3c4a42] dark:text-[#94a3b8]">
                  <span>Progress to Next Tier</span>
                  <span className="text-[#006c49] dark:text-[#10b981] font-bold">{progressPct}% Complete</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#10b981] transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-1 text-[#e29100] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    {unlocked.length < achievements.length
                      ? `${achievements.length - unlocked.length} badges left to unlock`
                      : 'All badges mastered!'}
                  </span>
                  <span className="text-[#3c4a42] dark:text-[#94a3b8]">Level {profile.tier_level || 1}</span>
                </div>
              </div>

              {/* Encouragement Callout */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center gap-3 border border-[#dce9ff] dark:border-[#27354f]">
                <div className="w-9 h-9 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">eco</span>
                </div>
                <p className="text-xs text-[#0b1c30] dark:text-white leading-relaxed">
                  {profile.current_streak > 0 ? (
                    <>
                      <strong>You&apos;re on fire!</strong> Your {profile.current_streak}-day sorting streak
                      earns extra recognition and community badges.
                    </>
                  ) : (
                    <>
                      <strong>Start your green journey!</strong> Complete your daily kitchen waste
                      verifications to earn community badges and rewards.
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {[
                { key: 'all', label: `All (${achievements.length})` },
                { key: 'unlocked', label: `Unlocked (${unlocked.length})` },
                { key: 'in_progress', label: `In Progress (${inProgress.length})` },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filter === f.key
                      ? 'bg-[#10b981] text-white shadow-sm'
                      : 'bg-white dark:bg-[#131d31] text-[#3c4a42] dark:text-[#94a3b8] border border-[#e2e8f0] dark:border-[#1e293b]'
                  }`}
                  type="button"
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* UNLOCKED TROPHIES */}
            {(filter === 'all' || filter === 'unlocked') && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#006c49] dark:text-[#10b981]">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                    <span>Unlocked Trophies</span>
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                    {unlocked.length > 0 ? 'Tap badge for certificate' : 'Keep sorting to earn'}
                  </span>
                </div>

                {unlocked.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] text-center flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-[#94a3b8]">lock</span>
                    <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white">No trophies unlocked yet</h4>
                    <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                      Verify your daily waste streams to earn streak badges and milestone trophies.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {unlocked.map((ach) => (
                      <div
                        key={ach.id}
                        onClick={() => alert(`Certificate of Eco Achievement: ${ach.name} awarded to ${profile.full_name || 'Resident Member'} for excellence in sustainable waste segregation.`)}
                        className="bg-white dark:bg-[#131d31] p-4 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:border-[#10b981] transition-all group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-sm">
                            <span className="material-symbols-outlined text-[26px]">
                              {ach.icon}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                                {ach.name}
                              </h3>
                              {ach.code === '7_day_streak' && (
                                <span className="px-2 py-0.2 rounded-full bg-[#ffddb8] text-[#855300] text-[9px] font-bold uppercase">
                                  New!
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-0.5 leading-relaxed">
                              {ach.description}
                            </p>
                            <span className="text-[10px] text-[#006c49] dark:text-[#10b981] font-semibold mt-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">verified</span>
                              Unlocked {ach.unlocked_at || 'Recently'}
                            </span>
                          </div>
                        </div>

                        <span className="material-symbols-outlined text-[#10b981] text-[22px]">
                          check_circle
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Community Showcase Banner (only if unlocked badges exist) */}
                {unlocked.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-center justify-between gap-4 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-[#006c49] dark:text-[#10b981]">
                        Community Showcase
                      </span>
                      <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline mt-0.5">
                        Show off on Tower B board?
                      </h4>
                      <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                        Display your earned trophy on the lobby screen.
                      </span>
                    </div>

                    <button
                      onClick={handleBroadcast}
                      disabled={isBroadcasted}
                      className="px-4 py-2 rounded-xl bg-[#0b1c30] dark:bg-white text-white dark:text-[#0b1c30] font-bold text-xs flex items-center gap-1.5 shrink-0 hover:opacity-90 active:scale-95 transition-all"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">podcasts</span>
                      <span>{isBroadcasted ? 'Broadcasted' : 'Broadcast'}</span>
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* BADGES IN REACH */}
            {(filter === 'all' || filter === 'in_progress') && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3c4a42] dark:text-[#94a3b8]">
                    <span className="w-2 h-2 rounded-full bg-[#3c4a42] dark:bg-[#94a3b8]"></span>
                    <span>Badges in Reach</span>
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">Keep sorting!</span>
                </div>

                <div className="flex flex-col gap-3">
                  {inProgress.map((ach) => {
                    const pct = Math.min(
                      100,
                      Math.round(((ach.progress || 0) / ach.target_count) * 100)
                    );

                    return (
                      <div
                        key={ach.id}
                        className="bg-white dark:bg-[#131d31] p-4 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-[#eff4ff] dark:bg-[#1a263e] text-[#3c4a42] dark:text-[#94a3b8] flex items-center justify-center text-xl">
                              <span className="material-symbols-outlined text-[24px]">
                                {ach.icon}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                                {ach.name}
                              </h3>
                              <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-tight">
                                {ach.description}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                              {ach.progress} / {ach.target_count}
                            </span>
                            <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] block">
                              {pct}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#10b981]"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Did you know tip */}
            <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center gap-3 border border-[#dce9ff] dark:border-[#27354f]">
              <div className="w-10 h-10 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                  Did you know?
                </span>
                <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed mt-0.5">
                  Every 5 badges unlocked qualifies your apartment unit for municipal utility
                  rebates.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
