"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const KEY = "ccf_wishlist_v1";

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {}
    }
  }, [ids, hydrated]);

  const value = useMemo(() => ({
    ids,
    count: ids.length,
    has: (id) => ids.includes(id),
    toggle: (id) => setIds((curr) => curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]),
    remove: (id) => setIds((curr) => curr.filter((x) => x !== id)),
    clear: () => setIds([]),
  }), [ids]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
