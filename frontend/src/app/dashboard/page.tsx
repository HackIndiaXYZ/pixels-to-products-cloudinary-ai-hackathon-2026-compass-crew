"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

interface Job {
  id: string;
  name: string;
  sku: string;
  image: string;
  colors: { name: string; hex: string }[];
  ratios: string[];
  status: "GENERATING" | "OPTIMIZING" | "COMPLETED" | "QUEUED" | "ANALYZING";
  progressStep: number; // 1 to 6
  created: string;
}

const RECENT_JOBS: Job[] = [
  {
    id: "job-1",
    name: "Aero Low Leather Sneaker",
    sku: "LX-SNK-042",
    image: "/products/sneaker-navy.png",
    colors: [
      { name: "Navy", hex: "#1D2A4A" },
      { name: "Onyx", hex: "#111827" },
      { name: "Crimson", hex: "#881337" },
      { name: "Cloud", hex: "#E0E7FF" },
      { name: "Sand", hex: "#D4B996" },
    ],
    ratios: ["1:1", "4:5", "9:16", "16:9"],
    status: "GENERATING",
    progressStep: 3,
    created: "2 min ago",
  },
  {
    id: "job-2",
    name: "Maison Top-Handle Bag",
    sku: "LX-BAG-011",
    image: "/products/handbag.png",
    colors: [
      { name: "Sandstone", hex: "#D4B996" },
      { name: "Noir", hex: "#111827" },
      { name: "Terracotta", hex: "#9A3412" },
    ],
    ratios: ["1:1", "4:5", "16:9"],
    status: "OPTIMIZING",
    progressStep: 5,
    created: "9 min ago",
  },
  {
    id: "job-3",
    name: "Meridian Steel Watch",
    sku: "LX-WTC-007",
    image: "/products/watch.png",
    colors: [
      { name: "Steel", hex: "#94A3B8" },
      { name: "Gold", hex: "#C9A227" },
      { name: "Rose", hex: "#BE185D" },
    ],
    ratios: ["1:1", "9:16"],
    status: "COMPLETED",
    progressStep: 6,
    created: "34 min ago",
  },
  {
    id: "job-4",
    name: "Aero Low Suede Sneaker",
    sku: "LX-SNK-043",
    image: "/products/sneaker-sand.png",
    colors: [
      { name: "Desert Sand", hex: "#D4B996" },
      { name: "Slate", hex: "#475569" },
    ],
    ratios: ["1:1", "4:5", "9:16"],
    status: "COMPLETED",
    progressStep: 6,
    created: "2 hrs ago",
  },
  {
    id: "job-5",
    name: "Aero Low Onyx Edition",
    sku: "LX-SNK-044",
    image: "/products/sneaker-onyx.png",
    colors: [
      { name: "Onyx", hex: "#111827" },
      { name: "Carbon", hex: "#1F2937" },
    ],
    ratios: ["1:1", "16:9"],
    status: "QUEUED",
    progressStep: 1,
    created: "3 hrs ago",
  },
];

export default function DashboardOverviewPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Good morning, Ava
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your LUXORA pipeline generated 184 assets this week. All outputs synchronized with Cloudinary CDN.
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
              +18.2%
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">12,480</div>
          <div className="mt-1 text-[11px] text-muted-foreground">vs. last month</div>
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
            <span className="font-medium text-emerald-400">+1 this month</span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">3</div>
          <div className="mt-1 text-[11px] text-muted-foreground">LUXORA, VANTA, TERRA</div>
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
            <span>Processing success rate</span>
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <TrendingUp className="size-3" />
              +0.3%
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">99.8%</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Zero quality drops</div>
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
            <span>Storage saved</span>
            <span className="font-medium text-cyan">-68% avg size</span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">38.4 GB</div>
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
      <Link
        href="/dashboard/create"
        className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 p-8 text-center transition-all hover:border-gold/50 hover:bg-card/70"
      >
        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gold shadow-inner transition-transform group-hover:scale-105">
          <UploadCloud className="size-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
          Drop a new product image to start instantly
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG or WEBP up to 25MB · LUXORA Brand DNA auto-applied
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors group-hover:border-gold/40">
          <span>Browse files</span>
          <ArrowRight className="size-3" />
        </div>
      </Link>

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
                {RECENT_JOBS.map((job) => {
                  return (
                    <tr key={job.id} className="transition-colors hover:bg-muted/20">
                      {/* Product Thumbnail & SKU */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                            <Image
                              src={job.image}
                              alt={job.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{job.name}</div>
                            <div className="font-mono text-[11px] text-muted-foreground">{job.sku}</div>
                          </div>
                        </div>
                      </td>

                      {/* Target Colors */}
                      <td className="px-4 py-3.5">
                        <div className="flex -space-x-1.5">
                          {job.colors.map((c, i) => (
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
                          {job.ratios.map((ratio) => (
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
                            {job.status === "GENERATING" && (
                              <>
                                <Loader2 className="size-3 animate-spin text-gold" />
                                <span className="font-mono text-[11px] font-semibold text-gold">GENERATING</span>
                              </>
                            )}
                            {job.status === "OPTIMIZING" && (
                              <>
                                <Loader2 className="size-3 animate-spin text-cyan" />
                                <span className="font-mono text-[11px] font-semibold text-cyan">OPTIMIZING</span>
                              </>
                            )}
                            {job.status === "COMPLETED" && (
                              <>
                                <CheckCircle2 className="size-3 text-emerald-400" />
                                <span className="font-mono text-[11px] font-semibold text-emerald-400">COMPLETED</span>
                              </>
                            )}
                            {job.status === "QUEUED" && (
                              <>
                                <Clock className="size-3 text-muted-foreground" />
                                <span className="font-mono text-[11px] font-semibold text-muted-foreground">QUEUED</span>
                              </>
                            )}
                          </div>
                          {/* 5-step progress indicator */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5, 6].map((st) => (
                              <span
                                key={st}
                                className={`h-1 w-3 rounded-full transition-all ${
                                  st <= job.progressStep
                                    ? job.status === "COMPLETED"
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
                        {job.created}
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
                            onClick={() => handleCopy(job.id)}
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
