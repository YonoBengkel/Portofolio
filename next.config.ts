import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    The first case study was called Warungku until the app itself was renamed Turnify Flow
    on 12 Oct 2026. Its old address is already in CVs and applications that have been
    sent, so it is redirected rather than left to 404.
  */
  async redirects() {
    return [{ source: "/work/warungku", destination: "/work/turnify-flow", permanent: true }];
  },
};

export default nextConfig;
