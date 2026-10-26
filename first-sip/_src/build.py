#!/usr/bin/env python3
"""Builds the First Sip pages.

Each file in _src/pages/ holds one page's main content plus a small header block:

    <!--
    title: Menu
    description: ...
    nav: menu
    -->

The shared head, header, footer, cart drawer and scripts are added here, and
markers like {{icon:arrow}} and {{logo}} are expanded. Output goes to the site
root (first-sip/*.html). Run:  python3 _src/build.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / "_src" / "pages"

NAV = [
    ("index", "index.html", "Home"),
    ("menu", "menu.html", "Menu"),
    ("story", "story.html", "Our Story"),
    ("shop", "shop.html", "Shop"),
    ("locations", "locations.html", "Cafés"),
    ("franchise", "franchise.html", "Franchise"),
    ("contact", "contact.html", "Contact"),
]

ICONS = {
    "branch": '<svg viewBox="0 0 220 260" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 250C60 200 90 150 110 100S150 30 200 10"/><path d="M60 196c-30-6-50-26-52-52 26 0 48 20 52 52zM60 196C40 176 26 160 8 144"/><path d="M66 186c10-30 34-48 62-50-4 28-28 46-62 50zM66 186c22-18 40-34 62-50"/><path d="M96 132c-30-10-46-34-44-60 26 6 44 30 44 60zM96 132C82 112 68 92 52 72"/><path d="M108 108c14-28 40-42 68-40-8 28-34 42-68 40zM108 108c24-14 46-28 68-40"/><path d="M138 58c-22-14-30-38-24-60 22 10 32 34 24 60zM138 58c-8-20-16-40-24-60"/><path d="M152 46c18-22 42-28 64-20-14 22-38 28-64 20zM152 46c22-6 44-12 64-20"/><circle cx="84" cy="168" r="9"/><circle cx="98" cy="176" r="8"/><circle cx="88" cy="184" r="8"/><path d="M82 164c3-2 6-2 8 1M96 172c2-2 5-1 6 1M86 180c2-2 5-2 6 1"/><circle cx="122" cy="84" r="8"/><circle cx="134" cy="92" r="7"/><circle cx="124" cy="98" r="7"/></svg>',
    "arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    "arrow-left": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    "arrow-up": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    "bag": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    "close": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    "check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    "check-circle": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.8 2.8L16 10"/></svg>',
    "star": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
    "bean": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><ellipse cx="12" cy="12" rx="6.5" ry="9.5" transform="rotate(35 12 12)"/><path d="M8.5 5.5c4 3 1 9 6.5 13"/></svg>',
    "leaf": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 4C9 4 4 9 4 16c0 1.5.3 2.8.8 4C6 14 10 10 15 8c-4 3-7 7-8.5 12C14 20 20 15 20 4z"/></svg>',
    "flame": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22c4 0 7-2.7 7-7 0-4-3-6-4-10-1.5 2-2 3.5-2 5-1-1-2-2.5-2-4.5C8 8 5 11 5 15c0 4.3 3 7 7 7z"/><path d="M12 22c-1.7 0-3-1.3-3-3 0-2 1.5-3 3-5 1.5 2 3 3 3 5 0 1.7-1.3 3-3 3z"/></svg>',
    "cup": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V9z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3c-.8 1 .8 2 0 3M12 3c-.8 1 .8 2 0 3"/></svg>',
    "hand": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 15h3l4 3h5a2 2 0 0 0 0-4h-3"/><path d="M6 15V11l5-2 7 3a2 2 0 0 1-1 3.8"/><path d="M14 6a2.5 2.5 0 1 0 0-.01"/></svg>',
    "heart": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-9-9.2C1.7 7.5 3.7 4 7.2 4c2 0 3.6 1.2 4.8 3 1.2-1.8 2.8-3 4.8-3 3.5 0 5.5 3.5 4.2 6.8C19 15.6 12 20 12 20z"/></svg>',
    "users": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.5 3.5 5.2"/></svg>',
    "globe": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19"/></svg>',
    "chart": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><path d="M6 16v-4M11 16V8M16 16v-6M20 5l-5 4-4-2-6 4"/></svg>',
    "shield": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5l8 3v6c0 5-3.4 8.8-8 10-4.6-1.2-8-5-8-10v-6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
    "phone-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>',
    "truck": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    "gift": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8c-2-4-6-4-6-1.5S10 8 12 8zM12 8c2-4 6-4 6-1.5S14 8 12 8z"/></svg>',
    "refresh": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.5-4.5L3 9M4 13a8 8 0 0 0 14.5 4.5L21 15"/><path d="M3 4v5h5M21 20v-5h-5"/></svg>',
    "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.5s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    "mail": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 6.5l9 6.5 9-6.5"/></svg>',
    "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3.5h3.5l1.8 4.5-2.3 1.5a11 11 0 0 0 6.5 6.5l1.5-2.3 4.5 1.8V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z"/></svg>',
    "clock": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/></svg>',
    "instagram": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    "x": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>',
    "linkedin": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h2.9v1.7c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.4 4.5 5.6V21h-3v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v6H9z"/></svg>',
    "youtube": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8zM10 15.2V8.8l5.2 3.2-5.2 3.2z"/></svg>',
    "sparkle": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z"/></svg>',
    "wifi": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 8.5a15 15 0 0 1 20 0M5 12a10.5 10.5 0 0 1 14 0M8.5 15.5a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>',
    "copy": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/></svg>',
}

LOGO = (
    '<svg class="{cls}" viewBox="0 0 120 120" aria-hidden="true">'
    '<path class="steam" d="M60 46c-6-6 6-10 0-16" fill="none" stroke="#C9A36A" stroke-width="3.2" stroke-linecap="round"/>'
    '<path class="heart" d="M60 30c-7-6-15-10-12-17 3-5 10-4 12 2 2-6 9-7 12-2 3 7-5 11-12 17z" fill="#E4C58F"/>'
    '<path d="M28 52h64v17c0 18-13 31-32 31S28 87 28 69z" fill="#C9A36A"/>'
    '<path d="M92 58c13 0 14 21 0 22" fill="none" stroke="#C9A36A" stroke-width="6" stroke-linecap="round"/>'
    '<ellipse cx="60" cy="105" rx="40" ry="5" fill="#C9A36A" opacity=".55"/>'
    '<path d="M44 70q5-6 10 0M66 70q5-6 10 0M53 80q7 7 14 0" fill="none" stroke="#1A110D" stroke-width="3.2" stroke-linecap="round"/>'
    '<circle cx="41" cy="78" r="4" fill="#E79C8F" opacity=".85"/><circle cx="79" cy="78" r="4" fill="#E79C8F" opacity=".85"/>'
    "</svg>"
)


def head(title, description):
    full = "First Sip — Specialty Coffee House" if title == "Home" else f"{title} · First Sip"
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{full}</title>
<meta name="description" content="{description}">
<meta name="theme-color" content="#fbf7f0">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="website">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0..100,0..1;1,9..144,300..600,0..100,0..1&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
</head>"""


