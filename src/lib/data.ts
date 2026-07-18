import type { Category, IncomeSource } from "./types";

export const TAX_YEAR = "2025";
export const TAX_YEAR_RANGE = "6 Apr 2025 – 5 Apr 2026";
/** Short form used where the full range doesn't fit, e.g. the flow rail caption */
export const TAX_YEAR_LABEL = "2025/26";

/** The plan the flow recommends — mirrors the "Tax Return Plus" card in the design */
export const recommendedPlan = {
  name: "Tax Return Plus",
  tagline: "Get expert support for complete peace of mind.",
  price: "£149",
  period: "/year",
  discount: "£50 OFF",
  renewal: "Renews at £199/year. Cancel anytime.",
  cta: "Match me with an accountant",
  socialProof: "1100+ users chose it this week",
  featuresHeading: "All the goodness of Essentials, plus:",
  features: [
    {
      title: "No more HMRC letter fear",
      body: "Expert support to understand and reply on HMRC requests",
    },
    {
      title: "Don't be alone if HMRC investigates you",
      body: "Accountant guidance & support should HMRC decide to investigate your return",
    },
  ],
};

/**
 * Keyed on HMRC's Making Tax Digital thresholds — £50,000 (applies from April
 * 2026) and £30,000 (applies from April 2027). The bands are uneven on purpose;
 * the boundaries are regulatory, not presentational. Judged on combined
 * self-employment + property income, never on a single stream — see mtdStatus.
 */
export const mtdMessages: Record<"under-30k" | "30k-to-50k" | "50k-plus", string> = {
  "under-30k": "You're not affected by Making Tax Digital under current or upcoming rules.",
  "30k-to-50k":
    "Making Tax Digital doesn't apply to you this year, but will from April 2027 when the threshold drops to £30,000.",
  "50k-plus":
    "Since your combined income is over £50,000, Making Tax Digital applies to you from April 2026. We'll confirm this as part of your plan.",
};

export interface EntryReason {
  id: string;
  title: string;
  icon: IncomeSource["icon"];
  /** When set, choosing this reason pre-selects the matching income source */
  incomeSourceId?: string;
}

/** The "What brings you here" onboarding grid — precedes income source selection */
export const entryReasons: EntryReason[] = [
  { id: "self-employment", title: "I earned money through self-employment", icon: "briefcase", incomeSourceId: "self-employment" },
  { id: "tax-relief", title: "I'm claiming a tax relief or refund", icon: "refresh" },
  { id: "property", title: "I earned income from property", icon: "home", incomeSourceId: "property" },
  { id: "dividends", title: "I earned dividends or interest", icon: "percent", incomeSourceId: "dividends" },
  { id: "capital-gains", title: "I earned capital gains", icon: "chart", incomeSourceId: "capital-gains" },
  { id: "director", title: "I'm a director of a company", icon: "building" },
  { id: "hmrc-contact", title: "HMRC contacted me about my tax", icon: "mail" },
  { id: "mtd", title: "I'm affected by Making Tax Digital", icon: "monitor" },
  { id: "other", title: "Something else applies to me", icon: "umbrella" },
];

/** Case-study scope: only these situation cards are selectable */
export const ENABLED_ENTRY_REASON_IDS = ["self-employment", "property", "hmrc-contact"] as const;

/** Case-study scope: only freelance & rental income paths are active */
export const ENABLED_INCOME_SOURCE_IDS = ["self-employment", "property"] as const;

export const incomeSources: IncomeSource[] = [
  {
    id: "employment",
    title: "Employment",
    description: "Salaried employee for a company",
    icon: "briefcase",
    confirm: {
      question: `Did you earn any salary through employment between ${TAX_YEAR_RANGE}?`,
      helper: "Even if you've already paid tax on it, it should still be added.",
    },
  },
  {
    id: "self-employment",
    title: "Self-employment",
    description: "Earnings as sole trader, e.g. freelancer, contractor or driver",
    icon: "laptop",
  },
  {
    id: "property",
    title: "Property",
    description: "Income from renting or leasing property",
    icon: "home",
  },
  {
    id: "dividends",
    title: "Dividends and interest",
    description: "Income from shares, savings or investments",
    icon: "chart",
  },
  {
    id: "capital-gains",
    title: "Sold assets and shares",
    description: "Income or loss from selling assets such as shares or property",
    icon: "coins",
  },
  {
    id: "foreign",
    title: "Foreign income",
    description: "Income from outside the UK",
    icon: "globe",
  },
];

/**
 * How each category is named in the "My Progress" rail and breadcrumb — kept
 * separate from the in-flow `title` so the rail reads as a consistent set
 * ("Self-employment", "Property income", "Allowances").
 */
export const CATEGORY_RAIL_LABELS: Record<string, string> = {
  "self-employment": "Self-employment",
  property: "Property income",
  general: "Allowances",
};

export function railLabel(category: Category): string {
  return CATEGORY_RAIL_LABELS[category.id] ?? category.title;
}

/** The label the final rail step + breadcrumb use for the recommendation page */
export const MATCH_STEP_LABEL = "Find Expert";

