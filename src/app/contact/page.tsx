import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { profile } from "@/content/site";

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

      <section className="lit">
        <div className="column pb-24">
          <dl className="grid gap-7">
            {rows.map((row) => (
              <div key={row.label} className="recede-rule border-t border-concrete pt-4">
                <dt className="meta">{row.label}</dt>
                <dd className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {row.href ? (
                    <a
                      href={row.href}
                      className="link text-[1.05rem]"
                      {...(row.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="text-[1.05rem]">{row.value}</span>
                  )}
                  {row.copy && <CopyButton value={row.value} />}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 max-w-[34rem] leading-relaxed text-ash">
            I am glad to walk through any of the case studies in more detail, including the parts that did not work.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
