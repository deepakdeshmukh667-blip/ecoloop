'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function ResidentSettingsPage() {
  const { profile, theme, setTheme } = useApp();

  // Settings State
  const [morningReminder, setMorningReminder] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [spotCheckNotice, setSpotCheckNotice] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [voiceGuidance, setVoiceGuidance] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/resident/profile"
                  className="w-9 h-9 rounded-full bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-center text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30] dark:text-white font-headline">
                    Resident Settings
                  </h1>
                  <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8]">
                    Manage preferences, alerts, and apartment household details
                  </p>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Changes
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar_url || '/deepak-avatar.png'}
                  alt={profile.full_name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#10b981]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0b1c30] dark:text-white font-headline">
                      {profile.full_name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#1e293b] text-[#10b981] text-[10px] font-bold">
                      {profile.flat_number}
                    </span>
                  </div>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] block">
                    Tower B • Green Valley Residency
                  </span>
                  <span className="text-[11px] text-[#006c49] dark:text-[#10b981] font-semibold mt-0.5 inline-block">
                    Verified Resident Marshal • {profile.eco_points} Eco Points
                  </span>
                </div>
              </div>

              <Link
                href="/resident/profile"
                className="px-3 py-1.5 rounded-lg border border-[#e2e8f0] dark:border-[#1e293b] text-xs font-semibold text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white"
              >
                Edit Profile
              </Link>
            </div>

            {/* Theme Appearance Selector */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                    Theme & Appearance
                  </h2>
                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                    Personalize your interface contrast and night viewing
                  </p>
                </div>
                <span className="text-xs font-medium text-[#10b981]">Instant preview</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    theme === 'light'
                      ? 'bg-[#eff4ff] border-[#10b981] text-[#006c49] shadow-sm'
                      : 'border-[#e2e8f0] dark:border-[#1e293b] text-[#3c4a42] dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#1a263e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">light_mode</span>
                  <span className="text-xs font-semibold mt-1">Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'bg-[#1a263e] border-[#10b981] text-[#6ffbbe] shadow-sm'
                      : 'border-[#e2e8f0] dark:border-[#1e293b] text-[#3c4a42] dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#1a263e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">dark_mode</span>
                  <span className="text-xs font-semibold mt-1">Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    theme === 'system'
                      ? 'bg-[#eff4ff] dark:bg-[#1a263e] border-[#10b981] text-[#10b981] shadow-sm'
                      : 'border-[#e2e8f0] dark:border-[#1e293b] text-[#3c4a42] dark:text-[#94a3b8] hover:bg-slate-50 dark:hover:bg-[#1a263e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">settings_brightness</span>
                  <span className="text-xs font-semibold mt-1">System</span>
                </button>
              </div>
            </div>

            {/* Notification Reminders */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                  Notifications & Daily Habits
                </h2>
                <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                  Control push alerts and daily segregation reminders
                </p>
              </div>

              <div className="flex flex-col divide-y divide-[#f1f5f9] dark:divide-[#1e293b]">
                {/* Morning Audit Reminder */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#10b981] text-[22px]">alarm</span>
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                        Morning Waste Audit Reminder
                      </span>
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Daily alert at 8:30 AM before housekeeping collection
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMorningReminder(!morningReminder)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      morningReminder ? 'bg-[#10b981]' : 'bg-[#cbd5e1] dark:bg-[#334155]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        morningReminder ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Streak Alerts */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#e29100] text-[22px]">local_fire_department</span>
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                        Streak Freeze & Milestone Alerts
                      </span>
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Notify me if my 7-day habit streak is at risk
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStreakAlerts(!streakAlerts)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      streakAlerts ? 'bg-[#10b981]' : 'bg-[#cbd5e1] dark:bg-[#334155]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        streakAlerts ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Spot Check Notification */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#006c49] dark:text-[#10b981] text-[22px]">casino</span>
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                        Random Spot-Check Audit Pings
                      </span>
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Occasional prompt (every 12–18 days) with +40 bonus points
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSpotCheckNotice(!spotCheckNotice)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      spotCheckNotice ? 'bg-[#10b981]' : 'bg-[#cbd5e1] dark:bg-[#334155]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        spotCheckNotice ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Camera & Audio Feedback */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                  AI Camera & Feedback Preferences
                </h2>
                <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                  Customize how the AI scanner interacts during waste categorization
                </p>
              </div>

              <div className="flex flex-col divide-y divide-[#f1f5f9] dark:divide-[#1e293b]">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#10b981] text-[22px]">volume_up</span>
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                        Sound Effects & Confetti Chimes
                      </span>
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Play audio when +10 eco points and streaks are verified
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundEffects(!soundEffects)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      soundEffects ? 'bg-[#10b981]' : 'bg-[#cbd5e1] dark:bg-[#334155]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        soundEffects ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#565e74] text-[22px]">record_voice_over</span>
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                        Voice Guidance on Contamination
                      </span>
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                        Spoken audio instructions when plastic or soiled items are detected
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceGuidance(!voiceGuidance)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      voiceGuidance ? 'bg-[#10b981]' : 'bg-[#cbd5e1] dark:bg-[#334155]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        voiceGuidance ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Democratic Rights */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981] text-[20px]">shield_person</span>
                  <h2 className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                    Privacy Guarantee & Data Rights
                  </h2>
                </div>
                <Link
                  href="/resident/privacy"
                  className="text-xs text-[#10b981] hover:underline font-semibold flex items-center gap-1"
                >
                  View Civic Charter
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>

              <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                Your photos are processed on-device and automatically purged after compliance hashing. Continuous video surveillance and background GPS location are strictly forbidden by society charter.
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded-lg bg-[#eff4ff] dark:bg-[#1a263e] text-xs font-semibold text-[#0b1c30] dark:text-white hover:bg-[#e2e8f0] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export My Audit Log (.CSV)
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-[#ffdad6] text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors"
                >
                  Request Data Purge
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />

      {/* Save Toast */}
      {savedToast && (
        <div className="fixed bottom-20 md:bottom-8 right-8 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all animate-fade-in">
          <span className="material-symbols-outlined text-[#10b981] text-[22px]">check_circle</span>
          <div>
            <span className="text-xs font-bold block">Settings Saved</span>
            <span className="text-[11px] text-slate-300">Your preferences have been updated.</span>
          </div>
        </div>
      )}
    </div>
  );
}
