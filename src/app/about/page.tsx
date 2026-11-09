import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/images/portrait-bw.webp";
import { EntryList } from "@/components/entry-list";
import { Timeline, buildTimeline } from "@/components/timeline";
import { HowIWork } from "@/components/how-i-work";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { education, experience, leadership, openTo, profile, toolbox, volunteering } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: "How I work, where I study, what I use, what I lead, and the CV.",
};

/*
  Since 9 Nov 2026 this page also carries the CV. Ilham merged the CV page into it: the CV
  page said what this page says, plus a preview of the PDF, so the preview, the download
  and the short summary moved here (#cv) and /cv redirects to them. The event committees
  are listed in full here too, rather than behind a "See all" link - this page is the one
  about him, so it should not hold anything back.
*/
export default function AboutPage() {
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", profile.cvPath));
  return (
    <PageTransition>
      <PageHeader title="About" lede={profile.intro} />

      <section className="band" aria-labelledby="method-h">
        <div className="frame">
          <div className="column">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-16">
              <div>
                <h2 id="method-h" className="h-sec reveal">
                  How I work
                </h2>
                <p className="lede reveal mt-5 max-w-[34rem]">
                  Three steps, in the order they actually happen. Most of the work is in the first one.
                </p>
              </div>
              <div className="photo reveal self-start">
                <Image src={portrait} alt={profile.name} sizes="(min-width: 768px) 17rem, 70vw" placeholder="blur" />
              </div>
            </div>
            <HowIWork />
          </div>
        </div>
      </section>

      <section className="band band-ink" aria-labelledby="exp-h">
        <div className="frame">
          <div className="column">
            <h2 id="exp-h" className="h-sec rise">
              Experience &amp; education
            </h2>
            <div className="draw rule mt-6" />
            <p className="lede rise mt-6 max-w-[38rem] opacity-80">
              Work, the seats held in student organisations, and the degree. Each one says which it
              is, because a paid internship and a committee seat are not the same claim.
            </p>
            <div className="mt-12">
              <Timeline entries={buildTimeline(experience, leadership, education)} dark />
            </div>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="org-h">
        <div className="frame">
          <div className="column">
            <h2 id="org-h" className="h-sec rise">
              Event committees
            </h2>
            <p className="lede rise mt-5 max-w-[38rem]">
              Jobs for one event, however long the event ran. The seats in an organisation are in the
              list above; these are not the same thing and are not counted as one.
            </p>
            <div className="mt-12">
              <EntryList
                entries={volunteering.map((v) => ({
                  title: `${v.role}, ${v.event}`,
                  org: v.org,
                  period: v.period,
                  body: v.body,
                  scan: v.scan,
                }))}
              />
            </div>
            <p className="mt-12">
              <Link href="/about/activities" className="pill">
                With the training courses
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="band band-slate" aria-labelledby="tools-h">
        <div className="frame">
          <div className="column">
            <h2 id="tools-h" className="h-sec reveal">
              Tools, grouped by the job they do
            </h2>
            <div className="cards cards-2 mt-12">
              {toolbox.map((t) => (
                <div key={t.group} className="tool reveal">
                  <b>{t.group}</b>
                  <span>{t.items.join(" · ")}</span>
                </div>
              ))}
            </div>
            <p className="mt-12">
              <Link href="/about/competitions" className="pill pill-yellow">
                Competitions
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* The CV, moved here from its own page. */}
      <section id="cv" className="band" aria-labelledby="cv-h">
        <div className="frame">
          <div className="column">
            <h2 id="cv-h" className="h-sec reveal">
              CV
            </h2>
            <p className="lede reveal mt-5 max-w-[38rem]">{openTo}</p>
            <p className="mt-8">
              {hasCv ? (
                <a href={profile.cvPath} download className="pill pill-solid">
                  Download the PDF
                </a>
              ) : (
                <span className="lede">The PDF is not published yet. The summary below says the same thing.</span>
              )}
            </p>

            {/* The page still answers the question if the PDF fails to load or is skipped. */}
            <div className="sticker reveal mt-12 p-7 sm:p-10">
              <h3 className="h-sec">In short</h3>
              <dl className="mt-8 grid gap-0">
                <div className="grid gap-2 pb-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline">
                  <dt className="meta opacity-70">Studying</dt>
                  <dd className="leading-snug">
                    {education.degree}, {education.school}, {education.period}
                  </dd>
                </div>
                {experience.map((e) => (
                  <div
                    key={e.role}
                    className="grid gap-2 border-t-2 border-line py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline"
                  >
                    <dt className="meta opacity-70">{e.period}</dt>
                    <dd className="leading-snug">
                      {e.role}, {e.org}
                    </dd>
                  </div>
                ))}
                <div className="grid gap-2 border-t-2 border-line pt-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline">
                  <dt className="meta opacity-70">Based in</dt>
                  <dd className="leading-snug">{profile.location}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {hasCv && (
        <section aria-label="CV preview" className="band band-slate pt-0">
          <div className="frame">
            <div className="column">
              <object
                data={profile.cvPath}
                type="application/pdf"
                className="h-[min(80svh,900px)] w-full border-2 border-ink bg-paper-2"
                aria-label="CV preview"
              >
                <p className="p-6">
                  Your browser will not show the PDF here.{" "}
                  <a href={profile.cvPath} className="underline decoration-2 underline-offset-4" download>
                    Download it instead
                  </a>
                  .
                </p>
              </object>
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
