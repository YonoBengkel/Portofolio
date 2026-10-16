import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/images/portrait-bw.webp";
import { Timeline, buildTimeline } from "@/components/timeline";
import { HowIWork } from "@/components/how-i-work";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { education, experience, leadership, profile, toolbox, volunteering } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "How I work, where I study, what I use, and what I lead.",
};

export default function AboutPage() {
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
            <p className="mt-12">
              <Link href="/about/activities" className="pill pill-solid" transitionTypes={["nav-forward"]}>
                See all {volunteering.length}
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
              <Link href="/about/competitions" className="pill pill-yellow" transitionTypes={["nav-forward"]}>
                Competitions
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
