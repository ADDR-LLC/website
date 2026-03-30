import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Ensure content files are bundled in Vercel's serverless output.
  // Without this, fs.readFileSync calls for src/content/blog fail on Vercel
  // because only files explicitly imported (or in /public) are included.
  outputFileTracingIncludes: {
    "/blog": ["./src/content/blog/**/*"],
    "/blog/[slug]": ["./src/content/blog/**/*"],
  },
};

export default nextConfig;
