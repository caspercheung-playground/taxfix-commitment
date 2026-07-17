"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";
import { SecondaryYesNo } from "@/components/wizard/SecondaryYesNo";
import { useAppStore } from "@/lib/store";

export default function WelcomePage() {
  const router = useRouter();
  const firstTimeFiler = useAppStore((s) => s.firstTimeFiler);
  const saRegistered = useAppStore((s) => s.saRegistered);
  const setFirstTimeFiler = useAppStore((s) => s.setFirstTimeFiler);
  const setSaRegistered = useAppStore((s) => s.setSaRegistered);

  const bothAnswered = firstTimeFiler !== null && saRegistered !== null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-5 py-20">
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

        {/* Centered as a block on the page; text and buttons inside share a
            left edge rather than each being independently centered. */}
        <div className="relative mx-auto w-full max-w-xl text-left">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome! Is this your first time doing Self Assessment?
          </h1>
          <div className="mt-5">
            <SecondaryYesNo value={firstTimeFiler ?? ""} onSelect={setFirstTimeFiler} />
          </div>

          <h1 className="mt-10 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Have you registered for Self Assessment online?
          </h1>
          <div className="mt-5">
            <SecondaryYesNo value={saRegistered ?? ""} onSelect={setSaRegistered} />
          </div>

          {bothAnswered && (
            <div className="mt-10">
              <button
                type="button"
                onClick={() => router.push("/income-sources")}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-7 py-3.5 text-lg font-bold text-[var(--color-brand-dark)] transition hover:bg-[var(--color-brand-dark)] hover:text-white"
              >
                Continue
                <Icon name="arrow-right" size={20} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
