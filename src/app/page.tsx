import Link from "next/link";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";

export default function Home() {
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
        <div className="relative mx-auto w-full max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Slice 2: The Commitment Moment
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-muted)]">
            First-time UK filers reach the commitment moment without a clear, personalized
            answer to which and why service for me, and what exactly happens after I pay, and
            trust breaks at the highest-intent point in the funnel.
          </p>
          <Link
            href="/choose-tax-tool"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-7 py-3.5 text-lg font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
          >
            Get started
            <Icon name="arrow-right" size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}
