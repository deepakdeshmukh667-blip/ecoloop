'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function RewardsPage() {
  const { profile, rewards, redemptions, redeemReward } = useApp();
  const [activeTab, setActiveTab] = useState<'catalog' | 'redemptions'>('catalog');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleRedeem = (rewardId: string) => {
    const res = redeemReward(rewardId);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-20 pb-28 md:pb-12 min-h-[calc(100vh-4rem)] overflow-x-hidden">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-6">
            {/* Header: Available Balance Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#006c49] text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="flex items-center gap-4 z-10 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">redeem</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs uppercase tracking-wider text-white/80 font-bold">
                    Available Balance
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black font-headline">{profile.eco_points}</span>
                    <span className="text-sm font-semibold">Eco Points</span>
                  </div>
                  <span className="text-xs text-white/80 mt-0.5 truncate sm:text-clip">
                    Earn points on every clean kitchen bin verification & spot check
                  </span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center bg-black/20 p-1 rounded-xl z-10 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                    activeTab === 'catalog' ? 'bg-white text-[#006c49]' : 'text-white'
                  }`}
                  type="button"
                >
                  Reward Catalog
                </button>
                <button
                  onClick={() => setActiveTab('redemptions')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                    activeTab === 'redemptions' ? 'bg-white text-[#006c49]' : 'text-white'
                  }`}
                  type="button"
                >
                  My Vouchers ({redemptions.length})
                </button>
              </div>
            </div>

            {/* Feedback Alert Toast */}
            {feedback && (
              <div
                className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 ${
                  feedback.type === 'success'
                    ? 'bg-[#6ffbbe] text-[#002113] border border-[#10b981]'
                    : 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {feedback.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{feedback.message}</span>
              </div>
            )}

            {activeTab === 'catalog' ? (
              /* REWARDS CATALOG GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => {
                  const canAfford = profile.eco_points >= reward.required_points;

                  return (
                    <div
                      key={reward.id}
                      className="bg-white dark:bg-[#131d31] rounded-2xl overflow-hidden shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div className="relative aspect-[16/10] bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
                        <img
                          src={reward.image_url}
                          alt={reward.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                          {reward.badge_type || 'Eco Reward'}
                        </span>
                        <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#10b981] text-white font-headline text-xs font-black shadow-md">
                          {reward.required_points} pts
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                            {reward.title}
                          </h3>
                          <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] line-clamp-2 leading-relaxed">
                            {reward.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#e2e8f0]/60 dark:border-[#1e293b]/60 flex items-center justify-between">
                          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                            Stock: {reward.stock_quantity} left
                          </span>
                          <button
                            onClick={() => handleRedeem(reward.id)}
                            disabled={!canAfford}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                              canAfford
                                ? 'bg-[#10b981] hover:bg-[#006c49] text-white shadow-sm active:scale-95'
                                : 'bg-[#e5eeff] dark:bg-[#1e293b] text-[#3c4a42] dark:text-[#94a3b8] opacity-60 cursor-not-allowed'
                            }`}
                            type="button"
                          >
                            {canAfford ? 'Redeem Voucher' : `Need ${reward.required_points - profile.eco_points} pts`}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* MY VOUCHERS LIST */
              <div className="flex flex-col gap-3">
                {redemptions.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] text-center flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-[48px] text-[#6c7a71]">
                      receipt_long
                    </span>
                    <span className="text-sm font-bold text-[#0b1c30] dark:text-white">
                      No redeemed vouchers yet
                    </span>
                    <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] max-w-sm">
                      Choose from our community partner vouchers above to trade your verified eco
                      points for artisanal coffee, compost, and groceries.
                    </p>
                  </div>
                ) : (
                  redemptions.map((red) => (
                    <div
                      key={red.id}
                      className="bg-white dark:bg-[#131d31] p-5 rounded-2xl border border-[#10b981] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                            {red.reward_title}
                          </span>
                          <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                            Redeemed: {red.redeemed_at} • Spent {red.points_spent} pts
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 px-3 rounded-lg bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] font-mono text-xs font-extrabold text-[#006c49] dark:text-[#10b981] tracking-wider">
                          {red.voucher_code}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#6ffbbe] text-[#002113] text-[10px] font-bold uppercase">
                          {red.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
