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
}: {
  category: Category;
  answers: Record<string, string>;
  checklist: Record<string, ChecklistItemState>;
  heading: string;
  sub: string;
  nextCategory: Category | null;
  onContinue: () => void;
}) {
  const questions = getVisibleQuestions(category, answers);

  return (
    <div className="rounded-3xl bg-[var(--color-cream)] p-8 text-center sm:p-12">
      <CheckIllustration />
      <h3 className="mt-4 text-2xl font-extrabold">{heading}</h3>
      <p className="mt-2 text-[var(--color-muted)]">{sub}</p>

      {questions.length > 0 && (
        <dl className="mx-auto mt-8 max-w-md divide-y divide-[var(--color-cream-border)] rounded-2xl bg-white p-2 text-left shadow-sm">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center justify-between gap-4 px-3 py-2.5">
              <dt className="text-sm text-[var(--color-muted)]">{q.sidebarLabel}</dt>
              <dd className="truncate text-sm font-semibold">
                {formatDisplayValue(category, q, answers, checklist) || "—"}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mx-auto mt-4 flex max-w-md items-center justify-between gap-4 rounded-2xl bg-white p-4 text-left shadow-sm">
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
          {nextCategory && <Icon name="arrow-right" size={16} />}
        </button>
      </div>
    </div>
  );
}
