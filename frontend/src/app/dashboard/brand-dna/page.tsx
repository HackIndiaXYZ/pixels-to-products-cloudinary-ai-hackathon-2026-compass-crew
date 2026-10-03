"use client";

import { useEffect, useState } from "react";
import {
  Dna,
  Plus,
  Sparkles,
  Check,
  Sun,
  Layers,
  X,
  Loader2,
} from "lucide-react";
import { api, Brand } from "@/lib/api";

interface ExtendedBrand extends Brand {
  tagline?: string;
  description?: string;
  isActive?: boolean;
  colors?: { label: string; hex: string }[];
  materials?: string[];
  mood?: string[];
}

const DEFAULT_BRANDS: ExtendedBrand[] = [
  {
    id: "luxora",
    user_id: "",
    brand_name: "LUXORA",
    tagline: "Minimalist Luxury",
    description:
      "High-end editorial compositions with deep contrast, premium metallic accents, and refined studio lighting.",
    isActive: true,
    primary_color: "#C9A227",
    secondary_color: "#1D2A4A",
    colors: [
      { label: "Gold", hex: "#C9A227" },
      { label: "Deep Navy", hex: "#1D2A4A" },
      { label: "Onyx", hex: "#0A0D14" },
      { label: "Alabaster", hex: "#ECE8DF" },
    ],
    lighting: "Soft studio key light with 3200K warm rim illumination",
    materials: ["Travertine Marble", "Charcoal Slate", "Brushed Bronze", "Matte Velvet"],
    mood: ["Refined", "Timeless", "Exclusive", "Architectural"],
    created_at: new Date().toISOString(),
  },
  {
    id: "vanta",
    user_id: "",
    brand_name: "VANTA",
    tagline: "Urban Streetwear",
    description:
      "High-energy dynamic product setups with sharp contrast, aggressive shadows, and neon light leakage.",
    isActive: false,
    primary_color: "#00F2FE",
    secondary_color: "#15171C",
    colors: [
      { label: "Electric Cyan", hex: "#00F2FE" },
      { label: "Carbon Black", hex: "#15171C" },
      { label: "Crimson Drop", hex: "#B3202A" },
      { label: "Strobe White", hex: "#F4F4F5" },
    ],
    lighting: "Hard overhead flash with cyan side-fill and specular highlights",
    materials: ["Raw Concrete", "Wet Asphalt", "Chain-Link Mesh", "Industrial Steel"],
    mood: ["Edgy", "Fast", "Industrial", "Uncompromising"],
    created_at: new Date().toISOString(),
  },
  {
    id: "terra",
    user_id: "",
    brand_name: "TERRA",
    tagline: "Earthy Natural",
    description:
      "Warm tactile backdrops celebrating raw organic textures, natural fibers, and diffused sunlight.",
    isActive: false,
    primary_color: "#C9A877",
    secondary_color: "#3E2F23",
    colors: [
      { label: "Desert Sand", hex: "#C9A877" },
      { label: "Sage Olive", hex: "#6B7F5E" },
      { label: "Terracotta", hex: "#3E2F23" },
      { label: "Raw Linen", hex: "#EFE9DD" },
    ],
    lighting: "Diffused golden hour directional sunlight through sheer fabric",
    materials: ["Sandstone Slabs", "Handwoven Linen", "Mossy Rock", "Natural Clay"],
    mood: ["Organic", "Grounded", "Mindful", "Tactile"],
    created_at: new Date().toISOString(),
  },
];

