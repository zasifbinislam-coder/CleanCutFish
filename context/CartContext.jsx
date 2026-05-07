"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "ccf_cart_v1";

function makeKey(productId, weightLabel) {
  return `${productId}::${weightLabel}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "add": {
      const { item } = action;
      const key = makeKey(item.productId, item.weightLabel);
      const existing = state.find((l) => l.key === key);
      if (existing) {
        return state.map((l) =>
          l.key === key ? { ...l, qty: l.qty + (item.qty || 1) } : l
        );
      }
      return [...state, { ...item, key, qty: item.qty || 1 }];
    }
    case "update": {
      return state.map((l) =>
        l.key === action.key ? { ...l, qty: Math.max(1, action.qty) } : l
      );
    }
    case "remove":
      return state.filter((l) => l.key !== action.key);
    case "clear":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [miniOpen, setMiniOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", payload: JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch {}
    }
  }, [lines, hydrated]);

  const value = useMemo(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
    const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
    return {
      lines,
      subtotal,
      itemCount,
      miniOpen,
      openMini: () => setMiniOpen(true),
      closeMini: () => setMiniOpen(false),
      toggleMini: () => setMiniOpen((v) => !v),
      addItem: (item) => {
        dispatch({ type: "add", item });
        setMiniOpen(true);
      },
      updateQty: (key, qty) => dispatch({ type: "update", key, qty }),
      removeItem: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [lines, miniOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function formatBDT(n) {
  return "৳" + Math.round(n).toLocaleString("en-BD");
}
