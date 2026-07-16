import { Logo } from "./Logo";
import { Icon } from "./icons";

export function Header({ progress }: { progress?: number }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[var(--color-line)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-[var(--color-muted)] hover:bg-[var(--color-cream)]"
          >
            <Icon name="globe" size={16} />
            English
            <Icon name="chevron-down" size={14} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-[var(--color-muted)] hover:bg-[var(--color-cream)]"
          >
            <Icon name="user" size={16} />
            Account
            <Icon name="chevron-down" size={14} />
          </button>
        </div>
      </div>
      {typeof progress === "number" && (
        <div className="h-[3px] w-full bg-[var(--color-line)]">
          <div
            className="h-full bg-[var(--color-brand)] transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </header>
  );
}
