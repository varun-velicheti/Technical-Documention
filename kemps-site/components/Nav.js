"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BRAND, NAV } from "@/content/site";
import { waLink } from "@/lib/wa";
import { Menu, Close, Arrow, WhatsApp } from "./Icons";
import Magnetic from "./Magnetic";

/** Pages with a dark, full-bleed hero start with a transparent nav. */
const DARK_HERO = ["/", "/about/", "/eight-plus/", "/gallery/"];

export default function Nav() {
  const pathname = usePathname();
  const norm = pathname.endsWith("/") ? pathname : pathname + "/";
  const overHero = DARK_HERO.includes(norm);
  const [solid, setSolid] = useState(!overHero);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(!overHero || y > window.innerHeight * 0.6);
      setHidden(y > 600 && y > last + 4 && !menu);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero, menu]);

  useEffect(() => { setMenu(false); }, [pathname]);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(menu ? "scroll:lock" : "scroll:unlock"));
    const esc = (e) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menu]);

  const isActive = (href) => (href === "/" ? norm === "/" : norm.startsWith(href));

  return (
    <>
      <header className={`nav${solid ? " is-solid" : ""}${hidden ? " is-hidden" : ""}`}>
        <div className="wrap nav__inner">
          <Link href="/" className="brand-logo" aria-label={`${BRAND.name} — home`}>
            <img src={solid ? "/logo-kemps-mark.png" : "/logo-kemps-white-mark.png"} alt="Kemp's" width="480" height="188" />
          </Link>
          <nav aria-label="Primary">
            <ul className="nav__links">
              {NAV.map((n) => (<li key={n.href}><Link className="link-u" href={n.href} aria-current={isActive(n.href) ? "true" : undefined}>{n.label}</Link></li>))}
            </ul>
          </nav>
          <div className="nav__actions">
            <span className="nav__order"><Magnetic><a href={waLink("Hello Kemp's, I'd like to enquire about your products.")} target="_blank" rel="noopener noreferrer" className={`btn btn--sm ${solid ? "" : "btn--glass"}`}><WhatsApp width={16} height={16} /> Enquire</a></Magnetic></span>
            <button className="icon-btn nav__burger" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} aria-controls="site-menu"><Menu /></button>
          </div>
        </div>
      </header>
      <div id="site-menu" className={`menu${menu ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!menu} data-lenis-prevent>
        <button className="icon-btn menu__close" onClick={() => setMenu(false)} aria-label="Close menu"><Close /></button>
        <ul>
          {NAV.map((n) => (<li key={n.href}><Link href={n.href} onClick={() => setMenu(false)}>{n.label}</Link></li>))}
        </ul>
        <div className="menu__foot">
          <a href={waLink("Hello Kemp's, I'd like to enquire about your products.")} className="btn btn--light btn--sm" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp <Arrow /></a>
          <a href={`tel:${BRAND.phones[0].href}`}>{BRAND.phones[0].label}</a>
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </div>
      </div>
    </>
  );
}
