import { Icon } from "./icons";

/** Light persistent strip reminding users of the Self Assessment registration deadline */
export function UrgencyStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-[#f0e4bd] bg-[#fdf6e0] px-4 py-2 text-sm font-medium text-[#6e5a17] ${className}`}
    >
      <Icon name="clock" size={15} className="shrink-0" />
      Register for Self Assessment by 5 October to avoid delays
    </div>
  );
}
