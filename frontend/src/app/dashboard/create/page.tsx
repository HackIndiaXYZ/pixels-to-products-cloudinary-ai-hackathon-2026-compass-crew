"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  WandSparkles,
  Lock,
  Unlock,
  Check,
  Plus,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Zap,
} from "lucide-react";

interface Colorway {
  id: string;
  name: string;
  hex: string;
  image: string;
}

const COLORWAYS: Colorway[] = [
  { id: "onyx", name: "Onyx Black", hex: "#111827", image: "/products/sneaker-onyx.png" },
  { id: "cloud", name: "Cloud White", hex: "#E0E7FF", image: "/products/sneaker-cloud.png" },
  { id: "crimson", name: "Crimson Red", hex: "#881337", image: "/products/sneaker-crimson.png" },
  { id: "sand", name: "Desert Sand", hex: "#D4B996", image: "/products/sneaker-sand.png" },
];

const RATIOS = [
  { id: "1:1", label: "1:1", desc: "Instagram & Shop" },
  { id: "4:5", label: "4:5", desc: "Social Feeds" },
  { id: "9:16", label: "9:16", desc: "Stories & TikTok" },
  { id: "16:9", label: "16:9", desc: "Hero Banners" },
];

const SCENES = [
  { id: "minimal", name: "Minimal", desc: "Clean studio backdrop with subtle floor reflection" },
  { id: "luxury", name: "Luxury", desc: "Travertine marble pedestal with soft warm rim lighting" },
  { id: "urban", name: "Urban", desc: "Architectural concrete setting with ambient daylight" },
  { id: "studio", name: "Studio", desc: "Pure high-key commercial lighting setup" },
];

const PIPELINE_STAGES = [
  "QUEUED",
  "ANALYZING",
  "GENERATING",
  "TRANSFORMING",
  "OPTIMIZING",
  "COMPLETED",
];

