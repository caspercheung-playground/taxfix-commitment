"use client";

import { Icon } from "@/components/icons";
import type { Category } from "@/lib/types";

function CheckIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="mx-auto h-36 w-auto" aria-hidden>
      <ellipse cx="100" cy="140" rx="70" ry="10" fill="var(--color-cream)" />
      <g transform="translate(40 15) rotate(-8)">
        <rect x="0" y="10" width="90" height="90" rx="18" fill="var(--color-brand)" />
        <path
          d="M22 58 L45 82 L92 24"
          fill="none"
          stroke="var(--color-brand-dark)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function CategoryComplete({
  heading,
  sub,
  nextCategory,
  onContinue,
}: {
  heading: string;
  sub: string;
  nextCategory: Category | null;
  onContinue: () => void;
}) {
  return (
    <div className="rounded-3xl bg-[var(--color-cream)] p-8 text-center sm:p-12">
      <CheckIllustration />
      <h3 className="mt-4 text-2xl font-extrabold">{heading}</h3>
      <p className="mt-2 text-[var(--color-muted)]">{sub}</p>

      <div className="mx-auto mt-8 flex max-w-md items-center justify-between gap-4 rounded-2xl bg-white p-4 text-left shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
            <Icon name={nextCategory ? nextCategory.icon : "sparkles"} size={20} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {nextCategory ? "Next" : "All done"}
            </p>
            <p className="font-bold">{nextCategory ? nextCategory.title : "Best Service for me"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="shrink-0 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
        >
          {nextCategory ? "Continue" : "Check"}
        </button>
      </div>
    </div>
  );
}