export default function BrandDnaPage() {
  const [profiles, setProfiles] = useState<ExtendedBrand[]>(DEFAULT_BRANDS);
  const [activeBrandName, setActiveBrandName] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("omnistage_active_brand") || "LUXORA"
      : "LUXORA"
  );

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ExtendedBrand | null>(null);
  const [formName, setFormName] = useState("");
  const [formAesthetic, setFormAesthetic] = useState("");
  const [formLighting, setFormLighting] = useState("");
  const [formBackground, setFormBackground] = useState("");
  const [formPrimaryColor, setFormPrimaryColor] = useState("#C9A227");
  const [formSecondaryColor, setFormSecondaryColor] = useState("#1D2A4A");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadBrands() {
      try {
        const fetched = await api.getBrands();
        if (fetched.length > 0) {
          const storedActive = typeof window !== "undefined" ? localStorage.getItem("omnistage_active_brand") : "LUXORA";
          const mapped: ExtendedBrand[] = fetched.map((b) => {
            const fallback = DEFAULT_BRANDS.find((d) => d.brand_name.toLowerCase() === b.brand_name.toLowerCase());
            return {
              ...b,
              tagline: b.aesthetic || fallback?.tagline || "Custom Aesthetic",
              description: fallback?.description || `Custom visual identity and lighting rules for ${b.brand_name}.`,
              isActive: b.brand_name === (storedActive || "LUXORA"),
              colors: fallback?.colors || [
                { label: "Primary", hex: b.primary_color || "#C9A227" },
                { label: "Secondary", hex: b.secondary_color || "#1D2A4A" },
                { label: "Neutral", hex: "#ECE8DF" },
                { label: "Dark", hex: "#0A0D14" },
              ],
              lighting: b.lighting || fallback?.lighting || "Precision studio directional lighting",
              materials: fallback?.materials || ["Brushed Metal", "Matte Polymer", "Natural Stone"],
              mood: fallback?.mood || ["Refined", "Exclusive", "Modern"],
            };
          });
          setProfiles(mapped);
        }
      } catch {
        // Fallback default profiles
      }
    }

    loadBrands();
  }, []);

  const setActiveProfile = (name: string) => {
    setActiveBrandName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("omnistage_active_brand", name);
    }
    setProfiles((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.brand_name === name,
      }))
    );
  };

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormName("");
    setFormAesthetic("Minimalist Luxury");
    setFormLighting("Soft directional studio light with warm rim highlights");
    setFormBackground("Architectural travertine marble and concrete pedestals");
    setFormPrimaryColor("#C9A227");
    setFormSecondaryColor("#1D2A4A");
    setShowModal(true);
  };

  const openEditModal = (brand: ExtendedBrand) => {
    setEditingBrand(brand);
    setFormName(brand.brand_name);
    setFormAesthetic(brand.aesthetic || brand.tagline || "");
    setFormLighting(brand.lighting || "");
    setFormBackground(brand.background_style || "");
    setFormPrimaryColor(brand.primary_color || "#C9A227");
    setFormSecondaryColor(brand.secondary_color || "#1D2A4A");
    setShowModal(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingBrand) {
        const updated = await api.updateBrand(editingBrand.id, {
          brand_name: formName.trim(),
          aesthetic: formAesthetic,
          lighting: formLighting,
          background_style: formBackground,
          primary_color: formPrimaryColor,
          secondary_color: formSecondaryColor,
        });

        setProfiles((prev) =>
          prev.map((p) =>
            p.id === editingBrand.id
              ? {
                  ...p,
                  ...updated,
                  tagline: updated.aesthetic || p.tagline,
                  lighting: updated.lighting || p.lighting,
                  primary_color: updated.primary_color,
                  secondary_color: updated.secondary_color,
                }
              : p
          )
        );
      } else {
        const created = await api.createBrand({
          brand_name: formName.trim(),
          aesthetic: formAesthetic,
          lighting: formLighting,
          background_style: formBackground,
          primary_color: formPrimaryColor,
          secondary_color: formSecondaryColor,
        });

        const newProfile: ExtendedBrand = {
          ...created,
          tagline: created.aesthetic || "New Brand Profile",
          description: `Custom visual identity and lighting rules for ${created.brand_name}.`,
          isActive: false,
          colors: [
            { label: "Primary", hex: formPrimaryColor },
            { label: "Secondary", hex: formSecondaryColor },
            { label: "Neutral", hex: "#ECE8DF" },
            { label: "Dark", hex: "#0A0D14" },
          ],
          lighting: formLighting,
          materials: ["Custom Textures", "Brushed Matte", "Architectural Slabs"],
          mood: ["Bespoke", "Dynamic", "Refined"],
        };

        setProfiles((prev) => [...prev, newProfile]);
      }
      setShowModal(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save Brand DNA.");
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={openCreateModal}
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
                  Active Brand: {activeBrandName}
                </h3>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-400">
                  Live in Generation Engine
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                All upcoming product uploads will inherit the {activeBrandName} colorway guidelines and lighting rules automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">Live Cloudinary CDN Synchronization</span>
          </div>
        </div>
      </div>

      {/* ── Brand DNA Profiles Grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {profiles.map((profile) => {
          const isCardActive = profile.brand_name === activeBrandName;
          const cardColors = profile.colors || [
            { label: "Primary", hex: profile.primary_color || "#C9A227" },
            { label: "Secondary", hex: profile.secondary_color || "#1D2A4A" },
          ];

          return (
            <div
              key={profile.id}
              className={`group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 ${
                isCardActive
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
                        {profile.brand_name}
                      </h3>
                      {isCardActive && (
                        <span className="rounded-full border border-gold/40 bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-gold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-gold">{profile.tagline || profile.aesthetic}</p>
                  </div>

                  <div
                    className="size-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                    style={{
                      backgroundColor: cardColors[0]?.hex || "#C9A227",
                      color: profile.brand_name === "VANTA" ? "#000" : "#fff",
                    }}
                  >
                    {profile.brand_name[0]}
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
                    {cardColors.map((c) => (
                      <div key={c.label + c.hex} className="group/swatch text-center">
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
                    {profile.lighting || "Precision studio directional lighting"}
                  </p>
                </div>

                {/* Materials */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Layers className="size-3 text-cyan" />
                    <span>Approved Textures</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile.materials || ["Travertine Marble", "Charcoal Slate"]).map((mat) => (
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
                    {(profile.mood || ["Refined", "Exclusive"]).map((m) => (
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
                {isCardActive ? (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <Check className="size-3.5" />
                      <span>Selected Workspace Profile</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(profile)}
                      className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      Edit Rules
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveProfile(profile.brand_name)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/80 py-2 text-xs font-semibold text-foreground transition-all hover:border-gold/40 hover:bg-secondary"
                    >
                      <Dna className="size-3.5 text-gold" />
                      <span>Activate Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(profile)}
                      className="rounded-lg border border-border bg-secondary/50 px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal for New / Edit Brand DNA ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                {editingBrand ? `Edit Rules — ${editingBrand.brand_name}` : "Create New Brand DNA"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXORA, AURA, NOCTIS"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Aesthetic Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Minimalist Luxury, High Fashion"
                  value={formAesthetic}
                  onChange={(e) => setFormAesthetic(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Lighting Profile</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Soft studio key light with 3200K warm rim illumination"
                  value={formLighting}
                  onChange={(e) => setFormLighting(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Background Style / Materials</label>
                <input
                  type="text"
                  placeholder="e.g. Travertine marble, brushed brass, velvet"
                  value={formBackground}
                  onChange={(e) => setFormBackground(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-foreground mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formPrimaryColor}
                      onChange={(e) => setFormPrimaryColor(e.target.value)}
                      className="size-8 rounded cursor-pointer border border-border bg-transparent"
                    />
                    <span className="font-mono text-muted-foreground">{formPrimaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-foreground mb-1">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formSecondaryColor}
                      onChange={(e) => setFormSecondaryColor(e.target.value)}
                      className="size-8 rounded cursor-pointer border border-border bg-transparent"
                    />
                    <span className="font-mono text-muted-foreground">{formSecondaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-[#d9b43c] disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="size-3 animate-spin" />}
                  <span>Save Brand DNA</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
