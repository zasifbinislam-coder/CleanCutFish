"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { IconCart, IconSearch, IconMenu, IconUser, IconHeart } from "@/components/Icon";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?cat=large-river", label: "River Fish" },
  { href: "/shop?cat=small", label: "Small Fish" },
  { href: "/shop?cat=shrimp", label: "Shrimp" },
  { href: "/shop?cat=shutki", label: "Shutki" },
  { href: "/combos", label: "Combo Packs" },
  { href: "/about", label: "Our Story" },
];

export default function Header() {
  const router = useRouter();
  const { itemCount, toggleMini } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const { count: wishCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const userRef = useRef(null);

  function submitSearch(e) {
    e.preventDefault();
    const q = searchQ.trim();
    if (!q) return router.push("/shop");
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  useEffect(() => {
    function onClick(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b border-brand-deep/10">
      <div className="bg-brand-deep text-brand-cream text-[11px] sm:text-xs">
        <div className="container-page flex justify-between gap-3 py-1.5">
          <span className="truncate">
            <span className="hidden sm:inline">৳ </span>
            Free delivery in Dhaka over ৳1,500
            <span className="hidden md:inline"> · Same-day cut, next-day doorstep</span>
          </span>
          <span className="hidden sm:inline whitespace-nowrap">Call us · +880 1700-000000</span>
        </div>
      </div>

      <div className="container-page flex items-center gap-2 sm:gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-lg sm:text-xl text-brand-deep group-hover:text-brand-teal transition">
              CleanCutFish
            </div>
            <div className="hidden sm:block text-[10px] tracking-[0.18em] uppercase text-brand-teal">
              River → Cut → Cooked
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 ml-6 text-sm text-brand-deep/80">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap hover:text-brand-teal transition">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <form onSubmit={submitSearch} className="hidden xl:flex items-center bg-brand-sand rounded-full pl-3 pr-1 py-1">
          <IconSearch className="text-brand-deep/60" />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search Ilish, Ayre..."
            className="bg-transparent outline-none px-2 text-sm w-36"
          />
          {searchQ && (
            <button type="submit" className="text-xs px-2 py-0.5 rounded-full bg-brand-teal text-white">
              Go
            </button>
          )}
        </form>

        <div ref={userRef} className="relative">
          {user ? (
            <button
              onClick={() => setUserMenu((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-brand-sand hover:bg-brand-mint/15 px-3 py-1.5 transition whitespace-nowrap"
              aria-label="Account menu"
            >
              <span className="grid place-items-center w-7 h-7 rounded-full bg-brand-teal text-white text-xs font-bold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </span>
              <span className="hidden sm:inline text-sm text-brand-deep font-medium max-w-[100px] truncate">
                {user.name?.split(" ")[0]}
              </span>
            </button>
          ) : (
            <Link href="/login" className="hidden sm:flex items-center gap-1.5 text-sm text-brand-deep/85 hover:text-brand-teal transition whitespace-nowrap">
              <IconUser width={18} height={18} />
              Sign in
            </Link>
          )}

          {user && userMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 card p-2 shadow-soft text-sm">
              <div className="px-3 py-2 border-b border-brand-deep/10 mb-1">
                <div className="font-semibold text-brand-deep truncate">{user.name}</div>
                <div className="text-xs text-brand-deep/55 truncate">{user.email}</div>
              </div>
              <Link href="/account" onClick={() => setUserMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-brand-mint/10">
                My account
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setUserMenu(false)} className="block px-3 py-2 rounded-lg hover:bg-brand-mint/10 text-accent-coral font-semibold">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={async () => { await signOut(); setUserMenu(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-brand-mint/10 text-brand-deep/75"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="relative hidden md:grid place-items-center rounded-full bg-white border border-brand-deep/15 text-brand-deep p-2.5 hover:bg-accent-coral hover:text-white hover:border-accent-coral transition"
        >
          <IconHeart filled={wishCount > 0} />
          {wishCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent-coral text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {wishCount}
            </span>
          )}
        </Link>

        <button
          onClick={toggleMini}
          aria-label="Open cart"
          className="relative rounded-full bg-brand-deep text-white p-2.5 hover:bg-brand-ocean transition shrink-0"
        >
          <IconCart />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent-coral text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>

        <button
          className="lg:hidden p-2 text-brand-deep shrink-0"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <IconMenu />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-brand-deep/10 bg-white">
          <div className="container-page py-3 flex flex-col gap-1">
            <form onSubmit={submitSearch} className="md:hidden flex items-center bg-brand-sand rounded-full pl-3 pr-1 py-1 mb-2">
              <IconSearch className="text-brand-deep/60" width={18} height={18}/>
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search fish..."
                className="bg-transparent outline-none px-2 text-sm flex-1"
              />
              {searchQ && <button type="submit" className="text-xs px-2 py-0.5 rounded-full bg-brand-teal text-white">Go</button>}
            </form>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-brand-deep/85 hover:text-brand-teal"
              >
                {n.label}
              </Link>
            ))}
            <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="py-2 text-brand-deep/85">
              ❤ Wishlist {wishCount > 0 && <span className="text-brand-teal">({wishCount})</span>}
            </Link>
            <Link href="/faq" onClick={() => setMobileOpen(false)} className="py-2 text-brand-deep/85">FAQ</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-2 text-brand-deep/85">Contact</Link>
            <div className="border-t border-brand-deep/10 my-2" />
            {user ? (
              <>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="py-2">My account</Link>
                <Link href="/account/addresses" onClick={() => setMobileOpen(false)} className="py-2 text-brand-deep/80">📍 Address book</Link>
                {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="py-2 text-accent-coral font-semibold">Admin Panel</Link>}
                <button onClick={async () => { await signOut(); setMobileOpen(false); }} className="py-2 text-left text-brand-deep/75">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="py-2">Sign in</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="py-2 text-brand-teal">Create account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <span className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-deep text-white shadow-soft">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12c3-5 8-6 12-4 1 .5 2 1.2 2.5 2l3-1-1 3 1 3-3-1c-.6.8-1.5 1.5-2.5 2-4 2-9 1-12-4z" />
        <circle cx="15" cy="11" r="0.7" fill="currentColor" />
        <path d="M3 12c1 .5 1.5 1.2 2 2M3 12c1-.5 1.5-1.2 2-2" />
      </svg>
    </span>
  );
}
