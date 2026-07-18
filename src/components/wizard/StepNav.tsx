"use client";

import type { Category } from "@/lib/types";
import { Icon, type IconName } from "@/components/icons";
import { MATCH_STEP_LABEL, railLabel } from "@/lib/data";
import { isCategoryComplete } from "@/lib/wizard";

/**
 * done          — green circle + check (a completed section)
 * current       — the active section in the questionnaire (green highlight)
 * active-orange — the active/in-progress "Match with Accountant" step on the
 *                 recommendation page
 * future        — grey outline (not reached yet)
 */
type StepState = "done" | "current" | "active-orange" | "future";

/** Which section is currently active — a questionnaire category, or the final match step */
export type ActiveStep = { kind: "category"; index: number } | { kind: "match" };

type Step = {
  key: string;
  label: string;
  icon: IconName;
  state: StepState;
  /** Absent means the step can't be navigated to from here */
  onClick?: () => void;
};

/**
 * "My Progress" — the single left panel used across the whole flow, from the
 * first question through to the recommendation. Top-level sections only: one
 * circle per section on a vertical timeline. Individual questions live
 * exclusively in the right panel; this component only knows whether a whole
 * category is complete.
 *
 * Every row keeps identical geometry across states — same text size, no
 * captions, a fixed-height connector — so a step changing from upcoming to
 * active to completed never shifts the rows around it.
 */
export function StepNav({
  activeCategories,
  active,
  answers,
  matched = false,
  onIncomeSources,
  onSelectCategory,
  onMatch,
  nextSteps,
}: {
  activeCategories: Category[];
  active: ActiveStep;
  answers: Record<string, string>;
  /** Recommendation page only: whether the accountant match has been confirmed */
  matched?: boolean;
  onIncomeSources: () => void;
  onSelectCategory: (index: number) => void;
  onMatch: () => void;
  /** Recommendation page only: the "What happens next" list, moved here from the plan card */
  nextSteps?: { label: string; caption: string }[];
}) {
  const allComplete = activeCategories.every((c) => isCategoryComplete(c, answers));
  const onMatchStep = active.kind === "match";

  const matchState: StepState = onMatchStep ? (matched ? "done" : "active-orange") : "future";

  const steps: Step[] = [
    {
      key: "income-sources",
      label: "Income Sources",
      icon: "coins",
      // Reaching the panel at all means sources were picked
      state: "done",
      onClick: onIncomeSources,
    },
    ...activeCategories.map((category, i): Step => {
      const isActive = active.kind === "category" && active.index === i;
      const complete = isCategoryComplete(category, answers);
      const state: StepState = isActive ? "current" : complete ? "done" : "future";
      return {
        key: category.id,
        label: railLabel(category),
        icon: category.icon,
        state,
        onClick: isActive ? undefined : complete || onMatchStep ? () => onSelectCategory(i) : undefined,
      };
    }),
    {
      key: "match",
      label: MATCH_STEP_LABEL,
      icon: "user",
      state: matchState,
      // Reachable from the questionnaire once everything's answered
      onClick: onMatchStep ? undefined : allComplete ? onMatch : undefined,
    },
  ];

  return (
    <aside className="w-full shrink-0 self-start rounded-3xl bg-[var(--color-cream)] p-6 sm:w-72">
      <ol>
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          const highlighted = step.state === "current" || step.state === "active-orange";
          const clickable = !!step.onClick;
          return (
            <li key={step.key} className="flex gap-4">
              {/* Circle + fixed-height connector below it — geometry never varies by state */}
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    step.state === "done"
                      ? "border border-[var(--color-brand-dark)] bg-white text-[var(--color-brand-dark)]"
                      : step.state === "current" || step.state === "active-orange"
                        ? "bg-[var(--color-brand-dark)] text-white"
                        : "border border-[var(--color-line)] bg-white text-[var(--color-muted)]"
                  }`}
                >
                  <Icon name={step.state === "done" ? "check" : step.icon} size={16} />
                </span>
                {!last && (
                  <span
                    aria-hidden
                    className={`h-7 w-px ${
                      step.state === "done" ? "bg-[var(--color-brand-dark)]" : "bg-[var(--color-line)]"
                    }`}
                  />
                )}
              </div>

              {/* h-10 matches the circle, centering label and icon on one line */}
              <button
                type="button"
                disabled={!clickable}
                onClick={step.onClick}
                className={`flex h-10 flex-1 items-center justify-between gap-2 text-left ${
                  clickable ? "cursor-pointer group" : "cursor-default"
                }`}
              >
                <span
                  className={`min-w-0 truncate ${
                    highlighted
                      ? "font-extrabold"
                      : step.state === "done"
                        ? "font-semibold group-hover:text-[var(--color-brand-dark)]"
                        : "font-semibold text-[var(--color-muted)]"
                  }`}
                >
                  {step.label}
                </span>
                {(clickable || highlighted) && (
                  <Icon
                    name="chevron-right"
                    size={16}
                    className="shrink-0 text-[var(--color-muted)]"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {nextSteps && nextSteps.length > 0 && (
        <>
          {/* Dashed divider, full width within the panel */}
          <div className="my-6 border-t border-dashed border-[var(--color-line)]" aria-hidden />

          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Next steps
          </p>
          {/* Same geometry as the progress list above: h-10 circles joined by
              fixed-height grey connectors, so both sections share one rhythm. */}
          <ol className="mt-6">
            {nextSteps.map((step, i) => {
              const last = i === nextSteps.length - 1;
              return (
                <li key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-muted)]">
                      <Icon name="lock" size={16} />
                    </span>
                    {!last && <span aria-hidden className="h-7 w-px bg-[var(--color-line)]" />}
                  </div>
                  <div className="flex h-10 min-w-0 flex-col justify-center">
                    <p className="truncate text-sm font-semibold leading-tight">{step.label}</p>
                    <p className="truncate text-xs leading-tight text-[var(--color-muted)]">
                      {step.caption}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </aside>
  );
}
