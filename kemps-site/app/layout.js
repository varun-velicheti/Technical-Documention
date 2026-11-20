import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/content/site";
import { asset } from "@/lib/base";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

export const metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: { default: "Kemp's — Packaged Drinking Water with Added Minerals | Hosapete", template: "%s — Kemp's" },
  description: "Kemp's packaged drinking water with added minerals, Eight Plus alkaline water and Kemp's sodas — made by Kempannavar Industries in Hosapete, Karnataka, since 1997.",
  openGraph: { type: "website", siteName: "Kemp's", images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: asset("/logo-kemps-mark.png") },
};

export const viewport = { themeColor: "#0b2f55", width: "device-width", initialScale: 1 };

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.legal,
  brand: BRAND.name,
  url: BRAND.siteUrl,
  logo: `${BRAND.siteUrl}/logo-kemps.png`,
  email: BRAND.email,
  telephone: BRAND.phones.map((p) => p.href),
  foundingDate: "1997",
  address: { "@type": "PostalAddress", streetAddress: "R 35, Industrial Estate, Dam Road", addressLocality: "Hosapete", addressRegion: "Karnataka", postalCode: "583203", addressCountry: "IN" },
  sameAs: BRAND.social.map((s) => s.href),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
