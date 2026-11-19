import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Persists a submission. If FORM_WEBHOOK_URL is set (e.g. a CRM, Zapier, Make,
 * Slack or email relay endpoint) the payload is POSTed there; it is always also
 * appended to data/submissions.ndjson so nothing is lost in development.
 */
export async function persist(kind, payload) {
  const ref = `${kind.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
  const record = { ref, kind, receivedAt: new Date().toISOString(), ...payload };

  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "submissions.ndjson"), JSON.stringify(record) + "\n");
  } catch (e) {
    console.error("[persist] file write failed", e);
  }

  const hook = process.env.FORM_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) });
    } catch (e) {
      console.error("[persist] webhook failed", e);
    }
  }
  return ref;
}

const hits = new Map();
/** Tiny in-memory rate limiter: max `limit` requests per IP per minute. */
export function rateLimited(req, limit = 8) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > limit;
}
