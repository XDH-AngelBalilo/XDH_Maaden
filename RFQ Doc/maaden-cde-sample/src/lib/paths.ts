/**
 * The base path the app is mounted on, and a helper for the URLs Next does
 * not rewrite for us.
 *
 * `basePath` in next.config.mjs covers everything that goes through the
 * framework: pages, static assets, <Link href>, router.push, next/image.
 * It does NOT touch a string handed to `fetch`, because Next cannot tell an
 * internal route from a third-party API. Every fetch to our own /api/v1
 * therefore has to be prefixed by hand, and this is that hand.
 *
 * usePathname() strips the prefix back off, so comparisons against the plain
 * hrefs in Sidebar's NAV keep working untouched.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix an app-absolute path with the base path. `api("/api/v1/assets")`. */
export const api = (path: string) => `${BASE_PATH}${path}`;
