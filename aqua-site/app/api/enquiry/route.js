import { NextResponse } from "next/server";
import { validate } from "@/lib/validate";
import { persist, rateLimited } from "@/lib/store";

export async function POST(req) {
  if (rateLimited(req)) return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a minute." }, { status: 429 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  // Honeypot — real users never fill this hidden field.
  if (body?.website) return NextResponse.json({ ok: true, ref: "OK" });
  const type = body?.type;
  const result = validate(type, body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  const ref = await persist(type, { data: result.data });
  return NextResponse.json({ ok: true, ref });
}
