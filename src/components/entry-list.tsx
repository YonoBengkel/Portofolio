/**
 * A list of things that each have a name, a place, a period and a line about them:
 * competitions, volunteer roles, organisations.
 *
 * Numbered stickers rather than a bulleted list, because every other list on this site
 * is numbered and a reader should be able to say "the third one" out loud.
 */
export type Entry = { title: string; org: string; period: string; body: string };

export function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ol className="stagger grid gap-5">
      {entries.map((entry, i) => (
        <li
          key={`${entry.title}-${entry.period}`}
          className="sticker entry"
          style={{ "--i": i } as React.CSSProperties}
        >
          <p className="entry-n">{String(i + 1).padStart(2, "0")}</p>
          <div>
            <p className="meta opacity-70">{entry.period}</p>
            <h3 className="work-title mt-1.5">{entry.title}</h3>
            <p className="mt-1 opacity-80">{entry.org}</p>
            <p className="mt-4 leading-relaxed">{entry.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
