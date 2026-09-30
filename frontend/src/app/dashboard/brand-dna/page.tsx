"use client";

import { useState } from "react";
import {
  Dna,
  Plus,
  Sparkles,
  Check,
  Sun,
  Layers,
} from "lucide-react";

interface BrandProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  isActive: boolean;
  colors: { label: string; hex: string }[];
  lighting: string;
  materials: string[];
  mood: string[];
}

const BRAND_PROFILES: BrandProfile[] = [
  {
    id: "luxora",
    name: "LUXORA",
    tagline: "Minimalist Luxury",
    description:
      "High-end editorial compositions with deep contrast, premium metallic accents, and refined studio lighting.",
    isActive: true,
    colors: [
      { label: "Gold", hex: "#C9A227" },
      { label: "Deep Navy", hex: "#1D2A4A" },
      { label: "Onyx", hex: "#0A0D14" },
      { label: "Alabaster", hex: "#ECE8DF" },
    ],
    lighting: "Soft studio key light with 3200K warm rim illumination",
    materials: ["Travertine Marble", "Charcoal Slate", "Brushed Bronze", "Matte Velvet"],
    mood: ["Refined", "Timeless", "Exclusive", "Architectural"],
  },
  {
    id: "vanta",
    name: "VANTA",
    tagline: "Urban Streetwear",
    description:
      "High-energy dynamic product setups with sharp contrast, aggressive shadows, and neon light leakage.",
    isActive: false,
    colors: [
      { label: "Electric Cyan", hex: "#00F2FE" },
      { label: "Carbon Black", hex: "#15171C" },
      { label: "Crimson Drop", hex: "#B3202A" },
      { label: "Strobe White", hex: "#F4F4F5" },
    ],
    lighting: "Hard overhead flash with cyan side-fill and specular highlights",
    materials: ["Raw Concrete", "Wet Asphalt", "Chain-Link Mesh", "Industrial Steel"],
    mood: ["Edgy", "Fast", "Industrial", "Uncompromising"],
  },
  {
    id: "terra",
    name: "TERRA",
    tagline: "Earthy Natural",
    description:
      "Warm tactile backdrops celebrating raw organic textures, natural fibers, and diffused sunlight.",
    isActive: false,
    colors: [
      { label: "Desert Sand", hex: "#C9A877" },
      { label: "Sage Olive", hex: "#6B7F5E" },
      { label: "Terracotta", hex: "#3E2F23" },
      { label: "Raw Linen", hex: "#EFE9DD" },
    ],
    lighting: "Diffused golden hour directional sunlight through sheer fabric",
    materials: ["Sandstone Slabs", "Handwoven Linen", "Mossy Rock", "Natural Clay"],
    mood: ["Organic", "Grounded", "Mindful", "Tactile"],
  },
];

export default function BrandDnaPage() {
  const [profiles, setProfiles] = useState<BrandProfile[]>(BRAND_PROFILES);

  const setActiveProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === id,
      }))
    );
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Brand DNA Engine</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enforce visual consistency across all AI-generated assets with custom color palettes, lighting rules, and material definitions.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(201,162,39,0.35)] transition-all hover:bg-[#d9b43c]"
        >
          <Plus className="size-4" />
          <span>New Brand DNA</span>
        </button>
      </div>

      {/* ── Active DNA Highlight Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gold/20 text-gold shadow-inner">
              <Dna className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  Active Brand: LUXORA
                </h3>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-400">
                  Live in Generation Engine
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                All upcoming product uploads will inherit the LUXORA colorway guidelines and Travertine marble lighting rules automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">420 assets generated with this DNA</span>
          </div>
        </div>
      </div>

      {/* ── Brand DNA Profiles Grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 ${
              profile.isActive
                ? "border-gold shadow-[0_0_32px_rgba(201,162,39,0.15)] ring-1 ring-gold"
                : "border-border hover:border-white/20"
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      {profile.name}
                    </h3>
                    {profile.isActive && (
                      <span className="rounded-full border border-gold/40 bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-gold">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-gold">{profile.tagline}</p>
                </div>

                <div
                  className="size-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                  style={{
                    backgroundColor: profile.colors[0].hex,
                    color: profile.id === "vanta" ? "#000" : "#fff",
                  }}
                >
                  {profile.name[0]}
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {profile.description}
              </p>

              {/* Color Palette */}
              <div className="mt-5 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Color DNA
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {profile.colors.map((c) => (
                    <div key={c.label} className="group/swatch text-center">
                      <div
                        className="h-10 w-full rounded-lg border border-border shadow-inner transition-transform group-hover/swatch:scale-105"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.label} (${c.hex})`}
                      />
                      <div className="mt-1 truncate font-mono text-[9px] text-muted-foreground">
                        {c.hex}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lighting Rules */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sun className="size-3 text-gold" />
                  <span>Lighting Profile</span>
                </div>
                <p className="rounded-lg border border-border bg-secondary/40 p-2.5 text-xs text-foreground">
                  {profile.lighting}
                </p>
              </div>

              {/* Materials */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Layers className="size-3 text-cyan" />
                  <span>Approved Textures</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.materials.map((mat) => (
                    <span
                      key={mat}
                      className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mood Tags */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="size-3 text-purple-400" />
                  <span>Mood &amp; Tone</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {profile.mood.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      #{m.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 border-t border-border pt-4">
              {profile.isActive ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Check className="size-3.5" />
                    <span>Selected Workspace Profile</span>
                  </span>
                  <button
                    type="button"
                    className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Edit Rules
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveProfile(profile.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/80 py-2 text-xs font-semibold text-foreground transition-all hover:border-gold/40 hover:bg-secondary"
                >
                  <Dna className="size-3.5 text-gold" />
                  <span>Activate Profile</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
