"use client";

import { useEffect, useState } from "react";

/**
 * Floating WhatsApp CTA — sits bottom-right on every page. Opens
 * wa.me/<number> with a pre-filled message. Hidden on /admin and
 * /checkout (admin doesn't need it, checkout has its own flow).
 *
 * Number is read from NEXT_PUBLIC_WHATSAPP_NUMBER (E.164 without +)
 * with the production sender as the default. Message is bilingual
 * — pre-fills 'I want to order' so the customer doesn't have to
 * compose anything before being on the chat.
 */
const DEFAULT_NUMBER = "8801920262202";

export default function WhatsAppButton() {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
    const onNav = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onNav);
    return () => window.removeEventListener("popstate", onNav);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_NUMBER;
  const message = encodeURIComponent(
    "আসসালামু আলাইকুম! আমি CleanCutFish থেকে মাছ অর্ডার করতে চাই।"
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-xl px-4 py-3 text-sm font-semibold transition-all hover:scale-105 active:scale-100"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.18 1.6 6.01L0 24l6.16-1.61A11.95 11.95 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 21.82a9.82 9.82 0 0 1-5-1.37l-.36-.22-3.66.96.98-3.56-.24-.37A9.82 9.82 0 1 1 21.82 12 9.83 9.83 0 0 1 12 21.82zm5.4-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48a9.04 9.04 0 0 1-1.67-2.08c-.17-.3 0-.46.13-.61.13-.13.3-.34.46-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.59-.9-2.18-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.5.07-.76.37-.27.3-1 1-1 2.43s1.02 2.82 1.16 3.02c.15.2 2.02 3.08 4.9 4.32 1.91.83 2.66.9 3.62.76.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.31.17-1.43-.07-.13-.27-.2-.57-.35z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
