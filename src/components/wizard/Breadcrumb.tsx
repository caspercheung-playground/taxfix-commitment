"use client";

import { useRouter } from "next/navigation";

/**
 * Single-crumb breadcrumb shared across the flow: just "Tax Year 2025-26",
 * which always returns to the Get Started entry screen. No arrow icons or
 * per-section crumbs by design — the "My Progress" panel carries the
 * where-am-I signal instead.
 */
export function Breadcrumb({ onBack }: { onBack?: () => void }) {
  const router = useRouter();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm font-semibold">
      <button
        type="button"
        onClick={() => (onBack ? onBack() : router.push("/"))}
        className="flex h-11 items-center gap-2 rounded-full px-4 text-[var(--color-brand-dark)] transition hover:bg-[rgba(169,212,129,0.4)] hover:text-[rgb(21,70,24)]"
      >
        ← Back
      </button>
    </nav>
  );
}
