"use client";

import { Icon, type IconName } from "@/components/icons";

/**
 * The one selector building block used by every selection screen — income
 * sources, self-employment type of work, property income type, and general
 * allowances. Selector (radio/checkbox) is always on the left; an icon, if
 * given, defaults to the right but can be pinned left per-screen. Single- vs
 * multi-choice is a prop, not a different component.
 */
export function SelectableRow({
  mode,
  selected,
  icon,
  iconPosition = "right",
  label,
  description,
  onClick,
}: {
  mode: "radio" | "checkbox";
  selected: boolean;
  icon?: IconName;
  iconPosition?: "left" | "right";
  label: string;
  description?: string;
  onClick: () => void;
}) {
  const selector = (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
        mode === "radio" ? "rounded-full" : "rounded-md"
      } ${
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

  const iconEl = icon && (
    <Icon name={icon} size={20} className="shrink-0 text-[var(--color-ink)]" />
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
      {selector}
      {icon && iconPosition === "left" && iconEl}
      <div className="min-w-0 flex-1">
        <span className="font-bold">{label}</span>
        {description && <p className="mt-0.5 text-sm text-[var(--color-muted)]">{description}</p>}
      </div>
      {icon && iconPosition === "right" && iconEl}
    </button>
  );
}
