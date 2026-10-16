import { howIWork } from "@/content/site";

/**
 * Three numbered steps, in the order the work actually happens.
 *
 * The flowchart symbols that used to sit beside each step are gone with the rest of the
 * old drawing; the number carries the sequence, which is all the symbols were doing.
 */
export function HowIWork() {
  return (
    <ol className="cards cards-3 mt-12">
      {howIWork.map((step, i) => (
        <li key={step.title} className="sticker reveal p-7">
          <p className="entry-n">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="work-title mt-4">{step.title}</h3>
          <p className="mt-3 leading-relaxed">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
