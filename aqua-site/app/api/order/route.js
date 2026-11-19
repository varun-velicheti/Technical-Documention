import { NextResponse } from "next/server";
import { computeTotals, checkPin } from "@/lib/pricing";
import { isEmail, isPhone } from "@/lib/validate";
import { persist, rateLimited } from "@/lib/store";
import { SUBSCRIPTION } from "@/content/site";

export async function POST(req) {
  if (rateLimited(req, 5)) return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a minute." }, { status: 429 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  if (body?.website) return NextResponse.json({ ok: true, ref: "OK" });

  const c = body?.customer || {};
  const errors = {};
  if (!c.name || String(c.name).trim().length < 2) errors.name = "Please enter your name.";
  if (!isPhone(c.phone)) errors.phone = "Enter a valid phone number.";
  if (!isEmail(c.email)) errors.email = "Enter a valid email address.";
  if (!c.address || String(c.address).trim().length < 8) errors.address = "Please enter your full delivery address.";
  const pin = checkPin(c.pin);
  if (!pin.ok) errors.pin = pin.message;

  const lines = Array.isArray(body?.lines) ? body.lines.slice(0, 30) : [];
  const validFreq = new Set(SUBSCRIPTION.frequencies.map((f) => f.id));
  const sanitized = lines
    .map((l) => ({
      slug: String(l.slug || ""),
      pack: String(l.pack || ""),
      plan: l.plan === "subscribe" ? "subscribe" : "once",
      frequency: validFreq.has(l.frequency) ? l.frequency : "monthly",
      qty: l.qty,
    }));
  const totals = computeTotals(sanitized);
  if (totals.lines.length === 0) errors._form = "Your bag is empty.";

  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const ref = await persist("order", {
    customer: {
      name: String(c.name).trim().slice(0, 80),
      phone: String(c.phone).trim(),
      email: String(c.email).trim(),
      address: String(c.address).trim().slice(0, 400),
      pin: String(c.pin).trim(),
      notes: String(c.notes || "").trim().slice(0, 500),
    },
    lines: totals.lines.map(({ product, packInfo, ...rest }) => ({ ...rest, name: `${product.name} ${product.volume}`, packLabel: packInfo.label })),
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    currency: "INR",
  });
  return NextResponse.json({ ok: true, ref, total: totals.total });
}
