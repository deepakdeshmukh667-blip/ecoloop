'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatNameFromEmail, useApp } from '@/lib/state/store';
import * as THREE from 'three';

// ─── Real-time Greeting ──────────────────────────────────────
function useGreeting() {
  const [greeting, setGreeting] = useState('');
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
        setEmoji('🌅');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon');
        setEmoji('☀️');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening');
        setEmoji('🌇');
      } else {
        setGreeting('Good Night');
        setEmoji('🌙');
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return { greeting, emoji };
}

// ─── Three.js 3D Scene Component ─────────────────────────────
function EcoLoop3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const d1 = new THREE.DirectionalLight(0x10b981, 1.5);
    d1.position.set(4, 5, 4);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x06b6d4, 1.3);
    d2.position.set(-4, -2, -3);
    scene.add(d2);
    const pt = new THREE.PointLight(0x34d399, 2.5, 10);
    pt.position.set(0, 0, 0);
    scene.add(pt);

    const root = new THREE.Group();
    scene.add(root);

    // Core orb
    const coreOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0x10b981, roughness: 0.12, metalness: 0.3,
        emissive: 0x059669, emissiveIntensity: 0.65,
      })
    );
    root.add(coreOrb);

    // Wireframe shell
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x6ee7b7, wireframe: true, transparent: true, opacity: 0.22 })
    );
    root.add(shell);

    // Inner frosted ring
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.04, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.2, metalness: 0.3, transparent: true, opacity: 0.65 })
    );
    root.add(innerRing);

    // Outer Möbius ring 1 — emerald
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.048, 16, 80),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.2, metalness: 0.6, emissive: 0x047857, emissiveIntensity: 0.3 })
    );
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    root.add(ring1);

    // Outer ring 2 — cyan
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.04, 16, 80),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2, metalness: 0.6, emissive: 0x0891b2, emissiveIntensity: 0.3 })
    );
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 4;
    root.add(ring2);

    // Orbit ellipse lines
    const makeOrbit = (radiusX: number, radiusY: number, rotX: number, color: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(100);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 }));
      line.rotation.x = rotX;
      root.add(line);
      return line;
    };
    makeOrbit(2.2, 2.0, Math.PI * 0.38, 0x34d399);
    makeOrbit(2.4, 2.1, Math.PI * 0.55, 0x2dd4bf);

    // Arrow cones on ring1
    const arrowMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 0.4 });
    const arrowConeGeo = new THREE.ConeGeometry(0.09, 0.22, 12);
    const arrows: { mesh: THREE.Mesh; offset: number }[] = [];
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(arrowConeGeo, arrowMat);
      root.add(m);
      arrows.push({ mesh: m, offset: (i * Math.PI * 2) / 3 });
    }

    // Floating recyclables
    // PET Bottle
    const bottle = new THREE.Group();
    bottle.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.38, 16), new THREE.MeshStandardMaterial({ color: 0x67e8f9, roughness: 0.1, transparent: true, opacity: 0.88 })));
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.18, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.88 }));
    neck.position.y = 0.27;
    bottle.add(neck);
    root.add(bottle);

    // Aluminum can
    const can = new THREE.Group();
    can.add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.34, 20), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.88, roughness: 0.22 })));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.02, 8, 20), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.92 }));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.17;
    can.add(rim);
    root.add(can);

    // Box
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.26, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8, metalness: 0.05 })
    );
    root.add(box);

    // Leaves
    const leafGeo = new THREE.SphereGeometry(0.17, 8, 8);
    leafGeo.scale(1.4, 0.2, 0.6);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.4, emissive: 0x15803d, emissiveIntensity: 0.25 });
    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    root.add(leaf1);
    root.add(leaf2);

    // Particles
    const pCount = 55;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 5;
      pPos[i + 1] = (Math.random() - 0.5) * 4.5;
      pPos[i + 2] = (Math.random() - 0.5) * 4;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x34d399, size: 0.055, transparent: true, opacity: 0.7 }));
    root.add(particles);

    // Drag orbit controls
    let dragging = false, prevX = 0, prevY = 0, rotY = 0, rotX = 0;
    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging = true;
      const src = 'touches' in e ? e.touches[0] : e;
      prevX = src.clientX; prevY = src.clientY;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const src = 'touches' in e ? e.touches[0] : e;
      rotY += (src.clientX - prevX) * 0.008;
      rotX += (src.clientY - prevY) * 0.006;
      prevX = src.clientX; prevY = src.clientY;
    };
    const onUp = () => { dragging = false; };
    container.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    container.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    const handleResize = () => {
      width = container.clientWidth || 480;
      height = container.clientHeight || 480;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth inertia
      root.rotation.y += (rotY - root.rotation.y) * 0.08 + 0.005;
      root.rotation.x += (rotX - root.rotation.x) * 0.08;

      // Core pulse
      const p = 1 + Math.sin(t * 2.2) * 0.04;
      coreOrb.scale.set(p, p, p);

      // Shell + inner ring spin
      shell.rotation.y -= 0.007;
      shell.rotation.x += 0.003;
      innerRing.rotation.z += 0.008;

      // Rings
      ring1.rotation.z += 0.005;
      ring2.rotation.y += 0.007;

      const sp = t * 0.85;

      // Orbit recyclables
      bottle.position.set(Math.cos(sp) * 1.75, Math.sin(sp * 1.5) * 0.4 + 0.1, Math.sin(sp) * 1.75);
      bottle.rotation.x = sp * 1.2; bottle.rotation.y = sp * 0.8;

      can.position.set(Math.cos(sp + 1.6) * 1.85, Math.sin(sp * 1.2 + 1) * 0.35 - 0.1, Math.sin(sp + 1.6) * 1.85);
      can.rotation.z = sp * 1.4; can.rotation.x = sp * 0.6;

      box.position.set(Math.cos(sp + 3.2) * 1.8, Math.sin(sp * 0.9 + 2) * 0.45, Math.sin(sp + 3.2) * 1.8);
      box.rotation.x = sp * 0.8; box.rotation.y = sp * 1.1;

      leaf1.position.set(Math.cos(sp + 4.6) * 1.9, Math.sin(sp * 1.4 + 3) * 0.35 + 0.2, Math.sin(sp + 4.6) * 1.9);
      leaf1.rotation.y = sp * 1.5; leaf1.rotation.z = Math.sin(sp * 2) * 0.4;

      leaf2.position.set(Math.cos(sp + 5.3) * 1.65, Math.sin(sp * 1.1 + 4) * 0.38 - 0.2, Math.sin(sp + 5.3) * 1.65);
      leaf2.rotation.x = sp * 1.2;

      arrows.forEach(a => {
        const th = sp * 1.1 + a.offset;
        a.mesh.position.set(Math.cos(th) * 1.75, Math.sin(th * 0.8) * 0.3, Math.sin(th) * 1.75);
        a.mesh.rotation.y = -th; a.mesh.rotation.z = Math.PI / 2;
      });

      particles.rotation.y += 0.001;
      pt.intensity = 2.2 + Math.sin(t * 1.5) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      container.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

// ─── Live Clock ───────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}

// ─── Main Landing Page ────────────────────────────────────────
export default function HomePage() {
  const { theme, setTheme } = useApp();
  const router = useRouter();
  const { greeting, emoji } = useGreeting();
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
          const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase().trim() || '');
          if (!isAdmin) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (profile?.role === 'admin' || profile?.role === 'society_admin' || profile?.role === 'municipal_admin') {
              router.replace('/admin/dashboard'); return;
            }
          } else {
            router.replace('/admin/dashboard'); return;
          }
          router.replace('/resident/dashboard'); return;
        }
      } catch { /* not logged in */ }
      setChecking(false);
    };
    checkAuth();
  }, [router]);

  const isDark = mounted && (theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setAuthError('Please enter your email and password.'); return; }
    setSigningIn(true);
    setAuthError('');
    try {
      const supabase = createClient();
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setAuthError(error.message); setSigningIn(false); return; }
      if (data.user) {
        const ADMIN_EMAILS = ['deepakdeshmukh667@gmail.com'];
        const userEmail = data.user.email?.toLowerCase().trim() || '';
        const isAdmin = ADMIN_EMAILS.includes(userEmail);
        let adminRole = isAdmin;
        if (!adminRole) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
          adminRole = profile?.role === 'admin' || profile?.role === 'society_admin' || profile?.role === 'municipal_admin';
        }
        router.push(adminRole ? '/admin/dashboard' : '/resident/dashboard');
      }
    } catch { setAuthError('Something went wrong. Please try again.'); setSigningIn(false); }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1120]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          <span className="text-sm text-slate-500 dark:text-slate-400">Loading EcoLoop…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-[#0b1120] dark:via-[#0d1a12] dark:to-[#0a1520] text-slate-900 dark:text-white transition-colors duration-300 flex flex-col relative overflow-hidden">

        {/* Background ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-[140px]"></div>
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-teal-400/15 dark:bg-teal-500/10 rounded-full blur-[130px]"></div>
          <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-cyan-400/10 dark:bg-cyan-500/8 rounded-full blur-[120px]"></div>
        </div>

        {/* ── NAVBAR ── */}
        <nav className="relative z-30 w-full flex items-center justify-between px-6 md:px-10 py-4 border-b border-slate-200/60 dark:border-white/5 bg-white/60 dark:bg-[#0b1120]/70 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <span className="material-symbols-outlined text-white text-[20px]">recycling</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight">Eco<span className="text-emerald-500">Loop</span></span>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-widest">Vision Engine v4.2</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live clock */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-[14px] text-emerald-500">schedule</span>
              <LiveClock />
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-[18px]">{mounted && isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>

            <Link href="/admin/login" className="hidden md:inline-flex items-center text-xs font-semibold px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Admin Portal
            </Link>
          </div>
        </nav>

        {/* ── MAIN SPLIT LAYOUT ── */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row">

          {/* LEFT — 3D Hero Panel */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-12 py-10 lg:py-0">

            {/* Real-time greeting */}
            <div className="flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/8 shadow-sm backdrop-blur-md">
              <span className="text-lg">{emoji}</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{greeting}, Welcome to EcoLoop</span>
            </div>

            {/* Hero headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center tracking-tight leading-[1.1] mb-5 max-w-2xl">
              Recycle Smarter.{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent block">
                Live Greener.
              </span>
              <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent block">
                Close the Loop.
              </span>
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 text-center max-w-md mb-8">
              AI-powered recycling platform that identifies waste, builds community habits, and makes every sustainable action count.
            </p>

            {/* CTA row */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                AI Scan
              </div>
              <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-400 font-medium">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Rewards
              </div>
              <div className="flex items-center gap-2 text-sm text-cyan-700 dark:text-cyan-400 font-medium">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Community
              </div>
            </div>

            {/* ── 3D Scene ── */}
            <div className="relative w-full max-w-md h-72 md:h-80 lg:h-96">
              {/* Glow halo behind canvas */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-400/35 via-teal-400/25 to-cyan-400/30 blur-3xl"></div>
              </div>
              <EcoLoop3DScene />
            </div>

            {/* 360 pill */}
            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-white/8 backdrop-blur-md shadow-sm pointer-events-none">
              <span className="material-symbols-outlined text-emerald-500 text-[17px]">view_in_ar</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">360° Live Waste Classifier · Drag to Rotate</span>
            </div>

            {/* Telemetry Matrix */}
            <div className="mt-6 w-full max-w-sm rounded-2xl p-4 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/60 dark:border-white/8 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">EcoLoop Intelligence Matrix</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">REALTIME</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: 'eco', label: 'Habit', value: '92%', sub: <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '92%' }}></div></div>, color: 'text-teal-600 dark:text-teal-400' },
                  { icon: 'toll', label: 'Points', value: '1,240', sub: <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1"><span className="material-symbols-outlined text-[11px]">trending_up</span>+180</span>, color: 'text-emerald-600 dark:text-emerald-400' },
                  { icon: 'task_alt', label: 'Verified', value: '86', sub: <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">items scan</span>, color: 'text-cyan-600 dark:text-cyan-400' },
                ].map(({ icon, label, value, sub, color }) => (
                  <div key={label} className="flex flex-col items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-center">
                    <div className={`flex items-center gap-1 mb-1 ${color}`}>
                      <span className="material-symbols-outlined text-[14px]">{icon}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                    </div>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{value}</span>
                    {sub}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="material-symbols-outlined text-[13px] text-teal-600 dark:text-teal-400">filter_center_focus</span>
                  Latest: PET Bottle Sorted
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+15 pts</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Sign In Panel (StockFlow style) */}
          <div className="w-full lg:w-[440px] xl:w-[480px] flex flex-col items-center justify-center px-8 md:px-12 py-12 lg:py-0 lg:border-l border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-[#0d1520]/60 backdrop-blur-xl">

            <div className="w-full max-w-sm">
              {/* Logo + branding */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-600/25 mb-4">
                  <span className="material-symbols-outlined text-white text-[32px]">recycling</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Sign in to EcoLoop</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  Enter your credentials to access your sustainable workspace
                </p>
              </div>

              {/* Security badge */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 mb-6">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span className="text-xs font-semibold">Enterprise Cloud Security</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">ENCRYPTED</span>
              </div>

              {/* Sign-in form */}
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">mail</span>
                    <input
                      type="email"
                      placeholder="name@society.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">lock</span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-[18px]">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs">
                    <span className="material-symbols-outlined text-[15px]">error</span>
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 active:scale-[0.98] disabled:opacity-60 transition-all duration-200"
                >
                  {signingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In to Dashboard
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">or</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              </div>

              {/* Alt login links */}
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/resident/login"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-500">person</span>
                  OTP Login (Resident Portal)
                </Link>
                <Link
                  href="/admin/login"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-teal-500">admin_panel_settings</span>
                  Admin Portal
                </Link>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} EcoLoop · AI-Powered Waste Segregation Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
