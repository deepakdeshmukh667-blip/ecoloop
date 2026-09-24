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

    let width = container.clientWidth || 1100;
    let height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // Lighting designed for high contrast and pop on light/pearl backdrops
    const ambLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0x059669, 2.8); // Emerald
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x0284c7, 2.4); // Deep Cyan
    fillLight.position.set(-6, -3, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, 1.8);
    rimLight.position.set(0, -6, -3);
    scene.add(rimLight);

    const centerPointLight = new THREE.PointLight(0x34d399, 2.5, 12);
    centerPointLight.position.set(0, 0, 1.5);
    scene.add(centerPointLight);

    // Master Interaction Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central Emerald Eco-Core Orb
    const coreGeo = new THREE.SphereGeometry(1.25, 48, 48);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x059669,
      emissive: 0x065f46,
      emissiveIntensity: 0.5,
      shininess: 90,
      specular: 0xa7f3d0,
      transparent: true,
      opacity: 0.95,
    });
    const coreOrb = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreOrb);

    // Outer Frosted Ring
    const innerRingGeo = new THREE.TorusGeometry(1.65, 0.05, 16, 64);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      roughness: 0.25,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    masterGroup.add(innerRing);

    // 2. Dual Circular Möbius Recycling Loop Tracks with Directional Cones
    const loopGroup = new THREE.Group();
    masterGroup.add(loopGroup);

    const orbitRadius = 2.9;
    const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius * 0.9, 0, 2 * Math.PI, false, 0);
    const points = orbitCurve.getPoints(90);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x0d9488, linewidth: 2, transparent: true, opacity: 0.85 });

    const orbitLine1 = new THREE.Line(orbitGeo, orbitMat);
    orbitLine1.rotation.x = Math.PI * 0.36;
    orbitLine1.rotation.y = Math.PI * 0.12;
    loopGroup.add(orbitLine1);

    const orbitLine2 = orbitLine1.clone();
    orbitLine2.rotation.x = -Math.PI * 0.34;
    orbitLine2.rotation.z = Math.PI * 0.28;
    loopGroup.add(orbitLine2);

    // Recycling Arrow Markers on the Track
    const arrowMat = new THREE.MeshPhongMaterial({ color: 0x047857, shininess: 80 });
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const coneGeo = new THREE.ConeGeometry(0.14, 0.32, 16);
      const arrowCone = new THREE.Mesh(coneGeo, arrowMat);
      arrowCone.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * (orbitRadius * 0.9), 0);
      arrowCone.rotation.z = angle + Math.PI / 2;
      orbitLine1.add(arrowCone);
    }

    // 3. Floating 3D Recyclable Objects
    interface FloatingItem {
      pivot: THREE.Group;
      mesh: THREE.Object3D;
      basePos: THREE.Vector3;
      rotSpeed: { x: number; y: number; z: number };
      floatSpeed: number;
      phase: number;
    }
    const floatingItems: FloatingItem[] = [];

    function addFloatingItem(
      mesh: THREE.Object3D,
      initialPos: THREE.Vector3,
      rotSpeed: { x: number; y: number; z: number },
      floatSpeed: number,
      phase: number
    ) {
      const pivot = new THREE.Group();
      pivot.position.copy(initialPos);
      pivot.add(mesh);
      masterGroup.add(pivot);
      floatingItems.push({ pivot, mesh, basePos: initialPos.clone(), rotSpeed, floatSpeed, phase });
    }

    // Item A: Translucent Recycled Glass Bottle
    const bottleGroup = new THREE.Group();
    const bottleBodyGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.82, 24);
    const bottleMat = new THREE.MeshPhongMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
      shininess: 100,
      specular: 0xbae6fd,
      transparent: true,
      opacity: 0.92,
    });
    const bottleBody = new THREE.Mesh(bottleBodyGeo, bottleMat);
    bottleGroup.add(bottleBody);
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.18, 0.32, 16);
    const neck = new THREE.Mesh(neckGeo, bottleMat);
    neck.position.y = 0.52;
    bottleGroup.add(neck);
    const capGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.1, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.72;
    bottleGroup.add(cap);
    addFloatingItem(bottleGroup, new THREE.Vector3(-2.6, 1.2, 0.8), { x: 0.008, y: 0.012, z: 0.005 }, 1.4, 0.2);

    // Item B: Aluminum Recyclable Soda Can
    const canGroup = new THREE.Group();
    const canBodyGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.72, 24);
    const canMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.25 });
    canGroup.add(new THREE.Mesh(canBodyGeo, canMat));
    const canBadgeGeo = new THREE.CylinderGeometry(0.285, 0.285, 0.3, 24, 1, true);
    const canBadgeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    canGroup.add(new THREE.Mesh(canBadgeGeo, canBadgeMat));
    const canRimGeo = new THREE.TorusGeometry(0.27, 0.03, 12, 24);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 });
    const rimTop = new THREE.Mesh(canRimGeo, rimMat);
    rimTop.rotation.x = Math.PI / 2;
    rimTop.position.y = 0.36;
    canGroup.add(rimTop);
    const rimBot = rimTop.clone();
    rimBot.position.y = -0.36;
    canGroup.add(rimBot);
    addFloatingItem(canGroup, new THREE.Vector3(2.6, -1.0, 1.0), { x: -0.01, y: 0.009, z: 0.006 }, 1.6, 1.8);

    // Item C: Sustainable Paper / Cardboard Package Box
    const boxGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.68, 0.68, 0.68);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
    boxGroup.add(new THREE.Mesh(boxGeo, boxMat));
    const tapeGeo = new THREE.BoxGeometry(0.7, 0.16, 0.7);
    const tapeMat = new THREE.MeshBasicMaterial({ color: 0xfef3c7 });
    boxGroup.add(new THREE.Mesh(tapeGeo, tapeMat));
    boxGroup.rotation.set(0.4, 0.5, 0.2);
    addFloatingItem(boxGroup, new THREE.Vector3(2.4, 1.6, -0.6), { x: 0.007, y: -0.01, z: 0.004 }, 1.2, 3.4);

    // Item D: Botanical 3D Green Leaf Meshes
    function createLeaf() {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(0.3, 0.45, 0, 0.95);
      shape.quadraticCurveTo(-0.3, 0.45, 0, 0);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.04,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      });
      const mat = new THREE.MeshStandardMaterial({
        color: 0x059669,
        emissive: 0x047857,
        emissiveIntensity: 0.3,
        roughness: 0.35,
        side: THREE.DoubleSide,
      });
      return new THREE.Mesh(geo, mat);
    }
    const leaf1 = createLeaf();
    leaf1.scale.set(1.2, 1.2, 1.2);
    addFloatingItem(leaf1, new THREE.Vector3(-2.1, -1.5, 1.1), { x: 0.01, y: 0.012, z: -0.006 }, 1.8, 2.5);

    const leaf2 = createLeaf();
    leaf2.scale.set(0.9, 0.9, 0.9);
    addFloatingItem(leaf2, new THREE.Vector3(0.5, 2.4, 0.5), { x: -0.01, y: 0.008, z: 0.01 }, 1.5, 4.2);

    // Item E: 3D Torus Knot Möbius Loop Emblem
    const mobiusGeo = new THREE.TorusKnotGeometry(0.38, 0.08, 64, 16, 2, 3);
    const mobiusMat = new THREE.MeshStandardMaterial({
      color: 0x0891b2,
      roughness: 0.2,
      metalness: 0.5,
      emissive: 0x0e7490,
      emissiveIntensity: 0.3,
    });
    addFloatingItem(new THREE.Mesh(mobiusGeo, mobiusMat), new THREE.Vector3(-1.4, 2.0, -0.7), { x: 0.015, y: -0.014, z: 0.008 }, 2.0, 5.0);

    // 4. Bio-Luminescent Sustainability Particle Cloud
    const pCount = 130;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    const pPalette = [
      new THREE.Color(0x059669),
      new THREE.Color(0x0284c7),
      new THREE.Color(0x10b981),
      new THREE.Color(0x0d9488),
    ];

    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      const r = 1.5 + Math.random() * 3.6;
      const th = Math.random() * Math.PI * 2;
      const ph = (Math.random() - 0.5) * Math.PI;
      pPos[i3] = r * Math.cos(ph) * Math.sin(th);
      pPos[i3 + 1] = r * Math.sin(ph);
      pPos[i3 + 2] = r * Math.cos(ph) * Math.cos(th);
      const c = pPalette[Math.floor(Math.random() * pPalette.length)];
      pColors[i3] = c.r;
      pColors[i3 + 1] = c.g;
      pColors[i3 + 2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    masterGroup.add(new THREE.Points(pGeo, pMat));

    // Mouse Parallax & Drag Orbit controls
    let targetMouseX = 0, targetMouseY = 0, mouseX = 0, mouseY = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let dragRotX = 0;
    let dragRotY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const pt = 'touches' in e ? e.touches[0] : e;
      prevPointerX = pt.clientX;
      prevPointerY = pt.clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const pt = 'touches' in e ? e.touches[0] : e;
      if (isDragging) {
        const deltaX = pt.clientX - prevPointerX;
        const deltaY = pt.clientY - prevPointerY;
        dragRotY += deltaX * 0.006;
        dragRotX += deltaY * 0.006;
        prevPointerX = pt.clientX;
        prevPointerY = pt.clientY;
      }

      const rect = container.getBoundingClientRect();
      const x = pt.clientX - rect.left;
      const y = pt.clientY - rect.top;
      targetMouseX = ((x / rect.width) * 2 - 1) * 0.5;
      targetMouseY = (-(y / rect.height) * 2 + 1) * 0.4;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1100;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Render loop
    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      masterGroup.rotation.y = time * 0.15 + mouseX + dragRotY;
      masterGroup.rotation.x = Math.sin(time * 0.2) * 0.05 + mouseY * 0.5 + dragRotX;

      const pulse = 1.0 + Math.sin(time * 2.2) * 0.04;
      coreOrb.scale.set(pulse, pulse, pulse);
      coreOrb.rotation.y = time * 0.3;
      innerRing.rotation.z = -time * 0.4;

      loopGroup.rotation.z = time * 0.2;
      loopGroup.rotation.y = Math.sin(time * 0.15) * 0.2;

      for (let i = 0; i < floatingItems.length; i++) {
        const it = floatingItems[i];
        it.pivot.position.y = it.basePos.y + Math.sin(time * it.floatSpeed + it.phase) * 0.18;
        it.pivot.position.x = it.basePos.x + Math.cos(time * it.floatSpeed * 0.7 + it.phase) * 0.1;
        it.mesh.rotation.x += it.rotSpeed.x;
        it.mesh.rotation.y += it.rotSpeed.y;
        it.mesh.rotation.z += it.rotSpeed.z;
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
