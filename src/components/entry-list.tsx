/**
 * The one list shape used by about, competitions and volunteering: a quiet
 * rule, a line of metadata, a title, and a sentence. Repeating one shape is
 * what lets the reader stop learning the layout and start reading.
 */
export type Entry = {
  title: string;
  org?: string;
  meta?: string;
  body?: string;
};

export function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="mt-10">
      {entries.map((e) => (
        <li key={`${e.title}-${e.meta ?? ""}`} className="recede-rule border-t border-concrete py-7 first:pt-0">
          {e.meta && <p className="meta">{e.meta}</p>}
          <h3 className="mt-2 text-[1.15rem] font-semibold leading-snug">{e.title}</h3>
          {e.org && <p className="mt-1 text-ash">{e.org}</p>}
          {e.body && <p className="mt-3 max-w-[34rem] leading-relaxed text-ash">{e.body}</p>}
        </li>
      ))}
    </ul>
  );
}
