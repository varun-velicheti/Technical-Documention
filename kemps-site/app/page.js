import BottleStage from "@/components/BottleStage";
import Motion from "@/components/Motion";
import Ripple from "@/components/Ripple";
import Hero from "@/components/sections/Hero";
import Legacy from "@/components/sections/Legacy";
import Brands from "@/components/sections/Brands";
import ParallaxBand from "@/components/sections/ParallaxBand";
import Showcase from "@/components/sections/Showcase";
import Range from "@/components/sections/Range";
import EightPlusFeature from "@/components/sections/EightPlusFeature";
import Plant from "@/components/sections/Plant";
import Award from "@/components/sections/Award";
import Cta from "@/components/sections/Cta";

export default function Home() {
  return (
    <>
      <BottleStage />
      <Motion />
      <Hero />
      <Legacy />
      <Brands />
      <ParallaxBand />
      <Showcase />
      <Range />
      <Ripple from="var(--ice)" to="var(--ocean-deep)" />
      <EightPlusFeature />
      <Ripple from="var(--ocean-deep)" to="var(--glacier)" />
      <Plant />
      <Award />
      <Cta />
    </>
  );
}
