import Img from "./Img";
import LiquidImage, { DROPLET, SPLASH_BOTTLE } from "./LiquidImage";
import LiquidText from "./LiquidText";

export default function PageHero({ eyebrow, lines, lede, image, alt = "", light = false, aside, asideAlt = "", children }) {
  return (
    <section className={`phero${light ? " phero--light" : ""}`} aria-labelledby="page-title">
      {image && <div className="phero__bg" data-parallax="8">{image === "droplet" ? <LiquidImage name="droplet" alt={alt} mode="ripple" fit="cover" center={DROPLET.center} drop={DROPLET.drop} sizes="100vw" /> : <Img name={image} alt={alt} priority sizes="100vw" />}</div>}
      {aside && <div className="phero__aside" data-parallax="-6">{aside === "ep-splash" ? <LiquidImage className="liquid--float" name="ep-splash" mode="splash" fit="contain" protect={SPLASH_BOTTLE} alt={asideAlt} sizes="34vw" /> : <div className="fit" style={{ height: "100%" }}><Img name={aside} alt={asideAlt} priority sizes="34vw" style={{ backgroundColor: "transparent" }} /></div>}</div>}
      <div className="wrap">
        <span className="eyebrow" style={light ? undefined : { color: "rgba(255,255,255,.75)" }}>{eyebrow}</span>
        <div style={{ height: 24 }} />
        <LiquidText as="h1" id="page-title" className="display" auto lines={lines} />
        {lede && <p className="lede" data-fade style={{ marginTop: 28 }}>{lede}</p>}
        {children}
      </div>
    </section>
  );
}
