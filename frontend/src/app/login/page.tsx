"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithEmail, signInWithGoogle, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmail(email.trim(), password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in. Please check credentials.";
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in was cancelled or failed.";
      setLocalError(msg);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0a0d14] text-[#eef2f7] overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-gradient-to-b from-[#c9a227]/15 to-transparent blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Brand Header */}
      <Link href="/" className="mb-8 flex items-center gap-2.5 transition-transform hover:scale-105">
        <span className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a227] to-[#8a6d12] shadow-[0_0_30px_-4px_rgb(201_162_39/0.7)]">
          <Sparkles className="size-5 text-[#0a0d14]" />
        </span>
        <span className="text-xl font-bold tracking-tight text-white">
          OmniStage<span className="ml-1 text-[#c9a227]">AI</span>
        </span>
      </Link>

      {/* Auth Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#10141f]/80 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Sign in to continue to your product generation studio.
          </p>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-400" />
            <div className="flex-1">{displayError}</div>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSubmitting || isSubmitting}
          className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 py-2.5 px-4 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/25 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleSubmitting ? (
            <Loader2 className="size-4 animate-spin text-[#c9a227]" />
          ) : (
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-white/10" />
          <span className="absolute bg-[#10141f] px-3 text-xs uppercase tracking-wider text-[#64748b]">
            or with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#64748b]" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-[#64748b] transition-all focus:border-[#c9a227] focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#94a3b8]" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#64748b]" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-[#64748b] transition-all focus:border-[#c9a227] focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#e5bc3b] py-2.5 px-4 text-sm font-semibold text-[#0a0d14] shadow-[0_0_20px_-4px_rgb(201_162_39/0.6)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin text-[#0a0d14]" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#94a3b8]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#c9a227] hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>

      <p className="mt-8 text-xs text-[#64748b]">
        OmniStage AI &copy; 2026. High-Fidelity Product Media Workspace.
      </p>
    </div>
  );
}
