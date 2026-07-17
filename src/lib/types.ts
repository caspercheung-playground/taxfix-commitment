import type { IconName } from "@/components/icons";

export type QuestionType =
  | "text"
  | "currency"
  | "yes-no"
  | "yes-no-amount"
  | "choice"
  | "pills-multi"
  | "checklist-add";

export interface BaseQuestion {
  id: string;
  sidebarLabel: string;
  prompt: string;
  helper?: string;
  /** Grey context card shown above the active question card */
  contextNote?: string;
  type: QuestionType;
  /** Return true to skip this question given the answers collected so far in this category */
  skipIf?: (answers: Record<string, string>) => boolean;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  placeholder: string;
}

export interface CurrencyQuestion extends BaseQuestion {
  type: "currency";
  notSure?: boolean;
}

export interface YesNoQuestion extends BaseQuestion {
  type: "yes-no";
}

/** Yes/No, and — only when "Yes" — an inline amount capture on the same screen */
export interface YesNoAmountQuestion extends BaseQuestion {
  type: "yes-no-amount";
  /** Label shown above the amount field once "Yes" is selected */
  amountPrompt: string;
}

/** Single-select from a fixed option set — "yes-no" is this with ["Yes", "No"] */
export interface ChoiceQuestion extends BaseQuestion {
  type: "choice";
  options: string[];
  /** "rows" renders a row-list (selector + icon on the left); defaults to pills */
  layout?: "pills" | "rows";
  /** Parallel to options; only read when layout === "rows" */
  icons?: IconName[];
}

export interface PillsMultiQuestion extends BaseQuestion {
  type: "pills-multi";
  options: string[];
  /** "rows" swaps the pills for full-width selectable rows; defaults to pills */
  layout?: "pills" | "rows";
  /** Parallel to options; only read when layout === "rows" */
  icons?: IconName[];
}

export interface ChecklistItemDef {
  id: string;
  label: string;
  subPrompt: string;
  subType: "currency" | "number";
}

export interface ChecklistAddQuestion extends BaseQuestion {
  type: "checklist-add";
  items: ChecklistItemDef[];
}

export type Question =
  | TextQuestion
  | CurrencyQuestion
  | YesNoQuestion
  | YesNoAmountQuestion
  | ChoiceQuestion
  | PillsMultiQuestion
  | ChecklistAddQuestion;

export interface Category {
  id: string;
  title: string;
  icon: IconName;
  /** Which income source id (see incomeSources) unlocks this category; always active when omitted */
  incomeSourceId?: string;
  questions: Question[];
  doneHeading: string;
  doneSub: string;
}

/** Yes/No answers captured on the welcome screen */
export type WelcomeAnswer = "Yes" | "No";

export interface ReasonCard {
  id: string;
  label: string;
  icon: IconName;
}

export interface IncomeSource {
  id: string;
  title: string;
  tag?: string;
  description: string;
  icon: IconName;
  confirm?: {
    question: string;
    helper: string;
  };
}
