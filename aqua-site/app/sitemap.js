import { BRAND, PRODUCTS } from "@/content/site";
export default function sitemap() {
  const base = BRAND.siteUrl;
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...PRODUCTS.map((p) => ({ url: `${base}/products/${p.slug}`, changeFrequency: "weekly", priority: 0.8 })),
    ...["privacy", "terms", "shipping", "refunds"].map((d) => ({ url: `${base}/legal/${d}`, changeFrequency: "yearly", priority: 0.2 })),
  ];
}
