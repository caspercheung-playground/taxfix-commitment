"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon, type IconName } from "@/components/icons";
import { LiveChatPill } from "@/components/LiveChatPill";
import { categories, incomeSources, mtdMessages, recommendedPlan } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { ALLOWANCES_KEY, mtdStatus } from "@/lib/wizard";

function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** How the confirmation rail names each income category, per the design */
const RAIL_LABELS: Record<string, string> = {
  "self-employment": "Self-employment",
  property: "Property rental income",
};

function PlanCard({
  bullets,
  hasCapitalGains,
  matched,
  onMatch,
}: {
  bullets: string[];
  hasCapitalGains: boolean;
  matched: boolean;
  onMatch: () => void;
}) {
  const plan = recommendedPlan;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[var(--color-brand-soft)]">
      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-dark)]">
          Recommended Plan
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{plan.name}</h1>
        <p className="mt-2 text-[var(--color-ink)]">{plan.tagline}</p>

        <div className="mt-4 rounded-2xl bg-white/50 p-4">
          <p className="text-sm font-bold text-[var(--color-brand-dark)]">Why we recommend this</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--color-ink)]">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <hr className="my-5 border-[var(--color-brand-dark)]/15" />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
          <span className="text-xl text-[var(--color-muted)]">{plan.period}</span>
          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-[var(--color-ink)]">
            {plan.discount}
          </span>
        </div>
        <p className="mt-2 text-[var(--color-muted)]">{plan.renewal}</p>
        <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
          {plan.price}, fixed — stays that way if your documents are organised when you upload
          them.
        </p>
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

/**
 * Receipt-style summary of what happens after matching — replaces the old
 * locked-steps rail. Deliberately non-interactive.
 */
