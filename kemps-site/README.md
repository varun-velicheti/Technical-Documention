# Kemp's — static website

A premium, fully static redesign of [kemps.in](https://kemps.in) for **Kempannavar Industries / Kemp's Pet Industries**, Hosapete. It's built with Next.js (static export), GSAP ScrollTrigger, Lenis smooth scrolling and Three.js. There's no cart and no server: `npm run build` writes plain HTML, CSS and JS to `out/`, which you can upload to any web host, just like the current site.

## Build & preview

```bash
npm install
npm run build        # outputs ./out
npm start            # serves ./out at http://localhost:3000
```

Deploy by uploading the contents of `out/` to your hosting (cPanel public_html, Netlify, Vercel, S3, GitHub Pages…).

## Pages

| Page | Contents |
| --- | --- |
| `/` Home | Cinematic hero with a 3D Kemp's bottle floating over water, legacy and stats, brand trio, parallax band, drag-to-rotate 360° bottle, pinned horizontal product range, Eight Plus feature with brochure download, how we work, award, enquiry CTA |
| `/about/` | Kempannavar Industries and Kemp's Pet Industries story, leadership, milestones timeline, CFTRI training, award |
| `/products/` | All 10 products with sizes, filterable (Water / Sodas & beverages), with one-tap WhatsApp enquiry per product |
| `/eight-plus/` | Eight Plus alkaline water: minerals, interactive pH scale, sizes and brochure PDF |
| `/gallery/` | Masonry gallery with a keyboard-accessible lightbox |
| `/contact/` | Phones, landline, email, WhatsApp, both addresses and a map link. The enquiry form opens WhatsApp or the visitor's email app, already filled in, so no server is needed. Also has distributor, retail and bulk enquiries. |

## Editing content

Everything lives in **`content/site.js`**: company details, phone numbers, WhatsApp number, addresses, products and sizes, and milestones. Images are generated from `_raw/` (not committed) by `scripts/optimize-images.py`, which writes AVIF and WebP sets to `public/img`.

## Content notes — please review with Kemp's

- All company facts, product names, sizes and contact details come from kemps.in. Its two pages list different addresses (R 35 and N 1, Industrial Estate, Dam Road), so both are shown.
- The award (Sir M. Visvesvaraya Manufacturing Excellence Award 2017–18) is taken from the certificate photo on kemps.in.
- The old Eight Plus page's medical-style claims (disease prevention, weight loss, immunity) were **left out**. Food-labelling rules restrict health claims and they weren't substantiated. Only product facts are used: pH 8+, electrolytes, and calcium, magnesium, potassium and sodium.
- The milestone dates follow the kemps.in text. One section there dates the move into beverages to 2003 and another to 2006, so please confirm both.
- Product photos, logos and the brochure are Kemp's own assets from kemps.in. The landscape, river and droplet backgrounds are AI-generated ambience images.
