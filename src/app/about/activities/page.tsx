import type { Metadata } from "next";
import { EntryList } from "@/components/entry-list";
import { Marquee } from "@/components/marquee";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { leadership, training, volunteering } from "@/content/site";

export const metadata: Metadata = {
  title: "Organisations and committees",
  description: "Seats held in student organisations, and the event committees worked on.",
};

export default function ActivitiesPage() {
  return (
    <PageTransition>
      <PageHeader
        title="Organisations &amp; committees"
        lede="A seat in an organisation, a job for one event, and a training course attended are three different things, so they are listed apart."
        back={{ href: "/about", label: "Back to about" }}
      />

      <section className="band" aria-labelledby="seats-h">
        <div className="frame">
          <div className="column">
            <h2 id="seats-h" className="h-sec reveal">
              Seats held
            </h2>
            <div className="mt-12">
              <EntryList
                entries={leadership.map((l) => ({ title: l.role, org: l.org, period: l.period, body: l.body }))}
              />
            </div>
          </div>
        </div>
      </section>

      <Marquee text="Event committees" />

      <section className="band band-slate" aria-labelledby="committees-h">
        <div className="frame">
          <div className="column">
            <h2 id="committees-h" className="h-sec reveal">
              Event committees
            </h2>
            <p className="lede reveal mt-5 max-w-[38rem] opacity-85">
              Jobs for one event, however long that event ran.
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
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="training-h">
        <div className="frame">
          <div className="column">
            <h2 id="training-h" className="h-sec reveal">
              Training &amp; seminars
            </h2>
            <p className="lede reveal mt-5 max-w-[38rem]">
              Things he sat in rather than ran. They are here and not with the awards, because attending
              something is not an achievement and the page should not imply it was.
            </p>
            <div className="mt-12">
              <EntryList
                entries={training.map((t) => ({
                  title: t.title,
                  org: t.org,
                  period: t.period,
                  body: t.body,
                  scan: t.scan,
                }))}
              />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
