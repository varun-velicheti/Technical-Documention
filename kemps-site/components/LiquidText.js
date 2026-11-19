/** Headline split into lines that rise through a fluid mask (animated by <Motion/>). */
export default function LiquidText({ as: Tag = "h2", lines, className = "h2", id, auto }) {
  return (
    <Tag className={className} id={id} data-lq={auto ? "auto" : ""}>
      {lines.map((line, i) => (
        <span className="lq-line" key={i}>
          <span className="lq-inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
