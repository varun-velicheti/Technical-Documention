import Img from "../Img";
import LiquidText from "../LiquidText";

const M = [
  ["m1", "dining", "Dining", "The centre of the table", "A water bottle on a fine-dining table beside a glass being filled"],
  ["m2", "travel", "Travel", "Above the clouds", "The bottle on a tray table beside an aircraft window at golden hour"],
  ["m3", "fitness", "Fitness", "After the last rep", "The bottle on an oak bench with a towel and yoga mat in a bright studio"],
  ["m4", "work", "Work", "Clear-headed hours", "The bottle and a glass of water on a stone desk overlooking a city"],
  ["m5", "hotel", "Hospitality", "Turn-down, perfected", "The bottle on a silver tray on a marble nightstand in a hotel suite"],
];

export default function Moments() {
  return (
    <section className="section" id="moments" aria-labelledby="moments-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow" data-fade>Water for every moment</span>
            <div style={{ height: 24 }} />
            <LiquidText id="moments-title" lines={["Wherever", <em key="e">you pause.</em>]} />
          </div>
          <p className="lede" data-fade>From long dinners to early flights, the same quiet clarity — sized for the moment.</p>
        </div>
        <div className="moments__grid">
          {M.map(([cls, img, tag, title, alt]) => (
            <figure className={`moment reveal-img ${cls}`} key={cls} style={{ margin: 0 }}>
              <Img name={img} alt={alt} sizes={cls === "m1" ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 100vw, 34vw"} />
              <figcaption className="moment__cap"><small>{tag}</small><h3>{title}</h3></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