def header(active):
    CUR = ' aria-current="page"'
    links = "".join(
        f'<a href="{href}"{CUR if key == active else ""}>{label}</a>'
        for key, href, label in NAV
    )
    mobile = "".join(
        f'<a href="{href}"{CUR if key == active else ""} style="transition-delay:{120 + i * 60}ms"><small>0{i + 1}</small>{label}</a>'
        for i, (key, href, label) in enumerate(NAV)
    )
    return f"""
<div class="preloader" aria-hidden="true">
  <div class="preloader__inner">
    {LOGO.format(cls="preloader__logo")}
    <div class="preloader__word"><span>First</span> <span style="animation-delay:.12s"><i>Sip</i></span></div>
    <div class="preloader__count"><span data-count>0</span>%</div>
  </div>
</div>
<div class="curtain" aria-hidden="true"></div>
<div class="cursor" aria-hidden="true"><span>View</span></div>
<div class="cursor-dot" aria-hidden="true"></div>

<header class="header" id="top">
  <div class="container"><div class="header__inner">
    <a class="brand" href="index.html" aria-label="First Sip home">
      {LOGO.format(cls="brand__mark")}
      <span class="brand__name">First <i>Sip</i></span>
    </a>
    <nav class="nav" aria-label="Main">{links}</nav>
    <div class="header__actions">
      <a class="btn btn--sm" href="contact.html#reserve" data-magnetic>Reserve a table</a>
      <button class="icon-btn" type="button" data-cart-open aria-label="Open cart">{ICONS["bag"]}<span class="cart-count" data-cart-count>0</span></button>
      <button class="icon-btn burger" type="button" data-burger aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div></div>
</header>

<div class="mobile-menu" aria-hidden="true">
  <nav aria-label="Mobile">{mobile}</nav>
  <div class="mobile-menu__foot">
    <span>hello@firstsip.coffee</span><span>+91 98200 12345</span><span>Mumbai · Bengaluru · Delhi</span>
  </div>
</div>
"""


