"use client";

/**
 * The dots under the certificates track.
 *
 * They stay real fragment links, so the control works before this component hydrates and
 * works with JavaScript off. The click handler exists only to stop the side effect a
 * fragment link has: the browser aligns the target with `block: "start"` in *every*
 * ancestor scroll container, so following one of these moved the horizontal track - and
 * scrolled the whole document 247px as well, measured, pushing the section's own heading
 * off the top of the screen and yanking the dots up under the cursor.
 *
 * `block: "nearest"` leaves the page where it is and moves only the track.
 */
export function CarouselDots({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="carousel-dots" aria-label="Certificates">
      {items.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="carousel-dot"
          onClick={(e) => {
            const target = document.getElementById(item.id);
            if (!target) return; // let the browser do its usual thing
            e.preventDefault();
            target.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
            history.replaceState(null, "", `#${item.id}`);
          }}
        >
          <span className="sr-only">{`Go to ${item.label}, ${i + 1} of ${items.length}`}</span>
        </a>
      ))}
    </nav>
  );
}
