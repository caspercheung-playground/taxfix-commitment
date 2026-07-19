"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Icon } from "@/components/icons";
import {
  ENABLED_ENTRY_REASON_IDS,
  entryReasons,
  type EntryReason,
} from "@/lib/data";
import { useAppStore } from "@/lib/store";

const enabledReasonIds = new Set<string>(ENABLED_ENTRY_REASON_IDS);

export default function ChooseTaxToolPage() {
  const router = useRouter();
  const selected = useAppStore((s) => s.entryReasons);
  const incomeSources = useAppStore((s) => s.incomeSources);
  const toggleEntryReason = useAppStore((s) => s.toggleEntryReason);
  const toggleIncomeSource = useAppStore((s) => s.toggleIncomeSource);

  const canContinue = selected.some((id) => enabledReasonIds.has(id));

  function handleToggle(reason: EntryReason) {
    if (!enabledReasonIds.has(reason.id)) return;

    const wasSelected = selected.includes(reason.id);
    toggleEntryReason(reason.id);

    // Keep income pre-selection in sync for reasons that map to a source.
    // HMRC contact is a support signal only — it does not map to income.
    if (reason.incomeSourceId) {
      const alreadySelected = incomeSources.includes(reason.incomeSourceId);
      if (!wasSelected && !alreadySelected) {
        toggleIncomeSource(reason.incomeSourceId);
      } else if (wasSelected && alreadySelected) {
        toggleIncomeSource(reason.incomeSourceId);
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <HeroBackdrop />
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-5 pt-8 pb-16 sm:pt-10 sm:pb-24">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome! What brings you here today?
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Choose everything that applies — we&apos;ll tailor your questions to match.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {entryReasons.map((reason) => {
            const active = selected.includes(reason.id);
            const isDisabled = !enabledReasonIds.has(reason.id);
            return (
              <button
                key={reason.id}
                type="button"
                disabled={isDisabled}
                onClick={() => handleToggle(reason)}
                className={`rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-[var(--color-brand-dark)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                    : isDisabled
                      ? "cursor-not-allowed border-transparent bg-[var(--color-cream)] opacity-50"
                      : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    active
                      ? "bg-[var(--color-brand-dark)] text-white"
                      : "bg-white text-[var(--color-ink)]"
                  }`}
                >
                  <Icon name={active ? "check" : reason.icon} size={16} />
                </span>
                <p className="mt-4 font-bold">{reason.title}</p>
              </button>
            );
          })}

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-lg font-bold text-[var(--color-brand-dark)] transition hover:bg-[rgba(169,212,129,0.4)] hover:text-[rgb(21,70,24)]"
            >
              <Icon name="arrow-left" size={20} />
              Back
            </button>
          </div>
          <div className="hidden sm:block" />
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => router.push("/income-sources")}
              className={`inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-lg font-bold transition ${
                canContinue
                  ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
                  : "cursor-not-allowed bg-[var(--color-line)] text-[var(--color-muted)]"
              }`}
            >
              Next
              <Icon name="arrow-right" size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
