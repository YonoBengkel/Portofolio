import { achievements } from "@/content/site";
import { CarouselDots } from "./carousel-dots";

/**
 * Certificates and achievements, in the reference's format: one card at a time on a
 * track, the neighbours sliced off at the edges so the eye is told there is more without
 * being offered a second thing to read, and a row of dots under it.
 *
 * It is a native scroll-snap track rather than a JavaScript carousel. The dots are real
 * anchors into the track, so the control works with the keyboard, works before the page
 * hydrates, works with JavaScript off, and the reader can also just swipe. The reference
 * drives its own with a drag handler and gives the arrows no hover or focus state at all;
 * this costs less and behaves better.
 *
 * Open point, and it is a content one rather than a code one: the reference's card is
 * roughly 45% certificate image, and there are no scans of these three in the repo. Until
 * there are, the right-hand column carries the year at display size - which is his own
 * card's watermark, promoted to the thing it was sitting behind. Drop a scan into each
 * entry and the column becomes the certificate, with the year going back behind it.
 */
export function Certificates() {
  return (
    <div className="carousel">
      <ol className="carousel-track">
        {achievements.map((a, i) => (
          <li key={a.title} id={`cert-${i + 1}`} className="carousel-slide">
            <article className="cert">
              <div className="cert-text">
                <p className="cert-kind">{a.org}</p>
                <h3 className="cert-title display">{a.title}</h3>
                <p className="cert-say">{a.body}</p>
              </div>
              <p className="cert-year display" aria-hidden="true">
                {a.year}
              </p>
              <span className="sr-only">Awarded {a.year}</span>
            </article>
          </li>
        ))}
      </ol>

      <CarouselDots items={achievements.map((a, i) => ({ id: `cert-${i + 1}`, label: a.title }))} />
    </div>
  );
}
