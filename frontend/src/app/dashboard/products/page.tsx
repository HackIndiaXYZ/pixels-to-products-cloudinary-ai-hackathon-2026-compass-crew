"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { api, Product } from "@/lib/api";

interface DisplayProduct extends Product {
  sku?: string;
  assetCount?: number;
  colorways?: string[];
  status?: "GENERATING" | "OPTIMIZING" | "COMPLETED" | "QUEUED" | "ANALYZING";
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = ["All", "Footwear", "Leather Goods", "Timepieces"];

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const data = await api.getProducts();
        if (mounted) {
          const mapped: DisplayProduct[] = data.map((p, idx) => ({
            ...p,
            sku: `LX-${(p.category || "PROD").slice(0, 3).toUpperCase()}-0${idx + 10}`,
            assetCount: Array.isArray((p.ai_metadata as Record<string, unknown> | null)?.detected_features)
              ? ((p.ai_metadata as Record<string, unknown>).detected_features as string[]).length * 4
              : 8,
            colorways: ["#1D2A4A", "#111827", "#881337", "#E0E7FF", "#D4B996"],
            status: "COMPLETED",
          }));
          setProducts(mapped);
        }
      } catch {
        // quiet error
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setIsUploading(true);
    try {
      const uploadRes = await api.uploadProductImage(file);
      const newProduct = await api.createProduct({
        product_name: file.name.replace(/\.[^/.]+$/, ""),
        category: selectedCategory === "All" ? "Footwear" : selectedCategory,
        cloudinary_public_id: uploadRes.public_id,
        cloudinary_url: uploadRes.secure_url,
      });

      router.push(`/dashboard/create?productId=${newProduct.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload product.");
      setIsUploading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    const matchesCat =
      selectedCategory === "All" ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Hidden file input for Upload Product */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Products Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage master product assets, inspect AI-extracted geometry, and run automated generation pipelines.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(201,162,39,0.35)] transition-all hover:bg-[#d9b43c] disabled:opacity-60"
        >
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          <span>{isUploading ? "Uploading..." : "Upload Product"}</span>
        </button>
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
      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          <Loader2 className="mx-auto size-6 animate-spin text-gold mb-2" />
          <span>Loading products library...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-semibold text-foreground">No products found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search filter or upload a new product.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-[#d9b43c]"
          >
            <Upload className="size-3.5" />
            <span>Upload First Product</span>
          </button>
        </div>
      ) : (
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
                    src={product.cloudinary_url || "/products/sneaker-navy.png"}
                    alt={product.product_name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 backdrop-blur-md">
                      <CheckCircle2 className="size-3" />
                      COMPLETED
                    </span>
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
                    <span>{product.category || "Footwear"}</span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground truncate">
                    {product.product_name}
                  </h3>

                  {/* Colorway preview swatches */}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-[11px] text-muted-foreground">Active colorways</span>
                    <div className="flex -space-x-1.5">
                      {(product.colorways || ["#1D2A4A", "#111827", "#881337"]).map((hex, i) => (
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
                  href={`/dashboard/create?productId=${product.id}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary py-2 text-xs font-semibold text-foreground transition-all hover:border-gold/40 hover:bg-secondary/80"
                >
                  <span>New generation</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
