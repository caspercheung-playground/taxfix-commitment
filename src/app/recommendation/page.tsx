"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Icon } from "@/components/icons";
import { LiveChatPill } from "@/components/LiveChatPill";
import { TrustpilotBadge } from "@/components/TrustpilotBadge";
import { Breadcrumb } from "@/components/wizard/Breadcrumb";
import { StepNav, type NextStep } from "@/components/wizard/StepNav";
import {
  categories,
  comparePlans,
  matchedAccountant,
  prepareDocuments,
  type ComparePlan,
} from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { answerKey, getVisibleQuestions, isCategoryComplete } from "@/lib/wizard";

type AccountantStep = { title: string; body: string };

const PROPERTY_SA105: Record<string, AccountantStep> = {
  "Rented a room": {
    title: "Rent-a-Room Property Records (SA105)",
    body: "We'll report your lodger income on the UK property pages and apply Rent-a-Room relief where it benefits you.",
  },
  "Rented a flat or house": {
    title: "UK Property Rental Records (SA105)",
    body: "We'll complete your UK property pages with rental income, allowable expenses, and mortgage interest relief where relevant.",
  },
  "Furnished holiday let": {
    title: "Furnished Holiday Let Records (SA105)",
    body: "We'll include your holiday-let income on the UK property pages and treat it under the current property income rules.",
  },
};

function buildAccountantSteps({
  incomeSources,
  entryReasons,
  answers,
  saRegistered,
}: {
  incomeSources: string[];
  entryReasons: string[];
  answers: Record<string, string>;
  saRegistered: string | null;
}): AccountantStep[] {
  const steps: AccountantStep[] = [];

  steps.push({
    title: "Provide Consultation",
    body: "Book a call if you want a walkthrough of your return before filing — useful for first-time filers or more complex years.",
  });

  if (saRegistered === "No") {
    steps.push({
      title: "Register for Self-Assessment",
      body: "No worries! Your matched accountant will contact HMRC directly to backdate your registration and mitigate any late fees.",
    });
  }

  steps.push({
    title: "Review Documents",
    body: "Your accountant will check the records you upload and request anything missing before preparing your return.",
  });

  if (entryReasons.includes("hmrc-contact")) {
    steps.push({
      title: "Provide HMRC Letter Support and Audit",
      body: "Your accountant will review HMRC correspondence and help you reply accurately if anything is outstanding.",
    });
  }

  steps.push({
    title: "Handle Main Self Assessment Tax Return (SA100)",
    body: "We'll prepare your main Self Assessment return so your income, allowances, and tax position are reported correctly to HMRC.",
  });

  if (incomeSources.includes("self-employment")) {
    steps.push({
      title: "Handle Freelance / Self-Employment Records (SA103)",
      body: "We'll complete your self-employment pages using your trading income, expenses, and any allowances that apply.",
    });
  }

  if (incomeSources.includes("property")) {
    const raw = answers[answerKey("property", "property-type")] ?? "";
    const types = raw.split(", ").filter(Boolean);
    const matchedTypes = types.filter((t) => PROPERTY_SA105[t]);
    if (matchedTypes.length === 0) {
      steps.push({
        title: "Property Income Records (SA105)",
        body: "We'll complete your UK property pages so rental income and allowable expenses are reported correctly to HMRC.",
      });
    } else {
      for (const type of matchedTypes) {
        steps.push(PROPERTY_SA105[type]);
      }
    }
  }

  steps.push({
    title: "Wait for approval",
    body: "Your accountant prepares your return based on the documents you shared; you review and approve; they file directly with HMRC.",
  });

  steps.push({
    title: "File with HMRC",
    body: "Once you approve, your accountant submits the return to HMRC on your behalf.",
  });

  return steps;
}

function DeadlineBanner({
  image,
  title,
  detail,
  emphasize,
}: {
  image: string;
  title: string;
  detail: string;
  /** Bold prefix within the title, e.g. "30 days" */
  emphasize?: string;
}) {
  // Match StepNav next-step geometry: title like "Prepare documents",
  // detail like document items ("Government Gateway details").
  return (
    <section className="w-full rounded-2xl bg-[var(--color-cream)] p-6 sm:w-72">
      <div className="flex gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" aria-hidden className="h-10 w-10 object-contain" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-h-10 items-center">
            <p className="leading-tight">
              {emphasize && <span className="font-bold">{emphasize} </span>}
              {title}
            </p>
          </div>
          <p className="mt-1 text-xs leading-snug text-[var(--color-muted)]">{detail}</p>
        </div>
      </div>
    </section>
  );
}

function visiblePrepareDocuments({
  incomeSources,
  entryReasons,
  firstTimeFiler,
  saRegistered,
}: {
  incomeSources: string[];
  entryReasons: string[];
  firstTimeFiler: string | null;
  saRegistered: string | null;
}) {
  return prepareDocuments.filter((doc) => {
    switch (doc.id) {
      case "hmrc-letter":
        return entryReasons.includes("hmrc-contact");
      case "government-gateway":
        return firstTimeFiler === "Yes" || saRegistered === "No";
      case "gross-income":
      case "business-expenses":
        return incomeSources.includes("self-employment");
      case "gross-rental":
        return incomeSources.includes("property");
      default:
        return true;
    }
  });
}

