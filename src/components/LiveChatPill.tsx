"use client";

import { useState } from "react";
import { Modal } from "./Modal";

/**
 * Replaces the old "?" Help pill. Rendered in the same top-right slot on every
 * step — including the confirmation page — so it never moves on the user.
 * The chat itself is a placeholder: opening it shows a stub conversation.
 */
export function LiveChatPill() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-[var(--color-cream)] py-1.5 pl-1.5 pr-4 text-sm font-semibold transition hover:bg-[var(--color-cream-border)]"
      >
        <img
          src="/avatar-zoya.jpg"
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
        Live chat
      </button>

      <Modal open={open} title="Live chat" onClose={() => setOpen(false)}>
        <div className="flex items-center gap-3">
          <img src="/avatar-zoya.jpg" alt="" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="font-bold">Zoya</p>
            <p className="text-sm text-[var(--color-muted)]">Tax assistant · online</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl rounded-tl-sm bg-[var(--color-cream)] p-4 text-sm">
          Hi! I&apos;m here if you get stuck on any question. Chat is coming soon in this
          prototype — for now, you can keep going and nothing you enter will be lost.
        </div>
        <input
          type="text"
          disabled
          placeholder="Type a message… (coming soon)"
          className="mt-4 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </Modal>
    </>
  );
}
