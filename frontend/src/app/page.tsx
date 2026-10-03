"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const HeroProductScene = dynamic(
  () => import("@/components/3d/HeroProductScene"),
  { ssr: false }
);
const BrandDNAScene = dynamic(
  () => import("@/components/3d/BrandDNAScene"),
  { ssr: false }
);
const ColorwayScene = dynamic(
  () => import("@/components/3d/ColorwayScene"),
  { ssr: false }
);
const PipelineScene = dynamic(
  () => import("@/components/3d/PipelineScene"),
  { ssr: false }
);
const PreservationScene = dynamic(
  () => import("@/components/3d/PreservationScene"),
  { ssr: false }
);
const SceneEngineScene = dynamic(
  () => import("@/components/3d/SceneEngineScene"),
  { ssr: false }
);
const WorkflowScene = dynamic(
  () => import("@/components/3d/WorkflowScene"),
  { ssr: false }
);
import {
  Sparkles,
  ArrowRight,
  Play,
  Upload,
  Lock,
  ScanLine,
  Check,
  X,
  ScanSearch,
  Dna,
  Palette,
  CloudUpload,
  Layers,
  Cloud,
  Sun,
  Menu,
} from "lucide-react";

const COMPARISON_ROWS = [
  {
    id: "colorways",
    category: "Colorways",
    problem: "Manual photoshoot for every single color variant.",
    solution: "Generate every colorway from one hero shot, instantly.",
    stat: "-92% shoot cost",
  },
  {
    id: "backgrounds",
    category: "Backgrounds",
    problem: "Slow, repetitive background removal and retouching.",
    solution: "Scene Engine applies branded lighting and backdrops automatically.",
    stat: "40s per asset",
  },
  {
    id: "fidelity",
    category: "Product fidelity",
    problem: "Generic AI alters logos, stitch lines, and sole texture.",
    solution: "AI Detail Lock preserves logos, sole texture, and stitching pixel-true.",
    stat: "99.8% fidelity",
    highlight: true,
  },
  {
    id: "delivery",
    category: "Delivery",
    problem: "Exporting, resizing, and uploading each format by hand.",
    solution: "Automated Cloudinary CDN delivery with f_auto, q_auto URLs.",
    stat: "4 formats, 1 click",
  },
];

const COLORWAY_PREVIEWS = [
  {
    id: "onyx",
    label: "Onyx Black",
    hex: "#15171c",
    img: "/products/sneaker-onyx.png",
    desc: "Luxury scene render",
  },
  {
    id: "cloud",
    label: "Cloud White",
    hex: "#ece8df",
    img: "/products/sneaker-cloud.png",
    desc: "Marble studio render",
  },
  {
    id: "crimson",
    label: "Crimson Red",
    hex: "#b3202a",
    img: "/products/sneaker-crimson.png",
    desc: "Urban street render",
  },
  {
    id: "sand",
    label: "Desert Sand",
    hex: "#c9a877",
    img: "/products/sneaker-sand.png",
    desc: "Lifestyle golden hour",
  },
];

