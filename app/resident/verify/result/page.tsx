'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function VerificationResultPage() {
  const router = useRouter();
  const { profile, selectedCategory, lastVerification } = useApp();

  useEffect(() => {
    // Celebration confetti on success
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#0284C7', '#F59E0B'],
      });
    } catch {
      // non-blocking
    }
  }, []);

  const confidence = lastVerification?.ai_confidence || 95.8;
  const points = lastVerification?.points_awarded || 10;
  const bonus = lastVerification?.clean_bin_bonus || 5;
  const total = points + bonus;

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-xl mx-auto px-4 py-4 md:py-6 flex flex-col gap-4">
            {/* Header Switcher: Verified View vs Guidance View */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/resident/dashboard')}
                className="w-8 h-8 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#0b1c30] dark:text-white mr-2"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>

              <div className="flex items-center bg-[#eff4ff] dark:bg-[#1a263e] p-1 rounded-full border border-[#dce9ff] dark:border-[#27354f]">
                <button
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#10b981] text-white shadow-sm flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Verified View</span>
                </button>
                <button
                  onClick={() => router.push('/resident/verify/correction')}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white flex items-center gap-1.5 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">help_center</span>
                  <span>Guidance View</span>
                </button>
              </div>
            </div>

            {/* Status Top Strip */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                    Checking your waste...
                  </span>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                    Comparing photo with selected category
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-[10px] font-bold">
                VISION v3.2
              </span>
            </div>

            {/* Photo Scan Preview with Floating Badges */}
            <div className="relative w-full aspect-[16/10] bg-[#1a263e] rounded-2xl overflow-hidden shadow-md">
              <img
                src={
                  lastVerification?.image_url ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDaOmxjIeUjdfF2Dcxi8G_St5RMnAh8BwFKhT2gZhdvvGIEkK_0zca8Ibm5HS0VXZWt1Jc5ythAlMDWczo4iNohK72oKTJPTt-0xUfsCQkBOQxNRDV7NE6CyybfDe2DdKhR36ktK_-VfhTlL8nGUHgcnOA-TP4cz1wD_bKArpDXUiSlrTtOwWmFe8zZVT6tNijlrMszgjql_7fvjItzFyTIs6PDQM6FSh9Mrqd6FKdgJO9lLfazSGz2'
                }
                alt="Verified waste item"
                className="w-full h-full object-cover"
              />

              {/* Badges Overlaid */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 dark:bg-[#131d31]/95 text-[#0b1c30] dark:text-white text-xs font-semibold shadow flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedCategory.bin_color }}
                ></span>
                <span>{selectedCategory.bin_name}</span>
              </div>

              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#10b981] text-white text-xs font-bold shadow flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>{confidence}% Confidence</span>
              </div>

              <div className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-xl bg-[#213145]/90 text-white text-xs font-semibold shadow backdrop-blur-md flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#10b981]">
                  check_circle
                </span>
                <span>Detected: {lastVerification?.ai_detected_category || 'Organic Scraps'}</span>
              </div>
            </div>

            {/* Positive Result Card */}
            <div className="bg-white dark:bg-[#131d31] p-5 md:p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">check_circle</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                    Correctly segregated!
                  </h2>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1 leading-relaxed">
                    Zero non-biodegradable material identified. Bin verified clean and ready for
                    community collection.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Expected Bin
                  </span>
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white mt-0.5 flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedCategory.bin_color }}
                    ></span>
                    {selectedCategory.name}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex flex-col">
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Classification
                  </span>
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                    {lastVerification?.ai_detected_category || 'Vegetable Scraps'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reward Points & Bonus Showcase */}
            <div className="bg-[#eff4ff] dark:bg-[#1a263e] p-5 md:p-6 rounded-2xl shadow-sm border border-[#dce9ff] dark:border-[#27354f] flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#10b981]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between z-10">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#006c49] dark:text-[#10b981] font-bold">
                    Reward Unlocked
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-4xl font-extrabold text-[#006c49] dark:text-[#10b981] font-headline">
                      +{total}
                    </span>
                    <span className="text-base font-semibold text-[#0b1c30] dark:text-white">
                      Points
                    </span>
                  </div>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#10b981] text-white flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(16,185,129,0.35)]">
                  <span className="material-symbols-outlined text-[32px]">redeem</span>
                </div>
              </div>

              {/* Point Breakdown Chips */}
              <div className="flex flex-wrap gap-2 z-10">
                <div className="flex items-center gap-1.5 bg-white dark:bg-[#131d31] px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold text-[#0b1c30] dark:text-white">
                  <span className="material-symbols-outlined text-[16px] text-[#10b981]">eco</span>
                  <span>+{points} Eco Points</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white dark:bg-[#131d31] px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold text-[#0b1c30] dark:text-white">
                  <span className="material-symbols-outlined text-[16px] text-[#e29100]">
                    verified
                  </span>
                  <span>+{bonus} Clean Bin Bonus</span>
                </div>
              </div>

              {/* Streak Status Component */}
              <div className="p-3 bg-white dark:bg-[#131d31] rounded-xl flex items-center gap-3 border border-[#dce9ff] dark:border-[#27354f] z-10">
                <div className="w-10 h-10 rounded-xl bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    local_fire_department
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                      {profile.current_streak} Day Sorting Streak!
                    </span>
                    <span className="text-xs text-[#006c49] dark:text-[#10b981] font-bold">
                      +4% boost
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] truncate">
                    Consistency score reached {Math.round(profile.consistency_score)}% this week
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/resident/dashboard"
                className="w-full h-12 bg-[#10b981] hover:bg-[#006c49] text-white font-headline font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.35)] transition-colors"
              >
                <span>Continue to Habit Hub</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <Link
                href="/resident/history"
                className="w-full h-11 bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#e5eeff] dark:hover:bg-[#27354f] text-[#0b1c30] dark:text-white font-semibold text-xs rounded-full flex items-center justify-center gap-1.5 transition-colors border border-[#dce9ff] dark:border-[#27354f]"
              >
                <span className="material-symbols-outlined text-[18px]">history_edu</span>
                <span>View Detailed Audit Log</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
