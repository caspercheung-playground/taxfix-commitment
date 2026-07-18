"use client";

import { useRouter } from "next/navigation";

/**
 * Single-crumb breadcrumb shared across the flow: just "Tax Year 2025-26",
 * which always returns to the Get Started entry screen. No arrow icons or
 * per-section crumbs by design — the "My Progress" panel carries the
 * where-am-I signal instead.
 */
export function Breadcrumb() {
  const router = useRouter();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm font-semibold">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
      >
        Tax Year 2025-26
      </button>
    </nav>
  );
}
