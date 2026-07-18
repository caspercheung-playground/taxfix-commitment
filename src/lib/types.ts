import type { IconName } from "@/components/icons";

export type QuestionType =
  | "text"
  | "currency"
  | "yes-no"
  | "yes-no-amount"
  | "choice"
  | "pills-multi"
  | "checklist-add"
  | "date";

export interface BaseQuestion {
  id: string;
  sidebarLabel: string;
  prompt: string;
  helper?: string;
  /** Grey context card shown above the active question card */
  contextNote?: string;
  /** "Tell me more" link below the prompt, opening a modal with this content */
  infoButton?: { title: string; body: string };
  /** Static amber urgency banner shown below the question (e.g. a registration deadline) */
  banner?: string;
  /**
   * Green "good news" banner shown once the given option is selected —
   * keyed by the raw option value (e.g. "Yes"). Single-choice types only.
   */
  answerBanner?: Record<string, string>;
  type: QuestionType;
  /** Return true to skip this question given the answers collected so far in this category */
  skipIf?: (answers: Record<string, string>) => boolean;
  /** Override label for the primary CTA (defaults to "Continue" / "Update") */
  ctaLabel?: string;
  /** Label for the secondary action button; when set the button appears */
  notSureLabel?: string;
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
  /** "rows" = row-list with icon on left; "cards" = icon-above-label card grid; defaults to pills */
  layout?: "pills" | "rows" | "cards";
  /** Parallel to options; used by "rows" and "cards" layouts */
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
  /**
   * After an amount is entered, ask "Do you have your invoices/expense
   * documents/receipts?" inline — answering "No" triggers the trading
   * allowance chat popup.
   */
  receiptsFollowUp?: boolean;
}

export interface ChecklistAddQuestion extends BaseQuestion {
  type: "checklist-add";
  items: ChecklistItemDef[];
}

/** Day / month / year dropdown triplet; stored as "YYYY-MM-DD" */
export interface DateQuestion extends BaseQuestion {
  type: "date";
  /** Pre-filled on first visit (not yet an actual answer), stored as "YYYY-MM-DD" */
  defaultValue?: string;
}

export type Question =
  | TextQuestion
  | CurrencyQuestion
  | YesNoQuestion
  | YesNoAmountQuestion
  | ChoiceQuestion
  | PillsMultiQuestion
  | ChecklistAddQuestion
  | DateQuestion;

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
