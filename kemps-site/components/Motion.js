"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global, declarative scroll choreography:
 *  [data-lq]           liquid headline reveal (lines rise through a fluid mask)
 *  [data-fade]         soft fade-up
 *  .reveal-img         masked image reveal with controlled scale
 *  [data-parallax=n]   vertical parallax, n = strength
 *  [data-ripple]       morphing liquid section divider
 */
export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll(".reveal-img").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-lq]").forEach((el) => {
        const inners = el.querySelectorAll(".lq-inner");
        const tween = {
          y: 0, yPercent: 0, "--mp": "0%",
          duration: 1.6, ease: "expo.out", stagger: 0.12,
        };
        if (el.dataset.lq === "auto") gsap.to(inners, { ...tween, delay: 0.35 });
        else gsap.to(inners, { ...tween, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });

      gsap.utils.toArray("[data-fade]").forEach((el) => {
        if (el.closest(".hero")) { gsap.to(el, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.6 + (Number(el.dataset.fade) || 0) }); return; }
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          delay: Number(el.dataset.fade) || 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray(".reveal-img").forEach((el) => {
        const img = el.querySelector("img");
        ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => el.classList.add("is-in") });
        el.style.transition = "clip-path 1.6s cubic-bezier(.22,1,.36,1)";
        if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const n = Number(el.dataset.parallax) || 10;
        gsap.fromTo(el, { yPercent: -n }, { yPercent: n, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      gsap.utils.toArray("[data-ripple] path").forEach((path) => {
        const a = path.dataset.a, b = path.dataset.b;
        gsap.fromTo(path, { attr: { d: a } }, { attr: { d: b }, ease: "none", scrollTrigger: { trigger: path.closest("[data-ripple]"), start: "top bottom", end: "bottom top", scrub: 1 } });
      });
    });
    // images that load late can change layout — refresh once everything is in
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => { window.removeEventListener("load", onLoad); ctx.revert(); };
  }, []);
  return null;
}
