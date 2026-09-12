'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useApp } from '@/lib/state/store';

export default function AdminResidentsPage() {
  const { residents, triggerSpotCheck } = useApp();
  const [search, setSearch] = useState('');
  const [towerFilter, setTowerFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = residents.filter((r) => {
    const matchesSearch =
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.flat_number.toLowerCase().includes(search.toLowerCase());
    const matchesTower = towerFilter === 'all' || r.tower === towerFilter;
    const matchesBadge = badgeFilter === 'all' || r.badge_status === badgeFilter;
    return matchesSearch && matchesTower && matchesBadge;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] text-[#0b1c30] dark:text-white">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-64">
        <main className="w-full pt-16 min-h-[calc(100vh-4rem)] pb-24">
          <div className="w-full px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">people</span>
                  <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Resident Directory & Compliance Registry
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                  842 active apartment households registered across Towers A, B, and C
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Exported 842 resident records to CSV')}
                  className="px-4 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors flex items-center gap-1.5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export Registry (.CSV)
                </button>
              </div>
            </div>

            {/* Quick Filter Strip */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resident name or flat (e.g. 402B)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-[#3c4a42] dark:text-[#94a3b8]">
                  search
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={towerFilter}
                  onChange={(e) => setTowerFilter(e.target.value)}
                  aria-label="Filter by tower"
                  className="px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none"
                >
                  <option value="all">All Towers</option>
                  <option value="Tower A">Tower A (Magnolia)</option>
                  <option value="Tower B">Tower B (Orchid)</option>
                  <option value="Tower C">Tower C (Palms)</option>
                </select>

                <select
                  value={badgeFilter}
                  onChange={(e) => setBadgeFilter(e.target.value)}
                  aria-label="Filter by tier status"
                  className="px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none"
                >
                  <option value="all">All Tiers</option>
                  <option value="Platinum">Platinum (95%+)</option>
                  <option value="Gold">Gold (90%+)</option>
                  <option value="Silver">Silver (85%+)</option>
                </select>

                <button
                  onClick={() => {
                    setSearch('');
                    setTowerFilter('all');
                    setBadgeFilter('all');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#ba1a1a]"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Resident Cards Grid & Table */}
            <div className="bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] bg-[#eff4ff] dark:bg-[#1a263e] border-b border-[#e2e8f0] dark:border-[#1e293b]">
                      <th className="py-3 px-4 font-bold">Resident</th>
                      <th className="py-3 px-4 font-bold">Tower / Flat</th>
                      <th className="py-3 px-4 font-bold">Accuracy</th>
                      <th className="py-3 px-4 font-bold">Consistency</th>
                      <th className="py-3 px-4 font-bold">Streak</th>
                      <th className="py-3 px-4 font-bold">Points</th>
                      <th className="py-3 px-4 font-bold">Charter Status</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#1e293b] text-xs">
                    {filtered.map((r) => {
                      const isSelf = r.flat_number === '402B';
                      return (
                        <tr
                          key={r.id}
                          className={`hover:bg-[#eff4ff]/60 dark:hover:bg-[#1a263e]/60 transition-colors ${
                            isSelf ? 'bg-[#6ffbbe]/10 dark:bg-[#006c49]/15' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={r.avatar_url || '/deepak-avatar.png'}
                                alt={r.full_name}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#10b981]"
                              />
                              <div className="flex flex-col">
                                <span className="font-bold text-[#0b1c30] dark:text-white flex items-center gap-1.5">
                                  {r.full_name}
                                  {isSelf && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#10b981] text-white font-bold">
                                      You
                                    </span>
                                  )}
                                </span>
                                <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                                  ID: {r.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-[#0b1c30] dark:text-white block">
                              {r.flat_number}
                            </span>
                            <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                              {r.tower}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                r.accuracy_rate >= 95
                                  ? 'bg-[#6ffbbe] text-[#002113]'
                                  : 'bg-[#eff4ff] dark:bg-[#1a263e] text-[#10b981]'
                              }`}
                            >
                              {r.accuracy_rate}%
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-[#0b1c30] dark:text-white">
                            {r.consistency_index}%
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#e29100]">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">
                                local_fire_department
                              </span>
                              {r.streak_days}d
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#0b1c30] dark:text-white">
                            {r.eco_points} pts
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                r.badge_status === 'Platinum'
                                  ? 'bg-[#ffddb8] text-[#855300]'
                                  : r.badge_status === 'Gold'
                                  ? 'bg-[#eff4ff] text-[#006c49]'
                                  : 'bg-[#f1f5f9] text-[#565e74]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {r.badge_status === 'Platinum'
                                  ? 'star'
                                  : r.badge_status === 'Gold'
                                  ? 'military_tech'
                                  : 'workspace_premium'}
                              </span>
                              {r.badge_status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/residents/${r.id}`}
                                className="px-2.5 py-1 rounded-lg bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] dark:hover:bg-[#27354f] text-[#0b1c30] dark:text-white font-semibold text-[11px] transition-colors"
                              >
                                View Dossier
                              </Link>
                              <button
                                onClick={() => {
                                  triggerSpotCheck();
                                  showToast(
                                    `Random spot check dispatched to ${r.full_name} (${r.flat_number})`
                                  );
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#10b981] hover:bg-[#006c49] text-white font-bold text-[11px] transition-colors"
                                title="Trigger Spot Check"
                                type="button"
                              >
                                Spot Check
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                <span>
                  Showing {filtered.length} of {residents.length} units
                </span>
                <span className="font-medium text-[#10b981]">
                  All records cryptographically signed
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-slate-700">
          <span className="material-symbols-outlined text-[#10b981] text-[20px]">check_circle</span>
          <span className="text-xs font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}
