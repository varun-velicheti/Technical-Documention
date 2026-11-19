import { PRODUCTS, PACKS, SUBSCRIPTION, DELIVERY } from "@/content/site";

export const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug);
export const getPack = (id) => PACKS.find((p) => p.id === id);

/** Price for one unit of a given pack (e.g. one case of 12). */
export function packPrice(product, pack, plan = "once") {
  let price = product.price * pack.units * (1 - pack.discount);
  if (plan === "subscribe") price *= 1 - SUBSCRIPTION.discount;
  return Math.round(price);
}

export function lineKey({ slug, pack, plan, frequency }) {
  return [slug, pack, plan, plan === "subscribe" ? frequency : ""].join("|");
}

/** Recompute totals from raw line items. Used on the client and re-validated on the server. */
export function computeTotals(lines) {
  let subtotal = 0;
  const priced = [];
  for (const l of lines) {
    const product = getProduct(l.slug);
    const pack = getPack(l.pack);
    if (!product || !pack) continue;
    const qty = Math.max(1, Math.min(99, Math.floor(Number(l.qty) || 1)));
    const unit = packPrice(product, pack, l.plan);
    subtotal += unit * qty;
    priced.push({ ...l, qty, unit, total: unit * qty, product, packInfo: pack });
  }
  const shipping = subtotal === 0 || subtotal >= DELIVERY.freeShippingOver ? 0 : DELIVERY.shippingFee;
  return { lines: priced, subtotal, shipping, total: subtotal + shipping };
}

export function checkPin(pin) {
  const clean = String(pin || "").replace(/\s/g, "");
  if (!/^[1-9][0-9]{5}$/.test(clean)) return { valid: false, ok: false, message: "Enter a valid 6-digit PIN code." };
  const hit = DELIVERY.serviceablePrefixes[clean.slice(0, 3)];
  if (!hit) return { valid: true, ok: false, message: "We don't deliver here yet — find a retail partner or send a business enquiry." };
  return { valid: true, ok: true, city: hit.city, message: `${hit.eta} available in ${hit.city}.` };
}

export function whatsappLink(text, number) {
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}
