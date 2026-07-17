"use client";

import { create } from "zustand";
import type { WelcomeAnswer } from "./types";

export interface ChecklistItemState {
  added: boolean;
  value: string;
}

interface AppState {
  /** Welcome screen: "Is this your first time doing Self Assessment?" */
  firstTimeFiler: WelcomeAnswer | null;
  /**
   * Welcome screen: "Have you registered for Self Assessment online?"
   * The single source of truth for UTR status — "No" means
   * not-yet-registered/no UTR everywhere downstream.
   */
  saRegistered: WelcomeAnswer | null;
  incomeSources: string[];
  answers: Record<string, string>;
  checklist: Record<string, ChecklistItemState>;
  categoryIndex: number;
  questionIndex: number;

  setFirstTimeFiler: (value: WelcomeAnswer) => void;
  setSaRegistered: (value: WelcomeAnswer) => void;
  toggleIncomeSource: (id: string) => void;
  setAnswer: (key: string, value: string) => void;
  setChecklistItem: (key: string, added: boolean, value: string) => void;
  setCategoryIndex: (index: number) => void;
  setQuestionIndex: (index: number) => void;
  resetWizard: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  firstTimeFiler: null,
  saRegistered: null,
  incomeSources: [],
  answers: {},
  checklist: {},
  categoryIndex: 0,
  questionIndex: 0,

  setFirstTimeFiler: (value) => set({ firstTimeFiler: value }),
  setSaRegistered: (value) => set({ saRegistered: value }),

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

  resetWizard: () =>
    set({
      firstTimeFiler: null,
      saRegistered: null,
      incomeSources: [],
      answers: {},
      checklist: {},
      categoryIndex: 0,
      questionIndex: 0,
    }),
}));
