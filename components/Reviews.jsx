"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { IconStar } from "@/components/Icon";

export default function Reviews({ productId }) {
  const supabase = getSupabaseBrowser();
  const { user, orders } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ rating: 5, body: "" });
  const [error, setError] = useState("");

  async function load() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("reviews").select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [supabase, productId]);

  // Has the current user actually ordered this product?
  const hasOrdered = !!user && (orders || []).some((o) =>
    (o.lines || []).some((l) => l.productId === productId)
  );
  const myReview = reviews.find((r) => r.user_id === user?.id);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!user) return setError("Please sign in to leave a review.");
    const row = {
      product_id: productId,
      user_id: user.id,
      user_name: user.name,
      rating: Number(draft.rating),
      body: draft.body || null,
    };
    const { error } = await supabase
      .from("reviews")
      .upsert(row, { onConflict: "product_id,user_id" });
    if (error) return setError(error.message);
    setShowForm(false);
    setDraft({ rating: 5, body: "" });
    load();
  }

  async function removeMine() {
    if (!myReview) return;
    if (!confirm("Delete your review?")) return;
    await supabase.from("reviews").delete().eq("id", myReview.id);
    load();
  }

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <span className="section-eyebrow">Customer reviews</span>
          <h2 className="font-display text-3xl text-brand-deep mt-1">
            {avg !== null
              ? <>{avg.toFixed(1)} ★ <span className="text-base text-brand-deep/55">({reviews.length} reviews)</span></>
              : "No reviews yet"}
          </h2>
        </div>
        {user ? (
          myReview ? (
            <div className="flex gap-2">
              <button onClick={() => { setDraft({ rating: myReview.rating, body: myReview.body || "" }); setShowForm(true); }}
                      className="btn-ghost text-sm">Edit my review</button>
              <button onClick={removeMine} className="text-sm text-rose-600 hover:underline">Delete</button>
            </div>
          ) : hasOrdered ? (
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
              Write a review
            </button>
          ) : (
            <span className="text-xs text-brand-deep/55 max-w-[260px] text-right">
              Buy this product to leave a verified review.
            </span>
          )
        ) : (
          <a href="/login" className="btn-ghost text-sm">Sign in to review</a>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="card p-5 mb-5 space-y-3">
          {error && <div className="text-sm text-rose-700 bg-rose-50 px-3 py-2 rounded-xl">{error}</div>}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDraft({ ...draft, rating: n })}
                  className={`text-3xl transition ${
                    n <= draft.rating ? "text-accent-gold" : "text-brand-deep/20"
                  }`}
                  aria-label={`${n} stars`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">
              Your review (optional)
            </label>
            <textarea
              rows={4} className="input"
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              placeholder="How did the fish cook up? Quality, freshness, packaging..."
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Submit</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-brand-deep/60 text-sm">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="card p-8 text-center text-brand-deep/60">
          Be the first to leave a review for this fish.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-0.5 text-accent-gold">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <IconStar key={i} width={14} height={14} />
                  ))}
                </div>
                <span className="text-xs text-brand-deep/55">
                  {new Date(r.created_at).toLocaleDateString("en-BD")}
                </span>
              </div>
              {r.body && <p className="text-sm text-brand-deep/85 leading-relaxed">{r.body}</p>}
              <div className="text-xs text-brand-deep/60 mt-3">— {r.user_name}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
