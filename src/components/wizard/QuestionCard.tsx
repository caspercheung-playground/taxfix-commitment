"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Category, Question } from "@/lib/types";
import type { ChecklistItemState } from "@/lib/store";
import { Icon } from "@/components/icons";
import { SelectableRow } from "@/components/wizard/SelectableRow";
import { SecondaryYesNo } from "@/components/wizard/SecondaryYesNo";
import { useChatPopup } from "@/lib/chatPopup";
import { decodeDate, decodeYesNoAmount, encodeDate, encodeYesNoAmount } from "@/lib/wizard";

/**
 * Each question type lifts its "what should the primary action do" up to the
 * QuestionCard shell through this controller, so the Back / Continue / Not sure
 * row can live OUTSIDE the animated card and stay visually fixed while the
 * question content above it translates and fades (Typeform-style).
 */
type Controller = {
  canContinue: boolean;
  onContinue: () => void;
  label?: string;
  onNotSure?: () => void;
  notSureLabel?: string;
  notSureActive?: boolean;
};

type Register = (controller: Controller) => void;

// Snappy, ease-out: outgoing card lifts up + fades, incoming rises from below.
const cardVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};
const cardTransition = { duration: 0.22, ease: "easeOut" as const };

function ContextNote({ note }: { note?: string }) {
  if (!note) return null;
  return (
    <div className="mb-4 rounded-2xl bg-[var(--color-cream)] p-5 text-[var(--color-muted)]">{note}</div>
  );
}

/** Green, positive-toned banner — shown once a specific answer is chosen. */
function PositiveBanner({ text }: { text: string }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--color-brand-soft-2)] p-4 text-sm font-semibold text-[var(--color-brand-dark)]">
      <Icon name="check" size={18} className="shrink-0" />
      {text}
    </div>
  );
}

function QuestionShell({
  question,
  children,
}: {
  question: Question;
  children: React.ReactNode;
}) {
  // "Tell me more" content opens as a chat-pill popup, not a modal.
  const openPopup = useChatPopup((s) => s.open);

  return (
    <>
      <ContextNote note={question.contextNote} />
      <div className="px-1">
        <h3 className="text-xl font-extrabold leading-snug sm:text-2xl">{question.prompt}</h3>
        {question.helper && <p className="mt-2 text-[var(--color-muted)]">{question.helper}</p>}
        {question.infoButton && (
          <button
            type="button"
            onClick={() =>
              openPopup({ title: question.infoButton!.title, message: question.infoButton!.body })
            }
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-brand-dark)] underline underline-offset-2"
          >
            <Icon name="help-circle" size={16} />
            Tell me more
          </button>
        )}
      </div>
      <div className="mt-6 px-1">{children}</div>
    </>
  );
}

/** The green solid check badge used to mark a selected horizontal option. */
function CheckBadge() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-dark)] text-white">
      <Icon name="check" size={12} />
    </span>
  );
}

/**
 * The one fixed action row for every question. It does not animate — only the
 * card content above it does — so Back, Continue and Not sure hold their place
 * across question transitions.
 */
function ActionRow({ controller, isEditing }: { controller: Controller | null; isEditing?: boolean }) {
  return (
    <div className="mt-6 flex items-center gap-3 px-1">
      <button
        type="button"
        disabled={!controller?.canContinue}
        onClick={() => controller?.onContinue()}
        className={`rounded-lg px-6 py-3 font-bold transition ${
          controller?.canContinue
            ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
            : "cursor-not-allowed bg-[var(--color-line)] text-[var(--color-muted)]"
        }`}
      >
        {controller?.label ?? (isEditing ? "Update" : "Continue")}
      </button>
      {controller?.onNotSure && (
        <button
          type="button"
          onClick={controller.onNotSure}
          className={`rounded-lg px-5 py-3 font-semibold transition ${
            controller.notSureActive
              ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]"
              : "bg-[var(--color-brand-soft-2)] text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-soft)]"
          }`}
        >
          {controller.notSureLabel ?? "Not sure"}
        </button>
      )}
    </div>
  );
}

