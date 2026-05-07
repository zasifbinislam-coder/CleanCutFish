import coupons from "@/data/coupons.json";

export function getAllCoupons() { return coupons; }

export function findCoupon(code) {
  if (!code) return null;
  return coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase()) || null;
}

export function applyCoupon(code, subtotal) {
  const c = findCoupon(code);
  if (!c) return { ok: false, error: "Invalid coupon code." };
  if (subtotal < c.minSubtotal) {
    return { ok: false, error: `This coupon needs a subtotal of at least ৳${c.minSubtotal}.` };
  }
  const discount = c.type === "percent"
    ? Math.round((subtotal * c.value) / 100)
    : c.value;
  return { ok: true, coupon: c, discount: Math.min(discount, subtotal) };
}
