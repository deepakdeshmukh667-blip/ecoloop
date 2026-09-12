'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';

export default function AdminSettingsPage() {
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [societyName, setSocietyName] = useState('Green Valley Residency CHS Ltd.');
  const [ward, setWard] = useState('Zone 4 West • Ward 88B');
  const [licenseNumber, setLicenseNumber] = useState('GVR-2024-MCGM');
  const [minConfidence, setMinConfidence] = useState('85');
  const [samplingWindow, setSamplingWindow] = useState('14');
  const [strictBlackBagBan, setStrictBlackBagBan] = useState(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Admin configuration and municipal bylaws updated successfully');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] text-[#0b1c30] dark:text-white">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 min-h-[calc(100vh-4rem)] pb-24">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">settings</span>
                  <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Society Admin & Municipal Bylaws
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                  Manage society charter parameters, AI confidence thresholds, and municipal credentials
                </p>
              </div>

              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save All Bylaws
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {/* Society & Municipal Credentials */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                  <span className="material-symbols-outlined text-[#10b981]">apartment</span>
                  <h2 className="text-base font-bold font-headline text-[#0b1c30] dark:text-white">
                    Municipal Registration & Ward Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                      Society Legal Name
                    </label>
                    <input
                      type="text"
                      value={societyName}
                      onChange={(e) => setSocietyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                      Municipal Ward & Zone
                    </label>
                    <input
                      type="text"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                      Municipal License #
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                      Participating Towers & Flats
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Towers A, B, C (842 active units)"
                      className="w-full px-3 py-2 rounded-xl bg-[#e2e8f0]/60 dark:bg-[#1e293b]/60 text-xs text-[#3c4a42] dark:text-[#94a3b8] border border-[#e2e8f0] dark:border-[#1e293b] cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* AI Vision Model & Classification Rules */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                  <span className="material-symbols-outlined text-[#10b981]">psychology</span>
                  <h2 className="text-base font-bold font-headline text-[#0b1c30] dark:text-white">
                    AI Vision Model & Sensitivity Thresholds
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                        Minimum Verification Confidence: {minConfidence}%
                      </label>
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Scans below this prompt for secondary angle
                      </span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="95"
                      value={minConfidence}
                      onChange={(e) => setMinConfidence(e.target.value)}
                      className="w-full accent-[#10b981]"
                    />
                  </div>

                  <div className="py-2 flex items-center justify-between border-t border-[#e2e8f0] dark:border-[#1e293b]">
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                        Strict Black Bag Prohibition
                      </span>
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Opaque plastic black bags auto-rejected as unverified
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStrictBlackBagBan(!strictBlackBagBan)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        strictBlackBagBan ? 'bg-[#10b981]' : 'bg-[#cbd5e1] dark:bg-[#334155]'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          strictBlackBagBan ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Charter & Governance */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                  <span className="material-symbols-outlined text-[#10b981]">shield_person</span>
                  <h2 className="text-base font-bold font-headline text-[#0b1c30] dark:text-white">
                    Privacy Guarantee & Sampling Window
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                        Spot-Check Sampling Window: Every {samplingWindow} Days
                      </label>
                      <span className="text-[11px] text-[#10b981] font-semibold">
                        Within Democratic Charter Limits (10-20 days)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="20"
                      value={samplingWindow}
                      onChange={(e) => setSamplingWindow(e.target.value)}
                      className="w-full accent-[#10b981]"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#10b981] text-[18px] shrink-0 mt-0.5">
                      gavel
                    </span>
                    <span>
                      Continuous CCTV surveillance and involuntary real-time geo-tracking are hardcoded
                      to DISABLED. These safeguards cannot be altered without a 75% society AGM majority.
                    </span>
                  </div>
                </div>
              </div>
            </form>
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
