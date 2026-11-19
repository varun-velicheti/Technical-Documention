import Link from "next/link";
export default function NotFound() {
  return (
    <div className="legal" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <span className="eyebrow">404</span>
        <h1 className="h2" style={{ margin: "18px 0 28px" }}>This page has <em>evaporated.</em></h1>
        <Link href="/" className="btn">Return home</Link>
      </div>
    </div>
  );
}
