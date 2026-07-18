"use client";

import { Icon } from "@/components/icons";
import type { Category } from "@/lib/types";
import type { ChecklistItemState } from "@/lib/store";
import { formatDisplayValue, getVisibleQuestions } from "@/lib/wizard";

function CheckIllustration() {
  return <img src="/check-3d.webp" alt="" aria-hidden className="mx-auto h-36 w-auto" />;
}

export function CategoryComplete({
  category,
  answers,
  checklist,
  heading,
  sub,
  nextCategory,
  onContinue,
  onEditQuestion,
}: {
  category: Category;
  answers: Record<string, string>;
  checklist: Record<string, ChecklistItemState>;
  heading: string;
  sub: string;
  nextCategory: Category | null;
  onContinue: () => void;
  /** Jump back to the given visible-question index, pre-filled, for editing */
  onEditQuestion: (index: number) => void;
}) {
  const questions = getVisibleQuestions(category, answers);

  return (
    <div className="rounded-3xl p-8 text-center sm:p-12">
      <CheckIllustration />
      <h3 className="mt-4 text-2xl font-extrabold">{heading}</h3>
      <p className="mt-2 text-[var(--color-muted)]">{sub}</p>

      {questions.length > 0 && (
        // Grey sits on each row, not the panel — the fill marks the rows as
        // clickable (tap one to go back and edit that answer).
        <div className="mx-auto mt-8 max-w-md space-y-2 text-left">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onEditQuestion(i)}
              className="flex w-full items-center justify-between gap-4 rounded-xl bg-[var(--color-cream)] px-4 py-3 text-left transition hover:bg-[var(--color-cream-border)]"
            >
              <span className="text-sm text-[var(--color-muted)]">{q.sidebarLabel}</span>
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-semibold">
                  {formatDisplayValue(category, q, answers, checklist) || "—"}
                </span>
                <Icon name="chevron-right" size={16} className="shrink-0 text-[var(--color-muted)]" />
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto mt-4 flex max-w-md items-center justify-between gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-4 text-left shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
            <Icon name={nextCategory ? nextCategory.icon : "sparkles"} size={20} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {nextCategory ? "Next" : "All done"}
            </p>
            <p className="font-bold">{nextCategory ? nextCategory.title : "Best Service for me"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
        >
          {nextCategory ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
}
