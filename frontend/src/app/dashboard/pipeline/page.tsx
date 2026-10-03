"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { api, GenerationJob } from "@/lib/api";

interface PipelineRow {
  id: string;
  name: string;
  sku: string;
  image: string;
  stage: "QUEUED" | "ANALYZING" | "GENERATING" | "TRANSFORMING" | "OPTIMIZING" | "COMPLETED" | "FAILED";
  stepNumber: number;
  ratios: string[];
  colorsCount: number;
  optimization: string;
  duration: string;
  status: "Running" | "Completed" | "Queued" | "Failed";
}

function mapJobToRow(j: GenerationJob): PipelineRow {
  let step = 1;
  let statusLabel: "Running" | "Completed" | "Queued" | "Failed" = "Running";

  if (j.status === "QUEUED") {
    step = 1;
    statusLabel = "Queued";
  } else if (j.status === "ANALYZING") {
    step = 2;
    statusLabel = "Running";
  } else if (j.status === "GENERATING") {
    step = 3;
    statusLabel = "Running";
  } else if (j.status === "TRANSFORMING") {
    step = 4;
    statusLabel = "Running";
  } else if (j.status === "OPTIMIZING") {
    step = 5;
    statusLabel = "Running";
  } else if (j.status === "COMPLETED") {
    step = 6;
    statusLabel = "Completed";
  } else if (j.status === "FAILED") {
    step = 1;
    statusLabel = "Failed";
  }

  return {
    id: j.id.slice(0, 8).toUpperCase(),
    name: j.product_name || "Aero Low Sneaker",
    sku: `LX-${j.id.slice(0, 4).toUpperCase()}`,
    image: j.product_image || "/products/sneaker-navy.png",
    stage: j.status,
    stepNumber: step,
    ratios: j.selected_formats || ["1:1", "4:5", "9:16", "16:9"],
    colorsCount: j.selected_colors ? j.selected_colors.length : 3,
    optimization: "f_auto,q_auto,c_pad",
    duration: j.status === "COMPLETED" ? "Done" : "Processing...",
    status: statusLabel,
  };
}

const DEFAULT_JOBS: PipelineRow[] = [
  {
    id: "JOB-8842",
    name: "Aero Low Leather Sneaker",
    sku: "LX-SNK-042",
    image: "/products/sneaker-navy.png",
    stage: "GENERATING",
    stepNumber: 3,
    ratios: ["1:1", "4:5", "9:16", "16:9"],
    colorsCount: 5,
    optimization: "f_auto,q_auto:best",
    duration: "14s elapsed",
    status: "Running",
  },
  {
    id: "JOB-8841",
    name: "Maison Top-Handle Bag",
    sku: "LX-BAG-011",
    image: "/products/handbag.png",
    stage: "OPTIMIZING",
    stepNumber: 5,
    ratios: ["1:1", "4:5", "16:9"],
    colorsCount: 3,
    optimization: "c_pad,b_gen_fill",
    duration: "28s elapsed",
    status: "Running",
  },
  {
    id: "JOB-8840",
    name: "Meridian Steel Watch",
    sku: "LX-WTC-007",
    image: "/products/watch.png",
    stage: "COMPLETED",
    stepNumber: 6,
    ratios: ["1:1", "9:16"],
    colorsCount: 3,
    optimization: "f_auto,q_auto,w_1080",
    duration: "32s total",
    status: "Completed",
  },
];

