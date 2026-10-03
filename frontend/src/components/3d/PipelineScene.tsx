"use client";

import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";

// OmniStage Media Pipeline Nodes:
// 1. PRODUCT -> 2. AI ANALYSIS -> 3. GENERATION -> 4. FORMAT TRANSFORMATION -> 5. CLOUDINARY DELIVERY
const STAGES = [
  { id: "product", name: "01. RAW PRODUCT", x: -2.8, color: "#94a3b8" },
  { id: "analysis", name: "02. AI VISION", x: -1.4, color: "#00f2fe" },
  { id: "generation", name: "03. GENERATION", x: 0.0, color: "#c9a227" },
  { id: "format", name: "04. 4 FORMATS", x: 1.4, color: "#a855f7" },
  { id: "cloudinary", name: "05. CLOUDINARY", x: 2.8, color: "#38bdf8" },
];

function PipelineSceneContent({ onStageUpdate }: { onStageUpdate?: (stageIdx: number) => void }) {
  const travelingCardRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const lastStageIndex = useRef(0);

  // Preload real product textures
  const textureNavy = useMemo(() => new THREE.TextureLoader().load("/products/sneaker-navy.png"), []);
  const textureOnyx = useMemo(() => new THREE.TextureLoader().load("/products/sneaker-onyx.png"), []);

  // Traveling pulses along the track
  const pulsesRef = useRef<THREE.Points>(null);
  const pulseOffsets = useMemo(() => {
    const arr = new Float32Array(24);
    for (let i = 0; i < 24; i++) {
      arr[i] = (i / 24);
    }
    return arr;
  }, []);
  const pulsePositions = useMemo(() => new Float32Array(24 * 3), []);

  useFrame((_, delta) => {
    timeRef.current = (timeRef.current + delta * 0.3) % 1;
    const t = timeRef.current;

    // Current stage calculation (0 to 4)
    const stageIdx = Math.min(4, Math.floor(t * 5));
    if (stageIdx !== lastStageIndex.current) {
      lastStageIndex.current = stageIdx;
      onStageUpdate?.(stageIdx);
    }

    // Animate traveling product asset card along X from -2.8 to 2.8
    if (travelingCardRef.current) {
      const startX = -2.8;
      const endX = 2.8;
      const x = startX + t * (endX - startX);
      const bob = Math.sin(t * Math.PI * 8) * 0.05;
      travelingCardRef.current.position.set(x, bob, 0.15);

      // Subtle roll as it travels along pipeline
      travelingCardRef.current.rotation.y = Math.sin(t * Math.PI * 4) * 0.15;
    }

    // Update rail pulses
    if (pulsesRef.current) {
      const pos = pulsesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 24; i++) {
        const p = (pulseOffsets[i] + t) % 1;
        pos[i * 3] = -2.8 + p * 5.6;
        pos[i * 3 + 1] = Math.sin(p * Math.PI * 6) * 0.04;
        pos[i * 3 + 2] = 0;
      }
      pulsesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Track lines connecting nodes
  const linePoints = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < STAGES.length - 1; i++) {
      pts.push(STAGES[i].x, -0.4, 0);
      pts.push(STAGES[i + 1].x, -0.4, 0);
    }
    return new Float32Array(pts);
  }, []);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 4, 3]} intensity={1.5} />
      <pointLight position={[0, 1, 2]} intensity={2} color="#00f2fe" distance={7} />

      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.15}>
        <group position={[0, 0.1, 0]}>
          {/* Main Pipeline Rail Line */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[linePoints, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#334155" linewidth={2} transparent opacity={0.6} />
          </lineSegments>

          {/* Traveling Photons */}
          <points ref={pulsesRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
            </bufferGeometry>
            <pointsMaterial
              size={0.06}
              color="#00f2fe"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
            />
          </points>

          {/* 5 Physical Pipeline Processing Stations */}
          {STAGES.map((s, i) => (
            <group key={s.id} position={[s.x, -0.4, 0]}>
              {/* Station Base Ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.22, 0.28, 32]} />
                <meshBasicMaterial color={s.color} transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>

              {/* Station Core Node */}
              <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.15, 0.18, 0.1, 24]} />
                <meshStandardMaterial
                  color={s.color}
                  emissive={s.color}
                  emissiveIntensity={0.8}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>

              {/* Upright Optical Sensor Arch */}
              <mesh position={[0, 0.5, 0]}>
                <torusGeometry args={[0.35, 0.015, 16, 32, Math.PI]} />
                <meshStandardMaterial
                  color={s.color}
                  emissive={s.color}
                  emissiveIntensity={1}
                />
              </mesh>

              {/* Station 4: Multi-format wireframe boxes preview */}
              {i === 3 && (
                <group position={[0, 0.5, 0]}>
                  {/* 1:1 box */}
                  <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(0.35, 0.35, 0.05)]} />
                    <lineBasicMaterial color="#a855f7" transparent opacity={0.7} />
                  </lineSegments>
                  {/* 9:16 vertical box */}
                  <lineSegments position={[0.2, 0, 0.05]}>
                    <edgesGeometry args={[new THREE.BoxGeometry(0.2, 0.45, 0.04)]} />
                    <lineBasicMaterial color="#38bdf8" transparent opacity={0.5} />
                  </lineSegments>
                </group>
              )}

              {/* Station 5: Delivered Asset Output Stack */}
              {i === 4 && (
                <group position={[0, 0.5, 0]}>
                  <mesh position={[-0.15, 0.1, 0.05]}>
                    <planeGeometry args={[0.26, 0.26]} />
                    <meshBasicMaterial map={textureOnyx} transparent opacity={0.9} />
                  </mesh>
                  <mesh position={[0.15, -0.05, 0.1]}>
                    <planeGeometry args={[0.22, 0.36]} />
                    <meshBasicMaterial map={textureOnyx} transparent opacity={0.95} />
                  </mesh>
                  {/* Delivered check halo */}
                  <mesh position={[0, 0, 0]}>
                    <ringGeometry args={[0.42, 0.46, 32]} />
                    <meshBasicMaterial color="#4ade80" transparent opacity={0.8} side={THREE.DoubleSide} />
                  </mesh>
                </group>
              )}
            </group>
          ))}

          {/* ACTIVE TRAVELING PRODUCT ASSET CARD */}
          <group ref={travelingCardRef} position={[-2.8, 0, 0.15]}>
            {/* Card Background Plate */}
            <mesh>
              <planeGeometry args={[0.75, 0.65]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.9}
                roughness={0.1}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Glowing Border Frame */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.76, 0.66, 0.02)]} />
              <lineBasicMaterial color="#00f2fe" transparent opacity={0.9} />
            </lineSegments>

            {/* Product Texture (Changes along the pipeline) */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[0.62, 0.42]} />
              <meshBasicMaterial map={textureNavy} transparent opacity={0.98} />
            </mesh>
          </group>
        </group>
      </Float>
    </>
  );
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-1 w-3/4 rounded bg-gradient-to-r from-gold via-cyan to-emerald-400 blur animate-pulse" />
    </div>
  );
}

