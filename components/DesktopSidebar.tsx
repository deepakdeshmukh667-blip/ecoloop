'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/state/store';

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { signOut, profile } = useApp();

  const residentNavItems = [
    { name: 'AI Scan & Segregate', href: '/resident/verify', icon: 'center_focus_strong', group: 'core' },
    { name: 'My Habit Hub', href: '/resident/dashboard', icon: 'dashboard', group: 'core' },
    { name: 'Leaderboard', href: '/resident/leaderboard', icon: 'leaderboard', group: 'community' },
    { name: 'Habit Consistency', href: '/resident/consistency', icon: 'insights', group: 'community' },
    { name: 'Audit Logs', href: '/resident/history', icon: 'receipt_long', group: 'community' },
    { name: 'Learn to Segregate', href: '/resident/learn', icon: 'school', group: 'tools' },
    { name: 'Eco Rewards', href: '/resident/rewards', icon: 'redeem', group: 'tools' },
    { name: 'Challenges', href: '/resident/challenges', icon: 'emoji_events', group: 'tools' },
  ];

  const adminNavItems = [
    { name: 'Compliance Portal', href: '/admin/dashboard', icon: 'analytics', group: 'core' },
    { name: 'Resident Registry', href: '/admin/residents', icon: 'people', group: 'core' },
    { name: 'Verifications', href: '/admin/verification', icon: 'fact_check', group: 'manage' },
    { name: 'Spot Checks', href: '/admin/spot-checks', icon: 'casino', group: 'manage' },
    { name: 'Leaderboard Admin', href: '/admin/leaderboard', icon: 'leaderboard', group: 'manage' },
    { name: 'Reward Catalog', href: '/admin/rewards', icon: 'card_giftcard', group: 'manage' },
    { name: 'Society Challenges', href: '/admin/challenges', icon: 'emoji_events', group: 'reports' },
    { name: 'Municipal Reports', href: '/admin/reports', icon: 'picture_as_pdf', group: 'reports' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings', group: 'reports' },
  ];

  const isAdmin = pathname.startsWith('/admin');
  const navItems = isAdmin ? adminNavItems : residentNavItems;

  const handleSignOut = () => {
    signOut(isAdmin ? 'admin' : 'resident');
  };

  // Group nav items
  const groups = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const groupLabels: Record<string, string> = {
    core: 'Main',
    community: 'Activity',
    tools: 'Tools',
    manage: 'Manage',
    reports: 'Reports',
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 hidden md:flex flex-col justify-between z-40
      bg-white dark:bg-[#0d1625] border-r border-slate-200 dark:border-[#1e2d45]
      shadow-[1px_0_0_rgba(0,0,0,0.04)] dark:shadow-none"
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="flex flex-col gap-0.5">
            <span className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {groupLabels[group]}
            </span>
            {items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/resident/dashboard' &&
                  item.href !== '/admin/dashboard' &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    isActive
                      ? 'nav-active'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#162236] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isActive ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}

        {/* Sign Out */}
        <div className="flex flex-col gap-0.5">
          <span className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Account
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium
              text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/15
              hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Bottom Card */}
      <div className="p-3">
        {!isAdmin ? (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10
            border border-emerald-200/60 dark:border-emerald-800/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Monthly Target
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">92%</span>
            </div>
            <div className="progress-track mb-2">
              <div className="progress-fill" style={{ width: '92%' }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              8 scans from Zero Contamination Pin
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/10
            border border-emerald-200/60 dark:border-emerald-800/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                MCGM Compliance
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Grade AA</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Ward 88B • Society Verification Portal
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
