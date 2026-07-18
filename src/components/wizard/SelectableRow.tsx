"use client";

import { Icon, type IconName } from "@/components/icons";

/**
 * The one selector building block used by every selection screen. Selection
 * controls are always circular — never square. Rows with an icon don't get a
 * separate selector at all: the icon's own circle IS the indicator, turning
 * green with a checkmark when selected. Rows without an icon fall back to a
 * circular radio/checkbox on the left.
 */
export function SelectableRow({
  mode,
  selected,
  icon,
  label,
  description,
  onClick,
}: {
  mode: "radio" | "checkbox";
  selected: boolean;
  icon?: IconName;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  const indicator = icon ? (
    // Icon doubles as the selected indicator — green circle + check when picked
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        selected
          ? "bg-[var(--color-brand-dark)] text-white"
          : "bg-white text-[var(--color-ink)]"
      }`}
    >
      <Icon name={selected ? "check" : icon} size={18} />
    </span>
  ) : (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        selected
          ? "border-[var(--color-brand-dark)] bg-[var(--color-brand-dark)]"
          : "border-[var(--color-line)] bg-white"
      }`}
    >
      {selected &&
        (mode === "radio" ? (
          <span className="h-2 w-2 rounded-full bg-white" />
        ) : (
          <Icon name="check" size={12} className="text-white" />
        ))}
    </span>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-[var(--color-brand-dark)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
          : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
      }`}
    >
      {indicator}
      <div className="min-w-0 flex-1">
        <span className="font-bold">{label}</span>
        {description && <p className="mt-0.5 text-sm text-[var(--color-muted)]">{description}</p>}
      </div>
    </button>
  );
}
