/**
 * Transactional email via Resend. Graceful: if RESEND_API_KEY is unset
 * we log to console and return ok so the request still succeeds in dev
 * and on day one. Same pattern as websitelagbo.com.
 *
 * Env:
 *   RESEND_API_KEY     required to actually send
 *   EMAIL_FROM         defaults to onboarding@resend.dev (sandbox)
 *   EMAIL_FROM_NAME    display name on the From header
 *   ORDER_ADMIN_EMAIL  receives the admin alert; defaults to Sir's address
 */

const FROM_DEFAULT = process.env.EMAIL_FROM || "onboarding@resend.dev";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "CleanCutFish";

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[email] (no RESEND_API_KEY) would send:", { to, subject });
    return true;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_DEFAULT}>`,
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[email] resend error", res.status, text);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] unexpected", err);
    return false;
  }
}

const wrap = (inner) => `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;line-height:1.6">
  <div style="border-bottom:2px solid #0e4d6b;padding-bottom:12px;margin-bottom:20px">
    <strong style="font-size:18px;color:#0e4d6b">🐟 CleanCutFish</strong>
  </div>
  ${inner}
  <hr style="border:none;border-top:1px solid #eee;margin:28px 0 16px"/>
  <p style="font-size:12px;color:#888">
    Reply to this email if you have any questions, or write to
    <a href="mailto:hello@cleancutfish.com.bd" style="color:#0e4d6b">hello@cleancutfish.com.bd</a>.
  </p>
</div>`;

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatBdt(n) {
  const num = Number(n) || 0;
  return `৳${num.toLocaleString("en-IN")}`;
}

function lineItems(lines = []) {
  return lines
    .map(
      (l) =>
        `<tr>
           <td style="padding:6px 0;color:#333">${escapeHtml(l.name)} ·
             <span style="color:#888">${escapeHtml(l.weightLabel ?? "")} × ${l.qty ?? 1}</span></td>
           <td style="padding:6px 0;text-align:right;font-variant-numeric:tabular-nums">${formatBdt(
             (l.unitPrice ?? 0) * (l.qty ?? 1)
           )}</td>
         </tr>`
    )
    .join("");
}

export function orderReceivedCustomerEmail(order) {
  const methodLabel =
    order.method === "cod"
      ? "Cash on Delivery"
      : order.method === "bkash"
      ? "bKash"
      : order.method === "nagad"
      ? "Nagad"
      : order.method ?? "—";
  return wrap(`
    <p>আসসালামু আলাইকুম <strong>${escapeHtml(order.name)}</strong>,</p>
    <p>আপনার অর্ডার <code style="background:#f4f4f4;padding:2px 6px;border-radius:4px">${escapeHtml(order.id)}</code>
       আমাদের কাছে এসেছে।</p>
    ${
      order.method !== "cod" && order.txnId
        ? `<p>${methodLabel} TrxID <code>${escapeHtml(order.txnId)}</code> verify করা হবে এবং ১২ ঘণ্টার মধ্যে delivery slot নিশ্চিত করব।</p>`
        : `<p>আমাদের টিম ১২ ঘণ্টার মধ্যে call করে delivery slot নিশ্চিত করবে।</p>`
    }
    <h3 style="font-size:14px;margin-top:24px;margin-bottom:8px;color:#0e4d6b">Order summary</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${lineItems(order.lines)}
      <tr><td colspan="2" style="border-top:1px solid #eee"></td></tr>
      <tr>
        <td style="padding:6px 0;color:#666">Subtotal</td>
        <td style="padding:6px 0;text-align:right">${formatBdt(order.subtotal)}</td>
      </tr>
      ${
        order.discount
          ? `<tr>
              <td style="padding:6px 0;color:#0e4d6b">Discount</td>
              <td style="padding:6px 0;text-align:right;color:#0e4d6b">−${formatBdt(order.discount)}</td>
            </tr>`
          : ""
      }
      <tr>
        <td style="padding:6px 0;color:#666">Delivery</td>
        <td style="padding:6px 0;text-align:right">${
          order.delivery ? formatBdt(order.delivery) : "Free"
        }</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-weight:600;border-top:1px solid #eee">Total</td>
        <td style="padding:6px 0;text-align:right;font-weight:600;border-top:1px solid #eee">${formatBdt(
          order.total
        )}</td>
      </tr>
    </table>
    <p style="margin-top:18px;color:#555;font-size:13px">
      Payment: <strong>${escapeHtml(methodLabel)}</strong>
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
    <p style="font-size:13px;color:#555"><em>English:</em> We received your
      order ${escapeHtml(order.id)} and will confirm a delivery slot within
      12 hours.</p>
  `);
}

export function orderReceivedAdminEmail(order) {
  return wrap(`
    <h2 style="margin:0 0 8px">🆕 New order: ${escapeHtml(order.id)}</h2>
    <p style="color:#555">
      ${escapeHtml(order.name)} · <a href="tel:${escapeHtml(order.phone)}">${escapeHtml(order.phone)}</a>
      ${order.email ? `· <a href="mailto:${escapeHtml(order.email)}">${escapeHtml(order.email)}</a>` : ""}
    </p>
    <p style="color:#555;margin:6px 0">
      ${escapeHtml(order.address)}, ${escapeHtml(order.city)}${order.zone ? ` (${escapeHtml(order.zone)})` : ""}
    </p>
    <p style="color:#555;margin:6px 0">
      Payment: <strong>${escapeHtml(order.method ?? "—")}</strong>${
    order.txnId ? ` · TrxID <code>${escapeHtml(order.txnId)}</code>` : ""
  }
    </p>
    ${order.notes ? `<p style="color:#555;margin:6px 0"><em>Notes:</em> ${escapeHtml(order.notes)}</p>` : ""}
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px">
      ${lineItems(order.lines)}
      <tr>
        <td style="padding:8px 0;border-top:1px solid #eee;font-weight:600">Total</td>
        <td style="padding:8px 0;text-align:right;border-top:1px solid #eee;font-weight:600">${formatBdt(
          order.total
        )}</td>
      </tr>
    </table>
  `);
}
