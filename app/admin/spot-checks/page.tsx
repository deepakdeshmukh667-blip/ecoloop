'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useApp } from '@/lib/state/store';

export default function AdminSpotChecksPage() {
  const { spotChecks, residents, triggerSpotCheck } = useApp();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDispatchBatch = () => {
    triggerSpotCheck();
    showToast('Dispatched random spot-check batch to 48 households (+40 pts bonus attached)');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] text-[#0b1c30] dark:text-white">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 min-h-[calc(100vh-4rem)] pb-24">
          <div className="w-full px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">casino</span>
                  <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Random Spot-Check Sampling Engine
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                  Privacy-preserving governance protocol • 1 random check per household every 12–18 days
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDispatchBatch}
                  className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Dispatch Batch (48 Flats)
                </button>
              </div>
            </div>

            {/* Governance Charter Banner */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#6ffbbe]/30 text-[#006c49] dark:text-[#6ffbbe] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">verified_user</span>
                </div>
                <div>
                  <h3 className="text-base font-bold font-headline text-[#0b1c30] dark:text-white">
                    Democratic Society Charter Enforced
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1 max-w-2xl leading-relaxed">
                    Under Resolution #2024-GVR-9, residents cannot be surveyed more frequently than once every 12 days. Continuous CCTV surveillance is strictly barred.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs font-bold text-[#10b981]">
                  +40 Pts per Audit
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs font-bold text-[#0b1c30] dark:text-white">
                  94.2% Completion Rate
                </span>
              </div>
            </div>

            {/* Recent Spot Checks Registry */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-headline text-[#0b1c30] dark:text-white">
                    Recent Spot Audits Log
                  </h3>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Live responses from randomly sampled residential flats
                  </p>
                </div>
                <span className="text-xs text-[#10b981] font-semibold">
                  {spotChecks.length} active sessions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] bg-[#eff4ff] dark:bg-[#1a263e]">
                      <th className="py-2.5 px-3 rounded-l-lg font-bold">Audit ID</th>
                      <th className="py-2.5 px-3 font-bold">Assigned Flat</th>
                      <th className="py-2.5 px-3 font-bold">Trigger Date</th>
                      <th className="py-2.5 px-3 font-bold">Status</th>
                      <th className="py-2.5 px-3 font-bold">Result</th>
                      <th className="py-2.5 px-3 rounded-r-lg font-bold text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#1e293b]">
                    {spotChecks.map((sc) => (
                      <tr key={sc.id} className="hover:bg-[#eff4ff]/50 dark:hover:bg-[#1a263e]/50">
                        <td className="py-3 px-3 font-mono font-semibold text-[#0b1c30] dark:text-white">
                          {sc.id}
                        </td>
                        <td className="py-3 px-3 font-bold text-[#0b1c30] dark:text-white">
                          Apt 402B (Tower B)
                        </td>
                        <td className="py-3 px-3 text-[#3c4a42] dark:text-[#94a3b8]">
                          {new Date(sc.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              sc.status === 'completed'
                                ? 'bg-[#6ffbbe] text-[#002113]'
                                : 'bg-[#ffddb8] text-[#855300]'
                            }`}
                          >
                            {sc.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#10b981]">
                          {sc.result?.verified ? '100% Segregated' : 'Pending Upload'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#10b981]">
                          +{sc.points_awarded || 40} pts
                        </td>
                      </tr>
                    ))}

                    {residents.slice(1, 6).map((res, i) => (
                      <tr key={`mock-${i}`} className="hover:bg-[#eff4ff]/50 dark:hover:bg-[#1a263e]/50">
                        <td className="py-3 px-3 font-mono text-[#3c4a42] dark:text-[#94a3b8]">
                          SC-2024-0{88 + i}
                        </td>
                        <td className="py-3 px-3 font-bold text-[#0b1c30] dark:text-white">
                          Apt {res.flat_number} ({res.tower})
                        </td>
                        <td className="py-3 px-3 text-[#3c4a42] dark:text-[#94a3b8]">
                          Sep {10 - i}, 2024
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#6ffbbe] text-[#002113]">
                            COMPLETED
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#10b981]">
                          Zero Contamination Pass
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#10b981]">
                          +40 pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
