import type { Category, ChecklistItemDef, Question, UtrAnswer } from "./types";
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

  // Ahead of the !raw guard: "none selected" is a real answer stored as "",
  // and must read as "None" rather than looking unanswered.
  if (question.type === "pills-multi" && question.layout === "rows") {
    if (raw === undefined) return "";
    const count = raw.split(", ").filter(Boolean).length;
    return count === 0 ? "None" : `${count} selected`;
  }

  if (!raw) return "";

  if (question.type === "currency") {
    return raw === "Not sure" ? "Not sure" : `£${raw}`;
  }

  return raw;
}

export const UTR_KEY = answerKey("general", "utr");
export const ALLOWANCES_KEY = answerKey("general", "allowances");

export function getUtr(answers: Record<string, string>): UtrAnswer | null {
  const raw = answers[UTR_KEY];
  return raw === "Yes" || raw === "No" || raw === "Not sure" ? raw : null;
}

export type MtdStatus = "unknown" | "under-30k" | "30k-to-50k" | "50k-plus";

/** The income figures that feed the MTD threshold, and the stream that puts each in play */
const MTD_INCOME_QUESTIONS = [
  { incomeSourceId: "self-employment", key: answerKey("self-employment", "income-amount") },
  { incomeSourceId: "property", key: answerKey("property", "property-income") },
];

/**
 * MTD keys off *combined* self-employment + property income, never a single
 * stream. Only the streams the user actually picked count — someone who never
 * selected property must not be held back by its missing figure. "Not sure"
 * means the figure isn't known, so it yields "unknown" rather than counting
 * as zero: reporting "you're not affected" off a number we don't have would
 * be a false statement, not a safe default.
 */
export function mtdStatus(answers: Record<string, string>, incomeSources: string[]): MtdStatus {
  const inPlay = MTD_INCOME_QUESTIONS.filter((q) => incomeSources.includes(q.incomeSourceId));
  if (inPlay.length === 0) return "unknown";

  let total = 0;
  for (const q of inPlay) {
    const raw = answers[q.key];
    if (!raw || raw === "Not sure") return "unknown";
    const amount = Number(raw);
    if (!Number.isFinite(amount)) return "unknown";
    total += amount;
  }

  if (total < 30000) return "under-30k";
  if (total < 50000) return "30k-to-50k";
  return "50k-plus";
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
