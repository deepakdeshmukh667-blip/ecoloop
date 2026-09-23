'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x10b981, 3.5, 50); // Emerald
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 3.0, 50); // Cyan
    pointLight2.position.set(-10, -10, 8);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x6366f1, 2.5, 40); // Indigo
    pointLight3.position.set(0, 12, -5);
    scene.add(pointLight3);

    // Floating 3D Cubes
    const colors = [
      0x10b981, // Emerald
      0x059669, // Forest
      0x06b6d4, // Cyan
      0x3b82f6, // Blue
      0x6366f1, // Indigo
      0x14b8a6, // Teal
      0x8b5cf6, // Purple
    ];

    const cubes: {
      mesh: THREE.Mesh;
      rotSpeed: { x: number; y: number; z: number };
      floatOffset: number;
      floatSpeed: number;
      initialY: number;
      initialX: number;
    }[] = [];

    const cubeCount = 38;
    for (let i = 0; i < cubeCount; i++) {
      const size = 0.35 + Math.random() * 0.95;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const color = colors[Math.floor(Math.random() * colors.length)];

      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.15,
        metalness: 0.2,
        transparent: true,
        opacity: 0.72 + Math.random() * 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Distribute in a soft central cloud like the StockFlow visual
      const radius = 2.5 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const zOffset = (Math.random() - 0.5) * 6;

      mesh.position.x = Math.cos(angle) * radius * 1.4;
      mesh.position.y = Math.sin(angle) * radius * 0.75;
      mesh.position.z = zOffset;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      scene.add(mesh);

      cubes.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.018,
          z: (Math.random() - 0.5) * 0.012,
        },
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.8 + Math.random() * 0.8,
        initialX: mesh.position.x,
        initialY: mesh.position.y,
      });
    }

    // Ambient floating particle points
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 22;
      particlePositions[i + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 2.5;
      targetY = -(y / rect.height) * 2.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(0, 0, 0);

      // Animate cubes
      cubes.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;

        item.mesh.position.y = item.initialY + Math.sin(elapsedTime * item.floatSpeed + item.floatOffset) * 0.45;
        item.mesh.position.x = item.initialX + Math.cos(elapsedTime * (item.floatSpeed * 0.7) + item.floatOffset) * 0.25;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}
