"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Modal } from "@/components/Modal";
import { Icon } from "@/components/icons";
import { incomeSources } from "@/lib/data";
import { useAppStore } from "@/lib/store";

export default function IncomeSourcesPage() {
  const router = useRouter();
  const selected = useAppStore((s) => s.incomeSources);
  const toggleIncomeSource = useAppStore((s) => s.toggleIncomeSource);
  const [confirmFor, setConfirmFor] = useState<string | null>(null);

  const canContinue = selected.length > 0;
  const confirmSource = incomeSources.find((s) => s.id === confirmFor);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <HeroBackdrop />
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-5 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome! Select where does your income come from
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Choose all that apply between 6th April 2025 to 5th April 2026
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {incomeSources.map((source) => {
            const active = selected.includes(source.id);
            const isDisabled = ["employment", "dividends", "capital-gains", "foreign"].includes(source.id);
            return (
              <button
                key={source.id}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  if (!active && source.confirm) {
                    setConfirmFor(source.id);
                    return;
                  }
                  toggleIncomeSource(source.id);
                }}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  active
                    ? "border-[var(--color-brand-dark)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                    : isDisabled
                      ? "border-transparent bg-[var(--color-cream)] cursor-not-allowed opacity-50"
                      : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
                }`}
              >
                {/* The icon doubles as the selected indicator — green + check when picked */}
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    active
                      ? "bg-[var(--color-brand-dark)] text-white"
                      : "bg-white text-[var(--color-ink)]"
                  }`}
                >
                  <Icon name={active ? "check" : source.icon} size={16} />
                </span>
                <p className="mt-4 font-bold">{source.title}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{source.description}</p>
              </button>
            );
          })}

          {/* Third grid row: Back sits under the first column, Next aligns to the right edge of the third card */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 font-bold text-[var(--color-brand-dark)] hover:text-[var(--color-ink)]"
            >
              <Icon name="arrow-left" size={18} />
              Back
            </button>
          </div>
          <div className="hidden sm:block" />
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => router.push("/tax-years/2025/question")}
              className={`rounded-lg px-7 py-3.5 text-lg font-bold transition ${
                canContinue
                  ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
                  : "cursor-not-allowed bg-[var(--color-line)] text-[var(--color-muted)]"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <Modal
        open={!!confirmSource}
        title="Just to double check"
        onClose={() => setConfirmFor(null)}
      >
        {confirmSource?.confirm && (
          <>
            <p className="text-[var(--color-ink)]">{confirmSource.confirm.question}</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{confirmSource.confirm.helper}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmFor(null)}
                className="rounded-full px-4 py-2 font-semibold text-[var(--color-muted)] hover:bg-[var(--color-cream)]"
              >
                No, I didn&apos;t
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmFor) toggleIncomeSource(confirmFor);
                  setConfirmFor(null);
                }}
                className="rounded-full bg-[var(--color-brand)] px-4 py-2 font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
              >
                Yes, I did
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
