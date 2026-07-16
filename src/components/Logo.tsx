import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex select-none items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/taxfix-logo.svg" alt="Taxfix" width={100} height={25} className="h-6 w-auto sm:h-7" />
    </Link>
  );
}
