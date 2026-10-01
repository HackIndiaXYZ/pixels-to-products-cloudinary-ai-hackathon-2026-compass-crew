"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: "Footwear" | "Leather Goods" | "Timepieces";
  image: string;
  status: "GENERATING" | "OPTIMIZING" | "COMPLETED" | "QUEUED" | "ANALYZING";
  assetCount: number;
  colorways: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Aero Low Leather Sneaker",
    sku: "LX-SNK-042",
    category: "Footwear",
    image: "/products/sneaker-navy.png",
    status: "GENERATING",
    assetCount: 16,
    colorways: ["#1D2A4A", "#111827", "#881337", "#E0E7FF", "#D4B996"],
  },
  {
    id: "prod-2",
    name: "Maison Top-Handle Bag",
    sku: "LX-BAG-011",
    category: "Leather Goods",
    image: "/products/handbag.png",
    status: "OPTIMIZING",
    assetCount: 12,
    colorways: ["#D4B996", "#111827", "#9A3412"],
  },
  {
    id: "prod-3",
    name: "Meridian Steel Watch",
    sku: "LX-WTC-007",
    category: "Timepieces",
    image: "/products/watch.png",
    status: "COMPLETED",
    assetCount: 8,
    colorways: ["#94A3B8", "#C9A227", "#BE185D"],
  },
  {
    id: "prod-4",
    name: "Aero Low Suede Sneaker",
    sku: "LX-SNK-043",
    category: "Footwear",
    image: "/products/sneaker-sand.png",
    status: "COMPLETED",
    assetCount: 12,
    colorways: ["#D4B996", "#475569"],
  },
  {
    id: "prod-5",
    name: "Aero Low Onyx Edition",
    sku: "LX-SNK-044",
    category: "Footwear",
    image: "/products/sneaker-onyx.png",
    status: "QUEUED",
    assetCount: 8,
    colorways: ["#111827", "#1F2937"],
  },
  {
    id: "prod-6",
    name: "Aero Low Crimson Drop",
    sku: "LX-SNK-045",
    category: "Footwear",
    image: "/products/sneaker-crimson.png",
    status: "ANALYZING",
    assetCount: 4,
    colorways: ["#881337"],
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Footwear", "Leather Goods", "Timepieces"];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Products Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage master product assets, inspect AI-extracted geometry, and run automated generation pipelines.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(201,162,39,0.35)] transition-all hover:bg-[#d9b43c]"
        >
          <Plus className="size-4" />
          <span>Upload Product</span>
        </Link>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-gold/40 hover:shadow-md"
          >
            <div>
              {/* Image Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/80 bg-background/50 p-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {product.status === "GENERATING" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-gold backdrop-blur-md">
                      <Loader2 className="size-3 animate-spin" />
                      GENERATING
                    </span>
                  )}
                  {product.status === "OPTIMIZING" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan backdrop-blur-md">
                      <Loader2 className="size-3 animate-spin" />
                      OPTIMIZING
                    </span>
                  )}
                  {product.status === "COMPLETED" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 backdrop-blur-md">
                      <CheckCircle2 className="size-3" />
                      COMPLETED
                    </span>
                  )}
                  {product.status === "QUEUED" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/80 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground backdrop-blur-md">
                      <Clock className="size-3" />
                      QUEUED
                    </span>
                  )}
                  {product.status === "ANALYZING" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-purple-400 backdrop-blur-md">
                      <Sparkles className="size-3" />
                      ANALYZING
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className="rounded-md border border-white/10 bg-background/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-md">
                    {product.assetCount} assets
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>{product.sku}</span>
                  <span>{product.category}</span>
                </div>
                <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground truncate">
                  {product.name}
                </h3>

                {/* Colorway preview swatches */}
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[11px] text-muted-foreground">Active colorways</span>
                  <div className="flex -space-x-1.5">
                    {product.colorways.map((hex, i) => (
                      <span
                        key={i}
                        className="size-4 rounded-full border border-background ring-1 ring-border"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions CTA */}
            <div className="mt-5 border-t border-border pt-4">
              <Link
                href="/dashboard/create"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary py-2 text-xs font-semibold text-foreground transition-all hover:border-gold/40 hover:bg-secondary/80"
              >
                <span>New generation</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
