"use client";

import { create } from "zustand";

/**
 * One shared popup mechanism for every "message from the chat assistant"
 * moment in the flow — the registration-deadline reminder, the trading
 * allowance nudge, and all "Tell me more" info content. The popup itself is
 * rendered by LiveChatPill, anchored to the pill, so it always reads as
 * coming from the chat assistant rather than as a generic modal.
 */
export interface ChatPopupContent {
  /** Optional bold heading above the message */
  title?: string;
  message: string;
  /** Optional example/illustration shown under the message */
  image?: { src: string; alt?: string };
  /** Optional trailing link rendered under the message */
  link?: { label: string; href: string };
}

interface ChatPopupState {
  content: ChatPopupContent | null;
  open: (content: ChatPopupContent) => void;
  dismiss: () => void;
}

export const useChatPopup = create<ChatPopupState>((set) => ({
  content: null,
  open: (content) => set({ content }),
  dismiss: () => set({ content: null }),
}));
