'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DesktopSidebar() {
  const pathname = usePathname();

  const residentNavItems = [
    {
      name: 'AI Scan & Segregate',
      href: '/resident/verify',
      icon: 'center_focus_strong',
    },
    {
      name: 'My Habit Hub',
      href: '/resident/dashboard',
      icon: 'dashboard',
    },
    {
      name: 'Tower Leaderboard',
      href: '/resident/leaderboard',
      icon: 'leaderboard',
    },
    {
      name: 'Audit Logs',
      href: '/resident/history',
      icon: 'receipt_long',
    },
    {
      name: 'Learn to Segregate',
      href: '/resident/learn',
      icon: 'school',
    },
    {
      name: 'Eco Rewards',
      href: '/resident/rewards',
      icon: 'redeem',
    },
    {
      name: 'Society Challenges',
      href: '/resident/challenges',
      icon: 'emoji_events',
    },
    {
      name: 'Society Analytics',
      href: '/admin/dashboard',
      icon: 'analytics',
    },
  ];

  const adminNavItems = [
    {
      name: 'Compliance Portal',
      href: '/admin/dashboard',
      icon: 'analytics',
    },
    {
      name: 'Resident Registry',
      href: '/admin/residents',
      icon: 'people',
    },
    {
      name: 'Verifications',
      href: '/admin/verification',
      icon: 'fact_check',
    },
    {
      name: 'Spot Checks',
      href: '/admin/spot-checks',
      icon: 'casino',
    },
    {
      name: 'Leaderboard Admin',
      href: '/admin/leaderboard',
      icon: 'leaderboard',
    },
    {
      name: 'Reward Catalog',
      href: '/admin/rewards',
      icon: 'card_giftcard',
    },
    {
      name: 'Society Challenges',
      href: '/admin/challenges',
      icon: 'emoji_events',
    },
    {
      name: 'Municipal Reports',
      href: '/admin/reports',
      icon: 'picture_as_pdf',
    },
    {
      name: 'Admin Settings',
      href: '/admin/settings',
      icon: 'settings',
    },
  ];

  const isAdmin = pathname.startsWith('/admin');
  const navItems = isAdmin ? adminNavItems : residentNavItems;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-[#131d31] border-r border-[#e2e8f0] dark:border-[#1e293b] hidden md:flex flex-col justify-between py-6 px-4 z-40 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/resident/dashboard' && item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#10b981] text-white font-bold shadow-[0_2px_8px_-2px_rgba(16,185,129,0.3)]'
                  : 'text-[#3c4a42] dark:text-[#94a3b8] hover:bg-[#eff4ff] dark:hover:bg-[#1a263e] hover:text-[#0b1c30] dark:hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-[#10b981]'}`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Target Card */}
      <div className="flex flex-col gap-2 bg-[#eff4ff] dark:bg-[#1a263e] p-4 rounded-xl border border-[#dce9ff] dark:border-[#27354f]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase tracking-wider font-bold">
            Monthly Target
          </span>
          <span className="text-xs font-bold text-[#006c49] dark:text-[#10b981]">92%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#dce9ff] dark:bg-[#27354f] overflow-hidden">
          <div className="h-full rounded-full bg-[#10b981] w-[92%] transition-all duration-500"></div>
        </div>
        <p className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] leading-tight">
          8 scans away from the Zero Contamination Pin.
        </p>
      </div>
    </aside>
  );
}