FOOTER = """
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="stack" style="max-width:360px">
        <a class="brand" href="index.html" aria-label="First Sip home">{logo}<span class="brand__name">First <i>Sip</i></span></a>
        <p class="muted">Specialty coffee from Indian estates, roasted in small batches and served with care. The best part of the day is the first sip.</p>
        <div class="socials">
          <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">{{icon:instagram}}</a>
          <a href="https://x.com" target="_blank" rel="noopener" aria-label="X">{{icon:x}}</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">{{icon:linkedin}}</a>
          <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube">{{icon:youtube}}</a>
        </div>
      </div>
      <div>
        <h4>Visit</h4>
        <ul>
          <li><a href="menu.html">Menu</a></li>
          <li><a href="locations.html">Our cafés</a></li>
          <li><a href="contact.html#reserve">Reservations</a></li>
          <li><a href="contact.html#faq">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4>Shop</h4>
        <ul>
          <li><a href="shop.html">Coffee beans</a></li>
          <li><a href="shop.html#subscribe">Subscriptions</a></li>
          <li><a href="shop.html">Brew gear</a></li>
          <li><a href="shop.html">Gift boxes</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="story.html">Our story</a></li>
          <li><a href="franchise.html">Franchise</a></li>
          <li><a href="franchise.html#calculator">Franchise calculator</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__big" aria-hidden="true">First <i>Sip</i></div>
    <div class="footer__bottom">
      <span>© <span data-year>2026</span> First Sip Coffee Co. All rights reserved.</span>
      <span>Grown in India · Roasted in Coorg · Poured with love</span>
    </div>
  </div>
</footer>

<button class="to-top" type="button" aria-label="Back to top">
  <svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="25" stroke="rgba(244,234,217,.12)"/><circle cx="27" cy="27" r="25" stroke="#c9a36a" data-ring stroke-dasharray="157" stroke-dashoffset="157"/></svg>
  <span class="arrow">{{icon:arrow-up}}</span>
</button>

<div class="overlay" data-overlay></div>
<aside class="drawer" data-drawer aria-label="Cart" aria-hidden="true">
  <div class="drawer__head">
    <h3>Your bag</h3>
    <button class="drawer__close" type="button" data-close aria-label="Close cart">{{icon:close}}</button>
  </div>
  <div class="drawer__body" data-cart-lines></div>
  <div class="drawer__foot">
    <div class="ship-bar"><span data-ship-msg>Add ₹1,500 more for free delivery</span><div class="ship-bar__track"><i data-ship-bar></i></div></div>
    <div class="row-between"><span>Subtotal</span><strong data-cart-total>₹0</strong></div>
    <button class="btn btn--dark" type="button" data-checkout style="justify-content:center">Checkout {{icon:arrow}}</button>
  </div>
</aside>
<div class="toast" role="status" aria-live="polite">{{icon:check-circle}}<span data-toast-msg></span></div>

<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="assets/js/main.js" defer></script>
</body>
</html>
""".replace("{logo}", LOGO.format(cls="brand__mark"))


def expand(html):
    html = re.sub(r"\{\{icon:([a-z0-9-]+)\}\}", lambda m: ICONS[m.group(1)], html)
    # {{img:photo-123-abc:1200}} -> Unsplash CDN URL at that width
    html = re.sub(
        r"\{\{img:(photo-[\w-]+):(\d+)\}\}",
        lambda m: f"https://images.unsplash.com/{m.group(1)}?auto=format&amp;fit=crop&amp;w={m.group(2)}&amp;q=80",
        html,
    )
    html = html.replace("{{indiamap}}", (ROOT / "_src" / "india-map.svg").read_text())
    return html.replace("{{logo}}", LOGO.format(cls="logo-inline"))


def build():
    for src in sorted(PAGES.glob("*.html")):
        text = src.read_text(encoding="utf-8")
        meta_match = re.match(r"\s*<!--(.*?)-->", text, re.S)
        meta = dict(
            (k.strip(), v.strip())
            for k, v in (line.split(":", 1) for line in meta_match.group(1).strip().splitlines())
        )
        body = text[meta_match.end():]
        extra = "".join(
            f'<script src="assets/js/{name.strip()}.js" defer></script>\n'
            for name in meta.get("scripts", "").split(",") if name.strip()
        )
        page = (
            head(meta["title"], meta["description"])
            + f'\n<body data-page="{meta["nav"]}">'
            + header(meta["nav"])
            + '\n<main id="main">'
            + body
            + "</main>\n"
            + FOOTER.replace("</body>", extra + "</body>")
        )
        out = ROOT / src.name
        out.write_text(expand(page), encoding="utf-8")
        print("built", out.relative_to(ROOT))


if __name__ == "__main__":
    build()
