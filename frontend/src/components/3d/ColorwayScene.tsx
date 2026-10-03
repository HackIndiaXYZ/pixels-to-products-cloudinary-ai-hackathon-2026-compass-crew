"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";

const COLORWAYS = [
  { id: "navy", name: "Navy Classic", hex: "#1d2a4a", path: "/products/sneaker-navy.png" },
  { id: "onyx", name: "Onyx Black", hex: "#15171c", path: "/products/sneaker-onyx.png" },
  { id: "crimson", name: "Crimson Red", hex: "#b3202a", path: "/products/sneaker-crimson.png" },
  { id: "sand", name: "Desert Sand", hex: "#c9a877", path: "/products/sneaker-sand.png" },
];

function Colorway3DContent({ activeIndex }: { activeIndex?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loaded: THREE.Texture[] = [];
    COLORWAYS.forEach((cw, idx) => {
      loader.load(cw.path, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        loaded[idx] = tex;
        if (loaded.filter(Boolean).length === COLORWAYS.length) {
          setTextures([...loaded]);
        }
      });
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.18;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.4) * 0.05;
    }

    let targetIdx = 0;
    if (typeof activeIndex === "number" && activeIndex >= 0) {
      targetIdx = activeIndex % COLORWAYS.length;
    } else {
      targetIdx = Math.floor(state.clock.elapsedTime / 2.5) % COLORWAYS.length;
    }

    if (meshRef.current && textures.length === COLORWAYS.length) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      const targetTex = textures[targetIdx] || textures[0];
      if (mat.map !== targetTex) {
        mat.map = targetTex;
        mat.needsUpdate = true;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-3, -2, -2]} intensity={0.7} color="#c9a227" />
      <pointLight position={[0, 0, 2]} intensity={2} color="#ffffff" distance={6} />

      <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.25}>
        <group ref={groupRef} position={[0, 0, 0]}>
          {/* Constant Product Representation (Identical Geometry Across All Colorways) */}
          <mesh ref={meshRef} position={[0, 0, 0]}>
            <planeGeometry args={[2.5, 1.85]} />
            <meshStandardMaterial
              transparent
              roughness={0.2}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Pedestal Shadow Disc */}
          <mesh position={[0, -0.95, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.2, 32]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.35} />
          </mesh>
        </group>
      </Float>
    </>
  );
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-20 rounded-xl bg-gold/10 border border-gold/30 blur" />
    </div>
  );
}

export default function ColorwayScene({
  className = "w-full h-[180px] md:h-[220px]",
  activeIndex = 0,
}: {
  className?: string;
  activeIndex?: number;
}) {
  const currentCw = COLORWAYS[activeIndex % COLORWAYS.length];

  const overlay = (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2.5">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-gold/40 bg-[#0a0d14]/90 px-2 py-0.5 font-mono text-[8.5px] font-bold text-gold backdrop-blur">
          1 PRODUCT → 4 COLORWAYS
        </span>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0a0d14]/80 px-2 py-0.5 text-[8px] font-mono backdrop-blur">
          <span className="size-2 rounded-full" style={{ backgroundColor: currentCw.hex }} />
          <span className="text-white font-semibold">{currentCw.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <span className="rounded bg-[#0a0d14]/80 px-2 py-0.5 font-mono text-[8px] text-muted-foreground backdrop-blur">
          Identical Stitch &amp; Sole Geometry · Zero Reshooting
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
      <Colorway3DContent activeIndex={activeIndex} />
    </SceneCanvas>
  );
}