function HowItWorksReceipt({ needsUtrRegistration }: { needsUtrRegistration: boolean }) {
  const steps: { actor: string; label: string; icon: IconName }[] = [
    ...(needsUtrRegistration
      ? [{ actor: "Accountant", label: "Register UTR (~2 weeks)", icon: "clock" as IconName }]
      : []),
    { actor: "You", label: "Upload documents", icon: "upload" },
    { actor: "Accountant", label: "Review and filing", icon: "user" },
    { actor: "You", label: "Review and approve", icon: "check" },
    { actor: "Accountant", label: "File with HMRC", icon: "send" },
  ];

  return (
    <div className="mt-8 rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            How it works
          </p>
          <p className="mt-1 text-lg font-extrabold">{recommendedPlan.name}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Matching you with an accountant — usually within 1 business day.
          </p>
        </div>
        <p className="shrink-0 text-lg font-extrabold">
          {recommendedPlan.price}
          <span className="text-sm font-semibold text-[var(--color-muted)]">
            {recommendedPlan.period}
          </span>
        </p>
      </div>

      {/* Perforated receipt divider */}
      <div className="relative" aria-hidden>
        <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[var(--color-line)] bg-white" />
        <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[var(--color-line)] bg-white" />
        <div className="mx-6 border-t border-dashed border-[var(--color-line)]" />
      </div>

      <ol className="relative p-6">
        {/* Timeline line behind the step circles */}
        <span
          aria-hidden
          className="absolute bottom-10 left-[43px] top-10 w-px bg-[var(--color-line)]"
        />
        {steps.map((step, i) => (
          <li key={step.label} className="relative flex items-center gap-4 py-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                i === 0
                  ? "bg-[#f59e0b] text-white"
                  : "border border-[var(--color-line)] bg-[var(--color-cream)] text-[var(--color-muted)]"
              }`}
            >
              <Icon name={step.icon} size={17} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                {step.actor}
              </p>
              <p className={`font-bold ${i === 0 ? "" : "text-[var(--color-muted)]"}`}>
                {step.label}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

type WhereWeAreState = "done" | "active-orange" | "pending";

interface WhereWeAreRowSpec {
  id: string;
  label: string;
  status: "Completed" | "Incomplete";
  state: WhereWeAreState;
  onClick?: () => void;
}

/**
 * "Where we are" — the confirmation page's left panel. A flat, receipt-style
 * status list rather than the wizard's locked-steps rail: every row here is
 * already reachable, so there's nothing to lock. Orange is reserved for the
 * one step that's genuinely still open — matching with an accountant.
 */
function WhereWeAreRow({ label, status, state, onClick }: WhereWeAreRowSpec) {
  const interactive = !!onClick;
  const circle =
    state === "done"
      ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)]"
      : state === "active-orange"
        ? "bg-[#f59e0b] text-white"
        : "border-2 border-[var(--color-line)] bg-white";
  const glyph: IconName = state === "active-orange" ? "arrow-right" : "check";

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
        interactive ? "cursor-pointer hover:bg-[var(--color-cream)]" : "cursor-default"
      }`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${circle}`}>
        {state !== "pending" && <Icon name={glyph} size={15} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{status}</p>
      </div>
      {interactive && <Icon name="chevron-right" size={16} className="shrink-0 text-[var(--color-muted)]" />}
    </button>
  );
}

function WhereWeAreCard({ rows }: { rows: WhereWeAreRowSpec[] }) {
  return (
    <aside className="w-full shrink-0 rounded-2xl bg-white p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] sm:w-80">
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Where we are
      </p>
      <div className="divide-y divide-[var(--color-cream-border)]">
        {rows.map((row) => (
          <Fragment key={row.id}>
            <WhereWeAreRow {...row} />
          </Fragment>
        ))}
      </div>
    </aside>
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
  // Registration status from the welcome screen is the single source of truth
  // for UTR: "No" means not-yet-registered/no UTR throughout.
  const needsUtrRegistration = saRegistered === "No";

  // Bullets read naturally off the picker's names ("self-employment and
  // property rental income"), not the rail's title-case labels.
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

  function editCategory(index: number, qIndex = 0) {
    setCategoryIndex(index);
    setQuestionIndex(qIndex);
    router.push("/tax-years/2025/question");
  }

  const generalIndex = activeCategories.findIndex((c) => c.id === "general");
  const generalCategory = activeCategories[generalIndex];
  const allowancesDone = answers[ALLOWANCES_KEY] !== undefined;

  // flatMap, not filter().map() — editCategory(i) needs i to stay the
  // activeCategories index, which "general" sits inside.
  const incomeRows: WhereWeAreRowSpec[] = activeCategories.flatMap((category, i) =>
    category.incomeSourceId
      ? [
          {
            id: category.id,
            label: RAIL_LABELS[category.id] ?? category.title,
            status: "Completed" as const,
            state: "done" as const,
            onClick: () => editCategory(i),
          },
        ]
      : []
  );

  const whereWeAreRows: WhereWeAreRowSpec[] = [
    {
      id: "onboarding",
      label: "Onboarding",
      status: "Completed",
      state: "done",
      onClick: () => router.push("/choose-tax-tool"),
    },
    ...incomeRows,
    {
      id: "allowances",
      label: generalCategory?.title ?? "General and Allowances",
      status: allowancesDone ? "Completed" : "Incomplete",
      state: allowancesDone ? "done" : "pending",
      onClick: () => editCategory(generalIndex, 0),
    },
    {
      id: "match",
      label: "Match with Accountant",
      status: matched ? "Completed" : "Incomplete",
      state: matched ? "done" : "active-orange",
    },
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
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/tax-years/2025/question")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <Icon name="arrow-left" size={16} />
            Previous session
          </button>
          <div className="flex items-center gap-3">
            <a
              href="https://taxfix.com/en-uk/call-me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[var(--color-cream)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--color-cream-border)]"
            >
              <Icon name="phone" size={16} />
              Book a call
            </a>
            <LiveChatPill />
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Left panel: a receipt of where you are in the flow */}
          <div className="w-full shrink-0 sm:w-80">
            <WhereWeAreCard rows={whereWeAreRows} />
          </div>

          {/* Main recommendation */}
          <div className="min-w-0 flex-1">
            <PlanCard
              bullets={bullets}
              hasCapitalGains={hasCapitalGains}
              matched={matched}
              onMatch={() => setMatched(true)}
            />

            <HowItWorksReceipt needsUtrRegistration={needsUtrRegistration} />

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
