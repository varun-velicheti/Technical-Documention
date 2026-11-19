/** Sub-path the site is served from ("" at a domain root, "/Technical-Documention/kemps" on GitHub Pages). */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p) => `${BASE}${p}`;
