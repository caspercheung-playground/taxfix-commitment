"use client";

import { useState } from "react";
import type { Category, Question } from "@/lib/types";
import type { ChecklistItemState } from "@/lib/store";
import { Icon } from "@/components/icons";
import { Modal } from "@/components/Modal";

function ContextNote({ note }: { note?: string }) {
  if (!note) return null;
  return (
    <div className="mb-4 rounded-2xl bg-[var(--color-cream)] p-5 text-[var(--color-muted)]">{note}</div>
  );
}

function QuestionShell({
  question,
  children,
}: {
  question: Question;
  children: React.ReactNode;
}) {
  return (
    <>
      <ContextNote note={question.contextNote} />
      <div className="rounded-3xl bg-[var(--color-brand-soft)] p-6 sm:p-8">
        <h3 className="text-xl font-extrabold leading-snug sm:text-2xl">{question.prompt}</h3>
        {question.helper && <p className="mt-2 text-[var(--color-muted)]">{question.helper}</p>}
      </div>
      <div className="mt-6 px-1">{children}</div>
    </>
  );
}

function NextButton({ disabled, onClick, label = "Next" }: { disabled?: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-6 rounded-lg bg-[var(--color-brand)] px-6 py-3 font-bold text-[var(--color-brand-dark)] transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-brand-dark)] hover:text-white"
    >
      {label}
    </button>
  );
}

export function QuestionCard({
  category,
  question,
  rawValue,
  checklistState,
  onConfirm,
  onChecklistItemChange,
}: {
  category: Category;
  question: Question;
  rawValue: string | undefined;
  checklistState: Record<string, ChecklistItemState>;
  onConfirm: (value: string) => void;
  onChecklistItemChange: (itemId: string, added: boolean, value: string) => void;
}) {
  if (question.type === "text") {
    return <TextQuestionCard question={question} rawValue={rawValue} onConfirm={onConfirm} />;
  }
  if (question.type === "currency") {
    return <CurrencyQuestionCard question={question} rawValue={rawValue} onConfirm={onConfirm} />;
  }
  if (question.type === "yes-no") {
    return (
      <ChoiceQuestionCard
        question={question}
        options={["Yes", "No"]}
        rawValue={rawValue}
        onConfirm={onConfirm}
      />
    );
  }
  if (question.type === "choice") {
    return (
      <ChoiceQuestionCard
        question={question}
        options={question.options}
        rawValue={rawValue}
        onConfirm={onConfirm}
      />
    );
  }
  if (question.type === "pills-multi") {
    return <PillsQuestionCard question={question} rawValue={rawValue} onConfirm={onConfirm} />;
  }
  return (
    <ChecklistQuestionCard
      category={category}
      question={question}
      checklistState={checklistState}
      onChecklistItemChange={onChecklistItemChange}
      onConfirm={onConfirm}
    />
  );
}

function TextQuestionCard({
  question,
  rawValue,
  onConfirm,
}: {
  question: Extract<Question, { type: "text" }>;
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
}) {
  const [value, setValue] = useState(rawValue ?? "");
  return (
    <QuestionShell question={question}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={question.placeholder}
        className="w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-brand)]"
      />
      <div>
        <NextButton label="Confirm" disabled={!value.trim()} onClick={() => onConfirm(value.trim())} />
      </div>
    </QuestionShell>
  );
}

