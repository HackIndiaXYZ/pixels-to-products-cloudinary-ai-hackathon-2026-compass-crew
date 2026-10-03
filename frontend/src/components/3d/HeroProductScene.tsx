"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";

const PRODUCT_TEXTURES = [
  { id: "navy", name: "Navy Classic (Raw)", path: "/products/sneaker-navy.png", hex: "#1d2a4a" },
  { id: "onyx", name: "Onyx Black", path: "/products/sneaker-onyx.png", hex: "#15171c" },
  { id: "crimson", name: "Crimson Red", path: "/products/sneaker-crimson.png", hex: "#b3202a" },
  { id: "sand", name: "Desert Sand", path: "/products/sneaker-sand.png", hex: "#c9a877" },
];

const STAGES = [
  { id: "scan", title: "AI Vision Analysis", badge: "01. DETAIL SCAN & LOCKS" },
  { id: "colorways", title: "Neural Colorway Synthesis", badge: "02. 4 SEASONAL COLORS" },
  { id: "formats", title: "Multi-Format Auto-Framing", badge: "03. 1:1 · 4:5 · 9:16 · 16:9" },
  { id: "delivery", title: "Cloudinary CDN Delivery", badge: "04. LIVE ASSET DISPATCH" },
];

function HeroStage3D({
  activeStageIndex,
  activeColorIndex,
}: {
  activeStageIndex: number;
  activeColorIndex: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Mesh>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loaded: THREE.Texture[] = [];
    PRODUCT_TEXTURES.forEach((p, idx) => {
      loader.load(p.path, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        loaded[idx] = tex;
        if (loaded.filter(Boolean).length === PRODUCT_TEXTURES.length) {
          setTextures([...loaded]);
        }
      });
    });
  }, []);

  useFrame((state, delta) => {
    const { pointer } = state;

    // Smooth subtle parallax follow
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        pointer.x * 0.35 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08,
        2.5,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        -pointer.y * 0.2,
        2.5,
        delta
      );
    }

    // AI Scanner Laser beam oscillation
    if (scannerRef.current) {
      scannerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * 1.0;
    }

    // Update active texture on mesh
    if (meshRef.current && textures.length === PRODUCT_TEXTURES.length) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      const targetTex = textures[activeColorIndex] || textures[0];
      if (mat.map !== targetTex) {
        mat.map = targetTex;
        mat.needsUpdate = true;
      }
    }
  });

  const isScanning = activeStageIndex === 0;
  const isFraming = activeStageIndex === 2;
  const isDelivery = activeStageIndex === 3;

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#c9a227" />
      <pointLight position={[0, -2, 2]} intensity={2.5} color="#00f2fe" distance={7} />

      <group ref={groupRef} position={[0, 0, 0]}>
        <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.3}>
          {/* 3D Pedestal Base */}
          <mesh position={[0, -1.25, 0]}>
            <cylinderGeometry args={[1.7, 1.8, 0.12, 48]} />
            <meshStandardMaterial
              color="#0d131f"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          {/* Pedestal Halo Ring */}
          <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.72, 1.76, 48]} />
            <meshBasicMaterial
              color={isScanning ? "#00f2fe" : "#c9a227"}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Central Product Showcase Card Plane (Texture Mapped with Real Sneaker) */}
          <mesh ref={meshRef} position={[0, 0.05, 0]}>
            <planeGeometry args={[2.8, 2.1]} />
            <meshStandardMaterial
              transparent
              roughness={0.2}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Subtle 3D Glass Framing Panel Behind Product */}
          <mesh position={[0, 0.05, -0.06]}>
            <boxGeometry args={[2.9, 2.2, 0.04]} />
            <meshStandardMaterial
              color="#0a0d14"
              transparent
              opacity={0.4}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* AI Laser Scanner Beam (Active during Scan stage) */}
          {isScanning && (
            <mesh ref={scannerRef} position={[0, 0, 0.12]}>
              <boxGeometry args={[3.0, 0.03, 0.02]} />
              <meshBasicMaterial color="#00f2fe" transparent opacity={0.85} />
            </mesh>
          )}

          {/* Multi-Format 3D Aspect Ratio Wireframe Boxes (Active during Framing / Delivery) */}
          {(isFraming || isDelivery) && (
            <group position={[0, 0.05, 0]}>
              {/* 1:1 Square Frame */}
              <mesh position={[-1.6, 0.6, 0.2]}>
                <boxGeometry args={[0.9, 0.9, 0.02]} />
                <meshStandardMaterial
                  color="#c9a227"
                  wireframe
                  emissive="#c9a227"
                  emissiveIntensity={0.6}
                />
              </mesh>

              {/* 4:5 Portrait Frame */}
              <mesh position={[1.6, 0.6, 0.2]}>
                <boxGeometry args={[0.76, 0.95, 0.02]} />
                <meshStandardMaterial
                  color="#00f2fe"
                  wireframe
                  emissive="#00f2fe"
                  emissiveIntensity={0.6}
                />
              </mesh>

              {/* 9:16 Reel Frame */}
              <mesh position={[1.6, -0.6, 0.2]}>
                <boxGeometry args={[0.54, 0.96, 0.02]} />
                <meshStandardMaterial
                  color="#c9a227"
                  wireframe
                  emissive="#c9a227"
                  emissiveIntensity={0.6}
                />
              </mesh>

              {/* 16:9 Banner Frame */}
              <mesh position={[-1.6, -0.6, 0.2]}>
                <boxGeometry args={[1.1, 0.62, 0.02]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  wireframe
                  emissive="#38bdf8"
                  emissiveIntensity={0.6}
                />
              </mesh>
            </group>
          )}
        </Float>
      </group>
    </>
  );
}

