"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import type * as THREE from "three";

interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  fallback?: React.ReactNode;
  overlay?: React.ReactNode;
  priority?: boolean;
}

const emptySubscribe = () => () => {};

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function checkReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SceneCanvas({
  children,
  className = "w-full h-full",
  camera = { position: [0, 0, 5], fov: 45 },
  fallback = null,
  overlay = null,
  priority = false,
}: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [hasWebGL] = useState(checkWebGLSupport);
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(checkReducedMotion);

  useEffect(() => {
    // 1. Reduced motion listener
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // 2. Near-viewport detection to keep active WebGL contexts <= 2
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "150px 0px", threshold: 0 }
    );
    observer.observe(containerRef.current);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      observer.disconnect();

      // Cleanly release hardware context
      if (glRef.current) {
        try {
          const renderer = glRef.current;
          renderer.dispose();
          renderer.forceContextLoss?.();
          const ext = renderer.getContext()?.getExtension("WEBGL_lose_context");
          ext?.loseContext();
        } catch {
          // ignore cleanup errors
        }
        glRef.current = null;
      }
    };
  }, []);

  if (!mounted) {
    return <div ref={containerRef} className={className} />;
  }

  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {fallback}
        {overlay}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {isNearViewport ? (
        <Canvas
          camera={camera}
          dpr={[1, 1.5]}
          onCreated={({ gl }) => {
            glRef.current = gl;
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="pointer-events-auto"
        >
          {children}
        </Canvas>
      ) : (
        fallback
      )}
      {overlay}
    </div>
  );
}
