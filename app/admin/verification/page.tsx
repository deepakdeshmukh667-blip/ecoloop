'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useApp } from '@/lib/state/store';

export default function AdminVerificationAuditPage() {
  const { verifications } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = verifications.filter((v) => {
    const cat = v.waste_category || v.ai_detected_category || (v.category_slug === 'wet' ? 'Wet Waste' : v.category_slug === 'dry' ? 'Dry Recyclables' : 'Sanitary & E-Waste');
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'wet') return cat.includes('Wet') || v.category_slug === 'wet';
    if (selectedCategory === 'dry') return cat.includes('Dry') || v.category_slug === 'dry';
    if (selectedCategory === 'hazardous') return cat.includes('Sanitary') || cat.includes('Hazardous') || v.category_slug === 'special';
    return true;
  });

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
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">fact_check</span>
                  <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Verification Telemetry & AI Audit Stream
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                  Real-time image classification stream from mobile resident cameras before bin deposit
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Exported audit telemetry feed')}
                  className="px-4 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  Export Audit Log
                </button>
              </div>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Scans Today
                  </span>
                  <div className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white mt-0.5">
                    184
                  </div>
                  <span className="text-[11px] text-[#10b981] font-semibold mt-1 block">
                    98.8% valid segregation
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981]">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Avg AI Confidence
                  </span>
                  <div className="text-2xl font-bold font-headline text-[#10b981] mt-0.5">
                    94.6%
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-1 block">
                    Vision model v4.2.1
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981]">
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Contamination Intercepts
                  </span>
                  <div className="text-2xl font-bold font-headline text-[#e29100] mt-0.5">
                    1.2%
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-1 block">
                    Saved from landfill bio-digester
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#ffddb8] dark:bg-[#523200] flex items-center justify-center text-[#855300] dark:text-[#ffddb8]">
                  <span className="material-symbols-outlined text-[20px]">shield</span>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Streams' },
                { id: 'wet', label: 'Wet Waste (Green)' },
                { id: 'dry', label: 'Dry Recyclables (Blue)' },
                { id: 'hazardous', label: 'Sanitary / E-Waste (Red)' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedCategory(pill.id)}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === pill.id
                      ? 'bg-[#10b981] text-white shadow-sm'
                      : 'bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Verification Feed List */}
            <div className="bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl shadow-sm overflow-hidden flex flex-col divide-y divide-[#f1f5f9] dark:divide-[#1e293b]">
              {filtered.map((item) => {
                const itemCat = item.waste_category || item.ai_detected_category || 'Wet Waste';
                const itemConf = item.confidence ?? item.ai_confidence ?? 94;
                const itemName = item.item_detected || item.ai_feedback || 'Clean Segregated Item';

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#eff4ff]/40 dark:hover:bg-[#1a263e]/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981] shrink-0">
                        <span className="material-symbols-outlined text-[24px]">
                          {itemCat === 'Wet Waste'
                            ? 'compost'
                            : itemCat === 'Dry Recyclables'
                            ? 'recycling'
                            : 'warning'}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-[#0b1c30] dark:text-white font-headline">
                            {itemName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-[10px] font-bold">
                            {itemCat}
                          </span>
                          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                            {itemConf}% AI Confidence
                          </span>
                        </div>

                      <div className="flex items-center gap-2 text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                        <span>Apt 402B (Tower B)</span>
                        <span>•</span>
                        <span>
                          {new Date(item.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span className="text-[#10b981] font-semibold">
                          +{item.points_awarded} pts awarded
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => showToast(`Audit record #${item.id} verified as compliant`)}
                      className="px-3 py-1.5 rounded-lg bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#10b981] hover:text-white text-xs font-semibold text-[#0b1c30] dark:text-white transition-all flex items-center gap-1"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      Confirm
                    </button>
                    <button
                      onClick={() => showToast(`Flagged item #${item.id} for contamination review`)}
                      className="px-3 py-1.5 rounded-lg border border-[#ffdad6] text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-all flex items-center gap-1"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      Flag
                    </button>
                  </div>
                </div>
              );
            })}
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
