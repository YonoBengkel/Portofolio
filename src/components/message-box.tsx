"use client";

import { useState } from "react";

/**
 * A message box on /contact that hands the message to the visitor's own email app.
 *
 * Ilham chose mailto on 9 Nov 2026 over a form service: nothing leaves the browser until
 * the visitor sends it themselves, there is no third party holding the messages, and
 * there is no key to look after. LinkedIn and Instagram were asked about as well, but
 * neither lets a website drop a message into someone's inbox, so they stay links.
 *
 * The honest consequence is that the message is not sent from here: the button opens a
 * ready-to-send email. The button says so, and a desktop with no mail app set up opens
 * nothing at all, so after the click the box offers to copy the message and shows the
 * address to paste it into.
 *
 * 1800 characters is the cap: some mail apps cut a mailto link off at about 2000, and a
 * message truncated without warning is worse than one the box will not let grow.
 */
const MAX = 1800;

export function MessageBox({ to }: { to: string }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  const body = `${message.trim()}\n\n- ${name.trim() || "Sent from your portfolio"}`;
  const title = subject.trim() || `Hello from your portfolio${name.trim() ? `, from ${name.trim()}` : ""}`;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${to}\nSubject: ${title}\n\n${body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <form className="mbox sticker" onSubmit={send}>
      <div className="mbox-row">
        <label className="mbox-field">
          <span className="meta">Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} />
        </label>
        <label className="mbox-field">
          <span className="meta">Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} placeholder="Optional" />
        </label>
      </div>
      <label className="mbox-field">
        <span className="meta">
          Message <span className="mbox-count">{message.length}/{MAX}</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={7}
          maxLength={MAX}
          required
        />
      </label>
      <div className="mbox-acts">
        <button type="submit" className="stamp stamp-fill" disabled={!message.trim()}>
          Open it in my email app
        </button>
        <span className="mbox-note">Nothing is sent from this page: your email app opens with the message ready.</span>
      </div>
      {opened && (
        <p className="mbox-after" role="status">
          No email app opened?{" "}
          <button type="button" className="mbox-copy" onClick={copy}>
            {copied ? "Copied" : "Copy the message"}
          </button>{" "}
          and send it to <b>{to}</b>.
        </p>
      )}
    </form>
  );
}
