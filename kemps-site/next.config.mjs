/**
 * Static export: `npm run build` writes a plain HTML/CSS/JS site to ./out.
 * Set NEXT_PUBLIC_BASE_PATH when serving from a sub-path (e.g. GitHub Pages: /Technical-Documention/kemps).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  basePath,
};
export default nextConfig;
