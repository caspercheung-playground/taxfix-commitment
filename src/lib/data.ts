import type { Category, IncomeBracket, IncomeSource, ReasonCard } from "./types";

export const TAX_YEAR = "2025";
export const TAX_YEAR_RANGE = "6 Apr 2025 – 5 Apr 2026";

/** Placeholder until real plan data exists */
export const recommendedPlan = {
  price: "£149",
  name: "Filed, Optimised & Protected",
};

/**
 * Income brackets are split on HMRC's Making Tax Digital thresholds — £50,000
 * (applies from April 2026) and £30,000 (applies from April 2027). The spacing
 * is uneven on purpose; the boundaries are regulatory, not presentational.
 */
export const incomeBrackets: IncomeBracket[] = [
  {
    id: "under-30k",
    label: "Under £30,000",
    message: "You're not affected by Making Tax Digital under current or upcoming rules.",
  },
  {
    id: "30k-to-50k",
    label: "£30,000 – £49,999",
    message:
      "Making Tax Digital doesn't apply to you this year, but will from April 2027 when the threshold drops to £30,000.",
  },
  {
    id: "50k-plus",
    label: "£50,000 or more",
    message:
      "Since your income is over £50,000, Making Tax Digital applies to you from April 2026. We'll confirm this as part of your plan.",
  },
];

export const reasonCards: ReasonCard[] = [
  { id: "self-employed", label: "I earned money through self-employment", icon: "briefcase" },
  { id: "relief", label: "I'm claiming a tax relief or refund", icon: "refresh" },
  { id: "property", label: "I earned income from property", icon: "home" },
  { id: "dividends", label: "I earned dividends or interest", icon: "percent" },
  { id: "capital-gains", label: "I earned capital gains", icon: "chart" },
  { id: "director", label: "I'm a director of a company", icon: "building" },
  { id: "hmrc-letter", label: "HMRC contacted me about my tax", icon: "mail" },
  { id: "mtd", label: "I'm affected by Making Tax Digital", icon: "monitor" },
  { id: "other", label: "Something else applies to me", icon: "umbrella" },
];

/** Maps a reason card id to the income source it should pre-select */
export const reasonToIncomeSource: Record<string, string> = {
  "self-employed": "self-employment",
  property: "property",
  "capital-gains": "capital-gains",
};

export const incomeSources: IncomeSource[] = [
  {
    id: "employment",
    title: "Employment",
    description: "Salaried employee for a company (pick even if tax has already been deducted)",
    icon: "briefcase",
    confirm: {
      question: `Did you earn any salary through employment between ${TAX_YEAR_RANGE}?`,
      helper: "Even if you've already paid tax on it, it should still be added.",
    },
  },
  {
    id: "self-employment",
    title: "Self-employment",
    tag: "Freelance or contract work",
    description: "Earnings as sole trader, e.g. freelancer, contractor or driver",
    icon: "briefcase",
  },
  {
    id: "property",
    title: "Property rental income",
    description: "Income from renting or leasing property",
    icon: "home",
  },
  {
    id: "capital-gains",
    title: "Capital gains/losses",
    description: "Income or loss from selling assets such as shares or property",
    icon: "chart",
  },
  {
    id: "pensions",
    title: "Pensions and benefits",
    description: "Received a private or state pension, or other income benefits",
    icon: "umbrella",
  },
  {
    id: "other",
    title: "Other income",
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
        type: "text",
        sidebarLabel: "Description of activity",
        prompt: "Your self-employment: what kind of work do you do?",
        placeholder: "e.g. graphic designer, driver, consultant",
      },
      {
        id: "income-amount",
        type: "income-bracket",
        sidebarLabel: "Self-employed income",
        prompt: "How much self-employed income did you earn last tax year?",
        helper: `From ${TAX_YEAR_RANGE}. An estimate is fine.`,
      },
      {
        id: "expenses-under-1000",
        type: "yes-no",
        sidebarLabel: "Expenses under £1,000",
        prompt: "Were your total work-related expenses under £1,000?",
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
        type: "income-bracket",
        sidebarLabel: "Rental income",
        prompt: "How much rental income did you earn last tax year?",
        helper: `From ${TAX_YEAR_RANGE}. An estimate is fine.`,
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
];
