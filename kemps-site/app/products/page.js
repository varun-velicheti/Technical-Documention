import { PRODUCTS, BRAND } from "@/content/site";
import { IMAGES } from "@/lib/images";
import Motion from "@/components/Motion";
import PageHero from "@/components/PageHero";
import ProductCatalogue from "@/components/ProductCatalogue";
import Cta from "@/components/sections/Cta";

export const metadata = {
  title: "Products",
  description: "Kemp's packaged drinking water (2 L, 1 L, 500 ml, 250 ml), Eight Plus alkaline water, club soda, jeera soda, kokum jeera masala, lemon soda, mango, orange and pudina twist.",
  alternates: { canonical: "/products/" },
};

const ld = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "ListItem", position: i + 1,
    item: { "@type": "Product", name: p.name, description: `${p.line}. Available in ${p.sizes.join(", ")}.`, brand: { "@type": "Brand", name: p.slug === "eight-plus" ? "Eight Plus" : "Kemp's" }, image: `${BRAND.siteUrl}/img/${p.image}-${IMAGES[p.image].widths.at(-1)}.webp` },
  })),
};

export default function Products() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Motion />
      <PageHero light eyebrow="Products" lines={["The Kemp's", <em key="e">range.</em>]} lede="Packaged drinking water in every everyday size, Eight Plus alkaline water and our family of sodas. Tap Enquire to ask about prices, stock or bulk supply on WhatsApp." />
      <section className="section" style={{ paddingTop: 0 }} aria-label="Product catalogue">
        <div className="wrap"><ProductCatalogue /></div>
      </section>
      <Cta />
    </>
  );
}
