import Link from "next/link";
import { BRAND, NAV } from "@/content/site";
import { waLink } from "@/lib/wa";
import { asset } from "@/lib/base";
import { WhatsApp, Arrow } from "./Icons";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div>
              <Link href="/" aria-label="Kemp's — home"><img src={asset("/logo-kemps-white.png")} alt="Kemp's — with added minerals" width="220" height="98" style={{ width: 200, height: "auto" }} loading="lazy" /></Link>
              <p style={{ maxWidth: "38ch", marginTop: 22 }}>Packaged drinking water with added minerals, alkaline water and sodas — made in Hosapete, Karnataka, since 1997.</p>
              <a className="btn btn--light" style={{ marginTop: 12 }} href={waLink("Hello Kemp's, I'd like to enquire about your products.")} target="_blank" rel="noopener noreferrer"><WhatsApp width={18} height={18} /> Chat on WhatsApp</a>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>{NAV.map((n) => <li key={n.href}><Link className="link-u" href={n.href}>{n.label}</Link></li>)}</ul>
            </div>
            <div>
              <h4>Visit</h4>
              <ul>
                {BRAND.addresses.map((a) => <li key={a.name}><b style={{ color: "#fff", fontWeight: 500 }}>{a.name}</b><br />{a.lines.join(", ")}</li>)}
                <li><a className="link-u" href={BRAND.mapUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                {BRAND.phones.map((p) => <li key={p.href}><a className="link-u" href={`tel:${p.href}`}>{p.label}</a></li>)}
                <li><a className="link-u" href={`tel:${BRAND.landline.href}`}>{BRAND.landline.label}</a></li>
                <li><a className="link-u" href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
                {BRAND.social.map((s) => <li key={s.label}><a className="link-u" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="footer__word" aria-hidden="true">KEMP&apos;S</div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} {BRAND.legal}, Hosapete. All rights reserved.</span>
            <Link className="link-u" href="/contact/">Distributor &amp; bulk enquiries <Arrow style={{ display: "inline", width: 12, verticalAlign: "-1px" }} /></Link>
          </div>
        </div>
      </footer>
      <a className="wa-float" href={waLink("Hello Kemp's, I'd like to place an order.")} target="_blank" rel="noopener noreferrer" aria-label="Chat with Kemp's on WhatsApp"><WhatsApp /></a>
    </>
  );
}
