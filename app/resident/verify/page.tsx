'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function VerifySelectPage() {
  const router = useRouter();
  const { categories, selectedCategory, setSelectedCategory } = useApp();
  const [isZoomMode, setIsZoomMode] = useState(false);

  const handleContinue = () => {
    router.push('/resident/verify/camera');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Header Stepper & Zoom Accessibility Switch */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#10b981] text-white text-xs font-bold font-headline">
                    1
                  </span>
                  <span className="text-xs font-bold text-[#006c49] dark:text-[#10b981] font-headline">
                    Step 1 of 3
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] font-medium">
                    · Categorize
                  </span>
                </div>

                {/* Senior / Elderly-friendly Large Mode Switch */}
                <button
                  onClick={() => setIsZoomMode(!isZoomMode)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all text-xs font-semibold ${
                    isZoomMode
                      ? 'bg-[#10b981] text-white border-[#10b981] shadow-sm'
                      : 'bg-[#eff4ff] dark:bg-[#1a263e] border-[#dce9ff] dark:border-[#27354f] text-[#0b1c30] dark:text-white'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isZoomMode ? 'zoom_out' : 'zoom_in'}
                  </span>
                  <span>Text & Icon Zoom</span>
                </button>
              </div>

              {/* Stepper bar (1/3 width) */}
              <div className="w-full h-1.5 rounded-full bg-[#e5eeff] dark:bg-[#1e293b] overflow-hidden flex">
                <div className="h-full bg-[#10b981] rounded-full w-1/3 transition-all duration-500"></div>
              </div>

              {/* Title & Subtext */}
              <div className="mt-1">
                <h1
                  className={`font-extrabold text-[#0b1c30] dark:text-white tracking-tight font-headline ${
                    isZoomMode ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
                  }`}
                >
                  Verify Today&apos;s Waste
                </h1>
                <p
                  className={`text-[#3c4a42] dark:text-[#94a3b8] mt-1 ${
                    isZoomMode ? 'text-base md:text-lg' : 'text-sm'
                  }`}
                >
                  Choose what you&apos;re submitting for verification
                </p>
              </div>
            </section>

            {/* Category Selection Cards */}
            <section className="flex flex-col gap-4" role="radiogroup">
              {categories.map((cat) => {
                const isSelected = selectedCategory.slug === cat.slug;
                const pointsLabel =
                  cat.slug === 'wet' ? '+25 pts' : cat.slug === 'dry' ? '+20 pts' : '+35 pts';

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative w-full rounded-2xl p-5 md:p-6 cursor-pointer select-none transition-all flex flex-col gap-3 overflow-hidden border ${
                      isSelected
                        ? 'bg-white dark:bg-[#131d31] border-[#10b981] shadow-[0_8px_24px_-4px_rgba(16,185,129,0.22)] ring-1 ring-[#10b981]'
                        : 'bg-white dark:bg-[#131d31] border-[#e2e8f0] dark:border-[#1e293b] hover:border-[#10b981]/50 shadow-sm'
                    }`}
                  >
                    {/* Left active color indicator bar */}
                    {isSelected && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-2"
                        style={{ backgroundColor: cat.bin_color }}
                      />
                    )}

                    <div className="flex items-start justify-between pl-2">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div
                          className={`rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                            isZoomMode ? 'w-16 h-16' : 'w-14 h-14'
                          }`}
                          style={{
                            backgroundColor: `${cat.bin_color}20`,
                            color: cat.bin_color,
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: isZoomMode ? '38px' : '32px' }}
                          >
                            {cat.slug === 'wet'
                              ? 'compost'
                              : cat.slug === 'dry'
                              ? 'recycling'
                              : 'warning'}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h2
                              className={`font-bold text-[#0b1c30] dark:text-white font-headline ${
                                isZoomMode ? 'text-lg md:text-xl' : 'text-base md:text-lg'
                              }`}
                            >
                              {cat.name.toUpperCase()}
                            </h2>
                            <span
                              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: `${cat.bin_color}25`,
                                color: cat.bin_color,
                              }}
                            >
                              {cat.badge_label}
                            </span>
                          </div>
                          <p
                            className={`text-[#3c4a42] dark:text-[#94a3b8] font-medium mt-0.5 ${
                              isZoomMode ? 'text-sm' : 'text-xs'
                            }`}
                          >
                            {cat.bin_name} Sorting
                          </p>
                        </div>
                      </div>

                      {/* Custom Checkbox/Radio Indicator */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-[#10b981] text-white shadow-md'
                            : 'bg-[#eff4ff] dark:bg-[#1e293b] text-transparent'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] font-bold">
                          check
                        </span>
                      </div>
                    </div>

                    {/* Includes tag chips */}
                    <div className="pl-2 mt-1">
                      <p className="text-[11px] uppercase tracking-wider text-[#6c7a71] dark:text-[#94a3b8] font-semibold mb-1.5">
                        Includes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.examples.map((ex, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#0b1c30] dark:text-[#f8fafc] font-medium flex items-center gap-1.5 ${
                              isZoomMode ? 'text-xs md:text-sm' : 'text-xs'
                            }`}
                          >
                            <span
                              className="material-symbols-outlined text-[15px]"
                              style={{ color: cat.bin_color }}
                            >
                              {cat.slug === 'wet' ? 'eco' : cat.slug === 'dry' ? 'recycling' : 'shield'}
                            </span>
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bin destination footer */}
                    <div className="pl-2 pt-2 flex items-center justify-between border-t border-[#e2e8f0]/60 dark:border-[#1e293b]/60">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold"
                        style={{ color: cat.bin_color }}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Assigned to: {cat.bin_name}
                      </span>
                      <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                        Earn {pointsLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Explanatory Helper Box */}
            <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center gap-3 border border-[#dce9ff] dark:border-[#27354f]">
              <div className="w-10 h-10 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">help_center</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                  Not completely sure?
                </span>
                <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-tight mt-0.5">
                  EcoLoop&apos;s AI camera will automatically double-check and correct item placement
                  without penalties.
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleContinue}
                className="w-full h-14 bg-[#10b981] hover:bg-[#006c49] text-white font-headline font-bold text-base rounded-full flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98]"
                type="button"
              >
                <span>Continue to Camera</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <p className="text-center text-xs text-[#3c4a42] dark:text-[#94a3b8] flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#10b981]">
                  verified_user
                </span>
                Your photo is used strictly to verify segregated waste and award points.
              </p>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
