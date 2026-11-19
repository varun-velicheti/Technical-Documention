"use client";
import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/content/site";
import ProductCard from "./ProductCard";

export default function ProductCatalogue() {
  const [cat, setCat] = useState("all");
  const list = PRODUCTS.filter((p) => cat === "all" || p.cat === cat);
  return (
    <>
      <div className="tabs" role="tablist" aria-label="Filter products">
        {CATEGORIES.map((c) => (
          <button key={c.id} role="tab" className="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label} <span className="muted" style={{ fontSize: 11 }}>({PRODUCTS.filter((p) => c.id === "all" || p.cat === c.id).length})</span>
          </button>
        ))}
      </div>
      <div className="pgrid" aria-live="polite">
        {list.map((p) => <ProductCard key={p.slug} p={p} sizesAttr="(max-width: 600px) 80vw, 300px" />)}
      </div>
    </>
  );
}
