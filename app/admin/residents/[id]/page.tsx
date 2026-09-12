'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useApp } from '@/lib/state/store';

export default function ResidentDetailPage() {
  const params = useParams();
  const residentId = params.id as string;
  const { residents, verifications, triggerSpotCheck } = useApp();

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const resident = residents.find((r) => r.id === residentId) || residents[0];

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] text-[#0b1c30] dark:text-white">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 min-h-[calc(100vh-4rem)] pb-24">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/residents"
                  className="w-9 h-9 rounded-full bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-center text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Household Compliance Dossier
                  </h1>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Municipal audit record for Flat {resident.flat_number} ({resident.tower})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerSpotCheck();
                    showToast(`Spot check dispatched to Flat ${resident.flat_number}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">casino</span>
                  Trigger Spot Check
                </button>
              </div>
            </div>

            {/* Resident Hero Profile Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#10b981]/15 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-4 z-10">
                <img
                  src={resident.avatar_url || '/deepak-avatar.png'}
                  alt={resident.full_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-[#10b981]"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                      {resident.full_name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-[11px] font-bold">
                      {resident.badge_status}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-0.5">
                    Flat {resident.flat_number} • {resident.tower} • Green Valley Residency
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] dark:bg-[#1a263e] text-[#10b981] text-[11px] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                      Charter Compliant
                    </span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                      Registered Member since Aug 2024
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Quick Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto z-10">
                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col text-center">
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] font-bold uppercase">
                    Accuracy
                  </span>
                  <span className="text-lg font-bold text-[#10b981] mt-0.5">
                    {resident.accuracy_rate}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col text-center">
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] font-bold uppercase">
                    Consistency
                  </span>
                  <span className="text-lg font-bold text-[#0b1c30] dark:text-white mt-0.5">
                    {resident.consistency_index}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col text-center">
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] font-bold uppercase">
                    Streak
                  </span>
                  <span className="text-lg font-bold text-[#e29100] mt-0.5">
                    {resident.streak_days}d
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col text-center">
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] font-bold uppercase">
                    Points
                  </span>
                  <span className="text-lg font-bold text-[#0b1c30] dark:text-white mt-0.5">
                    {resident.eco_points}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification History Log */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-headline text-[#0b1c30] dark:text-white">
                    Logged AI Verification Scans
                  </h3>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Image classifications submitted by Flat {resident.flat_number}
                  </p>
                </div>
                <span className="text-xs text-[#10b981] font-semibold">
                  {verifications.length} verified events
                </span>
              </div>

              <div className="flex flex-col divide-y divide-[#f1f5f9] dark:divide-[#1e293b]">
                {verifications.map((v) => {
                  const cat = v.waste_category || v.ai_detected_category || 'Wet Waste';
                  const conf = v.confidence ?? v.ai_confidence ?? 94;
                  const item = v.item_detected || v.ai_feedback || 'Clean segregated stream';

                  return (
                    <div key={v.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981]">
                          <span className="material-symbols-outlined text-[20px]">
                            {cat === 'Wet Waste'
                              ? 'compost'
                              : cat === 'Dry Recyclables'
                              ? 'recycling'
                              : 'warning'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                              {cat}
                            </span>
                            <span className="px-2 py-0.2 rounded-full bg-[#6ffbbe]/30 text-[#006c49] dark:text-[#6ffbbe] text-[10px] font-bold">
                              {conf}% AI Confidence
                            </span>
                          </div>
                          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                            {new Date(v.created_at).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                            {' • '}
                            {item}
                          </span>
                        </div>
                      </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#10b981]">
                        +{v.points_awarded} pts
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#10b981] text-[11px] font-bold">
                        Approved
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

            {/* Municipal Compliance Certification Guarantee */}
            <div className="p-5 rounded-2xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#10b981] text-[28px]">
                  verified_user
                </span>
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                    Zero Violation Record
                  </span>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                    Flat {resident.flat_number} has zero recorded municipal black-bag strikes in the last 180 days.
                  </span>
                </div>
              </div>

              <button
                onClick={() => showToast(`Commendation certificate sent to ${resident.full_name}`)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] text-xs font-semibold text-[#0b1c30] dark:text-white hover:bg-slate-50 transition-colors"
                type="button"
              >
                Send Commendation
              </button>
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
