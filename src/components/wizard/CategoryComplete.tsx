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
        // One consolidated grey box — each row stays individually
        // hoverable/clickable to jump back and edit that answer.
        <dl className="mx-auto mt-8 max-w-md rounded-2xl bg-[var(--color-cream)] p-2 text-left">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onEditQuestion(i)}
              className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--color-cream-border)]"
            >
              <dt className="text-sm text-[var(--color-muted)]">{q.sidebarLabel}</dt>
              <dd className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-semibold">
                  {formatDisplayValue(category, q, answers, checklist) || "—"}
                </span>
                <Icon name="chevron-right" size={16} className="shrink-0 text-[var(--color-muted)]" />
              </dd>
            </button>
          ))}
        </dl>
      )}

      {/* Spacer so the sticky CTA below never covers the last row of content */}
      <div className="h-24" aria-hidden />

      {/* Sticky session CTA — stays in normal flow (centered in the right panel
          via mx-auto below), only pinned vertically to the viewport bottom. */}
      <div className="sticky bottom-6 z-20 mx-auto flex w-full max-w-md items-center justify-between gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-4 text-left shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
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
