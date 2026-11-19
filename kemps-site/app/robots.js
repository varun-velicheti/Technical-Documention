import { BRAND } from "@/content/site";
export const dynamic = "force-static";
export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${BRAND.siteUrl}/sitemap.xml` };
}
