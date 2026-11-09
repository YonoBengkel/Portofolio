import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    The first case study was called Warungku until the app itself was renamed Turnify Flow
    on 12 Oct 2026. Its old address is already in CVs and applications that have been
    sent, so it is redirected rather than left to 404.
  */
  /*
    /cv was folded into /about on 9 Nov 2026 - Ilham's call: the two pages said the same
    thing apart from the PDF preview. The address is in CVs and messages already sent, so
    it lands on the CV section of /about instead of a 404.
  */
  async redirects() {
    return [
      { source: "/work/warungku", destination: "/work/turnify-flow", permanent: true },
      { source: "/cv", destination: "/about#cv", permanent: true },
    ];
  },
};

export default nextConfig;