// Fallback for non-WebGL / low-power devices
function HeroFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="h-48 w-64 rounded-2xl border border-gold/30 bg-[#0a0d14]/80 p-4 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between text-xs text-gold">
          <span>AI Vision Active</span>
          <span>99.8% Fidelity</span>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold">1 Product Photo</p>
          <p className="mt-1 text-xs text-muted-foreground">Every Color · Every Format</p>
        </div>
      </div>
    </div>
  );
}

export default function HeroProductScene({
  className = "w-full h-[320px] sm:h-[380px] md:h-[420px]",
}: {
  className?: string;
}) {
  const [activeStage, setActiveStage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);

  // Synchronized Workflow State Machine (Cycles smoothly every 14 seconds)
  useEffect(() => {
    const stageTimer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 3500);

    const colorTimer = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % PRODUCT_TEXTURES.length);
    }, 2000);

    return () => {
      clearInterval(stageTimer);
      clearInterval(colorTimer);
    };
  }, []);

  const currentStage = STAGES[activeStage];
  const currentColor = PRODUCT_TEXTURES[activeColor];

  // HTML Overlay that synchronizes with the 3D scene (Zero unmount conflicts)
  const overlay = (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-4">
      {/* Top Header: Active Workflow Step */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0d14]/85 px-3 py-1 shadow-lg backdrop-blur">
          <span className="size-2 rounded-full bg-cyan animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs font-bold text-white">
            {currentStage.badge}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full border border-gold/30 bg-[#0a0d14]/85 px-2.5 py-1 text-[10px] font-mono text-gold backdrop-blur">
          <span>ACTIVE COLOR:</span>
          <span className="size-2 rounded-full" style={{ backgroundColor: currentColor.hex }} />
          <span className="font-bold text-white">{currentColor.name}</span>
        </div>
      </div>

      {/* Middle Floating Product Attribute Locks (Active in scanning/analysis phase) */}
      <div className="flex justify-between items-center px-1 sm:px-6">
        <div className="flex flex-col gap-1.5">
          <span className="rounded border border-cyan/30 bg-[#0a0d14]/85 px-2 py-0.5 font-mono text-[9px] text-cyan backdrop-blur">
            • Logo: Locked 99.8%
          </span>
          <span className="rounded border border-cyan/30 bg-[#0a0d14]/85 px-2 py-0.5 font-mono text-[9px] text-cyan backdrop-blur">
            • Material: Italian Leather
          </span>
        </div>

        <div className="flex flex-col gap-1.5 items-end">
          <span className="rounded border border-gold/30 bg-[#0a0d14]/85 px-2 py-0.5 font-mono text-[9px] text-gold backdrop-blur">
            • Sole Texture: Diamond Grip
          </span>
          <span className="rounded border border-gold/30 bg-[#0a0d14]/85 px-2 py-0.5 font-mono text-[9px] text-gold backdrop-blur">
            • Stitching: Dual Seam
          </span>
        </div>
      </div>

      {/* Bottom Stage Progress Bar */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {STAGES.map((s, idx) => (
            <div
              key={s.id}
              className={`h-1 rounded-full transition-all duration-500 ${
                activeStage === idx
                  ? "w-8 sm:w-12 bg-gradient-to-r from-gold to-cyan"
                  : "w-3 sm:w-4 bg-white/20"
              }`}
            />
          ))}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground text-center">
          Watch OmniStage transform 1 product photo into a full media library
        </p>
      </div>
    </div>
  );

  return (
    <SceneCanvas
      className={className}
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      fallback={<HeroFallback />}
      overlay={overlay}
      priority={true}
    >
      <HeroStage3D
        activeStageIndex={activeStage}
        activeColorIndex={activeColor}
      />
    </SceneCanvas>
  );
}
