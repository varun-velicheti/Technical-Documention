/** Static export: `npm run build` writes a plain HTML/CSS/JS site to ./out that can be hosted anywhere. */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};
export default nextConfig;
