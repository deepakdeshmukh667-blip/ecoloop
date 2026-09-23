'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function LearnToSegregatePage() {
  const { educationalItems } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'wet' | 'dry'>('all');

  const filteredItems = educationalItems.filter((item) => {
    const matchesTab = selectedTab === 'all' || item.category_slug === selectedTab;
    const matchesSearch =
      !searchQuery ||
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.search_keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.golden_rule.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Field Guide Hero Card */}
            <section className="relative overflow-hidden rounded-2xl bg-[#eff4ff] dark:bg-[#1a263e] p-6 border border-[#dce9ff] dark:border-[#27354f] shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#10b981] text-white w-fit shadow-sm text-xs font-bold font-headline">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span className="uppercase tracking-wider">Society Field Guide</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30] dark:text-white leading-tight font-headline">
                    What Goes Where?
                  </h1>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] max-w-xs leading-relaxed">
                    Simple, senior-friendly sorting tips for Green Valley Residency residents.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-white dark:bg-[#131d31] flex items-center justify-center shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[36px] text-[#10b981]">
                    recycling
                  </span>
                </div>
              </div>

              {/* Download PDF Action */}
              <div className="mt-5 pt-3 border-t border-[#dce9ff] dark:border-[#27354f] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center justify-center gap-2 bg-[#006c49] dark:bg-[#10b981] text-white px-4 py-2.5 rounded-xl active:scale-[0.98] transition-transform shadow-md text-xs font-bold font-headline"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  <span>Download Society Chart (.PDF)</span>
                </button>
                <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] text-center sm:text-left">
                  Updated: Oct 2024 • Tower A & B Rules
                </span>
              </div>
            </section>

            {/* Quick Item Search */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="itemSearch"
                className="text-xs font-bold text-[#3c4a42] dark:text-[#94a3b8]"
              >
                Quick Item Search
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#6c7a71] dark:text-[#94a3b8] text-[20px] pointer-events-none">
                  search
                </span>
                <input
                  id="itemSearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search an item (e.g. pizza box, battery, coconut shell)..."
                  className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white dark:bg-[#131d31] text-[#0b1c30] dark:text-white text-xs border border-[#e2e8f0] dark:border-[#1e293b] placeholder:text-[#6c7a71]/60 focus:outline-none focus:border-[#10b981] transition-colors shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-[#6c7a71] hover:text-[#0b1c30] dark:hover:text-white p-1"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Categories Pills */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                  Categories
                </span>
                <span className="text-xs text-[#006c49] dark:text-[#10b981] font-bold">
                  3 Bins Standard
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedTab('all')}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    selectedTab === 'all'
                      ? 'bg-[#10b981] text-white'
                      : 'bg-white dark:bg-[#131d31] text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px]">apps</span>
                  <span className="mt-1">All Items</span>
                </button>

                <button
                  onClick={() => setSelectedTab('wet')}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    selectedTab === 'wet'
                      ? 'bg-[#10b981] text-white'
                      : 'bg-white dark:bg-[#131d31] text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px] text-[#10b981]">
                    compost
                  </span>
                  <span className="mt-1 truncate">Wet / Green</span>
                </button>

                <button
                  onClick={() => setSelectedTab('dry')}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    selectedTab === 'dry'
                      ? 'bg-[#10b981] text-white'
                      : 'bg-white dark:bg-[#131d31] text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px] text-[#0284C7]">
                    delete_outline
                  </span>
                  <span className="mt-1 truncate">Dry / Blue</span>
                </button>
              </div>
            </div>

            {/* Common Household Items List */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                  Common Household Items
                </span>
                <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                  {filteredItems.length} items
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#131d31] p-5 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.item_name}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-base font-bold text-[#0b1c30] dark:text-white font-headline">
                            {item.item_name}
                          </h3>
                          <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                            {item.golden_rule}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          item.category_slug === 'wet'
                            ? 'bg-[#6ffbbe] text-[#002113]'
                            : item.category_slug === 'dry'
                            ? 'bg-[#dae2fd] text-[#131b2e]'
                            : 'bg-[#ffddb8] text-[#855300]'
                        }`}
                      >
                        {item.assigned_bin}
                      </span>
                    </div>

                    {/* Split or Hazard Instruction Card */}
                    {item.split_instructions && (
                      <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white flex items-start gap-2 border border-[#dce9ff] dark:border-[#27354f]">
                        <span className="material-symbols-outlined text-[18px] text-[#10b981] shrink-0 mt-0.5">
                          content_cut
                        </span>
                        <p className="leading-relaxed">{item.split_instructions}</p>
                      </div>
                    )}

                    {item.hazard_warning && (
                      <div className="p-3.5 rounded-xl bg-[#ffdad6]/50 dark:bg-[#93000a]/20 text-xs text-[#ba1a1a] dark:text-[#ffdad6] flex items-start gap-2 border border-[#ffdad6] dark:border-[#93000a]">
                        <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] shrink-0 mt-0.5">
                          warning
                        </span>
                        <p className="leading-relaxed font-medium">{item.hazard_warning}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Need Segregation Help? Contact Banner */}
            <div className="p-4 rounded-2xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                    Need segregation help?
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Gatekeeper & Housekeeping staff on duty 7 AM - 11 AM
                  </span>
                </div>
              </div>

              <a
                href="tel:1800000000"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#131d31] text-[#006c49] dark:text-[#10b981] flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                title="Call Society Desk"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
              </a>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
