'use client';

import React from 'react';
import Link from 'next/link';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
  } = useApp();

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0b1c30] dark:text-white font-headline">
                  Notifications
                </h1>
                <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                  {unreadNotificationCount} unread alerts
                </span>
              </div>

              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs font-semibold text-[#006c49] dark:text-[#10b981] hover:underline"
                  type="button"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    notif.is_read
                      ? 'bg-white dark:bg-[#131d31] border-[#e2e8f0] dark:border-[#1e293b]'
                      : 'bg-[#eff4ff] dark:bg-[#1a263e] border-[#10b981] shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        notif.type === 'spot_check'
                          ? 'bg-[#ffddb8] text-[#855300]'
                          : notif.type === 'streak_boost'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#6ffbbe] text-[#002113]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {notif.type === 'spot_check'
                          ? 'casino'
                          : notif.type === 'streak_boost'
                          ? 'local_fire_department'
                          : 'notifications'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                          {notif.title}
                        </span>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                        )}
                      </div>
                      <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.action_url && (
                        <Link
                          href={notif.action_url}
                          className="text-xs font-bold text-[#006c49] dark:text-[#10b981] hover:underline mt-1 w-fit"
                        >
                          View Details &gt;
                        </Link>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8] shrink-0">
                    {notif.created_at}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
