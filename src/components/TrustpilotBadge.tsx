import { TRUSTPILOT_URL } from "@/lib/data";

/** Plain Trustpilot text link */
export function TrustpilotBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={TRUSTPILOT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-sm text-[var(--color-ink)] underline underline-offset-2 transition hover:text-[var(--color-brand-dark)] ${className}`}
    >
      4.7 out of 5 from Trustpilot
    </a>
  );
}