export function QuestionCard({
  category,
  question,
  rawValue,
  checklistState,
  onConfirm,
  onChecklistItemChange,
  isEditing,
}: {
  category: Category;
  question: Question;
  rawValue: string | undefined;
  checklistState: Record<string, ChecklistItemState>;
  onConfirm: (value: string) => void;
  onChecklistItemChange: (itemId: string, added: boolean, value: string) => void;
  isEditing?: boolean;
}) {
  // The shell persists across questions so AnimatePresence can play the
  // enter/exit; each question's controller flows up into the fixed ActionRow.
  const [controller, setController] = useState<Controller | null>(null);

  function renderBody() {
    if (question.type === "text") {
      return <TextQuestionCard question={question} rawValue={rawValue} onConfirm={onConfirm} register={setController} />;
    }
    if (question.type === "currency") {
      return <CurrencyQuestionCard question={question} rawValue={rawValue} onConfirm={onConfirm} register={setController} />;
    }
    if (question.type === "yes-no") {
      return (
        <ChoiceQuestionCard question={question} options={["Yes", "No"]} rawValue={rawValue} onConfirm={onConfirm} register={setController} />
      );
    }
    if (question.type === "yes-no-amount") {
      return <YesNoAmountQuestionCard question={question} rawValue={rawValue} onConfirm={onConfirm} register={setController} />;
    }
    if (question.type === "choice") {
      return (
        <ChoiceQuestionCard question={question} options={question.options} rawValue={rawValue} onConfirm={onConfirm} register={setController} />
      );
    }
    if (question.type === "pills-multi") {
      return <PillsQuestionCard question={question} rawValue={rawValue} onConfirm={onConfirm} register={setController} />;
    }
    if (question.type === "date") {
      return <DateQuestionCard question={question} rawValue={rawValue} onConfirm={onConfirm} register={setController} />;
    }
    return (
      <ChecklistQuestionCard
        category={category}
        question={question}
        checklistState={checklistState}
        onChecklistItemChange={onChecklistItemChange}
        onConfirm={onConfirm}
        register={setController}
      />
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`${category.id}.${question.id}`}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={cardTransition}
        >
          {renderBody()}
        </motion.div>
      </AnimatePresence>
      <ActionRow controller={controller} isEditing={isEditing} />
    </div>
  );
}

function TextQuestionCard({
  question,
  rawValue,
  onConfirm,
  register,
}: {
  question: Extract<Question, { type: "text" }>;
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
  register: Register;
}) {
  const [value, setValue] = useState(rawValue ?? "");

  useEffect(() => {
    register({ canContinue: !!value.trim(), onContinue: () => onConfirm(value.trim()) });
  }, [value, register, onConfirm]);

  return (
    <QuestionShell question={question}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={question.placeholder}
        className="w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)]"
      />
    </QuestionShell>
  );
}

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 16 }, (_, i) => String(CURRENT_YEAR - i));

function DateSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)]"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function DateQuestionCard({
  question,
  rawValue,
  onConfirm,
  register,
}: {
  question: Extract<Question, { type: "date" }>;
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
  register: Register;
}) {
  const initial = decodeDate(rawValue ?? question.defaultValue);
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);
  const canContinue = !!day && !!month && !!year;

  useEffect(() => {
    register({ canContinue, onContinue: () => onConfirm(encodeDate(day, month, year)) });
  }, [day, month, year, canContinue, register, onConfirm]);

  return (
    <QuestionShell question={question}>
      <div className="flex flex-wrap gap-3">
        <DateSelect
          value={day}
          onChange={setDay}
          placeholder="Day"
          options={DAYS.map((d) => ({ value: d.padStart(2, "0"), label: d }))}
        />
        <DateSelect
          value={month}
          onChange={setMonth}
          placeholder="Month"
          options={MONTHS.map((m, i) => ({ value: String(i + 1).padStart(2, "0"), label: m }))}
        />
        <DateSelect
          value={year}
          onChange={setYear}
          placeholder="Year"
          options={YEARS.map((y) => ({ value: y, label: y }))}
        />
      </div>
    </QuestionShell>
  );
}

