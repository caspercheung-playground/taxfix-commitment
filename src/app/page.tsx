import Link from "next/link";
import { Header } from "@/components/Header";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Icon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <HeroBackdrop />
      <main className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Slice 2: The Commitment Moment
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--color-muted)]">
            First-time UK filers reach the commitment moment without a clear, personalized
            answer to which and why service for me, and what exactly happens after I pay, and
            trust breaks at the highest-intent point in the funnel.
          </p>
          <Link
            href="/income-sources"
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
