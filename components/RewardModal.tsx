'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/state/store';

export default function RewardModal() {
  const router = useRouter();
  const { isRewardModalOpen, setIsRewardModalOpen, profile } = useApp();

  if (!isRewardModalOpen) return null;

  const target = 500;
  const current = profile.eco_points;
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const remaining = Math.max(0, target - current);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131d31] rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-[#e2e8f0] dark:border-[#1e293b] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#e29100] font-bold text-lg font-headline">
            <span className="material-symbols-outlined text-[24px]">redeem</span>
            <span>Eco Reward Progress</span>
          </div>
          <button
            onClick={() => setIsRewardModalOpen(false)}
            className="text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-[#0b1c30] dark:text-white font-headline">
            Café Green Artisan Voucher
          </span>
          <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
            Valid at local society organic bistro for complimentary beverage & bakery snack.
          </span>
        </div>

        {/* Progress bar towards 500 pts */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#0b1c30] dark:text-white">
              {current} of {target} points
            </span>
            <span className="text-[#006c49] dark:text-[#10b981]">{percentage}% achieved</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#e29100] transition-all duration-700"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
            {remaining > 0
              ? `${Math.ceil(remaining / 20)} more days of verified sorting needed.`
              : 'Goal achieved! You can claim this voucher now.'}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            onClick={() => setIsRewardModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#e5eeff] dark:bg-[#1e293b] text-[#0b1c30] dark:text-white text-xs font-semibold hover:bg-[#dce9ff] dark:hover:bg-[#27354f] transition-colors"
            type="button"
          >
            Got it
          </button>
          <button
            onClick={() => {
              setIsRewardModalOpen(false);
              router.push('/resident/rewards');
            }}
            className="px-4 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#006c49] shadow-md transition-all"
            type="button"
          >
            Explore Rewards Store
          </button>
        </div>
      </div>
    </div>
  );
}
