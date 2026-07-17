"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { Icon } from "@/components/icons";
import { UrgencyStrip } from "@/components/UrgencyStrip";
import { incomeSources, TAX_YEAR_RANGE } from "@/lib/data";
import { useAppStore, type UtrAnswer } from "@/lib/store";

const UTR_OPTIONS: UtrAnswer[] = ["Yes", "No", "Not sure"];

function UtrQuestion() {
  const utr = useAppStore((s) => s.utr);
  const setUtr = useAppStore((s) => s.setUtr);

  return (
    <div className="mt-8">
      <div className="rounded-3xl bg-[var(--color-brand-soft)] p-6 sm:p-8">
        <h2 className="text-xl font-extrabold leading-snug sm:text-2xl">
          Do you already have a UTR (Unique Taxpayer Reference)?
        </h2>
        <p className="mt-2 text-[var(--color-muted)]">
          It&apos;s the 10-digit number HMRC gives you when you register for Self Assessment.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 px-1">
        {UTR_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setUtr(opt)}
            className={`rounded-full px-6 py-3 font-bold transition ${
              utr === opt
                ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)]"
                : "bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-cream-border)]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function IncomeSourcesPage() {
  const router = useRouter();
  const selected = useAppStore((s) => s.incomeSources);
  const toggleIncomeSource = useAppStore((s) => s.toggleIncomeSource);
  const utr = useAppStore((s) => s.utr);
  const [confirmFor, setConfirmFor] = useState<string | null>(null);

  const canContinue = selected.length > 0 && utr !== null;
  const confirmSource = incomeSources.find((s) => s.id === confirmFor);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <UrgencyStrip className="mb-8" />
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Select all the ways you earned income this tax year
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Choose all that applied to you between {TAX_YEAR_RANGE}.
        </p>

        <UtrQuestion />

        <div className={`mt-8 space-y-3 ${utr === null ? "pointer-events-none opacity-40" : ""}`}>
          {incomeSources.map((source) => {
            const isSelected = selected.includes(source.id);
            return (
              <div
                key={source.id}
                className={`flex items-center gap-4 rounded-2xl border p-5 transition ${
                  isSelected
                    ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                    : "border-transparent bg-[var(--color-cream)]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isSelected ? "bg-[var(--color-brand-dark)] text-white" : "bg-white text-[var(--color-ink)]"
                  }`}
                >
                  <Icon name={isSelected ? "check" : source.icon} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">{source.title}</span>
                    {source.tag && (
                      <span className="rounded-full bg-[var(--color-brand-dark)] px-2.5 py-0.5 text-xs font-semibold text-white">
                        {source.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--color-muted)]">{source.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      toggleIncomeSource(source.id);
                      return;
                    }
                    if (source.confirm) {
                      setConfirmFor(source.id);
                      return;
                    }
                    toggleIncomeSource(source.id);
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-white text-[var(--color-ink)] hover:bg-[var(--color-cream-border)]"
                      : "bg-[var(--color-brand-soft-2)] text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-soft)]"
                  }`}
                >
                  {isSelected ? "Remove" : "Add"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => router.push("/tax-years/2025/question")}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-6 py-3 font-bold text-[var(--color-brand-dark)] transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-brand-dark)] hover:text-white"
          >
            Continue
            <Icon name="arrow-right" size={18} />
          </button>
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
