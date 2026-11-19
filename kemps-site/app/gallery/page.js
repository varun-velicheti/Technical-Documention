import { PRODUCTS } from "@/content/site";
import Motion from "@/components/Motion";
import PageHero from "@/components/PageHero";
import Gallery from "@/components/Gallery";
import Cta from "@/components/sections/Cta";

export const metadata = {
  title: "Gallery",
  description: "Photos of Kemp's water, Eight Plus alkaline water, Kemp's sodas and the Sir M. Visvesvaraya Manufacturing Excellence Award.",
  alternates: { canonical: "/gallery/" },
};

const ITEMS = [
  { img: "ep-banner", alt: "Eight Plus alkaline water banner", cap: "Eight Plus" },
  { img: "p-water-blue", alt: "Kemp's water bottles in three sizes", cap: "Kemp's Water", contain: true, tint: "#dcebf6" },
  { img: "award", alt: "Kemp's receiving the Sir M. Visvesvaraya Manufacturing Excellence Award 2017–18", cap: "Manufacturing Excellence Award 2017–18" },
  { img: "jeera-mockup", alt: "Kemp's Jeera Soda bottle", cap: "Jeera Soda", contain: true, tint: "#f1dfdc" },
  { img: "ep-splash", alt: "Eight Plus bottle in a splash of water", cap: "Eight Plus", contain: true, tint: "#0c2c47" },
  { img: "p-water-pink", alt: "Kemp's water pink edition bottles", cap: "Kemp's Water — pink edition", contain: true, tint: "#f6e1ec" },
  { img: "ph-glass", alt: "A glass of water in front of a pH scale", cap: "Understanding pH", contain: true, tint: "#eef3f7" },
  ...PRODUCTS.filter((p) => !["kemps-water", "kemps-water-pink", "eight-plus"].includes(p.slug)).map((p) => ({ img: p.image, alt: `${p.name} bottles`, cap: p.name, contain: true, tint: p.tint })),
  { img: "ep-duo", alt: "Eight Plus 1 L and 500 ml bottles", cap: "Eight Plus · 1 L & 500 ml", contain: true, tint: "#dbe4f3" },
];

export default function GalleryPage() {
  return (
    <>
      <Motion />
      <PageHero image="droplet" eyebrow="Gallery" lines={["Moments", <em key="e">in focus.</em>]} lede="Our products, our people and the milestones along the way." />
      <section className="section" aria-label="Photo gallery">
        <div className="wrap"><Gallery items={ITEMS} /></div>
      </section>
      <Cta />
    </>
  );
}
