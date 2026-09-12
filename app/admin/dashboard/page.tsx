'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useApp } from '@/lib/state/store';

export default function AdminDashboardPage() {
  const { residents, triggerSpotCheck } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSamplingModalOpen, setIsSamplingModalOpen] = useState(false);
  const [samplingDays, setSamplingDays] = useState('14');

  const showToast = (title: string, subtitle: string) => {
    setToastMessage(`${title} — ${subtitle}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleExportPDF = () => {
    showToast(
      'Municipal Report Pack Compiled',
      'Municipal Green Certification Dossier (Zone 4 West • Ward 88B) downloaded.'
    );
  };

  const handlePushCorrection = () => {
    showToast(
      'Corrective Prompt Broadcasted',
      'Micro-prompt pushed to 842 residents: "Please remove plastic liners before wet bin drop".'
    );
  };

  const filteredResidents = residents.filter((res) => {
    const matchesSearch =
      res.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.tower.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'towerA') return matchesSearch && res.tower === 'Tower A';
    if (selectedFilter === 'towerB') return matchesSearch && res.tower === 'Tower B';
    if (selectedFilter === 'towerC') return matchesSearch && res.tower === 'Tower C';
    if (selectedFilter === 'platinum') return matchesSearch && res.accuracy_rate >= 95;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] text-[#0b1c30] dark:text-white">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 min-h-[calc(100vh-4rem)] pb-24">
          <div className="w-full px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
            {/* Zone & Executive Compliance Top Banner */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-[#131d31] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col gap-2 z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#006c49] text-white text-[11px] uppercase tracking-wider font-bold">
                    Municipal Tier 1 Verified
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#3c4a42] dark:text-[#94a3b8] font-medium">
                    <span className="material-symbols-outlined text-[16px] text-[#10b981]">
                      location_on
                    </span>
                    Zone 4 West • Ward 88B
                  </span>
                  <span className="text-[#bbcabf] text-xs">•</span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    License #GVR-2024-MCGM
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-headline text-[#0b1c30] dark:text-white tracking-tight">
                  Green Valley Residency — Municipal Waste Compliance Portal
                </h1>

                <p className="text-sm text-[#3c4a42] dark:text-[#94a3b8] max-w-2xl leading-relaxed">
                  Authorized telemetry for Managing Committee officers and Municipal Sanitation
                  Marshals. Monitoring audited segregation cycles across Towers A, B, and C.
                </p>
              </div>

              <div className="flex items-center gap-3 z-10 self-start md:self-auto shrink-0">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                  <span>Export Municipal Green Certification Report</span>
                </button>

                <button
                  onClick={() => setIsSamplingModalOpen(true)}
                  className="p-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-[#0b1c30] dark:text-white transition-colors"
                  title="Audit Settings"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
                </button>
              </div>
            </section>

            {/* Executive KPI Bento Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Active Households */}
              <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                    Active Units
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981]">
                    <span className="material-symbols-outlined text-[18px]">home_work</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold font-headline text-[#0b1c30] dark:text-white">
                      842
                    </span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">/ 920</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[#10b981]">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span className="text-xs font-semibold">91.5% adoption rate</span>
                  </div>
                </div>
                <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-[#10b981] h-full rounded-full w-[91.5%]"></div>
                </div>
              </div>

              {/* Segregation Compliance */}
              <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                    Compliance
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981]">
                    <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold font-headline text-[#10b981]">
                      86%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[#10b981]">
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    <span className="text-xs font-semibold">+14% since launch</span>
                  </div>
                </div>
                <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-[#006c49] h-full rounded-full w-[86%]"></div>
                </div>
              </div>

              {/* Consistency Index */}
              <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                    Consistency Index
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#565e74] dark:text-[#bec6e0]">
                    <span className="material-symbols-outlined text-[18px]">pace</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold font-headline text-[#0b1c30] dark:text-white">
                      81%
                    </span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">grade A-</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[#3c4a42] dark:text-[#94a3b8]">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span className="text-xs font-medium">Stable over 60 days</span>
                  </div>
                </div>
                <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-[#565e74] h-full rounded-full w-[81%]"></div>
                </div>
              </div>

              {/* Eco Points Issued */}
              <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                    Eco Currency
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#e29100]">
                    <span className="material-symbols-outlined text-[18px]">monetization_on</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold font-headline text-[#0b1c30] dark:text-white">
                      42,680
                    </span>
                    <span className="text-xs text-[#e29100] font-bold">pts</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[#3c4a42] dark:text-[#94a3b8]">
                    <span className="material-symbols-outlined text-[16px]">redeem</span>
                    <span className="text-xs font-medium">1,240 rewards claimed</span>
                  </div>
                </div>
                <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-[#e29100] h-full rounded-full w-[74%]"></div>
                </div>
              </div>

              {/* Landfill Diversion */}
              <div className="flex flex-col justify-between p-5 rounded-2xl bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-white shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#005236] dark:text-[#6ffbbe] font-bold">
                    Landfill Diversion
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/40 dark:bg-black/20 flex items-center justify-center text-[#002113] dark:text-white">
                    <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold font-headline">4.8</span>
                    <span className="text-base font-bold">Tons</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[#005236] dark:text-[#6ffbbe]">
                    <span className="material-symbols-outlined text-[16px]">compost</span>
                    <span className="text-xs font-bold">Current month savings</span>
                  </div>
                </div>
                <div className="w-full bg-black/10 dark:bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-[#002113] dark:bg-white h-full rounded-full w-[88%]"></div>
                </div>
              </div>
            </section>

            {/* Analytics & Intelligence Center */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 30-Day Segregation Stream Graph */}
              <div className="lg:col-span-8 flex flex-col p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                      <span className="text-xs uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                        Stream Reliability
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-headline text-[#0b1c30] dark:text-white mt-1">
                      30-Day Segregation Accuracy Trend
                    </h2>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#10b981]"></span> Wet (92%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#565e74]"></span> Dry (84%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#e29100]"></span> Hazardous (78%)
                    </span>
                  </div>
                </div>

                {/* SVG Trend Graph */}
                <div className="relative w-full h-64 bg-[#eff4ff] dark:bg-[#1a263e] rounded-xl p-4 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20 pointer-events-none">
                    <div className="w-full border-b border-[#6c7a71]"></div>
                    <div className="w-full border-b border-[#6c7a71]"></div>
                    <div className="w-full border-b border-[#6c7a71]"></div>
                    <div className="w-full border-b border-[#6c7a71]"></div>
                  </div>

                  <svg
                    className="w-full h-48 overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 700 160"
                  >
                    <defs>
                      <linearGradient id="wetGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35"></stop>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>

                    {/* Wet Waste Line (Green) */}
                    <path
                      d="M0,70 Q 100,50 200,60 T 400,30 T 600,20 T 700,12"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                    ></path>
                    <path
                      d="M0,70 Q 100,50 200,60 T 400,30 T 600,20 T 700,12 L700,160 L0,160 Z"
                      fill="url(#wetGrad)"
                    ></path>

                    {/* Dry Waste Line (Slate/Blue) */}
                    <path
                      d="M0,95 Q 120,90 220,75 T 450,55 T 620,45 T 700,40"
                      fill="none"
                      stroke="#565e74"
                      strokeDasharray="4 3"
                      strokeWidth="2.5"
                    ></path>

                    {/* Special / Hazardous (Amber) */}
                    <path
                      d="M0,120 Q 150,115 280,105 T 500,90 T 700,68"
                      fill="none"
                      stroke="#e29100"
                      strokeWidth="2.5"
                    ></path>

                    {/* Key audit points */}
                    <circle
                      className="cursor-pointer hover:r-6 transition-all"
                      cx="200"
                      cy="60"
                      fill="#10b981"
                      r="5"
                    ></circle>
                    <circle
                      className="cursor-pointer hover:r-6 transition-all"
                      cx="400"
                      cy="30"
                      fill="#10b981"
                      r="5"
                    ></circle>
                    <circle
                      cx="700"
                      cy="12"
                      fill="#006c49"
                      r="6"
                      stroke="#ffffff"
                      strokeWidth="2"
                    ></circle>
                  </svg>

                  <div className="flex justify-between text-[11px] text-[#3c4a42] dark:text-[#94a3b8] pt-1 z-10 font-semibold">
                    <span>Day 1 (Launch)</span>
                    <span>Day 8 (First Spot Check)</span>
                    <span>Day 15 (Target Met)</span>
                    <span>Day 22 (Inter-Tower Event)</span>
                    <span>Day 30 (Audit Cycle Close)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                      Wet Composting Output
                    </span>
                    <span className="text-lg font-bold text-[#10b981] font-headline mt-0.5">
                      3,120 kg
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      0.8% organic reject
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                      Dry Recyclable Bales
                    </span>
                    <span className="text-lg font-bold text-[#565e74] dark:text-[#bec6e0] font-headline mt-0.5">
                      1,480 kg
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Direct to MRF partner
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                      Sanitary & E-Waste
                    </span>
                    <span className="text-lg font-bold text-[#e29100] font-headline mt-0.5">
                      200 kg
                    </span>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Safe incinerator drop
                    </span>
                  </div>
                </div>
              </div>

              {/* Common Misclassifications & AI Insights */}
              <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#ba1a1a] dark:text-[#ffdad6] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">warning</span> Priority
                      Interventions
                    </span>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                      AI Telemetry
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Misclassification Breakdown
                  </h2>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                    Top friction errors detected by apartment phone camera verifications before bin
                    drop.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Item 1 */}
                  <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#ffdad6]/40 dark:bg-[#93000a]/20 border border-[#ffdad6] dark:border-[#93000a]/40">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">
                          shopping_bag
                        </span>
                        Plastic bags in Wet waste
                      </span>
                      <span className="font-bold text-[#ba1a1a]">62%</span>
                    </div>
                    <div className="w-full bg-white dark:bg-[#131d31] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#ba1a1a] h-full rounded-full w-[62%]"></div>
                    </div>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Impact: Stalls society bio-digester grinding blade.
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#e29100]">
                          fastfood
                        </span>
                        Food stains on paper / pizza boxes
                      </span>
                      <span className="font-bold text-[#e29100]">24%</span>
                    </div>
                    <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#e29100] h-full rounded-full w-[24%]"></div>
                    </div>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Correction: Auto-prompts users to tear dry lid from grease tray.
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#565e74]">
                          medication
                        </span>
                        Blister packs in Dry recyclables
                      </span>
                      <span className="font-bold text-[#565e74] dark:text-[#bec6e0]">14%</span>
                    </div>
                    <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#565e74] h-full rounded-full w-[14%]"></div>
                    </div>
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Correction: Requires Municipal Red Bin handling.
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePushCorrection}
                  className="w-full py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-[#0b1c30] dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">notification_add</span>
                  Push Corrective Micro-Prompt to Residents
                </button>
              </div>
            </section>

            {/* Occasional Spot Check Governance (Privacy Preserving Engine) */}
            <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4 max-w-3xl">
                <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">shield_person</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold font-headline text-[#0b1c30] dark:text-white">
                      Privacy-Preserving Consistency Engine
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-[11px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> ACTIVE •
                      CHARTER COMPLIANT
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
                    Society Protocol Engine randomized check sampling frequency is configured to:
                    <strong className="text-[#0b1c30] dark:text-white ml-1">
                      1 random check per household every {samplingDays} days
                    </strong>
                    .
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#3c4a42] dark:text-[#94a3b8] bg-[#eff4ff] dark:bg-[#1a263e] px-3 py-1 rounded-lg w-fit">
                    <span className="material-symbols-outlined text-[15px] text-[#10b981]">
                      gavel
                    </span>
                    <span>
                      Transparent charter disclaimer: Continuous surveillance and constant
                      monitoring are strictly disabled by society democratic resolution.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Audit Window
                  </span>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-white">
                    Next batch: 48 flats tomorrow
                  </span>
                </div>
                <button
                  onClick={() => setIsSamplingModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-[#0b1c30] dark:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  Adjust Sampling Frequency
                </button>
              </div>
            </section>

            {/* Tower Leaderboards & Residents Directory Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tower Leaderboard Widget */}
              <section className="lg:col-span-4 flex flex-col p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#10b981] text-[22px]">
                      leaderboard
                    </span>
                    <h3 className="text-lg font-bold font-headline text-[#0b1c30] dark:text-white">
                      Tower Standings
                    </h3>
                  </div>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">Live Aggregates</span>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Building A */}
                  <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col gap-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#10b981] text-white text-xs font-bold flex items-center justify-center">
                          1
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white">
                            Building A (Magnolia)
                          </h4>
                          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                            280 Units
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-[#10b981]">94%</span>
                        <span className="block text-[10px] text-[#10b981] font-semibold">
                          Gold Standard
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#10b981] h-full rounded-full w-[94%]"></div>
                    </div>
                  </div>

                  {/* Building B */}
                  <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col gap-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#565e74] text-white text-xs font-bold flex items-center justify-center">
                          2
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white">
                            Building B (Orchid)
                          </h4>
                          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                            310 Units • Deepak&apos;s Tower
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-[#0b1c30] dark:text-white">
                          89%
                        </span>
                        <span className="block text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                          Silver Standard
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#565e74] h-full rounded-full w-[89%]"></div>
                    </div>
                  </div>

                  {/* Building C */}
                  <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col gap-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#e29100] text-white text-xs font-bold flex items-center justify-center">
                          3
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white">
                            Building C (Palms)
                          </h4>
                          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                            252 Units
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-[#0b1c30] dark:text-white">
                          85%
                        </span>
                        <span className="block text-[10px] text-[#e29100] font-semibold">
                          Focus Area
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#e29100] h-full rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#6ffbbe]/20 dark:bg-[#006c49]/30 border border-[#10b981]/30 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">
                    emoji_events
                  </span>
                  <p className="text-xs text-[#0b1c30] dark:text-white">
                    <strong>Tower Trophy:</strong> Building A gets priority electric lawn
                    maintenance discount sponsored by MCGM municipal green rebate funds.
                  </p>
                </div>
              </section>

              {/* Residents Registry & Tower Audit Records */}
              <section className="lg:col-span-8 flex flex-col p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-headline text-[#0b1c30] dark:text-white">
                      Resident Audit Registry
                    </h3>
                    <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                      Searchable registry of all 842 participating residences
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search flat, name..."
                        className="pl-9 pr-3 py-1.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981] w-48 sm:w-60"
                      />
                      <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-[#3c4a42] dark:text-[#94a3b8]">
                        search
                      </span>
                    </div>

                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      aria-label="Filter residents by tower or tier"
                      className="px-3 py-1.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none"
                    >
                      <option value="all">All Towers</option>
                      <option value="towerA">Tower A</option>
                      <option value="towerB">Tower B</option>
                      <option value="towerC">Tower C</option>
                      <option value="platinum">Platinum (95%+)</option>
                    </select>
                  </div>
                </div>

                {/* Table View */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] bg-[#eff4ff] dark:bg-[#1a263e]">
                        <th className="py-2.5 px-3 rounded-l-lg font-bold">Resident</th>
                        <th className="py-2.5 px-3 font-bold">Flat</th>
                        <th className="py-2.5 px-3 font-bold">Accuracy</th>
                        <th className="py-2.5 px-3 font-bold">Consistency</th>
                        <th className="py-2.5 px-3 font-bold">Streak</th>
                        <th className="py-2.5 px-3 font-bold">Eco Points</th>
                        <th className="py-2.5 px-3 font-bold">Badge</th>
                        <th className="py-2.5 px-3 rounded-r-lg font-bold text-right">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#1e293b] text-xs">
                      {filteredResidents.slice(0, 8).map((resident) => {
                        const isSelf = resident.flat_number === '402B';
                        return (
                          <tr
                            key={resident.id}
                            className={`hover:bg-[#eff4ff]/60 dark:hover:bg-[#1a263e]/60 transition-colors ${
                              isSelf ? 'bg-[#6ffbbe]/10 dark:bg-[#006c49]/15' : ''
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={resident.avatar_url || '/deepak-avatar.png'}
                                  alt={resident.full_name}
                                  className={`w-8 h-8 rounded-full object-cover ${
                                    isSelf ? 'ring-2 ring-[#10b981]' : ''
                                  }`}
                                />
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#0b1c30] dark:text-white flex items-center gap-1">
                                    {resident.full_name}
                                    {isSelf && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#10b981] text-white font-bold">
                                        You
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                                    {resident.tower}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 font-semibold text-[#0b1c30] dark:text-white">
                              {resident.flat_number}
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  resident.accuracy_rate >= 95
                                    ? 'bg-[#6ffbbe] text-[#002113]'
                                    : 'bg-[#eff4ff] dark:bg-[#1a263e] text-[#10b981]'
                                }`}
                              >
                                {resident.accuracy_rate}%
                              </span>
                            </td>

                            <td className="py-3 px-3 text-[#0b1c30] dark:text-white font-medium">
                              {resident.consistency_index}%
                            </td>

                            <td className="py-3 px-3 font-bold text-[#e29100]">
                              <span className="flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[15px]">
                                  local_fire_department
                                </span>
                                {resident.streak_days}d
                              </span>
                            </td>

                            <td className="py-3 px-3 font-bold text-[#0b1c30] dark:text-white">
                              {resident.eco_points} pts
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                  resident.badge_status === 'Platinum'
                                    ? 'bg-[#ffddb8] text-[#855300]'
                                    : resident.badge_status === 'Gold'
                                    ? 'bg-[#eff4ff] text-[#006c49]'
                                    : 'bg-[#f1f5f9] text-[#565e74]'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[13px]">
                                  {resident.badge_status === 'Platinum'
                                    ? 'star'
                                    : resident.badge_status === 'Gold'
                                    ? 'military_tech'
                                    : 'workspace_premium'}
                                </span>
                                {resident.badge_status}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  triggerSpotCheck();
                                  showToast(
                                    'Spot Check Triggered',
                                    `Random spot check initiated for Flat ${resident.flat_number} (${resident.full_name}).`
                                  );
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#10b981] hover:text-white text-[#0b1c30] dark:text-white text-[11px] font-semibold transition-all"
                                title="Run spot check"
                                type="button"
                              >
                                Audit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                  <span>
                    Showing {Math.min(8, filteredResidents.length)} of {residents.length} units
                  </span>
                  <Link
                    href="/admin/residents"
                    className="text-[#10b981] font-bold hover:underline flex items-center gap-1"
                  >
                    View All 842 Residents
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </section>
            </div>

            {/* Municipal Verification Export & Society Auditor Sign-off Card */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[#eff4ff] dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#6ffbbe] text-[#002113] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[32px]">verified_user</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-headline text-[#0b1c30] dark:text-white">
                    Municipal Ward Certification Status: APPROVED • GRADE AA
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] max-w-2xl leading-relaxed mt-0.5">
                    Green Valley Residency satisfies Section 48-A of Urban Waste Bylaws. Eligible
                    for 5% society property tax municipal rebate voucher upon submitting this monthly
                    dossier.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={handleExportPDF}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#006c49] hover:bg-[#10b981] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  Generate Signed Audit Pack (.PDF)
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Sampling Frequency Configuration Modal */}
      {isSamplingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10b981]">tune</span>
                <h3 className="font-bold text-lg text-[#0b1c30] dark:text-white font-headline">
                  Sampling Frequency
                </h3>
              </div>
              <button
                onClick={() => setIsSamplingModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#3c4a42] dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#1a263e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
              Configure the randomized spot-check cycle across all 842 residential units. Democratic
              bylaws mandate frequency between 10 and 20 days.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                Sampling Interval: Every {samplingDays} Days
              </label>
              <input
                type="range"
                min="10"
                max="20"
                value={samplingDays}
                onChange={(e) => setSamplingDays(e.target.value)}
                className="w-full accent-[#10b981]"
              />
              <div className="flex justify-between text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                <span>10 Days (Strict)</span>
                <span>14 Days (Balanced)</span>
                <span>20 Days (Relaxed)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#10b981] text-[18px]">verified</span>
              <span>Estimated 56 spot audits triggered per week.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSamplingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#3c4a42] dark:text-[#94a3b8]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsSamplingModalOpen(false);
                  showToast(
                    'Audit Sampling Updated',
                    `Random sampling updated to every ${samplingDays} days per household.`
                  );
                }}
                className="px-4 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#006c49]"
              >
                Apply Setting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-[#0b1c30] text-white px-5 py-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in border border-slate-700">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[22px]">task_alt</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
