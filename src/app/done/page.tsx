"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";
import { categories } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { formatDisplayValue, getVisibleQuestions } from "@/lib/wizard";

export default function DonePage() {
  const router = useRouter();
  const incomeSources = useAppStore((s) => s.incomeSources);
  const answers = useAppStore((s) => s.answers);
  const checklist = useAppStore((s) => s.checklist);
  const resetWizard = useAppStore((s) => s.resetWizard);

  const activeCategories = categories.filter((c) => incomeSources.includes(c.incomeSourceId));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header progress={100} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
            <Icon name="sparkles" size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">You&apos;re all set</h1>
            <p className="text-[var(--color-muted)]">Here&apos;s everything you told us. This prototype stops here.</p>
          </div>
        </div>

        {activeCategories.length === 0 ? (
          <p className="mt-8 text-[var(--color-muted)]">No answers were collected yet.</p>
        ) : (
          <div className="mt-8 space-y-6">
            {activeCategories.map((category) => {
              const questions = getVisibleQuestions(category, answers);
              return (
                <div key={category.id} className="rounded-2xl border border-[var(--color-cream-border)] p-6">
                  <div className="flex items-center gap-3 border-b border-[var(--color-cream-border)] pb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-cream)] text-[var(--color-brand-dark)]">
                      <Icon name={category.icon} size={18} />
                    </span>
                    <h2 className="font-extrabold">{category.title}</h2>
                  </div>
                  <dl className="mt-4 divide-y divide-[var(--color-cream-border)]">
                    {questions.map((q) => (
                      <div key={q.id} className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-sm text-[var(--color-muted)]">{q.sidebarLabel}</dt>
                        <dd className="font-semibold">
                          {formatDisplayValue(category, q, answers, checklist) || "—"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              resetWizard();
              router.push("/choose-tax-tool");
            }}
            className="rounded-full bg-[var(--color-brand)] px-6 py-3 font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
          >
            Start a new return
          </button>
          <Link
            href="/"
            className="rounded-full bg-[var(--color-cream)] px-6 py-3 font-semibold hover:bg-[var(--color-cream-border)]"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