export default function CreateStudioPage() {
  const [selectedBrand, setSelectedBrand] = useState("LUXORA");
  const [selectedScene, setSelectedScene] = useState("minimal");
  const [selectedColors, setSelectedColors] = useState<string[]>(["onyx", "cloud", "crimson"]);
  const [selectedRatios, setSelectedRatios] = useState<string[]>(["1:1", "4:5", "9:16", "16:9"]);
  const [previewRatio, setPreviewRatio] = useState<string>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(2); // Mock current step: GENERATING

  // Detail preservation locks
  const [locks, setLocks] = useState({
    logo: true,
    sole: true,
    stitching: true,
    silhouette: true,
  });

  const toggleLock = (key: keyof typeof locks) => {
    setLocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleColor = (id: string) => {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleRatio = (id: string) => {
    setSelectedRatios((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const totalAssets = Math.max(selectedColors.length * selectedRatios.length, 1);

  const handleStartGeneration = () => {
    setIsGenerating(true);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= PIPELINE_STAGES.length) {
        clearInterval(interval);
        setPipelineStep(PIPELINE_STAGES.length - 1);
        setIsGenerating(false);
        return;
      }
      setPipelineStep(step);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Create Studio</h1>
          <p className="text-sm text-muted-foreground">
            Transform a single raw product photo into a full multi-channel asset pack.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs font-semibold text-gold">
            <Sparkles className="size-3.5" />
            <span>AI Preservation Engine Active</span>
          </span>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ── Left Column: Controls (5 cols) ── */}
        <div className="space-y-6 lg:col-span-5">
          {/* Card 1: Source & AI Analysis */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-gold/15 text-xs font-bold text-gold">
                  1
                </span>
                <h2 className="text-sm font-semibold tracking-tight">Source &amp; AI Analysis</h2>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-400">
                Analyzed
              </span>
            </div>

            <div className="mt-4 flex gap-4">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                <Image
                  src="/products/sneaker-navy.png"
                  alt="Aero Low Sneaker Source"
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground">Sneaker</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium text-foreground">Full-grain leather</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Base Color</span>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <span className="size-2.5 rounded-full bg-[#1D2A4A] ring-1 ring-border" />
                    <span>Navy #1D2A4A</span>
                  </div>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Resolution</span>
                  <span className="font-mono text-foreground">3024 × 3024 px</span>
                </div>
              </div>
            </div>

            {/* Preservation Locks */}
            <div className="mt-5 border-t border-border pt-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">Detail Preservation Locks</span>
                <span className="text-[11px] text-muted-foreground">Protects brand identity</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "logo" as const, label: "Logo & branding" },
                  { key: "sole" as const, label: "Sole texture" },
                  { key: "stitching" as const, label: "Stitch lines" },
                  { key: "silhouette" as const, label: "Silhouette" },
                ].map(({ key, label }) => {
                  const locked = locks[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleLock(key)}
                      className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-medium transition-all ${
                        locked
                          ? "border-gold/40 bg-gold/10 text-gold"
                          : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span>{label}</span>
                      {locked ? <Lock className="size-3 shrink-0" /> : <Unlock className="size-3 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Brand DNA & Scene Preset */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-gold/15 text-xs font-bold text-gold">
                  2
                </span>
                <h2 className="text-sm font-semibold tracking-tight">Brand DNA &amp; Scene Preset</h2>
              </div>
            </div>

            {/* Brand Select */}
            <div className="mt-4 space-y-2">
              <label htmlFor="brand-dna-select" className="text-xs font-medium text-foreground">
                Active Brand DNA
              </label>
              <select
                id="brand-dna-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
              >
                <option value="LUXORA">LUXORA — Minimalist Luxury (Gold, Travertine, Warm rim)</option>
                <option value="VANTA">VANTA — Urban Streetwear (Cyan, Concrete, Hard flash)</option>
                <option value="TERRA">TERRA — Earthy Natural (Linen, Sandstone, Golden hour)</option>
              </select>
            </div>

            {/* Scene Presets */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-medium text-foreground">Scene Environment</label>
              <div className="grid grid-cols-2 gap-2">
                {SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => setSelectedScene(scene.id)}
                    className={`rounded-lg border p-2.5 text-left transition-all ${
                      selectedScene === scene.id
                        ? "border-gold/50 bg-gold/10 text-foreground"
                        : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{scene.name}</span>
                      {selectedScene === scene.id && <Check className="size-3 text-gold" />}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
                      {scene.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Colorway Selection */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-gold/15 text-xs font-bold text-gold">
                  3
                </span>
                <h2 className="text-sm font-semibold tracking-tight">Target Colorways</h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {selectedColors.length} selected
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {COLORWAYS.map((cw) => {
                const isSelected = selectedColors.includes(cw.id);
                return (
                  <button
                    key={cw.id}
                    type="button"
                    onClick={() => toggleColor(cw.id)}
                    className={`flex w-full items-center justify-between rounded-lg border p-2.5 transition-all ${
                      isSelected
                        ? "border-gold/40 bg-gold/10 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="size-5 rounded-full border border-background ring-1 ring-border"
                        style={{ backgroundColor: cw.hex }}
                      />
                      <span className="text-xs font-medium">{cw.name}</span>
                    </div>
                    <div
                      className={`flex size-4 items-center justify-center rounded border ${
                        isSelected
                          ? "border-gold bg-gold text-background"
                          : "border-border bg-transparent"
                      }`}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-gold/50 hover:text-foreground"
              >
                <Plus className="size-3.5" />
                <span>Custom HEX / Pantone</span>
              </button>
            </div>
          </div>

          {/* Card 4: Multi-Channel Ratios */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-gold/15 text-xs font-bold text-gold">
                  4
                </span>
                <h2 className="text-sm font-semibold tracking-tight">Output Formats</h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {selectedRatios.length} selected
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {RATIOS.map((ratio) => {
                const isSel = selectedRatios.includes(ratio.id);
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => toggleRatio(ratio.id)}
                    className={`flex items-center justify-between rounded-lg border p-2.5 transition-all ${
                      isSel
                        ? "border-gold/40 bg-gold/10 text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <div>
                      <div className="font-mono text-xs font-semibold">{ratio.id}</div>
                      <div className="text-[10px] text-muted-foreground">{ratio.desc}</div>
                    </div>
                    <div
                      className={`flex size-4 items-center justify-center rounded border ${
                        isSel
                          ? "border-gold bg-gold text-background"
                          : "border-border bg-transparent"
                      }`}
                    >
                      {isSel && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTA */}
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent p-5">
            <button
              type="button"
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-[0_0_28px_rgba(201,162,39,0.45)] transition-all hover:bg-[#d9b43c] disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Processing Pipeline...</span>
                </>
              ) : (
                <>
                  <WandSparkles className="size-4" />
                  <span>Generate {totalAssets} Assets</span>
                </>
              )}
            </button>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Estimated time: ~12s · {totalAssets} credits will be deducted
            </div>
          </div>
        </div>

        {/* ── Right Column: Live Preview & Pipeline (7 cols) ── */}
        <div className="space-y-6 lg:col-span-7">
          {/* Live Preview Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 pb-4 border-b border-border sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">Live Composition Canvas</h2>
                <p className="text-xs text-muted-foreground">
                  Smart framing preview with keypoint lock visualization
                </p>
              </div>

              {/* Ratio Preview Switcher */}
              <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary p-1">
                {RATIOS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setPreviewRatio(r.id)}
                    className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                      previewRatio === r.id
                        ? "bg-background font-semibold text-gold shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Box */}
            <div className="mt-5 flex items-center justify-center rounded-xl border border-border/80 bg-background/80 p-8 bg-grid">
              <div
                className={`relative overflow-hidden rounded-xl border border-white/10 bg-card/60 shadow-2xl transition-all duration-300 flex items-center justify-center ${
                  previewRatio === "1:1"
                    ? "h-[360px] w-[360px]"
                    : previewRatio === "4:5"
                    ? "h-[400px] w-[320px]"
                    : previewRatio === "9:16"
                    ? "h-[420px] w-[236px]"
                    : "h-[240px] w-[420px]"
                }`}
              >
                {/* Product Image */}
                <div className="relative size-full p-6">
                  <Image
                    src="/products/sneaker-navy.png"
                    alt="Canvas Preview"
                    fill
                    sizes="420px"
                    className="object-contain"
                  />
                </div>

                {/* Scanline Effect during generation */}
                {isGenerating && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="animate-scan h-1/4 w-full bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
                  </div>
                )}

                {/* Interactive Keypoint Markers */}
                <div className="pointer-events-none absolute left-[35%] top-[42%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5">
                  <span className="flex size-3.5 items-center justify-center rounded-full border border-gold bg-gold/30">
                    <span className="size-1 rounded-full bg-gold" />
                  </span>
                  <span className="rounded border border-gold/40 bg-background/90 px-1.5 py-0.5 font-mono text-[9px] text-gold">
                    Logo Lock
                  </span>
                </div>

                <div className="pointer-events-none absolute left-[62%] top-[68%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5">
                  <span className="flex size-3.5 items-center justify-center rounded-full border border-cyan bg-cyan/30">
                    <span className="size-1 rounded-full bg-cyan" />
                  </span>
                  <span className="rounded border border-cyan/40 bg-background/90 px-1.5 py-0.5 font-mono text-[9px] text-cyan">
                    Sole Lock
                  </span>
                </div>

                {/* Overlaid Badges */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="rounded-md border border-white/10 bg-background/80 px-2 py-0.5 font-mono text-[10px] text-foreground backdrop-blur-md">
                    {previewRatio}
                  </span>
                  <span className="rounded-md border border-gold/30 bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold backdrop-blur-md">
                    4 Locks Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 6-Stage Media Pipeline Progress */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-gold" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Media Pipeline Track
                </h3>
              </div>
              <span className="font-mono text-xs text-cyan">
                {PIPELINE_STAGES[pipelineStep]}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-6">
              {PIPELINE_STAGES.map((stage, idx) => {
                const isPast = idx < pipelineStep;
                const isCurrent = idx === pipelineStep;
                return (
                  <div
                    key={stage}
                    className={`rounded-lg border p-2 text-center transition-all ${
                      isPast
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : isCurrent
                        ? "border-gold/50 bg-gold/10 text-gold"
                        : "border-border bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isPast ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : isCurrent ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Clock className="size-3.5 opacity-50" />
                      )}
                    </div>
                    <div className="mt-1 font-mono text-[10px] font-semibold">{stage}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Output Queue Preview Grid */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold tracking-tight">Queued Colorway Outputs</h3>
                <p className="text-xs text-muted-foreground">
                  Preview batches waiting for transformation and CDN publishing
                </p>
              </div>
              <Link
                href="/dashboard/gallery"
                className="flex items-center gap-1 text-xs font-medium text-gold hover:underline"
              >
                <span>Open Gallery</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {COLORWAYS.map((cw) => (
                <div
                  key={cw.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-secondary/30 p-2 transition-all hover:border-gold/40"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-background/50">
                    <Image
                      src={cw.image}
                      alt={cw.name}
                      fill
                      sizes="160px"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground truncate">{cw.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">×4</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span
                      className="size-2 rounded-full border border-background ring-1 ring-border"
                      style={{ backgroundColor: cw.hex }}
                    />
                    <span>Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
