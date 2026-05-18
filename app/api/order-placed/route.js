/**
 * Fire-and-forget order receipts. The Supabase insert happens
 * client-side in AuthContext.placeOrder; this route only handles the
 * outbound emails so it doesn't slow the checkout success page.
 *
 * Body: full order row (id, name, email, phone, lines, totals, …).
 * Returns 200 on success regardless of whether the emails actually
 * delivered — we never want to block a customer's confirmation screen
 * over an SMTP hiccup. Failures are logged for the admin to follow up.
 */

import {
  sendEmail,
  orderReceivedCustomerEmail,
  orderReceivedAdminEmail,
} from "@/lib/email";

export const runtime = "nodejs";

const ADMIN_EMAIL =
  process.env.ORDER_ADMIN_EMAIL || "zasifbinislam@gmail.com";

export async function POST(req) {
  let order;
  try {
    order = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!order?.id || !order?.name) {
    return Response.json({ error: "Missing order fields" }, { status: 400 });
  }

  // Customer receipt — only if they actually gave us an email.
  if (order.email) {
    sendEmail({
      to: order.email,
      subject: `Order received · ${order.id}`,
      html: orderReceivedCustomerEmail(order),
    }).catch((err) => console.error("[/api/order-placed] customer email:", err));
  }

  // Admin alert — fires for every order, including guest checkout.
  sendEmail({
    to: ADMIN_EMAIL,
    subject: `🆕 New order ${order.id} · ৳${Number(order.total).toLocaleString("en-IN")} · ${order.method}`,
    html: orderReceivedAdminEmail(order),
  }).catch((err) => console.error("[/api/order-placed] admin email:", err));

  return Response.json({ ok: true });
}