function CurrencyQuestionCard({
  question,
  rawValue,
  onConfirm,
}: {
  question: Extract<Question, { type: "currency" }>;
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
}) {
  const [value, setValue] = useState(rawValue && rawValue !== "Not sure" ? rawValue : "");
  // Re-opening a "Not sure" answer would otherwise show an empty field with no
  // trace of the choice, so track it and render the button as selected.
  const notSure = rawValue === "Not sure" && !value.trim();

  return (
    <QuestionShell question={question}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-xl border border-[var(--color-line)]">
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
        {question.notSure && (
          <button
            type="button"
            onClick={() => onConfirm("Not sure")}
            className={`rounded-full px-4 py-3 font-semibold transition ${
              notSure
                ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)]"
                : "bg-[var(--color-brand-soft-2)] text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-soft)]"
            }`}
          >
            Not sure
          </button>
        )}
      </div>
      <div>
        <NextButton disabled={!value.trim()} onClick={() => onConfirm(value.trim())} />
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
}: {
  question: Extract<Question, { type: "yes-no" | "choice" }>;
  options: string[];
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
}) {
  // Selection is held locally and only committed on Next — the flow must not
  // auto-advance the moment an option is clicked.
  const [selected, setSelected] = useState(rawValue ?? "");
  const cards = question.type === "choice" && question.layout === "cards";

  if (cards) {
    const icons = question.type === "choice" ? question.icons : undefined;
    return (
      <QuestionShell question={question}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelected(opt)}
              className={`flex flex-col items-center justify-start gap-3 rounded-2xl p-5 pt-7 text-center transition ${
                selected === opt
                  ? "bg-[var(--color-brand-soft-2)]"
                  : "bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
              }`}
            >
              <Icon name={icons?.[i] ?? "briefcase"} size={26} />
              <span className="text-sm font-semibold leading-snug">{opt}</span>
            </button>
          ))}
        </div>
        <div>
          <NextButton disabled={!selected} onClick={() => onConfirm(selected)} />
        </div>
      </QuestionShell>
    );
  }

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
              className={`flex items-center gap-2.5 rounded-full border px-5 py-3 font-bold transition ${
                active
                  ? "border-[var(--color-brand)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                  : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
              }`}
            >
              {/* Single-choice options always carry a selector */}
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-[var(--color-brand-dark)]" : "border-[var(--color-line)] bg-white"
                }`}
              >
                {active && <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand-dark)]" />}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      <div>
        <NextButton disabled={!selected} onClick={() => onConfirm(selected)} />
      </div>
    </QuestionShell>
  );
}

function PillsQuestionCard({
  question,
  rawValue,
  onConfirm,
}: {
  question: Extract<Question, { type: "pills-multi" }>;
  rawValue: string | undefined;
  onConfirm: (value: string) => void;
}) {
  const initial = rawValue ? rawValue.split(", ").filter(Boolean) : [];
  const [selected, setSelected] = useState<string[]>(initial);
  const rows = question.layout === "rows";

  function toggle(opt: string) {
    setSelected((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  }

  if (rows) {
    return (
      <QuestionShell question={question}>
        <div className="space-y-3">
          {question.options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-[var(--color-brand)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                    : "border-transparent bg-[var(--color-cream)] hover:bg-[var(--color-cream-border)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    active
                      ? "bg-[var(--color-brand-dark)] text-white"
                      : "border-2 border-[var(--color-line)] bg-white"
                  }`}
                >
                  {active && <Icon name="check" size={16} />}
                </span>
                <span className="min-w-0 flex-1 font-bold">{opt}</span>
              </button>
            );
          })}
        </div>

        <div>
          {/* This is the last question in the flow, so an empty selection must
              still be able to reach the recommendation. */}
          <NextButton
            label={selected.length === 0 ? "None of these apply" : "Next"}
            onClick={() => onConfirm(selected.join(", "))}
          />
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
              className={`rounded-full px-5 py-3 font-bold transition ${
                active ? "bg-[var(--color-brand)] text-[var(--color-brand-dark)]" : "bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-cream-border)]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div>
        <NextButton disabled={selected.length === 0} onClick={() => onConfirm(selected.join(", "))} />
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
}: {
  category: Category;
  question: Extract<Question, { type: "checklist-add" }>;
  checklistState: Record<string, ChecklistItemState>;
  onChecklistItemChange: (itemId: string, added: boolean, value: string) => void;
  onConfirm: (value: string) => void;
}) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [touched, setTouched] = useState(false);
  void category;

  const activeItem = question.items.find((i) => i.id === activeItemId);
  const addedCount = question.items.filter((i) => checklistState[i.id]?.added).length;
  const canContinue = touched || addedCount > 0;

  return (
    <QuestionShell question={question}>
      <div className="space-y-2">
        {question.items.map((item) => {
          const state = checklistState[item.id];
          const added = state?.added;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 ${
                added ? "bg-[var(--color-brand-soft-2)]" : "bg-[var(--color-cream)]"
              }`}
            >
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
              <button
                type="button"
                onClick={() => {
                  setDraft(state?.value ?? "");
                  setActiveItemId(item.id);
                }}
                className="shrink-0 rounded-full bg-[var(--color-brand-soft-2)] px-4 py-1.5 text-sm font-semibold text-[var(--color-brand-dark)] hover:bg-[var(--color-cream)]"
              >
                {added ? "Edit" : "Add"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setTouched(true)}
          className="text-sm font-semibold text-[var(--color-muted)] underline underline-offset-2 hover:text-[var(--color-ink)]"
        >
          None of these apply
        </button>
      </div>

      <div>
        <NextButton
          disabled={!canContinue}
          onClick={() => onConfirm(addedCount > 0 ? `${addedCount} selected` : "None")}
        />
      </div>

      <Modal open={!!activeItem} title={activeItem?.label ?? ""} onClose={() => setActiveItemId(null)}>
        {activeItem && (
          <>
            <p className="font-medium">{activeItem.subPrompt}</p>
            <div className="mt-4 flex overflow-hidden rounded-xl border border-[var(--color-line)]">
              {activeItem.subType === "currency" && (
                <span className="flex items-center bg-[var(--color-ink)] px-4 py-3 font-bold text-white">£</span>
              )}
              <input
                autoFocus
                type="number"
                inputMode="decimal"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={activeItem.subType === "number" ? "Hours per week" : "0"}
                className="flex-1 px-4 py-3 outline-none"
              />
              {activeItem.subType === "number" && (
                <span className="flex items-center bg-[var(--color-cream)] px-4 py-3 text-sm text-[var(--color-muted)]">
                  hrs/week
                </span>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveItemId(null)}
                className="rounded-full px-4 py-2 font-semibold text-[var(--color-muted)] hover:bg-[var(--color-cream)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!draft.trim()}
                onClick={() => {
                  onChecklistItemChange(activeItem.id, true, draft.trim());
                  setActiveItemId(null);
                }}
                className="rounded-full bg-[var(--color-brand)] px-5 py-2 font-bold text-[var(--color-brand-dark)] transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-brand-dark)] hover:text-white"
              >
                Save
              </button>
            </div>
          </>
        )}
      </Modal>
    </QuestionShell>
  );
}
