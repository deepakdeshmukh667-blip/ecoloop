'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { useApp } from '@/lib/state/store';

export default function TopNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, profile, unreadNotificationCount } = useApp();

  const isAdmin = pathname.startsWith('/admin');

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/90 dark:bg-[#131d31]/90 backdrop-blur-xl border-b border-[#e2e8f0] dark:border-[#1e293b] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="w-full h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Logo & Role Pill & Society */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Logo />

          {/* Role Switcher Pill */}
          <div className="hidden md:flex items-center bg-[#eff4ff] dark:bg-[#1a263e] p-1 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            <button
              onClick={() => router.push('/resident/dashboard')}
              className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${
                !isAdmin
                  ? 'bg-[#10b981] text-white shadow-sm'
                  : 'text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
              }`}
              type="button"
            >
              Resident Experience
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${
                isAdmin
                  ? 'bg-[#10b981] text-white shadow-sm'
                  : 'text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
              }`}
              type="button"
            >
              Society Admin Portal
            </button>
          </div>

          {/* Society Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[#10b981] text-[18px]">apartment</span>
            <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">
              Green Valley Residency - Tower B
            </span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </div>
        </div>

        {/* Right Section: Eco Points, Theme, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Eco Points Pill */}
          <Link
            href="/resident/rewards"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] shadow-[0_2px_8px_-2px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006c49] dark:text-[#6ffbbe]">eco</span>
            <span className="text-xs font-bold font-headline tracking-tight">
              {profile.eco_points} pts
            </span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#e5eeff] dark:hover:bg-[#27354f] text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications Link */}
          <Link
            href="/resident/notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#e5eeff] dark:hover:bg-[#27354f] text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white dark:ring-[#131d31]"></span>
            )}
          </Link>

          {/* Resident Profile Pill */}
          <Link
            href="/resident/profile"
            className="flex items-center gap-2 pl-1 group cursor-pointer"
          >
            <img
              src={profile.avatar_url || '/deepak-avatar.png'}
              alt={profile.full_name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#6ffbbe] dark:ring-[#10b981] group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#0b1c30] dark:text-white leading-tight">
                {profile.full_name}
              </span>
              <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                {profile.flat_number || 'Apt 402B'}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
