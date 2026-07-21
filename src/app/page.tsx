import Link from "next/link";
import { Header } from "@/components/Header";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Icon } from "@/components/icons";

const KEY_POINTS: { label: string; text: string }[] = [
  {
    label: "Business goal",
    text: "UK team's focus: Growth & conversion at the moments that matter",
  },
  {
    label: "User profile",
    text: "Anxious \u201cDo-It-For-Me\u201d first-timers with high intent, low confidence.",
  },
  {
    label: "Benefit both sides",
    text: "Increase trust for customers, Structured pre-validated profiles for advisors",
  },
  {
    label: "Scope",
    text: "Get Started \u2192 Questionnaire \u2192 Confirm & Pay",
  },
  {
    label: "Out of scope",
    text: "Discovery check, post-payment retention/activation, other income flows",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <HeroBackdrop />
      <main className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-5 py-16">
        <div className="w-fit text-left">
          <h1 className="whitespace-nowrap text-4xl font-extrabold tracking-tight sm:text-5xl">
            The Commitment Moment
          </h1>

          <ul className="mt-10 space-y-8">
            {KEY_POINTS.map((point) => (
              <li key={point.label}>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">
                  {point.label}
                </p>
                <p className="mt-2 text-[var(--color-muted)]">
                  {point.text}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href="/choose-tax-tool"
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-7 py-3.5 text-lg font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
          >
            Get started
            <Icon name="arrow-right" size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}
