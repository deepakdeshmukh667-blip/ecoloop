'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function CivicPrivacyPage() {
  const [photoRetentionDays, setPhotoRetentionDays] = useState(30);

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Civic Guarantee Header */}
            <section className="bg-white dark:bg-[#131d31] p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#6ffbbe]/25 dark:bg-[#006c49]/30 text-[#006c49] dark:text-[#6ffbbe] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">shield</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                      Your Privacy Matters
                    </h1>
                    <span className="text-xs text-[#006c49] dark:text-[#10b981] font-semibold">
                      Zero surveillance civic guarantee
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[24px] text-[#6c7a71]">lock</span>
              </div>

              {/* Privacy Item Controls */}
              <div className="flex flex-col gap-2.5 pt-2">
                {/* 1. Photo Verification */}
                <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#10b981] text-[22px]">
                      center_focus_strong
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                        Photo Verification
                      </span>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Only waste classification scans
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-[10px] font-bold">
                    Active
                  </span>
                </div>

                {/* 2. Continuous Surveillance */}
                <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">
                      videocam_off
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                        Continuous Surveillance
                      </span>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Strictly OFF • Democratic Charter
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#3c4a42] dark:text-[#94a3b8] text-[10px] font-bold border border-[#dce9ff] dark:border-[#27354f]">
                    OFF
                  </span>
                </div>

                {/* 3. Location Tracking */}
                <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#565e74] text-[22px]">
                      location_off
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                        Location Tracking
                      </span>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        No real-time GPS telemetry
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#3c4a42] dark:text-[#94a3b8] text-[10px] font-bold border border-[#dce9ff] dark:border-[#27354f]">
                    OFF
                  </span>
                </div>

                {/* 4. Data Sharing */}
                <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#10b981] text-[22px]">
                      policy
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                        Data Sharing
                      </span>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Governed by Society Bylaws
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#3c4a42] dark:text-[#94a3b8]">
                    chevron_right
                  </span>
                </div>

                {/* 5. Photo Retention */}
                <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#e29100] text-[22px]">
                      auto_delete
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                        Photo Retention
                      </span>
                      <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Ephemeral • auto-purge period
                      </span>
                    </div>
                  </div>
                  <select
                    value={photoRetentionDays}
                    onChange={(e) => setPhotoRetentionDays(Number(e.target.value))}
                    className="bg-white dark:bg-[#131d31] border border-[#dce9ff] dark:border-[#27354f] rounded-lg px-2 py-1 text-xs font-bold text-[#0b1c30] dark:text-white focus:outline-none"
                  >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>
              </div>

              {/* Explanatory Box */}
              <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#006c49] dark:text-[#10b981] shrink-0 mt-0.5">
                  info
                </span>
                <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
                  EcoLoop uses occasional random spot checks to reward real habits instead of
                  one-time staged photos. We do not continuously monitor your household or access
                  personal living spaces.
                </p>
              </div>
            </section>

            {/* Tower B Compliance Snapshot */}
            <section className="bg-white dark:bg-[#131d31] p-5 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                  Tower B Compliance
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-xs font-bold">
                  98.4% Clean
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-[16/8] bg-[#1a263e]">
                <img
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
                  alt="Audit Snapshot"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 justify-between">
                  <div>
                    <span className="text-[10px] text-white/70 block">Last Audit Snapshot</span>
                    <span className="text-sm font-bold text-white font-headline">
                      Zero Contamination Flag
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#10b981] text-white text-xs font-bold">
                    Verified
                  </span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
