"use client";

import { create } from "zustand";

export interface ChecklistItemState {
  added: boolean;
  value: string;
}

export type UtrAnswer = "Yes" | "No" | "Not sure";

interface AppState {
  reasons: string[];
  incomeSources: string[];
  answers: Record<string, string>;
  checklist: Record<string, ChecklistItemState>;
  categoryIndex: number;
  questionIndex: number;
  utr: UtrAnswer | null;
  mtdBannerDismissed: boolean;

  toggleReason: (id: string) => void;
  toggleIncomeSource: (id: string) => void;
  setAnswer: (key: string, value: string) => void;
  setChecklistItem: (key: string, added: boolean, value: string) => void;
  setCategoryIndex: (index: number) => void;
  setQuestionIndex: (index: number) => void;
  setUtr: (value: UtrAnswer) => void;
  dismissMtdBanner: () => void;
  resetWizard: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  reasons: [],
  incomeSources: [],
  answers: {},
  checklist: {},
  categoryIndex: 0,
  questionIndex: 0,
  utr: null,
  mtdBannerDismissed: false,

  toggleReason: (id) =>
    set((state) => ({
      reasons: state.reasons.includes(id)
        ? state.reasons.filter((r) => r !== id)
        : [...state.reasons, id],
    })),

  toggleIncomeSource: (id) =>
    set((state) => ({
      incomeSources: state.incomeSources.includes(id)
        ? state.incomeSources.filter((s) => s !== id)
        : [...state.incomeSources, id],
    })),

  setAnswer: (key, value) =>
    set((state) => ({ answers: { ...state.answers, [key]: value } })),

  setChecklistItem: (key, added, value) =>
    set((state) => ({
      checklist: { ...state.checklist, [key]: { added, value } },
    })),

  setCategoryIndex: (index) => set({ categoryIndex: index }),
  setQuestionIndex: (index) => set({ questionIndex: index }),
  setUtr: (value) => set({ utr: value }),
  dismissMtdBanner: () => set({ mtdBannerDismissed: true }),

  resetWizard: () =>
    set({
      reasons: [],
      incomeSources: [],
      answers: {},
      checklist: {},
      categoryIndex: 0,
      questionIndex: 0,
      utr: null,
      mtdBannerDismissed: false,
    }),
}));
