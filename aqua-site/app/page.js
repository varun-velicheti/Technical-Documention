import { FAQS } from "@/content/site";
import BottleStage from "@/components/BottleStage";
import Motion from "@/components/Motion";
import Ripple from "@/components/Ripple";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import ParallaxBand from "@/components/sections/ParallaxBand";
import Showcase from "@/components/sections/Showcase";
import Collection from "@/components/sections/Collection";
import Journey from "@/components/sections/Journey";
import Purification from "@/components/sections/Purification";
import Quality from "@/components/sections/Quality";
import Why from "@/components/sections/Why";
import Moments from "@/components/sections/Moments";
import Sustainability from "@/components/sections/Sustainability";
import Bulk from "@/components/sections/Bulk";
import Distribution from "@/components/sections/Distribution";
import Testimonials from "@/components/sections/Testimonials";
import StoreLocator from "@/components/sections/StoreLocator";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.flatMap((g) => g.items).map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BottleStage />
      <Motion />
      <Hero />
      <Story />
      <ParallaxBand />
      <Showcase />
      <Collection />
      <Ripple from="var(--ice)" to="var(--ocean-deep)" />
      <Journey />
      <Ripple from="var(--ocean-deep)" to="var(--glacier)" />
      <Purification />
      <Ripple from="var(--glacier)" to="var(--ocean-deep)" />
      <Quality />
      <Ripple from="var(--ocean-deep)" to="var(--glacier)" />
      <Why />
      <Moments />
      <Sustainability />
      <Bulk />
      <Distribution />
      <Testimonials />
      <StoreLocator />
      <Faq />
      <Contact />
    </>
  );
}
