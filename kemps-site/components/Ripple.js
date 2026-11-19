/**
 * Liquid section divider. The surface line morphs between two wave states as it
 * scrolls through the viewport (driven by <Motion/>).
 */
export default function Ripple({ from = "var(--glacier)", to = "var(--ocean-deep)", flip = false }) {
  const a1 = "M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,140 L0,140 Z";
  const b1 = "M0,70 C240,110 480,30 720,70 C960,110 1200,30 1440,70 L1440,140 L0,140 Z";
  const a2 = "M0,80 C300,50 520,110 760,80 C1000,50 1240,110 1440,85 L1440,140 L0,140 Z";
  const b2 = "M0,85 C260,115 540,55 780,85 C1020,115 1220,55 1440,80 L1440,140 L0,140 Z";
  return (
    <div className="ripple" data-ripple style={{ background: from, transform: flip ? "scaleY(-1)" : undefined }} aria-hidden="true">
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
        <path d={a2} data-a={a2} data-b={b2} fill={to} opacity="0.35" />
        <path d={a1} data-a={a1} data-b={b1} fill={to} />
      </svg>
    </div>
  );
}
