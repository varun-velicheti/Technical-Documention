"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scrolling synchronised with GSAP's ticker. Skipped for reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const goTo = (hash) => {
      const el = document.getElementById(hash.replace("#", ""));
      if (!el) return false;
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0, duration: 1.6 });
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      return true;
    };

    // Intercept in-page anchor links (including "/#section" while on the home page)
    const onClick = (e) => {
      const a = e.target.closest?.("a[href*='#']");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      if (goTo(url.hash)) {
        e.preventDefault();
        history.pushState(null, "", url.hash);
        window.dispatchEvent(new CustomEvent("menu:close"));
      }
    };
    document.addEventListener("click", onClick);

    if (reduce) return () => document.removeEventListener("click", onClick);

    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (location.hash) setTimeout(() => goTo(location.hash), 300);

    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("scroll:lock", stop);
    window.addEventListener("scroll:unlock", start);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll:lock", stop);
      window.removeEventListener("scroll:unlock", start);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}
