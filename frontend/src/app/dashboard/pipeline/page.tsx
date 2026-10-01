"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

interface PipelineJob {
  id: string;
  name: string;
  sku: string;
  image: string;
  stage: "QUEUED" | "ANALYZING" | "GENERATING" | "TRANSFORMING" | "OPTIMIZING" | "COMPLETED";
  stepNumber: number;
  ratios: string[];
  colorsCount: number;
  optimization: string;
  duration: string;
  status: "Running" | "Completed" | "Queued";
}

const PIPELINE_JOBS: PipelineJob[] = [
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
  {
    id: "JOB-8839",
    name: "Aero Low Suede Sneaker",
    sku: "LX-SNK-043",
    image: "/products/sneaker-sand.png",
    stage: "COMPLETED",
    stepNumber: 6,
    ratios: ["1:1", "4:5", "9:16"],
    colorsCount: 2,
    optimization: "f_auto,q_auto",
    duration: "24s total",
    status: "Completed",
  },
  {
    id: "JOB-8838",
    name: "Aero Low Onyx Edition",
    sku: "LX-SNK-044",
    image: "/products/sneaker-onyx.png",
    stage: "QUEUED",
    stepNumber: 1,
    ratios: ["1:1", "16:9"],
    colorsCount: 2,
    optimization: "Pending worker",
    duration: "In queue",
    status: "Queued",
  },
  {
    id: "JOB-8837",
    name: "Aero Low Crimson Drop",
    sku: "LX-SNK-045",
    image: "/products/sneaker-crimson.png",
    stage: "ANALYZING",
    stepNumber: 2,
    ratios: ["1:1"],
    colorsCount: 1,
    optimization: "Keypoint extraction",
    duration: "4s elapsed",
    status: "Running",
  },
];

export default function PipelinePage() {
  const [filterTab, setFilterTab] = useState<string>("All");

  const stageCounts = {
    QUEUED: 1,
    ANALYZING: 1,
    GENERATING: 1,
    TRANSFORMING: 0,
    OPTIMIZING: 1,
    COMPLETED: 2,
  };

  const filteredJobs = PIPELINE_JOBS.filter((job) => {
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-gold/40 hover:bg-secondary/80"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh Queue</span>
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
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="transition-colors hover:bg-muted/20">
                    {/* Job ID & Product */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                          <Image
                            src={job.image}
                            alt={job.name}
                            fill
                            sizes="36px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <div className="font-mono text-[11px] font-bold text-gold">{job.id}</div>
                          <div className="font-semibold text-foreground">{job.name}</div>
                          <div className="font-mono text-[10px] text-muted-foreground">{job.sku}</div>
                        </div>
                      </div>
                    </td>

                    {/* Pipeline Stage */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {job.stage === "GENERATING" && (
                            <>
                              <Loader2 className="size-3 animate-spin text-gold" />
                              <span className="font-mono text-[11px] font-semibold text-gold">
                                GENERATING
                              </span>
                            </>
                          )}
                          {job.stage === "OPTIMIZING" && (
                            <>
                              <Loader2 className="size-3 animate-spin text-cyan" />
                              <span className="font-mono text-[11px] font-semibold text-cyan">
                                OPTIMIZING
                              </span>
                            </>
                          )}
                          {job.stage === "ANALYZING" && (
                            <>
                              <Loader2 className="size-3 animate-spin text-purple-400" />
                              <span className="font-mono text-[11px] font-semibold text-purple-400">
                                ANALYZING
                              </span>
                            </>
                          )}
                          {job.stage === "COMPLETED" && (
                            <>
                              <CheckCircle2 className="size-3 text-emerald-400" />
                              <span className="font-mono text-[11px] font-semibold text-emerald-400">
                                COMPLETED
                              </span>
                            </>
                          )}
                          {job.stage === "QUEUED" && (
                            <>
                              <Clock className="size-3 text-muted-foreground" />
                              <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                                QUEUED
                              </span>
                            </>
                          )}
                        </div>
                        {/* Progress Dots */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5, 6].map((st) => (
                            <span
                              key={st}
                              className={`h-1 w-2.5 rounded-full ${
                                st <= job.stepNumber
                                  ? job.stage === "COMPLETED"
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
                        {job.ratios.map((r) => (
                          <span
                            key={r}
                            className="rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Colorways */}
                    <td className="px-4 py-3.5 font-mono text-muted-foreground">
                      {job.colorsCount} colorways
                    </td>

                    {/* Cloudinary Optimization */}
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-secondary/80 px-2 py-0.5 font-mono text-[11px] text-cyan">
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
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        <ExternalLink className="size-3" />
                        <span>View Assets</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
