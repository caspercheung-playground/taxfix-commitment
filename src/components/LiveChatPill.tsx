"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./icons";
import { Modal } from "./Modal";
import { useChatPopup } from "@/lib/chatPopup";

/**
 * Replaces the old "?" Help pill. Rendered in the same top-right slot on every
 * step — including the confirmation page — so it never moves on the user.
 * The chat itself is a placeholder: opening it shows a stub conversation.
 *
 * Also hosts the shared chat popup (see lib/chatPopup): any message pushed
 * into that store renders here as a speech bubble anchored under the pill,
 * animating out of it, so reminders and info content read as the assistant
 * speaking rather than as generic modals.
 */
export function LiveChatPill() {
  const [open, setOpen] = useState(false);
  const content = useChatPopup((s) => s.content);
  const dismiss = useChatPopup((s) => s.dismiss);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 items-center gap-2 rounded-full bg-[#e9ecfb] pl-1.5 pr-4 text-sm font-semibold text-[#33355a] transition hover:bg-[#dbe0f7]"
      >
        <img
          src="/avatar-zoya.jpg"
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
        Live chat and help
      </button>

      <AnimatePresence>
        {content && (
          <motion.div
            key={content.message}
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+12px)] z-40 w-80 rounded-2xl rounded-tr-sm border border-[var(--color-line)] bg-white p-4 shadow-xl"
          >
            {/* Caret pointing back up at the pill */}
            <span
              aria-hidden
              className="absolute -top-1.5 right-8 h-3 w-3 rotate-45 border-l border-t border-[var(--color-line)] bg-white"
            />
            <div className="flex items-center gap-2">
              <img src="/avatar-zoya.jpg" alt="" className="h-6 w-6 rounded-full object-cover" />
              <p className="text-xs font-semibold text-[var(--color-muted)]">Zoya · Tax assistant</p>
            </div>
            {content.title && <p className="mt-3 font-bold">{content.title}</p>}
            <div className="mt-2 space-y-2 text-sm text-[var(--color-ink)]">
              {content.message.split(/\n\n+/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {content.image && (
              <img
                src={content.image.src}
                alt={content.image.alt ?? ""}
                className="mt-3 w-full rounded-xl border border-[var(--color-line)] object-cover"
              />
            )}
            {content.link && (
              <a
                href={content.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-bold text-[var(--color-brand-dark)] underline underline-offset-2"
              >
                {content.link.label}
              </a>
            )}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                aria-label="Save"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-muted)] transition hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)]"
              >
                <Icon name="bookmark" size={16} />
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-bold text-[var(--color-brand-dark)] transition hover:bg-[var(--color-brand-dark)] hover:text-white"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
}
