"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, type IconName } from "@/components/icons";
import { UrgencyStrip } from "@/components/UrgencyStrip";
import { FlowRail, type RailItem } from "@/components/wizard/FlowRail";
import { categories, incomeSources, mtdMessages, recommendedPlan, TAX_YEAR_LABEL } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { ALLOWANCES_KEY, getUtr, mtdStatus, UTR_KEY } from "@/lib/wizard";

function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function PlanCard({ reasoning }: { reasoning: string }) {
  const plan = recommendedPlan;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[var(--color-brand-soft)]">
      <span className="absolute right-0 top-0 rounded-bl-2xl bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-[var(--color-brand-dark)]">
        {plan.badge}
      </span>

      <div className="p-6 sm:p-8">
        <h1 className="pr-28 text-3xl font-extrabold tracking-tight">{plan.name}</h1>
        <p className="mt-2 text-[var(--color-ink)]">{plan.tagline}</p>

        {/* Why this plan, from the user's own answers */}
        <p className="mt-3 text-sm font-semibold text-[var(--color-brand-dark)]">{reasoning}</p>

        <hr className="my-5 border-[var(--color-brand-dark)]/15" />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
          <span className="text-xl text-[var(--color-muted)]">{plan.period}</span>
          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-[var(--color-ink)]">
            {plan.discount}
          </span>
        </div>
        <p className="mt-2 text-[var(--color-muted)]">{plan.renewal}</p>

        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-[var(--color-brand)] px-6 py-3.5 font-bold text-[var(--color-brand-dark)] transition hover:bg-[var(--color-brand-dark)] hover:text-white"
        >
          {plan.cta}
        </button>
        <p className="mt-3 text-center text-sm text-[var(--color-ink)]">{plan.socialProof}</p>

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

function StepVisual({ needsUtrRegistration }: { needsUtrRegistration: boolean }) {
  const steps: { icon: IconName; label: string }[] = [
    ...(needsUtrRegistration
      ? [{ icon: "clock" as IconName, label: "Register for UTR (~2 weeks)" }]
      : []),
    { icon: "upload", label: "Upload documents" },
    { icon: "user", label: "Accountant reviews" },
    { icon: "check", label: "You approve" },
    { icon: "send", label: "We file" },
  ];

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-2">
      {steps.map((step, i) => (
        <Fragment key={step.label}>
          {i > 0 && (
            <Icon
              name="arrow-right"
              size={16}
              className="hidden shrink-0 text-[var(--color-muted)] sm:mt-3.5 sm:block"
            />
          )}
          <div className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:gap-2 sm:text-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
              <Icon name={step.icon} size={20} />
            </span>
            <span className="text-sm font-semibold">{step.label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default function RecommendationPage() {
  const router = useRouter();
  const selectedSources = useAppStore((s) => s.incomeSources);
  const answers = useAppStore((s) => s.answers);
  const setCategoryIndex = useAppStore((s) => s.setCategoryIndex);
  const setQuestionIndex = useAppStore((s) => s.setQuestionIndex);

  const activeCategories = categories.filter(
    (c) => !c.incomeSourceId || selectedSources.includes(c.incomeSourceId)
  );
  const mtd = mtdStatus(answers, selectedSources);
  const hasCapitalGains = selectedSources.includes("capital-gains");
  const needsUtrRegistration = getUtr(answers) === "No";

  const incomeTypeNames = incomeSources
    .filter((s) => selectedSources.includes(s.id))
    .map((s) => s.title.toLowerCase());

  const reasoningLine = `Recommended because you have ${listOf(incomeTypeNames)}${
    needsUtrRegistration ? ", and we'll register your UTR for you" : ""
  }.`;

  function editCategory(index: number, qIndex = 0) {
    setCategoryIndex(index);
    setQuestionIndex(qIndex);
    router.push("/tax-years/2025/question");
  }

  const generalIndex = activeCategories.findIndex((c) => c.id === "general");

  const railItems: RailItem[] = [
    {
      id: "income-sources",
      label: "Income sources",
      state: "done",
      onClick: () => router.push("/income-sources"),
    },
    {
      id: "questions",
      label: "Questions",
      state: "done",
      children: [
        // flatMap, not filter().map() — the income rows' editCategory(i) needs
        // i to stay the activeCategories index, which "general" sits inside.
        ...activeCategories.flatMap((category, i) =>
          category.incomeSourceId
            ? [
                {
                  id: category.id,
                  // The rail names income streams the way the picker does, per the design
                  label:
                    incomeSources.find((s) => s.id === category.incomeSourceId)?.title ??
                    category.title,
                  state: "done" as const,
                  onClick: () => editCategory(i),
                },
              ]
            : []
        ),
        {
          id: "utr",
          label: "UTR",
          state: answers[UTR_KEY] ? ("done" as const) : ("active" as const),
          onClick: () => editCategory(generalIndex, 0),
        },
        {
          id: "allowances",
          label: "General & allowances",
          state: answers[ALLOWANCES_KEY] !== undefined ? ("done" as const) : ("active" as const),
          onClick: () => editCategory(generalIndex, 1),
        },
      ],
    },
    { id: "matched", label: "Get matched with an accountant", state: "locked", lockedIcon: "user" },
    ...(needsUtrRegistration
      ? [{ id: "register-utr", label: "Register UTR (~2 weeks)", state: "locked" as const }]
      : []),
    { id: "documents", label: "Documents", state: "locked" },
    { id: "submit", label: "Submit to accountant", state: "locked" },
    { id: "review", label: "Review and approve", state: "locked" },
    { id: "filed", label: "Filed with HMRC", state: "locked" },
  ];

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
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <UrgencyStrip className="mb-6" />

        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/tax-years/2025/question")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <Icon name="arrow-left" size={16} />
            Back to overview
          </button>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Left panel: where you are in the flow, and a way back into any answer */}
          <div className="w-full shrink-0 sm:w-80">
            <FlowRail caption={`Tax year ${TAX_YEAR_LABEL}`} items={railItems} />
            <button
              type="button"
              onClick={() => editCategory(0)}
              className="mt-4 px-2 text-sm font-semibold text-[var(--color-brand-dark)] underline underline-offset-2 hover:text-[var(--color-ink)]"
            >
              Edit your answers
            </button>
          </div>

          {/* Main recommendation */}
          <div className="min-w-0 flex-1">
            <PlanCard reasoning={reasoningLine} />

            <div className="mt-6 space-y-1 px-1 text-sm text-[var(--color-muted)]">
              <p className="font-semibold text-[var(--color-ink)]">
                {recommendedPlan.price}, fixed — stays that way if your documents are organised when
                you upload them.
              </p>
              {hasCapitalGains && (
                <p>Your plan may cost more if you have capital gains or unorganised records.</p>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-[var(--color-cream-border)] p-6">
              <h2 className="font-extrabold">How it works</h2>
              <StepVisual needsUtrRegistration={needsUtrRegistration} />
            </div>

            {mtd !== "unknown" && (
              <p className="mt-6 flex items-start gap-2 px-1 text-sm text-[var(--color-muted)]">
                <Icon
                  name={mtd === "50k-plus" ? "help-circle" : "check"}
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--color-brand-dark)]"
                />
                {mtdMessages[mtd]}
              </p>
            )}

            <div className="mt-8 flex items-center justify-center gap-6 text-sm font-semibold text-[var(--color-muted)]">
              <button type="button" className="underline underline-offset-2 hover:text-[var(--color-ink)]">
                Chat now
              </button>
              <button type="button" className="underline underline-offset-2 hover:text-[var(--color-ink)]">
                Book a call
              </button>
              <button type="button" className="underline underline-offset-2 hover:text-[var(--color-ink)]">
                See other plans
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
