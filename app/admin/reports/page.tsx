'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';

export default function AdminReportsPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">picture_as_pdf</span>
                  <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Municipal Green Compliance Reports
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                  Official audit submissions for MCGM Zone 4 West • Ward 88B Municipal Corporation
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Compiling complete CSV telemetry archive...')}
                  className="px-4 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">table_chart</span>
                  Raw Telemetry (.CSV)
                </button>
                <button
                  onClick={() => showToast('Generated signed Municipal Dossier (PDF)')}
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Download Signed Dossier (.PDF)
                </button>
              </div>
            </div>

            {/* Main Certificate Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#6ffbbe] text-[#002113] flex items-center justify-center font-bold text-xl">
                    <span className="material-symbols-outlined text-[36px]">verified</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold font-headline text-[#0b1c30] dark:text-white">
                        Grade AA Municipal Waste Diversion Certificate
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10b981] text-white text-[10px] font-bold uppercase">
                        Active
                      </span>
                    </div>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-0.5 block">
                      Issued to Green Valley Residency Cooperative Housing Society Ltd. • License #GVR-2024-MCGM
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Validity Period
                  </span>
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white block mt-0.5">
                    Sept 1, 2024 – Sept 30, 2024
                  </span>
                </div>
              </div>

              {/* Dossier Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">Wet Waste Composted</span>
                  <span className="text-xl font-bold text-[#10b981] font-headline mt-1">3.12 Tons</span>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-0.5">Zero organic reject</span>
                </div>

                <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">Dry Recyclables Baled</span>
                  <span className="text-xl font-bold text-[#565e74] dark:text-[#bec6e0] font-headline mt-1">1.48 Tons</span>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-0.5">Dispatched to authorized MRF</span>
                </div>

                <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">Landfill Avoidance</span>
                  <span className="text-xl font-bold text-[#e29100] font-headline mt-1">4.8 Tons</span>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-0.5">91.5% society diverted</span>
                </div>

                <div className="p-4 rounded-xl bg-[#6ffbbe]/20 dark:bg-[#006c49]/30 border border-[#10b981]/30 flex flex-col">
                  <span className="text-xs text-[#006c49] dark:text-[#6ffbbe] font-semibold">Municipal Tax Rebate</span>
                  <span className="text-xl font-bold text-[#002113] dark:text-white font-headline mt-1">5% Property Rebate</span>
                  <span className="text-[11px] text-[#006c49] dark:text-[#6ffbbe] mt-0.5">Worth approx. ₹ 1.4 Lakhs</span>
                </div>
              </div>

              {/* Inspector Signatures */}
              <div className="pt-4 border-t border-[#e2e8f0] dark:border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#10b981] text-[20px]">fingerprint</span>
                  <span>Cryptographic Hash: 8f9b2c4e1a0d7f3e82b5d4a1</span>
                </div>
                <span>Audited by Municipal Sanitation Inspector #MCGM-88B-04</span>
              </div>
            </div>

            {/* Historical Monthly Archives */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
              <h3 className="text-base font-bold font-headline text-[#0b1c30] dark:text-white">
                Archived Monthly Dossiers
              </h3>

              <div className="flex flex-col divide-y divide-[#f1f5f9] dark:divide-[#1e293b]">
                {[
                  { month: 'August 2024', grade: 'Grade AA', tons: '4.6 Tons', code: 'MCGM-2024-08' },
                  { month: 'July 2024', grade: 'Grade A', tons: '4.2 Tons', code: 'MCGM-2024-07' },
                  { month: 'June 2024', grade: 'Grade A-', tons: '3.9 Tons', code: 'MCGM-2024-06' },
                ].map((arc, i) => (
                  <div key={i} className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#565e74]">folder</span>
                      <div>
                        <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                          {arc.month} Municipal Dossier
                        </span>
                        <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                          {arc.code} • {arc.tons} diverted • {arc.grade}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`Downloaded ${arc.month} PDF audit archive`)}
                      className="px-3 py-1.5 rounded-lg bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors flex items-center gap-1"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      Download
                    </button>
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
