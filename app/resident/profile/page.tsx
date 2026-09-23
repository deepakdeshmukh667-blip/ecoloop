'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, setProfile, theme, setTheme, signOut } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(profile.full_name || '');
  const [editFlat, setEditFlat] = useState(profile.flat_number || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  React.useEffect(() => {
    if (profile.full_name && !editName) setEditName(profile.full_name);
    if (profile.flat_number && !editFlat) setEditFlat(profile.flat_number);
  }, [profile.full_name, profile.flat_number]);

  const handleLogout = () => signOut('resident');

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setIsSaving(true);
    setSaveMsg('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({
          full_name: editName.trim(),
          flat_number: editFlat.trim(),
        }).eq('id', user.id);
      }
      setProfile((prev) => ({
        ...prev,
        full_name: editName.trim(),
        flat_number: editFlat.trim(),
      }));
      setSaveMsg('Profile updated!');
      setIsEditingName(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Failed to save. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080f1a]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">

            {/* Save message */}
            {saveMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold text-center
                ${saveMsg.includes('Failed')
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                {saveMsg}
              </div>
            )}

            {/* ── PROFILE CARD ──────────────────────────── */}
            <section className="card p-6 flex flex-col gap-5 animate-fadeInUp">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={profile.avatar_url || '/deepak-avatar.png'}
                    alt={profile.full_name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-400"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500
                    text-white flex items-center justify-center shadow text-[12px]">
                    <span className="material-symbols-outlined text-[12px]">check</span>
                  </span>
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  {isEditingName ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your full name"
                        className="text-sm font-bold bg-slate-50 dark:bg-[#111f35] border border-slate-200
                          dark:border-[#1e2d45] rounded-lg px-3 py-1.5 text-slate-900 dark:text-white
                          outline-none focus:border-emerald-500 transition-colors"
                      />
                      <input
                        type="text"
                        value={editFlat}
                        onChange={(e) => setEditFlat(e.target.value)}
                        placeholder="Flat / Apt number"
                        className="text-xs bg-slate-50 dark:bg-[#111f35] border border-slate-200
                          dark:border-[#1e2d45] rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-300
                          outline-none focus:border-emerald-500 transition-colors"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60"
                          type="button"
                        >
                          {isSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => { setIsEditingName(false); setEditName(profile.full_name || ''); setEditFlat(profile.flat_number || ''); }}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white font-headline truncate">
                          {profile.full_name || 'Resident Member'}
                        </h1>
                        <span className="badge-green text-[9px] shrink-0">LVL {profile.tier_level}</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {profile.flat_number} · Green Valley Residency
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {profile.email}
                      </span>
                    </>
                  )}
                </div>

                {!isEditingName && (
                  <button
                    onClick={() => { setIsEditingName(true); setEditName(profile.full_name || ''); setEditFlat(profile.flat_number || ''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40
                      text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40
                      hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-xs font-semibold shrink-0"
                    title="Edit Name & Flat"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    <span>Edit Name</span>
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-[#1e2d45] text-center">
                <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-1 text-lg font-black text-slate-900 dark:text-white font-headline">
                    <span className="material-symbols-outlined text-[16px] text-amber-500">bolt</span>
                    {profile.eco_points}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Eco Points</span>
                </div>
                <div className="flex flex-col border-x border-slate-100 dark:border-[#1e2d45]">
                  <div className="flex items-center justify-center gap-1 text-lg font-black text-slate-900 dark:text-white font-headline">
                    <span className="material-symbols-outlined text-[16px] text-emerald-500">eco</span>
                    {Math.round(profile.consistency_score)}/100
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Habit Score</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-center gap-1 text-lg font-black text-slate-900 dark:text-white font-headline">
                    <span className="material-symbols-outlined text-[16px] text-amber-500">local_fire_department</span>
                    {profile.current_streak}d
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Streak</span>
                </div>
              </div>
            </section>

            {/* ── WARD CERTIFICATION ─────────────────────── */}
            <section className="card overflow-hidden animate-fadeInUp stagger-1">
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-[20px]">verified</span>
                  <span className="text-white font-bold text-xs uppercase tracking-wider">
                    Municipal Ward Certification
                  </span>
                </div>
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-white text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  APPROVED
                </span>
              </div>
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                    Grade
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-headline">AA</span>
                    <span className="badge-green text-[10px]">Grade AA</span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Ward 88B · Zone 4 West · MCGM
                  </span>
                </div>
                <div className="icon-box bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 w-14 h-14">
                  <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
                </div>
              </div>
            </section>

            {/* ── APPEARANCE ─────────────────────────────── */}
            <section className="card p-5 flex flex-col gap-3 animate-fadeInUp stagger-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-headline">Appearance</span>
                <span className="text-[11px] text-slate-400">Auto-synced</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'light', label: 'Light', icon: 'light_mode' },
                  { key: 'dark', label: 'Dark', icon: 'dark_mode' },
                  { key: 'system', label: 'System', icon: 'settings_brightness' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTheme(item.key as any)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                      theme === item.key
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#111f35] border-slate-200 dark:border-[#1e2d45] text-slate-700 dark:text-slate-300'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* ── QUICK LINKS ─────────────────────────────── */}
            <section className="card p-5 flex flex-col gap-1 animate-fadeInUp stagger-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-headline mb-2">
                Settings & Support
              </span>
              {[
                { href: '/resident/privacy', icon: 'shield', label: 'Privacy Policy', sub: 'Zero-surveillance charter & data retention', iconClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
                { href: '/resident/consistency', icon: 'analytics', label: 'Habit Score Formula', sub: 'View scientific 4-part calculation', iconClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
                { href: '/resident/settings', icon: 'settings', label: 'Account Settings', sub: 'Alerts, spot checks, derby digests', iconClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#111f35] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`icon-box-sm ${item.iconClass}`}>
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{item.label}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">{item.sub}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
                </Link>
              ))}
            </section>

            {/* ── LOGOUT ──────────────────────────────────── */}
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400
                border border-red-200 dark:border-red-800/40 text-xs font-bold
                flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors
                animate-fadeInUp stagger-3"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Log Out of Green Valley Residency
            </button>

            <span className="text-center text-[11px] text-slate-400 dark:text-slate-500 animate-fadeInUp stagger-4">
              EcoLoop v2.10.4 · Crafted for high-trust sustainable communities
            </span>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
