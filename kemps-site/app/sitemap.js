import { BRAND, NAV } from "@/content/site";
export const dynamic = "force-static";
export default function sitemap() {
  return NAV.map((n) => ({ url: `${BRAND.siteUrl}${n.href}`, changeFrequency: "monthly", priority: n.href === "/" ? 1 : 0.7 }));
}