const SCENE_OPTIONS = [
  { id: "Minimal", img: "/products/sneaker-sand.png" },
  { id: "Luxury", img: "/products/sneaker-onyx.png" },
  { id: "Urban", img: "/products/sneaker-crimson.png" },
  { id: "Studio", img: "/products/sneaker-cloud.png" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeRow, setActiveRow] = useState("fidelity");
  const [comparePosition, setComparePosition] = useState(50);
  const [activeScene, setActiveScene] = useState("Luxury");
  const [featureColorIndex, setFeatureColorIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const activeColor = COLORWAY_PREVIEWS[activeColorIndex];
  const featureColor = COLORWAY_PREVIEWS[featureColorIndex];
  const activeSceneData = SCENE_OPTIONS.find((s) => s.id === activeScene) || SCENE_OPTIONS[1];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0d14] text-[#eef2f7] selection:bg-[#c9a227]/30 selection:text-[#c9a227]">
      {/* ── 1. Navbar ── */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <div className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl px-4 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.8)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="OmniStage AI home">
            <span className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-[#8a6d12] shadow-[0_0_24px_-4px_rgb(201_162_39/0.7)]">
              <Sparkles className="size-4 text-[#0a0d14]" />
            </span>
            <span className="text-base font-bold tracking-tight">
              OmniStage<span className="ml-1 text-gold">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              <li>
                <a
                  href="#features"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#brand-dna"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Brand DNA Engine
                </a>
              </li>
              <li>
                <a
                  href="#showcase"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Showcase
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </nav>

          {/* CTAs */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground glow-gold hover:bg-[#d9b43c] transition-all"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-white/5 lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-3 lg:hidden">
            <ul className="flex flex-col">
              <li>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#brand-dna"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Brand DNA Engine
                </a>
              </li>
              <li>
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Showcase
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Pricing
                </a>
              </li>
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <Link
                href="/login"
                className="flex h-11 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground glow-gold hover:bg-[#d9b43c]"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── 2. Hero Section ── */}
      <section className="relative overflow-hidden pb-20 pt-16 md:pt-24">
        {/* Background glow effects */}
        <div
          aria-hidden="true"
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(201_162_39/0.22),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10%] top-[35%] h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(0_242_254/0.12),transparent)]"
        />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Tag pill */}
            <a
              href="#how-it-works"
              className="glass group inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 font-medium text-gold">
                <Sparkles className="size-3" />
                New
              </span>
              <span className="text-pretty">Powered by AI Vision &amp; Cloudinary Pipeline</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              <span className="hidden text-foreground md:inline">
                Preserve Every Product Detail
              </span>
            </a>

            {/* Main Headline */}
            <h1 className="mt-7 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              One Product Photo.{" "}
              <span className="text-gradient-gold">
                Every Color. Every Format. Every Channel.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Transform a single product image into brand-consistent colorways, studio lighting scenes, and 1:1, 4:5, 9:16, and 16:9 social-ready assets in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/dashboard/create"
                className="group/button inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground glow-gold hover:bg-[#d9b43c] transition-all sm:w-auto"
              >
                Start Generating Free
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#showcase"
                className="group/button glass inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium text-foreground transition-colors hover:bg-white/10 sm:w-auto"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-cyan/15">
                  <Play className="size-2.5 fill-cyan text-cyan" />
                </span>
                Watch 1-Min Demo
              </a>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              10 free credits · No credit card required
            </p>

            {/* 3D Interactive Hero Product Visual with Orbiting Aspect Ratios */}
            <div className="mt-6 w-full max-w-xl">
              <HeroProductScene className="h-[250px] sm:h-[290px] w-full" />
            </div>
          </div>

          {/* ── 3. Product Transformation Showcase Section ── */}
          <div id="showcase" className="relative mt-16 scroll-mt-28 md:mt-20">
            <div className="glass rounded-3xl p-3 shadow-[0_40px_120px_-40px_rgb(201_162_39/0.35)] md:p-4">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,5fr)_auto_minmax(0,9fr)] lg:items-stretch">
                {/* Left Card: Original upload */}
                <div className="relative flex flex-col rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Upload className="size-3.5" />
                      Original upload
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      navy_raw.jpg
                    </span>
                  </div>

                  {/* Sneaker image with scanner and keypoint markers */}
                  <div className="relative mt-3 flex-1 min-h-[260px] overflow-hidden rounded-xl bg-[#e9e9ea]">
                    <Image
                      src="/products/sneaker-navy.png"
                      alt="Original product upload: navy leather sneaker on grey background"
                      width={640}
                      height={640}
                      priority
                      className="h-full w-full object-cover"
                    />
                    {/* Scanner line */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                      <div className="animate-scan h-1/3 w-full bg-gradient-to-b from-transparent via-cyan/25 to-transparent" />
                    </div>

                    {/* Logo Lock point */}
                    <span className="absolute flex items-center gap-1.5 left-[22%] top-[52%]">
                      <span className="relative flex size-3">
                        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-cyan" />
                        <span className="relative size-3 rounded-full border-2 border-background bg-cyan" />
                      </span>
                      <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-cyan backdrop-blur">
                        Logo
                      </span>
                    </span>

                    {/* Sole Lock point */}
                    <span className="absolute flex items-center gap-1.5 left-[58%] top-[70%]">
                      <span className="relative flex size-3">
                        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-cyan" />
                        <span className="relative size-3 rounded-full border-2 border-background bg-cyan" />
                      </span>
                      <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-cyan backdrop-blur">
                        Sole
                      </span>
                    </span>

                    {/* Stitch Lock point */}
                    <span className="absolute flex items-center gap-1.5 left-[44%] top-[38%]">
                      <span className="relative flex size-3">
                        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-cyan" />
                        <span className="relative size-3 rounded-full border-2 border-background bg-cyan" />
                      </span>
                      <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-cyan backdrop-blur">
                        Stitch
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-border bg-white/[0.03] px-2 py-1 text-[11px] text-muted-foreground">
                      Sneaker
                    </span>
                    <span className="rounded-md border border-border bg-white/[0.03] px-2 py-1 text-[11px] text-muted-foreground">
                      Leather
                    </span>
                    <span className="rounded-md border border-border bg-white/[0.03] px-2 py-1 text-[11px] text-muted-foreground">
                      Navy
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-cyan/30 bg-cyan/10 px-2 py-1 text-[11px] text-cyan">
                      <Lock className="size-3" />
                      3 locks
                    </span>
                  </div>
                </div>

                {/* Center arrow */}
                <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
                  <div className="flex size-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold glow-gold">
                    <ArrowRight className="size-4" />
                  </div>
                </div>

                {/* Right Card: Generated multi-channel assets */}
                <div className="flex flex-col rounded-2xl border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <ScanLine className="size-3.5 text-gold" />
                      Generated · {activeColor.label} · {activeScene} scene
                    </span>

                    {/* Colorway Switcher */}
                    <div role="radiogroup" aria-label="Preview colorway" className="flex items-center gap-1.5">
                      {COLORWAY_PREVIEWS.map((cw, i) => (
                        <button
                          key={cw.id}
                          type="button"
                          role="radio"
                          aria-checked={activeColorIndex === i}
                          onClick={() => setActiveColorIndex(i)}
                          aria-label={cw.label}
                          className={`size-6 rounded-full border-2 transition-all ${
                            activeColorIndex === i
                              ? "scale-110 border-gold shadow-[0_0_12px_rgba(201,162,39,0.5)]"
                              : "border-white/15 hover:border-white/40"
                          }`}
                          style={{ backgroundColor: cw.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Multi-ratio mosaic preview */}
                  <div className="mt-3 grid flex-1 grid-cols-[1fr_1fr_0.62fr] grid-rows-[auto_auto] gap-2.5 min-h-[260px]">
                    {/* 16:9 */}
                    <div className="group relative overflow-hidden rounded-xl border border-border aspect-video col-span-2">
                      <Image
                        src={activeColor.img}
                        alt="16:9 Web Banner"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 animate-in fade-in group-hover:scale-105"
                      />
                      <span className="absolute left-2 top-2 rounded-md bg-background/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground backdrop-blur">
                        16:9
                      </span>
                    </div>

                    {/* 9:16 */}
                    <div className="group relative overflow-hidden rounded-xl border border-border min-h-24 row-span-2 self-stretch">
                      <Image
                        src={activeColor.img}
                        alt="9:16 Reels asset"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 animate-in fade-in group-hover:scale-105"
                      />
                      <span className="absolute left-2 top-2 rounded-md bg-background/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground backdrop-blur">
                        9:16
                      </span>
                    </div>

                    {/* 1:1 */}
                    <div className="group relative overflow-hidden rounded-xl border border-border aspect-square">
                      <Image
                        src={activeColor.img}
                        alt="1:1 Marketplace"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 animate-in fade-in group-hover:scale-105"
                      />
                      <span className="absolute left-2 top-2 rounded-md bg-background/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground backdrop-blur">
                        1:1
                      </span>
                    </div>

                    {/* 4:5 */}
                    <div className="group relative overflow-hidden rounded-xl border border-border min-h-24">
                      <Image
                        src={activeColor.img}
                        alt="4:5 Social Feed"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 animate-in fade-in group-hover:scale-105"
                      />
                      <span className="absolute left-2 top-2 rounded-md bg-background/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground backdrop-blur">
                        4:5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formats Footer Legend */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-foreground">1:1</span>
                  Instagram Feed
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-foreground">4:5</span>
                  Meta Ads
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-foreground">9:16</span>
                  Reels · TikTok
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-foreground">16:9</span>
                  YouTube · Web
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. The Old Way vs. OmniStage Comparison ── */}
      <section className="relative py-24" aria-labelledby="problem-heading">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              The old way vs. OmniStage
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            </p>
            <h2 id="problem-heading" className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
              Stop reshooting. Start generating.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground md:text-lg">
              Hover or tap any row to see how OmniStage replaces a broken workflow.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="hidden grid-cols-[160px_1fr_1fr] border-b border-border text-xs font-medium uppercase tracking-wider md:grid">
              <div className="p-5 text-muted-foreground">Workflow</div>
              <div className="border-l border-border p-5 text-[#f25f5c]">Problem</div>
              <div className="border-l border-border bg-gold/[0.04] p-5 text-gold">OmniStage solution</div>
            </div>

            <ul>
              {COMPARISON_ROWS.map((row) => {
                const isActive = activeRow === row.id;
                return (
                  <li key={row.id} className="border-b border-border last:border-b-0">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveRow(row.id)}
                      onMouseEnter={() => setActiveRow(row.id)}
                      className={`grid w-full grid-cols-1 text-left transition-colors md:grid-cols-[160px_1fr_1fr] ${
                        isActive ? "bg-white/[0.02]" : "hover:bg-white/[0.015]"
                      }`}
                    >
                      <div className="px-5 pt-5 text-sm font-semibold md:p-5">
                        {row.category}
                      </div>

                      {/* Problem */}
                      <div className={`flex items-start gap-3 p-5 text-sm transition-opacity md:border-l md:border-border ${
                        isActive ? "text-muted-foreground" : "text-muted-foreground/60"
                      }`}>
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#f25f5c]/10">
                          <X className="size-3 text-[#f25f5c]" />
                        </span>
                        <span>{row.problem}</span>
                      </div>

                      {/* Solution */}
                      <div
                        className={`flex items-start justify-between gap-3 p-5 text-sm transition-all md:border-l md:border-border ${
                          isActive
                            ? "bg-gold/[0.06] text-foreground"
                            : "bg-gold/[0.02] text-foreground/70"
                        }`}
                      >
                        <span className="flex items-start gap-3">
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                            <Check className="size-3 text-gold" />
                          </span>
                          <span>{row.solution}</span>
                        </span>
                        <span
                          className={`hidden shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all lg:inline ${
                            row.highlight
                              ? "border-cyan/40 bg-cyan/10 text-cyan"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {row.stat}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. How It Works Section ── */}
      <section id="how-it-works" className="relative scroll-mt-24 py-24" aria-labelledby="workflow-heading">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              How it works
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            </p>
            <h2 id="workflow-heading" className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
              From raw upload to live CDN in four steps
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground md:text-lg">
              A single pipeline handles analysis, styling, generation, and delivery.
            </p>
          </div>

          {/* 3D Interactive Pipeline Process Nodes */}
          <div className="mx-auto mt-8 max-w-4xl">
            <WorkflowScene className="h-[140px] md:h-[160px] w-full" />
          </div>

          <ol className="relative mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block"
            />

            {/* Step 1 */}
            <li className="glass relative flex flex-col rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="relative flex size-12 items-center justify-center rounded-xl border border-gold/30 bg-background text-gold">
                  <ScanSearch className="size-5" />
                </span>
                <span className="font-mono text-4xl font-bold text-white/[0.06]">01</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">Upload &amp; AI Analysis</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                Automatic detail extraction of category, material, colors, and structural locks.
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">Category</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">Material</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">Colors</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">Locks</span>
              </div>
            </li>

            {/* Step 2 */}
            <li className="glass relative flex flex-col rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="relative flex size-12 items-center justify-center rounded-xl border border-gold/30 bg-background text-gold">
                  <Dna className="size-5" />
                </span>
                <span className="font-mono text-4xl font-bold text-white/[0.06]">02</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">Apply Brand DNA</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                Enforce your brand aesthetic, lighting rules, and custom background moods.
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">Palette</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">Lighting</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">Mood</span>
              </div>
            </li>

            {/* Step 3 */}
            <li className="glass relative flex flex-col rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="relative flex size-12 items-center justify-center rounded-xl border border-gold/30 bg-background text-gold">
                  <Palette className="size-5" />
                </span>
                <span className="font-mono text-4xl font-bold text-white/[0.06]">03</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">Select Colorways &amp; Formats</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                Choose target colors and aspect ratios for every channel you sell on.
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">1:1</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">4:5</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">9:16</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">16:9</span>
              </div>
            </li>

            {/* Step 4 */}
            <li className="glass relative flex flex-col rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="relative flex size-12 items-center justify-center rounded-xl border border-gold/30 bg-background text-gold">
                  <CloudUpload className="size-5" />
                </span>
                <span className="font-mono text-4xl font-bold text-white/[0.06]">04</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">Asset Gallery &amp; Cloudinary Sync</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                One-click download, copy optimized CDN URLs, or bulk export to your stack.
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">f_auto</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">q_auto</span>
                <span className="rounded-md border border-border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">Bulk</span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ── 6. Features Section ── */}
      <section id="features" className="relative scroll-mt-24 py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              Features
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            </p>
            <h2 id="features-heading" className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
              Every asset. On brand. Detail-perfect.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground md:text-lg">
              Drag, tap, and explore what the OmniStage engine does to a single product photo.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-5">
            {/* Feature 1: Detail Preservation Lock (interactive slider) */}
            <article className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
              <div>
                <span className="inline-flex size-9 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
                  <Lock className="size-4" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">Detail Preservation Lock</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Logos, sole texture, and stitch lines stay pixel-true while color and scene change. Drag to compare.
                </p>
              </div>

              {/* 3D AI Preservation Shield & Lock Matrix */}
              <div className="w-full rounded-2xl border border-border bg-[#0a0d14]/50 overflow-hidden">
                <PreservationScene className="h-[150px] md:h-[170px] w-full" />
              </div>

              {/* Interactive Before/After Split */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-[#e9e9ea]">
                {/* Before Image */}
                <Image
                  src="/products/sneaker-navy.png"
                  alt="Before: original navy sneaker"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                {/* After Image with clip */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 0 0 ${comparePosition}%)` }}
                >
                  <Image
                    src="/products/sneaker-onyx.png"
                    alt="After: onyx black sneaker in luxury scene"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Split line */}
                <div
                  className="pointer-events-none absolute inset-y-0 w-px bg-gold"
                  style={{ left: `${comparePosition}%` }}
                  aria-hidden="true"
                >
                  <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-background text-[10px] font-bold text-gold glow-gold">
                    &lt;&gt;
                  </span>
                </div>

                <span className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 text-[11px] font-medium backdrop-blur">
                  Before
                </span>
                <span className="absolute right-3 top-3 rounded-md bg-gold px-2 py-1 text-[11px] font-semibold text-background">
                  After
                </span>

                <label className="sr-only" htmlFor="compare-slider">
                  Before and after comparison position
                </label>
                <input
                  id="compare-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={comparePosition}
                  onChange={(e) => setComparePosition(Number(e.target.value))}
                  className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-xs text-cyan">
                  <Lock className="size-3" /> Logo locked
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-xs text-cyan">
                  <Lock className="size-3" /> Sole texture locked
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.07] px-2.5 py-1 text-xs text-cyan">
                  <Lock className="size-3" /> Stitching locked
                </span>
              </div>
            </article>

            {/* Feature 2: Scene Engine */}
            <article className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-2">
              <div>
                <span className="inline-flex size-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                  <Layers className="size-4" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">Scene Engine</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Switch between curated brand moods with consistent lighting.
                </p>
              </div>

              {/* 3D Floating Environment Cards */}
              <div className="w-full rounded-2xl border border-border bg-[#0a0d14]/50 overflow-hidden">
                <SceneEngineScene className="h-[130px] w-full" activeScene={activeScene} />
              </div>

              <div className="relative flex-1 min-h-48 overflow-hidden rounded-2xl border border-border">
                <Image
                  src={activeSceneData.img}
                  alt={`${activeScene} scene render`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover animate-in fade-in duration-300"
                />
              </div>

              <div role="tablist" aria-label="Scene presets" className="grid grid-cols-4 gap-1 rounded-xl border border-border bg-background/60 p-1">
                {SCENE_OPTIONS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    role="tab"
                    aria-selected={activeScene === sc.id}
                    onClick={() => setActiveScene(sc.id)}
                    className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                      activeScene === sc.id
                        ? "bg-gold text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sc.id}
                  </button>
                ))}
              </div>
            </article>

            {/* Feature 3: Colorway Generator */}
            <article className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-2">
              <div>
                <span className="inline-flex size-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                  <Palette className="size-4" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">Colorway Generator</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  One photo becomes an entire seasonal lineup.
                </p>
              </div>

              {/* 3D Real-time Colorway Transition */}
              <div className="w-full rounded-2xl border border-border bg-[#0a0d14]/50 overflow-hidden">
                <ColorwayScene className="h-[130px] w-full" activeIndex={featureColorIndex} />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {COLORWAY_PREVIEWS.map((cw, i) => (
                  <button
                    key={cw.id}
                    type="button"
                    aria-pressed={featureColorIndex === i}
                    aria-label={cw.label}
                    onClick={() => setFeatureColorIndex(i)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                      featureColorIndex === i
                        ? "border-gold scale-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={cw.img}
                      alt={cw.label}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 p-3">
                <span className="flex items-center gap-2.5 text-sm">
                  <span
                    className="size-5 rounded-full border border-white/20"
                    style={{ backgroundColor: featureColor.hex }}
                  />
                  {featureColor.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {featureColor.hex.toUpperCase()}
                </span>
              </div>
            </article>

            {/* Feature 4: Cloudinary Media Pipeline */}
            <article className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
              <div>
                <span className="inline-flex size-9 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
                  <Cloud className="size-4" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">Cloudinary Media Pipeline</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Every asset is transformed, optimized, and served from a global CDN automatically.
                </p>
              </div>

              {/* 3D Real-time Processing Pipeline */}
              <div className="w-full rounded-2xl border border-border bg-[#0a0d14]/50 overflow-hidden">
                <PipelineScene className="h-[130px] md:h-[150px] w-full" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-background/80 font-mono text-xs">
                <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-white/10" />
                  <span className="size-2.5 rounded-full bg-white/10" />
                  <span className="size-2.5 rounded-full bg-white/10" />
                  <span className="ml-2 text-muted-foreground">delivery.json</span>
                </div>
                <pre className="overflow-x-auto p-4 leading-relaxed text-muted-foreground">
                  <code>
                    <span className="text-foreground">&#123;</span>
                    {"\n"}  <span className="text-cyan">&quot;asset&quot;</span>: <span className="text-gold">&quot;aero-low/onyx_9x16&quot;</span>,
                    {"\n"}  <span className="text-cyan">&quot;transform&quot;</span>: <span className="text-gold">&quot;f_auto,q_auto,ar_9:16&quot;</span>,
                    {"\n"}  <span className="text-cyan">&quot;size_saved&quot;</span>: <span className="text-gold">&quot;-68%&quot;</span>,
                    {"\n"}  <span className="text-cyan">&quot;status&quot;</span>: <span className="text-[#4ade80]">&quot;COMPLETED&quot;</span>
                    {"\n"}<span className="text-foreground">&#125;</span>
                  </code>
                </pre>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-border bg-white/[0.02] p-3">
                  <div className="text-lg font-bold text-foreground">68%</div>
                  <div className="text-[11px] text-muted-foreground">Avg. size saved</div>
                </div>
                <div className="rounded-xl border border-border bg-white/[0.02] p-3">
                  <div className="text-lg font-bold text-foreground">&lt;80ms</div>
                  <div className="text-[11px] text-muted-foreground">Global TTFB</div>
                </div>
                <div className="rounded-xl border border-border bg-white/[0.02] p-3">
                  <div className="text-lg font-bold text-foreground">4</div>
                  <div className="text-[11px] text-muted-foreground">Formats per run</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── 7. Brand DNA Engine Section ── */}
      <section id="brand-dna" className="relative scroll-mt-24 py-24" aria-labelledby="dna-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <Dna className="size-4" />
              Brand DNA Engine
            </p>
            <h2 id="dna-heading" className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
              Your art director, encoded.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground md:text-lg">
              Save your aesthetic once — palettes, lighting rules, background moods — and every generation inherits it. No drift, no off-brand assets, across every team member and channel.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                  <Check className="size-3 text-gold" />
                </span>
                Palette locked to Gold #C9A227 &amp; Navy #1D2A4A
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                  <Check className="size-3 text-gold" />
                </span>
                Soft studio key light at 45°, warm rim
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                  <Check className="size-3 text-gold" />
                </span>
                Backgrounds: velvet, travertine, charcoal
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                  <Check className="size-3 text-gold" />
                </span>
                Shadow softness 0.7 · Contrast +12
              </li>
            </ul>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgb(201_162_39/0.18),transparent)]"
            />
            <div className="glass relative rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Active profile</p>
                  <p className="mt-0.5 font-semibold">LUXORA — Minimalist Luxury</p>
                </div>
                <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold">
                  Default
                </span>
              </div>

              {/* 3D Brand DNA Core & Orbiting Palette Elements */}
              <div className="w-full my-3 rounded-2xl border border-border bg-[#0a0d14]/50 overflow-hidden">
                <BrandDNAScene className="h-[180px] md:h-[210px] w-full" />
              </div>

              {/* Swatches */}
              <div className="mt-5 grid grid-cols-5 gap-2">
                {[
                  { hex: "#C9A227" },
                  { hex: "#1D2A4A" },
                  { hex: "#0A0D14" },
                  { hex: "#ECE8DF" },
                  { hex: "#8A99AD" },
                ].map((s) => (
                  <div key={s.hex} className="flex flex-col gap-1.5">
                    <span
                      className="aspect-square rounded-xl border border-white/10"
                      style={{ backgroundColor: s.hex }}
                    />
                    <span className="text-center font-mono text-[10px] text-muted-foreground">
                      {s.hex}
                    </span>
                  </div>
                ))}
              </div>

              {/* Product thumbnails */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
                  <Image
                    src="/products/sneaker-sand.png"
                    alt="Sneaker Sand"
                    fill
                    sizes="(max-width: 768px) 33vw, 15vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
                  <Image
                    src="/products/watch.png"
                    alt="Watch"
                    fill
                    sizes="(max-width: 768px) 33vw, 15vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
                  <Image
                    src="/products/handbag.png"
                    alt="Handbag"
                    fill
                    sizes="(max-width: 768px) 33vw, 15vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Lighting bar */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
                <Sun className="size-4 text-gold" />
                <span className="text-sm">Soft Studio Lighting</span>
                <div className="ml-auto h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-gold to-cyan" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Pricing Section ── */}
      <section id="pricing" className="relative scroll-mt-24 py-24" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
              Pricing
              <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            </p>
            <h2 id="pricing-heading" className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
              Simple pricing that scales with your catalog
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground md:text-lg">
              Start free. Upgrade when your brand is ready for unlimited output.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {/* Starter */}
            <article className="glass relative flex flex-col rounded-3xl p-7">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Starter</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">$0</span>
                <span className="text-sm text-muted-foreground">forever</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Test the pipeline on your catalog.</p>

              <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-border pt-7">
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                  10 generation credits
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                  All 4 aspect ratios
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                  Detail Preservation Lock
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                  Watermark-free downloads
                </li>
              </ul>

              <Link
                href="/dashboard"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background text-sm font-medium hover:bg-muted hover:text-foreground transition-all"
              >
                Start Free
              </Link>
            </article>

            {/* Pro */}
            <article className="relative flex flex-col rounded-3xl p-7 border border-gold/50 bg-[linear-gradient(180deg,rgb(201_162_39/0.12),rgb(20_26_38/0.9)_45%)] shadow-[0_30px_80px_-30px_rgb(201_162_39/0.45)]">
              <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-background">
                Most popular
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pro</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">$49</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">For growing DTC brands shipping weekly.</p>

              <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-border pt-7">
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  Unlimited AI generations
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  Brand DNA presets
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  Scene Engine — all moods
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  Cloudinary CDN delivery
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  Bulk export &amp; URL copy
                </li>
              </ul>

              <Link
                href="/dashboard"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground glow-gold hover:bg-[#d9b43c] transition-all"
              >
                Start 14-day Trial
              </Link>
            </article>

            {/* Enterprise */}
            <article className="glass relative flex flex-col rounded-3xl p-7">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Enterprise</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">Custom</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">For marketplaces and global retailers.</p>

              <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-border pt-7">
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                  Custom REST &amp; webhook API
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                  Dedicated CDN &amp; SLA
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                  SSO &amp; team roles
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
                  Private model fine-tuning
                </li>
              </ul>

              <Link
                href="/dashboard"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background text-sm font-medium hover:bg-muted hover:text-foreground transition-all"
              >
                Talk to Sales
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ── 9. Footer ── */}
      <footer className="relative border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
            <div>
              <Link href="/" className="flex items-center gap-2.5" aria-label="OmniStage AI home">
                <span className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-[#8a6d12] shadow-[0_0_24px_-4px_rgb(201_162_39/0.7)]">
                  <Sparkles className="size-4 text-[#0a0d14]" />
                </span>
                <span className="text-base font-bold tracking-tight">
                  OmniStage<span className="ml-1 text-gold">AI</span>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                AI-powered product media generation for modern e-commerce teams.
              </p>

              <form onSubmit={handleSubscribe} className="mt-6 max-w-sm">
                <label htmlFor="newsletter" className="text-sm font-medium">
                  Product updates, monthly
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="newsletter"
                    type="email"
                    required
                    placeholder="you@brand.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground glow-gold hover:bg-[#d9b43c] transition-all"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
                {newsletterSubscribed && (
                  <p className="mt-2 text-xs text-cyan">Thanks for subscribing!</p>
                )}
              </form>

              <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#3448c5]/20 text-[#7b8cff]">
                  <Cloud className="size-4" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                    Technology Partner
                  </span>
                  <span className="text-sm font-semibold">Cloudinary</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <nav aria-label="Product">
                <h3 className="text-sm font-semibold">Product</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  <li><a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Colorway Generator</a></li>
                  <li><a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Scene Engine</a></li>
                  <li><a href="#brand-dna" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Brand DNA</a></li>
                  <li><a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Media Pipeline</a></li>
                  <li><a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a></li>
                </ul>
              </nav>
              <nav aria-label="Developers">
                <h3 className="text-sm font-semibold">Developers</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Documentation</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">API Reference</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Webhooks</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Status</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Changelog</a></li>
                </ul>
              </nav>
              <nav aria-label="Company">
                <h3 className="text-sm font-semibold">Company</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Customers</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Careers</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</a></li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <p>© 2026 OmniStage AI, Inc. All rights reserved.</p>
            <ul className="flex gap-5">
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
              <li><a href="#" className="hover:text-foreground">Security</a></li>
              <li><a href="#" className="hover:text-foreground">Cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
