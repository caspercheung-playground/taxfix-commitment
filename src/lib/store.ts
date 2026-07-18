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
  /** "What brings you here" onboarding selections — feed the initial income source pre-selection */
  entryReasons: string[];
  incomeSources: string[];
  answers: Record<string, string>;
  checklist: Record<string, ChecklistItemState>;
  categoryIndex: number;
  questionIndex: number;
  isEditing: boolean;

  setFirstTimeFiler: (value: WelcomeAnswer) => void;
  setSaRegistered: (value: WelcomeAnswer) => void;
  toggleEntryReason: (id: string) => void;
  toggleIncomeSource: (id: string) => void;
  setAnswer: (key: string, value: string) => void;
  setChecklistItem: (key: string, added: boolean, value: string) => void;
  setCategoryIndex: (index: number) => void;
  setQuestionIndex: (index: number) => void;
  setIsEditing: (editing: boolean) => void;
  resetWizard: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  firstTimeFiler: null,
  saRegistered: null,
  entryReasons: [],
  incomeSources: [],
  answers: {},
  checklist: {},
  categoryIndex: 0,
  questionIndex: 0,
  isEditing: false,

  setFirstTimeFiler: (value) => set({ firstTimeFiler: value }),
  setSaRegistered: (value) => set({ saRegistered: value }),

  toggleEntryReason: (id) =>
    set((state) => ({
      entryReasons: state.entryReasons.includes(id)
        ? state.entryReasons.filter((s) => s !== id)
        : [...state.entryReasons, id],
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
  setIsEditing: (editing) => set({ isEditing: editing }),

  resetWizard: () =>
    set({
      firstTimeFiler: null,
      saRegistered: null,
      entryReasons: [],
      incomeSources: [],
      answers: {},
      checklist: {},
      categoryIndex: 0,
      questionIndex: 0,
      isEditing: false,
    }),
}));
