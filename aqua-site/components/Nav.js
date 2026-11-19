"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BRAND, NAV } from "@/content/site";
import { useCart } from "./Cart";
import { Bag, Menu, Close, Arrow } from "./Icons";
import Magnetic from "./Magnetic";

export default function Nav() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [solid, setSolid] = useState(!onHome);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(!onHome || y > window.innerHeight * 0.75);
      setHidden(y > 600 && y > last + 4 && !menu);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome, menu]);

  useEffect(() => {
    const close = () => setMenu(false);
    window.addEventListener("menu:close", close);
    return () => window.removeEventListener("menu:close", close);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(menu ? "scroll:lock" : "scroll:unlock"));
    const esc = (e) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menu]);

  return (
    <>
      <header className={`nav${solid ? " is-solid" : ""}${hidden ? " is-hidden" : ""}`}>
        <div className="wrap nav__inner">
          <Link href="/" className="brand-mark" aria-label={`${BRAND.name} — home`}>{BRAND.name}</Link>
          <nav aria-label="Primary">
            <ul className="nav__links">
              {NAV.map((n) => (<li key={n.href}><a className="link-u" href={n.href}>{n.label}</a></li>))}
            </ul>
          </nav>
          <div className="nav__actions">
            <span className="nav__order"><Magnetic><a href="/#collection" className={`btn btn--sm ${solid ? "" : "btn--glass"}`}>Order now</a></Magnetic></span>
            <button className="icon-btn" onClick={() => setOpen(true)} aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}>
              <Bag />{count > 0 && <span className="badge" aria-hidden="true">{count}</span>}
            </button>
            <button className="icon-btn nav__burger" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} aria-controls="site-menu"><Menu /></button>
          </div>
        </div>
      </header>
      <div id="site-menu" className={`menu${menu ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!menu} data-lenis-prevent>
        <button className="icon-btn menu__close" onClick={() => setMenu(false)} aria-label="Close menu"><Close /></button>
        <ul>
          {NAV.map((n) => (<li key={n.href}><a href={n.href} onClick={() => setMenu(false)}>{n.label}</a></li>))}
          <li><a href="/#faq" onClick={() => setMenu(false)}>FAQs</a></li>
        </ul>
        <div className="menu__foot">
          <a href="/#collection" className="btn btn--light btn--sm" onClick={() => setMenu(false)}>Order now <Arrow /></a>
          <a href={`tel:${BRAND.phoneHref}`}>{BRAND.phone}</a>
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </div>
      </div>
    </>
  );
}
