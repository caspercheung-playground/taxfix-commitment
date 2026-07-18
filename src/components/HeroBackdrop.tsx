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
        className="absolute left-0 top-[15%] w-[9%] max-w-[140px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-percent.png"
        alt=""
        className="absolute right-0 top-[10%] w-[7%] max-w-[110px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-coin.png"
        alt=""
        className="absolute bottom-0 left-[5%] w-[10%] max-w-[160px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-card.png"
        alt=""
        className="absolute bottom-[8%] right-0 w-[6%] max-w-[100px]"
      />
    </div>
  );
}
