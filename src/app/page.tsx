import Link from "next/link";
import { Header } from "@/components/Header";
import { Icon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cream)] px-4 py-1.5 text-sm font-semibold text-[var(--color-muted)]">
          <Icon name="sparkles" size={16} />
          Prototype build
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Tax returns, without the dread.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-[var(--color-muted)]">
          Tell us what applies to you and we&apos;ll ask the right questions, one step at a time.
        </p>
        <Link
          href="/choose-tax-tool"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-7 py-3.5 text-lg font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
        >
          Get started
          <Icon name="arrow-right" size={20} />
        </Link>
      </main>
    </div>
  );
}
