'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useApp } from '@/lib/state/store';

export default function LoginPage() {
  const router = useRouter();
  const { setProfile } = useApp();
  const [role, setRole] = useState<'resident' | 'admin'>('resident');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/resident/dashboard');
      }
    }, 600);
  };

  const handleQuickLogin = (userType: 'deepak' | 'priya' | 'admin') => {
    setLoading(true);
    if (userType === 'deepak') {
      setProfile((prev) => ({
        ...prev,
        full_name: 'Deepak S.',
        flat_number: '402B',
        tower: 'Tower B',
        role: 'resident',
        eco_points: 420,
      }));
      setTimeout(() => router.push('/resident/dashboard'), 400);
    } else if (userType === 'priya') {
      setProfile((prev) => ({
        ...prev,
        full_name: 'Priya Patel',
        flat_number: '201A',
        tower: 'Tower A',
        role: 'resident',
        eco_points: 580,
      }));
      setTimeout(() => router.push('/resident/dashboard'), 400);
    } else {
      setProfile((prev) => ({
        ...prev,
        role: 'society_admin',
      }));
      setTimeout(() => router.push('/admin/dashboard'), 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1120] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#10b981]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Logo & Headline */}
        <div className="flex flex-col items-center text-center gap-2">
          <Logo />
          <h1 className="text-xl sm:text-2xl font-bold font-headline text-[#0b1c30] dark:text-white tracking-tight mt-2">
            Welcome to EcoLoop
          </h1>
          <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
            Gamified Civic Waste Segregation & Municipal Verification
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#10b981] bg-[#eff4ff] dark:bg-[#1a263e] px-2.5 py-1 rounded-full mt-1">
            <span className="material-symbols-outlined text-[15px]">apartment</span>
            <span>Green Valley Residency • Ward 88B</span>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e]">
          <button
            type="button"
            onClick={() => setRole('resident')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'resident'
                ? 'bg-[#10b981] text-white shadow-sm'
                : 'text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
            }`}
          >
            Resident Experience
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'admin'
                ? 'bg-[#10b981] text-white shadow-sm'
                : 'text-[#3c4a42] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white'
            }`}
          >
            Society Admin Portal
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white block mb-1">
              {role === 'resident' ? 'Apartment Flat or Email' : 'Admin Email'}
            </label>
            <input
              type="text"
              required
              placeholder={role === 'resident' ? 'e.g. 402B or deepak@ecoloop.in' : 'admin@greenvalley.org'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white">
                Password
              </label>
              <a href="#" className="text-[11px] text-[#10b981] hover:underline">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] text-xs text-[#0b1c30] dark:text-white border border-[#e2e8f0] dark:border-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#10b981] hover:bg-[#006c49] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to {role === 'resident' ? 'Habit Hub' : 'Admin Portal'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Presets */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#e2e8f0] dark:border-[#1e293b]">
          <span className="text-[11px] text-center text-[#3c4a42] dark:text-[#94a3b8] font-semibold uppercase tracking-wider">
            Quick Demo Logins
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('deepak')}
              className="px-2 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] text-[11px] font-semibold text-[#0b1c30] dark:text-white text-center transition-colors flex flex-col items-center"
            >
              <span className="material-symbols-outlined text-[16px] text-[#10b981]">person</span>
              Deepak (402B)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya')}
              className="px-2 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] text-[11px] font-semibold text-[#0b1c30] dark:text-white text-center transition-colors flex flex-col items-center"
            >
              <span className="material-symbols-outlined text-[16px] text-[#e29100]">star</span>
              Priya (Marshal)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-2 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#dce9ff] text-[11px] font-semibold text-[#0b1c30] dark:text-white text-center transition-colors flex flex-col items-center"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006c49]">shield</span>
              Society Admin
            </button>
          </div>
        </div>

        {/* Registration Prompt */}
        <div className="text-center text-xs text-[#3c4a42] dark:text-[#94a3b8]">
          New apartment resident?{' '}
          <Link href="/signup" className="text-[#10b981] font-bold hover:underline">
            Register your flat
          </Link>
        </div>
      </div>
    </div>
  );
}
