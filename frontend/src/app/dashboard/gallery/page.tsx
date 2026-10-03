"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  Copy,
  Check,
  CheckSquare,
  Square,
  Loader2,
  Eye,
  X,
} from "lucide-react";
import { api, Asset } from "@/lib/api";

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

const DEFAULT_ASSETS: GalleryAsset[] = [
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
    cdnUrl: "https://res.cloudinary.com/x6kxm6nz/image/upload/f_auto,q_auto,c_pad,w_1080,h_1080/v1/omnistage/products/sneaker-navy.webp",
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
    cdnUrl: "https://res.cloudinary.com/x6kxm6nz/image/upload/f_auto,q_auto,c_pad,w_1080,h_1350/v1/omnistage/products/sneaker-navy.webp",
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
    cdnUrl: "https://res.cloudinary.com/x6kxm6nz/image/upload/f_auto,q_auto,c_pad,w_1080,h_1920/v1/omnistage/products/sneaker-onyx.webp",
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
    cdnUrl: "https://res.cloudinary.com/x6kxm6nz/image/upload/f_auto,q_auto,c_pad,w_1920,h_1080/v1/omnistage/products/sneaker-crimson.webp",
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
    cdnUrl: "https://res.cloudinary.com/x6kxm6nz/image/upload/f_auto,q_auto,c_pad,w_1080,h_1080/v1/omnistage/products/handbag.webp",
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
    cdnUrl: "https://res.cloudinary.com/x6kxm6nz/image/upload/f_auto,q_auto,c_pad,w_1080,h_1350/v1/omnistage/products/handbag.webp",
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
    cdnUrl: "https://res.cloudinary.com/x6kxm6nz/image/upload/f_auto,q_auto,c_pad,w_1080,h_1080/v1/omnistage/products/watch.webp",
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
    cdnUrl: "https://res.cloudinary.com/x6kxm6nz/image/upload/f_auto,q_auto,c_pad,w_1080,h_1920/v1/omnistage/products/watch.webp",
  },
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const filterJobId = searchParams.get("jobId");

  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRatio, setSelectedRatio] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<GalleryAsset | null>(null);

  const ratios = ["All", "1:1", "4:5", "9:16", "16:9"];

  useEffect(() => {
    let mounted = true;

    async function loadAssets() {
      try {
        let fetched: Asset[] = [];
        if (filterJobId) {
          fetched = await api.getJobAssets(filterJobId);
        } else {
          fetched = await api.getAssets();
        }

        if (mounted) {
          if (fetched && fetched.length > 0) {
            const mapped: GalleryAsset[] = fetched.map((a, i) => {
              const dims =
                a.format === "1:1"
                  ? "1080 × 1080"
                  : a.format === "4:5"
                  ? "1080 × 1350"
                  : a.format === "9:16"
                  ? "1080 × 1920"
                  : "1920 × 1080";

              return {
                id: a.id,
                name: `Product Asset ${i + 1}`,
                sku: `LX-GEN-0${i + 1}`,
                ratio: ["1:1", "4:5", "9:16", "16:9"].includes(a.format)
                  ? (a.format as GalleryAsset["ratio"])
                  : "1:1",
                colorway: a.colorway || "Standard Colorway",
                image: a.cloudinary_url,
                dimensions: dims,
                size: "112 KB",
                format: "WebP",
                cdnUrl: a.cloudinary_url,
              };
            });
            setAssets(mapped);
          } else {
            setAssets(DEFAULT_ASSETS);
          }
        }
      } catch {
        if (mounted) setAssets(DEFAULT_ASSETS);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAssets();
    return () => {
      mounted = false;
    };
  }, [filterJobId]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (id: string, cdnUrl: string) => {
    navigator.clipboard.writeText(cdnUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      // Fallback
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDownload = async (asset: GalleryAsset) => {
    try {
      const response = await fetch(asset.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${asset.name.toLowerCase().replace(/\s+/g, "-")}-${asset.colorway.toLowerCase()}-${asset.ratio.replace(":", "-")}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(asset.image, "_blank");
    }
  };

  const handleBulkExport = () => {
    const toExport = assets.filter((a) => selectedIds.includes(a.id));
    if (toExport.length === 0) {
      alert("Please select at least one asset to export.");
      return;
    }
    toExport.forEach((asset, idx) => {
      setTimeout(() => handleDownload(asset), idx * 250);
    });
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesRatio = selectedRatio === "All" || asset.ratio === selectedRatio;
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.colorway.toLowerCase().includes(search.toLowerCase()) ||
      asset.sku.toLowerCase().includes(search.toLowerCase());
    return matchesRatio && matchesSearch;
  });

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
            onClick={handleBulkExport}
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

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          <Loader2 className="mx-auto size-6 animate-spin text-gold mb-2" />
          <span>Loading assets from Cloudinary CDN...</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground">
          No assets found matching the selected filters.
        </div>
      ) : (
        /* ── Masonry Column Layout ── */
        <ul className="columns-2 gap-4 sm:columns-3 xl:columns-4 [&>li]:mb-4 list-none p-0 m-0">
          {filteredAssets.map((asset) => {
            const isSelected = selectedIds.includes(asset.id);
            const isCopied = copiedId === asset.id;

            return (
              <li
                key={asset.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm transition-all hover:border-gold/40 hover:shadow-lg"
              >
                {/* Image Container */}
                <div
                  className={`relative w-full cursor-pointer overflow-hidden rounded-xl border border-border/80 bg-background/50 ${
                    asset.ratio === "1:1"
                      ? "aspect-square"
                      : asset.ratio === "4:5"
                      ? "aspect-[4/5]"
                      : asset.ratio === "9:16"
                      ? "aspect-[9/16]"
                      : "aspect-[16/9]"
                  }`}
                  onClick={() => setPreviewAsset(asset)}
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

                  {/* Preview Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="size-5 text-white" />
                  </div>

                  {/* Selection Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(asset.id);
                    }}
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
                        <span className="text-emerald-400 font-semibold">CDN URL copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3 text-muted-foreground" />
                        <span>Copy CDN URL</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(asset)}
                    className="flex size-7 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Download asset"
                    aria-label="Download asset"
                  >
                    <Download className="size-3" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Asset Preview Modal ── */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewAsset(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">{previewAsset.name}</h3>
                <p className="text-xs text-muted-foreground">{previewAsset.colorway} · {previewAsset.ratio} ({previewAsset.dimensions})</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative h-[420px] w-full bg-background/50 rounded-xl overflow-hidden border border-border">
              <Image
                src={previewAsset.image}
                alt={previewAsset.name}
                fill
                className="object-contain p-4"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-mono text-xs text-muted-foreground truncate max-w-[340px]">
                {previewAsset.cdnUrl}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(previewAsset.id, previewAsset.cdnUrl)}
                  className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  {copiedId === previewAsset.id ? "CDN URL copied" : "Copy CDN URL"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(previewAsset)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-[#d9b43c]"
                >
                  <Download className="size-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Asset Gallery...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
