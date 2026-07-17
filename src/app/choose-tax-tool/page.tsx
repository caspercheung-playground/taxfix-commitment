"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";
import { useAppStore } from "@/lib/store";
import type { WelcomeAnswer } from "@/lib/types";

const QUESTIONS: { key: "firstTimeFiler" | "saRegistered"; prompt: string }[] = [
  { key: "firstTimeFiler", prompt: "Welcome! Is this your first time doing Self Assessment?" },
  { key: "saRegistered", prompt: "Have you registered for Self Assessment online?" },
];

function YesNoPills({
  value,
  onSelect,
}: {
  value: WelcomeAnswer | null;
  onSelect: (v: WelcomeAnswer) => void;
}) {
  return (
    <div className="mt-8 flex justify-center gap-3">
      {(["Yes", "No"] as const).map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`flex items-center gap-2.5 rounded-full border px-8 py-3.5 text-lg font-bold transition ${
              active
                ? "border-[var(--color-brand)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
            }`}
          >
            <span
              aria-hidden
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                active ? "border-[var(--color-brand-dark)]" : "border-[var(--color-line)] bg-white"
              }`}
            >
              {active && <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand-dark)]" />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const firstTimeFiler = useAppStore((s) => s.firstTimeFiler);
  const saRegistered = useAppStore((s) => s.saRegistered);
  const setFirstTimeFiler = useAppStore((s) => s.setFirstTimeFiler);
  const setSaRegistered = useAppStore((s) => s.setSaRegistered);

  // One question at a time; land on the first unanswered one.
  const [step, setStep] = useState(firstTimeFiler === null ? 0 : 1);
  const values = { firstTimeFiler, saRegistered };
  const setters = { firstTimeFiler: setFirstTimeFiler, saRegistered: setSaRegistered };
  const question = QUESTIONS[step];
  const bothAnswered = firstTimeFiler !== null && saRegistered !== null;

  function handleSelect(v: WelcomeAnswer) {
    setters[question.key](v);
    if (step === 0) setStep(1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-5 py-20 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero-arrow.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[15%] hidden w-[9%] max-w-[140px] lg:block"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero-percent.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-[10%] hidden w-[7%] max-w-[110px] lg:block"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero-coin.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[5%] hidden w-[10%] max-w-[160px] lg:block"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero-card.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[8%] right-0 hidden w-[6%] max-w-[100px] lg:block"
        />

        <div className="relative mx-auto w-full max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {question.prompt}
          </h1>

          <YesNoPills value={values[question.key]} onSelect={handleSelect} />

          <div className="mt-10 flex items-center justify-center gap-6">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                <Icon name="arrow-left" size={16} />
                Back
              </button>
            )}
            {bothAnswered && step === 1 && (
              <button
                type="button"
                onClick={() => router.push("/income-sources")}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-7 py-3.5 text-lg font-bold text-[var(--color-brand-dark)] transition hover:bg-[var(--color-brand-dark)] hover:text-white"
              >
                Continue
                <Icon name="arrow-right" size={20} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
