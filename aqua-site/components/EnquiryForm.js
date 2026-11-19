"use client";
import { useEffect, useRef, useState } from "react";
import { validate } from "@/lib/validate";
import { Arrow } from "./Icons";

/**
 * Generic, accessible enquiry form.
 * fields: [{ name, label, type: text|email|tel|select|textarea|date|checkbox, options, full, autoComplete, placeholder }]
 */
export default function EnquiryForm({ type, fields, submitLabel = "Send enquiry", success, extra = {}, initial = {}, id }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, initial[f.name] ?? (f.type === "checkbox" ? false : "")])));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const formRef = useRef(null);

  useEffect(() => {
    setValues((v) => ({ ...v, ...initial }));
  }, [JSON.stringify(initial)]); // eslint-disable-line

  const set = (name, v) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = validate(type, { ...values, ...extra });
    if (!res.ok) {
      setErrors(res.errors);
      setStatus({ state: "error", msg: "Please check the highlighted fields." });
      const first = formRef.current?.querySelector(`[name="${Object.keys(res.errors)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus({ state: "busy", msg: "Sending…" });
    try {
      const r = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, ...values, ...extra, website: formRef.current.website.value }) });
      const json = await r.json();
      if (!json.ok) {
        setErrors(json.errors || {});
        setStatus({ state: "error", msg: json.error || "Please check the highlighted fields." });
        return;
      }
      setStatus({ state: "ok", msg: `${success || "Thank you — we'll be in touch shortly."} Reference: ${json.ref}` });
      setValues(Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : f.type === "select" ? values[f.name] : ""])));
    } catch {
      setStatus({ state: "error", msg: "Network error. Please try again, or reach us on WhatsApp." });
    }
  };

  return (
    <form className="form" onSubmit={submit} noValidate ref={formRef} id={id}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      {fields.map((f) => {
        const fid = `${type}-${f.name}`;
        const err = errors[f.name];
        const common = {
          id: fid, name: f.name, "aria-invalid": err ? "true" : undefined, "aria-describedby": err ? `${fid}-err` : undefined,
          autoComplete: f.autoComplete, placeholder: f.placeholder,
        };
        if (f.type === "checkbox") {
          return (
            <div className="field field--full" key={f.name}>
              <label className="check" htmlFor={fid} style={{ textTransform: "none", letterSpacing: 0, fontSize: 14 }}>
                <input type="checkbox" {...common} checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />
                <span>{f.label}</span>
              </label>
              {err && <span className="err" id={`${fid}-err`}>{err}</span>}
            </div>
          );
        }
        return (
          <div className={`field${f.full ? " field--full" : ""}`} key={f.name}>
            <label htmlFor={fid}>{f.label}{f.optional ? <span style={{ textTransform: "none", letterSpacing: 0 }}> (optional)</span> : null}</label>
            {f.type === "select" ? (
              <select className="select" {...common} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                <option value="">Select…</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <textarea className="textarea" {...common} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
            ) : (
              <input className="input" type={f.type || "text"} inputMode={f.inputMode} maxLength={f.maxLength} {...common} value={values[f.name]} onChange={(e) => set(f.name, f.inputMode === "numeric" ? e.target.value.replace(/\D/g, "") : e.target.value)} />
            )}
            {err && <span className="err" id={`${fid}-err`}>{err}</span>}
          </div>
        );
      })}
      <div className="form__foot">
        <p className="form-status" data-state={status.state} role={status.state === "error" ? "alert" : "status"} aria-live="polite" style={{ margin: 0, maxWidth: "46ch" }}>{status.msg}</p>
        <button className="btn" disabled={status.state === "busy"}>{status.state === "busy" ? "Sending…" : submitLabel} <Arrow /></button>
      </div>
    </form>
  );
}
