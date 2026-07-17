"use client";

import type { Category, Question } from "@/lib/types";
import type { ChecklistItemState } from "@/lib/store";
import { answerKey, formatDisplayValue } from "@/lib/wizard";
import { Icon } from "@/components/icons";

export function Sidebar({
  category,
  visibleQuestions,
  currentIndex,
  isComplete,
  answers,
  checklist,
  onEdit,
}: {
  category: Category;
  visibleQuestions: Question[];
  currentIndex: number;
  isComplete: boolean;
  answers: Record<string, string>;
  checklist: Record<string, ChecklistItemState>;
  onEdit: (index: number) => void;
}) {
  // Answered-ness comes from the store, not the cursor: jumping back to an
  // earlier row must not hide the later rows you've already answered.
  const isAnswered = (q: Question) => answers[answerKey(category.id, q.id)] !== undefined;
  const lastAnswered = visibleQuestions.reduce((acc, q, i) => (isAnswered(q) ? i : acc), -1);
  const rows = isComplete
    ? visibleQuestions.length
    : Math.min(Math.max(lastAnswered + 1, currentIndex + 1), visibleQuestions.length);

  return (
    <aside className="w-full shrink-0 rounded-3xl bg-[var(--color-cream)] p-6 sm:w-72">
      <div className="flex items-center gap-3 border-b border-[var(--color-cream-border)] pb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-brand-dark)]">
          <Icon name={category.icon} size={18} />
        </span>
        <h2 className="text-lg font-extrabold">{category.title}</h2>
      </div>

      <ul className="mt-2">
        {visibleQuestions.slice(0, rows).map((q, i) => {
          const answered = isComplete || (isAnswered(q) && i !== currentIndex);
          const value = formatDisplayValue(category, q, answers, checklist);
          return (
            <li key={q.id} className="border-b border-[var(--color-cream-border)] last:border-0">
              <button
                type="button"
                disabled={!answered}
                onClick={() => onEdit(i)}
                className={`flex w-full items-center gap-2 py-3.5 text-left ${
                  answered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {!answered && <Icon name="arrow-right" size={16} className="shrink-0 text-[var(--color-ink)]" />}
                <span className={`flex-1 text-sm ${answered ? "text-[var(--color-ink)]" : "font-semibold"}`}>
                  {q.sidebarLabel}
                </span>
                {answered && (
                  <>
                    <span className="truncate text-sm text-[var(--color-muted)]">{value}</span>
                    <Icon name="chevron-right" size={16} className="shrink-0 text-[var(--color-muted)]" />
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
