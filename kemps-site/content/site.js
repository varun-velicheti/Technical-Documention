/**
 * Single source of truth for Kemp's site content.
 * Company history, product range, sizes and contact details are taken from kemps.in.
 * Check anything marked REVIEW with the company before launch.
 */

export const BRAND = {
  name: "Kemp's",
  legal: "Kempannavar Industries",
  tagline: "Purity in every drop.",
  statement:
    "Packaged drinking water with added minerals, bottled in Hosapete since 1997. From North Karnataka's own water brand to alkaline water and a family of sodas, made with the same care.",
  siteUrl: "https://kemps.in",
  phones: [
    { label: "96865 51876", href: "+919686551876" },
    { label: "96865 51877", href: "+919686551877" },
  ],
  landline: { label: "08394 232117", href: "+918394232117" },
  whatsapp: "917892073432",
  email: "Kempspet@rediffmail.com",
  addresses: [
    { name: "Kempannavar Industries", lines: ["R 35, Industrial Estate, Dam Road", "Hosapete, Karnataka 583203"] },
    { name: "Kemp's Pet Industries", lines: ["N 1, Industrial Estate, Dam Road", "Hosapete, Karnataka 583203"] },
  ],
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Industrial+Estate+Dam+Road+Hosapete+583203",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/kempspet2" },
    { label: "YouTube", href: "https://www.youtube.com/watch?v=CLEzKEzovv0" },
  ],
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About Us" },
  { href: "/products/", label: "Products" },
  { href: "/eight-plus/", label: "Eight Plus" },
  { href: "/gallery/", label: "Gallery" },
  { href: "/contact/", label: "Contact" },
];

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "water", label: "Water" },
  { id: "soda", label: "Sodas & beverages" },
];

/** Product range and pack sizes as listed on kemps.in. */
export const PRODUCTS = [
  { slug: "kemps-water", name: "Kemp's Water", line: "Packaged drinking water with added minerals", cat: "water", sizes: ["2 L", "1 L", "500 ml", "250 ml"], image: "p-water-blue", tint: "#dcebf6" },
  { slug: "kemps-water-pink", name: "Kemp's Water", line: "Packaged drinking water · signature pink edition", cat: "water", sizes: ["1 L", "500 ml", "250 ml"], image: "p-water-pink", tint: "#f6e1ec" },
  { slug: "eight-plus", name: "Eight Plus", line: "Alkaline water · pH 8+ with electrolytes & minerals", cat: "water", sizes: ["1 L", "500 ml"], image: "p-eightplus", tint: "#dbe4f3", href: "/eight-plus/" },
  { slug: "club-soda", name: "Club Soda", line: "Crisp, extra-strong sparkle", cat: "soda", sizes: ["300 ml", "200 ml"], image: "p-club-soda", tint: "#e6eaee" },
  { slug: "jeera-soda", name: "Jeera Soda", line: "Cumin-spiced, refreshingly tangy", cat: "soda", sizes: ["2 L", "600 ml", "300 ml", "200 ml"], image: "p-jeera-soda", tint: "#f1dfdc" },
  { slug: "kokum-jeera", name: "Kokum Jeera Masala", line: "Kokum, cumin and spice", cat: "soda", sizes: ["200 ml"], image: "p-kokum", tint: "#f4dde2" },
  { slug: "lemon-soda", name: "Lemon Soda", line: "Zesty lemon fizz", cat: "soda", sizes: ["300 ml", "200 ml"], image: "p-lemon", tint: "#e1efdc" },
  { slug: "mango", name: "Mango", line: "Sunny mango drink", cat: "soda", sizes: ["200 ml"], image: "p-mango", tint: "#f8ead2" },
  { slug: "orange", name: "Orange", line: "Bright orange sparkle", cat: "soda", sizes: ["200 ml"], image: "p-orange", tint: "#f8e2d3" },
  { slug: "pudina-twist", name: "Pudina Twist", line: "Cool mint refresher", cat: "soda", sizes: ["200 ml"], image: "p-pudina", tint: "#e0efdc" },
];

export const MILESTONES = [
  { year: "1997", title: "Kemp's is born", text: "Kempannavar Industries is established in Hosapete under the ownership of K S Manjunath, manufacturing packaged drinking water under the brand name KEMP'S." },
  { year: "2003", title: "Into beverages", text: "The company diversifies its product line and enters the beverage industry with its own KEMP'S brand." },
  { year: "2006", title: "Kemp's Pet Industries", text: "Founded by K M Sunitha, now CEO. Club soda and jeera soda join the range." },
  { year: "2017–18", title: "Manufacturing excellence", text: "Recognised with the Sir M. Visvesvaraya Manufacturing Excellence Award by Karnataka's Department of Industries & Commerce." },
  { year: "Today", title: "A growing family", text: "Alkaline water under the Eight Plus brand, and flavours from lemon and orange to nannari, pudina and kokum jeera." },
];
