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
    title: "Rental income",
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
  {
    id: "other",
    title: "Other sources",
    description: "Any other income not covered above",
    icon: "plus-circle",
  },
];

export const categories: Category[] = [
  {
    id: "self-employment",
    title: "Self-employed",
    icon: "briefcase",
    incomeSourceId: "self-employment",
    doneHeading: "Nice one!",
    doneSub: "That's everything for your self-employment income.",
    questions: [
      {
        id: "activity",
        type: "choice",
        layout: "cards",
        sidebarLabel: "Type of work",
        prompt: "What best describes your self-employment?",
        helper: "Choose one that fits best",
        options: [
          "Freelancer / Contract worker",
          "Construction worker (CIS)",
          "Courier or driver (Uber, Deliveroo, etc.)",
          "Something else",
        ],
        icons: ["laptop", "wrench", "package", "umbrella"],
      },
      {
        id: "income-amount",
        type: "currency",
        sidebarLabel: "Self-employed income",
        prompt: "How much self-employment income did you earn last year?",
        helper: `From ${TAX_YEAR_RANGE}. An estimate is fine.`,
        notSure: true,
      },
      {
        id: "expenses-under-1000",
        type: "yes-no",
        sidebarLabel: "Expenses under £1,000",
        prompt: "Were your work-related expenses under £1,000?",
        contextNote:
          "Next, we'll ask about some general expenses related to your self-employment. Later you'll be able to enter exact details.",
      },
      {
        id: "expense-types",
        type: "checklist-add",
        sidebarLabel: "Business expenses",
        prompt: "Let's take a closer look at your business expenses",
        helper: "Select all that apply, then continue.",
        skipIf: (answers) => answers["expenses-under-1000"] === "Yes",
        items: [
          {
            id: "travel",
            label: "Business trips, travel to clients or workplace",
            subPrompt: "How much did you spend on business travel?",
            subType: "currency",
          },
          {
            id: "home",
            label: "Worked from home",
            subPrompt: "How many hours a week did you work from home?",
            subType: "number",
          },
          {
            id: "vehicle",
            label: "Used a car or van for business",
            subPrompt: "How much did you spend running your vehicle?",
            subType: "currency",
          },
          {
            id: "training",
            label: "Further education and training",
            subPrompt: "How much did you spend on training?",
            subType: "currency",
          },
        ],
      },
    ],
  },
  {
    id: "property",
    title: "Property earnings",
    icon: "home",
    incomeSourceId: "property",
    doneHeading: "All sorted!",
    doneSub: "That's everything for your property income.",
    questions: [
      {
        id: "property-type",
        type: "pills-multi",
        sidebarLabel: "Property income type",
        prompt: "What type of property income did you receive?",
        helper: "Select all that apply",
        options: ["Rented a flat or house", "Rented a room", "Furnished holiday let"],
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
        type: "yes-no",
        sidebarLabel: "Mortgage on property",
        prompt: "Do you have a mortgage on the property you rented out?",
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
    title: "General",
    icon: "plus-circle",
    doneHeading: "That's everything",
    doneSub: "We've got what we need to find your best plan.",
    questions: [
      // UTR/registration status is captured once on the welcome screen
      // (saRegistered in the store) — no question here asks about it.
      {
        id: "allowances",
        type: "pills-multi",
        layout: "rows",
        sidebarLabel: "General & allowances",
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
