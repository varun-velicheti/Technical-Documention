import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, BRAND } from "@/content/site";
import { getProduct, packPrice } from "@/lib/pricing";
import { PACKS } from "@/content/site";
import { IMAGES } from "@/lib/images";
import Img from "@/components/Img";
import ProductConfigurator from "@/components/ProductConfigurator";
import DeliveryCheck from "@/components/DeliveryCheck";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const img = `/img/${p.image}-${IMAGES[p.image].widths.at(-1)}.webp`;
  return {
    title: `${p.name} ${p.volume} — Premium Still Water`,
    description: `${p.description} Order single bottles, packs of 6, cases of 12 or 24, or subscribe for scheduled delivery.`,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { images: [{ url: img }] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${BRAND.name} ${p.name} ${p.volume}`,
    description: p.description,
    brand: { "@type": "Brand", name: BRAND.name },
    image: `${BRAND.siteUrl}/img/${p.image}-${IMAGES[p.image].widths.at(-1)}.webp`,
    sku: p.slug,
    offers: PACKS.map((pk) => ({
      "@type": "Offer", name: pk.label, priceCurrency: "INR", price: packPrice(p, pk), availability: "https://schema.org/InStock",
      url: `${BRAND.siteUrl}/products/${p.slug}`,
    })),
  };
  const others = PRODUCTS.filter((x) => x.slug !== p.slug);
  return (
    <div className="pdp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><Link className="link-u" href="/">Home</Link><span>/</span><Link className="link-u" href="/#collection">Collection</Link><span>/</span><span aria-current="page">{p.name}</span></nav>
        <div className="pdp__grid">
          <div className="pdp__media"><Img name={p.image} alt={`${p.name} ${p.volume} glass bottle on a stone surface`} priority sizes="(max-width: 900px) 100vw, 52vw" /></div>
          <div>
            <span className="eyebrow">{p.volume} · Still water</span>
            <h1 className="h2" style={{ margin: "18px 0 20px" }}>{p.name} <em>{p.volume}</em></h1>
            <p className="lede">{p.description}</p>
            <ProductConfigurator slug={p.slug} />
            <div className="opt-group">
              <span className="label">Delivery availability</span>
              <DeliveryCheck compact />
            </div>
            <ul className="pdp__details">
              {p.details.map((d) => <li key={d}>{d}</li>)}
              <li>Source, mineral profile and laboratory report: published in <Link className="link-u" href="/#quality">Quality &amp; Safety</Link> once verified.</li>
            </ul>
          </div>
        </div>
        <section style={{ marginTop: 120 }} aria-labelledby="more-title">
          <h2 className="h3" id="more-title" style={{ marginBottom: 28 }}>Also in the collection</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {others.map((o) => (
              <Link key={o.slug} href={`/products/${o.slug}`} className="pcard" style={{ flex: "none" }}>
                <div className="pcard__img"><Img name={o.image} alt={`${o.name} ${o.volume}`} sizes="(max-width: 900px) 100vw, 40vw" /></div>
                <div className="pcard__body"><h3 className="h3">{o.name} <span className="muted" style={{ fontSize: ".6em" }}>{o.volume}</span></h3><p className="small muted" style={{ margin: 0 }}>{o.moment}</p></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
