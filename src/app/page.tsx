import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { PageTransition } from "@/components/page-transition";
import { atAGlance, openTo, profile } from "@/content/site";

export default function Home() {
  // The CV link only appears once public/cv.pdf exists.
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", profile.cvPath));

  return (
    <PageTransition>
      <Hero hasCv={hasCv} />

      {/* The home page is an overview and nothing else: who I am, where to find me,
          and three doors. The work lives on its own page. */}
      <section aria-label="At a glance" className="lit">
        <div className="column pb-20">
          <dl className="grid gap-7 sm:grid-cols-2">
            {atAGlance.map((item) => (
              <div key={item.label} className="reveal recede-rule border-t border-concrete pt-4">
                <dt className="meta">{item.label}</dt>
                <dd className="mt-2 leading-snug">{item.value}</dd>
              </div>
            ))}
            <div className="reveal recede-rule border-t border-concrete pt-4 sm:col-span-2">
              <dt className="meta">Available</dt>
              <dd className="mt-2 leading-snug">{openTo}</dd>
            </div>
          </dl>

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            <li>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="link">
                {profile.email}
              </a>
            </li>
            <li>
              <Link href="/about" className="link" transitionTypes={["nav-forward"]}>
                More about me
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageTransition>
  );
}
