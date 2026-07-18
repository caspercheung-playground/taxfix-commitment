/**
 * The floating 3D shapes shared across the flow. Fixed to the viewport (not
 * the page) so screens render the exact same backdrop — navigating between
 * them doesn't shift the imagery. Page content must sit in a `relative z-10`
 * container above it. `dimmed` renders it at 20% opacity, for use behind the
 * split-panel layout where it should read as a subtle texture rather than
 * compete with the panels.
 */
export function HeroBackdrop({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 hidden lg:block ${dimmed ? "opacity-20" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-arrow.png"
        alt=""
        className="absolute left-0 top-[15%] w-[8.44%] max-w-[131px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-percent.png"
        alt=""
        className="absolute right-0 top-[10%] w-[6.56%] max-w-[104px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-coin.png"
        alt=""
        className="absolute bottom-0 left-[5%] w-[9.38%] max-w-[150px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-card.png"
        alt=""
        className="absolute bottom-[8%] right-0 w-[5.63%] max-w-[94px]"
      />
    </div>
  );
}
