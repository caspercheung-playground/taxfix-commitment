"use client";

import { Icon, type IconName } from "@/components/icons";

export type RailState = "done" | "active" | "locked";

export interface RailItem {
  id: string;
  label: string;
  state: RailState;
  /** Only read for locked steps — done/active derive their glyph from state */
  lockedIcon?: IconName;
  onClick?: () => void;
  /** Indented sub-steps, nestable (e.g. UTR sits inside General & Allowances) */
  children?: RailItem[];
}

const SIZE = { top: 32, sub: 28 } as const;
/** Centre of a top-level circle: row padding (8px) + radius */
const LINE_LEFT = 8 + SIZE.top / 2 - 0.5;

function Row({ item, level }: { item: RailItem; level: "top" | "sub" }) {
  const interactive = !!item.onClick && item.state !== "locked";
  const px = SIZE[level];

  const glyph: IconName =
    item.state === "done"
      ? "check"
      : item.state === "active"
        ? "arrow-right"
        : item.lockedIcon ?? "lock";

  const circle =
    item.state === "done"
      ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)]"
      : item.state === "active"
        ? "border-2 border-[var(--color-ink)] bg-white text-[var(--color-ink)]"
        : "bg-[var(--color-cream)] text-[var(--color-muted)]";

  const label =
    item.state === "locked"
      ? "text-[var(--color-muted)]"
      : item.state === "active"
        ? "text-[var(--color-brand-dark)]"
        : "text-[var(--color-ink)]";

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={item.onClick}
      aria-current={item.state === "active" ? "step" : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-[14px] p-2 text-left transition ${
        item.state === "active" ? "bg-[var(--color-brand-soft-2)]/40" : ""
      } ${interactive ? "cursor-pointer hover:bg-[var(--color-cream)]" : "cursor-default"}`}
    >
      <span
        style={{ width: px, height: px }}
        className={`flex shrink-0 items-center justify-center rounded-full ${circle}`}
      >
        <Icon name={glyph} size={level === "top" ? 15 : 13} />
      </span>
      <span className={`flex-1 text-sm font-semibold ${label}`}>{item.label}</span>
      {interactive && item.state === "done" && (
        // Edit affordance surfaces only on hover, on the right of the row
        <Icon
          name="pencil"
          size={14}
          className="shrink-0 text-[var(--color-brand-dark)] opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
    </button>
  );
}

/** Sub-steps render one indent level per nesting depth */
function Branch({ items }: { items: RailItem[] }) {
  return (
    <ul className="mb-1 flex flex-col gap-1 pl-8 pt-1">
      {items.map((child) => (
        <li key={child.id}>
          <Row item={child} level="sub" />
          {!!child.children?.length && <Branch items={child.children} />}
        </li>
      ))}
    </ul>
  );
}

export function FlowRail({ items, caption }: { items: RailItem[]; caption: string }) {
  return (
    <aside className="w-full shrink-0 rounded-2xl bg-white p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] sm:w-80">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {caption}
      </p>

      <ol className="mt-4">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.id} className="relative">
              {/* Timeline line down to the next top-level step, passing beside any sub-steps */}
              {!isLast && (
                <span
                  aria-hidden
                  // Runs from this circle's bottom edge to the next circle's top edge
                  style={{ left: LINE_LEFT, top: 8 + SIZE.top, bottom: -8 }}
                  className={`absolute w-px ${
                    item.state === "locked" ? "bg-[var(--color-line)]" : "bg-[var(--color-brand)]"
                  }`}
                />
              )}
              <Row item={item} level="top" />
              {!!item.children?.length && <Branch items={item.children} />}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