export default function PipelinePage() {
  const [jobs, setJobs] = useState<PipelineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterTab, setFilterTab] = useState<string>("All");

  const loadPipelineJobs = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await api.getGenerationJobs();
      if (data && data.length > 0) {
        setJobs(data.map(mapJobToRow));
      } else {
        setJobs(DEFAULT_JOBS);
      }
    } catch {
      setJobs(DEFAULT_JOBS);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    api.getGenerationJobs()
      .then((data) => {
        if (!mounted) return;
        if (data && data.length > 0) {
          setJobs(data.map(mapJobToRow));
        } else {
          setJobs(DEFAULT_JOBS);
        }
      })
      .catch(() => {
        if (mounted) setJobs(DEFAULT_JOBS);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const stageCounts = {
    QUEUED: jobs.filter((j) => j.stage === "QUEUED").length,
    ANALYZING: jobs.filter((j) => j.stage === "ANALYZING").length,
    GENERATING: jobs.filter((j) => j.stage === "GENERATING").length,
    TRANSFORMING: jobs.filter((j) => j.stage === "TRANSFORMING").length,
    OPTIMIZING: jobs.filter((j) => j.stage === "OPTIMIZING").length,
    COMPLETED: jobs.filter((j) => j.stage === "COMPLETED").length,
  };

  const filteredJobs = jobs.filter((job) => {
    if (filterTab === "Active") return job.status === "Running";
    if (filterTab === "Completed") return job.status === "Completed";
    if (filterTab === "Queued") return job.status === "Queued";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Media Pipeline Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time status of multi-aspect ratio rendering, neural colorway transformations, and Cloudinary CDN optimizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadPipelineJobs}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-gold/40 hover:bg-secondary/80 disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-gold" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Queue"}</span>
          </button>
        </div>
      </div>

      {/* ── 6 Stage KPI Metric Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-border bg-card p-3.5 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            QUEUED
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-muted-foreground">
            {stageCounts.QUEUED}
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3.5 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
            ANALYZING
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-purple-400">
            {stageCounts.ANALYZING}
          </div>
        </div>

        <div className="rounded-xl border border-gold/40 bg-gold/10 p-3.5 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gold">
            GENERATING
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-gold">
            {stageCounts.GENERATING}
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            TRANSFORMING
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-amber-400">
            {stageCounts.TRANSFORMING}
          </div>
        </div>

        <div className="rounded-xl border border-cyan/40 bg-cyan/10 p-3.5 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan">
            OPTIMIZING
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-cyan">
            {stageCounts.OPTIMIZING}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            COMPLETED
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">
            {stageCounts.COMPLETED}
          </div>
        </div>
      </div>

      {/* ── Jobs Table Section ── */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            {["All", "Active", "Completed", "Queued"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterTab === tab
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground">
            Showing {filteredJobs.length} pipeline tasks
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Job ID / Product</th>
                  <th scope="col" className="px-4 py-3">Pipeline Stage</th>
                  <th scope="col" className="px-4 py-3">Aspect Ratios</th>
                  <th scope="col" className="px-4 py-3">Colorways</th>
                  <th scope="col" className="px-4 py-3">Cloudinary Optimization</th>
                  <th scope="col" className="px-4 py-3">Duration</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                      <Loader2 className="mx-auto size-5 animate-spin text-gold mb-1" />
                      Loading pipeline queue...
                    </td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                      No jobs found in this queue view.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="transition-colors hover:bg-muted/20">
                      {/* Job ID & Product */}
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
                            <div className="font-mono text-[11px] text-muted-foreground">
                              {job.id} · {job.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Pipeline Stage */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            {job.status === "Running" && (
                              <>
                                <Loader2 className="size-3 animate-spin text-gold" />
                                <span className="font-mono text-[11px] font-semibold text-gold">
                                  {job.stage}
                                </span>
                              </>
                            )}
                            {job.status === "Completed" && (
                              <>
                                <CheckCircle2 className="size-3 text-emerald-400" />
                                <span className="font-mono text-[11px] font-semibold text-emerald-400">
                                  COMPLETED
                                </span>
                              </>
                            )}
                            {job.status === "Queued" && (
                              <>
                                <Clock className="size-3 text-muted-foreground" />
                                <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                                  QUEUED
                                </span>
                              </>
                            )}
                          </div>
                          {/* 6-step progress indicator */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5, 6].map((st) => (
                              <span
                                key={st}
                                className={`h-1 w-3 rounded-full transition-all ${
                                  st <= job.stepNumber
                                    ? job.status === "Completed"
                                      ? "bg-emerald-400"
                                      : "bg-gold"
                                    : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
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

                      {/* Colorways */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-muted-foreground">
                          {job.colorsCount} colorways
                        </span>
                      </td>

                      {/* Optimization */}
                      <td className="px-4 py-3.5">
                        <span className="rounded bg-secondary/80 px-2 py-0.5 font-mono text-[11px] text-foreground border border-border">
                          {job.optimization}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3.5 font-mono text-muted-foreground">
                        {job.duration}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href="/dashboard/gallery"
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                          <ExternalLink className="size-3" />
                          <span>View Assets</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
