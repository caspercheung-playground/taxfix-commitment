"use client";

/**
 * Yes/No button pair, 8px radius, no inline selector — grey fill at rest,
 * white with a green border and soft shadow when selected. Matches the
 * primary yes/no buttons used across the wizard.
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
            className={`rounded-lg border px-7 py-3 font-bold transition ${
              active
                ? "border-[var(--color-brand-dark)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
