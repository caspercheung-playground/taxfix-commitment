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
  /** Longer description for simplified steps (e.g. Review & Approve) */
  description?: string;
  /** Document titles with info-popup copy */
  documents?: NextStepDocument[];
  /** Circle icon for this next-step row; defaults to lock */
  icon?: IconName;
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
  interactionLocked = false,
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
  /** Hide the Confirm Accountant row (e.g. while still on the allowances questionnaire) */
  hideMatchStep?: boolean;
  /** Force a category to render as done (e.g. during the plan-preparing loading state) */
  forceCategoryDoneId?: string;
  /** Disable all left-panel navigation (e.g. during preparing-plan transition) */
  interactionLocked?: boolean;
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
          onClick: interactionLocked ? undefined : onIncomeSources,
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
            onClick:
              interactionLocked || isActive
                ? undefined
                : complete
                  ? () => onSelectCategory(i)
                  : undefined,
          };
        }),
        ...(!hideMatchStep
          ? [
              {
                key: "match",
                label: MATCH_STEP_LABEL,
                icon: "user" as IconName,
                state: matchState,
                onClick:
                  interactionLocked || !(allComplete || forceCategoryDoneId)
                    ? undefined
                    : onMatch,
              },
            ]
          : []),
      ];

  const showNextSteps = !!nextSteps?.length;

  return (
    <aside className="w-full shrink-0 self-start rounded-3xl bg-[var(--color-cream)] p-6 sm:w-72">
      {showNextSteps && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Your next steps
        </p>
      )}

      <ol>
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          const next = steps[i + 1];
          const highlighted = step.state === "current" || step.state === "active-orange";
          const clickable = !!step.onClick;
          const showConnector = !last || (last && showNextSteps && onMatchStep);
          const brandConnector =
            step.state === "done" ||
            step.state === "current" ||
            next?.state === "done" ||
            next?.state === "current";
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
                    className={`w-px h-7 ${
                      last && showNextSteps && onMatchStep
                        ? "bg-[var(--color-line)]"
                        : brandConnector
                          ? "bg-[var(--color-brand-dark)]"
                          : "bg-[var(--color-line)]"
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
                    <Icon name={step.icon ?? "lock"} size={16} />
                  </span>
                  {!last && (
                    <span
                      aria-hidden
                      className={`w-px bg-[var(--color-line)] ${tall ? "min-h-7 flex-1" : "h-7"}`}
                    />
                  )}
                </div>
                <div className={`min-w-0 flex-1 ${tall ? "pb-5" : ""}`}>
                  <div className="flex h-10 items-center">
                    <p className="leading-tight">{step.label}</p>
                  </div>
                  {step.caption && (
                    <p className="-mt-1 text-xs leading-tight text-[var(--color-muted)]">
                      {step.caption}
                    </p>
                  )}
                  {step.description && (
                    <p className="text-xs leading-snug text-[var(--color-muted)]">{step.description}</p>
                  )}
                  {hasDocs && (
                    <ul className="mt-1 space-y-2">
                      {step.documents!.map((doc) => (
                        <li key={doc.title} className="flex items-center gap-1.5">
                          <span className="text-xs text-[var(--color-muted)]">{doc.title}</span>
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
                            className="shrink-0 transition opacity-90 hover:opacity-100"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/info-solid.svg" alt="" aria-hidden className="h-3.5 w-3.5" />
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
      )}
    </aside>
  );
}
