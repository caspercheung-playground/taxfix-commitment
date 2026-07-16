import type { IconName } from "@/components/icons";

export type QuestionType = "text" | "currency" | "yes-no" | "pills-multi" | "checklist-add";

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

export interface PillsMultiQuestion extends BaseQuestion {
  type: "pills-multi";
  options: string[];
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
  | PillsMultiQuestion
  | ChecklistAddQuestion;

export interface Category {
  id: string;
  title: string;
  icon: IconName;
  /** Which income source id (see incomeSources) unlocks this category */
  incomeSourceId: string;
  questions: Question[];
  doneHeading: string;
  doneSub: string;
}

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
