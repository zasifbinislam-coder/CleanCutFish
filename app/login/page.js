"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";

function LoginInner() {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    if (typeof window !== "undefined") router.replace(next);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await signIn({ email: f.get("email"), password: f.get("password") });
    setLoading(false);
    if (!res.ok) return setError(res.error);
    router.push(res.user?.role === "admin" ? "/admin" : next);
  }

  return (
    <div className="container-page py-16 max-w-md">
      <div className="text-center mb-8">
        <span className="section-eyebrow">Welcome back</span>
        <h1 className="section-title mt-1">Sign in</h1>
        <p className="text-sm text-brand-deep/60 mt-2">
          Track your orders, save addresses, faster checkout.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">Email</label>
          <input name="email" type="email" required className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">Password</label>
          <input name="password" type="password" required className="input" placeholder="••••••••" />
        </div>
        <button disabled={loading} type="submit" className="btn-primary w-full">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-xs text-center text-brand-deep/60">
          Don't have an account?{" "}
          <Link href="/signup" className="text-brand-teal font-semibold hover:underline">Create one</Link>
        </p>
      </form>

      <div className="mt-6 card p-4 text-xs text-brand-deep/65">
        <b className="text-brand-deep">Demo admin:</b> admin@cleancutfish.com / admin123
        <div className="text-[11px] mt-1 text-brand-deep/55">
          (Once you've run <code>npm run create-admin</code> from the project folder.)
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="container-page py-16">Loading…</div>}><LoginInner /></Suspense>;
}
