'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useApp } from '@/lib/state/store';

export default function TopNavBar() {
  const pathname = usePathname();
  const { theme, setTheme, profile, unreadNotificationCount, signOut } = useApp();
  const isAdmin = pathname.startsWith('/admin');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = () => {
    signOut(isAdmin ? 'admin' : 'resident');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 glass-header">
      <div className="w-full h-full px-4 md:px-5 flex items-center justify-between gap-4">

        {/* Left: Logo + Context */}
        <div className="flex items-center gap-3">
          <Logo />

          {/* Context badge */}
          {isAdmin ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg
              bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-400
              border border-emerald-200/60 dark:border-emerald-700/40 text-[11px] font-bold tracking-tight">
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              Admin Portal
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg
              bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-400
              border border-emerald-200/60 dark:border-emerald-700/40 text-[11px] font-bold tracking-tight">
              <span className="material-symbols-outlined text-[14px]">eco</span>
              Resident
            </div>
          )}

          {/* Society badge - desktop only */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-lg
            bg-slate-50 dark:bg-[#162236] border border-slate-200 dark:border-[#1e2d45]">
            <span className="material-symbols-outlined text-emerald-500 text-[15px]">apartment</span>
            <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">
              Green Valley • Ward 88B
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Eco Points - Resident only */}
          {!isAdmin && (
            <Link
              href="/resident/rewards"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                bg-emerald-500 hover:bg-emerald-600 text-white
                shadow-[0_2px_8px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.4)]
                transition-all active:scale-95 text-xs font-bold"
              title="View Eco Rewards"
            >
              <span className="material-symbols-outlined text-[15px]">eco</span>
              <span>{profile.eco_points} pts</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="w-9 h-9 flex items-center justify-center rounded-xl
              bg-slate-50 dark:bg-[#162236] hover:bg-slate-100 dark:hover:bg-[#1a2840]
              text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white
              border border-slate-200 dark:border-[#1e2d45] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications - Resident only */}
          {!isAdmin && (
            <Link
              href="/resident/notifications"
              title="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl
                bg-slate-50 dark:bg-[#162236] hover:bg-slate-100 dark:hover:bg-[#1a2840]
                text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white
                border border-slate-200 dark:border-[#1e2d45] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0d1625]" />
              )}
            </Link>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200 dark:bg-[#1e2d45] mx-1" />

          {/* Profile */}
          <Link
            href={isAdmin ? '/admin/settings' : '/resident/profile'}
            title="View Profile"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <img
                src={profile.avatar_url || '/deepak-avatar.png'}
                alt={profile.full_name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400/60 dark:ring-emerald-500/50
                  group-hover:ring-emerald-500 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500
                border-2 border-white dark:border-[#0d1625]" />
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[12px] font-semibold text-slate-800 dark:text-white">
                {profile.full_name?.split(' ')[0] || 'Resident'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isAdmin ? 'Admin' : profile.flat_number || 'Apt 402B'}
              </span>
            </div>
          </Link>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            type="button"
            title="Sign Out"
            className="w-8 h-8 flex items-center justify-center rounded-xl
              text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/15
              hover:text-red-500 dark:hover:text-red-400 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
