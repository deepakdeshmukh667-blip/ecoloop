'use client';

import React from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function SocietyChallengesPage() {
  const { challenges, joinChallenge } = useApp();

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-[#006c49] dark:text-[#10b981] font-bold">
                Community Goals
              </span>
              <h1 className="text-2xl font-bold text-[#0b1c30] dark:text-white font-headline">
                Society Challenges & Derbies
              </h1>
              <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                Join community missions with your neighbors in Green Valley Residency to unlock
                communal rebates, rooftop solar lighting, and organic gardens.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {challenges.map((challenge) => {
                const currVal = challenge.current_value ?? 0;
                const tgtVal = challenge.target_value || 1;
                const percentage = Math.min(
                  100,
                  Math.round((currVal / tgtVal) * 100)
                );

                return (
                  <div
                    key={challenge.id}
                    className="bg-white dark:bg-[#131d31] p-5 md:p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#10b981] text-[20px]">
                            emoji_events
                          </span>
                          <h2 className="text-base font-bold text-[#0b1c30] dark:text-white font-headline">
                            {challenge.title}
                          </h2>
                        </div>
                        <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
                          {challenge.description}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#006c49] dark:text-[#10b981] text-[10px] font-bold shrink-0">
                        {challenge.participants_count || 120} joined
                      </span>
                    </div>

                    {/* Progress Bar & Values */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#0b1c30] dark:text-white">
                          {currVal} / {challenge.target_value} target
                        </span>
                        <span className="text-[#006c49] dark:text-[#10b981] font-bold">
                          {percentage}% achieved
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#10b981] transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Community Reward Box */}
                    <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#e29100]">
                          card_giftcard
                        </span>
                        <span className="font-semibold text-[#0b1c30] dark:text-white">
                          {challenge.community_reward}
                        </span>
                      </div>

                      {challenge.is_joined ? (
                        <span className="px-3 py-1 rounded-full bg-[#6ffbbe] text-[#002113] font-bold text-[11px] flex items-center gap-1 shrink-0">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          Joined
                        </span>
                      ) : (
                        <button
                          onClick={() => joinChallenge(challenge.id)}
                          className="px-4 py-1.5 rounded-full bg-[#10b981] hover:bg-[#006c49] text-white font-bold text-xs shadow-sm active:scale-95 transition-all shrink-0"
                          type="button"
                        >
                          Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
