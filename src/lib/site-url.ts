// Absolute site URL for metadata, sitemap, and robots.
// On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set automatically (without protocol).
// Set NEXT_PUBLIC_SITE_URL yourself if you add a custom domain.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
