/**
 * The app is served under a path on the platform, not on a hostname of its
 * own. app.xdhouse.ai already has the tunnel, the certificate and the
 * Cloudflare Access policy; giving the demo its own hostname would mean a
 * second DNS record and a second policy to keep in step, for one client
 * walkthrough. So the platform rewrites /maaden/* to this container and the
 * app answers on that prefix.
 *
 * basePath makes Next emit every asset, route and Link under the prefix.
 * `env` publishes the same value to the client bundle, because raw
 * fetch("/api/...") calls are the one thing basePath does NOT rewrite — see
 * src/lib/paths.ts. Changing the prefix means changing it here only.
 */
const BASE_PATH = "/maaden";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits a self-contained server tree at .next/standalone, which the
  // Dockerfile copies onto a bare node:20-alpine. Without it the production
  // image would have to carry the whole node_modules directory, and the
  // container would be several hundred megabytes of build tooling that never
  // runs. Nothing about `npm run dev` changes.
  output: "standalone",
  basePath: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
};

export default nextConfig;
