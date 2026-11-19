import Link from "next/link";
import Img from "./Img";
import { waLink } from "@/lib/wa";
import { WhatsApp } from "./Icons";

export default function ProductCard({ p, sizesAttr = "(max-width: 900px) 74vw, 300px" }) {
  const enquiry = `Hello Kemp's, I'd like to enquire about ${p.name} (${p.sizes.join(" / ")}).`;
  return (
    <article className="prod" aria-labelledby={`pr-${p.slug}`}>
      <div className="prod__img" style={{ "--tint": p.tint }}>
        <Img name={p.image} alt={`${p.name} bottles in ${p.sizes.join(", ")}`} sizes={sizesAttr} style={{ backgroundColor: "transparent" }} />
      </div>
      <div className="prod__body">
        <h3 id={`pr-${p.slug}`}>{p.name}</h3>
        <p>{p.line}</p>
        <div className="sizes" aria-label="Available sizes">{p.sizes.map((s) => <span key={s}>{s}</span>)}</div>
        {p.href ? (
          <Link className="btn btn--ghost btn--sm" href={p.href}>Discover {p.name}</Link>
        ) : (
          <a className="btn btn--ghost btn--sm" href={waLink(enquiry)} target="_blank" rel="noopener noreferrer"><WhatsApp width={16} height={16} /> Enquire</a>
        )}
      </div>
    </article>
  );
}
