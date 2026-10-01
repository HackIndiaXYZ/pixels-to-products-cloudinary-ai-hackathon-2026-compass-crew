"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  WandSparkles,
  Dna,
  Boxes,
  Images,
  Zap,
  ChevronsUpDown,
  Settings,
  Menu,
  X,
  ChevronRight,
  Plus,
  Bell,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/create", label: "Create Studio", icon: WandSparkles },
  { href: "/dashboard/brand-dna", label: "Brand DNA Engine", icon: Dna },
  { href: "/dashboard/products", label: "Products Library", icon: Boxes },
  { href: "/dashboard/gallery", label: "Asset Gallery", icon: Images },
  { href: "/dashboard/pipeline", label: "Media Pipeline Jobs", icon: Zap, badge: "3" },
];

const BREADCRUMB_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/create": "New Generation",
  "/dashboard/brand-dna": "Brand DNA Engine",
  "/dashboard/products": "Products Library",
  "/dashboard/gallery": "Asset Gallery",
  "/dashboard/pipeline": "Media Pipeline Jobs",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentPageTitle = BREADCRUMB_TITLES[pathname] || "Overview";

  const renderNavLinks = () => (
    <ul className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`}
            >
              {isActive && (
                <span
                  className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gold shadow-[0_0_12px_rgb(201_162_39/0.8)]"
                  aria-hidden="true"
                />
              )}
              <Icon
                className={`size-4 ${isActive ? "text-gold" : "text-muted-foreground group-hover:text-foreground"}`}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-md bg-cyan/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-cyan">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="OmniStage AI home">
          <span className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-[#8a6d12] shadow-[0_0_24px_-4px_rgb(201_162_39/0.7)]">
            <Sparkles className="size-4 text-background" />
          </span>
          <span className="text-base font-bold tracking-tight">
            OmniStage<span className="ml-1 text-gold">AI</span>
          </span>
        </Link>
      </div>

      {/* Workspace Selector */}
      <div className="relative px-3 pt-4">
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="listbox"
          className="flex w-full items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent p-2.5 text-left transition-colors hover:border-white/15"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-background"
            style={{ backgroundColor: "#C9A227" }}
          >
            L
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold">LUXORA</span>
            <span className="block truncate text-xs text-muted-foreground">
              Minimalist Luxury
            </span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Nav List */}
      <nav aria-label="App" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Workspace
        </p>
        {renderNavLinks()}
      </nav>

      {/* Bottom Profile and Credits */}
      <div className="flex flex-col gap-3 border-t border-sidebar-border p-3">
        {/* Credits Widget */}
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Credits</span>
            <span className="font-mono text-muted-foreground">420 / 500</span>
          </div>
          <div
            className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={84}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Credits used"
          >
            <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-gold to-cyan" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            84% used · resets Oct 1
          </p>
          <Link
            href="/#pricing"
            className="mt-3 block text-xs font-medium text-gold hover:underline"
          >
            Upgrade to Pro
          </Link>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 rounded-xl p-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1d2a4a] to-[#3b4a63] text-xs font-semibold">
            AM
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-medium">Ava Moreau</span>
            <span className="block truncate text-xs text-muted-foreground">
              ava@luxora.co
            </span>
          </span>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-background">
      {/* ── Desktop Persistent Sidebar ── */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-sidebar-border lg:block">
        {renderSidebarContent()}
      </aside>

      {/* ── Mobile Slide-out Drawer ── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileSidebarOpen}
      >
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar transition-transform duration-300 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute right-3 top-4 z-10 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5"
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
          {renderSidebarContent()}
        </aside>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-1.5 truncate text-sm">
              <li className="hidden text-muted-foreground sm:block">Workspace</li>
              <li className="hidden sm:block" aria-hidden="true">
                <ChevronRight className="size-3.5 text-muted-foreground/60" />
              </li>
              <li className="hidden text-muted-foreground sm:block">LUXORA</li>
              <li className="hidden sm:block" aria-hidden="true">
                <ChevronRight className="size-3.5 text-muted-foreground/60" />
              </li>
              <li className="truncate font-medium" aria-current="page">
                {currentPageTitle}
              </li>
            </ol>
          </nav>

          {/* CDN Status */}
          <span className="hidden items-center gap-2 rounded-full border border-[#4ade80]/25 bg-[#4ade80]/[0.07] px-3 py-1 text-xs font-medium text-[#4ade80] md:inline-flex">
            <span className="relative flex size-2">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#4ade80]" />
              <span className="relative size-2 rounded-full bg-[#4ade80]" />
            </span>
            CDN Pipeline Active
          </span>

          {/* New Product CTA */}
          <Link
            href="/dashboard/create"
            className="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary px-3 h-9 text-sm font-semibold text-primary-foreground glow-gold hover:bg-[#d9b43c] gap-1.5 transition-all"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Product Generation</span>
            <span className="sr-only sm:hidden">New Product Generation</span>
          </Link>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Notifications, 2 unread"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-gold" />
          </button>

          {/* User Account Avatar */}
          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1d2a4a] to-[#3b4a63] text-xs font-semibold sm:flex"
            aria-label="Account menu"
          >
            AM
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
