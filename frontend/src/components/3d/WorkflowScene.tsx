"use client";

import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";

// OmniStage 4-Step Core Workflow
const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Upload & AI Analysis",
    sub: "Decomposes sole, stitching, materials",
    x: -2.4,
    color: "#00f2fe",
  },
  {
    step: "02",
    title: "Apply Brand DNA",
    sub: "Locks palette, studio key & contrast",
    x: -0.8,
    color: "#c9a227",
  },
  {
    step: "03",
    title: "Colorways & Formats",
    sub: "Seasonal shades & 4 social crops",
    x: 0.8,
    color: "#a855f7",
  },
  {
    step: "04",
    title: "Cloudinary Sync",
    sub: "Automated global CDN optimization",
    x: 2.4,
    color: "#38bdf8",
  },
];

function WorkflowSceneContent({ onStepHover }: { onStepHover?: (idx: number) => void }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const pulsesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  // Preload authentic product textures
  const textureSneaker = useMemo(() => new THREE.TextureLoader().load("/products/sneaker-navy.png"), []);
  const textureOnyx = useMemo(() => new THREE.TextureLoader().load("/products/sneaker-onyx.png"), []);

  // Traveling pulses between nodes
  const pulseOffsets = useMemo(() => {
    const arr = new Float32Array(24);
    for (let i = 0; i < 24; i++) {
      arr[i] = i / 24;
    }
    return arr;
  }, []);
  const pulsePositions = useMemo(() => new Float32Array(24 * 3), []);

  useFrame((_, delta) => {
    timeRef.current = (timeRef.current + delta * 0.25) % 1;
    const t = timeRef.current;

    const currentStep = Math.min(3, Math.floor(t * 4));
    onStepHover?.(currentStep);

    if (pulsesRef.current) {
      const pos = pulsesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 24; i++) {
        const p = (pulseOffsets[i] + t) % 1;
        pos[i * 3] = -2.4 + p * 4.8;
        pos[i * 3 + 1] = Math.sin(p * Math.PI * 6) * 0.05;
        pos[i * 3 + 2] = 0;
      }
      pulsesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Connection rail lines
  const linePoints = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < WORKFLOW_STEPS.length - 1; i++) {
      pts.push(WORKFLOW_STEPS[i].x, -0.2, 0);
      pts.push(WORKFLOW_STEPS[i + 1].x, -0.2, 0);
    }
    return new Float32Array(pts);
  }, []);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 4, 3]} intensity={1.5} />
      <pointLight position={[0, 1, 2]} intensity={2} color="#c9a227" distance={7} />

      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.15}>
        <group position={[0, 0, 0]}>
          {/* Connecting Rail */}
          <lineSegments ref={lineRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[linePoints, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#334155" linewidth={2} transparent opacity={0.6} />
          </lineSegments>

          {/* Flowing Energy Pulses */}
          <points ref={pulsesRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
            </bufferGeometry>
            <pointsMaterial
              size={0.05}
              color="#c9a227"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
            />
          </points>

          {/* 4 AUTHENTIC WORKFLOW STATIONS */}

          {/* NODE 01: Upload & AI Analysis */}
          <group position={[WORKFLOW_STEPS[0].x, 0, 0]}>
            {/* Base platform */}
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.26, 0.3, 0.08, 24]} />
              <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.4} metalness={0.8} />
            </mesh>
            {/* Raw Product Card */}
            <mesh position={[0, 0.1, 0]}>
              <planeGeometry args={[0.55, 0.42]} />
              <meshBasicMaterial map={textureSneaker} transparent opacity={0.95} />
            </mesh>
            {/* Scanner line */}
            <mesh position={[0, 0.1, 0.02]}>
              <planeGeometry args={[0.58, 0.02]} />
              <meshBasicMaterial color="#00f2fe" transparent opacity={0.85} />
            </mesh>
          </group>

          {/* NODE 02: Apply Brand DNA */}
          <group position={[WORKFLOW_STEPS[1].x, 0, 0]}>
            {/* Base platform */}
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.26, 0.3, 0.08, 24]} />
              <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.5} metalness={0.8} />
            </mesh>
            {/* Dual Intersecting DNA Rings */}
            <mesh position={[0, 0.1, 0]} rotation={[0.4, 0, 0]}>
              <torusGeometry args={[0.26, 0.02, 16, 32]} />
              <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.8} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.1, 0]} rotation={[-0.4, 0.8, 0]}>
              <torusGeometry args={[0.26, 0.02, 16, 32]} />
              <meshStandardMaterial color="#ffffff" emissive="#c9a227" emissiveIntensity={0.5} metalness={0.9} />
            </mesh>
            {/* Golden Core Bead */}
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={1.2} />
            </mesh>
          </group>

          {/* NODE 03: Colorways & Formats */}
          <group position={[WORKFLOW_STEPS[2].x, 0, 0]}>
            {/* Base platform */}
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.26, 0.3, 0.08, 24]} />
              <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} metalness={0.8} />
            </mesh>
            {/* 3 Colorway Swatch Pillars */}
            <mesh position={[-0.14, 0.05, 0]}>
              <boxGeometry args={[0.09, 0.28, 0.09]} />
              <meshStandardMaterial color="#1e3a8a" emissive="#1e3a8a" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.09, 0.38, 0.09]} />
              <meshStandardMaterial color="#171717" emissive="#333333" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0.14, 0.08, 0]}>
              <boxGeometry args={[0.09, 0.32, 0.09]} />
              <meshStandardMaterial color="#991b1b" emissive="#991b1b" emissiveIntensity={0.4} />
            </mesh>
            {/* Wireframe Format Frame */}
            <lineSegments position={[0, 0.12, 0.1]}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.48, 0.48, 0.02)]} />
              <lineBasicMaterial color="#a855f7" transparent opacity={0.7} />
            </lineSegments>
          </group>

          {/* NODE 04: Asset Gallery & Cloudinary Sync */}
          <group position={[WORKFLOW_STEPS[3].x, 0, 0]}>
            {/* Base platform */}
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.26, 0.3, 0.08, 24]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} metalness={0.8} />
            </mesh>
            {/* Cloudinary CDN Hub */}
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.04, 32]} />
              <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.8} />
            </mesh>
            {/* Completed Output Asset Card */}
            <mesh position={[0, 0.18, 0.05]}>
              <planeGeometry args={[0.48, 0.36]} />
              <meshBasicMaterial map={textureOnyx} transparent opacity={0.98} />
            </mesh>
            {/* Sync ring */}
            <mesh position={[0, 0.18, 0]}>
              <ringGeometry args={[0.32, 0.35, 32]} />
              <meshBasicMaterial color="#4ade80" transparent opacity={0.8} side={THREE.DoubleSide} />
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
      <div className="h-0.5 w-2/3 bg-gradient-to-r from-gold to-cyan blur animate-pulse" />
    </div>
  );
}

export default function WorkflowScene({ className = "w-full h-[140px] md:h-[160px]" }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative w-full overflow-hidden">
      <SceneCanvas
        className={className}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        fallback={<Fallback />}
      >
        <WorkflowSceneContent onStepHover={setActiveStep} />
      </SceneCanvas>

      {/* Sleek Workflow Status Ticker */}
      <div className="mt-2 flex items-center justify-between rounded-lg border border-white/10 bg-[#0a0d14]/70 px-3 py-1.5 backdrop-blur font-mono text-[9px] sm:text-[10px]">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-gold animate-pulse" />
          <span className="text-muted-foreground uppercase hidden sm:inline">WORKFLOW:</span>
          <span className="font-bold text-white">
            {WORKFLOW_STEPS[activeStep].step} · {WORKFLOW_STEPS[activeStep].title.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground hidden md:inline text-[9px]">
            {WORKFLOW_STEPS[activeStep].sub}
          </span>
          <div className="flex items-center gap-1">
            {WORKFLOW_STEPS.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`size-2 rounded-full transition-all ${
                  activeStep === idx ? "scale-125 bg-gold" : "bg-white/20 hover:bg-white/40"
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
