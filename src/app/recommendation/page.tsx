"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, type IconName } from "@/components/icons";
import { UrgencyStrip } from "@/components/UrgencyStrip";
import { categories, incomeSources, MTD_INCOME_THRESHOLD, recommendedPlan } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { combinedSeAndRentalIncome, formatDisplayValue, getVisibleQuestions } from "@/lib/wizard";

function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
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
  const checklist = useAppStore((s) => s.checklist);
  const utr = useAppStore((s) => s.utr);
  const setCategoryIndex = useAppStore((s) => s.setCategoryIndex);
  const setQuestionIndex = useAppStore((s) => s.setQuestionIndex);

  const activeCategories = categories.filter((c) => selectedSources.includes(c.incomeSourceId));
  const combinedIncome = combinedSeAndRentalIncome(answers);
  const hasCapitalGains = selectedSources.includes("capital-gains");
  const needsUtrRegistration = utr === "No";

  const incomeTypeNames = incomeSources
    .filter((s) => selectedSources.includes(s.id))
    .map((s) => s.title.toLowerCase());

  const utrPhrase =
    utr === "Yes"
      ? "already have a UTR"
      : utr === "No"
        ? "don't have a UTR yet"
        : "aren't sure about your UTR yet";

  function editCategory(index: number) {
    setCategoryIndex(index);
    setQuestionIndex(0);
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
          {/* Left panel: plan summary + editable answer sections */}
          <aside className="w-full shrink-0 rounded-3xl bg-[var(--color-cream)] p-6 sm:w-72">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Recommended plan
            </p>
            <p className="mt-1 text-2xl font-extrabold">{recommendedPlan.price}</p>
            <p className="font-bold text-[var(--color-brand-dark)]">{recommendedPlan.name}</p>

            <div className="mt-5 border-t border-[var(--color-cream-border)] pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                Your answers
              </p>
              <ul className="mt-1">
                <li className="border-b border-[var(--color-cream-border)]">
                  <Link
                    href="/income-sources"
                    className="flex w-full items-center gap-2 py-3.5 text-left"
                  >
                    <span className="flex-1 text-sm">UTR</span>
                    <span className="truncate text-sm text-[var(--color-muted)]">{utr ?? "—"}</span>
                    <Icon name="chevron-right" size={16} className="shrink-0 text-[var(--color-muted)]" />
                  </Link>
                </li>
                {activeCategories.map((category, i) => (
                  <li key={category.id} className="border-b border-[var(--color-cream-border)] last:border-0">
                    <button
                      type="button"
                      onClick={() => editCategory(i)}
                      className="flex w-full items-center gap-2 py-3.5 text-left"
                    >
                      <span className="flex-1 text-sm">{category.title}</span>
                      <span className="truncate text-sm text-[var(--color-muted)]">
                        {getVisibleQuestions(category, answers)
                          .slice(0, 1)
                          .map((q) => formatDisplayValue(category, q, answers, checklist))
                          .join("") || "—"}
                      </span>
                      <Icon name="chevron-right" size={16} className="shrink-0 text-[var(--color-muted)]" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => editCategory(0)}
              className="mt-4 text-sm font-semibold text-[var(--color-brand-dark)] underline underline-offset-2 hover:text-[var(--color-ink)]"
            >
              Edit your answers
            </button>
          </aside>

          {/* Main recommendation */}
          <div className="min-w-0 flex-1">
            <div className="rounded-3xl bg-[var(--color-brand-soft)] p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-brand-dark)]">
                Best Service for me
              </p>
              <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                {recommendedPlan.price} — {recommendedPlan.name}
              </h1>
              <p className="mt-3 text-[var(--color-ink)]">
                Recommended because you have {listOf(incomeTypeNames)} and {utrPhrase}.
                {needsUtrRegistration && (
                  <> We&apos;ll handle your UTR registration as part of this plan.</>
                )}
              </p>
            </div>

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

            {combinedIncome <= MTD_INCOME_THRESHOLD && (
              <p className="mt-6 flex items-center gap-2 px-1 text-sm text-[var(--color-muted)]">
                <Icon name="check" size={16} className="shrink-0 text-[var(--color-brand-dark)]" />
                Making Tax Digital doesn&apos;t apply to you this year.
              </p>
            )}

            <button
              type="button"
              className="mt-8 w-full rounded-lg bg-[var(--color-brand)] px-6 py-3.5 font-bold text-[var(--color-brand-dark)] transition hover:bg-[var(--color-brand-dark)] hover:text-white"
            >
              Confirm and pay
            </button>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm font-semibold text-[var(--color-muted)]">
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
