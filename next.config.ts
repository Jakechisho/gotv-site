import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces a plain static site in /out (used for previews).
const nextConfig: NextConfig = process.env.STATIC_EXPORT
  ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
  : {};

export default nextConfig;
