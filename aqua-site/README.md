# Premium water brand website (Next.js · GSAP · Lenis · Three.js)

A cinematic, editorial website for a premium packaged drinking water brand. The working wordmark is **NIVALIS**; the real brand name goes in one line in `content/site.js`.

## Run it

```bash
npm install
npm run build
npm start            # http://localhost:3000
```

Use `npm run dev` while you edit.

## What's inside

| Area | Implementation |
| --- | --- |
| Hero | Full-screen lake photograph plus a WebGL glass bottle (`components/BottleStage.js`) floating above animated ripples, with a mirrored reflection. The bottle turns as you scroll. |
| Scroll-driven 3D bottle | One fixed canvas follows `[data-bottle-anchor]` elements, easing from the hero to the 360° showcase. Drag or use the arrow keys to rotate it. Three.js is lazy-loaded when the browser is idle. |
| Smooth scrolling | Lenis synced to the GSAP ticker (`components/SmoothScroll.js`). It also handles in-page anchor links. |
| Animations | `components/Motion.js`: liquid-mask headline reveals, fade-ups, masked image reveals with scaling, parallax layers and morphing ripple dividers. |
| Horizontal collection | Pinned horizontal scroll on desktop and native scroll-snap on mobile (`sections/Collection.js`). |
| Journey of Water | Interactive tabs with a flow line, cross-fading masked imagery and auto-advance. |
| Purification | Sticky, scroll-controlled SVG vessel that clears stage by stage. |
| Commerce | Pack and size selection, one-time or subscription purchase, a persistent cart drawer, checkout with a PIN-code check, `/api/order` with server-side price validation, and WhatsApp ordering. |
| Forms | Contact, bulk quotation, distributor/retailer registration, newsletter and "notify me" forms. They share client and server validation (`lib/validate.js`), with a honeypot and rate limiting. |
| SEO | Statically generated product pages (`/products/[slug]`) with Product JSON-LD, plus FAQPage and Organization JSON-LD, a sitemap, robots and Open Graph tags. |
| Accessibility | Skip link, semantic landmarks, ARIA tabs, radios and accordions, keyboard 360° control, visible focus and full `prefers-reduced-motion` support. |
| Performance | AVIF and WebP `<picture>` sets at 480–2400w with intrinsic sizes (no CLS), lazy loading, a priority hero image, lazy WebGL and a capped DPR. Rendering pauses when the tab is hidden or the canvas is off screen. |

## Before launch: replace placeholders

No certification, water source, mineral composition or health claim has been invented. Everything that needs verified information lives in **`content/site.js`**:

- `BRAND`: name, domain, phone, WhatsApp number, emails, address, social links
- `DELIVERY`: serviceable PIN prefixes, delivery fee and free-delivery threshold
- `PRODUCTS`, `PACKS`, `SUBSCRIPTION`: sizes and **indicative** prices and discounts
- `QUALITY_DOCS`: put verified PDFs in `public/documents/` and set `file`. Download buttons switch on automatically.
- `TESTIMONIALS`: verified reviews only, with consent. Until then the section shows clearly marked pending cards.
- `RETAILERS`: replace the entries flagged `sample: true`
- Purification stages (`sections/Purification.js`) are a process framework. Confirm them against the plant specification.
- Legal pages (`app/legal/[doc]`) are drafts for counsel to review.

## Integrations

- **Form and order delivery:** set `FORM_WEBHOOK_URL` (CRM, Zapier/Make, Slack or an email relay). Every submission is also appended to `data/submissions.ndjson`.
- **Payments:** checkout currently confirms by phone and then sends a payment link. To take payment online, plug a gateway (for example Razorpay) into `app/api/order/route.js`.
- **WhatsApp:** set `BRAND.whatsapp` (digits only) so links open a chat with your business number.

## Imagery

All photography in `public/img` was AI-generated for this project from a single master product shot, so the bottle, lighting and palette stay consistent. The originals are optimized with `scripts/optimize-images.py`, which writes `lib/images.js`. Replace these images with commissioned photography when it is available, and keep the same names.
