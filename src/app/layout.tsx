import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// One family for everything, from the giant section words to body text.
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name}: Business Process, Data & Applied AI`,
    template: `%s | ${profile.name}`,
  },
  description: profile.tagline,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: `${profile.name}: Business Process, Data & Applied AI`,
    description: profile.tagline,
    siteName: profile.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-raincoat focus:px-4 focus:py-3 focus:font-bold focus:text-on-raincoat"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
