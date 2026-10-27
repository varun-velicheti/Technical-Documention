/* First Sip — site interactions. No framework; Lenis (smooth scroll) is optional. */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const img = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };

  /* ---------- Images: hide broken photos so the styled fallback shows ---------- */
  // If an online photo fails, swap in a backup coffee photo before giving up.
  const BACKUP = ["photo-1495474472287-4d71bcdd2085", "photo-1509042239860-f550ce710b93", "photo-1447933601403-0c6688de566e",
    "photo-1511920170033-f8396924c348", "photo-1442512595331-e89e73853f31", "photo-1501339847302-ac426a4a7cbb",
    "photo-1554118811-1e0d58224f24", "photo-1514432324607-a09d9b4aefdd", "photo-1453614512568-c4024d13c247"];
  const PEOPLE = ["photo-1500648767791-00dcc994a43e", "photo-1507003211169-0a1dd7228f2d", "photo-1472099645785-5658abf4ff4e"];
  const onImgError = (im) => {
    const tries = +(im.dataset.fb || 0);
    if (tries < 3 && /images\.unsplash\.com/.test(im.src)) {
      im.dataset.fb = tries + 1;
      const w = (im.src.match(/[?&]w=(\d+)/) || [])[1] || 900;
      let h = 7; for (const c of (im.alt || im.src)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      const pool = im.closest(".member, .quote__who, .manifesto-sig") ? PEOPLE : BACKUP;
      im.src = `https://images.unsplash.com/${pool[(h + tries) % pool.length]}?auto=format&fit=crop&w=${w}&q=80`;
    } else im.classList.add("is-broken");
  };
  document.addEventListener("error", (e) => { if (e.target && e.target.tagName === "IMG") onImgError(e.target); }, true);
  $$("img").forEach((im) => { if (im.complete && im.naturalWidth === 0 && im.getAttribute("src")) onImgError(im); });

  /* ---------- Year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  const startLenis = () => {
    if (reduced || !window.Lenis || window.innerWidth < 760) return;
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };
  window.addEventListener("load", startLenis);
  const scrollToY = (y) => (lenis ? lenis.scrollTo(y) : window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" }));

  /* ---------- Preloader ---------- */
  const preloader = $(".preloader");
  const onReady = [];
  let loaded = false;
  // Run now if the page has already finished loading (returning visits skip the loader).
  const ready = (fn) => (loaded ? fn() : onReady.push(fn));
  const finishLoad = () => {
    loaded = true;
    document.documentElement.classList.add("is-loaded");
    if (preloader) preloader.classList.add("is-done");
    onReady.forEach((fn) => fn());
  };
  // The cup loader plays once per visit. window.name survives page changes in the
  // same tab, even when the site is opened from local files.
  const returning = document.documentElement.classList.contains("fs-returning");
  const markVisited = () => { try { if (!/fs-visited/.test(window.name)) window.name = (window.name + " fs-visited").trim(); } catch (e) { /* ignore */ } store.sset("fs-seen", "1"); };
  if (preloader && returning) { preloader.remove(); markVisited(); finishLoad(); }
  else if (preloader) {
    const counter = $("[data-count]", preloader);
    const duration = reduced ? 0 : 1600;
    const t0 = performance.now();
    const tick = (t) => {
      const p = duration ? clamp((t - t0) / duration, 0, 1) : 1;
      if (counter) counter.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      if (p < 1) requestAnimationFrame(tick);
      else { markVisited(); setTimeout(finishLoad, 250); }
    };
    requestAnimationFrame(tick);
  } else finishLoad();

  /* ---------- Page transitions ---------- */
  const curtain = $(".curtain");
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || reduced) return;
    const href = a.getAttribute("href") || "";
    if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || href.startsWith("#") ||
        /^(mailto|tel|https?):/.test(href) || !/\.html(#.*)?$/.test(href)) return;
    const [path, hash] = href.split("#");
    const here = location.pathname.split("/").pop() || "index.html";
    if (path === here && hash) { // same-page anchor
      const t = document.getElementById(hash);
      if (t) { e.preventDefault(); scrollToY(t.getBoundingClientRect().top + window.scrollY - 80); }
      return;
    }
    if (document.documentElement.classList.contains("vt")) return;   // native transition takes over
    e.preventDefault();
    document.documentElement.classList.add("is-leaving");
    setTimeout(() => (window.location.href = href), 170);
  });
  window.addEventListener("pageshow", (e) => { if (e.persisted) document.documentElement.classList.remove("is-leaving"); });
  // Warm up the next page as soon as the pointer rests on a link (browsers without speculation rules).
  const prefetched = new Set();
  document.addEventListener("pointerover", (e) => {
    const a = e.target.closest && e.target.closest('a[href$=".html"], a[href*=".html#"]');
    if (!a || location.protocol === "file:" || HTMLScriptElement.supports?.("speculationrules")) return;
    const url = a.href.split("#")[0];
    if (prefetched.has(url)) return;
    prefetched.add(url);
    const l = document.createElement("link"); l.rel = "prefetch"; l.href = url; document.head.appendChild(l);
  });

  /* ---------- Header ---------- */
  const header = $(".header");
  let lastY = window.scrollY;
  const onScrollHeader = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 30);
    if (header && !document.body.classList.contains("menu-open")) header.classList.toggle("is-hidden", y > lastY && y > 500);
    lastY = y;
  };

  /* ---------- Mobile menu ---------- */
  const burger = $("[data-burger]");
  const mm = $(".mobile-menu");
  burger && burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
    mm && mm.setAttribute("aria-hidden", !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  });

  /* ---------- Cursor ---------- */
  if (finePointer && !reduced) {
    const ring = $(".cursor"), dot = $(".cursor-dot");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => { document.documentElement.classList.add("has-mouse"); mx = e.clientX; my = e.clientY; dot && (dot.style.transform = `translate(${mx}px,${my}px)`); });
    const loop = () => { rx = lerp(rx, mx, .16); ry = lerp(ry, my, .16); ring && (ring.style.transform = `translate(${rx}px,${ry}px)`); requestAnimationFrame(loop); };
    loop();
    document.addEventListener("mouseover", (e) => {
      if (!ring) return;
      const v = e.target.closest("[data-cursor='view']");
      const h = e.target.closest("a, button, input, textarea, select, label");
      ring.classList.toggle("is-view", !!v);
      ring.classList.toggle("is-hover", !v && !!h);
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * .25}px, ${y * .35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Tilt cards ---------- */
  if (finePointer && !reduced) {
    $$("[data-tilt]").forEach((el) => {
      el.classList.add("tilt");
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Split text ---------- */
  $$("[data-split]").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.textContent = part; s.style.setProperty("--i", i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    el.classList.add("split");
  });
  const splitIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); splitIO.unobserve(en.target); }
  }), { threshold: .2 });
  ready(() => $$(".split").forEach((el) => splitIO.observe(el)));

  /* ---------- Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  const setupReveals = (root = document) => {
    $$("[data-reveal]", root).forEach((el) => {
      el.style.setProperty("--d", el.dataset.reveal || 0);
      el.classList.add("reveal");
      if (reduced) el.classList.add("is-in"); else revealIO.observe(el);
    });
    $$("[data-stagger]", root).forEach((parent) => {
      Array.from(parent.children).forEach((c, i) => {
        c.setAttribute("data-reveal", (i % 6) * 90);
        c.style.setProperty("--d", (i % 6) * 90);
        c.classList.add("reveal");
        if (reduced) c.classList.add("is-in"); else revealIO.observe(c);
      });
    });
    $$(".process, .chart-card, [data-inview]", root).forEach((el) => (reduced ? el.classList.add("is-in") : revealIO.observe(el)));
    // A fully clipped element never reports as visible, so watch its parent instead.
    $$(".reveal-img", root).forEach((el) => {
      if (reduced) { el.classList.add("is-in"); return; }
      const io = new IntersectionObserver((ents) => { if (ents[0].isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }, { threshold: .15 });
      io.observe(el.parentElement);
    });
  };
  // Hide reveal targets only while JS is running; they stay visible without it.
  const style = document.createElement("style");
  style.textContent = reduced ? "" : ".reveal:not(.is-in){opacity:0;transform:translateY(40px)}";
  document.head.appendChild(style);
  setupReveals();

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target; countIO.unobserve(el);
    const end = parseFloat(el.dataset.counter), dec = (el.dataset.counter.split(".")[1] || "").length;
    const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const t0 = performance.now(), dur = reduced ? 0 : 2000;
    const step = (t) => {
      const p = dur ? clamp((t - t0) / dur, 0, 1) : 1;
      const v = end * (1 - Math.pow(1 - p, 4));
      el.textContent = pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN")) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  $$("[data-counter]").forEach((el) => countIO.observe(el));

  /* ---------- Marquee: duplicate content for a seamless loop ---------- */
  $$(".marquee__track").forEach((t) => { t.innerHTML += t.innerHTML; });

  /* ---------- Hero beans ---------- */
  const beansEl = $(".beans");
  if (beansEl) {
    const bean = '<svg viewBox="0 0 40 56"><defs><linearGradient id="bg" x1="0" x2="1"><stop offset="0" stop-color="#5a3a26"/><stop offset="1" stop-color="#2a170e"/></linearGradient></defs><ellipse cx="20" cy="28" rx="18" ry="26" fill="url(#bg)"/><path d="M20 3c-7 10 7 20 0 50" stroke="#170c07" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    const spots = [[8, 22, 34, -20], [18, 70, 22, 30], [62, 16, 26, 60], [78, 40, 46, -40], [88, 74, 30, 15], [48, 82, 20, 80], [30, 40, 16, 120]];
    spots.forEach(([x, y, s, r], i) => {
      const b = document.createElement("div");
      b.className = "bean"; b.dataset.depth = (i % 3) + 1;
      b.style.cssText = `left:${x}%;top:${y}%;--s:${s}px;--r:${r}deg;--d:${7 + i}s`;
      b.innerHTML = bean; beansEl.appendChild(b);
    });
    if (finePointer && !reduced) {
      let tx = 0, ty = 0, cx = 0, cy = 0;
      window.addEventListener("mousemove", (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
      const beans = $$(".bean", beansEl);
      const move = () => {
        cx = lerp(cx, tx, .06); cy = lerp(cy, ty, .06);
        beans.forEach((b) => { const d = b.dataset.depth * 18; b.style.transform = `translate(${cx * d}px, ${cy * d}px)`; });
        requestAnimationFrame(move);
      };
      move();
    }
  }

  /* ---------- Scroll-driven effects ---------- */
  const parallax = $$("[data-parallax]");
  const hscrolls = $$(".hscroll");
  const manifesto = $(".manifesto");
  const timeline = $(".timeline__line i");
  const ring = $("[data-ring]");
  const toTop = $(".to-top");

  if (manifesto) {
    const html = manifesto.innerHTML;
    manifesto.innerHTML = html.replace(/<em>(.*?)<\/em>|([^\s<]+)/g, (m, em, w) =>
      em ? em.split(/\s+/).map((x) => `<span class="mw accent">${x}</span>`).join(" ") : `<span class="mw">${w}</span>`);
  }
  const mwords = manifesto ? $$(".mw", manifesto) : [];

  const sizeHScroll = () => hscrolls.forEach((h) => {
    const track = $(".hscroll__track", h);
    if (window.innerWidth <= 760) { h.style.removeProperty("--h"); return; }
    const dist = track.scrollWidth - window.innerWidth;
    h.style.setProperty("--h", `${dist + window.innerHeight * 1.2}px`);
    h.dataset.dist = dist;
  });

  const onScroll = () => {
    const y = window.scrollY, vh = window.innerHeight;
    onScrollHeader();
    if (!reduced) parallax.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const speed = parseFloat(el.dataset.parallax) || .15;
      el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - vh / 2) * -speed}px, 0)`;
    });
    hscrolls.forEach((h) => {
      if (window.innerWidth <= 760) return;
      const r = h.getBoundingClientRect();
      const p = clamp(-r.top / (h.offsetHeight - vh), 0, 1);
      $(".hscroll__track", h).style.transform = `translate3d(${-p * (h.dataset.dist || 0)}px,0,0)`;
      const bar = $(".hscroll__progress i", h); bar && (bar.style.transform = `scaleX(${p})`);
    });
    if (mwords.length) {
      const r = manifesto.getBoundingClientRect();
      const p = clamp((vh * .85 - r.top) / (r.height + vh * .35), 0, 1);
      const n = Math.round(p * mwords.length);
      mwords.forEach((w, i) => w.classList.toggle("on", i < n));
    }
    if (timeline) {
      const box = timeline.parentElement.getBoundingClientRect();
      timeline.style.transform = `scaleY(${clamp((vh * .6 - box.top) / box.height, 0, 1)})`;
    }
    const doc = document.documentElement.scrollHeight - vh;
    if (ring) ring.style.strokeDashoffset = 157 - 157 * clamp(y / doc, 0, 1);
    toTop && toTop.classList.toggle("is-visible", y > vh * .8);
  };
  let ticking = false;
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
  window.addEventListener("resize", () => { sizeHScroll(); onScroll(); });
  window.addEventListener("load", () => { sizeHScroll(); onScroll(); });
  sizeHScroll(); onScroll();
  toTop && toTop.addEventListener("click", () => scrollToY(0));

  /* ---------- Testimonials ---------- */
  $$("[data-quotes]").forEach((wrap) => {
    const items = $$(".quote", wrap), dots = $(".quotes__dots", wrap);
    let i = 0, timer;
    items.forEach((_, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", `Show review ${k + 1}`);
      b.addEventListener("click", () => go(k)); dots && dots.appendChild(b);
    });
    const go = (k) => {
      i = (k + items.length) % items.length;
      items.forEach((q, n) => q.classList.toggle("is-active", n === i));
      dots && $$("button", dots).forEach((d, n) => d.classList.toggle("is-active", n === i));
      clearInterval(timer); if (!reduced) timer = setInterval(() => go(i + 1), 6500);
    };
    $("[data-prev]", wrap) && $("[data-prev]", wrap).addEventListener("click", () => go(i - 1));
    $("[data-next]", wrap) && $("[data-next]", wrap).addEventListener("click", () => go(i + 1));
    go(0);
  });

  /* ---------- Toast ---------- */
  const toast = $(".toast");
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    $("[data-toast-msg]", toast).textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2800);
  };

  /* ---------- Catalogue (shop + cart) ---------- */
  const PRODUCTS = [
    { id: "coorg", cat: "beans", name: "Coorg Estate Reserve", notes: "Dark chocolate · jaggery · orange peel", price: 849, roast: 3, origin: "Coorg, Karnataka · 1,100 m", img: "photo-1559056199-641a0ac8b55e", tag: "Bestseller" },
    { id: "araku", cat: "beans", name: "Araku Valley Natural", notes: "Blueberry · cacao nib · wildflower honey", price: 1099, roast: 2, origin: "Araku, Andhra Pradesh · 1,200 m", img: "photo-1447933601403-0c6688de566e", tag: "Single origin" },
    { id: "malabar", cat: "beans", name: "Monsooned Malabar", notes: "Spice · cedar · low acidity", price: 799, roast: 4, origin: "Malabar Coast, Kerala", img: "photo-1498804103079-a6351b050096" },
    { id: "babab", cat: "beans", name: "Baba Budan Giri Micro-lot", notes: "Red apple · caramel · black tea", price: 1349, roast: 2, origin: "Chikmagalur · 1,500 m", img: "photo-1497935586351-b67a49e012bf", tag: "Limited" },
    { id: "firstsip", cat: "beans", name: "The First Sip Blend", notes: "Hazelnut · milk chocolate · cardamom", price: 699, roast: 3, origin: "House espresso blend", img: "photo-1509042239860-f550ce710b93", tag: "Signature" },
    { id: "pourover", cat: "gear", name: "Ceramic Pour-Over Set", notes: "Hand-thrown dripper, server and two cups", price: 2899, img: "photo-1495774856032-8b90bbb32b32" },
    { id: "mug", cat: "gear", name: "Smiling Cup Mug", notes: "Stoneware, 300 ml, our logo in gold", price: 899, img: "photo-1514432324607-a09d9b4aefdd", tag: "New" },
    { id: "gift", cat: "gifts", name: "The Morning Gift Box", notes: "Two 250 g bags, mug and tasting cards", price: 2499, img: "photo-1442512595331-e89e73853f31", tag: "Gift" },
  ];
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  let cart = store.get("fs-cart", []).filter((l) => byId[l.id]);
  const FREE = 1500;

  const drawer = $("[data-drawer]"), overlay = $("[data-overlay]");
  const openDrawer = () => { drawer.classList.add("is-open"); overlay.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); lenis && lenis.stop(); };
  const closeAll = () => {
    drawer && drawer.classList.remove("is-open"); drawer && drawer.setAttribute("aria-hidden", "true");
    overlay && overlay.classList.remove("is-open");
    $$(".modal").forEach((m) => m.classList.remove("is-open"));
    lenis && lenis.start();
  };
  overlay && overlay.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
  $$("[data-cart-open]").forEach((b) => b.addEventListener("click", openDrawer));
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeAll));

  const renderCart = () => {
    const lines = $("[data-cart-lines]");
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const total = cart.reduce((s, l) => s + l.qty * byId[l.id].price, 0);
    $$("[data-cart-count]").forEach((c) => { c.textContent = count; c.classList.toggle("has-items", count > 0); });
    if (!lines) return;
    lines.innerHTML = cart.length ? cart.map((l, i) => {
      const p = byId[l.id];
      return `<div class="cart-line"><div class="media"><img src="${img(p.img, 200)}" alt="" loading="lazy"></div>
        <div><h4>${p.name}</h4><small>${l.opt || p.notes.split(" · ")[0]}</small><br>
        <div class="qty"><button type="button" data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button type="button" data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div>
        <strong class="mono">${inr(p.price * l.qty)}</strong></div>`;
    }).join("") : `<div class="cart-empty"><img src="assets/img/logo.svg" alt=""><p>Your bag is empty. Our cup is a little sad about it.</p><a class="link-arrow" href="shop.html">Browse the roastery {{arrow}}</a></div>`.replace("{{arrow}}", "→");
    $("[data-cart-total]").textContent = inr(total);
    const left = Math.max(0, FREE - total);
    $("[data-ship-msg]").textContent = left ? `Add ${inr(left)} more for free delivery` : "You've unlocked free delivery";
    $("[data-ship-bar]").style.width = `${clamp(total / FREE, 0, 1) * 100}%`;
    store.set("fs-cart", cart);
  };
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]");
    if (q) {
      const line = cart[+q.dataset.q]; line.qty += +q.dataset.d;
      if (line.qty <= 0) cart.splice(+q.dataset.q, 1);
      renderCart(); return;
    }
    const add = e.target.closest("[data-add]");
    if (add) {
      const id = add.dataset.add, opt = add.dataset.opt || "";
      const ex = cart.find((l) => l.id === id && (l.opt || "") === opt);
      ex ? ex.qty++ : cart.push({ id, qty: 1, opt });
      renderCart();
      $$("[data-cart-count]").forEach((c) => { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); });
      showToast(`${byId[id].name} added to your bag`);
    }
  });
  $("[data-checkout]") && $("[data-checkout]").addEventListener("click", () => {
    if (!cart.length) { showToast("Your bag is empty"); return; }
    showToast("Checkout is in demo mode for this preview");
  });
  renderCart();

  /* ---------- Shop page ---------- */
  const shopGrid = $("[data-shop-grid]");
  if (shopGrid) {
    const roast = (n) => n ? `<div class="roast-meter">Roast <span>${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= n ? "on" : ""}"></i>`).join("")}</span></div>` : "";
    const draw = (cat) => {
      const list = PRODUCTS.filter((p) => cat === "all" || p.cat === cat);
      shopGrid.innerHTML = list.map((p) => `
        <article class="product">
          <div class="product__img">
            ${p.tag ? `<span class="badge">${p.tag}</span>` : ""}
            <div class="media"><img src="${img(p.img, 700)}" alt="${p.name}" loading="lazy"></div>
            <div class="product__quick">
              <button class="btn btn--sm btn--dark" type="button" data-quick="${p.id}">Quick view</button>
              <button class="btn btn--sm" type="button" data-add="${p.id}">Add</button>
            </div>
          </div>
          <div class="product__top"><h3>${p.name}</h3><span class="product__price">${inr(p.price)}</span></div>
          <p class="muted">${p.notes}</p>${roast(p.roast)}
        </article>`).join("");
      $$(".product", shopGrid).forEach((el, i) => { el.classList.add("reveal"); el.style.setProperty("--d", i * 70); requestAnimationFrame(() => setTimeout(() => el.classList.add("is-in"), 30)); });
    };
    $$("[data-filter]").forEach((b) => b.addEventListener("click", () => {
      $$("[data-filter]").forEach((x) => x.classList.toggle("is-active", x === b));
      draw(b.dataset.filter);
    }));
    draw("all");

    const modal = $("[data-modal]");
    shopGrid.addEventListener("click", (e) => {
      const qb = e.target.closest("[data-quick]");
      if (!qb || !modal) return;
      const p = byId[qb.dataset.quick];
      $("[data-m-img]", modal).src = img(p.img, 1000); $("[data-m-img]", modal).alt = p.name;
      $("[data-m-img]", modal).classList.remove("is-broken");
      $("[data-m-name]", modal).textContent = p.name;
      $("[data-m-price]", modal).textContent = inr(p.price);
      $("[data-m-notes]", modal).textContent = p.notes;
      $("[data-m-origin]", modal).textContent = p.origin || "Designed in our Mumbai studio";
      $("[data-m-grind]", modal).hidden = p.cat !== "beans";
      const addBtn = $("[data-m-add]", modal);
      addBtn.dataset.add = p.id;
      const setOpt = () => {
        const g = $(".opts button.is-active", $("[data-m-grind]", modal));
        addBtn.dataset.opt = p.cat === "beans" && g ? `250 g · ${g.textContent}` : "";
      };
      $$("[data-m-grind] .opts button", modal).forEach((b, i) => {
        b.classList.toggle("is-active", i === 0);
        b.onclick = () => { $$("[data-m-grind] .opts button", modal).forEach((x) => x.classList.toggle("is-active", x === b)); setOpt(); };
      });
      setOpt();
      modal.classList.add("is-open"); overlay.classList.add("is-open"); lenis && lenis.stop();
    });
    $("[data-m-add]") && $("[data-m-add]").addEventListener("click", () => setTimeout(() => { closeAll(); openDrawer(); }, 250));
  }

  /* ---------- Menu page: tabs with sliding pill + size pricing ---------- */
  $$("[data-tabs]").forEach((tabs) => {
    const pill = $(".tabs__pill", tabs), btns = $$("button", tabs);
    const move = (b) => { if (!pill) return; pill.style.width = b.offsetWidth + "px"; pill.style.height = b.offsetHeight + "px"; pill.style.top = b.offsetTop + "px"; pill.style.transform = `translateX(${b.offsetLeft}px)`; };
    const items = $$("[data-cat]");
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
      move(b);
      const cat = b.dataset.tab;
      items.forEach((it) => it.classList.add("is-hiding"));
      setTimeout(() => items.forEach((it) => {
        const show = cat === "all" || it.dataset.cat === cat;
        it.hidden = !show;
        if (show) requestAnimationFrame(() => requestAnimationFrame(() => it.classList.remove("is-hiding")));
      }), 380);
    }));
    const init = () => move($("button.is-active", tabs) || btns[0]);
    init(); window.addEventListener("resize", init); window.addEventListener("load", init);
    if (document.fonts) document.fonts.ready.then(init);
  });
  $$("[data-size]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-size]").forEach((x) => x.classList.toggle("is-active", x === b));
    const idx = +b.dataset.size;
    $$("[data-prices]").forEach((p) => {
      const list = p.dataset.prices.split(",").map(Number);
      p.style.opacity = 0;
      setTimeout(() => { p.textContent = inr(list[Math.min(idx, list.length - 1)]); p.style.opacity = 1; }, 200);
    });
  }));

  /* ---------- Locations ---------- */
  const LOCS = [
    { id: "bandra", city: "Mumbai", name: "Bandra Flagship", addr: "Carter Road, Bandra West, Mumbai 400050", hours: [7, 23], img: "photo-1554118811-1e0d58224f24", seats: 64, feat: ["Roastery bar", "Sea-facing terrace", "Brew classes"], x: 92, y: 427, map: "Carter Road Bandra Mumbai" },
    { id: "bkc", city: "Mumbai", name: "BKC Business Lounge", addr: "G Block, Bandra Kurla Complex, Mumbai 400051", hours: [7, 21], img: "photo-1453614512568-c4024d13c247", seats: 48, feat: ["Meeting pods", "Express pickup", "Wi-Fi 6"], x: 101, y: 434, map: "Bandra Kurla Complex Mumbai" },
    { id: "indiranagar", city: "Bengaluru", name: "Indiranagar House", addr: "12th Main, HAL 2nd Stage, Indiranagar, Bengaluru 560038", hours: [7, 23], img: "photo-1501339847302-ac426a4a7cbb", seats: 72, feat: ["Garden courtyard", "Slow-bar", "Pet friendly"], x: 196, y: 563, map: "12th Main Indiranagar Bengaluru" },
    { id: "khan", city: "New Delhi", name: "Khan Market Atelier", addr: "Middle Lane, Khan Market, New Delhi 110003", hours: [8, 23], img: "photo-1521017432531-fbd92d768814", seats: 40, feat: ["Patisserie counter", "Private salon", "Retail wall"], x: 188, y: 211, map: "Khan Market New Delhi" },
    { id: "jubilee", city: "Hyderabad", name: "Jubilee Hills Studio", addr: "Road No. 36, Jubilee Hills, Hyderabad 500033", hours: [7, 22], img: "photo-1442975631115-c4f7b05b8a2c", seats: 56, feat: ["Cold brew tap", "Rooftop", "Late-night menu"], x: 212, y: 466, map: "Road No 36 Jubilee Hills Hyderabad", soon: true },
  ];
  const locList = $("[data-loc-list]");
  if (locList) {
    const now = () => { // India Standard Time
      const d = new Date(Date.now() + (new Date().getTimezoneOffset() + 330) * 60000);
      return { h: d.getHours() + d.getMinutes() / 60, day: d.getDay() };
    };
    const status = (l) => {
      if (l.soon) return '<span class="status soon">Opening spring 2027</span>';
      const { h } = now(); const open = h >= l.hours[0] && h < l.hours[1];
      return `<span class="status ${open ? "open" : ""}">${open ? "Open now" : "Closed"}</span>`;
    };
    const fmt = (h) => `${((h + 11) % 12) + 1}:00 ${h < 12 || h === 24 ? "am" : "pm"}`;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    locList.innerHTML = LOCS.map((l, i) => `
      <button type="button" class="loc-btn${i === 0 ? " is-active" : ""}" data-loc="${l.id}">
        <span class="mono muted" style="font-size:11px;letter-spacing:.16em;text-transform:uppercase">${l.city}</span>
        <h3>${l.name}</h3>
        <span class="row-between">${status(l)}<span>${l.soon ? "" : fmt(l.hours[0]) + " – " + fmt(l.hours[1])}</span></span>
      </button>`).join("");
    const detail = $("[data-loc-detail]");
    const show = (id) => {
      const l = LOCS.find((x) => x.id === id);
      $$(".loc-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.loc === id));
      $$(".pin").forEach((p) => p.querySelector(".dot").setAttribute("r", p.dataset.pin === id ? 10 : 7));
      detail.classList.add("is-swapping");
      setTimeout(() => {
        const today = now().day;
        detail.innerHTML = `
          <div class="media"><img src="${img(l.img, 1400)}" alt="Inside ${l.name}"></div>
          <div class="loc-detail__body">
            <div class="stack" style="gap:16px">
              <span class="eyebrow">${l.city}</span>
              <h2>${l.name}</h2>
              <p class="muted">${l.addr}</p>
              <div class="amenities">${l.feat.map((f) => `<span class="chip">${f}</span>`).join("")}<span class="chip">${l.seats} seats</span></div>
              <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:6px">
                <a class="btn btn--sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.map)}" target="_blank" rel="noopener">Get directions →</a>
                <a class="btn btn--sm btn--ghost" href="contact.html#reserve">Reserve</a>
              </div>
            </div>
            <div class="hours">
              ${status(l)}
              ${l.soon ? '<p class="muted" style="margin-top:8px">Join the waitlist on our contact page and we will invite you to the opening tasting.</p>' :
                days.map((d, k) => `<div class="${k === today ? "today" : ""}"><span>${d}</span><span>${fmt(l.hours[0])} – ${fmt(l.hours[1])}</span></div>`).join("")}
            </div>
          </div>`;
        detail.classList.remove("is-swapping");
      }, reduced ? 0 : 380);
    };
    locList.addEventListener("click", (e) => { const b = e.target.closest("[data-loc]"); b && show(b.dataset.loc); });
    const pins = $("[data-pins]");
    if (pins) {
      pins.innerHTML = LOCS.map((l) => `<g class="pin" data-pin="${l.id}" tabindex="0" role="button" aria-label="${l.name}">
        <circle class="halo" cx="${l.x}" cy="${l.y}" r="12" fill="${l.soon ? "#d9b77e" : "#1f5f45"}" opacity=".45"/>
        <circle class="dot" cx="${l.x}" cy="${l.y}" r="7" fill="${l.soon ? "#d9b77e" : "#1f5f45"}" stroke="#fbf7f0" stroke-width="2.5"/></g>`).join("");
      pins.addEventListener("click", (e) => { const p = e.target.closest("[data-pin]"); p && show(p.dataset.pin); });
      pins.addEventListener("keydown", (e) => { const p = e.target.closest("[data-pin]"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); show(p.dataset.pin); } });
    }
    show(LOCS[0].id);
  }

  /* ---------- Investor charts ---------- */
  const bars = $("[data-bars]");
  if (bars) {
    const data = JSON.parse(bars.dataset.bars); // [[label, value], ...]
    const W = 640, H = 300, pad = { l: 44, r: 10, t: 26, b: 36 };
    const max = Math.ceil(Math.max(...data.map((d) => d[1])) / 50) * 50;
    const bw = (W - pad.l - pad.r) / data.length;
    const yv = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
    let s = "";
    for (let t = 0; t <= max; t += max / 4) s += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${yv(t)}" y2="${yv(t)}"/><text x="${pad.l - 10}" y="${yv(t) + 4}" text-anchor="end">${t}</text>`;
    data.forEach(([lab, v], i) => {
      const x = pad.l + i * bw + bw * .2, w = bw * .6;
      s += `<rect class="bar${i === data.length - 1 ? " hl" : ""}" x="${x}" y="${yv(v)}" width="${w}" height="${yv(0) - yv(v)}" rx="6" style="transition-delay:${i * 120}ms"/>`;
      s += `<text class="val" x="${x + w / 2}" y="${yv(v) - 8}" text-anchor="middle">${v}</text>`;
      s += `<text x="${x + w / 2}" y="${H - 12}" text-anchor="middle">${lab}</text>`;
    });
    bars.innerHTML = `<svg class="bar-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${bars.dataset.label}">${s}</svg>`;
  }
  const donut = $("[data-donut]");
  if (donut) {
    const data = JSON.parse(donut.dataset.donut); // [[label, pct, color], ...]
    const C = 2 * Math.PI * 80; let off = 0;
    const segs = data.map(([, p, c]) => { const seg = `<circle class="seg" cx="110" cy="110" r="80" stroke="${c}" stroke-dasharray="0 ${C}" data-len="${(p / 100) * C - 3}" stroke-dashoffset="${-off}" transform="rotate(-90 110 110)"/>`; off += (p / 100) * C; return seg; }).join("");
    donut.innerHTML = `<svg class="donut" viewBox="0 0 220 220" role="img" aria-label="Use of funds">${segs}
      <text x="110" y="104" text-anchor="middle" style="font-family:var(--f-display);font-size:30px;fill:var(--fg)">100%</text>
      <text x="110" y="128" text-anchor="middle" style="font-family:var(--f-mono);font-size:10px;letter-spacing:.14em;fill:var(--muted)">OF THE ROUND</text></svg>`;
    $("[data-legend]").innerHTML = data.map(([l, p, c]) => `<li><i style="background:${c}"></i><span>${l}</span><b>${p}%</b></li>`).join("");
    const io = new IntersectionObserver((ents) => { if (ents[0].isIntersecting) { $$(".seg", donut).forEach((c) => c.setAttribute("stroke-dasharray", `${c.dataset.len} ${C}`)); io.disconnect(); } }, { threshold: .4 });
    io.observe(donut);
  }

  /* ---------- Franchise calculator ---------- */
  const calc = $("[data-calc]");
  if (calc) {
    const CUPS_PER_BILL = 1.4, DAYS = 30, MONTHS = 36;
    const lakh = (n) => (n >= 100 ? `₹${(n / 100).toFixed(2).replace(/0$/, "")} Cr` : `₹${n.toFixed(1)} L`);
    const inputs = Object.fromEntries($$("[data-in]", calc).map((i) => [i.dataset.in, i]));
    const out = (k) => $(`[data-out='${k}']`, calc), res = (k) => $(`[data-r='${k}']`, calc);
    const chart = res("chart");
    const bars = Array.from({ length: MONTHS }, (_, i) => {
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("x", i * 10 + 1.5); r.setAttribute("width", 7); r.setAttribute("rx", 3.5);
      chart.appendChild(r); return r;
    });
    const update = () => {
      const cups = +inputs.cups.value, bill = +inputs.bill.value, inv = +inputs.inv.value, margin = +inputs.margin.value;
      Object.values(inputs).forEach((i) => i.style.setProperty("--pct", `${((i.value - i.min) / (i.max - i.min)) * 100}%`));
      out("cups").textContent = cups;
      out("bill").textContent = `₹${bill}`;
      out("inv").textContent = inv >= 100 ? `₹${(inv / 100).toFixed(2).replace(/0$/, "")} Cr` : `₹${inv} L`;
      out("margin").textContent = `${margin}%`;
      const rev = (cups / CUPS_PER_BILL) * bill * DAYS / 1e5;          // ₹ lakh per month
      const profit = rev * margin / 100;
      const payback = profit > 0 ? Math.ceil(inv / profit) : Infinity;
      res("rev").textContent = lakh(rev);
      res("profit").textContent = lakh(profit);
      res("payback").textContent = payback === Infinity ? "Not reached" : payback > 99 ? "99+ months" : `${payback} month${payback === 1 ? "" : "s"}`;
      res("breakeven").textContent = payback <= MONTHS ? `Break-even · month ${payback}` : "No break-even within 3 years";
      const vals = bars.map((_, m) => -inv + profit * (m + 1));
      const max = Math.max(inv, ...vals.map(Math.abs)) || 1;
      bars.forEach((r, m) => {
        const v = vals[m], h = Math.max(2, Math.abs(v) / max * 116);
        r.setAttribute("y", 120 - h); r.setAttribute("height", h);
        r.setAttribute("fill", v < 0 ? "#dcc3a3" : "#1f5f45");
      });
    };
    Object.values(inputs).forEach((i) => i.addEventListener("input", update));
    update();
  }

  /* ---------- Forms ---------- */
  const validators = {
    required: (v) => v.trim() !== "" || "Please fill this in.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Enter an email like name@company.com.",
    phone: (v) => v.trim() === "" || /^[+\d][\d\s-]{7,}$/.test(v.trim()) || "Enter a phone number with at least 8 digits.",
  };
  $$("form[data-form]").forEach((form) => {
    const check = (input) => {
      const field = input.closest(".field"); if (!field) return true;
      const rules = (input.dataset.rules || "").split(" ").filter(Boolean);
      let msg = "";
      for (const r of rules) { const res = validators[r](input.value); if (res !== true) { msg = res; break; } }
      field.classList.toggle("is-invalid", !!msg);
      const err = $(".err", field); if (err) err.textContent = msg;
      return !msg;
    };
    $$("[data-rules]", form).forEach((i) => i.addEventListener("blur", () => check(i)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = $$("[data-rules]", form).map(check).every(Boolean);
      if (!ok) { const bad = $(".is-invalid input, .is-invalid textarea, .is-invalid select", form); bad && bad.focus(); return; }
      const name = (form.querySelector("[name=name]") || {}).value || "";
      const tmpl = form.dataset.success || "Thank you{name}. We'll be in touch within one working day.";
      form.innerHTML = `<div class="success">${'{{check}}'.replace("{{check}}", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.8 2.8L16 10"/></svg>')}
        <h3 class="h3">${tmpl.replace("{name}", name ? ", " + name.split(" ")[0] : "")}</h3>
        <p class="muted">This is a preview site, so nothing has been sent yet. Connect the form to your email or CRM before launch.</p></div>`;
    });
  });
  $$("form[data-newsletter]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("input", f), note = f.parentElement.querySelector(".form-note");
    if (!validators.email(input.value) || validators.email(input.value) !== true) { note.textContent = "Enter an email like name@company.com."; input.focus(); return; }
    note.textContent = "You're on the list. Your first-order code FIRSTSIP15 is on its way."; input.value = "";
  }));

  /* Guests stepper */
  $$("[data-guests]").forEach((g) => {
    const out = $("output", g), input = $("input", g);
    $$("button", g).forEach((b) => b.addEventListener("click", () => {
      const v = clamp(+input.value + +b.dataset.step, 1, 12); input.value = v; out.textContent = v + (v === 1 ? " guest" : " guests");
    }));
  });

  /* Contact form switcher */
  $$("[data-seg]").forEach((seg) => {
    const btns = $$("button", seg);
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
      $$("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.target));
    }));
  });
  if (location.hash === "#reserve") { const b = $("[data-target='reserve']"); b && b.click(); }

  /* FAQ */
  $$(".faq__q").forEach((q) => q.addEventListener("click", () => {
    const item = q.parentElement, open = item.classList.toggle("is-open");
    q.setAttribute("aria-expanded", open);
  }));

  /* Copy buttons */
  $$("[data-copy]").forEach((b) => b.addEventListener("click", () => {
    const text = b.dataset.copy;
    const done = () => showToast(`Copied ${text}`);
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => showToast(text));
    else showToast(text);
  }));

  /* Date min = today */
  $$("input[type=date]").forEach((d) => { d.min = new Date().toISOString().slice(0, 10); });
})();
