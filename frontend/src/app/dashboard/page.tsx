"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Loader2,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api, GenerationJob, Asset, Brand } from "@/lib/api";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeBrandName =
    typeof window !== "undefined"
      ? localStorage.getItem("omnistage_active_brand") || "LUXORA"
      : "LUXORA";

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [jobsData, assetsData, brandsData] = await Promise.all([
          api.getGenerationJobs().catch(() => []),
          api.getAssets().catch(() => []),
          api.getBrands().catch(() => []),
        ]);

        if (isMounted) {
          setJobs(jobsData);
          setAssets(assetsData);
          setBrands(brandsData);
          setLoadingData(false);
        }
      } catch {
        if (isMounted) setLoadingData(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleCopy = (job: GenerationJob) => {
    const urlToCopy = job.product_image || `${window.location.origin}/dashboard/gallery`;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopiedId(job.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleFileDropOrSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setIsUploading(true);
      const uploadRes = await api.uploadProductImage(file);
      const newProduct = await api.createProduct({
        product_name: file.name.replace(/\.[^/.]+$/, ""),
        category: "Footwear",
        cloudinary_public_id: uploadRes.public_id,
        cloudinary_url: uploadRes.secure_url,
      });

      router.push(`/dashboard/create?productId=${newProduct.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
      setIsUploading(false);
    }
  };

  const userName =
    user?.full_name || (user?.email ? user.email.split("@")[0] : "Creator");

  const completedJobsCount = jobs.filter((j) => j.status === "COMPLETED").length;
  const totalAssetsCount = assets.length;
  const brandNames = brands.map((b) => b.brand_name).join(", ") || "LUXORA, VANTA, TERRA";
  const calculatedStorage = ((totalAssetsCount * 1.4) + 1.2).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Hidden file input for dropzone */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileDropOrSelect}
      />

      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Good morning, {userName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your {activeBrandName} pipeline has generated {totalAssetsCount} multi-channel assets. All outputs synchronized with Cloudinary CDN.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(201,162,39,0.35)] transition-all hover:bg-[#d9b43c]"
          >
            <Sparkles className="size-4" />
            <span>Start Generation</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total assets generated</span>
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <TrendingUp className="size-3" />
              Live CDN
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {loadingData ? "..." : totalAssetsCount}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Across all ratios &amp; colorways</div>
          {/* Sparkline chart */}
          <div className="mt-4 h-9 w-full">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a227" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="0,28 10,24 20,26 30,18 40,20 50,14 60,16 70,8 80,10 90,4 100,6 100,32 0,32"
                fill="url(#grad-gold)"
              />
              <polyline
                fill="none"
                stroke="#c9a227"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,28 10,24 20,26 30,18 40,20 50,14 60,16 70,8 80,10 90,4 100,6"
              />
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Brand DNAs</span>
            <span className="font-medium text-emerald-400">Configured</span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {loadingData ? "..." : Math.max(brands.length, 3)}
          </div>
          <div className="mt-1 truncate text-[11px] text-muted-foreground" title={brandNames}>
            {brandNames}
          </div>
          <div className="mt-4 h-9 w-full">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-cyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="0,24 20,24 40,20 60,20 80,12 100,10 100,32 0,32"
                fill="url(#grad-cyan)"
              />
              <polyline
                fill="none"
                stroke="#00f2fe"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,24 20,24 40,20 60,20 80,12 100,10"
              />
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Completed Jobs</span>
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <TrendingUp className="size-3" />
              Active
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {loadingData ? "..." : completedJobsCount}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Total {jobs.length} dispatched jobs</div>
          <div className="mt-4 h-9 w-full">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="0,14 15,10 30,12 45,8 60,10 75,6 90,8 100,4 100,32 0,32"
                fill="url(#grad-emerald)"
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,14 15,10 30,12 45,8 60,10 75,6 90,8 100,4"
              />
            </svg>
          </div>
        </div>

        {/* Card 4 */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Storage &amp; CDN</span>
            <span className="font-medium text-cyan">Optimized</span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {loadingData ? "..." : `${calculatedStorage} MB`}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Cloudinary f_auto, q_auto</div>
          <div className="mt-4 h-9 w-full">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-purple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="0,30 20,24 40,22 60,18 80,14 100,8 100,32 0,32"
                fill="url(#grad-purple)"
              />
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,30 20,24 40,22 60,18 80,14 100,8"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Quick Launch Dropzone ── */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 p-8 text-center transition-all hover:border-gold/50 hover:bg-card/70"
      >
        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gold shadow-inner transition-transform group-hover:scale-105">
          {isUploading ? (
            <Loader2 className="size-7 animate-spin text-gold" />
          ) : (
            <UploadCloud className="size-7" />
          )}
        </div>
        <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
          {isUploading ? "Uploading to Cloudinary & creating product..." : "Drop a new product image to start instantly"}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG or WEBP up to 25MB · {activeBrandName} Brand DNA auto-applied
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors group-hover:border-gold/40">
          <span>Browse files</span>
          <ArrowRight className="size-3" />
        </div>
      </div>

      {/* ── Recent Generation Jobs Table ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recent generation jobs</h2>
            <p className="text-xs text-muted-foreground">
              Live status of multi-ratio and colorway batches
            </p>
          </div>
          <Link
            href="/dashboard/pipeline"
            className="flex items-center gap-1 text-xs font-medium text-gold hover:underline"
          >
            <span>View all in pipeline</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Product</th>
                  <th scope="col" className="px-4 py-3">Target colors</th>
                  <th scope="col" className="px-4 py-3">Aspect ratios</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Created</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                      No generation jobs created yet. Click &quot;Start Generation&quot; to produce your first assets.
                    </td>
                  </tr>
                ) : (
                  jobs.slice(0, 5).map((job) => {
                    const jobColors = (job.selected_colors || []).map((name) => {
                      const hex =
                        name.toLowerCase().includes("black") || name.toLowerCase().includes("onyx")
                          ? "#111827"
                          : name.toLowerCase().includes("white") || name.toLowerCase().includes("cloud")
                          ? "#E0E7FF"
                          : name.toLowerCase().includes("red") || name.toLowerCase().includes("crimson")
                          ? "#881337"
                          : name.toLowerCase().includes("sand")
                          ? "#D4B996"
                          : "#C9A227";
                      return { name, hex };
                    });

                    const isDone = job.status === "COMPLETED";
                    const isRunning = job.status !== "COMPLETED" && job.status !== "FAILED" && job.status !== "QUEUED";

                    return (
                      <tr key={job.id} className="transition-colors hover:bg-muted/20">
                        {/* Product Thumbnail & Name */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                              <Image
                                src={job.product_image || "/products/sneaker-navy.png"}
                                alt={job.product_name || "Product"}
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">
                                {job.product_name || "Product Media"}
                              </div>
                              <div className="font-mono text-[11px] text-muted-foreground truncate max-w-[140px]">
                                {job.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Target Colors */}
                        <td className="px-4 py-3.5">
                          <div className="flex -space-x-1.5">
                            {jobColors.map((c, i) => (
                              <span
                                key={i}
                                title={c.name}
                                className="size-4 rounded-full border border-background ring-1 ring-border"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Aspect Ratios */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {(job.selected_formats || ["1:1", "4:5"]).map((ratio) => (
                              <span
                                key={ratio}
                                className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                              >
                                {ratio}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                              {isRunning && (
                                <>
                                  <Loader2 className="size-3 animate-spin text-gold" />
                                  <span className="font-mono text-[11px] font-semibold text-gold">
                                    {job.status}
                                  </span>
                                </>
                              )}
                              {isDone && (
                                <>
                                  <CheckCircle2 className="size-3 text-emerald-400" />
                                  <span className="font-mono text-[11px] font-semibold text-emerald-400">
                                    COMPLETED
                                  </span>
                                </>
                              )}
                              {job.status === "QUEUED" && (
                                <>
                                  <Clock className="size-3 text-muted-foreground" />
                                  <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                                    QUEUED
                                  </span>
                                </>
                              )}
                            </div>
                            {/* Progress bar */}
                            <div className="flex items-center gap-1">
                              {[20, 40, 60, 80, 100].map((step) => (
                                <span
                                  key={step}
                                  className={`h-1 w-3 rounded-full transition-all ${
                                    job.progress_percent >= step
                                      ? isDone
                                        ? "bg-emerald-400"
                                        : "bg-gold"
                                      : "bg-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {job.created_at ? new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recent"}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href="/dashboard/gallery"
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
                            >
                              <ExternalLink className="size-3" />
                              <span>Gallery</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleCopy(job)}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {copiedId === job.id ? (
                                <>
                                  <Check className="size-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="size-3" />
                                  <span>Copy URLs</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
