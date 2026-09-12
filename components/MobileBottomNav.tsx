'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/resident/dashboard',
      icon: 'home',
    },
    {
      name: 'Ranks',
      href: '/resident/leaderboard',
      icon: 'military_tech',
    },
    {
      name: 'Verify',
      href: '/resident/verify',
      icon: 'photo_camera',
      isSpecial: true,
    },
    {
      name: 'Rewards',
      href: '/resident/rewards',
      icon: 'redeem',
    },
    {
      name: 'Profile',
      href: '/resident/profile',
      icon: 'person',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#131d31]/95 backdrop-blur-xl border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-around z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-2">
      {navItems.map((item) => {
        const isActive =
          item.href === '/resident/dashboard'
            ? pathname === '/resident/dashboard'
            : pathname.startsWith(item.href);

        if (item.isSpecial) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-6 group"
            >
              <div className="w-13 h-13 p-3 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(16,185,129,0.4)] group-active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[26px]">photo_camera</span>
              </div>
              <span className="text-[11px] font-bold mt-1 text-[#006c49] dark:text-[#10b981]">
                Verify
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive
                ? 'text-[#006c49] dark:text-[#10b981] font-bold'
                : 'text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-[10px] tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
