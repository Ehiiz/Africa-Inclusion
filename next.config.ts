import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the trace root; an unrelated lockfile in the home directory otherwise
  // makes Next infer the wrong workspace root.
  outputFileTracingRoot: import.meta.dirname,
  // better-sqlite3-style native deps are avoided entirely (libSQL is pure JS over
  // HTTP or a local file), so no serverExternalPackages entry is needed.
  experimental: {
    // Preview-image uploads travel through a Server Action; the default cap is 1 MB.
    serverActions: { bodySizeLimit: "4mb" },
  },
  images: {
    // All imagery is local and already sized for its slot.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
