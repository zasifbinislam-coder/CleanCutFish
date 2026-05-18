import { ImageResponse } from "next/og";

// Node runtime keeps glyph rendering reliable for ASCII layouts. The
// gradient + monogram does the brand work without needing fancy fonts.
export const runtime = "nodejs";

// next/og's prerender path hits a fileURLToPath bug on Windows during
// `next build`. Skip static generation — Vercel still caches the
// generated image at the CDN edge so there's no real cost.
export const dynamic = "force-dynamic";

export const alt = "CleanCutFish — River-fresh fish, cleaned, cut, vacuum sealed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #062a39 0%, #0e4d6b 55%, #1f8a9e 100%)",
          color: "#f4f7f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            CCF
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              opacity: 0.95,
            }}
          >
            CleanCutFish
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 86,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              maxWidth: 1000,
            }}
          >
            Direct from river to kitchen.
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 400,
              opacity: 0.88,
              maxWidth: 960,
              lineHeight: 1.35,
            }}
          >
            Padma, Meghna, Dhonu, Tanguar Haor &mdash; cleaned, cut, vacuum sealed.
            Doorstep delivery across Dhaka.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: 0.9,
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <span>Ilish</span>
            <span style={{ opacity: 0.5 }}>/</span>
            <span>Ruhi</span>
            <span style={{ opacity: 0.5 }}>/</span>
            <span>Chingri</span>
          </div>
          <div style={{ fontSize: 22, opacity: 0.8 }}>cleancutfish.com.bd</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
