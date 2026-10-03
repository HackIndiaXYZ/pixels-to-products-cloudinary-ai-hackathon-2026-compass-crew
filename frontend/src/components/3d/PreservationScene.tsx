"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";

function Preservation3DContent() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const scannerRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/products/sneaker-navy.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.04;
    }

    if (meshRef.current && texture) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat.map !== texture) {
        mat.map = texture;
        mat.needsUpdate = true;
      }
    }

    // Laser scan line sweeps vertically
    if (scannerRef.current) {
      scannerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.2) * 0.9;
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-3, -2, -2]} intensity={0.8} color="#00f2fe" />
      <pointLight position={[0, 0, 2]} intensity={2.5} color="#00f2fe" distance={6} />

      <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.2}>
        <group ref={groupRef} position={[0, 0, 0]}>
          {/* Authentic Sneaker Product Surface */}
          <mesh ref={meshRef} position={[0, 0.05, 0]}>
            <planeGeometry args={[2.5, 1.85]} />
            <meshStandardMaterial
              transparent
              roughness={0.2}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* AI Precision Locking Perimeter Boundary (Not a generic sphere!) */}
          <mesh position={[0, 0.05, 0.02]}>
            <planeGeometry args={[2.56, 1.9]} />
            <meshBasicMaterial
              color="#00f2fe"
              wireframe
              transparent
              opacity={0.4}
            />
          </mesh>

          {/* Sweeping Cyan AI Verification Laser Line */}
          <mesh ref={scannerRef} position={[0, 0, 0.06]}>
            <boxGeometry args={[2.7, 0.025, 0.01]} />
            <meshBasicMaterial color="#00f2fe" transparent opacity={0.85} />
          </mesh>
        </group>
      </Float>
    </>
  );
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-20 rounded-xl bg-cyan/10 border border-cyan/30 blur" />
    </div>
  );
}

export default function PreservationScene({
  className = "w-full h-[180px] md:h-[220px]",
}: {
  className?: string;
}) {
  const overlay = (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2.5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-cyan/40 bg-[#0a0d14]/90 px-2 py-0.5 font-mono text-[8.5px] font-bold text-cyan backdrop-blur">
          AI DETAIL LOCK · 99.8% PIXEL TRUE
        </span>
        <span className="rounded border border-white/10 bg-[#0a0d14]/80 px-2 py-0.5 font-mono text-[8px] text-muted-foreground">
          FIDELITY PROTECTED
        </span>
      </div>

      {/* Physical Anchor Callouts Positioned around the shoe */}
      <div className="grid grid-cols-2 gap-2 px-1">
        <div className="flex flex-col gap-1">
          <span className="rounded border border-cyan/30 bg-[#0a0d14]/85 px-1.5 py-0.5 font-mono text-[8px] text-cyan backdrop-blur">
            🔒 Logo: Exact Placement
          </span>
          <span className="rounded border border-cyan/30 bg-[#0a0d14]/85 px-1.5 py-0.5 font-mono text-[8px] text-cyan backdrop-blur">
            🔒 Stitching: Dual-Seam Preserved
          </span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="rounded border border-cyan/30 bg-[#0a0d14]/85 px-1.5 py-0.5 font-mono text-[8px] text-cyan backdrop-blur">
            🔒 Sole Texture: Diamond Grip
          </span>
          <span className="rounded border border-cyan/30 bg-[#0a0d14]/85 px-1.5 py-0.5 font-mono text-[8px] text-cyan backdrop-blur">
            🔒 Material: Leather Grain True
          </span>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="flex items-center justify-center">
        <span className="rounded bg-[#0a0d14]/80 px-2 py-0.5 font-mono text-[8px] text-muted-foreground backdrop-blur">
          Color &amp; Scene Change · Product Identity Remains Untouched
        </span>
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
      <Preservation3DContent />
    </SceneCanvas>
  );
}
