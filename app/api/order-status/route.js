/**
 * Fire-and-forget status update email. Triggered from
 * AuthContext.updateOrderStatus right after the Supabase row flip.
 * Same graceful-no-key fallback as /api/order-placed.
 */

import { sendEmail, orderStatusEmail } from "@/lib/email";

export const runtime = "nodejs";

const VALID_STATUSES = ["received", "confirmed", "shipped", "delivered", "cancelled"];

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const order = body?.order;
  const status = body?.status;
  if (!order?.id || !order?.name || !order?.email) {
    return Response.json({ ok: true, skipped: "no email" });
  }
  if (!VALID_STATUSES.includes(status)) {
    return Response.json({ error: "invalid_status" }, { status: 400 });
  }

  sendEmail({
    to: order.email,
    subject: `Order ${order.id} — ${status}`,
    html: orderStatusEmail(order, status),
  }).catch((err) => console.error("[/api/order-status] email:", err));

  return Response.json({ ok: true });
}
