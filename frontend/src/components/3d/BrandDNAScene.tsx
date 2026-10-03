"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";

function BrandDNA3DContent() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/products/sneaker-sand.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }

    if (meshRef.current && texture) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat.map !== texture) {
        mat.map = texture;
        mat.needsUpdate = true;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-3, -2, -2]} intensity={0.8} color="#c9a227" />
      <pointLight position={[0, 0, 2]} intensity={2.2} color="#c9a227" distance={6} />

      <Float speed={1.6} rotationIntensity={0.06} floatIntensity={0.25}>
        <group ref={groupRef} position={[0, 0, 0]}>
          {/* Central 3D Product Showcase Plane */}
          <mesh ref={meshRef} position={[0, 0.05, 0]}>
            <planeGeometry args={[2.4, 1.8]} />
            <meshStandardMaterial
              transparent
              roughness={0.2}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* 3D Glass Framing Slabs */}
          <mesh position={[0, 0.05, -0.05]}>
            <boxGeometry args={[2.5, 1.9, 0.04]} />
            <meshStandardMaterial
              color="#0a0d14"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.4}
            />
          </mesh>

          {/* 3D Brand Rule Frame: Gold Accent Corner Brackets */}
          <mesh position={[0, 0.05, 0.02]}>
            <ringGeometry args={[1.3, 1.33, 4]} />
            <meshBasicMaterial color="#c9a227" transparent opacity={0.6} wireframe />
          </mesh>
        </group>
      </Float>
    </>
  );
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-20 rounded-xl bg-gold/10 border border-gold/30 blur animate-pulse" />
    </div>
  );
}

export default function BrandDNAScene({
  className = "w-full h-[220px] md:h-[260px]",
}: {
  className?: string;
}) {
  const overlay = (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-[#0a0d14]/90 px-2.5 py-0.5 font-mono text-[9px] font-bold text-gold backdrop-blur">
          <span className="size-1.5 rounded-full bg-gold animate-ping" />
          BRAND DNA ENGINE · ACTIVE PROFILE
        </div>
        <span className="rounded border border-white/10 bg-[#0a0d14]/80 px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground">
          STYLING RULES LOCKED
        </span>
      </div>

      {/* 4 Brand DNA Rule Badges */}
      <div className="grid grid-cols-2 gap-2 px-1">
        <div className="flex flex-col gap-1">
          <span className="rounded border border-gold/30 bg-[#0a0d14]/85 px-1.5 py-0.5 font-mono text-[8px] text-white backdrop-blur">
            • Palette: Gold &amp; Navy
          </span>
          <span className="rounded border border-cyan/30 bg-[#0a0d14]/85 px-1.5 py-0.5 font-mono text-[8px] text-cyan backdrop-blur">
            • Lighting: 45° Studio Key
          </span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="rounded border border-gold/30 bg-[#0a0d14]/85 px-1.5 py-0.5 font-mono text-[8px] text-white backdrop-blur">
            • Mood: Minimalist Luxury
          </span>
          <span className="rounded border border-cyan/30 bg-[#0a0d14]/85 px-1.5 py-0.5 font-mono text-[8px] text-cyan backdrop-blur">
            • Zero Aesthetic Drift
          </span>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="flex items-center justify-center">
        <div className="rounded-full border border-white/10 bg-[#0a0d14]/80 px-2.5 py-0.5 font-mono text-[8.5px] text-muted-foreground backdrop-blur">
          PRODUCT + BRAND DNA → CONSISTENT ASSETS
        </div>
      </div>
    </div>
  );

  return (
    <SceneCanvas
      className={className}
      camera={{ position: [0, 0, 3.8], fov: 42 }}
      fallback={<Fallback />}
      overlay={overlay}
    >
      <BrandDNA3DContent />
    </SceneCanvas>
  );
}
