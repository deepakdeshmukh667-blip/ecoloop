'use client';

import React, { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

export default function VerificationHistoryPage() {
  const { verifications, profile } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'spot' | 'attention'>('all');
  const [expandedScans, setExpandedScans] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedScans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVerifications = verifications.filter((v) => {
    if (activeFilter === 'verified') return v.status === 'verified' && !v.is_spot_check;
    if (activeFilter === 'spot') return v.is_spot_check;
    if (activeFilter === 'attention') return v.status === 'needs_attention';
    return true;
  });

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
            {/* Header: Audit & Consistency Monthly Progress */}
            <section className="bg-white dark:bg-[#131d31] p-5 md:p-6 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#3c4a42] dark:text-[#94a3b8] font-bold">
                    Audit & Consistency
                  </span>
                  <h1 className="text-2xl font-bold text-[#0b1c30] dark:text-white font-headline">
                    Monthly Progress
                  </h1>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Grade A+
                </span>
              </div>

              {/* 4 Stat Boxes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex flex-col gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  </div>
                  <span className="text-xl font-extrabold text-[#0b1c30] dark:text-white font-headline mt-1">
                    {profile.total_verifications}
                  </span>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                    Verified Checks
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex flex-col gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                  </div>
                  <span className="text-xl font-extrabold text-[#0b1c30] dark:text-white font-headline mt-1">
                    {profile.eco_points}
                  </span>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">Points Gained</span>
                </div>

                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex flex-col gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#ffdad6] dark:bg-[#93000a] text-[#ba1a1a] dark:text-[#ffdad6] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">
                      local_fire_department
                    </span>
                  </div>
                  <span className="text-xl font-extrabold text-[#0b1c30] dark:text-white font-headline mt-1">
                    {profile.current_streak} Days
                  </span>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">Active Streak</span>
                </div>

                <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#dce9ff] dark:border-[#27354f] flex flex-col gap-1">
                  <div className="w-8 h-8 rounded-full bg-[#dae2fd] dark:bg-[#1e293b] text-[#131b2e] dark:text-[#dae2fd] flex items-center justify-center font-bold text-xs">
                    {Math.round(profile.consistency_score)}
                  </div>
                  <span className="text-xl font-extrabold text-[#0b1c30] dark:text-white font-headline mt-1">
                    {Math.round(profile.consistency_score)}%
                  </span>
                  <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">Consistency</span>
                </div>
              </div>

              {/* Progress to next tier */}
              <div className="flex items-center justify-between text-xs text-[#3c4a42] dark:text-[#94a3b8] pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#10b981]">eco</span>
                  <span>3 more validations to reach Platinum Tier</span>
                </div>
                <span className="font-bold text-[#006c49] dark:text-[#10b981]">Level 4</span>
              </div>
            </section>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'verified', label: `Verified (${verifications.filter((v) => v.status === 'verified' && !v.is_spot_check).length})` },
                { key: 'spot', label: `Spot Checks (${verifications.filter((v) => v.is_spot_check).length})` },
                { key: 'attention', label: `Needs Attention (${verifications.filter((v) => v.status === 'needs_attention').length})` },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFilter === f.key
                      ? 'bg-[#10b981] text-white shadow-sm'
                      : 'bg-white dark:bg-[#131d31] text-[#3c4a42] dark:text-[#94a3b8] border border-[#e2e8f0] dark:border-[#1e293b] hover:border-[#10b981]/50'
                  }`}
                  type="button"
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Timeline Verifications List */}
            <section className="flex flex-col gap-4">
              {filteredVerifications.map((v) => {
                const isExpanded = !!expandedScans[v.id];
                const isAttention = v.status === 'needs_attention';

                return (
                  <div
                    key={v.id}
                    className={`bg-white dark:bg-[#131d31] p-5 rounded-2xl shadow-sm border transition-all ${
                      isAttention
                        ? 'border-[#ffdad6] dark:border-[#93000a]/50'
                        : 'border-[#e2e8f0] dark:border-[#1e293b]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isAttention
                              ? 'bg-[#ffdad6] text-[#ba1a1a]'
                              : v.is_spot_check
                              ? 'bg-[#ffddb8] text-[#855300]'
                              : 'bg-[#6ffbbe] text-[#002113]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {isAttention ? 'warning' : v.is_spot_check ? 'casino' : 'compost'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-headline">
                              {v.category_slug === 'wet'
                                ? 'Wet Waste'
                                : v.category_slug === 'dry'
                                ? 'Dry Recyclables'
                                : 'Special Waste'}
                            </span>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                isAttention
                                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                  : v.is_spot_check
                                  ? 'bg-[#ffddb8] text-[#855300]'
                                  : 'bg-[#6ffbbe] text-[#002113]'
                              }`}
                            >
                              {isAttention ? 'Corrected' : v.is_spot_check ? 'Passed (2x)' : 'Verified'}
                            </span>
                          </div>
                          <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-0.5">
                            {v.verified_at || 'Recently'} • Kitchen Station A
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#006c49] dark:text-[#10b981] block">
                          +{v.points_awarded + v.clean_bin_bonus} pts
                        </span>
                        <span className="text-[10px] text-[#3c4a42] dark:text-[#94a3b8]">
                          Acc: {v.ai_confidence}%
                        </span>
                      </div>
                    </div>

                    {/* Expandable Scan Details */}
                    <div className="mt-3 pt-3 border-t border-[#e2e8f0]/60 dark:border-[#1e293b]/60 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                          <span className="material-symbols-outlined text-[16px] text-[#10b981]">
                            auto_awesome
                          </span>
                          <span>AI Detection Confidence</span>
                        </div>
                        <button
                          onClick={() => toggleExpand(v.id)}
                          className="text-xs font-semibold text-[#006c49] dark:text-[#10b981] hover:underline flex items-center gap-0.5"
                          type="button"
                        >
                          <span>{isExpanded ? 'Hide Scan' : 'View Scan'}</span>
                          <span className="material-symbols-outlined text-[16px]">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] dark:bg-[#1a263e] text-[11px] text-[#0b1c30] dark:text-white">
                          🍌 Fruit Peels
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] dark:bg-[#1a263e] text-[11px] text-[#0b1c30] dark:text-white">
                          ☕ Coffee Grounds
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] dark:bg-[#1a263e] text-[11px] text-[#0b1c30] dark:text-white">
                          🥬 Salad Trimmings
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 rounded-xl overflow-hidden aspect-[16/9] bg-[#1a263e] relative animate-in fade-in duration-200">
                          <img
                            src={
                              v.image_url ||
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuDaOmxjIeUjdfF2Dcxi8G_St5RMnAh8BwFKhT2gZhdvvGIEkK_0zca8Ibm5HS0VXZWt1Jc5ythAlMDWczo4iNohK72oKTJPTt-0xUfsCQkBOQxNRDV7NE6CyybfDe2DdKhR36ktK_-VfhTlL8nGUHgcnOA-TP4cz1wD_bKArpDXUiSlrTtOwWmFe8zZVT6tNijlrMszgjql_7fvjItzFyTIs6PDQM6FSh9Mrqd6FKdgJO9lLfazSGz2'
                            }
                            alt="Scan evidence"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 text-white text-[11px] backdrop-blur-sm">
                            {v.ai_feedback || 'Verified through EcoLoop optical segmentation.'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Did you know tip banner */}
            <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-center gap-3 border border-[#dce9ff] dark:border-[#27354f]">
              <div className="w-10 h-10 rounded-full bg-[#6ffbbe] dark:bg-[#006c49] text-[#002113] dark:text-[#6ffbbe] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">
                  Did you know?
                </span>
                <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed mt-0.5">
                  Green Valley Residency diverted 3.4 tons of waste this week thanks to clean
                  household sorting.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
