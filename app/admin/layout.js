"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin",            label: "Dashboard" },
  { href: "/admin/orders",     label: "Orders" },
  { href: "/admin/products",   label: "Products" },
  { href: "/admin/customers",  label: "Customers" },
];

export default function AdminLayout({ children }) {
  const { user, isAdmin, signOut, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login?next=" + pathname);
    else if (!isAdmin) router.replace("/account");
  }, [hydrated, user, isAdmin, router, pathname]);

  if (!user || !isAdmin) {
    return <div className="container-page py-16 text-center text-brand-deep/60">Checking access…</div>;
  }

  return (
    <div className="bg-brand-sand min-h-screen">
      <div className="container-page py-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <span className="section-eyebrow">CleanCutFish</span>
            <h1 className="font-display text-3xl text-brand-deep">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-brand-deep/60">{user.email}</span>
            <Link href="/" className="btn-ghost py-1.5 px-3 text-xs">Back to site</Link>
            <button onClick={() => { router.replace("/"); signOut(); }} className="btn-ghost py-1.5 px-3 text-xs">
              Sign out
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          <aside className="card p-3 h-fit space-y-1 lg:sticky lg:top-6">
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`block px-3 py-2 rounded-lg text-sm transition ${
                    active
                      ? "bg-brand-teal text-white font-semibold"
                      : "text-brand-deep/80 hover:bg-brand-mint/10"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
