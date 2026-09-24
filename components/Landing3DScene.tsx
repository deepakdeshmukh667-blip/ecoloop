'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Landing3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 340;
    let height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 1.5);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.3);
    dirLight2.position.set(-4, -2, -3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x34d399, 2.2, 8);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Main Group for interactive rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Glowing EcoLoop Core Orb
    const coreGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.15,
      metalness: 0.25,
      emissive: 0x059669,
      emissiveIntensity: 0.55,
      wireframe: false,
    });
    const coreOrb = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreOrb);

    // Outer subtle translucent pulse shell for Core
    const shellGeo = new THREE.SphereGeometry(0.85, 24, 24);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const coreShell = new THREE.Mesh(shellGeo, shellMat);
    rootGroup.add(coreShell);

    // 2. Orbiting Möbius / Recycling Rings
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0x047857,
      emissiveIntensity: 0.25,
    });
    const ringGeo1 = new THREE.TorusGeometry(1.65, 0.045, 16, 80);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    rootGroup.add(ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0x0891b2,
      emissiveIntensity: 0.25,
    });
    const ringGeo2 = new THREE.TorusGeometry(1.9, 0.038, 16, 80);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 4;
    rootGroup.add(ring2);

    // Recycling Directional Arrows on rings
    const arrowConeGeo = new THREE.ConeGeometry(0.09, 0.22, 12);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.4,
    });
    const arrows: { mesh: THREE.Mesh; offset: number; radius: number }[] = [];
    for (let i = 0; i < 3; i++) {
      const arrowMesh = new THREE.Mesh(arrowConeGeo, arrowMat);
      rootGroup.add(arrowMesh);
      arrows.push({ mesh: arrowMesh, offset: (i * Math.PI * 2) / 3, radius: 1.65 });
    }

    // 3. Floating Recyclable Waste Items on Orbit
    const itemsGroup = new THREE.Group();
    rootGroup.add(itemsGroup);

    // (A) Glass / PET Bottle
    const bottleGroup = new THREE.Group();
    const bottleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16),
      new THREE.MeshStandardMaterial({
        color: 0x67e8f9,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
      })
    );
    const bottleNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.09, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.85 })
    );
    bottleNeck.position.y = 0.24;
    bottleGroup.add(bottleBody);
    bottleGroup.add(bottleNeck);
    itemsGroup.add(bottleGroup);

    // (B) Aluminum Can
    const canGroup = new THREE.Group();
    const canMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.32, 20),
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.85,
        roughness: 0.25,
      })
    );
    const canRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.02, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 })
    );
    canRim.rotation.x = Math.PI / 2;
    canRim.position.y = 0.16;
    canGroup.add(canMesh);
    canGroup.add(canRim);
    itemsGroup.add(canGroup);

    // (C) Cardboard Box
    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.24, 0.26),
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.8,
        metalness: 0.05,
      })
    );
    itemsGroup.add(boxMesh);

    // (D) Bio Organic Leaves (2 stylized leaf shapes)
    const leafGeo = new THREE.SphereGeometry(0.16, 8, 8);
    leafGeo.scale(1.4, 0.2, 0.6);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.4,
      emissive: 0x15803d,
      emissiveIntensity: 0.25,
    });
    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    itemsGroup.add(leaf1);
    itemsGroup.add(leaf2);

    // 4. Ambient Floating Energy & Sparkle Particles
    const particleCount = 42;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 4.2;
      particlePos[i + 1] = (Math.random() - 0.5) * 3.6;
      particlePos[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.055,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Interactive Drag / Touch Orbit Controls with Inertia
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    }

    function onPointerMove(e: MouseEvent | TouchEvent) {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.006;
      prevMouseX = clientX;
      prevMouseY = clientY;
    }

    function onPointerUp() {
      isDragging = false;
    }

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Responsive Canvas Resize
    function handleResize() {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth || 340;
      height = container.clientHeight || 280;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia rotation + gentle idle spin
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.08 + 0.006;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.08;

      // Pulse Core
      const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.04;
      coreOrb.scale.set(pulse, pulse, pulse);
      coreShell.rotation.y -= 0.008;
      coreShell.rotation.x += 0.004;

      // Rings spin
      ring1.rotation.z += 0.005;
      ring2.rotation.y += 0.007;

      // Orbiting recyclables
      const speed = elapsedTime * 0.85;

      // Bottle
      bottleGroup.position.set(
        Math.cos(speed) * 1.65,
        Math.sin(speed * 1.5) * 0.35 + 0.1,
        Math.sin(speed) * 1.65
      );
      bottleGroup.rotation.x = speed * 1.2;
      bottleGroup.rotation.y = speed * 0.8;

      // Can
      canGroup.position.set(
        Math.cos(speed + 1.6) * 1.75,
        Math.sin(speed * 1.2 + 1) * 0.3 - 0.1,
        Math.sin(speed + 1.6) * 1.75
      );
      canGroup.rotation.z = speed * 1.4;
      canGroup.rotation.x = speed * 0.6;

      // Cardboard box
      boxMesh.position.set(
        Math.cos(speed + 3.2) * 1.7,
        Math.sin(speed * 0.9 + 2) * 0.4,
        Math.sin(speed + 3.2) * 1.7
      );
      boxMesh.rotation.x = speed * 0.8;
      boxMesh.rotation.y = speed * 1.1;

      // Bio Leaf 1
      leaf1.position.set(
        Math.cos(speed + 4.6) * 1.8,
        Math.sin(speed * 1.4 + 3) * 0.3 + 0.2,
        Math.sin(speed + 4.6) * 1.8
      );
      leaf1.rotation.y = speed * 1.5;
      leaf1.rotation.z = Math.sin(speed * 2) * 0.4;

      // Bio Leaf 2
      leaf2.position.set(
        Math.cos(speed + 5.3) * 1.55,
        Math.sin(speed * 1.1 + 4) * 0.35 - 0.2,
        Math.sin(speed + 5.3) * 1.55
      );
      leaf2.rotation.x = speed * 1.2;

      // Orbiting Arrows positioning
      arrows.forEach((arr) => {
        const theta = speed * 1.1 + arr.offset;
        arr.mesh.position.set(
          Math.cos(theta) * arr.radius,
          Math.sin(theta * 0.8) * 0.3,
          Math.sin(theta) * arr.radius
        );
        arr.mesh.rotation.y = -theta;
        arr.mesh.rotation.z = Math.PI / 2;
      });

      // Subtle particle float
      particles.rotation.y += 0.0015;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      arrowConeGeo.dispose();
      arrowMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md h-72 sm:h-80 mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
