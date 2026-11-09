"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The project read left to right in four to six steps. It is a diagram made of
 * words, so it survives a 375px screen and a failed image, and it answers the
 * first question a reader has: what actually happens here.
 *
 * Since 9 Nov 2026 it runs. Ilham chose The Pudding's way of telling a system one step
 * at a time over a static chain: when the case study opens, the flow lights up step by
 * step - the link into a step fills, then the step itself comes on - so the reader sees
 * the thing move from its first input to its last output before reading a word about
 * it. Any step can be clicked to run the flow up to it, and the button after the chain
 * runs it again from the start.
 *
 * It says nothing the static chain did not. The steps are the project's own, there are
 * no numbers on them and no captions: the only claim it makes is the order, which the
 * chain always made.
 *
 * It runs once, by itself, a beat after the page is up (after the curtain has cleared),
 * and never under reduced motion; there the chain sits as it always did and the button
 * lights it all at once. The list is still a list to a screen reader; lighting a step is
 * a picture of the order the list already reads in.
 */
const STEP_MS = 520;
const START_MS = 900;

export function FlowChain({ steps }: { steps: string[] }) {
  const [lit, setLit] = useState(0);
  const timer = useRef(0);
  const still = useRef(false);

  const runTo = (target: number, from = 0) => {
    window.clearInterval(timer.current);
    if (still.current) {
      setLit(target);
      return;
    }
    let k = from;
    setLit(k);
    timer.current = window.setInterval(() => {
      k += 1;
      setLit(k);
      if (k >= target) window.clearInterval(timer.current);
    }, STEP_MS);
  };

  useEffect(() => {
    still.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current) return;
    const start = window.setTimeout(() => runTo(steps.length), START_MS);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer.current);
    };
    // Runs once per page; the steps never change while a case study is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flow-wrap">
      <ol className="flow" aria-label="How it flows">
        {steps.map((step, i) => (
          <li key={step} className="flow-step" data-lit={i < lit ? "" : undefined}>
            {i > 0 && <span className="flow-mark" aria-hidden="true" />}
            <button
              type="button"
              className="flow-label"
              onClick={() => runTo(i + 1, lit > i ? 0 : lit)}
              aria-label={`${step}: run the flow up to this step`}
            >
              {step}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="flow-run" onClick={() => runTo(steps.length)}>
        <span aria-hidden="true">↻</span> {lit >= steps.length ? "Run the flow again" : "Run the flow"}
      </button>
    </div>
  );
}
