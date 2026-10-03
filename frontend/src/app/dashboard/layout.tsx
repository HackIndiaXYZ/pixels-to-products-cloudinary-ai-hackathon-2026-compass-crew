"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  WandSparkles,
  Dna,
  Boxes,
  Images,
  Zap,
  ChevronsUpDown,
  Menu,
  X,
  ChevronRight,
  Plus,
  Bell,
  LogOut,
  User as UserIcon,
  Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const emptySubscribe = () => () => {};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/create", label: "Create Studio", icon: WandSparkles },
  { href: "/dashboard/brand-dna", label: "Brand DNA Engine", icon: Dna },
  { href: "/dashboard/products", label: "Products Library", icon: Boxes },
  { href: "/dashboard/gallery", label: "Asset Gallery", icon: Images },
  { href: "/dashboard/pipeline", label: "Media Pipeline Jobs", icon: Zap },
];

const BREADCRUMB_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/create": "Create Studio",
  "/dashboard/brand-dna": "Brand DNA Engine",
  "/dashboard/products": "Products Library",
  "/dashboard/gallery": "Asset Gallery",
  "/dashboard/pipeline": "Media Pipeline Jobs",
};

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [activeBrandName, setActiveBrandName] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("omnistage_active_brand") || "LUXORA"
      : "LUXORA"
  );
  const [activeJobCount, setActiveJobCount] = useState<number>(0);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Cloudinary CDN connection verified and active",
      time: "Just now",
      read: false,
    },
    {
      id: "2",
      title: "OmniStage AI vision analysis engine ready",
      time: "2m ago",
      read: false,
    },
    {
      id: "3",
      title: "Brand DNA Engine synchronized with workspace",
      time: "15m ago",
      read: true,
    },
  ]);

  const { user, loading, logout } = useAuth();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Fetch real active job count
  useEffect(() => {
    if (!user) return;
    api.getGenerationJobs()
      .then((jobs) => {
        const active = jobs.filter((j) => j.status !== "COMPLETED" && j.status !== "FAILED").length;
        setActiveJobCount(active);
      })
      .catch(() => {
        // quiet error
      });
  }, [user, pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const selectBrand = (brandName: string) => {
    setActiveBrandName(brandName);
    if (typeof window !== "undefined") {
      localStorage.setItem("omnistage_active_brand", brandName);
    }
    setShowWorkspaceMenu(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const userName =
    mounted && user?.full_name
      ? user.full_name
      : mounted && user?.email
      ? user.email.split("@")[0]
      : "User";

  const userEmail = mounted && user?.email ? user.email : "";

  const userInitials =
    mounted && user?.full_name
      ? user.full_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : mounted && user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "U";

  const currentPageTitle = BREADCRUMB_TITLES[pathname] || "Overview";

  const renderNavLinks = () => (
    <ul className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        const badge = item.href === "/dashboard/pipeline" && activeJobCount > 0
          ? String(activeJobCount)
          : undefined;

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
              {badge && (
                <span className="rounded-md bg-cyan/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-cyan">
                  {badge}
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
          onClick={() => setShowWorkspaceMenu((prev) => !prev)}
          aria-expanded={showWorkspaceMenu}
          aria-haspopup="listbox"
          className="flex w-full items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent p-2.5 text-left transition-colors hover:border-white/15"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-background"
            style={{ backgroundColor: activeBrandName === "VANTA" ? "#00F2FE" : activeBrandName === "TERRA" ? "#C9A877" : "#C9A227" }}
          >
            {activeBrandName[0]}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold">{activeBrandName}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {activeBrandName === "VANTA" ? "Urban Streetwear" : activeBrandName === "TERRA" ? "Earthy Natural" : "Minimalist Luxury"}
            </span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </button>

        {/* Dropdown Menu for Workspace */}
        {showWorkspaceMenu && (
          <div className="absolute left-3 right-3 top-full z-40 mt-1 rounded-xl border border-sidebar-border bg-card p-1.5 shadow-xl">
            {[
              { name: "LUXORA", desc: "Minimalist Luxury", color: "#C9A227" },
              { name: "VANTA", desc: "Urban Streetwear", color: "#00F2FE" },
              { name: "TERRA", desc: "Earthy Natural", color: "#C9A877" },
            ].map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => selectBrand(b.name)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-secondary ${
                  activeBrandName === b.name ? "bg-secondary/70 text-foreground" : "text-muted-foreground"
                }`}
              >
                <span
                  className="size-3.5 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                <span className="font-semibold text-foreground flex-1">{b.name}</span>
                {activeBrandName === b.name && <Check className="size-3 text-gold" />}
              </button>
            ))}
          </div>
        )}
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
        <div className="flex items-center gap-3 rounded-xl p-2 bg-white/[0.03] border border-white/5">
          <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1d2a4a] to-[#3b4a63] text-xs font-semibold text-white">
            {userInitials}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-medium text-white">{userName}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {userEmail}
            </span>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
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
              <li className="hidden text-muted-foreground sm:block">{activeBrandName}</li>
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

          {/* Notification Bell with Panel */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
              }}
              className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-gold" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card p-3 shadow-2xl z-50">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-gold hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="mt-2 space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-lg p-2 text-xs transition-colors ${
                        item.read ? "bg-muted/20 text-muted-foreground" : "bg-gold/10 text-foreground font-medium"
                      }`}
                    >
                      <p>{item.title}</p>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account Avatar with Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
              className="hidden size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1d2a4a] to-[#3b4a63] text-xs font-semibold sm:flex text-white hover:ring-2 hover:ring-gold/50 transition-all"
              title={`Signed in as ${userEmail}`}
              aria-label="Account menu"
            >
              {userInitials}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card p-3 shadow-2xl z-50">
                <div className="flex items-center gap-2.5 border-b border-border pb-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1d2a4a] to-[#3b4a63] text-xs font-semibold text-white">
                    {userInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{userName}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{userEmail}</p>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground">
                    <UserIcon className="size-3.5 text-gold" />
                    <span>Workspace: {activeBrandName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
