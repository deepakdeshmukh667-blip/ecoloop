'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/resident/dashboard', icon: 'home' },
    { name: 'Ranks', href: '/resident/leaderboard', icon: 'military_tech' },
    { name: 'Verify', href: '/resident/verify', icon: 'photo_camera', isSpecial: true },
    { name: 'Rewards', href: '/resident/rewards', icon: 'redeem' },
    { name: 'Profile', href: '/resident/profile', icon: 'person' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-50
      bg-white/90 dark:bg-[#0d1625]/95 backdrop-blur-2xl
      border-t border-slate-200 dark:border-[#1e2d45]
      flex items-center justify-around px-2
      shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
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
              className="flex flex-col items-center justify-center -mt-5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500
                text-white flex items-center justify-center
                shadow-[0_4px_14px_rgba(16,185,129,0.4)]
                group-active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[22px]">photo_camera</span>
              </div>
              <span className="text-[10px] font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                Verify
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 transition-all ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-semibold ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
