import type { Category, ChecklistItemDef, Question } from "./types";
import type { ChecklistItemState } from "./store";

export function answerKey(categoryId: string, questionId: string) {
  return `${categoryId}.${questionId}`;
}

export function checklistItemKey(categoryId: string, questionId: string, itemId: string) {
  return `${categoryId}.${questionId}.${itemId}`;
}

export function getCategoryAnswers(
  category: Category,
  answers: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  category.questions.forEach((q) => {
    const key = answerKey(category.id, q.id);
    if (answers[key] !== undefined) result[q.id] = answers[key];
  });
  return result;
}

export function getVisibleQuestions(category: Category, answers: Record<string, string>): Question[] {
  const scoped = getCategoryAnswers(category, answers);
  return category.questions.filter((q) => !q.skipIf || !q.skipIf(scoped));
}

function checklistItemsFor(
  category: Category,
  question: Extract<Question, { type: "checklist-add" }>,
  checklist: Record<string, ChecklistItemState>
): { item: ChecklistItemDef; state: ChecklistItemState | undefined }[] {
  return question.items.map((item) => ({
    item,
    state: checklist[checklistItemKey(category.id, question.id, item.id)],
  }));
}

export function formatDisplayValue(
  category: Category,
  question: Question,
  answers: Record<string, string>,
  checklist: Record<string, ChecklistItemState>
): string {
  const raw = answers[answerKey(category.id, question.id)];

  if (question.type === "checklist-add") {
    const rows = checklistItemsFor(category, question, checklist).filter((r) => r.state?.added);
    if (rows.length === 0) return "None";
    return `${rows.length} selected`;
  }

  if (!raw) return "";

  if (question.type === "currency") {
    return raw === "Not sure" ? "Not sure" : `£${raw}`;
  }

  return raw;
}

// Deterministic pseudo-UUID generator, purely cosmetic — mirrors the
// sectionId / taskId query params seen on the real product's URLs.
export function pseudoUuid(seed: string): string {
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = (h1 ^ (h1 >>> 16)) >>> 0;
  h2 = (h2 ^ (h2 >>> 16)) >>> 0;
  const hex = (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0")).padEnd(32, "0");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
