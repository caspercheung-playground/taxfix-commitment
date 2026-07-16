"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";
import { reasonCards, reasonToIncomeSource } from "@/lib/data";
import { useAppStore } from "@/lib/store";

export default function ChooseTaxToolPage() {
  const router = useRouter();
  const reasons = useAppStore((s) => s.reasons);
  const incomeSources = useAppStore((s) => s.incomeSources);
  const toggleReason = useAppStore((s) => s.toggleReason);
  const toggleIncomeSource = useAppStore((s) => s.toggleIncomeSource);

  const canContinue = reasons.length > 0;

  function handleToggle(reasonId: string) {
    const wasSelected = reasons.includes(reasonId);
    toggleReason(reasonId);
    if (!wasSelected) {
      const sourceId = reasonToIncomeSource[reasonId];
      if (sourceId && !incomeSources.includes(sourceId)) {
        toggleIncomeSource(sourceId);
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          What brings you here today?
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Choose everything that applies — we&apos;ll tailor your questions to match.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {reasonCards.map((card) => {
            const selected = reasons.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleToggle(card.id)}
                className={`group relative flex flex-col items-start gap-4 rounded-2xl border p-5 text-left transition ${
                  selected
                    ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                    : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    selected ? "bg-white text-[var(--color-brand-dark)]" : "bg-white text-[var(--color-ink)]"
                  }`}
                >
                  <Icon name={card.icon} />
                </span>
                <span className="font-semibold leading-snug">{card.label}</span>
                {selected && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand-dark)] text-white">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => router.push("/income-sources")}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-6 py-3 font-bold text-[var(--color-brand-dark)] transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-brand-dark)] hover:text-white"
          >
            Continue
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
