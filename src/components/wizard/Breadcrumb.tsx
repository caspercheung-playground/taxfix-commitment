"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";

/**
 * Back button shared across the flow. Sits in the same top-row slot the
 * "Tax Year 2025-26" crumb used to occupy. When `onBack` is given (the
 * question wizard), it reuses that page's own step-back logic instead of
 * just returning home — same behavior the old bottom-of-card Back button had.
 */
export function Breadcrumb({
  onBack,
  label = "Back",
}: {
  onBack?: () => void;
  /** Override the button label — recommendation page uses "All questions answered." */
  label?: string;
}) {
  const router = useRouter();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm font-semibold">
      <button
        type="button"
        onClick={() => (onBack ? onBack() : router.push("/"))}
        className="inline-flex h-11 items-center gap-2 rounded-lg px-3 font-bold text-[var(--color-brand-dark)] transition hover:bg-[rgba(169,212,129,0.4)] hover:text-[rgb(21,70,24)]"
      >
        <Icon name="arrow-left" size={18} />
        {label}
      </button>
    </nav>
  );
}
