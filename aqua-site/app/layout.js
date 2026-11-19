import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/content/site";
import { CartProvider } from "@/components/Cart";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Toast from "@/components/Toast";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans", display: "swap" });

export const metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: { default: `${BRAND.name} — Purity in Every Drop`, template: `%s — ${BRAND.name}` },
  description: `${BRAND.name} premium still drinking water in glass. Order bottles, packs and subscriptions, request bulk supply for offices, hotels and events, or become a distributor.`,
  openGraph: { type: "website", siteName: BRAND.name, images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport = { themeColor: "#f5f8fa", width: "device-width", initialScale: 1 };

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  url: BRAND.siteUrl,
  email: BRAND.email,
  telephone: BRAND.phone,
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
        <CartProvider>
          <SmoothScroll />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