export const categories: Category[] = [
  {
    id: "self-employment",
    title: "Self-employed",
    icon: "briefcase",
    incomeSourceId: "self-employment",
    doneHeading: "Nice one!",
    doneSub: "That's everything for your self-employment income.",
    questions: [
      // The single source of truth for filer/UTR-registration status — see
      // the "registered-hmrc" question below and saRegistered in the store.
      {
        id: "first-time-filer",
        type: "yes-no",
        sidebarLabel: "First-time filer",
        prompt: "Is this your first time doing Self Assessment?",
      },
      // The deadline reminder for this question is no longer a static banner —
      // answering "No" and continuing triggers the chat-pill popup instead
      // (see the question page's handleConfirm).
      {
        id: "registered-hmrc",
        type: "yes-no",
        sidebarLabel: "Registered with HMRC",
        prompt: "Have you registered for self-employment online at HMRC?",
        infoButton: {
          title: "Registering for Self Assessment",
          body: "If you're newly self-employed, you need to register with HMRC to get a Unique Taxpayer Reference (UTR) before you can file a return. If you're not sure, choose \"No\" and we'll register you as part of your plan.",
        },
      },
      {
        id: "se-type",
        type: "choice",
        layout: "cards",
        sidebarLabel: "Type of self-employment",
        prompt: "What best describes your self-employment",
        helper: "Choose one that fits best",
        options: ["Freelancer / Contract worker", "Construction worker (CIS)", "Courier or driver", "Something else"],
        icons: ["briefcase", "wrench", "car", "help-circle"],
        ctaLabel: "Save",
        notSureLabel: "Not self-employed",
      },
      {
        id: "start-date",
        type: "date",
        sidebarLabel: "Started self-employment",
        prompt: "When did you start self-employment?",
        defaultValue: "2025-04-06",
      },
      {
        id: "work-type",
        type: "text",
        sidebarLabel: "Type of work",
        prompt: "Describe your type of work",
        placeholder: "e.g. Freelance product designer, artist selling paintings",
      },
      {
        id: "income-amount",
        type: "currency",
        sidebarLabel: "Self-employed income",
        prompt: "Self-employed income earned last tax year",
        helper: `From ${TAX_YEAR_RANGE}. An estimate is fine.`,
        notSure: true,
      },
      {
        id: "expenses-under-1000",
        type: "yes-no",
        sidebarLabel: "Expenses under £1,000",
        prompt: "Were your total work-related expenses under £1,000?",
        // Answering "Yes" opens an advisor chat popup on selection (not Continue)
        // — see ChoiceQuestionCard in QuestionCard.tsx.
      },
      {
        id: "expense-types",
        type: "checklist-add",
        sidebarLabel: "Business expenses",
        prompt: "Let's have a closer look at your business expenses.",
        helper: "Select all that apply to you.",
        skipIf: (answers) => answers["expenses-under-1000"] === "Yes",
        items: [
          {
            id: "business-expenses",
            label: "Had work-related business expenses (£2,000)",
            icon: "briefcase",
            subPrompt: "How much did you spend on business expenses?",
            subType: "currency",
            receiptsFollowUp: true,
          },
          {
            id: "home",
            label: "Worked from home whilst self-employed",
            icon: "home",
            subPrompt: "How many hours a week did you work from home?",
            subType: "number",
          },
          {
            id: "vehicle",
            label: "Used car or van for business",
            icon: "car",
            subPrompt: "How much did you spend running your vehicle?",
            subType: "currency",
          },
        ],
      },
    ],
  },
  {
    id: "property",
    title: "Property income",
    icon: "home",
    incomeSourceId: "property",
    doneHeading: "All sorted!",
    doneSub: "That's everything for your property income.",
    questions: [
      {
        id: "property-type",
        type: "pills-multi",
        layout: "rows",
        sidebarLabel: "Property income type",
        prompt: "What type of property income did you receive?",
        helper: "Select all that apply",
        options: ["Rented a flat or house", "Rented a room", "Furnished holiday let"],
        icons: ["home", "building", "umbrella"],
      },
      {
        id: "property-income",
        type: "currency",
        sidebarLabel: "Rental income",
        prompt: "How much rental income did you earn last tax year?",
        helper: `From ${TAX_YEAR_RANGE}. An estimate is fine.`,
        notSure: true,
      },
      {
        id: "mortgage",
        type: "yes-no-amount",
        sidebarLabel: "Mortgage on property",
        prompt: "Do you have a mortgage on the property you rented out?",
        amountPrompt: "How much mortgage interest did you pay?",
      },
      {
        id: "property-expenses",
        type: "currency",
        sidebarLabel: "Property expenses",
        prompt: "What was the total amount of expenses from property rental?",
        helper: "An estimate is fine.",
        notSure: true,
      },
    ],
  },
  // No incomeSourceId, so this always runs — and it must stay last, since its
  // completion screen is the one that hands off to the recommendation.
  {
    id: "general",
    title: "Allowances",
    icon: "plus-circle",
    doneHeading: "That's everything",
    doneSub: "We've got what we need to find your best plan.",
    questions: [
      // UTR/registration status is captured once, in the self-employment
      // questionnaire's "registered-hmrc" question (saRegistered in the
      // store) — no question here asks about it again.
      {
        id: "allowances",
        type: "pills-multi",
        layout: "rows",
        sidebarLabel: "Allowances",
        prompt: "And finally, to avoid overpaying your taxes, add all that applied to you",
        helper: `Between ${TAX_YEAR_RANGE}`,
        options: [
          "I made contributions into my pension",
          "I gave money to charities",
          "I participated in investment schemes (eg EIS, SEIS, VCT)",
          "My spouse earned less than £12,500",
          "I have a student loan or made student loan repayments",
        ],
      },
    ],
  },
];
