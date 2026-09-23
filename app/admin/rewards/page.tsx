'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useApp } from '@/lib/state/store';
import { Reward } from '@/types';

export default function AdminRewardsPage() {
  const { rewards } = useApp();
  const [rewardList, setRewardList] = useState<Reward[]>(rewards);
  const [toast, setToast] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPoints, setNewPoints] = useState('200');
  const [newStock, setNewStock] = useState('50');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRestock = (id: string) => {
    setRewardList((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const currentStock = r.stock_quantity ?? r.stock ?? 0;
        return {
          ...r,
          stock: currentStock + 25,
          stock_quantity: currentStock + 25,
        };
      })
    );
    showToast('Inventory replenished (+25 units added)');
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const pointsNum = parseInt(newPoints, 10) || 100;
    const stockNum = parseInt(newStock, 10) || 20;

    const newReward: Reward = {
      id: `rew-${Date.now()}`,
      title: newTitle,
      description: 'Sponsored community partner sustainability perk',
      required_points: pointsNum,
      stock_quantity: stockNum,
      points_cost: pointsNum,
      stock: stockNum,
      category: 'voucher',
      icon_name: 'redeem',
      is_active: true,
      partner_name: 'Green Society Alliance',
      expiry_days: 60,
    };

    setRewardList([newReward, ...rewardList]);
    setIsModalOpen(false);
    setNewTitle('');
    showToast(`Added new reward: "${newReward.title}"`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] text-[#0b1c30] dark:text-white">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 min-h-[calc(100vh-4rem)] pb-24">
          <div className="w-full px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10b981] text-[24px]">card_giftcard</span>
                  <h1 className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white">
                    Eco Rewards Catalog & Partner Inventory
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                  Manage eco point vouchers, local green nursery sponsors, and community maintenance rebates
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Add Reward Item
                </button>
              </div>
            </div>

            {/* Inventory KPI Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Active Catalog Items
                  </span>
                  <div className="text-2xl font-bold font-headline text-[#0b1c30] dark:text-white mt-0.5">
                    {rewardList.length}
                  </div>
                  <span className="text-[11px] text-[#10b981] font-semibold mt-1 block">
                    All partner contracts current
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981]">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Total Points Redeemed
                  </span>
                  <div className="text-2xl font-bold font-headline text-[#e29100] mt-0.5">
                    42,680 pts
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-1 block">
                    1,240 vouchers claimed
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#ffddb8] dark:bg-[#523200] flex items-center justify-center text-[#855300] dark:text-[#ffddb8]">
                  <span className="material-symbols-outlined text-[20px]">monetization_on</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] uppercase font-bold">
                    Rebate Fund Subsidy
                  </span>
                  <div className="text-2xl font-bold font-headline text-[#10b981] mt-0.5">
                    ₹ 48,500
                  </div>
                  <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-1 block">
                    Underwritten by MCGM Ward 88B
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981]">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rewardList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#10b981] shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        {item.icon_name || 'redeem'}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#10b981] text-xs font-bold">
                        {item.points_cost ?? item.required_points} pts
                      </span>
                      <span className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] mt-1">
                        Stock: {item.stock ?? item.stock_quantity} left
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm font-headline text-[#0b1c30] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-[11px] text-[#565e74] dark:text-[#bec6e0] mt-2 block font-medium">
                      Partner: {item.partner_name || 'Green Society'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold ${
                        (item.stock ?? item.stock_quantity ?? 0) > 10 ? 'text-[#10b981]' : 'text-[#e29100]'
                      }`}
                    >
                      {(item.stock ?? item.stock_quantity ?? 0) > 10 ? 'In Stock' : 'Low Inventory'}
                    </span>

                    <button
                      onClick={() => handleRestock(item.id)}
                      className="px-3 py-1 rounded-lg bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#10b981] hover:text-white text-xs font-semibold text-[#0b1c30] dark:text-white transition-colors"
                      type="button"
                    >
                      + Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Reward Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10b981]">add_circle</span>
                <h3 className="font-bold text-lg text-[#0b1c30] dark:text-white font-headline">
                  Add Catalog Reward
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#3c4a42] dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#1a263e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddReward} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Organic Compost Bag (5kg)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                    Cost (Eco Points)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                  />
                </div>
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
                  Publish Reward
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