export default function PipelineScene({ className = "w-full h-[140px] md:h-[160px]" }: { className?: string }) {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="relative w-full overflow-hidden">
      <SceneCanvas
        className={className}
        camera={{ position: [0, 0.1, 4.2], fov: 42 }}
        fallback={<Fallback />}
      >
        <PipelineSceneContent onStageUpdate={setActiveStage} />
      </SceneCanvas>

      {/* Real-time HTML Pipeline Stage Flow Indicator */}
      <div className="absolute bottom-2 inset-x-2 flex items-center justify-between rounded-lg border border-white/10 bg-[#0a0d14]/90 px-3 py-1.5 backdrop-blur font-mono text-[9px] sm:text-[10px]">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan" />
          </span>
          <span className="text-muted-foreground uppercase hidden sm:inline">PIPELINE:</span>
          <span className="font-bold text-white">{STAGES[activeStage]?.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {STAGES.map((s, idx) => (
            <span
              key={s.id}
              className={`size-1.5 rounded-full transition-all ${
                activeStage === idx ? "bg-cyan scale-125" : "bg-white/20"
              }`}
            />
          ))}
          <span className="ml-1 text-[8.5px] font-semibold text-emerald-400">
            {activeStage === 4 ? "4 ASSETS DELIVERED" : "PROCESSING"}
          </span>
        </div>
      </div>
    </div>
  );
}
