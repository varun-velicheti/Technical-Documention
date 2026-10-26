# First Sip — premium coffee website

A 7-page, fully interactive website for **First Sip**, an Indian specialty coffee brand.

| Page | What's on it |
|---|---|
| `index.html` | Scroll-driven bean-to-cup animation (beans → grinder → brew → pour), light hero with floating beans, signature-drink horizontal scroller, bean-to-cup process, stats, reviews slider, gallery, newsletter |
| `menu.html` | Filterable menu with sliding tabs, cup-size price switcher, pairings |
| `story.html` | Founder note, animated timeline, values, sustainability, team |
| `shop.html` | Product grid, quick-view modal (grind choice), working cart drawer with free-delivery bar |
| `locations.html` | Map of India with café pins, live "Open now" status (IST), hours, directions |
| `franchise.html` | Franchise: formats, profit & payback calculator, growth chart, how it works, application form, FAQ |
| `contact.html` | Contact + table reservation forms with validation, FAQ accordion |

## View it
Open `index.html` in any browser (internet needed for fonts and photos), or publish with
GitHub Pages: repo **Settings → Pages → Deploy from branch**, then open `/first-sip/`.

## Edit it
Page content lives in `_src/pages/*.html`; the shared header, footer, cart and icons live in
`_src/build.py`. After editing, run:

```
python3 _src/build.py        # pages in this folder
python3 _src/standalone.py   # single-file copies in ../first-sip-html/
```

Styles: `assets/css/style.css` (colour tokens at the top). Interactions and shop/café data: `assets/js/main.js`. Bean-to-cup animation: `assets/js/brew.js`.

## Before presenting
- All business numbers (KPIs, unit economics, projections, raise amount) are **illustrative placeholders**. Replace them with your real figures.
- Team names and portraits are placeholders.
- Photos are from Unsplash (free to use) and load from their CDN.
- Forms and checkout are front-end demos; connect them to email/CRM/payments before launch.
