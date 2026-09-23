'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';
import { NotificationItem } from '@/types';

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
  } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'spot_check': return 'casino';
      case 'streak_boost': return 'local_fire_department';
      case 'reward': return 'redeem';
      case 'achievement': return 'emoji_events';
      default: return 'notifications';
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case 'spot_check': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'streak_boost': return 'bg-red-100 dark:bg-red-900/30 text-red-500';
      case 'reward': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    if (notif.action_url) {
      router.push(notif.action_url);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080f1a]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between animate-fadeInUp">
              <div>
                <p className="section-label">Inbox</p>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-headline mt-0.5">
                  Notifications
                </h1>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadNotificationCount > 0
                    ? `${unreadNotificationCount} unread`
                    : 'All caught up!'}
                </span>
              </div>

              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400
                    hover:underline flex items-center gap-1 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">done_all</span>
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="flex flex-col gap-2.5">
              {notifications.length === 0 ? (
                <div className="card p-10 flex flex-col items-center justify-center gap-3 text-center">
                  <span className="material-symbols-outlined text-[40px] text-slate-300 dark:text-slate-600">
                    notifications_off
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif, idx) => (
                  <div
                    key={notif.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleNotificationClick(notif)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationClick(notif);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer
                      flex items-start gap-3.5 hover:shadow-md active:scale-[0.99]
                      animate-fadeInUp select-none group
                      ${notif.is_read
                        ? 'bg-white dark:bg-[#111f35] border-slate-200 dark:border-[#1e2d45] hover:border-emerald-300 dark:hover:border-emerald-700/60'
                        : 'bg-emerald-50/80 dark:bg-emerald-900/15 border-emerald-300 dark:border-emerald-700/60 hover:border-emerald-400'
                      }`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {/* Icon */}
                    <div className={`icon-box shrink-0 ${getIconStyle(notif.type)} group-hover:scale-105 transition-transform`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {getIcon(notif.type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {notif.title}
                        </span>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        {notif.message}
                      </p>
                      {notif.action_url && (
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400
                          mt-2 inline-flex items-center gap-1 group-hover:underline">
                          <span>Open action</span>
                          <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </div>
                      )}
                    </div>

                    {/* Time */}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">
                      {notif.created_at}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
