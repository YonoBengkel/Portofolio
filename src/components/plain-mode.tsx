"use client";

import { useSyncExternalStore } from "react";

const KEY = "plain-mode";

// The flag lives on <html>, where the CSS reads it and where the layout's boot script
// has already restored it. React only subscribes to it.
let listeners: (() => void)[] = [];

function subscribe(onChange: () => void) {
  listeners = [...listeners, onChange];
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

const isPlain = () => document.documentElement.dataset.plain === "on";

/**
 * Plain mode strips the grain, the fog and the light pools, leaving a flat
 * high-contrast dark page. It is there for anyone who finds the atmosphere gets
 * in the way, and the choice is remembered on this device.
 */
export function PlainModeToggle() {
  const plain = useSyncExternalStore(subscribe, isPlain, () => false);

  function toggle() {
    document.documentElement.dataset.plain = plain ? "off" : "on";
    try {
      localStorage.setItem(KEY, plain ? "off" : "on");
    } catch {
      // A browser with storage blocked still gets the toggle for this page view.
    }
    listeners.forEach((l) => l());
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={plain} className="meta link-quiet hover:text-bone">
      Plain mode
    </button>
  );
}
