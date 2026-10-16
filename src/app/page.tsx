import Link from "next/link";
import { AboutCard } from "@/components/about-card";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { PageTransition } from "@/components/page-transition";
import { WorkGrid } from "@/components/work-grid";
import { projects } from "@/content/projects";
import { experience, leadership, toolbox } from "@/content/site";

/**
 * The home page is a sequence of full-bleed bands: paper, ink, paper, slate, paper.
 * That alternation is the structure Ilham picked off alieffauzan.com, with his content
 * in it and nothing invented on top.
 */
export default function Home() {
  const role = experience[0];
  const lead = leadership[0];

  return (
    <PageTransition>
      <Hero />

      <Marquee text="About me" />

      <section className="band" aria-labelledby="about-h">
        <div className="frame">
          <div className="column">
            <h2 id="about-h" className="sr-only">
              About
            </h2>
            <AboutCard />
          </div>
        </div>
      </section>

      <section className="band band-ink" aria-labelledby="exp-h">
        <div className="frame">
          <div className="column">
            <h2 id="exp-h" className="h-sec reveal">
              Experience &amp; leadership
            </h2>
            <div className="mt-12 grid gap-5">
              <article className="sticker sticker-ink entry reveal">
                <p className="entry-n">01</p>
                <div>
                  <p className="meta opacity-70">{role.period}</p>
                  <h3 className="work-title mt-1.5">{role.role}</h3>
                  <p className="mt-1 opacity-80">{role.org}</p>
                  <ul className="mt-4 grid gap-2.5">
                    {role.points.map((point) => (
                      <li key={point} className="leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="sticker sticker-ink entry reveal">
                <p className="entry-n">02</p>
                <div>
                  <p className="meta opacity-70">{lead.period}</p>
                  <h3 className="work-title mt-1.5">{lead.role}</h3>
                  <p className="mt-1 opacity-80">{lead.org}</p>
                  <p className="mt-4 leading-relaxed">{lead.body}</p>
                </div>
              </article>
            </div>

            <p className="mt-10">
              <Link href="/about" className="pill" transitionTypes={["nav-forward"]}>
                The rest of it
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="tools-h">
        <div className="frame">
          <div className="column">
            <h2 id="tools-h" className="h-sec reveal">
              Tools &amp; languages
            </h2>
            <div className="cards cards-2 cards-3 mt-12">
              {toolbox.map((group) => (
                <div key={group.group} className="tool reveal">
                  <b>{group.group}</b>
                  <span>{group.items.join(" · ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Marquee text="Project" />

      <section className="band band-slate" aria-labelledby="work-h">
        <div className="frame">
          <div className="column">
            <h2 id="work-h" className="h-sec reveal">
              Projects
            </h2>
            <p className="lede reveal mt-5 max-w-[38rem] opacity-85">
              Four case studies, each written from what it actually does rather than from the stack it was
              built with.
            </p>
            <div className="mt-12">
              <WorkGrid projects={projects} />
            </div>
            <p className="mt-12">
              <Link href="/work" className="pill pill-yellow" transitionTypes={["nav-forward"]}>
                See all four in full
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
