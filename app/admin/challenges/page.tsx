'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useApp } from '@/lib/state/store';
import { Challenge } from '@/types';

export default function AdminChallengesPage() {
  const { challenges } = useApp();
  const [challengeList, setChallengeList] = useState<Challenge[]>(challenges);
  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [points, setPoints] = useState('100');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newChallenge: Challenge = {
      id: `chal-${Date.now()}`,
      title,
      description: desc || 'Society-wide segregation sprint',
      target_type: 'streak',
      target_value: 7,
      points_reward: parseInt(points, 10) || 50,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      participant_count: 1,
    };

    setChallengeList([newChallenge, ...challengeList]);
    setIsModalOpen(false);
    setTitle('');
    setDesc('');
    showToast(`Created new challenge: "${title}"`);
  };

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
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">emoji_events</span>
                  <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Society Challenges & Green Sprints
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                  Launch collective apartment campaigns to eliminate single-use plastic and boost wet segregation
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Create Challenge
                </button>
              </div>
            </div>

            {/* Active Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challengeList.map((c) => (
                <div
                  key={c.id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#6ffbbe]/30 text-[#006c49] dark:text-[#6ffbbe] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">flag</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-base font-headline text-[#0b1c30] dark:text-white">
                          {c.title}
                        </h3>
                        <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                          Target: {c.target_value} consecutive verified days
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#10b981] text-xs font-bold shrink-0">
                      +{c.points_reward} pts
                    </span>
                  </div>

                  <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
                    {c.description}
                  </p>

                  <div>
                    <div className="flex items-center justify-between text-xs text-[#3c4a42] dark:text-[#94a3b8] mb-1.5">
                      <span>{c.participant_count ?? c.participants_count ?? 12} households engaged</span>
                      <span className="font-semibold text-[#10b981]">Active Now</span>
                    </div>
                    <div className="w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#10b981] h-full rounded-full w-[78%]"></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between">
                    <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8]">
                      Ends {new Date(c.end_date || c.ends_at || Date.now()).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => showToast(`Bonus rewards distributed to ${c.participant_count ?? c.participants_count ?? 12} participants!`)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#10b981] hover:text-white text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors"
                      type="button"
                    >
                      Award Milestone Points
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10b981]">add_task</span>
                <h3 className="font-bold text-lg text-[#0b1c30] dark:text-white font-headline">
                  Launch Society Challenge
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#3c4a42] dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#1a263e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                  Challenge Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zero-Plastic Kitchen Sprint"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain the guidelines and municipal goal..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                  Reward Points
                </label>
                <input
                  type="number"
                  min="10"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#3c4a42] dark:text-[#94a3b8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#006c49]"
                >
                  Broadcast Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-slate-700">
          <span className="material-symbols-outlined text-[#10b981] text-[20px]">check_circle</span>
          <span className="text-xs font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}
