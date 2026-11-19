export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
export const isPhone = (v) => /^[+]?[0-9\s-]{10,16}$/.test(String(v || "").trim());
export const isPin = (v) => /^[1-9][0-9]{5}$/.test(String(v || "").trim());

/**
 * Form schemas shared by client and server. Each field: required, kind, max.
 */
export const SCHEMAS = {
  contact: {
    name: { required: true, max: 80 },
    email: { required: true, kind: "email" },
    phone: { kind: "phone" },
    topic: { required: true, max: 60 },
    message: { required: true, max: 2000, min: 10 },
    consent: { required: true, kind: "checkbox" },
  },
  bulk: {
    segment: { required: true, max: 40 },
    name: { required: true, max: 80 },
    organisation: { required: true, max: 120 },
    email: { required: true, kind: "email" },
    phone: { required: true, kind: "phone" },
    city: { required: true, max: 60 },
    pin: { kind: "pin" },
    format: { max: 60 },
    volume: { required: true, max: 60 },
    date: { max: 20 },
    message: { max: 2000 },
  },
  distributor: {
    partnerType: { required: true, max: 40 },
    business: { required: true, max: 120 },
    name: { required: true, max: 80 },
    email: { required: true, kind: "email" },
    phone: { required: true, kind: "phone" },
    city: { required: true, max: 60 },
    state: { required: true, max: 60 },
    gst: { max: 20 },
    experience: { max: 60 },
    message: { max: 2000 },
  },
  newsletter: {
    email: { required: true, kind: "email" },
  },
  notify: {
    email: { required: true, kind: "email" },
    pin: { required: true, kind: "pin" },
  },
};

export function validate(type, data) {
  const schema = SCHEMAS[type];
  if (!schema) return { ok: false, errors: { _form: "Unknown form." } };
  const errors = {};
  const clean = {};
  for (const [key, rule] of Object.entries(schema)) {
    let v = data?.[key];
    if (rule.kind === "checkbox") {
      const on = v === true || v === "on" || v === "true";
      if (rule.required && !on) errors[key] = "Please confirm to continue.";
      clean[key] = on;
      continue;
    }
    v = typeof v === "string" ? v.trim() : v == null ? "" : String(v);
    if (rule.required && !v) { errors[key] = "This field is required."; continue; }
    if (v) {
      if (rule.max && v.length > rule.max) errors[key] = `Please keep this under ${rule.max} characters.`;
      if (rule.min && v.length < rule.min) errors[key] = `Please write at least ${rule.min} characters.`;
      if (rule.kind === "email" && !isEmail(v)) errors[key] = "Enter a valid email address.";
      if (rule.kind === "phone" && !isPhone(v)) errors[key] = "Enter a valid phone number.";
      if (rule.kind === "pin" && !isPin(v)) errors[key] = "Enter a valid 6-digit PIN code.";
    }
    clean[key] = v;
  }
  return { ok: Object.keys(errors).length === 0, errors, data: clean };
}
