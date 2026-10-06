"use client";

import { useState } from "react";

/** Copies a value and says so, in the same place, for two seconds. */
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is selectable right next to this button.
    }
  }

  return (
    <button type="button" onClick={copy} className="meta link-quiet hover:text-bone">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
