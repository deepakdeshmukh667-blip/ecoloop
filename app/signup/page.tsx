'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useApp } from '@/lib/state/store';

export default function SignUpPage() {
  const router = useRouter();
  const { setProfile } = useApp();

  const [fullName, setFullName] = useState('');
  const [tower, setTower] = useState('Tower B');
  const [flatNumber, setFlatNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreePrivacy) return;

    setLoading(true);
    setProfile((prev) => ({
      ...prev,
      full_name: fullName || 'New Resident',
      flat_number: flatNumber || '101B',
      tower: tower,
      role: 'resident',
      eco_points: 50, // Welcome bonus
    }));

    setTimeout(() => {
      router.push('/resident/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#10b981]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <Logo />
          <h1 className="text-xl sm:text-2xl font-bold font-headline text-[#0b1c30] dark:text-white tracking-tight mt-2">
            Register Apartment Household
          </h1>
          <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
            Join Green Valley Residency&apos;s verified waste segregation collective
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deepak S."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                Tower Block
              </label>
              <select
                value={tower}
                onChange={(e) => setTower(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              >
                <option value="Tower A">Tower A (Magnolia)</option>
                <option value="Tower B">Tower B (Orchid)</option>
                <option value="Tower C">Tower C (Palms)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                Flat Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 402B"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
                Society Code
              </label>
              <input
                type="text"
                disabled
                value="GVR-2024 (Verified)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#e2e8f0]/60 dark:bg-[#1e293b]/60 text-xs text-[#3c4a42] dark:text-[#94a3b8] border border-[#e2e8f0] dark:border-[#1e293b] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="deepak@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
              Create Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>

          {/* Privacy Guarantee Checkbox */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] border border-[#e2e8f0] dark:border-[#1e293b] flex items-start gap-2.5">
            <input
              type="checkbox"
              id="privacyAgreement"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="mt-0.5 accent-[#10b981]"
            />
            <label htmlFor="privacyAgreement" className="text-xs text-[#3c4a42] dark:text-[#94a3b8] leading-relaxed">
              I agree to the <strong className="text-[#0b1c30] dark:text-white">Zero-Surveillance Civic Charter</strong>.
              I understand image classification is strictly confidential, no continuous CCTV is active, and spot checks occur at most once every 12–18 days.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreePrivacy}
            className="w-full py-3 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 mt-2"
          >
            {loading ? (
              <span>Registering Household...</span>
            ) : (
              <>
                <span>Join & Claim +50 Welcome Eco Points</span>
                <span className="material-symbols-outlined text-[18px]">celebration</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#3c4a42] dark:text-[#94a3b8]">
          Already registered?{' '}
          <Link href="/login" className="text-[#10b981] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
