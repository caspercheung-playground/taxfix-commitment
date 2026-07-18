/**
 * The floating 3D shapes shared by the "Get Started" screen and the income
 * selection screen. Fixed to the viewport (not the page) so the two screens
 * render the exact same backdrop — navigating between them doesn't shift the
 * imagery. Page content must sit in a `relative z-10` container above it.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-arrow.png"
        alt=""
        className="absolute left-0 top-[15%] w-[13.5%] max-w-[210px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-percent.png"
        alt=""
        className="absolute right-0 top-[10%] w-[10.5%] max-w-[165px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-coin.png"
        alt=""
        className="absolute bottom-0 left-[5%] w-[15%] max-w-[240px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-card.png"
        alt=""
        className="absolute bottom-[8%] right-0 w-[9%] max-w-[150px]"
      />
    </div>
  );
}
