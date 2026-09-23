'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';
import { verifyWaste } from '@/lib/ai/verifyWaste';

function AnalyzingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFlagged = searchParams.get('flagged') === 'true';

  const { selectedCategory, pendingImage, addVerification } = useApp();
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Extracting frame features...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Running convolutional edge segmentation...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStatusText('Comparing against society segregation model...');
    }, 800);

    const timer3 = setTimeout(async () => {
      setProgress(100);
      setStatusText('Validation complete!');

      // Run AI verification function
      const result = await verifyWaste({
        image: pendingImage || undefined,
        selectedCategory: selectedCategory.slug,
        isForceContaminationDemo: isFlagged,
      });

      // Update central state with AI verification result (strictly 0 points on rejection/mismatch)
      addVerification(
        selectedCategory.slug,
        false,
        pendingImage || undefined,
        result.status !== 'verified',
        result
      );

      if (result.status === 'needs_attention' || result.status === 'rejected') {
        router.push('/resident/verify/correction');
      } else {
        router.push('/resident/verify/result');
      }
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isFlagged, selectedCategory, pendingImage, addVerification, router]);

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-24 pb-28 md:pb-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-md mx-auto px-6 flex flex-col items-center text-center gap-6">
            {/* Animated Radar Pulse Circle */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full bg-[#10b981]/20 animate-ping"
                style={{ animationDuration: '2s' }}
              ></div>
              <div className="absolute inset-3 rounded-full bg-[#10b981]/30 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full bg-white dark:bg-[#131d31] shadow-xl border border-[#10b981] flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[44px] text-[#10b981] animate-spin"
                  style={{ animationDuration: '6s' }}
                >
                  camera
                </span>
              </div>
            </div>

            {/* Status & Progress */}
            <div className="flex flex-col gap-2 w-full">
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-xs font-bold self-center">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
                <span>VISION v3.2 RUNNING</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0b1c30] dark:text-white font-headline">
                Checking your waste...
              </h2>
              <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">{statusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-[#e5eeff] dark:bg-[#1e293b] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#10b981] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Live Telemetry Sensor Data */}
            <div className="w-full p-4 rounded-xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] text-left grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold block">
                  Category Selected
                </span>
                <span className="font-bold text-[#0b1c30] dark:text-white">
                  {selectedCategory.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold block">
                  Privacy Status
                </span>
                <span className="font-bold text-[#006c49] dark:text-[#10b981]">
                  Zero-Retention
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold block">
                  Optical Sensor
                </span>
                <span className="font-semibold text-[#0b1c30] dark:text-white">
                  Edge Texture Scan
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold block">
                  Target Bin
                </span>
                <span className="font-semibold text-[#0b1c30] dark:text-white">
                  {selectedCategory.bin_name}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background dark:bg-[#0b1120] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#10b981] border-t-transparent animate-spin"></div>
        </div>
      }
    >
      <AnalyzingContent />
    </Suspense>
  );
}
