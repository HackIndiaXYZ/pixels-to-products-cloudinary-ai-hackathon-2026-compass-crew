"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";

const SCENE_CONFIGS: Record<
  string,
  {
    ambient: string;
    ambientInt: number;
    lightColor: string;
    lightPos: [number, number, number];
    bgSlabColor: string;
    texturePath: string;
    desc: string;
  }
> = {
  studio: {
    ambient: "#ffffff",
    ambientInt: 1.1,
    lightColor: "#ffffff",
    lightPos: [3, 4, 4],
    bgSlabColor: "#ece8df",
    texturePath: "/products/sneaker-cloud.png",
    desc: "Marble Studio · 45° Key Light",
  },
  luxury: {
    ambient: "#15171c",
    ambientInt: 0.6,
    lightColor: "#c9a227",
    lightPos: [-3, 5, 3],
    bgSlabColor: "#11141c",
    texturePath: "/products/sneaker-onyx.png",
    desc: "Obsidian Marble · Gold Rim",
  },
  urban: {
    ambient: "#0f172a",
    ambientInt: 0.7,
    lightColor: "#00f2fe",
    lightPos: [4, 2, 3],
    bgSlabColor: "#1e293b",
    texturePath: "/products/sneaker-crimson.png",
    desc: "Urban Street · Cool Cyan Ambient",
  },
  minimal: {
    ambient: "#fdf8f0",
    ambientInt: 0.9,
    lightColor: "#c9a877",
    lightPos: [2, 5, 4],
    bgSlabColor: "#c9a877",
    texturePath: "/products/sneaker-sand.png",
    desc: "Travertine Stone · Soft Shadows",
  },
  lifestyle: {
    ambient: "#fff7ed",
    ambientInt: 1.0,
    lightColor: "#f59e0b",
    lightPos: [5, 3, 2],
    bgSlabColor: "#78350f",
    texturePath: "/products/sneaker-sand.png",
    desc: "Golden Hour Sunlight · Warm Glow",
  },
};

function SceneEngine3DContent({ activeScene = "Luxury" }: { activeScene?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const bgSlabRef = useRef<THREE.Mesh>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  const sceneKey = (activeScene || "luxury").toLowerCase();
  const cfg = SCENE_CONFIGS[sceneKey] || SCENE_CONFIGS.luxury;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(cfg.texturePath, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [cfg.texturePath]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }

    if (meshRef.current && texture) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat.map !== texture) {
        mat.map = texture;
        mat.needsUpdate = true;
      }
    }

    if (bgSlabRef.current) {
      const targetColor = new THREE.Color(cfg.bgSlabColor);
      (bgSlabRef.current.material as THREE.MeshStandardMaterial).color.lerp(
        targetColor,
        delta * 3
      );
    }

    if (dirLightRef.current) {
      dirLightRef.current.color.lerp(new THREE.Color(cfg.lightColor), delta * 3);
    }
  });

  return (
    <>
      <ambientLight intensity={cfg.ambientInt} color={cfg.ambient} />
      <directionalLight
        ref={dirLightRef}
        position={cfg.lightPos}
        intensity={2.0}
        color={cfg.lightColor}
      />

      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group ref={groupRef} position={[0, 0, 0]}>
          {/* Dynamic 3D Environment Backdrop Slab */}
          <mesh ref={bgSlabRef} position={[0, 0.05, -0.2]}>
            <boxGeometry args={[3.2, 2.1, 0.08]} />
            <meshStandardMaterial
              color={cfg.bgSlabColor}
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Consistent Product Showcase (Same shoe geometry in every scene) */}
          <mesh ref={meshRef} position={[0, 0.05, 0]}>
            <planeGeometry args={[2.5, 1.85]} />
            <meshStandardMaterial
              transparent
              roughness={0.2}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
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

export default function SceneEngineScene({
  className = "w-full h-[180px] md:h-[220px]",
  activeScene = "Luxury",
}: {
  className?: string;
  activeScene?: string;
}) {
  const sceneKey = (activeScene || "luxury").toLowerCase();
  const cfg = SCENE_CONFIGS[sceneKey] || SCENE_CONFIGS.luxury;

  const overlay = (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2.5">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-gold/40 bg-[#0a0d14]/90 px-2 py-0.5 font-mono text-[8.5px] font-bold text-gold backdrop-blur">
          SAME PRODUCT · 5 SCENES
        </span>
        <span className="rounded border border-white/10 bg-[#0a0d14]/80 px-2 py-0.5 font-mono text-[8px] text-white backdrop-blur">
          {cfg.desc}
        </span>
      </div>

      <div className="flex items-center justify-center">
        <span className="rounded bg-[#0a0d14]/80 px-2 py-0.5 font-mono text-[8px] text-muted-foreground backdrop-blur">
          Consistent Hero Shoe · Adaptive Branded Lighting
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
      <SceneEngine3DContent activeScene={activeScene} />
    </SceneCanvas>
  );
}