function PlanChooser({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (plan: ComparePlan) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Choose your plan</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {comparePlans.map((plan) => {
          const selected = plan.id === selectedId;
          const badge = selected ? "Current plan" : plan.badge;
          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-5 ${
                selected
                  ? "border-[var(--color-brand)] bg-[rgba(169,212,129,0.18)]"
                  : "border-[var(--color-line)] bg-white"
              }`}
            >
              {badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-brand)] px-3 py-1 text-xs font-bold text-[var(--color-brand-dark)]">
                  {badge}
                </span>
              )}
              <h2 className="text-xl font-extrabold tracking-tight">{plan.name}</h2>
              {plan.tagline && (
                <p className="mt-2 text-sm text-[var(--color-muted)]">{plan.tagline}</p>
              )}
              {plan.discount && (
                <p className="mt-5">
                  <span className="inline-flex items-center rounded-full bg-[var(--color-brand-soft-2)] px-2.5 py-0.5 text-sm font-bold text-[var(--color-brand-dark)]">
                    {plan.discount}
                  </span>
                </p>
              )}
              <p className={plan.discount ? "mt-2" : "mt-3"}>
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-lg text-[var(--color-muted)]">{plan.period}</span>
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{plan.renewal}</p>
              {plan.intro && (
                <p className="mt-4 text-sm font-semibold text-[var(--color-ink)]">{plan.intro}</p>
              )}
              <ul className="mt-4 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-ink)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[var(--color-brand-dark)]">
                      <Icon name="check" size={14} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={selected}
                onClick={() => onSelect(plan)}
                className={`mt-6 w-full rounded-lg px-4 py-2.5 font-bold transition ${
                  selected
                    ? "cursor-default text-[var(--color-muted)]"
                    : "bg-white text-[var(--color-brand-dark)] hover:bg-[rgba(169,212,129,0.4)]"
                }`}
              >
                {selected ? "Selected" : "Select"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function AccountantPlanCard({
  plan,
  steps,
  agreed,
  onAgreeChange,
  onConfirm,
  onChangePlan,
}: {
  plan: ComparePlan;
  steps: AccountantStep[];
  agreed: boolean;
  onAgreeChange: (value: boolean) => void;
  onConfirm: () => void;
  onChangePlan: () => void;
}) {
  const accountant = matchedAccountant;

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
      <div className="flex items-stretch gap-6 p-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-extrabold tracking-tight">
            {accountant.name} will be your accountant
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
            {accountant.description}
          </p>
          <div className="mt-3">
            <TrustpilotBadge />
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={accountant.photo}
          alt=""
          className="h-36 w-36 shrink-0 rounded-lg object-cover"
        />
      </div>

      <div className="border-t border-[var(--color-line)] px-8 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">{plan.name}</h3>
            <button
              type="button"
              onClick={onChangePlan}
              className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-brand-dark)]"
            >
              See plans
              <Icon name="chevron-right" size={16} className="text-[var(--color-brand-dark)]" />
            </button>
          </div>
          <div className="text-right">
            <p className="flex flex-wrap items-center justify-end gap-2">
              {plan.discount && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-brand-soft-2)] px-2.5 py-0.5 text-sm font-bold text-[var(--color-brand-dark)]">
                  {plan.discount}
                </span>
              )}
              <span>
                <span className="text-xl font-extrabold">{plan.price}</span>
                <span className="ml-1 text-base text-[var(--color-muted)]">{plan.period}</span>
              </span>
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{plan.renewal}</p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Your accountant will:
          </p>
          <ol className="mt-3">
            {steps.map((step, index) => (
              <li key={`${step.title}-${index}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/plan-lock.svg" alt="" aria-hidden className="h-4 w-4" />
                  </span>
                  {index < steps.length - 1 && (
                    <span aria-hidden className="min-h-7 w-px flex-1 bg-[var(--color-line)]" />
                  )}
                </div>
                <div className={`min-w-0 flex-1 ${index < steps.length - 1 ? "pb-4" : ""}`}>
                  <p className="flex min-h-9 items-center text-sm font-semibold">{step.title}</p>
                  {step.body && (
                    <p className="text-xs leading-snug text-[var(--color-muted)]">{step.body}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed}
            aria-label="I agree to Terms"
            onClick={() => onAgreeChange(!agreed)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
              agreed
                ? "border-[var(--color-brand-dark)] bg-[var(--color-brand-dark)]"
                : "border-[var(--color-line)] bg-white"
            }`}
          >
            {agreed && <Icon name="check" size={14} className="text-white" />}
          </button>
          <p className="flex min-h-9 min-w-0 flex-1 items-center text-sm font-semibold text-[var(--color-ink)]">
            <button type="button" onClick={() => onAgreeChange(!agreed)} className="text-left">
              I agree to
            </button>
            <a
              href="https://taxform.com/en-uk/terms/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline underline-offset-2"
            >
              Terms
            </a>
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            disabled={!agreed}
            onClick={onConfirm}
            className="w-full rounded-lg bg-[var(--color-brand)] px-6 py-3.5 font-bold text-[var(--color-brand-dark)] transition hover:bg-[var(--color-brand-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--color-brand)] disabled:hover:text-[var(--color-brand-dark)]"
          >
            Confirm and Pay
          </button>
          <a
            href="https://taxform.com/en-uk/call-me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-[var(--color-brand-dark)] transition hover:bg-[rgba(169,212,129,0.4)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/phone-outline.svg" alt="" aria-hidden className="h-4 w-4" />
            Book a free call with an expert
          </a>
        </div>
      </div>
    </section>
  );
}

export default function RecommendationPage() {
  const router = useRouter();
  const selectedSources = useAppStore((s) => s.incomeSources);
  const entryReasons = useAppStore((s) => s.entryReasons);
  const answers = useAppStore((s) => s.answers);
  const saRegistered = useAppStore((s) => s.saRegistered);
  const firstTimeFiler = useAppStore((s) => s.firstTimeFiler);
  const setCategoryIndex = useAppStore((s) => s.setCategoryIndex);
  const setQuestionIndex = useAppStore((s) => s.setQuestionIndex);
  const [matched, setMatched] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [choosingPlan, setChoosingPlan] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("tax-return-plus");

  const activeCategories = categories.filter(
    (c) => !c.incomeSourceId || selectedSources.includes(c.incomeSourceId)
  );
  const showTaxDeadline = true;
  const showRegistrationDeadline = saRegistered === "No" || firstTimeFiler === "Yes";
  const selectedPlan =
    comparePlans.find((p) => p.id === selectedPlanId) ?? comparePlans[1];
  const accountantSteps = buildAccountantSteps({
    incomeSources: selectedSources,
    entryReasons,
    answers,
    saRegistered,
  });

  const nextSteps: NextStep[] = [
    {
      label: "Prepare documents",
      icon: "file-text",
      documents: visiblePrepareDocuments({
        incomeSources: selectedSources,
        entryReasons,
        firstTimeFiler,
        saRegistered,
      }),
    },
    {
      label: "Review & Approve",
      icon: "search",
    },
  ];

  function editCategory(index: number) {
    const target = activeCategories[index];
    setCategoryIndex(index);
    setQuestionIndex(
      isCategoryComplete(target, answers) ? getVisibleQuestions(target, answers).length : 0
    );
    router.push("/tax-years/2025/question");
  }

  if (selectedSources.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold">No answers yet</h1>
          <p className="text-[var(--color-muted)]">
            Head back and tell us about your income first — then we can recommend the best service
            for you.
          </p>
          <Link
            href="/income-sources"
            className="rounded-lg bg-[var(--color-brand)] px-6 py-3 font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
          >
            Choose income sources
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header progress={100} />
      <HeroBackdrop dimmed />
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        {choosingPlan ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setChoosingPlan(false)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)] transition hover:text-[var(--color-brand-dark)]"
              >
                <Icon name="x" size={18} />
                Cancel
              </button>
              <LiveChatPill />
            </div>
            <PlanChooser
              selectedId={selectedPlanId}
              onSelect={(plan) => {
                setSelectedPlanId(plan.id);
                setChoosingPlan(false);
              }}
            />
          </>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="sticky top-6 flex w-full shrink-0 flex-col gap-4 self-start sm:w-72">
              <Breadcrumb label="All questions" onBack={() => router.back()} />
              <StepNav
                activeCategories={activeCategories}
                active={{ kind: "match" }}
                answers={answers}
                matched={matched}
                onIncomeSources={() => router.push("/income-sources")}
                onSelectCategory={(i) => editCategory(i)}
                onMatch={() => {}}
                nextSteps={nextSteps}
              />
              {showTaxDeadline && (
                <DeadlineBanner
                  image="/deadline-calendar.png"
                  emphasize="30 days"
                  title="left to file"
                  detail="31 Jan 2027"
                />
              )}
              {showRegistrationDeadline && (
                <DeadlineBanner
                  image="/registration-calendar.png"
                  title="Missed registration deadline"
                  detail="5 Oct 2026"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-6 flex justify-end">
                <LiveChatPill />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Tax Return takes time. Hand over your stress.
              </h1>
              <div className="mt-3 space-y-3 text-[var(--color-ink)]">
                {showTaxDeadline && (
                  <p>
                    Get matched with an a UK-accredited accountant today to avoid missing the
                    deadline. Your specialist will guide you through every step. Our 100% Accuracy
                    Guarantee means you can relax knowing everything is taken care of.
                  </p>
                )}
              </div>

              <div className="mt-6">
                <AccountantPlanCard
                  plan={selectedPlan}
                  steps={accountantSteps}
                  agreed={agreed}
                  onAgreeChange={setAgreed}
                  onConfirm={() => setMatched(true)}
                  onChangePlan={() => setChoosingPlan(true)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
