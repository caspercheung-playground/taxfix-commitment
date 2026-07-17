"use client";

/**
 * The "secondary pill" Yes/No control — light green fill, dark green text,
 * 8px radius, no border. Used on the welcome screen and the mortgage
 * question; every other yes/no in the wizard keeps the radio-in-pill style.
 */
export function SecondaryYesNo({
  value,
  onSelect,
}: {
  value: "Yes" | "No" | "";
  onSelect: (v: "Yes" | "No") => void;
}) {
  return (
    <div className="flex gap-3">
      {(["Yes", "No"] as const).map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`rounded-lg px-8 py-3.5 text-lg font-bold transition ${
              active
                ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)]"
                : "bg-[var(--color-brand-soft-2)] text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-soft)]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
