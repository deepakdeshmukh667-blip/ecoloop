'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';

import { useApp } from '@/lib/state/store';

export default function VerificationCorrectionPage() {
  const router = useRouter();
  const { lastVerification, selectedCategory } = useApp();

  const isLowConfidence =
    lastVerification?.status === 'rejected' ||
    lastVerification?.contaminant_detected?.toLowerCase().includes('unclear') ||
    lastVerification?.contaminant_detected?.toLowerCase().includes('blur');

  const detectedLabel = lastVerification?.ai_detected_category || 'Segregation Flagged';
  const feedbackText =
    lastVerification?.ai_feedback ||
    'We spotted a mismatch between the uploaded photo and your selected category. 0 points awarded until correctly segregated.';

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
                  onClick={() => router.push('/resident/verify/result')}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white flex items-center gap-1.5 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Verified View</span>
                </button>
                <button
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#e29100] text-white shadow-sm flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">help_center</span>
                  <span>Guidance View</span>
                </button>
              </div>
            </div>

            {/* Camera Viewfinder with Visual Contamination Callout */}
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-[#213145] aspect-[16/10]">
              <img
                src={
                  lastVerification?.image_url ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDUJGZqucC2b4b2qLS5aZLFcf1OhM53sPXZm0j0GOKztOBRNN6QB9aeTGhO_aqrlv3_RzH2FOvKTJpZV_qqcaRb1JcxJE_lxLyAErWNP0kqYGf1LCA9NSKQVvbSo-lqO94t9XKZXw_wbaHtNwcZLVNaBuYVyTj3j84O30Jh8meZ7MlZVErQA3en4Qt5C57uV9Zu4xUwViDplR4K9AdWzhwV6oQEkSA3W5I3LN23CDSlfO-5PdBSg17r'
                }
                alt="Contamination detection preview"
                className="w-full h-full object-cover"
              />

              {/* AI Detected Contamination Bounding Box */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 border-2 border-dashed border-[#e29100] rounded-xl relative animate-pulse flex items-start justify-end p-1.5 shadow-[0_0_20px_rgba(226,145,0,0.4)]">
                  <span className="bg-[#e29100] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                    {detectedLabel}
                  </span>
                </div>
              </div>

              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#131d31]/90 backdrop-blur-md flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-[#e29100] animate-ping"></span>
                <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                  {isLowConfidence ? 'Unclear Image' : 'Mismatch Flagged'}
                </span>
              </div>
            </div>

            {/* Friendly Non-Punitive Education Hero Card */}
            <div className="bg-white dark:bg-[#131d31] p-5 md:p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">emoji_objects</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white font-headline">
                      {isLowConfidence ? 'Please Re-Scan' : 'Almost there!'}
                    </h2>
                    <span className="px-2 py-0.5 bg-[#fee2e2] dark:bg-[#7f1d1d]/40 text-[#ba1a1a] dark:text-[#fca5a5] text-xs font-bold rounded-full">
                      0 Points Awarded
                    </span>
                  </div>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                    {isLowConfidence
                      ? 'The AI could not identify this image with sufficient clarity. Re-scan to earn points.'
                      : 'We spotted a waste segregation mismatch. No penalty, but 0 points awarded until correctly sorted!'}
                  </p>
                </div>
              </div>

              {/* Detail Detection Box */}
              <div className="bg-[#eff4ff] dark:bg-[#1a263e] p-3.5 rounded-xl flex items-center gap-3 border border-[#dce9ff] dark:border-[#27354f]">
                <span className="material-symbols-outlined text-[#e29100] text-[22px] shrink-0">
                  warning
                </span>
                <p className="text-xs text-[#0b1c30] dark:text-white leading-relaxed">
                  {feedbackText}
                </p>
              </div>

              {/* Visual Teaching Comparison Matrix */}
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                  Suggested Quick Fix
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {/* From Selected Bin */}
                  <div className="bg-[#eff4ff] dark:bg-[#1a263e] p-3 rounded-xl flex flex-col gap-1 border border-[#dce9ff] dark:border-[#27354f]">
                    <div className="flex items-center gap-1 text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                      <span className="text-xs font-semibold">Remove from</span>
                    </div>
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                      {selectedCategory.bin_name}
                    </span>
                  </div>

                  {/* To Correct Bin */}
                  <div className="bg-[#eff4ff] dark:bg-[#1a263e] p-3 rounded-xl flex flex-col gap-1 border border-[#dce9ff] dark:border-[#27354f]">
                    <div className="flex items-center gap-1 text-[#0284C7]">
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      <span className="text-xs font-semibold">Place in</span>
                    </div>
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                      {selectedCategory.slug === 'wet' ? 'Blue Dry Recyclables' : 'Green Compost Bin'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => router.push('/resident/verify/camera')}
                className="w-full h-12 bg-[#10b981] hover:bg-[#006c49] text-white font-headline font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.35)] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                <span>Quick Re-Scan (Earn points upon correct sorting)</span>
              </button>

              <Link
                href="/resident/learn"
                className="w-full h-11 bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#e5eeff] dark:hover:bg-[#27354f] text-[#0b1c30] dark:text-white font-semibold text-xs rounded-full flex items-center justify-center gap-1.5 transition-colors border border-[#dce9ff] dark:border-[#27354f]"
              >
                <span className="material-symbols-outlined text-[18px]">school</span>
                <span>View Sorting Rules Guide</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
