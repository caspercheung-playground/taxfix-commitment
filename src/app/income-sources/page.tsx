"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { Icon } from "@/components/icons";
import { LiveChatPill } from "@/components/LiveChatPill";
import { incomeSources, TAX_YEAR_LABEL } from "@/lib/data";
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <div className="mb-6 flex items-center justify-end">
          <LiveChatPill />
        </div>

        <div className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          <Icon name="arrow-left" size={16} />
          Tax Year / {TAX_YEAR_LABEL}
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Left panel: same shell as the question steps, so the flow starts
              the way it continues */}
          <aside className="w-full shrink-0 self-start rounded-3xl bg-[var(--color-cream)] p-6 sm:w-72">
            <div className="flex items-center gap-3 border-b border-[var(--color-cream-border)] pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-brand-dark)]">
                <Icon name="briefcase" size={18} />
              </span>
              <h2 className="text-lg font-extrabold">Income Sources</h2>
            </div>
            {selected.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--color-muted)]">
                Nothing added yet — pick everything that applies.
              </p>
            ) : (
              <ul className="mt-2">
                {incomeSources
                  .filter((s) => selected.includes(s.id))
                  .map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-2 border-b border-[var(--color-cream-border)] py-3.5 text-sm last:border-0"
                    >
                      <Icon name="check" size={16} className="shrink-0 text-[var(--color-brand-dark)]" />
                      {s.title}
                    </li>
                  ))}
              </ul>
            )}
          </aside>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              First, select where your income comes from in the tax year 2025-2026
            </h1>
            <p className="mt-2 text-[var(--color-muted)]">
              Choose all that apply between 6 Apr 2025 - 5 Apr 2026
            </p>

            <div className="mt-8 space-y-3">
              {incomeSources.map((source) => {
                const isSelected = selected.includes(source.id);
                return (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => {
                      if (!isSelected && source.confirm) {
                        setConfirmFor(source.id);
                        return;
                      }
                      toggleIncomeSource(source.id);
                    }}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? "border-[var(--color-brand)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                        : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
                    }`}
                  >
                    {/* Selection replaces the option's icon */}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-[var(--color-brand-dark)] text-white"
                          : "text-[var(--color-ink)]"
                      }`}
                    >
                      <Icon name={isSelected ? "check" : source.icon} size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold">{source.title}</span>
                      <p className="mt-0.5 text-sm text-[var(--color-muted)]">{source.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push("/choose-tax-tool")}
                className="inline-flex items-center gap-2 font-bold text-[var(--color-brand-dark)] hover:text-[var(--color-ink)]"
              >
                <Icon name="arrow-left" size={18} />
                Back
              </button>
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
