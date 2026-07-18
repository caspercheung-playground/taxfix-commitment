"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Icon } from "@/components/icons";
import { LiveChatPill } from "@/components/LiveChatPill";
import { Breadcrumb } from "@/components/wizard/Breadcrumb";
import { StepNav } from "@/components/wizard/StepNav";
import { categories, incomeSources, mtdMessages, recommendedPlan } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { getVisibleQuestions, isCategoryComplete, mtdStatus } from "@/lib/wizard";

function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * The one consolidated plan card: a white receipt-style ticket. Opens with the
 * Recommended Plan banner, then the plan name/price/discount row, features,
 * and the CTA. The reassurance headline, "based on your answers" reasons, and
 * the "How It Works" steps all live outside this card (see the page body and
 * StepNav's `nextSteps`).
 */
function PlanTicket({
  hasCapitalGains,
  matched,
  onMatch,
}: {
  hasCapitalGains: boolean;
  matched: boolean;
  onMatch: () => void;
}) {
  const plan = recommendedPlan;

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
      <div className="p-6 sm:p-8">
        <span className="inline-flex items-center rounded-full bg-[var(--color-brand-soft)] px-3 py-1.5 text-sm font-bold text-[var(--color-ink)]">
          Recommended Plan
        </span>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">{plan.name}</h2>
          <span className="rounded-full bg-[var(--color-brand-soft)] px-3 py-1.5 text-sm font-bold text-[var(--color-ink)]">
            {plan.discount}
          </span>
          <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
          <span className="text-xl text-[var(--color-muted)]">{plan.period}</span>
        </div>
        <p className="mt-2 text-[var(--color-muted)]">{plan.renewal}</p>
        {hasCapitalGains && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Your plan may cost more if you have capital gains or unorganised records.
          </p>
        )}

        <button
          type="button"
          disabled={matched}
          onClick={onMatch}
          className="mt-5 w-full rounded-lg bg-[var(--color-brand)] px-6 py-3.5 font-bold text-[var(--color-brand-dark)] transition hover:bg-[var(--color-brand-dark)] hover:text-white disabled:cursor-default disabled:hover:bg-[var(--color-brand)] disabled:hover:text-[var(--color-brand-dark)]"
        >
          {matched ? "We're matching you with an accountant…" : plan.cta}
        </button>
        <a
          href="https://taxfix.com/en-uk/call-me/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-brand-dark)] bg-white px-6 py-3.5 font-bold text-[var(--color-brand-dark)] transition hover:bg-[rgba(169,212,129,0.4)] hover:text-[rgb(21,70,24)]"
        >
          <Icon name="phone" size={16} />
          Book a call
        </a>

        <p className="mt-6 font-bold">{plan.featuresHeading}</p>
        <ul className="mt-3 space-y-4">
          {plan.features.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)]">
                <Icon name="check" size={12} />
              </span>
              <div className="min-w-0">
                <p className="font-bold underline decoration-[var(--color-brand-dark)]/40 underline-offset-4">
                  {feature.title}
                </p>
                <p className="mt-1 text-sm text-[var(--color-ink)]">{feature.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function RecommendationPage() {
  const router = useRouter();
  const selectedSources = useAppStore((s) => s.incomeSources);
  const answers = useAppStore((s) => s.answers);
  const saRegistered = useAppStore((s) => s.saRegistered);
  const setCategoryIndex = useAppStore((s) => s.setCategoryIndex);
  const setQuestionIndex = useAppStore((s) => s.setQuestionIndex);
  const [matched, setMatched] = useState(false);

  const activeCategories = categories.filter(
    (c) => !c.incomeSourceId || selectedSources.includes(c.incomeSourceId)
  );
  const mtd = mtdStatus(answers, selectedSources);
  const hasCapitalGains = selectedSources.includes("capital-gains");
  const needsUtrRegistration = saRegistered === "No";

  const incomeCategoryNames = incomeSources
    .filter((s) => selectedSources.includes(s.id) && categories.some((c) => c.incomeSourceId === s.id))
    .map((s) => s.title.toLowerCase());

  const bullets = [
    incomeCategoryNames.length > 1
      ? `You have multiple income streams (${listOf(incomeCategoryNames)}) — one return has to bring them all together.`
      : `You earn through ${incomeCategoryNames[0] ?? "self-employment"}, which means filing a full Self Assessment return.`,
    ...(needsUtrRegistration
      ? [
          "You'll need UTR support before you can file — we'll register you for Self Assessment. Registering by 5 October avoids delays.",
        ]
      : []),
    ...(mtd === "50k-plus" ? [mtdMessages["50k-plus"]] : []),
    ...(hasCapitalGains
      ? ["You have capital gains, which usually need extra care to file correctly."]
      : []),
  ];

  const nextSteps = [
    ...(needsUtrRegistration ? [{ label: "Register UTR", caption: "Accountant (2 weeks)" }] : []),
    { label: "Upload documents", caption: "You" },
    { label: "Review and filing", caption: "Accountant" },
    { label: "Review and approve", caption: "You" },
    { label: "File with HMRC", caption: "Accountant" },
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
        <div className="mb-6 flex items-center justify-between">
          {/* Standard back-in-history behavior, not a hardcoded return to Get Started */}
          <Breadcrumb onBack={() => router.back()} />
          <LiveChatPill />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
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

          {/* Main recommendation */}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight">Hand over your stress.</h1>
            <p className="mt-2 text-[var(--color-ink)]">
              Secure your filing slot with a UK-accredited specialist today. All of our tax return
              services are covered by our 100% Accuracy Guarantee.
            </p>

            <div className="mt-6 rounded-2xl bg-[var(--color-cream)] p-4">
              <p className="text-sm font-bold text-[var(--color-brand-dark)]">
                Based on your answers, we think this plan is best for you
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-ink)]">
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <PlanTicket
                hasCapitalGains={hasCapitalGains}
                matched={matched}
                onMatch={() => setMatched(true)}
              />
            </div>

            {(mtd === "under-30k" || mtd === "30k-to-50k") && (
              <p className="mt-6 flex items-start gap-2 px-1 text-sm text-[var(--color-muted)]">
                <Icon
                  name="check"
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--color-brand-dark)]"
                />
                {mtdMessages[mtd]}
              </p>
            )}

            <div className="mt-8 flex items-center justify-center text-sm font-semibold text-[var(--color-muted)]">
              <a
                href="https://taxfix.com/en-uk/wp-content/uploads/Plans-comparison.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-ink)]"
              >
                Compare with other plans
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
