"use client";
import { useEffect, useState } from "react";

export const toast = (msg) => window.dispatchEvent(new CustomEvent("toast", { detail: msg }));

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t;
    const h = (e) => { setMsg(e.detail); setOn(true); clearTimeout(t); t = setTimeout(() => setOn(false), 3200); };
    window.addEventListener("toast", h);
    return () => { window.removeEventListener("toast", h); clearTimeout(t); };
  }, []);
  return <div className={`toast${on ? " is-on" : ""}`} role="status" aria-live="polite">{msg}</div>;
}
