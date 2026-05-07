"use client";

import { formatBDT } from "@/context/CartContext";

// Hand-built SVG charts — no external chart library, ~3 KB.

// ---- Sparkline / area chart for revenue over time ---------------------------
export function RevenueLine({ orders, days = 30 }) {
  const buckets = bucketByDay(orders, days);
  const max = Math.max(1, ...buckets.map((b) => b.value));
  const W = 600, H = 160, P = 8;
  const stepX = (W - P * 2) / (buckets.length - 1);
  const points = buckets.map((b, i) => [
    P + i * stepX,
    H - P - (b.value / max) * (H - P * 2),
  ]);
  const path = points.map((p, i) => (i === 0 ? "M" : "L") + p[0] + " " + p[1]).join(" ");
  const area = `${path} L ${points[points.length - 1][0]} ${H - P} L ${points[0][0]} ${H - P} Z`;
  const total = buckets.reduce((s, b) => s + b.value, 0);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="section-eyebrow">Last {days} days</div>
          <div className="font-display text-2xl text-brand-deep">{formatBDT(total)} revenue</div>
        </div>
        <div className="text-xs text-brand-deep/60">{orders.length} orders total</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40">
        <defs>
          <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#15918F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#15918F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#rev)" />
        <path d={path} fill="none" stroke="#0D5C5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], i) =>
          buckets[i].value > 0 ? (
            <circle key={i} cx={x} cy={y} r="2.5" fill="#15918F" />
          ) : null
        )}
      </svg>
      <div className="flex justify-between text-[11px] text-brand-deep/55 mt-1">
        <span>{buckets[0]?.label}</span>
        <span>{buckets[Math.floor(buckets.length / 2)]?.label}</span>
        <span>{buckets[buckets.length - 1]?.label}</span>
      </div>
    </div>
  );
}

// ---- Donut for status distribution -----------------------------------------
const STATUS_COLORS = {
  received:  "#E9B44C",
  confirmed: "#0F5E8A",
  shipped:   "#3FB7A5",
  delivered: "#15918F",
  cancelled: "#E76F51",
};
const STATUS_LABEL = {
  received:  "Received",
  confirmed: "Confirmed",
  shipped:   "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusDonut({ orders }) {
  const counts = {};
  for (const o of orders) counts[o.status] = (counts[o.status] || 0) + 1;
  const total = orders.length || 1;
  const slices = Object.entries(counts).map(([status, n]) => ({
    status,
    n,
    pct: n / total,
    color: STATUS_COLORS[status] || "#aaa",
  }));

  // Build donut path segments.
  const cx = 60, cy = 60, r = 50, ir = 32;
  let acc = 0;
  const arcs = slices.map((s) => {
    const a0 = acc * 2 * Math.PI - Math.PI / 2;
    acc += s.pct;
    const a1 = acc * 2 * Math.PI - Math.PI / 2;
    return { ...s, d: arcPath(cx, cy, r, ir, a0, a1) };
  });

  return (
    <div className="card p-5">
      <div className="section-eyebrow">Order status</div>
      <h3 className="font-display text-xl text-brand-deep mb-3">Distribution</h3>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 120 120" className="w-32 h-32 shrink-0">
          {arcs.length === 0 ? (
            <circle cx={cx} cy={cy} r={r} fill="#eee" />
          ) : (
            arcs.map((a) => <path key={a.status} d={a.d} fill={a.color} />)
          )}
          <text x={cx} y={cy + 5} textAnchor="middle"
                className="font-display fill-brand-deep" fontSize="22" fontWeight="600">
            {orders.length}
          </text>
        </svg>
        <div className="flex-1 space-y-1.5 text-sm">
          {Object.keys(STATUS_LABEL).map((s) => (
            <div key={s} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: STATUS_COLORS[s] }} />
                {STATUS_LABEL[s]}
              </span>
              <span className="font-semibold">{counts[s] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Top products by revenue -----------------------------------------------
export function TopProducts({ orders, limit = 5 }) {
  const map = new Map();
  for (const o of orders) {
    for (const l of o.lines || []) {
      const cur = map.get(l.productId) || { name: l.name, revenue: 0, qty: 0 };
      cur.revenue += l.unitPrice * l.qty;
      cur.qty += l.qty;
      map.set(l.productId, cur);
    }
  }
  const top = [...map.entries()]
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
  const max = Math.max(1, ...top.map((t) => t.revenue));

  return (
    <div className="card p-5">
      <div className="section-eyebrow">Top sellers</div>
      <h3 className="font-display text-xl text-brand-deep mb-4">By revenue</h3>
      {top.length === 0 ? (
        <div className="text-brand-deep/55 text-sm">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {top.map((t) => (
            <div key={t.id}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-brand-deep truncate">{t.name}</span>
                <span className="text-brand-deep/70">{formatBDT(t.revenue)}</span>
              </div>
              <div className="h-2 bg-brand-sand rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-brand-mint to-brand-teal"
                  style={{ width: `${(t.revenue / max) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-brand-deep/55 mt-0.5">{t.qty} sold</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----- helpers --------------------------------------------------------------
function bucketByDay(orders, days) {
  const buckets = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets.push({
      key: d.toISOString().slice(0, 10),
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      value: 0,
    });
  }
  for (const o of orders) {
    const k = new Date(o.createdAt).toISOString().slice(0, 10);
    const b = buckets.find((x) => x.key === k);
    if (b) b.value += o.total || 0;
  }
  return buckets;
}

function arcPath(cx, cy, r, ir, a0, a1) {
  // For a full circle (single segment), draw a donut by stitching two arcs.
  if (Math.abs(a1 - a0) >= 2 * Math.PI - 0.0001) {
    return [
      `M ${cx + r} ${cy}`,
      `A ${r} ${r} 0 1 1 ${cx - r} ${cy}`,
      `A ${r} ${r} 0 1 1 ${cx + r} ${cy}`,
      `M ${cx + ir} ${cy}`,
      `A ${ir} ${ir} 0 1 0 ${cx - ir} ${cy}`,
      `A ${ir} ${ir} 0 1 0 ${cx + ir} ${cy}`,
      `Z`,
    ].join(" ");
  }
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
  const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
  return [
    `M ${x0} ${y0}`,
    `A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`,
    `L ${xi1} ${yi1}`,
    `A ${ir} ${ir} 0 ${large} 0 ${xi0} ${yi0}`,
    `Z`,
  ].join(" ");
}