function CurrencyQuestionCard({
  question,
  rawValue,
  onConfirm,
  register,
}: {
  question: Extract<Question, { type: "currency" }>;
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
  register: Register;
}) {
  const [value, setValue] = useState(rawValue && rawValue !== "Not sure" ? rawValue : "");
  // Re-opening a "Not sure" answer would otherwise show an empty field with no
  // trace of the choice, so track it and render the button as selected.
  const notSure = rawValue === "Not sure" && !value.trim();

  useEffect(() => {
    register({
      canContinue: !!value.trim(),
      onContinue: () => onConfirm(value.trim()),
      onNotSure: question.notSure ? () => onConfirm("Not sure") : undefined,
      notSureActive: notSure,
    });
  }, [value, notSure, question.notSure, register, onConfirm]);

  return (
    <QuestionShell question={question}>
      <div className="flex overflow-hidden rounded-xl border border-[var(--color-line)] w-fit">
        <span className="flex items-center bg-[var(--color-ink)] px-4 py-3 font-bold text-white">£</span>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-40 bg-white px-4 py-3 outline-none"
          placeholder="0"
        />
      </div>
    </QuestionShell>
  );
}

/** Backs both "yes-no" (options fixed to Yes/No) and "choice" (options from the question) */
function ChoiceQuestionCard({
  question,
  options,
  rawValue,
  onConfirm,
  register,
}: {
  question: Extract<Question, { type: "yes-no" | "choice" }>;
  options: string[];
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
  register: Register;
}) {
  // Selection is held locally and only committed on Continue — the flow must
  // not auto-advance the moment an option is clicked.
  const [selected, setSelected] = useState(rawValue ?? "");
  const layout = question.type === "choice" ? question.layout : undefined;
  const rows = layout === "rows";
  const cards = layout === "cards";
  const ctaLabel = question.type === "choice" ? question.ctaLabel : undefined;
  const notSureLabel = question.type === "choice" ? question.notSureLabel : undefined;

  useEffect(() => {
    register({
      canContinue: !!selected,
      onContinue: () => onConfirm(selected),
      label: ctaLabel,
      notSureLabel,
      onNotSure: notSureLabel ? () => onConfirm(notSureLabel) : undefined,
    });
  }, [selected, ctaLabel, notSureLabel, register, onConfirm]);

  const banner = selected && question.answerBanner?.[selected];

  if (cards) {
    const icons = question.type === "choice" ? question.icons : undefined;
    return (
      <QuestionShell question={question}>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const active = selected === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSelected(opt)}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center font-semibold transition ${
                  active
                    ? "border-[var(--color-brand-dark)] bg-[var(--color-brand-soft-2)]"
                    : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
                }`}
              >
                {icons?.[i] && (
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      active
                        ? "bg-[var(--color-brand-dark)] text-white"
                        : "bg-white text-[var(--color-ink)]"
                    }`}
                  >
                    <Icon name={icons[i]} size={20} />
                  </span>
                )}
                <span className="text-sm leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>
        {banner && <PositiveBanner text={banner} />}
      </QuestionShell>
    );
  }

  if (rows) {
    const icons = question.type === "choice" ? question.icons : undefined;
    return (
      <QuestionShell question={question}>
        <div className="space-y-3">
          {options.map((opt, i) => (
            <SelectableRow
              key={opt}
              mode="radio"
              selected={selected === opt}
              icon={icons?.[i]}
              label={opt}
              onClick={() => setSelected(opt)}
            />
          ))}
        </div>
        {banner && <PositiveBanner text={banner} />}
      </QuestionShell>
    );
  }

  // No inline selector on these — the button's own fill/border is the state:
  // grey at rest, white with a green border and soft shadow once selected.
  return (
    <QuestionShell question={question}>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setSelected(opt)}
              className={`rounded-lg border px-7 py-3 font-bold transition ${
                active
                  ? "border-[var(--color-brand-dark)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                  : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {banner && <PositiveBanner text={banner} />}
    </QuestionShell>
  );
}

function YesNoAmountQuestionCard({
  question,
  rawValue,
  onConfirm,
  register,
}: {
  question: Extract<Question, { type: "yes-no-amount" }>;
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
  register: Register;
}) {
  const initial = decodeYesNoAmount(rawValue);
  const [yn, setYn] = useState<"Yes" | "No" | "">(initial.yn ?? "");
  const [amount, setAmount] = useState(initial.amount);
  const canContinue = yn === "No" || (yn === "Yes" && amount.trim() !== "");

  useEffect(() => {
    register({
      canContinue,
      onContinue: () => onConfirm(encodeYesNoAmount(yn as "Yes" | "No", amount.trim())),
    });
  }, [yn, amount, canContinue, register, onConfirm]);

  return (
    <QuestionShell question={question}>
      <SecondaryYesNo value={yn} onSelect={setYn} />
      {yn === "Yes" && (
        <div className="mt-4">
          <p className="mb-2 font-semibold">{question.amountPrompt}</p>
          <div className="flex w-fit overflow-hidden rounded-xl border border-[var(--color-line)]">
            <span className="flex items-center bg-[var(--color-ink)] px-4 py-3 font-bold text-white">£</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-40 bg-white px-4 py-3 outline-none"
              placeholder="0"
            />
          </div>
        </div>
      )}
    </QuestionShell>
  );
}

function PillsQuestionCard({
  question,
  rawValue,
  onConfirm,
  register,
}: {
  question: Extract<Question, { type: "pills-multi" }>;
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
  register: Register;
}) {
  const initial = rawValue ? rawValue.split(", ").filter(Boolean) : [];
  const [selected, setSelected] = useState<string[]>(initial);
  const rows = question.layout === "rows";

  function toggle(opt: string) {
    setSelected((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  }

  // A multi-select is a valid "none of the above" answer on its own, so the
  // CTA is always enabled — its label just says which action it performs.
  const ctaLabel = selected.length === 0 ? "None of this applies" : "Continue";

  useEffect(() => {
    register({ canContinue: true, onContinue: () => onConfirm(selected.join(", ")), label: ctaLabel });
  }, [selected, ctaLabel, register, onConfirm]);

  if (rows) {
    return (
      <QuestionShell question={question}>
        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <SelectableRow
              key={opt}
              mode="checkbox"
              selected={selected.includes(opt)}
              icon={question.icons?.[i]}
              label={opt}
              onClick={() => toggle(opt)}
            />
          ))}
        </div>
      </QuestionShell>
    );
  }

  return (
    <QuestionShell question={question}>
      <div className="flex flex-wrap gap-3">
        {question.options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`flex items-center gap-2.5 rounded-full border px-5 py-3 font-bold transition ${
                active
                  ? "border-[var(--color-brand)] bg-white text-[var(--color-ink)] shadow-md"
                  : "border-transparent bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-cream-border)]"
              }`}
            >
              {active && <CheckBadge />}
              {opt}
            </button>
          );
        })}
      </div>
    </QuestionShell>
  );
}

function ChecklistQuestionCard({
  category,
  question,
  checklistState,
  onChecklistItemChange,
  onConfirm,
  register,
}: {
  category: Category;
  question: Extract<Question, { type: "checklist-add" }>;
  checklistState: Record<string, ChecklistItemState>;
  onChecklistItemChange: (itemId: string, added: boolean, value: string) => void;
  onConfirm: (value: string) => void;
  register: Register;
}) {
  void category;

  // Per-item answer to "Do you have your invoices/expense documents/receipts?"
  // — only asked on items flagged receiptsFollowUp, once an amount is entered.
  const [receipts, setReceipts] = useState<Record<string, "Yes" | "No" | "">>({});
  const openPopup = useChatPopup((s) => s.open);
  const addedCount = question.items.filter((i) => checklistState[i.id]?.added).length;
  // A multi-select is a valid "none of the above" answer on its own, so the
  // CTA is always enabled — its label just says which action it performs.
  const ctaLabel = addedCount === 0 ? "None of this applies" : "Continue";

  useEffect(() => {
    register({
      canContinue: true,
      onContinue: () => onConfirm(addedCount > 0 ? `${addedCount} selected` : "None"),
      label: ctaLabel,
    });
  }, [addedCount, ctaLabel, register, onConfirm]);

  return (
    <QuestionShell question={question}>
      <div className="space-y-2">
        {question.items.map((item) => {
          const state = checklistState[item.id];
          const added = state?.added;
          return (
            <div
              key={item.id}
              className={`rounded-xl px-4 py-3.5 ${
                added ? "bg-[var(--color-brand-soft-2)]" : "bg-[var(--color-cream)]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {added && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-dark)] text-white">
                      <Icon name="check" size={12} />
                    </span>
                  )}
                  <span className="font-medium">
                    {item.label}
                    {added && state?.value && (
                      <span className="text-[var(--color-muted)]"> — {state.value}</span>
                    )}
                  </span>
                </div>
                {added ? (
                  <button
                    type="button"
                    onClick={() => onChecklistItemChange(item.id, false, "")}
                    className="shrink-0 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChecklistItemChange(item.id, true, "")}
                    className="shrink-0 rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
                  >
                    Add
                  </button>
                )}
              </div>

              {/* Sub-question renders inline beneath the row — stays visible
                  while added, even when another item is selected. */}
              {added && (
                <div className="mt-3 bg-white p-4 text-left">
                  <p className="font-medium">{item.subPrompt}</p>
                  <div className="mt-3 flex w-fit overflow-hidden rounded-xl border border-[var(--color-line)]">
                    {item.subType === "currency" && (
                      <span className="flex items-center bg-[var(--color-ink)] px-4 py-3 font-bold text-white">
                        £
                      </span>
                    )}
                    <input
                      type="number"
                      inputMode="decimal"
                      value={state?.value ?? ""}
                      onChange={(e) => onChecklistItemChange(item.id, true, e.target.value)}
                      placeholder={item.subType === "number" ? "Hours per week" : "0"}
                      className="w-40 px-4 py-3 outline-none"
                    />
                    {item.subType === "number" && (
                      <span className="flex items-center bg-[var(--color-cream)] px-4 py-3 text-sm text-[var(--color-muted)]">
                        hrs/week
                      </span>
                    )}
                  </div>

                  {/* Receipts follow-up — appears once an amount is entered;
                      answering "No" triggers the trading allowance chat popup. */}
                  {item.receiptsFollowUp && !!state?.value?.trim() && (
                    <div className="mt-4">
                      <p className="font-medium">
                        Do you have your invoices/expense documents/receipts?
                      </p>
                      <div className="mt-3">
                        <SecondaryYesNo
                          value={receipts[item.id] ?? ""}
                          onSelect={(v) => {
                            setReceipts((prev) => ({ ...prev, [item.id]: v }));
                            if (v === "No") {
                              openPopup({
                                message:
                                  "We'll need records of your expenses in order to claim them; if you're unable to provide records you can instead select the trading allowance to claim a £1,000 flat rate — no receipts needed. The Trading Allowance is a tax-free amount worth £1,000 that you can claim if your expenses are under £1,000 or if you don't have records of your expenses.",
                                link: {
                                  label: "Find out more here",
                                  href: "https://taxfix.com/en-uk/glossary/trading-allowance/",
                                },
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </QuestionShell>
  );
}
