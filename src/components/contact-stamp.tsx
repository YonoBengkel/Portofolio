"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

/**
 * The round stamp on the footer's hairline: the way to get in touch, and the one thing
 * in the footer that answers the pointer.
 *
 * Ilham picked it on 9 Nov 2026 from Dennis Snellenberg's round magnetic buttons, and the
 * numbers are his, measured off the live site rather than eyeballed: the button carries
 * data-strength="100" and its label data-strength-text="50", so while the pointer is over
 * it the stamp sits (offset from centre, -0.5..0.5) x 100px towards it and the label a
 * further x 50px, each eased over 1.5s with a quint ease-out; let go, both spring home
 * over 1.5s on an elastic ease-out. His version tilts by 0.001deg to keep the text sharp
 * mid-move; here the stamp has a real tilt of its own, so that trick is not needed.
 *
 * What changes is the object. His is a plain disc; this is a rubber stamp in the site's
 * yellow - two rings, the words running round the edge, the mark in the middle - and
 * pressing it presses it. The ring turns slowly while the footer is on screen, and only
 * then (marquee-run, the same observer as every other band).
 *
 * Touch gets none of the pull: there is no pointer hovering to be pulled towards. The
 * whole thing is a link to /contact, so it is left out on /contact itself.
 */
const STRENGTH = 100;
const STRENGTH_TEXT = 50;

export function ContactStamp() {
  const path = usePathname();
  if (path === "/contact") return null;

  const pull = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === "touch") return;
    const spot = e.currentTarget.parentElement;
    if (!spot) return;
    // Measured against the spot, which does not move, so the pull cannot feed back on itself.
    const r = spot.getBoundingClientRect();
    const rx = (e.clientX - r.left) / r.width - 0.5;
    const ry = (e.clientY - r.top) / r.height - 0.5;
    const el = e.currentTarget;
    el.dataset.pull = "";
    el.style.setProperty("--mx", `${(rx * STRENGTH).toFixed(1)}px`);
    el.style.setProperty("--my", `${(ry * STRENGTH).toFixed(1)}px`);
    el.style.setProperty("--tx", `${(rx * STRENGTH_TEXT).toFixed(1)}px`);
    el.style.setProperty("--ty", `${(ry * STRENGTH_TEXT).toFixed(1)}px`);
  };

  const release = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    delete el.dataset.pull;
    for (const v of ["--mx", "--my", "--tx", "--ty"]) el.style.removeProperty(v);
  };

  return (
    <div className="contact-stamp-spot">
      <Link
        href="/contact"
        className="contact-stamp marquee-run"
        onPointerMove={pull}
        onPointerLeave={release}
        aria-label="Get in touch"
      >
        <span className="contact-stamp-face" aria-hidden="true">
          <svg className="contact-stamp-ring" viewBox="0 0 200 200">
            <defs>
              <path id="stamp-arc" d="M100,100 m-79,0 a79,79 0 1,1 158,0 a79,79 0 1,1 -158,0" />
            </defs>
            <circle cx="100" cy="100" r="96" />
            <circle cx="100" cy="100" r="62" />
            <text>
              <textPath href="#stamp-arc" textLength="490" lengthAdjust="spacing">
                Get in touch ✦ Get in touch ✦ Get in touch ✦
              </textPath>
            </text>
          </svg>
          <span className="contact-stamp-mark">
            <Logo size={46} />
          </span>
        </span>
      </Link>
    </div>
  );
}
