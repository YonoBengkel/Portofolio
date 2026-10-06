import type { Metadata } from "next";
import { EntryList } from "@/components/entry-list";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { leadership, volunteering } from "@/content/site";

export const metadata: Metadata = {
  title: "Organisations and committees",
  description: "Seats held in student organisations, and the event committees worked on.",
};

export default function ActivitiesPage() {
  return (
    <PageTransition>
      <PageHeader
        title="Organisations and committees"
        lede="A seat in an organisation and a job for one event are different things, so they are listed apart."
        back={{ href: "/about", label: "Back to about" }}
      />

      <section aria-labelledby="orgs-title" className="lit">
        <div className="column pb-20">
          <h2 id="orgs-title" className="display text-[clamp(1.7rem,4vw,2.5rem)]">
            Seats held
          </h2>
          <EntryList
            entries={leadership.map((l) => ({ title: l.role, org: l.org, meta: l.period, body: l.body }))}
          />
        </div>
      </section>

      <section aria-labelledby="committees-title" className="lit">
        <div className="column pb-24">
          <h2 id="committees-title" className="display text-[clamp(1.7rem,4vw,2.5rem)]">
            Event committees
          </h2>
          <EntryList
            entries={volunteering.map((v) => ({
              title: `${v.role}, ${v.event}`,
              org: v.org,
              meta: v.period,
              body: v.body,
            }))}
          />
        </div>
      </section>
    </PageTransition>
  );
}
