'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/state/store';

export default function SpotCheckModal() {
  const router = useRouter();
  const { isSpotCheckModalOpen, setIsSpotCheckModalOpen } = useApp();

  if (!isSpotCheckModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#131d31] rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-[#e2e8f0] dark:border-[#1e293b] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#006c49] dark:text-[#10b981] font-bold text-lg font-headline">
            <span className="material-symbols-outlined text-[24px]">casino</span>
            <span>🎲 Spot Check Notification</span>
          </div>
          <button
            onClick={() => setIsSpotCheckModalOpen(false)}
            className="text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-sm text-[#0b1c30] dark:text-[#f8fafc] leading-relaxed">
          You have been selected for a random privacy-first habit audit! Capture a quick photo of
          your kitchen bin before handover to claim a{' '}
          <strong className="text-[#006c49] dark:text-[#10b981]">double point bonus (+40 pts)</strong>.
        </p>

        <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed border border-[#dce9ff] dark:border-[#27354f]">
          Audits occur less than twice monthly per flat to safeguard comfort while guaranteeing
          genuine community sorting fidelity.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setIsSpotCheckModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#e5eeff] dark:bg-[#1e293b] text-[#0b1c30] dark:text-white text-xs font-semibold hover:bg-[#dce9ff] dark:hover:bg-[#27354f] transition-colors"
            type="button"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              setIsSpotCheckModalOpen(false);
              router.push('/resident/verify?spot=true');
            }}
            className="px-4 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#006c49] shadow-md transition-all"
            type="button"
          >
            Open AI Camera
          </button>
        </div>
      </div>
    </div>
  );
}
