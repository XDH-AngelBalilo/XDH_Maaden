/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits a self-contained server tree at .next/standalone, which the
  // Dockerfile copies onto a bare node:20-alpine. Without it the production
  // image would have to carry the whole node_modules directory, and the
  // container would be several hundred megabytes of build tooling that never
  // runs. Nothing about `npm run dev` changes.
  output: "standalone",
};

export default nextConfig;
