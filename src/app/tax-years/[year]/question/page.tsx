"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/icons";
import { LiveChatPill } from "@/components/LiveChatPill";
import { Sidebar } from "@/components/wizard/Sidebar";
import { QuestionCard } from "@/components/wizard/QuestionCard";
import { CategoryComplete } from "@/components/wizard/CategoryComplete";
import { categories, TAX_YEAR_LABEL } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { answerKey, checklistItemKey, getVisibleQuestions, pseudoUuid } from "@/lib/wizard";

export default function QuestionWizardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const incomeSources = useAppStore((s) => s.incomeSources);
  const answers = useAppStore((s) => s.answers);
  const checklist = useAppStore((s) => s.checklist);
  const categoryIndex = useAppStore((s) => s.categoryIndex);
  const questionIndex = useAppStore((s) => s.questionIndex);
  const setAnswer = useAppStore((s) => s.setAnswer);
  const setChecklistItem = useAppStore((s) => s.setChecklistItem);
  const setCategoryIndex = useAppStore((s) => s.setCategoryIndex);
  const setQuestionIndex = useAppStore((s) => s.setQuestionIndex);

  const activeCategories = useMemo(
    () => categories.filter((c) => !c.incomeSourceId || incomeSources.includes(c.incomeSourceId)),
    [incomeSources]
  );

  const safeCategoryIndex = Math.min(categoryIndex, Math.max(activeCategories.length - 1, 0));
  const category = activeCategories[safeCategoryIndex];
  const visibleQuestions = useMemo(
    () => (category ? getVisibleQuestions(category, answers) : []),
    [category, answers]
  );
  const isComplete = category ? questionIndex >= visibleQuestions.length : false;
  const currentQuestion = !isComplete ? visibleQuestions[questionIndex] : undefined;
  const nextCategory = activeCategories[safeCategoryIndex + 1] ?? null;

  useEffect(() => {
    if (!category) return;
    const sectionId = pseudoUuid(category.id);
    const taskId = pseudoUuid(currentQuestion ? `${category.id}.${currentQuestion.id}` : `${category.id}.done`);
    window.history.replaceState(null, "", `${pathname}?sectionId=${sectionId}&taskId=${taskId}`);
  }, [category, currentQuestion, pathname]);

  const totalQuestions = activeCategories.reduce((sum, c) => sum + c.questions.length, 0);
  const completedQuestions =
    activeCategories.slice(0, safeCategoryIndex).reduce((sum, c) => sum + c.questions.length, 0) +
    Math.min(questionIndex, visibleQuestions.length);
  const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  function goBack() {
    if (!category) return;
    if (isComplete) {
      setQuestionIndex(Math.max(visibleQuestions.length - 1, 0));
      return;
    }
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      return;
    }
    if (safeCategoryIndex > 0) {
      setCategoryIndex(safeCategoryIndex - 1);
      const prevCategory = activeCategories[safeCategoryIndex - 1];
      setQuestionIndex(getVisibleQuestions(prevCategory, answers).length);
      return;
    }
    router.push("/income-sources");
  }

  function handleConfirm(value: string) {
    if (!category || !currentQuestion) return;
    setAnswer(answerKey(category.id, currentQuestion.id), value);
    setQuestionIndex(questionIndex + 1);
  }

  function handleChecklistItemChange(itemId: string, added: boolean, value: string) {
    if (!category || !currentQuestion) return;
    setChecklistItem(checklistItemKey(category.id, currentQuestion.id, itemId), added, value);
  }

  function handleContinueFromComplete() {
    if (nextCategory) {
      setCategoryIndex(safeCategoryIndex + 1);
      setQuestionIndex(0);
    } else {
      router.push("/recommendation");
    }
  }

  // The always-on "general" category means activeCategories is never empty, so
  // this has to key off the income sources themselves.
  if (incomeSources.length === 0 || !category) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-5 py-20 text-center">
          <h1 className="text-2xl font-extrabold">Nothing to answer yet</h1>
          <p className="text-[var(--color-muted)]">
            Head back and pick at least one income source so we know what to ask you.
          </p>
          <Link
            href="/income-sources"
            className="rounded-lg bg-[var(--color-brand)] px-6 py-3 font-bold text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-dark)] hover:text-white"
          >
            Choose income sources
          </Link>
        </main>
      </div>
    );
  }

  const categoryAnswersForChecklist =
    currentQuestion?.type === "checklist-add"
      ? Object.fromEntries(
          currentQuestion.items.map((item) => [
            item.id,
            checklist[checklistItemKey(category.id, currentQuestion.id, item.id)] ?? { added: false, value: "" },
          ])
        )
      : {};

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header progress={progress} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Tax Year {TAX_YEAR_LABEL}
            </span>
          </div>
          <LiveChatPill />
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <Icon name="arrow-left" size={16} />
            Previous session
          </button>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          <Sidebar
            category={category}
            visibleQuestions={visibleQuestions}
            currentIndex={questionIndex}
            isComplete={isComplete}
            answers={answers}
            checklist={checklist}
            onEdit={(i) => setQuestionIndex(i)}
          />

          <div className="min-w-0 flex-1">
            {isComplete ? (
              <CategoryComplete
                heading={category.doneHeading}
                sub={category.doneSub}
                nextCategory={nextCategory}
                onContinue={handleContinueFromComplete}
              />
            ) : currentQuestion ? (
              <QuestionCard
                key={`${category.id}.${currentQuestion.id}`}
                category={category}
                question={currentQuestion}
                rawValue={answers[answerKey(category.id, currentQuestion.id)]}
                checklistState={categoryAnswersForChecklist}
                onConfirm={handleConfirm}
                onChecklistItemChange={handleChecklistItemChange}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
