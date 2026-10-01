"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Download,
  Copy,
  Check,
  CheckSquare,
  Square,
} from "lucide-react";

interface GalleryAsset {
  id: string;
  name: string;
  sku: string;
  ratio: "1:1" | "4:5" | "9:16" | "16:9";
  colorway: string;
  image: string;
  dimensions: string;
  size: string;
  format: string;
  cdnUrl: string;
}

const ASSETS: GalleryAsset[] = [
  {
    id: "ast-1",
    name: "Aero Low Sneaker",
    sku: "LX-SNK-042",
    ratio: "1:1",
    colorway: "Navy Original",
    image: "/products/sneaker-navy.png",
    dimensions: "1080 × 1080",
    size: "142 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1080/v1/luxora/aero-low-navy.webp",
  },
  {
    id: "ast-2",
    name: "Aero Low Sneaker",
    sku: "LX-SNK-042",
    ratio: "4:5",
    colorway: "Navy Original",
    image: "/products/sneaker-navy.png",
    dimensions: "1080 × 1350",
    size: "98 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1350/v1/luxora/aero-low-navy-feed.webp",
  },
  {
    id: "ast-3",
    name: "Aero Low Sneaker",
    sku: "LX-SNK-044",
    ratio: "9:16",
    colorway: "Onyx Black",
    image: "/products/sneaker-onyx.png",
    dimensions: "1080 × 1920",
    size: "76 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1920/v1/luxora/aero-low-onyx-story.webp",
  },
  {
    id: "ast-4",
    name: "Aero Low Sneaker",
    sku: "LX-SNK-045",
    ratio: "16:9",
    colorway: "Crimson Red",
    image: "/products/sneaker-crimson.png",
    dimensions: "1920 × 1080",
    size: "188 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1920,h_1080/v1/luxora/aero-low-crimson-banner.webp",
  },
  {
    id: "ast-5",
    name: "Maison Top-Handle Bag",
    sku: "LX-BAG-011",
    ratio: "1:1",
    colorway: "Sandstone",
    image: "/products/handbag.png",
    dimensions: "1080 × 1080",
    size: "120 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1080/v1/luxora/maison-bag-sandstone.webp",
  },
  {
    id: "ast-6",
    name: "Maison Top-Handle Bag",
    sku: "LX-BAG-011",
    ratio: "4:5",
    colorway: "Sandstone",
    image: "/products/handbag.png",
    dimensions: "1080 × 1350",
    size: "88 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1350/v1/luxora/maison-bag-feed.webp",
  },
  {
    id: "ast-7",
    name: "Meridian Steel Watch",
    sku: "LX-WTC-007",
    ratio: "1:1",
    colorway: "Steel Classic",
    image: "/products/watch.png",
    dimensions: "1080 × 1080",
    size: "156 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1080/v1/luxora/meridian-watch.webp",
  },
  {
    id: "ast-8",
    name: "Meridian Steel Watch",
    sku: "LX-WTC-007",
    ratio: "9:16",
    colorway: "Steel Classic",
    image: "/products/watch.png",
    dimensions: "1080 × 1920",
    size: "110 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1920/v1/luxora/meridian-watch-story.webp",
  },
  {
    id: "ast-9",
    name: "Aero Low Sneaker",
    sku: "LX-SNK-042",
    ratio: "1:1",
    colorway: "Cloud White",
    image: "/products/sneaker-cloud.png",
    dimensions: "1080 × 1080",
    size: "134 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1080/v1/luxora/aero-low-cloud.webp",
  },
  {
    id: "ast-10",
    name: "Aero Low Sneaker",
    sku: "LX-SNK-043",
    ratio: "4:5",
    colorway: "Desert Sand",
    image: "/products/sneaker-sand.png",
    dimensions: "1080 × 1350",
    size: "115 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1350/v1/luxora/aero-low-sand-feed.webp",
  },
  {
    id: "ast-11",
    name: "Aero Low Sneaker",
    sku: "LX-SNK-043",
    ratio: "1:1",
    colorway: "Desert Sand",
    image: "/products/sneaker-sand.png",
    dimensions: "1080 × 1080",
    size: "145 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1080,h_1080/v1/luxora/aero-low-sand.webp",
  },
  {
    id: "ast-12",
    name: "Aero Low Sneaker",
    sku: "LX-SNK-044",
    ratio: "16:9",
    colorway: "Onyx Black",
    image: "/products/sneaker-onyx.png",
    dimensions: "1920 × 1080",
    size: "201 KB",
    format: "WebP",
    cdnUrl: "https://res.cloudinary.com/omnistage/image/upload/f_auto,q_auto,c_pad,w_1920,h_1080/v1/luxora/aero-low-onyx-banner.webp",
  },
];

export default function GalleryPage() {
  const [selectedRatio, setSelectedRatio] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const ratios = ["All", "1:1", "4:5", "9:16", "16:9"];

  const filteredAssets = ASSETS.filter((a) => {
    const matchesRatio = selectedRatio === "All" || a.ratio === selectedRatio;
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.colorway.toLowerCase().includes(search.toLowerCase()) ||
      a.sku.toLowerCase().includes(search.toLowerCase());
    return matchesRatio && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopy = (id: string, text: string) => {
    setCopiedId(id);
    navigator.clipboard?.writeText(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Asset Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All generated product media, cropped, auto-optimized, and published to Cloudinary CDN.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-gold/40 hover:bg-secondary/80"
          >
            <Download className="size-3.5" />
            <span>Bulk export ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {ratios.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRatio(r)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                selectedRatio === r
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search product or color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* ── Masonry Column Layout ── */}
      <ul className="columns-2 gap-4 sm:columns-3 xl:columns-4 [&>li]:mb-4 list-none p-0 m-0">
        {filteredAssets.map((asset) => {
          const isSelected = selectedIds.includes(asset.id);
          const isCopied = copiedId === asset.id;

          return (
            <li
              key={asset.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm transition-all hover:border-gold/40 hover:shadow-lg"
            >
              {/* Image Container with appropriate aspect ratio preview */}
              <div
                className={`relative w-full overflow-hidden rounded-xl border border-border/80 bg-background/50 ${
                  asset.ratio === "1:1"
                    ? "aspect-square"
                    : asset.ratio === "4:5"
                    ? "aspect-[4/5]"
                    : asset.ratio === "9:16"
                    ? "aspect-[9/16]"
                    : "aspect-[16/9]"
                }`}
              >
                <Image
                  src={asset.image}
                  alt={`${asset.name} - ${asset.colorway}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Ratio Tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="rounded-md border border-white/10 bg-background/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-foreground backdrop-blur-md">
                    {asset.ratio}
                  </span>
                </div>

                {/* Selection Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleSelect(asset.id)}
                  className="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-md border border-white/20 bg-background/80 text-foreground backdrop-blur-md hover:border-gold"
                  aria-label="Select asset"
                >
                  {isSelected ? (
                    <CheckSquare className="size-4 text-gold" />
                  ) : (
                    <Square className="size-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Meta details */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground truncate">{asset.name}</span>
                  <span className="font-mono text-muted-foreground">{asset.size}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{asset.colorway}</span>
                  <span className="font-mono">{asset.dimensions}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-2.5">
                <button
                  type="button"
                  onClick={() => handleCopy(asset.id, asset.cdnUrl)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-secondary py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {isCopied ? (
                    <>
                      <Check className="size-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3 text-muted-foreground" />
                      <span>CDN URL</span>
                    </>
                  )}
                </button>
                <a
                  href={asset.image}
                  download
                  className="flex size-7 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Download asset"
                >
                  <Download className="size-3" />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
