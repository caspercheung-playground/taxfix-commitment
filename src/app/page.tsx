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
          <p className="mx-auto mt-4 max-w-3xl text-lg text-[var(--color-muted)] text-balance">
            This demo is designed for first-time UK filers with strong intention but without a
            clear answer to which plan is for me, why, or what happens after they pay.
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
