"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signUp, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    if (typeof window !== "undefined") router.replace("/account");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const f = new FormData(e.currentTarget);
    if (f.get("password").length < 6) {
      setLoading(false);
      return setError("Password must be at least 6 characters.");
    }
    const res = await signUp({
      name: f.get("name"),
      email: f.get("email"),
      phone: f.get("phone"),
      password: f.get("password"),
    });
    setLoading(false);
    if (!res.ok) return setError(res.error);
    if (res.needsConfirm) {
      setError(res.message);
      return;
    }
    router.push("/account");
  }

  return (
    <div className="container-page py-16 max-w-md">
      <div className="text-center mb-8">
        <span className="section-eyebrow">New customer</span>
        <h1 className="section-title mt-1">Create your account</h1>
      </div>

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <Field name="name" label="Full name" required />
        <Field name="email" type="email" label="Email" required />
        <Field name="phone" label="Phone (BD)" placeholder="01XXXXXXXXX" />
        <Field name="password" type="password" label="Password" required placeholder="At least 6 characters" />
        <button disabled={loading} type="submit" className="btn-primary w-full">
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="text-xs text-center text-brand-deep/60">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-teal font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="text-[11px] text-center text-brand-deep/55">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> &{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}

function Field({ name, label, type = "text", ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">{label}</label>
      <input name={name} type={type} className="input" {...rest} />
    </div>
  );
}
