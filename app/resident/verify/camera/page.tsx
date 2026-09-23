'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/components/TopNavBar';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useApp } from '@/lib/state/store';

type CameraPermission = 'pending' | 'granted' | 'denied';
type PageMode = 'capture' | 'review';

export default function CameraCapturePage() {
  const router = useRouter();
  const { selectedCategory, setPendingImage } = useApp();

  const [mode, setMode] = useState<PageMode>('capture');
  const [cameraPermission, setCameraPermission] = useState<CameraPermission>('pending');
  const [cameraError, setCameraError] = useState<string>('');
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraRef = useRef<HTMLInputElement | null>(null);

  // Stop any running camera stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start the real device camera
  const startCamera = useCallback(async () => {
    stopStream();
    setCameraPermission('pending');
    setCameraError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraPermission('denied');
      setCameraError('getUserMedia not supported. Please use Chrome/Edge/Safari on a modern device.');
      return;
    }

    // Enumerate devices first to check if a camera exists
    let hasVideoInput = false;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      hasVideoInput = devices.some((d) => d.kind === 'videoinput');
    } catch {
      // ignore enumerate errors, still try getUserMedia
      hasVideoInput = true;
    }

    if (!hasVideoInput) {
      setCameraPermission('denied');
      setCameraError('No camera detected on this device. Please upload a photo from your gallery instead.');
      return;
    }

    // Try simplest first, then with constraints
    const constraints: MediaStreamConstraints[] = [
      { video: true },
      { video: { facingMode: { ideal: 'environment' } } },
      { video: { facingMode: 'user' } },
    ];

    let stream: MediaStream | null = null;
    let lastError: unknown = null;

    for (const constraint of constraints) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraint);
        break;
      } catch (err) {
        lastError = err;
        const name = err instanceof Error ? err.name : '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') break;
      }
    }

    if (stream) {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }
      setCameraPermission('granted');
    } else {
      stopStream();
      setCameraPermission('denied');
      const name = lastError instanceof Error ? lastError.name : 'UnknownError';
      const msg = lastError instanceof Error ? lastError.message : '';
      console.error('[EcoLoop Camera Error]', name, msg);
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setCameraError(`Permission denied (${name}). Click the camera icon in your browser address bar and allow access.`);
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setCameraError(`No camera found (${name}). Upload from gallery instead.`);
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setCameraError(`Camera busy (${name}). Another app is using your camera — close it and try again.`);
      } else {
        setCameraError(`Camera error: ${name}${msg ? ' — ' + msg : ''}. Try Again or upload from gallery.`);
      }
    }
  }, [stopStream]);

  // Start camera when entering capture mode; stop when leaving
  useEffect(() => {
    if (mode === 'capture') {
      startCamera();
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Capture a real frame from the video stream via canvas
  const handleShutter = () => {
    const video = videoRef.current;
    if (!video || cameraPermission !== 'granted') return;

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    setCapturedDataUrl(dataUrl);
    setPendingImage(dataUrl);
    stopStream();
    setMode('review');
  };

  // Retake — go back to live camera
  const handleRetake = () => {
    setCapturedDataUrl(null);
    setPendingImage('');
    setMode('capture');
  };

  // Gallery / native camera upload handler (shared)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCapturedDataUrl(result);
      setPendingImage(result);
      stopStream();
      setMode('review');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Proceed to AI analysis
  const handleProceedToAnalyze = (isContaminatedDemo = false) => {
    router.push(`/resident/verify/analyzing?flagged=${isContaminatedDemo ? 'true' : 'false'}`);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#0b1120]">
      <TopNavBar />
      <DesktopSidebar />

      <div className="md:pl-60">
        <main className="w-full pt-16 pb-28 md:pb-12 min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-xl mx-auto px-4 py-4 md:py-6 flex flex-col gap-4">

            {/* Header with Stepper Progress & Category Pill */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { stopStream(); router.push('/resident/verify'); }}
                    className="w-8 h-8 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] flex items-center justify-center text-[#0b1c30] dark:text-white mr-1"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  </button>
                  <span className="text-xs font-bold text-[#006c49] dark:text-[#10b981] font-headline uppercase tracking-wider">
                    Step 2 of 3
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#bbcabf]"></span>
                  <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] font-medium">
                    {mode === 'capture' ? 'Capture Photo' : 'Review Photo'}
                  </span>
                </div>

                {/* Mode Switcher Pill */}
                <div className="flex items-center bg-[#eff4ff] dark:bg-[#1a263e] p-1 rounded-full border border-[#dce9ff] dark:border-[#27354f]">
                  <button
                    onClick={() => setMode('capture')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      mode === 'capture'
                        ? 'bg-[#10b981] text-white shadow-sm'
                        : 'text-[#3c4a42] dark:text-[#94a3b8]'
                    }`}
                    type="button"
                  >
                    Live View
                  </button>
                  <button
                    onClick={() => { if (capturedDataUrl) setMode('review'); }}
                    disabled={!capturedDataUrl}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      mode === 'review'
                        ? 'bg-[#10b981] text-white shadow-sm'
                        : 'text-[#3c4a42] dark:text-[#94a3b8] disabled:opacity-40'
                    }`}
                    type="button"
                  >
                    Review Photo
                  </button>
                </div>
              </div>

              {/* Progress bar (2/3) */}
              <div className="w-full h-1.5 bg-[#e5eeff] dark:bg-[#1e293b] rounded-full overflow-hidden flex">
                <div className="w-2/3 h-full bg-[#10b981] rounded-full transition-all duration-300"></div>
              </div>

              {/* Category Tag */}
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="inline-flex items-center gap-1.5 bg-[#eff4ff] dark:bg-[#1a263e] px-3 py-1 rounded-full border border-[#dce9ff] dark:border-[#27354f]">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: selectedCategory.bin_color }}
                  ></span>
                  <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">Selected:</span>
                  <span className="text-xs font-bold" style={{ color: selectedCategory.bin_color }}>
                    {selectedCategory.name} ({selectedCategory.badge_label})
                  </span>
                </div>

                <button
                  onClick={() => setFlashOn(!flashOn)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    flashOn
                      ? 'bg-[#e29100] text-white'
                      : 'bg-[#eff4ff] dark:bg-[#1a263e] text-[#3c4a42] dark:text-[#94a3b8]'
                  }`}
                  title="Toggle Flash"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {flashOn ? 'flash_on' : 'flash_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Hidden Gallery File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {/* Hidden Native Camera Input (opens OS camera on mobile; file picker on desktop) */}
            <input
              ref={nativeCameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* ── MODE 1: Live Camera Viewfinder ── */}
            {mode === 'capture' ? (
              <section className="relative flex flex-col">
                <div className="relative w-full aspect-[4/5] bg-[#213145] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between p-4 select-none">

                  {/* Live Video — always rendered so ref is attached */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      cameraPermission === 'granted' ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Pending / Error overlays */}
                  {cameraPermission === 'pending' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b1120]/80 z-30">
                      <div className="w-14 h-14 rounded-full border-4 border-[#10b981] border-t-transparent animate-spin" />
                      <p className="text-white text-sm font-medium">Opening camera…</p>
                    </div>
                  )}

                  {cameraPermission === 'denied' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0b1120]/90 z-30 px-6">
                      <span className="material-symbols-outlined text-[48px] text-[#f87171]">no_photography</span>
                      <p className="text-white text-sm font-semibold text-center">{cameraError}</p>
                      <button
                        onClick={() => nativeCameraRef.current?.click()}
                        className="px-6 py-2.5 bg-[#10b981] text-white text-sm font-bold rounded-full active:scale-95 transition-transform flex items-center gap-2"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        Take Photo (Native Camera)
                      </button>
                      <button
                        onClick={startCamera}
                        className="px-5 py-2 bg-white/10 text-white text-sm font-semibold rounded-full active:scale-95 transition-transform"
                        type="button"
                      >
                        Retry Browser Camera
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2 bg-white/10 text-white text-sm font-semibold rounded-full active:scale-95 transition-transform"
                        type="button"
                      >
                        Upload from Gallery
                      </button>
                    </div>
                  )}

                  {/* 3×3 Rule-of-Thirds Grid */}
                  {cameraPermission === 'granted' && (
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
                      <div className="border-r border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-r border-b border-white"></div>
                      <div className="border-b border-white"></div>
                      <div className="border-r border-white"></div>
                      <div className="border-r border-white"></div>
                      <div></div>
                    </div>
                  )}

                  {/* Corner Framing Brackets & AI Target Reticle */}
                  <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
                    <div className="flex justify-between w-full">
                      <div className="w-8 h-8 border-t-4 border-l-4 border-[#10b981] rounded-tl-lg shadow-sm"></div>
                      <div className="w-8 h-8 border-t-4 border-r-4 border-[#10b981] rounded-tr-lg shadow-sm"></div>
                    </div>
                    <div className="self-center flex flex-col items-center gap-2">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#10b981]/90 flex items-center justify-center animate-spin" style={{ animationDuration: '14s' }}>
                        <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                      </div>
                      <div className="bg-[#213145]/85 backdrop-blur-md px-3 py-1 rounded-full shadow-md">
                        <span className="text-xs text-white font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-[#10b981]">center_focus_strong</span>
                          Align inside target
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="w-8 h-8 border-b-4 border-l-4 border-[#10b981] rounded-bl-lg shadow-sm"></div>
                      <div className="w-8 h-8 border-b-4 border-r-4 border-[#10b981] rounded-br-lg shadow-sm"></div>
                    </div>
                  </div>

                  {/* Top Overlay Warning Pill */}
                  <div className="relative z-20 flex justify-center">
                    <div className="bg-[#213145]/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full flex items-center gap-2 max-w-[90%] shadow-md">
                      <span className="material-symbols-outlined text-[18px] text-[#ffb95f]">light_mode</span>
                      <span className="text-xs font-medium truncate">Good natural lighting improves AI accuracy</span>
                    </div>
                  </div>

                  {/* Bottom Guidance Toast */}
                  <div className="relative z-20 flex justify-center pb-1">
                    <p className="text-xs text-white bg-[#213145]/90 backdrop-blur-md px-4 py-2 rounded-xl text-center shadow-md leading-tight">
                      Place the waste clearly inside the frame.
                      <br />
                      <span className="text-[#bbcabf]">Make sure the contents are visible.</span>
                    </p>
                  </div>
                </div>

                {/* Capture Controls Bar */}
                <div className="mt-6 flex items-center justify-around px-4">
                  {/* Gallery Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                    title="Upload from Gallery"
                    type="button"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#0b1c30] dark:text-white flex items-center justify-center shadow-sm group-hover:bg-[#dce9ff] dark:group-hover:bg-[#27354f] transition-colors">
                      <span className="material-symbols-outlined text-[24px]">photo_library</span>
                    </div>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] font-medium">Gallery</span>
                  </button>

                  {/* Primary Shutter Button */}
                  <button
                    onClick={handleShutter}
                    disabled={cameraPermission !== 'granted'}
                    className="relative flex items-center justify-center active:scale-90 transition-transform focus:outline-none disabled:opacity-50"
                    title={cameraPermission === 'granted' ? 'Capture Image' : 'Camera not ready'}
                    type="button"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#10b981]/25 flex items-center justify-center p-1.5 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.35)]">
                      <div className="w-full h-full rounded-full bg-white dark:bg-[#131d31] flex items-center justify-center shadow-inner">
                        <div className="w-14 h-14 rounded-full bg-[#10b981] shadow-md flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-[28px]">photo_camera</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* AI Ready Indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#006c49] dark:text-[#10b981] flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                    </div>
                    <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8] font-medium">AI Ready</span>
                  </div>
                </div>
              </section>
            ) : (
              /* ── MODE 2: Photo Review Sheet ── */
              <section className="relative flex flex-col gap-4">
                <div className="relative w-full aspect-[4/5] bg-[#1a263e] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between p-4">
                  {capturedDataUrl && (
                    <img
                      src={capturedDataUrl}
                      alt="Captured waste preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Top Chip Overlay */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-[#213145]/85 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                      <span className="material-symbols-outlined text-[15px] text-[#10b981]">check_circle</span>
                      Frame Captured
                    </span>
                    <span className="bg-white/95 dark:bg-[#131d31]/95 text-[#006c49] dark:text-[#10b981] text-xs px-3 py-1 rounded-full font-bold shadow">
                      Ready to Analyze
                    </span>
                  </div>

                  {/* Diagnosis Card */}
                  <div className="relative z-10 bg-white/95 dark:bg-[#131d31]/95 backdrop-blur-md p-4 rounded-xl shadow-xl flex flex-col gap-2 border border-[#e2e8f0] dark:border-[#1e293b]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#006c49] dark:text-[#10b981]">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Photo Captured</span>
                      </div>
                      <span className="text-xs text-[#3c4a42] dark:text-[#94a3b8]">
                        Category: {selectedCategory.name}
                      </span>
                    </div>
                    <p className="text-xs text-[#0b1c30] dark:text-white leading-tight">
                      Your real photo is ready for EcoLoop AI analysis.
                    </p>
                  </div>
                </div>

                {/* Review Action Controls */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => handleProceedToAnalyze(false)}
                    className="w-full h-12 bg-[#10b981] hover:bg-[#006c49] text-white font-headline font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98]"
                    type="button"
                  >
                    <span>Analyze with EcoLoop AI</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleRetake}
                      className="h-11 bg-[#eff4ff] dark:bg-[#1a263e] hover:bg-[#e5eeff] dark:hover:bg-[#27354f] text-[#0b1c30] dark:text-white font-semibold text-xs rounded-full flex items-center justify-center gap-1.5 transition-colors border border-[#dce9ff] dark:border-[#27354f]"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                      <span>Retake Photo</span>
                    </button>

                    <button
                      onClick={() => handleProceedToAnalyze(true)}
                      className="h-11 bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] hover:opacity-90 font-semibold text-xs rounded-full flex items-center justify-center gap-1.5 transition-colors"
                      title="Test the empathetic guidance flow when accidental plastic contamination is detected"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                      <span>Test Correction Flow</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Pro Sorting Tip Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#131d31] border border-[#e2e8f0] dark:border-[#1e293b] flex items-start gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#eff4ff] dark:bg-[#1a263e] text-[#006c49] dark:text-[#10b981] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">tips_and_updates</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-headline">Pro Sorting Tip</span>
                  <span className="px-2 py-0.5 rounded bg-[#ffddb8] dark:bg-[#523200] text-[#855300] dark:text-[#ffddb8] text-[10px] font-bold">+15 pts</span>
                </div>
                <p className="text-xs text-[#3c4a42] dark:text-[#94a3b8] mt-0.5 leading-relaxed">
                  Drain excess liquids from compost items before snapping to prevent bin odor and
                  improve computer vision classification confidence.
                </p>
              </div>
            </div>

            {/* Private & Secure Footer */}
            <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#1a263e] flex items-start gap-2.5 border border-[#dce9ff] dark:border-[#27354f]">
              <span className="material-symbols-outlined text-[#10b981] text-[18px] shrink-0 mt-0.5">lock</span>
              <p className="text-[11px] text-[#3c4a42] dark:text-[#94a3b8] leading-tight">
                <strong>Private &amp; Secure:</strong> Photos are processed ephemerally for segregation
                accuracy and never for household surveillance.
              </p>
            </div>

          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
