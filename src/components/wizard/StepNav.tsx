"use client";

import type { Category } from "@/lib/types";
import { Icon, type IconName } from "@/components/icons";
import { MATCH_STEP_LABEL, railLabel } from "@/lib/data";
import { useChatPopup } from "@/lib/chatPopup";
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

export type NextStepDocument = {
  title: string;
  body: string;
};

export type NextStep = {
  label: string;
  /** Optional short caption under the title (e.g. role) — omit when not needed */
  caption?: string;
  /** Longer description for simplified steps (e.g. Approve filing) */
  description?: string;
  /** Document titles with info-popup copy */
  documents?: NextStepDocument[];
};

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
  hideMatchStep = false,
  forceCategoryDoneId,
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
  /** Hide the Find Expert row (e.g. while still on the allowances questionnaire) */
  hideMatchStep?: boolean;
  /** Force a category to render as done (e.g. during the plan-preparing loading state) */
  forceCategoryDoneId?: string;
  onIncomeSources: () => void;
  onSelectCategory: (index: number) => void;
  onMatch: () => void;
  /** Recommendation page only: the "What happens next" list, moved here from the plan card */
  nextSteps?: NextStep[];
}) {
  const openPopup = useChatPopup((s) => s.open);
  const allComplete = activeCategories.every((c) => isCategoryComplete(c, answers));
  const onMatchStep = active.kind === "match";

  const matchState: StepState = onMatchStep ? (matched ? "done" : "active-orange") : "future";

  const steps: Step[] = onMatchStep
    ? [
        {
          key: "match",
          label: MATCH_STEP_LABEL,
          icon: "user",
          state: matchState,
        },
      ]
    : [
        {
          key: "income-sources",
          label: "Income Sources",
          icon: "coins",
          state: "done",
          onClick: onIncomeSources,
        },
        ...activeCategories.map((category, i): Step => {
          const isActive = active.kind === "category" && active.index === i;
          const complete =
            category.id === forceCategoryDoneId || isCategoryComplete(category, answers);
          const state: StepState =
            forceCategoryDoneId === category.id
              ? "done"
              : isActive
                ? "current"
                : complete
                  ? "done"
                  : "future";
          return {
            key: category.id,
            label: railLabel(category),
            icon: category.icon,
            state,
            onClick: isActive ? undefined : complete ? () => onSelectCategory(i) : undefined,
          };
        }),
        ...(!hideMatchStep
          ? [
              {
                key: "match",
                label: MATCH_STEP_LABEL,
                icon: "user" as IconName,
                state: matchState,
                onClick: allComplete || forceCategoryDoneId ? onMatch : undefined,
              },
            ]
          : []),
      ];

  const showNextSteps = !!nextSteps?.length;
  // On the recommendation page, draw a continuous rail from Find Expert down to Step 1.
  const connectMatchToNextSteps = onMatchStep && showNextSteps;

  return (
    <aside className="w-full shrink-0 self-start rounded-3xl bg-[var(--color-cream)] p-6 sm:w-72">
      <ol>
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          const highlighted = step.state === "current" || step.state === "active-orange";
          const clickable = !!step.onClick;
          const showConnector = !last || (last && connectMatchToNextSteps && step.key === "match");
          return (
            <li key={step.key} className="flex gap-4">
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
                {showConnector && (
                  <span
                    aria-hidden
                    className={`w-px ${
                      last && connectMatchToNextSteps
                        ? "h-14 bg-[var(--color-line)]"
                        : step.state === "done"
                          ? "h-7 bg-[var(--color-brand-dark)]"
                          : "h-7 bg-[var(--color-line)]"
                    }`}
                  />
                )}
              </div>

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

      {showNextSteps && (
        <>
          {/* Rail continues in the icon column; divider/label align with the text column */}
          <div className="flex gap-4">
            <div className="flex w-10 shrink-0 flex-col items-center">
              {connectMatchToNextSteps ? null : (
                <span aria-hidden className="h-6 w-px bg-[var(--color-line)]" />
              )}
              {connectMatchToNextSteps && (
                <span aria-hidden className="min-h-6 w-px flex-1 bg-[var(--color-line)]" />
              )}
            </div>
            <div className="min-w-0 flex-1 py-4">
              <div className="border-t border-dashed border-[var(--color-line)]" aria-hidden />
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                Your next steps
              </p>
            </div>
          </div>

          <ol>
            {nextSteps!.map((step, i) => {
              const last = i === nextSteps!.length - 1;
              const hasDocs = !!step.documents?.length;
              const hasDescription = !!step.description;
              const tall = hasDocs || hasDescription;
              return (
                <li key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-muted)]">
                      <Icon name="lock" size={16} />
                    </span>
                    {!last && (
                      <span
                        aria-hidden
                        className={`w-px bg-[var(--color-line)] ${tall ? "min-h-7 flex-1" : "h-7"}`}
                      />
                    )}
                  </div>
                  <div className={`min-w-0 flex-1 ${tall ? "pb-5" : "flex h-10 flex-col justify-center"}`}>
                    <p className="text-sm font-semibold leading-tight">{step.label}</p>
                    {step.caption && (
                      <p className="text-xs leading-tight text-[var(--color-muted)]">{step.caption}</p>
                    )}
                    {step.description && (
                      <p className="mt-1.5 text-xs leading-snug text-[var(--color-muted)]">
                        {step.description}
                      </p>
                    )}
                    {hasDocs && (
                      <ul className="mt-2 space-y-2">
                        {step.documents!.map((doc) => (
                          <li key={doc.title} className="flex items-start gap-1.5">
                            <span className="text-xs font-semibold text-[var(--color-ink)]">
                              {doc.title}
                            </span>
                            <button
                              type="button"
                              aria-label={`About ${doc.title}`}
                              onClick={() =>
                                openPopup({
                                  title: doc.title,
                                  message: doc.body,
                                  image: {
                                    src: "/document-placeholder.svg",
                                    alt: `Example of ${doc.title}`,
                                  },
                                })
                              }
                              className="mt-0.5 shrink-0 text-[var(--color-muted)] transition hover:text-[var(--color-brand-dark)]"
                            >
                              <Icon name="help-circle" size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
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
