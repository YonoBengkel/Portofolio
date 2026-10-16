import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { openTo, profile } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, LinkedIn and GitHub.",
};

export default function ContactPage() {
  const rows = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, copy: true },
    { label: "LinkedIn", value: "linkedin.com/in/ilham-bintang-satria", href: profile.links.linkedin },
    { label: "GitHub", value: "github.com/YonoBengkel", href: profile.links.github },
    { label: "Based in", value: profile.location },
  ];

  return (
    <PageTransition>
      <PageHeader title="Contact" lede="Email is the fastest way to reach me. Everything else is here too." />

      <section className="band">
        <div className="frame">
          <div className="column">
            <div className="sticker reveal p-7 sm:p-10">
              <dl className="grid gap-0">
                {rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`grid gap-2 py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline ${
                      i ? "border-t-2 border-line" : "pt-0"
                    }`}
                  >
                    <dt className="meta opacity-70">{row.label}</dt>
                    <dd className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[1.05rem]">
                      {row.href ? (
                        <a
                          href={row.href}
                          target={row.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel={row.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                          className="underline decoration-2 underline-offset-4 hover:decoration-yellow"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                      {row.copy && <CopyButton value={row.value} />}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="lede reveal mt-10 max-w-[38rem]">{openTo}</p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
